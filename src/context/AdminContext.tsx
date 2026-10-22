'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  AdminUser,
  AdminProduct,
  AdminOrder,
  SecurityThreat,
  SecurityBan,
  AdminPin,
  FinanceTransaction,
  RoleType,
  SubscriptionTier,
  DeliveryStatus,
  AuditEntry,
  AuditCategory,
  AdminNotification,
  ServerHealth,
} from '@/types/admin';
import {
  INITIAL_USERS,
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_PINS,
  INITIAL_THREATS,
  INITIAL_BANS,
  INITIAL_FINANCE_LOGS,
} from '@/data/adminDefaults';
import { AdminTicket } from '@/config/admin';

export type AdminTab =
  | 'overview'
  | 'analytics'
  | 'products'
  | 'orders'
  | 'tickets'
  | 'users'
  | 'security'
  | 'pins'
  | 'finance'
  | 'audit'
  | 'permissions'
  | 'system';

export const ALL_TABS: { id: AdminTab; label: string }[] = [
  { id: 'overview', label: 'Genel Bakış' },
  { id: 'analytics', label: 'İstatistik & Trafik' },
  { id: 'products', label: 'Ürün & Paketler' },
  { id: 'orders', label: 'Sipariş & Teslimat' },
  { id: 'tickets', label: 'Destek Talepleri' },
  { id: 'users', label: 'Kullanıcılar & Roller' },
  { id: 'pins', label: 'PIN & Lisans' },
  { id: 'security', label: 'Güvenlik & Saldırılar' },
  { id: 'finance', label: 'Para & Bakiye' },
  { id: 'audit', label: 'Denetim Günlüğü' },
  { id: 'permissions', label: 'Yetki Matrisi' },
  { id: 'system', label: 'Sistem & API' },
];

export type PermissionMatrix = Record<RoleType, AdminTab[]>;

const EVERY_TAB = ALL_TABS.map((t) => t.id);

export const DEFAULT_PERMISSIONS: PermissionMatrix = {
  Owner: EVERY_TAB,
  Admin: EVERY_TAB.filter((t) => t !== 'permissions'),
  Staff: ['overview', 'analytics', 'products', 'orders', 'tickets', 'pins', 'security'],
  Master: ['overview', 'orders', 'tickets'],
  VIP: ['overview'],
  Müşteri: ['overview'],
};

const nowStamp = () =>
  new Date().toLocaleDateString('tr-TR') +
  ' ' +
  new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

interface ToastState {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface AdminContextType {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  timeframe: '7d' | '14d' | '30d' | 'all';
  setTimeframe: (tf: '7d' | '14d' | '30d' | 'all') => void;

  // Active Staff / Admin Profile & Auth
  currentStaff: AdminUser;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;

  // Data lists
  users: AdminUser[];
  products: AdminProduct[];
  orders: AdminOrder[];
  pins: AdminPin[];
  threats: SecurityThreat[];
  bans: SecurityBan[];
  financeLogs: FinanceTransaction[];
  tickets: AdminTicket[];

  // Ticket Operations
  replyTicket: (ticketId: string, text: string) => Promise<boolean>;
  updateTicketStatus: (ticketId: string, status: AdminTicket['status']) => Promise<boolean>;
  deleteTicket: (ticketId: string) => Promise<boolean>;
  refreshTickets: () => Promise<void>;

  // CRUD Operations
  addProduct: (product: Omit<AdminProduct, 'id' | 'salesCount' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<AdminProduct>) => void;
  deleteProduct: (id: string) => void;

  updateOrderStatus: (orderId: string, status: DeliveryStatus, notes?: string) => void;
  addOrder: (order: Omit<AdminOrder, 'id' | 'createdAt'>) => void;

  updateUserRoleAndSubscription: (
    userId: string,
    role: RoleType,
    subscription: SubscriptionTier,
    status?: 'Aktif' | 'Kısıtlı' | 'Yasaklı',
    note?: string,
    panelAccess?: boolean,
    password?: string,
    email?: string
  ) => void;
  addUser: (user: Omit<AdminUser, 'id' | 'joinedDate' | 'lastLogin'>) => void;
  deleteUser: (userId: string) => void;

  createPin: (pinData: {
    pin: string;
    targetApp: string;
    maxUses: number;
    expiresAt: string;
    assignedUser?: string;
    note?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  deletePin: (id: string) => Promise<void>;
  validatePinSimulator: (pinCode: string) => { success: boolean; message: string; pin?: AdminPin };

  addBan: (
    targetType: 'ip' | 'user',
    targetValue: string,
    targetName: string,
    reason: string,
    duration: '1 saat' | '24 saat' | '7 gün' | 'Kalıcı'
  ) => void;
  removeBan: (banId: string) => void;

  modifyUserBalance: (
    userId: string,
    amount: number,
    type: 'add' | 'deduct',
    reason: string
  ) => Promise<boolean>;

  refreshUsers: () => Promise<void>;

  // Modals
  isPinModalOpen: boolean;
  setIsPinModalOpen: (open: boolean) => void;
  isProductModalOpen: boolean;
  setIsProductModalOpen: (open: boolean) => void;
  editingProduct: AdminProduct | null;
  setEditingProduct: (prod: AdminProduct | null) => void;

  isRoleModalOpen: boolean;
  setIsRoleModalOpen: (open: boolean) => void;
  editingUser: AdminUser | null;
  setEditingUser: (user: AdminUser | null) => void;

  isAddUserModalOpen: boolean;
  setIsAddUserModalOpen: (open: boolean) => void;

  isBalanceModalOpen: boolean;
  setIsBalanceModalOpen: (open: boolean) => void;
  balanceTargetUser: AdminUser | null;
  setBalanceTargetUser: (user: AdminUser | null) => void;

  isBanModalOpen: boolean;
  setIsBanModalOpen: (open: boolean) => void;
  banTarget: { type: 'ip' | 'user'; value: string; name?: string } | null;
  setBanTarget: (target: { type: 'ip' | 'user'; value: string; name?: string } | null) => void;

  isOrderModalOpen: boolean;
  setIsOrderModalOpen: (open: boolean) => void;
  selectedOrder: AdminOrder | null;
  setSelectedOrder: (order: AdminOrder | null) => void;

  // Toast notifications
  toasts: ToastState[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;

  // Audit log (gerçek yetkili işlemleri)
  auditLogs: AuditEntry[];
  logAudit: (category: AuditCategory, action: string, details: string) => void;
  clearAuditLogs: () => void;

  // Notifications
  notifications: AdminNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;

  // Permissions
  permissions: PermissionMatrix;
  setPermission: (role: RoleType, tab: AdminTab, allowed: boolean) => void;
  resetPermissions: () => void;
  viewAsRole: RoleType | null;
  setViewAsRole: (role: RoleType | null) => void;
  canAccess: (tab: AdminTab) => boolean;

  // Bulk operations
  bulkUpdateOrderStatus: (ids: string[], status: DeliveryStatus) => void;
  bulkUpdateUserRole: (ids: string[], role: RoleType) => void;
  bulkDeleteUsers: (ids: string[]) => void;
  bulkUpdateProductStatus: (ids: string[], status: AdminProduct['status']) => void;
  bulkDeleteProducts: (ids: string[]) => void;
  revokePins: (ids: string[]) => Promise<void>;
  deletePins: (ids: string[]) => Promise<void>;

  // Live server health (gerçek ölçümler)
  health: ServerHealth | null;

  // UI state
  isPaletteOpen: boolean;
  setIsPaletteOpen: (open: boolean) => void;
  isEndOfDayModalOpen: boolean;
  setIsEndOfDayModalOpen: (open: boolean) => void;
  triggerEndOfDay: (notes?: string) => Promise<{ success: boolean; report?: any; error?: string }>;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'wihyfe_admin_users_v4',
  PRODUCTS: 'wihyfe_admin_products_v4',
  ORDERS: 'wihyfe_admin_orders_v4',
  PINS: 'wihyfe_admin_pins_v4',
  THREATS: 'wihyfe_admin_threats_v4',
  BANS: 'wihyfe_admin_bans_v4',
  FINANCE: 'wihyfe_admin_finance_v4',
  AUDIT: 'wihyfe_admin_audit_v1',
  NOTIFS: 'wihyfe_admin_notifs_v1',
  PERMS: 'wihyfe_admin_perms_v1',
  THEME: 'wihyfe_admin_theme_v1',
  SIDEBAR: 'wihyfe_admin_sidebar_v1',
  SESSION: 'wisp_admin_session_v1',
};

function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [timeframe, setTimeframe] = useState<'7d' | '14d' | '30d' | 'all'>('7d');

  // Load state from localStorage with fallback to INITIAL_*
  const [users, setUsers] = useState<AdminUser[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((u: AdminUser) => {
              const def = INITIAL_USERS.find(
                (init) => init.id === u.id || init.username.toLowerCase() === u.username.toLowerCase()
              );
              return {
                ...u,
                panelAccess: u.panelAccess !== undefined ? u.panelAccess : (def?.panelAccess ?? false),
                password: u.password || def?.password || (u.role === 'Owner' ? 'admin' : ''),
              };
            });
          }
        } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_USERS;
  });

  const [sessionUserId, setSessionUserId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem(STORAGE_KEYS.SESSION);
    }
    return null;
  });

  const isAuthenticated = useMemo(() => {
    if (!sessionUserId) return false;
    const user = users.find((u) => u.id === sessionUserId);
    return Boolean(user && user.panelAccess && user.status !== 'Yasaklı');
  }, [sessionUserId, users]);

  const [products, setProducts] = useState<AdminProduct[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed.map((p: AdminProduct) => {
              const def = INITIAL_PRODUCTS.find(
                (init) => init.id === p.id || init.originalId === (p.originalId || p.id.replace(/^prod_/, ''))
              );
              return {
                ...p,
                originalId: p.originalId || def?.originalId || p.id.replace(/^prod_/, ''),
                period: p.period || def?.period || 'Aylık',
                periods: p.periods && Object.keys(p.periods).length > 0 ? p.periods : def?.periods,
              };
            });
          }
        } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<AdminOrder[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_ORDERS;
  });

  const [pins, setPins] = useState<AdminPin[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.PINS);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed.filter((p: any) => p.id !== 'pin_default_void64' && p.pin !== 'VOID64');
          }
        } catch (e) { /* ignore */ }
      }
    }
    return [];
  });

  const [threats, setThreats] = useState<SecurityThreat[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.THREATS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_THREATS;
  });

  const [bans, setBans] = useState<SecurityBan[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.BANS);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_BANS;
  });

  const [financeLogs, setFinanceLogs] = useState<FinanceTransaction[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(STORAGE_KEYS.FINANCE);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            return parsed
              .map((item: any) => ({
                ...item,
                amount: Number(item.amount) || 0,
                previousBalance: Number(item.previousBalance) || 0,
                newBalance: Number(item.newBalance) || 0,
              }))
              .filter((item: any) => item.amount > 0 && item.amount < 50000000);
          }
        } catch (e) { /* ignore */ }
      }
    }
    return INITIAL_FINANCE_LOGS;
  });

  const [tickets, setTickets] = useState<AdminTicket[]>([]);

  const refreshUsers = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/users', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.users) && data.users.length > 0) {
          setUsers(data.users);
          try {
            localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
          } catch {}
        }
      }
    } catch (e) {
      console.warn('Failed to sync authoritative users:', e);
    }
  }, []);

  const refreshTickets = useCallback(async () => {
    try {
      const res = await fetch('/api/tickets', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.tickets)) {
          setTickets(data.tickets);
        }
      }
    } catch (e) {
      console.error('Failed to sync tickets:', e);
    }
  }, []);

  useEffect(() => {
    refreshUsers();
    refreshTickets();
    const interval = setInterval(() => {
      refreshUsers();
      refreshTickets();
    }, 8000);
    return () => clearInterval(interval);
  }, [refreshUsers, refreshTickets]);

  // Current logged in admin (reflects authenticated staff, fallback to Owner)
  const currentStaff = useMemo(() => {
    if (sessionUserId) {
      const match = users.find((u) => u.id === sessionUserId);
      if (match) return match;
    }
    return users.find((u) => u.role === 'Owner') || users[0];
  }, [sessionUserId, users]);

  // Sync to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    }
  }, [users]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    }
  }, [products]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    }
  }, [orders]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(pins));
    }
  }, [pins]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.THREATS, JSON.stringify(threats));
    }
  }, [threats]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.BANS, JSON.stringify(bans));
    }
  }, [bans]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(financeLogs));
    }
  }, [financeLogs]);

  // --- Audit log, notifications, permissions, UI prefs ---
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>(() => loadJson<AuditEntry[]>(STORAGE_KEYS.AUDIT, []));
  const [notifications, setNotifications] = useState<AdminNotification[]>(() =>
    loadJson<AdminNotification[]>(STORAGE_KEYS.NOTIFS, [])
  );
  const [permissions, setPermissions] = useState<PermissionMatrix>(() => ({
    ...DEFAULT_PERMISSIONS,
    ...loadJson<Partial<PermissionMatrix>>(STORAGE_KEYS.PERMS, {}),
  }));
  const [viewAsRole, setViewAsRole] = useState<RoleType | null>(null);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadJson<'dark' | 'light'>(STORAGE_KEYS.THEME, 'dark'));
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(() => loadJson<boolean>(STORAGE_KEYS.SIDEBAR, false));
  const [health, setHealth] = useState<ServerHealth | null>(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(auditLogs));
  }, [auditLogs]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFS, JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PERMS, JSON.stringify(permissions));
  }, [permissions]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  }, [theme]);
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SIDEBAR, JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const toggleSidebar = useCallback(() => setSidebarCollapsed((c) => !c), []);

  const logAudit = useCallback(
    (category: AuditCategory, action: string, details: string) => {
      const entry: AuditEntry = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        at: nowStamp(),
        staff: currentStaff.username,
        action,
        details,
        category,
      };
      setAuditLogs((prev) => [entry, ...prev].slice(0, 500));
    },
    [currentStaff.username]
  );

  const clearAuditLogs = useCallback(() => {
    setAuditLogs([]);
  }, []);

  const pushNotification = useCallback(
    (kind: AdminNotification['kind'], title: string, message: string) => {
      const n: AdminNotification = {
        id: `ntf_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        at: nowStamp(),
        title,
        message,
        kind,
        read: false,
      };
      setNotifications((prev) => [n, ...prev].slice(0, 100));
    },
    []
  );

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);
  const clearNotifications = useCallback(() => setNotifications([]), []);

  // Permissions
  const setPermission = useCallback((role: RoleType, tab: AdminTab, allowed: boolean) => {
    if (role === 'Owner') return; // Owner her zaman tam yetkili
    setPermissions((prev) => {
      const current = new Set(prev[role]);
      if (allowed) current.add(tab);
      else current.delete(tab);
      return { ...prev, [role]: Array.from(current) as AdminTab[] };
    });
  }, []);
  const resetPermissions = useCallback(() => setPermissions(DEFAULT_PERMISSIONS), []);
  const canAccess = useCallback(
    (tab: AdminTab) => {
      const role = viewAsRole ?? currentStaff.role;
      if (role === 'Owner') return true;
      return (permissions[role] || []).includes(tab);
    },
    [viewAsRole, currentStaff.role, permissions]
  );

  // Discord webhook (yalnızca sunucuda DISCORD_WEBHOOK_URL tanımlıysa gönderir)
  const sendDiscord = useCallback((title: string, message: string) => {
    fetch('/api/admin/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, message }),
    }).catch(() => {});
  }, []);

  // Live server health: gerçek CPU/RAM + istemci tarafında ölçülen gecikme
  useEffect(() => {
    let cancelled = false;
    const history: number[] = [];
    const poll = async () => {
      const t0 = performance.now();
      try {
        const res = await fetch('/api/admin/health', { cache: 'no-store' });
        const latency = Math.round(performance.now() - t0);
        const data = await res.json();
        history.push(latency);
        if (history.length > 12) history.shift();
        if (!cancelled) setHealth({ ...data, latencyMs: latency, latencyHistory: [...history] });
      } catch {
        history.push(0);
        if (history.length > 12) history.shift();
        if (!cancelled) {
          setHealth((prev) => (prev ? { ...prev, ok: false, latencyHistory: [...history] } : null));
        }
      }
    };
    poll();
    const id = setInterval(poll, 5000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Sitedeki gerçek siparişleri (PayTR akışı) panele senkronla
  const ordersRef = useRef<AdminOrder[]>(orders);
  const seenSiteOrders = useRef<Set<string>>(new Set());
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);
  useEffect(() => {
    let cancelled = false;
    const mapStatus = (s: string): DeliveryStatus =>
      s === 'active' ? 'Tamamlandı' : s === 'cancelled' ? 'İptal Edildi' : 'Beklemede';
    const sync = async () => {
      try {
        const res = await fetch('/api/orders', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (cancelled || !Array.isArray(data.orders)) return;
        const incoming: AdminOrder[] = [];
        const known = new Set(ordersRef.current.map((o) => o.id));
        data.orders.forEach((so: any) => {
          if (!so?.id || known.has(so.id) || seenSiteOrders.current.has(so.id)) return;
          seenSiteOrders.current.add(so.id);
          const status = mapStatus(so.status);
          incoming.push({
            id: so.id,
            customerName: so.customerDiscord || 'Bilinmeyen Müşteri',
            customerDiscord: so.customerDiscord || '',
            customerEmail: so.customerEmail || '',
            productName: `${so.packageName}${so.periodLabel ? ` (${so.periodLabel})` : ''}`,
            category: 'Bot',
            amount: Number(so.numericPrice) || 0,
            paymentMethod: 'PayTR',
            status,
            createdAt: so.createdAt || nowStamp(),
            source: 'site',
            history: [{ status, at: so.createdAt || nowStamp(), by: 'Site (PayTR)' }],
          });
        });
        if (incoming.length) {
          setOrders((prev) => {
            const ids = new Set(prev.map((o) => o.id));
            const fresh = incoming.filter((o) => !ids.has(o.id));
            return fresh.length ? [...fresh, ...prev] : prev;
          });
          incoming.forEach((o) => pushNotification('order', 'Yeni sipariş', `${o.id} — ${o.productName} (${o.customerName})`));
          setAuditLogs((prev) => [
            ...incoming.map((o) => ({
              id: `aud_${o.id}_${Date.now()}`,
              at: nowStamp(),
              staff: 'Site',
              action: 'Yeni site siparişi alındı',
              details: `${o.id} — ${o.productName} — ₺${o.amount}`,
              category: 'sipariş' as AuditCategory,
            })),
            ...prev,
          ].slice(0, 500));
          incoming.forEach((o) => sendDiscord('Yeni Sipariş', `${o.id} — ${o.productName}\nMüşteri: ${o.customerName}\nTutar: ₺${o.amount}`));
        }
      } catch {
        /* ağ hatası: bir sonraki turda tekrar denenir */
      }
    };
    sync();
    const id = setInterval(sync, 20000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [pushNotification, sendDiscord]);

  // Modals state
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [isBalanceModalOpen, setIsBalanceModalOpen] = useState(false);
  const [balanceTargetUser, setBalanceTargetUser] = useState<AdminUser | null>(null);

  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [banTarget, setBanTarget] = useState<{ type: 'ip' | 'user'; value: string; name?: string } | null>(null);

  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const [isEndOfDayModalOpen, setIsEndOfDayModalOpen] = useState(false);

  // Toast notification system
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const triggerEndOfDay = useCallback(async (notes?: string) => {
    try {
      const res = await fetch('/api/admin/end-of-day', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          staffName: currentStaff.username + ` (${currentStaff.role})`,
          notes: notes || 'Gün sonu başarıyla kapatıldı.',
        }),
      });
      const data = await res.json();
      if (data.success && data.report) {
        showToast(`Gün sonu raporu (#${data.report.id}) oluşturuldu ve sayaçlar sıfırlandı!`, 'success');
        return { success: true, report: data.report };
      }
      return { success: false, error: data.error || 'Gün sonu işlemi tamamlanamadı.' };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }, [currentStaff.username, currentStaff.role, showToast]);

  // Fetch server PINs on mount to keep in sync
  useEffect(() => {
    const syncServerPins = async () => {
      try {
        const res = await fetch('/api/admin/pins');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.pins)) {
            const clean = data.pins.filter((p: any) => p.id !== 'pin_default_void64' && p.pin !== 'VOID64');
            setPins(clean);
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };
    syncServerPins();
  }, []);

  // Fetch server products / overrides on mount to keep in sync with real website
  useEffect(() => {
    const syncServerProducts = async () => {
      try {
        const res = await fetch('/api/admin/products');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.productOverrides) {
            setProducts((prev) =>
              prev.map((p) => {
                const botId = p.originalId || p.id.replace(/^prod_/, '');
                const override = data.productOverrides[p.id] || data.productOverrides[botId];
                if (override) {
                  return {
                    ...p,
                    ...override,
                    periods: override.periods || p.periods,
                  };
                }
                return p;
              })
            );
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };
    syncServerProducts();
  }, []);

  // --- Product Operations ---
  const addProduct = useCallback(async (product: Omit<AdminProduct, 'id' | 'salesCount' | 'updatedAt'>) => {
    const newProd: AdminProduct = {
      ...product,
      id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      salesCount: 0,
      updatedAt: new Date().toLocaleDateString('tr-TR'),
    };
    setProducts((prev) => [newProd, ...prev]);
    try {
      await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product: newProd }),
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('wisp_products_updated'));
      }
    } catch (err) {
      console.error('Failed to sync added product to server:', err);
    }
    showToast(`"${product.name}" ürünü başarıyla eklendi!`, 'success');
  }, [showToast]);

  const updateProduct = useCallback(async (id: string, updates: Partial<AdminProduct>) => {
    let updatedTarget: AdminProduct | null = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const updated = {
            ...p,
            ...updates,
            updatedAt: new Date().toLocaleDateString('tr-TR'),
          };
          updatedTarget = updated;
          return updated;
        }
        return p;
      })
    );
    if (updatedTarget) {
      try {
        await fetch('/api/admin/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ product: updatedTarget }),
        });
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('wisp_products_updated'));
        }
      } catch (err) {
        console.error('Failed to sync updated product to server:', err);
      }
    }
    showToast('Ürün bilgileri ve site fiyatlandırması güncellendi.', 'success');
  }, [showToast]);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => {
      const target = prev.find((p) => p.id === id);
      const filtered = prev.filter((p) => p.id !== id);
      if (target) {
        showToast(`"${target.name}" ürünü kalıcı olarak silindi.`, 'info');
      }
      return filtered;
    });
    try {
      await fetch(`/api/admin/products?id=${encodeURIComponent(id)}`, {
        method: 'DELETE',
      });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('wisp_products_updated'));
      }
    } catch (err) {
      console.error('Failed to delete product on server:', err);
    }
  }, [showToast]);

  // --- Order & Delivery Operations ---
  const updateOrderStatus = useCallback((orderId: string, status: DeliveryStatus, notes?: string) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const isComplete = status === 'Tamamlandı';
          return {
            ...o,
            status,
            notes: notes !== undefined ? notes : o.notes,
            deliveryTime: isComplete ? new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : o.deliveryTime,
          };
        }
        return o;
      })
    );

    // Sync with backend orders API so customer sees updated delivery status
    fetch('/api/orders', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderId,
        deliveryStatus: status,
        notes,
      }),
    }).catch((err) => console.warn('Failed to sync order status to server:', err));

    showToast(`Sipariş ${orderId} durumu "${status}" olarak güncellendi.`, 'success');
  }, [showToast]);

  const addOrder = useCallback((order: Omit<AdminOrder, 'id' | 'createdAt'>) => {
    const newOrder: AdminOrder = {
      ...order,
      id: `#WSP-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };
    setOrders((prev) => [newOrder, ...prev]);
    showToast(`Yeni sipariş ${newOrder.id} oluşturuldu!`, 'success');
  }, [showToast]);

  // --- User, Role & Subscription Operations ---
  const updateUserRoleAndSubscription = useCallback((
    userId: string,
    role: RoleType,
    subscription: SubscriptionTier,
    status: 'Aktif' | 'Kısıtlı' | 'Yasaklı' = 'Aktif',
    note?: string,
    panelAccess?: boolean,
    password?: string,
    email?: string
  ) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === userId) {
          return {
            ...u,
            role,
            subscription,
            status,
            restrictionsNote: note !== undefined ? note : u.restrictionsNote,
            panelAccess: panelAccess !== undefined ? panelAccess : u.panelAccess,
            password: password !== undefined ? password : u.password,
            email: email !== undefined ? email.trim() : u.email,
          };
        }
        return u;
      })
    );

    // Sync to serverStore
    if (userId) {
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          tier: subscription,
          email: email ? email.trim() : undefined,
        }),
      }).catch((err) => console.warn('Failed to sync updated user email/role to server:', err));
    }

    showToast(`Kullanıcı bilgileri, rolü ve e-postası başarıyla güncellendi!`, 'success');
  }, [showToast]);

  const addUser = useCallback((userData: Omit<AdminUser, 'id' | 'joinedDate' | 'lastLogin'>) => {
    const newUser: AdminUser = {
      ...userData,
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      joinedDate: new Date().toLocaleDateString('tr-TR'),
      lastLogin: 'Yeni Kayıt',
      panelAccess: userData.panelAccess ?? false,
      password: userData.password ?? '',
    };
    setUsers((prev) => [newUser, ...prev]);
    showToast(`"${userData.username}" kullanıcısı başarıyla eklendi!`, 'success');
  }, [showToast]);

  // --- Authentication ---
  const login = useCallback(
    async (username: string, password: string): Promise<{ success: boolean; error?: string }> => {
      const cleanUser = username.trim().toLowerCase();
      const cleanPass = password.trim();

      try {
        const res = await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: cleanUser, password: cleanPass }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || 'Hatalı kullanıcı adı veya şifre girdiniz.' };
        }

        const user = users.find(
          (u) =>
            u.id === data.user?.id ||
            u.username.toLowerCase() === cleanUser ||
            u.email.toLowerCase() === cleanUser
        ) || data.user;

        setSessionUserId(user.id);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(STORAGE_KEYS.SESSION, user.id);
        }

        // Update lastLogin
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, lastLogin: nowStamp() } : u))
        );

        const entry: AuditEntry = {
          id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          at: nowStamp(),
          staff: user.username,
          action: 'Yetkili Girişi Yapıldı',
          details: `${user.username} (${user.role}) yetkili paneline başarıyla giriş yaptı.`,
          category: 'güvenlik',
        };
        setAuditLogs((prev) => [entry, ...prev].slice(0, 500));

        return { success: true };
      } catch (err: any) {
        return { success: false, error: 'Doğrulama sunucusuna bağlanılamadı: ' + (err.message || 'Hata') };
      }
    },
    [users]
  );

  const logout = useCallback(() => {
    // Clear secure HTTP-only admin session cookie on backend
    fetch('/api/admin/auth', { method: 'DELETE' }).catch(() => {});

    if (currentStaff) {
      const entry: AuditEntry = {
        id: `aud_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        at: nowStamp(),
        staff: currentStaff.username,
        action: 'Yetkili Çıkışı Yapıldı',
        details: `${currentStaff.username} panelden güvenli çıkış yaptı.`,
        category: 'güvenlik',
      };
      setAuditLogs((prev) => [entry, ...prev].slice(0, 500));
    }
    setSessionUserId(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(STORAGE_KEYS.SESSION);
    }
    showToast('Panelden güvenli bir şekilde çıkış yapıldı.', 'info');
  }, [currentStaff, showToast]);

  const deleteUser = useCallback((userId: string) => {
    setUsers((prev) => {
      const target = prev.find((u) => u.id === userId);
      if (target?.role === 'Owner') {
        showToast('Owner rolündeki kurucu kullanıcı silinemez!', 'error');
        return prev;
      }
      showToast(`Kullanıcı silindi.`, 'info');
      return prev.filter((u) => u.id !== userId);
    });
  }, [showToast]);

  // --- PIN Operations ---
  const createPin = useCallback(async (pinData: {
    pin: string;
    targetApp: string;
    maxUses: number;
    expiresAt: string;
    assignedUser?: string;
    note?: string;
  }) => {
    const cleanPin = pinData.pin.trim().toUpperCase();

    // Check duplicate
    if (pins.some((p) => p.pin.toUpperCase() === cleanPin)) {
      showToast(`PIN "${cleanPin}" zaten mevcut!`, 'error');
      return { success: false, error: 'Bu PIN kodu zaten kullanımda.' };
    }

    try {
      const res = await fetch('/api/admin/pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: cleanPin,
          targetApp: pinData.targetApp,
          maxUses: pinData.maxUses,
          expiresAt: pinData.expiresAt,
          assignedUser: pinData.assignedUser,
          note: pinData.note,
          createdBy: currentStaff.username,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.success && data.pin) {
          setPins((prev) => [data.pin, ...prev.filter((p) => p.pin !== data.pin.pin)]);
          showToast(`İndirme PIN kodu "${cleanPin}" başarıyla oluşturuldu!`, 'success');
          return { success: true };
        }
      }
    } catch (e) {
      // Offline fallback
    }

    const localPin: AdminPin = {
      id: `pin_${Date.now()}`,
      pin: cleanPin,
      targetApp: pinData.targetApp,
      maxUses: pinData.maxUses,
      currentUses: 0,
      status: 'Aktif',
      createdBy: currentStaff.username,
      createdAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: pinData.expiresAt,
      assignedUser: pinData.assignedUser,
      note: pinData.note,
    };
    setPins((prev) => [localPin, ...prev]);
    showToast(`İndirme PIN kodu "${cleanPin}" başarıyla oluşturuldu!`, 'success');
    return { success: true };
  }, [pins, currentStaff.username, showToast]);

  const deletePin = useCallback(async (id: string) => {
    try {
      await fetch(`/api/admin/pins?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
    } catch (e) {
      // Continue locally
    }
    setPins((prev) => {
      const updated = prev.filter((p) => p.id !== id && p.pin !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem(STORAGE_KEYS.PINS, JSON.stringify(updated));
      }
      return updated;
    });
    showToast('PIN kodu kalıcı olarak silindi.', 'info');
  }, [showToast]);

  const validatePinSimulator = useCallback((pinCode: string) => {
    const clean = pinCode.trim().toUpperCase();
    const found = pins.find((p) => p.pin.toUpperCase() === clean);
    if (!found) {
      return { success: false, message: `PIN "${clean}" sistemde kayıtlı değil. İstemci indirilemez!` };
    }
    if (found.status !== 'Aktif') {
      return { success: false, message: `PIN "${clean}" geçerli değil (Durum: ${found.status})` };
    }
    if (found.currentUses >= found.maxUses) {
      return { success: false, message: `PIN "${clean}" kullanım kotası dolmuştur (${found.currentUses}/${found.maxUses})` };
    }
    return {
      success: true,
      message: `PIN "${clean}" GEÇERLİ! ${found.targetApp} indirme yetkisi onaylandı.`,
      pin: found,
    };
  }, [pins]);

  // --- Security & Ban Operations ---
  const addBan = useCallback((
    targetType: 'ip' | 'user',
    targetValue: string,
    targetName: string,
    reason: string,
    duration: '1 saat' | '24 saat' | '7 gün' | 'Kalıcı'
  ) => {
    const newBan: SecurityBan = {
      id: `ban_${Date.now()}`,
      targetType,
      targetValue,
      targetName,
      reason,
      bannedBy: currentStaff.username,
      duration,
      createdAt: new Date().toLocaleDateString('tr-TR') + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      expiresAt: duration === 'Kalıcı' ? 'Süresiz' : `${duration} sonra`,
      isActive: true,
    };

    setBans((prev) => [newBan, ...prev]);

    // If banning a user, reflect on user status
    if (targetType === 'user') {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === targetValue || u.username === targetValue) {
            return {
              ...u,
              status: duration === 'Kalıcı' ? 'Yasaklı' : 'Kısıtlı',
              restrictionsNote: reason,
            };
          }
          return u;
        })
      );
    }

    showToast(`${targetType.toUpperCase()}: ${targetName || targetValue} kısıtlandı (${duration})`, 'error');
  }, [currentStaff.username, showToast]);

  const removeBan = useCallback((banId: string) => {
    setBans((prev) => {
      const ban = prev.find((b) => b.id === banId);
      if (ban && ban.targetType === 'user') {
        setUsers((uPrev) =>
          uPrev.map((u) => {
            if (u.id === ban.targetValue || u.username === ban.targetValue) {
              return { ...u, status: 'Aktif', restrictionsNote: undefined };
            }
            return u;
          })
        );
      }
      return prev.filter((b) => b.id !== banId);
    });
    showToast('Kısıtlama kaldırıldı, erişim normale döndü.', 'success');
  }, [showToast]);

  // --- Finance & Balance Operations ---
  const modifyUserBalance = useCallback(async (
    userId: string,
    amount: number,
    type: 'add' | 'deduct',
    reason: string
  ): Promise<boolean> => {
    const numAmount = Math.abs(Number(amount));
    if (isNaN(numAmount) || numAmount <= 0) {
      showToast('Lütfen geçerli bir bakiye tutarı girin.', 'error');
      return false;
    }

    try {
      const res = await fetch('/api/admin/balance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          amount: numAmount,
          type,
          reason,
          staffName: currentStaff.username,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        showToast('Bakiye işlemi başarısız: ' + (data.error || 'Bilinmeyen hata'), 'error');
        return false;
      }

      // Update state with updated users list or user record
      if (Array.isArray(data.users)) {
        setUsers(data.users);
        try {
          localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(data.users));
        } catch {}
      } else if (data.user) {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === data.user.id || u.username.toLowerCase() === data.user.username.toLowerCase()
              ? { ...u, balance: Number(data.newBalance) || 0 }
              : u
          )
        );
      }

      // Record financial log
      if (data.log) {
        setFinanceLogs((lPrev) => {
          const updated = [data.log, ...lPrev.filter((l) => Number(l.amount) < 50000000)];
          try {
            localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(updated));
          } catch {}
          return updated;
        });
      }

      // Dispatch event to update customer-side components in real-time
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('wisp_balance_updated', {
            detail: { userId, newBalance: data.newBalance },
          })
        );

        // If this user is also active in local session, keep StoreContext in sync immediately
        const savedUserStr = localStorage.getItem('wisp_user_profile_v2');
        if (savedUserStr) {
          try {
            const su = JSON.parse(savedUserStr);
            if (
              su.id === userId ||
              su.username?.toLowerCase() === data.user?.username?.toLowerCase()
            ) {
              su.balance = data.newBalance;
              localStorage.setItem('wisp_user_profile_v2', JSON.stringify(su));
              localStorage.setItem('wisp_balance_v3', data.newBalance.toString());
            }
          } catch {}
        }
      }

      showToast(
        `${data.user?.username || userId} kullanıcısına ₺${numAmount.toLocaleString('tr-TR')} ${type === 'add' ? 'eklendi' : 'düşüldü'}. Yeni Bakiye: ₺${(Number(data.newBalance) || 0).toLocaleString('tr-TR')}`,
        type === 'add' ? 'success' : 'info'
      );

      return true;
    } catch (err: any) {
      showToast('Bağlantı hatası: ' + err.message, 'error');
      return false;
    }
  }, [currentStaff.username, showToast]);

  // --- Ticket Operations ---
  const replyTicket = useCallback(async (ticketId: string, text: string) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'reply',
          sender: currentStaff.username,
          isStaff: true,
          text,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.ticket) {
          setTickets((prev) => prev.map((t) => (t.id === ticketId ? data.ticket : t)));
        }
        showToast('Yetkili yanıtı başarıyla iletildi.', 'success');
        return true;
      }
      return false;
    } catch (e: any) {
      showToast('Yanıt gönderilemedi: ' + e.message, 'error');
      return false;
    }
  }, [currentStaff.username, showToast]);

  const updateTicketStatus = useCallback(async (ticketId: string, status: AdminTicket['status']) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'status',
          status,
          staffName: currentStaff.username,
        }),
      });
      if (res.ok) {
        setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status } : t)));
        showToast(`Talep durumu güncellendi: ${status}`, 'info');
        return true;
      }
      return false;
    } catch (e: any) {
      showToast('Durum güncellenemedi: ' + e.message, 'error');
      return false;
    }
  }, [currentStaff.username, showToast]);

  const deleteTicket = useCallback(async (ticketId: string) => {
    try {
      const res = await fetch('/api/tickets', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ticketId,
          action: 'delete',
        }),
      });
      if (res.ok) {
        setTickets((prev) => prev.filter((t) => t.id !== ticketId));
        showToast('Destek talebi silindi.', 'info');
        return true;
      }
      return false;
    } catch (e: any) {
      showToast('Talep silinemedi: ' + e.message, 'error');
      return false;
    }
  }, [showToast]);

  // ------------------------------------------------------------------
  // Denetim kaydı (audit) ile sarılmış işlemler + toplu işlemler
  // ------------------------------------------------------------------
  const addProductL = useCallback((product: Omit<AdminProduct, 'id' | 'salesCount' | 'updatedAt'>) => {
    addProduct(product);
    logAudit('ürün', 'Ürün eklendi', `"${product.name}" — ₺${product.price}`);
  }, [addProduct, logAudit]);

  const updateProductL = useCallback((id: string, updates: Partial<AdminProduct>) => {
    const t = products.find((p) => p.id === id);
    updateProduct(id, updates);
    logAudit('ürün', 'Ürün güncellendi', `"${t?.name ?? id}" — ${Object.keys(updates).join(', ')}`);
  }, [products, updateProduct, logAudit]);

  const deleteProductL = useCallback((id: string) => {
    const t = products.find((p) => p.id === id);
    deleteProduct(id);
    logAudit('ürün', 'Ürün silindi', `"${t?.name ?? id}"`);
  }, [products, deleteProduct, logAudit]);

  const updateOrderStatusL = useCallback((orderId: string, status: DeliveryStatus, notes?: string) => {
    const o = orders.find((x) => x.id === orderId);
    const changed = !o || o.status !== status;
    const noteChanged = notes !== undefined && notes !== (o?.notes || '');
    updateOrderStatus(orderId, status, notes);
    if (changed || noteChanged) {
      setOrders((prev) =>
        prev.map((x) =>
          x.id === orderId
            ? { ...x, history: [...(x.history || []), { status, at: nowStamp(), by: currentStaff.username, note: notes?.trim() || undefined }] }
            : x
        )
      );
    }
    logAudit('sipariş', 'Teslimat durumu değişti', `${orderId}: ${o?.status ?? '?'} → ${status}`);
    if (changed) sendDiscord('Sipariş güncellendi', `${orderId}\n${o?.status ?? '?'} → ${status}\nYetkili: ${currentStaff.username}`);
  }, [orders, updateOrderStatus, logAudit, sendDiscord, currentStaff.username]);

  const addOrderL = useCallback((order: Omit<AdminOrder, 'id' | 'createdAt'>) => {
    addOrder({ ...order, source: 'panel', history: [{ status: order.status, at: nowStamp(), by: currentStaff.username }] });
    logAudit('sipariş', 'Panelden sipariş oluşturuldu', `${order.customerName} — ${order.productName} — ₺${order.amount}`);
  }, [addOrder, logAudit, currentStaff.username]);

  const updateUserRoleL = useCallback((
    userId: string,
    role: RoleType,
    subscription: SubscriptionTier,
    status: 'Aktif' | 'Kısıtlı' | 'Yasaklı' = 'Aktif',
    note?: string,
    panelAccess?: boolean,
    password?: string,
    email?: string
  ) => {
    const u = users.find((x) => x.id === userId);
    updateUserRoleAndSubscription(userId, role, subscription, status, note, panelAccess, password, email);
    const accessChange = panelAccess !== undefined && panelAccess !== u?.panelAccess
      ? ` (Panel Girişi: ${panelAccess ? 'Açık' : 'Kapalı'})`
      : '';
    const emailChange = email && email !== u?.email ? ` [E-posta: ${email}]` : '';
    logAudit(
      'yetki',
      'Yetki & kullanıcı bilgisi düzenlendi',
      `${u?.username ?? userId}: ${u?.role ?? '?'}/${u?.subscription ?? '?'} → ${role}/${subscription} (${status})${accessChange}${emailChange}`
    );
  }, [users, updateUserRoleAndSubscription, logAudit]);

  const addUserL = useCallback((user: Omit<AdminUser, 'id' | 'joinedDate' | 'lastLogin'>) => {
    addUser(user);
    logAudit('kullanıcı', 'Kullanıcı eklendi', `${user.username} (${user.role}/${user.subscription})`);
    pushNotification('user', 'Yeni kullanıcı', `${user.username} hesabı eklendi (${user.role})`);
  }, [addUser, logAudit, pushNotification]);

  const deleteUserL = useCallback((userId: string) => {
    const u = users.find((x) => x.id === userId);
    deleteUser(userId);
    if (u && u.role !== 'Owner') logAudit('kullanıcı', 'Kullanıcı silindi', `${u.username} (${u.role})`);
  }, [users, deleteUser, logAudit]);

  const createPinL = useCallback(async (pinData: Parameters<typeof createPin>[0]) => {
    const res = await createPin(pinData);
    if (res.success) {
      logAudit('pin', 'PIN oluşturuldu', `${pinData.pin.trim().toUpperCase()} — limit ${pinData.maxUses >= 999 ? '∞' : pinData.maxUses}, bitiş ${pinData.expiresAt}`);
      pushNotification('pin', 'Yeni PIN', `${pinData.pin.trim().toUpperCase()} oluşturuldu`);
    }
    return res;
  }, [createPin, logAudit, pushNotification]);

  const deletePinL = useCallback(async (id: string) => {
    const p = pins.find((x) => x.id === id);
    await deletePin(id);
    logAudit('pin', 'PIN silindi', p?.pin ?? id);
  }, [pins, deletePin, logAudit]);

  const addBanL = useCallback((targetType: 'ip' | 'user', targetValue: string, targetName: string, reason: string, duration: '1 saat' | '24 saat' | '7 gün' | 'Kalıcı') => {
    addBan(targetType, targetValue, targetName, reason, duration);
    logAudit('güvenlik', 'Kısıtlama / yasak uygulandı', `${targetType.toUpperCase()}: ${targetName || targetValue} — ${duration} — ${reason}`);
    pushNotification('security', 'Kısıtlama uygulandı', `${targetName || targetValue} (${duration})`);
  }, [addBan, logAudit, pushNotification]);

  const removeBanL = useCallback((banId: string) => {
    const b = bans.find((x) => x.id === banId);
    removeBan(banId);
    logAudit('güvenlik', 'Kısıtlama kaldırıldı', `${b?.targetType?.toUpperCase() ?? ''}: ${b?.targetName || b?.targetValue || banId}`);
  }, [bans, removeBan, logAudit]);

  const modifyUserBalanceL = useCallback(async (userId: string, amount: number, type: 'add' | 'deduct', reason: string) => {
    const u = users.find((x) => x.id === userId);
    const ok = await modifyUserBalance(userId, amount, type, reason);
    if (u) {
      logAudit('finans', type === 'add' ? 'Bakiye eklendi' : 'Bakiye düşüldü', `${u.username}: ₺${amount} — ${reason}`);
    }
    return ok;
  }, [users, modifyUserBalance, logAudit]);

  // --- Toplu işlemler ---
  const bulkUpdateOrderStatus = useCallback((ids: string[], status: DeliveryStatus) => {
    if (!ids.length) return;
    const stamp = nowStamp();
    setOrders((prev) =>
      prev.map((o) =>
        ids.includes(o.id) && o.status !== status
          ? {
              ...o,
              status,
              deliveryTime: status === 'Tamamlandı' ? stamp : o.deliveryTime,
              history: [...(o.history || []), { status, at: stamp, by: currentStaff.username, note: 'Toplu işlem' }],
            }
          : o
      )
    );
    logAudit('sipariş', 'Toplu durum değişikliği', `${ids.length} sipariş → ${status}`);
    showToast(`${ids.length} sipariş "${status}" yapıldı.`, 'success');
  }, [currentStaff.username, logAudit, showToast]);

  const bulkUpdateUserRole = useCallback((ids: string[], role: RoleType) => {
    const targets = users.filter((u) => ids.includes(u.id) && u.role !== 'Owner');
    if (!targets.length) {
      showToast('Seçili kullanıcılar arasında değiştirilebilecek hesap yok (Owner korunur).', 'error');
      return;
    }
    const set = new Set(targets.map((t) => t.id));
    setUsers((prev) => prev.map((u) => (set.has(u.id) ? { ...u, role } : u)));
    logAudit('yetki', 'Toplu rol değişikliği', `${targets.map((t) => t.username).join(', ')} → ${role}`);
    showToast(`${targets.length} kullanıcının rolü "${role}" yapıldı.`, 'success');
  }, [users, logAudit, showToast]);

  const bulkDeleteUsers = useCallback((ids: string[]) => {
    const targets = users.filter((u) => ids.includes(u.id) && u.role !== 'Owner');
    if (!targets.length) {
      showToast('Owner silinemez; silinecek başka hesap seçilmedi.', 'error');
      return;
    }
    const set = new Set(targets.map((t) => t.id));
    setUsers((prev) => prev.filter((u) => !set.has(u.id)));
    logAudit('kullanıcı', 'Toplu kullanıcı silme', targets.map((t) => t.username).join(', '));
    showToast(`${targets.length} kullanıcı silindi.`, 'info');
  }, [users, logAudit, showToast]);

  const bulkUpdateProductStatus = useCallback((ids: string[], status: AdminProduct['status']) => {
    if (!ids.length) return;
    const stamp = new Date().toLocaleDateString('tr-TR');
    setProducts((prev) => prev.map((p) => (ids.includes(p.id) ? { ...p, status, updatedAt: stamp } : p)));
    logAudit('ürün', 'Toplu ürün durumu', `${ids.length} ürün → ${status}`);
    showToast(`${ids.length} ürün "${status}" yapıldı.`, 'success');
  }, [logAudit, showToast]);

  const bulkDeleteProducts = useCallback((ids: string[]) => {
    if (!ids.length) return;
    const names = products.filter((p) => ids.includes(p.id)).map((p) => p.name);
    setProducts((prev) => prev.filter((p) => !ids.includes(p.id)));
    logAudit('ürün', 'Toplu ürün silme', names.join(', '));
    showToast(`${ids.length} ürün silindi.`, 'info');
  }, [products, logAudit, showToast]);

  const revokePins = useCallback(async (ids: string[]) => {
    const targets = pins.filter((p) => ids.includes(p.id) && p.status === 'Aktif');
    if (!targets.length) {
      showToast('İptal edilebilecek aktif PIN seçilmedi.', 'error');
      return;
    }
    await Promise.all(
      targets.map((p) =>
        fetch('/api/admin/pins', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: p.id, status: 'İptal' }),
        }).catch(() => {})
      )
    );
    const set = new Set(targets.map((t) => t.id));
    setPins((prev) => prev.map((p) => (set.has(p.id) ? { ...p, status: 'İptal' } : p)));
    logAudit('pin', 'PIN iptal edildi', targets.map((t) => t.pin).join(', '));
    showToast(`${targets.length} PIN iptal edildi; artık indirme yapılamaz.`, 'info');
  }, [pins, logAudit, showToast]);

  const deletePins = useCallback(async (ids: string[]) => {
    const targets = pins.filter((p) => ids.includes(p.id));
    if (!targets.length) return;
    await Promise.all(
      targets.map((p) => fetch(`/api/admin/pins?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' }).catch(() => {}))
    );
    const set = new Set(targets.map((t) => t.id));
    setPins((prev) => prev.filter((p) => !set.has(p.id)));
    logAudit('pin', 'Toplu PIN silme', targets.map((t) => t.pin).join(', '));
    showToast(`${targets.length} PIN silindi.`, 'info');
  }, [pins, logAudit, showToast]);

  // PIN kullanımını sunucudan izle: gerçek indirme olunca bildirim üret
  const pinsRef = useRef<AdminPin[]>(pins);
  useEffect(() => {
    pinsRef.current = pins;
  }, [pins]);
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/admin/pins', { cache: 'no-store' });
        const data = await res.json();
        if (data.success && Array.isArray(data.pins)) {
          (data.pins as AdminPin[]).forEach((sp) => {
            const lp = pinsRef.current.find((p) => p.id === sp.id);
            if (lp && (sp.currentUses || 0) > (lp.currentUses || 0)) {
              pushNotification('pin', 'PIN kullanıldı', `${sp.pin} — ${sp.currentUses}/${sp.maxUses >= 999 ? '∞' : sp.maxUses}`);
            }
          });
          setPins(data.pins);
        }
      } catch {
        /* sessiz */
      }
    }, 30000);
    return () => clearInterval(id);
  }, [pushNotification]);

  return (
    <AdminContext.Provider
      value={{
        activeTab,
        setActiveTab,
        timeframe,
        setTimeframe,
        currentStaff,
        isAuthenticated,
        login,
        logout,

        users,
        products,
        orders,
        pins,
        threats,
        bans,
        financeLogs,
        tickets,

        replyTicket,
        updateTicketStatus,
        deleteTicket,
        refreshTickets,

        addProduct: addProductL,
        updateProduct: updateProductL,
        deleteProduct: deleteProductL,

        updateOrderStatus: updateOrderStatusL,
        addOrder: addOrderL,

        updateUserRoleAndSubscription: updateUserRoleL,
        addUser: addUserL,
        deleteUser: deleteUserL,

        createPin: createPinL,
        deletePin: deletePinL,
        validatePinSimulator,

        addBan: addBanL,
        removeBan: removeBanL,

        modifyUserBalance: modifyUserBalanceL,
        refreshUsers,

        isPinModalOpen,
        setIsPinModalOpen,
        isProductModalOpen,
        setIsProductModalOpen,
        editingProduct,
        setEditingProduct,

        isRoleModalOpen,
        setIsRoleModalOpen,
        editingUser,
        setEditingUser,

        isAddUserModalOpen,
        setIsAddUserModalOpen,

        isBalanceModalOpen,
        setIsBalanceModalOpen,
        balanceTargetUser,
        setBalanceTargetUser,

        isBanModalOpen,
        setIsBanModalOpen,
        banTarget,
        setBanTarget,

        isOrderModalOpen,
        setIsOrderModalOpen,
        selectedOrder,
        setSelectedOrder,

        toasts,
        showToast,
        removeToast,

        auditLogs,
        logAudit,
        clearAuditLogs,

        notifications,
        unreadCount,
        markAllNotificationsRead,
        clearNotifications,

        permissions,
        setPermission,
        resetPermissions,
        viewAsRole,
        setViewAsRole,
        canAccess,

        bulkUpdateOrderStatus,
        bulkUpdateUserRole,
        bulkDeleteUsers,
        bulkUpdateProductStatus,
        bulkDeleteProducts,
        revokePins,
        deletePins,

        health,

        isPaletteOpen,
        setIsPaletteOpen,
        isEndOfDayModalOpen,
        setIsEndOfDayModalOpen,
        triggerEndOfDay,
        theme,
        toggleTheme,
        sidebarCollapsed,
        toggleSidebar,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
