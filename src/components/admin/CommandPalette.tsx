'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useAdmin, ALL_TABS, AdminTab } from '@/context/AdminContext';
import { IconSearch, IconCommand } from './AdminIcons';

interface PaletteItem {
  id: string;
  group: string;
  label: string;
  hint?: string;
  run: () => void;
}

export default function CommandPalette() {
  const {
    isPaletteOpen,
    setIsPaletteOpen,
    setActiveTab,
    canAccess,
    users,
    orders,
    products,
    pins,
    setIsPinModalOpen,
    setEditingProduct,
    setIsProductModalOpen,
    setIsAddUserModalOpen,
    toggleTheme,
    toggleSidebar,
  } = useAdmin();

  const [query, setQuery] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Ctrl/Cmd + K kısayolu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsPaletteOpen(!isPaletteOpen);
      } else if (e.key === 'Escape' && isPaletteOpen) {
        setIsPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isPaletteOpen, setIsPaletteOpen]);

  useEffect(() => {
    if (isPaletteOpen) {
      setQuery('');
      setCursor(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [isPaletteOpen]);

  const items = useMemo<PaletteItem[]>(() => {
    const close = () => setIsPaletteOpen(false);
    const go = (tab: AdminTab) => () => {
      setActiveTab(tab);
      close();
    };
    const list: PaletteItem[] = [];

    ALL_TABS.filter((t) => canAccess(t.id)).forEach((t) =>
      list.push({ id: `tab_${t.id}`, group: 'Sayfalar', label: t.label, hint: 'Git', run: go(t.id) })
    );

    if (canAccess('pins')) list.push({ id: 'act_pin', group: 'Eylemler', label: 'Yeni PIN oluştur', hint: 'PIN', run: () => { setIsPinModalOpen(true); close(); } });
    if (canAccess('products')) list.push({ id: 'act_prod', group: 'Eylemler', label: 'Yeni ürün ekle', hint: 'Ürün', run: () => { setEditingProduct(null); setIsProductModalOpen(true); close(); } });
    if (canAccess('users')) list.push({ id: 'act_user', group: 'Eylemler', label: 'Yeni kullanıcı ekle', hint: 'Kullanıcı', run: () => { setIsAddUserModalOpen(true); close(); } });
    list.push({ id: 'act_theme', group: 'Eylemler', label: 'Temayı değiştir (koyu / açık)', hint: 'Görünüm', run: () => { toggleTheme(); close(); } });
    list.push({ id: 'act_side', group: 'Eylemler', label: 'Kenar çubuğunu daralt / genişlet', hint: 'Görünüm', run: () => { toggleSidebar(); close(); } });

    if (canAccess('users')) users.forEach((u) => list.push({ id: `u_${u.id}`, group: 'Kullanıcılar', label: `${u.username}#${u.discriminator}`, hint: `${u.role} · ${u.email}`, run: go('users') }));
    if (canAccess('orders')) orders.forEach((o) => list.push({ id: `o_${o.id}`, group: 'Siparişler', label: `${o.id} — ${o.productName}`, hint: `${o.customerName} · ${o.status}`, run: go('orders') }));
    if (canAccess('products')) products.forEach((p) => list.push({ id: `p_${p.id}`, group: 'Ürünler', label: p.name, hint: `₺${p.price} · ${p.status}`, run: go('products') }));
    if (canAccess('pins')) pins.forEach((p) => list.push({ id: `pin_${p.id}`, group: 'PIN', label: p.pin, hint: `${p.status} · ${p.currentUses}/${p.maxUses >= 999 ? '∞' : p.maxUses}`, run: go('pins') }));

    return list;
  }, [canAccess, users, orders, products, pins, setActiveTab, setIsPaletteOpen, setIsPinModalOpen, setEditingProduct, setIsProductModalOpen, setIsAddUserModalOpen, toggleTheme, toggleSidebar]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.filter((i) => i.group === 'Sayfalar' || i.group === 'Eylemler');
    return items.filter((i) => `${i.label} ${i.hint || ''} ${i.group}`.toLowerCase().includes(q)).slice(0, 40);
  }, [items, query]);

  useEffect(() => {
    setCursor(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${cursor}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  if (!isPaletteOpen) return null;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setCursor((c) => Math.min(c + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setCursor((c) => Math.max(c - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      filtered[cursor]?.run();
    }
  };

  let lastGroup = '';

  return (
    <div className="admin-palette-overlay" onClick={() => setIsPaletteOpen(false)}>
      <div className="admin-palette" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Komut paleti">
        <div className="admin-palette-input-row">
          <IconSearch size={16} color="var(--admin-text-dim)" />
          <input
            id="admin-palette-input"
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Sayfa, kullanıcı, sipariş, ürün veya PIN ara…"
            className="admin-palette-input"
            autoComplete="off"
          />
          <kbd className="admin-kbd">Esc</kbd>
        </div>

        <div className="admin-palette-list" ref={listRef}>
          {filtered.length === 0 ? (
            <div className="admin-notif-empty">“{query}” için sonuç bulunamadı.</div>
          ) : (
            filtered.map((item, idx) => {
              const showGroup = item.group !== lastGroup;
              lastGroup = item.group;
              return (
                <React.Fragment key={item.id}>
                  {showGroup && <div className="admin-palette-group">{item.group}</div>}
                  <button
                    type="button"
                    data-idx={idx}
                    className={`admin-palette-item ${idx === cursor ? 'active' : ''}`}
                    onMouseEnter={() => setCursor(idx)}
                    onClick={item.run}
                  >
                    <span className="admin-palette-label">{item.label}</span>
                    {item.hint && <span className="admin-palette-hint">{item.hint}</span>}
                  </button>
                </React.Fragment>
              );
            })
          )}
        </div>

        <div className="admin-palette-foot">
          <span><kbd className="admin-kbd">↑</kbd><kbd className="admin-kbd">↓</kbd> gezin</span>
          <span><kbd className="admin-kbd">Enter</kbd> aç</span>
          <span style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <IconCommand size={11} /> <kbd className="admin-kbd">Ctrl</kbd>+<kbd className="admin-kbd">K</kbd>
          </span>
        </div>
      </div>
    </div>
  );
}
