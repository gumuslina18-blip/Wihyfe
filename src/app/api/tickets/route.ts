import { NextRequest, NextResponse } from 'next/server';
import { serverStore, saveStore, reloadStore } from '@/lib/serverStore';
import { AdminTicket } from '@/config/admin';
import { verifyAdminSession, verifyUserSession } from '@/lib/adminAuth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    reloadStore();
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get('ticketId');
    const userId = searchParams.get('userId');
    const userName = searchParams.get('userName');

    const adminAuth = await verifyAdminSession(request);

    const sessionCookie = request.cookies.get('wisp_session');
    const verifiedSession = sessionCookie?.value ? verifyUserSession(sessionCookie.value) : null;

    let list = Array.isArray(serverStore.tickets) ? [...serverStore.tickets] : [];

    // If requesting a specific ticket:
    if (ticketId) {
      const found = list.find((t) => t.id === ticketId);
      if (!found) {
        return NextResponse.json({ success: false, error: 'Talep bulunamadı' }, { status: 404 });
      }
      // Only admin or the ticket owner can view it
      if (!adminAuth.authorized && verifiedSession?.id !== found.customerDiscordId) {
        return NextResponse.json({ success: false, error: 'Bu talebi görüntüleme yetkiniz yok.' }, { status: 403 });
      }
      return NextResponse.json({ success: true, ticket: found });
    }

    // If not admin, restrict strictly to the user's own tickets!
    if (!adminAuth.authorized) {
      const activeId = verifiedSession?.id || userId;
      if (!activeId) {
        return NextResponse.json({ success: true, tickets: [] });
      }
      list = list.filter((t) => t.customerDiscordId === activeId);
      return NextResponse.json({ success: true, tickets: list });
    }

    // Admin: can filter or see all
    if (userId || userName) {
      list = list.filter((t) => {
        const matchId = userId && t.customerDiscordId === userId;
        const matchName = userName && t.customerName.toLowerCase() === userName.toLowerCase();
        return matchId || matchName;
      });
    }

    return NextResponse.json({
      success: true,
      tickets: list,
    });
  } catch (err: any) {
    console.error('Error fetching tickets:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, category, priority, message, customerName, customerDiscordId } = body;

    if (!subject || !message) {
      return NextResponse.json({ success: false, error: 'Konusu ve mesaj alanı zorunludur.' }, { status: 400 });
    }

    const sessionCookie = request.cookies.get('wisp_session');
    const verifiedSession = sessionCookie?.value ? verifyUserSession(sessionCookie.value) : null;

    reloadStore();

    const tckId = `TCK-${Math.floor(10000 + Math.random() * 90000)}`;
    const now = new Date();
    const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const finalUserId = verifiedSession?.id || customerDiscordId || '';
    const finalUserName = verifiedSession?.username || customerName || 'Kullanıcı';

    const newTicket: AdminTicket = {
      id: tckId,
      customerName: finalUserName,
      customerDiscordId: finalUserId,
      subject: subject.trim(),
      category: category || 'Teknik Sorun',
      status: 'open',
      priority: priority || 'medium',
      createdAt: dateStamp,
      updatedAt: dateStamp,
      lastReplyBy: finalUserName,
      messages: [
        {
          sender: finalUserName,
          isStaff: false,
          text: message.trim(),
          timestamp: dateStamp,
        },
      ],
    };

    if (!Array.isArray(serverStore.tickets)) {
      serverStore.tickets = [];
    }
    serverStore.tickets.unshift(newTicket);

    // Audit log
    serverStore.logs.unshift({
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: dateStamp,
      staffName: 'Destek Sistemi',
      action: `Yeni Destek Talebi (${tckId})`,
      details: `${finalUserName} - ${newTicket.category}: ${newTicket.subject}`,
      type: 'ticket',
    });

    saveStore();

    return NextResponse.json({
      success: true,
      ticket: newTicket,
    });
  } catch (err: any) {
    console.error('Error creating ticket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { ticketId, action } = body; // action: 'reply' | 'status' | 'delete'

    if (!ticketId || !action) {
      return NextResponse.json({ success: false, error: 'Eksik parametreler.' }, { status: 400 });
    }

    const adminAuth = await verifyAdminSession(request);
    const sessionCookie = request.cookies.get('wisp_session');
    const verifiedSession = sessionCookie?.value ? verifyUserSession(sessionCookie.value) : null;

    // Delete or status change requires admin session
    if ((action === 'delete' || action === 'status') && !adminAuth.authorized) {
      return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
    }

    reloadStore();

    if (!Array.isArray(serverStore.tickets)) {
      serverStore.tickets = [];
    }

    const index = serverStore.tickets.findIndex((t) => t.id === ticketId);
    if (index === -1) {
      return NextResponse.json({ success: false, error: 'Destek talebi bulunamadı.' }, { status: 404 });
    }

    const ticket = serverStore.tickets[index];

    // Customer can only reply to their own ticket
    if (!adminAuth.authorized && verifiedSession?.id !== ticket.customerDiscordId) {
      return NextResponse.json({ success: false, error: 'Bu talebe yanıt verme yetkiniz yok.' }, { status: 403 });
    }

    const now = new Date();
    const dateStamp = now.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    if (action === 'delete') {
      serverStore.tickets.splice(index, 1);
      saveStore();
      return NextResponse.json({ success: true, message: 'Talep silindi.' });
    }

    if (action === 'reply') {
      const { text, isStaff } = body;
      if (!text || !text.trim()) {
        return NextResponse.json({ success: false, error: 'Mesaj metni boş olamaz.' }, { status: 400 });
      }

      // If claiming to be staff, must be verified admin
      const effectiveIsStaff = Boolean(isStaff) && adminAuth.authorized;
      const senderName = effectiveIsStaff
        ? adminAuth.username || 'Wihyfe Yetkilisi'
        : verifiedSession?.username || ticket.customerName;

      ticket.messages.push({
        sender: senderName,
        isStaff: effectiveIsStaff,
        text: text.trim(),
        timestamp: dateStamp,
      });

      ticket.updatedAt = dateStamp;
      ticket.lastReplyBy = senderName;

      // If staff replies, move to in_progress
      if (effectiveIsStaff && ticket.status === 'open') {
        ticket.status = 'in_progress';
      }

      // If customer replies to a resolved ticket, reopen
      if (!effectiveIsStaff && (ticket.status === 'resolved' || ticket.status === 'closed')) {
        ticket.status = 'in_progress';
      }
    } else if (action === 'status') {
      const { status, staffName } = body;
      ticket.status = status;
      ticket.updatedAt = dateStamp;

      serverStore.logs.unshift({
        id: `LOG-${Date.now().toString().slice(-4)}`,
        timestamp: dateStamp,
        staffName: staffName || adminAuth.username || 'Yetkili',
        action: `Ticket Durumu Güncellendi (${ticketId})`,
        details: `Yeni durum: ${status}`,
        type: 'ticket',
      });
    }

    saveStore();

    return NextResponse.json({
      success: true,
      ticket,
      tickets: serverStore.tickets,
    });
  } catch (err: any) {
    console.error('Error updating ticket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminAuth = await verifyAdminSession(request);
  if (!adminAuth.authorized) {
    return NextResponse.json({ success: false, error: 'Yetkisiz erişim.' }, { status: 401 });
  }

  try {
    reloadStore();
    const searchParams = request.nextUrl.searchParams;
    const ticketId = searchParams.get('ticketId');

    if (!ticketId) {
      return NextResponse.json({ success: false, error: 'ticketId gereklidir.' }, { status: 400 });
    }

    if (!Array.isArray(serverStore.tickets)) {
      serverStore.tickets = [];
    }

    serverStore.tickets = serverStore.tickets.filter((t) => t.id !== ticketId);
    saveStore();

    return NextResponse.json({
      success: true,
      tickets: serverStore.tickets,
    });
  } catch (err: any) {
    console.error('Error deleting ticket:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
