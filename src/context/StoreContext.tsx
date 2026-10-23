'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export interface CartItem {
  id: string; // Unique cart item ID (e.g. `${botId}-${period}`)
  productId: string;
  name: string;
  periodLabel: string;
  price: string;
  numericPrice: number;
  icon: string;
  badge?: string;
  paytrUrl?: string;
  periodKey?: string;
}

export interface UserGuild {
  id: string;
  name: string;
  icon: string | null;
  owner?: boolean;
}

export type OrderDeliveryStatus = 'Beklemede' | 'İşlemde' | 'Tamamlandı' | 'İptal Edildi';

export interface UserOrder {
  orderId: string;
  date: string;
  items: Array<{ name: string; periodLabel: string; price: string }>;
  totalFormatted: string;
  serverId: string;
  serverName?: string;
  status: 'Aktif' | 'Onaylandı' | 'PayTR Ödeme Bekleniyor' | string;
  deliveryStatus?: OrderDeliveryStatus | string;
  notes?: string;
  paymentMethod?: string;
  paytrUrl?: string;
}

export interface BalanceTransaction {
  id: string;
  date: string;
  type: 'deposit' | 'spend';
  amount: number;
  amountFormatted: string;
  description: string;
  status: 'Tamamlandı' | 'Beklemede' | 'İptal';
  paymentMethod?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  discriminator: string;
  avatarUrl: string;
  email: string;
  serversCount: number;
  activeBotsCount: number;
  joinedDate: string;
  guilds?: UserGuild[];
  balance?: number;
  role?: string;
  tier?: string;
}

export interface AppliedCoupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discountAmount: number;
  finalTotal: number;
  description?: string;
}

interface StoreContextType {
  // Cart
  cartItems: CartItem[];
  cartCount: number;
  cartTotalFormatted: string;
  cartTotalNumeric: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (cartItemId: string) => void;
  clearCart: () => void;

  // Coupon / Promo
  appliedCoupon: AppliedCoupon | null;
  couponDiscountAmount: number;
  finalCartTotalNumeric: number;
  finalCartTotalFormatted: string;
  applyCoupon: (code: string) => Promise<{ success: boolean; error?: string; discountAmount?: number; finalTotal?: number }>;
  removeCoupon: () => void;

  // Checkout
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  startCheckout: () => void;

  // Orders
  orders: UserOrder[];
  addOrder: (order: UserOrder) => void;
  deleteOrder: (orderId: string) => void;
  clearOrders: () => void;

  // Profile / Auth
  user: UserProfile | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
  loginWithDiscord: () => void;
  logout: () => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;

  // Balance (Bakiye)
  balance: number;
  balanceFormatted: string;
  transactions: BalanceTransaction[];
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  depositPresetAmount: number;
  openDepositModal: (amount?: number) => void;
  depositBalance: (amount: number, paymentMethod: string, note?: string) => Promise<{ success: boolean; bonus: number; newBalance: number }>;
  deductBalance: (amount: number, description: string) => boolean;

  // Dynamic Package Configuration & Product Overrides
  packageConfig: Record<string, Record<string, { isAvailable: boolean; statusBadge?: string; paytrUrl?: string; customPrice?: string }>>;
  dynamicPeriods: any[];
  productOverrides: Record<string, any>;
  getProductOverride: (id: string) => any;
  getPackagePeriodInfo: (botId: string, periodKey: string) => {
    isAvailable: boolean;
    statusBadge: string;
    paytrUrl: string;
    customPrice?: string;
  };
  refreshPackagesConfig: () => Promise<void>;
  syncOrdersWithServer: () => Promise<void>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

const STORAGE_CART_KEY = 'wisp_cart_items';
const STORAGE_USER_KEY = 'wisp_user_session';
const STORAGE_ORDERS_KEY = 'wisp_user_orders';
const STORAGE_BALANCE_KEY = 'wisp_real_user_balance_v2';
const STORAGE_TRANSACTIONS_KEY = 'wisp_real_user_transactions_v2';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [depositPresetAmount, setDepositPresetAmount] = useState<number>(500);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<BalanceTransaction[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  const openDepositModal = useCallback((amount?: number) => {
    if (typeof amount === 'number' && amount > 0) {
      setDepositPresetAmount(amount);
    }
    setIsDepositModalOpen(true);
  }, []);

  // Dynamic Package Configuration & Product Overrides State
  const [packageConfig, setPackageConfig] = useState<Record<string, Record<string, any>>>({});
  const [dynamicPeriods, setDynamicPeriods] = useState<any[]>([]);
  const [productOverrides, setProductOverrides] = useState<Record<string, any>>({});

  const refreshPackagesConfig = useCallback(async () => {
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const json = await res.json();
        if (json.packageConfig) {
          setPackageConfig(json.packageConfig);
        }
        if (json.dynamicPeriods) {
          setDynamicPeriods(json.dynamicPeriods);
        }
        if (json.productOverrides) {
          setProductOverrides(json.productOverrides);
        }
      }
    } catch (err) {
      console.warn('Failed to fetch package config:', err);
    }
  }, []);

  const getProductOverride = useCallback(
    (id: string) => {
      const cleanId = id.replace(/^prod_/, '');
      return (
        productOverrides[id] ||
        productOverrides[cleanId] ||
        productOverrides[`prod_${cleanId}`] ||
        null
      );
    },
    [productOverrides]
  );

  const getPackagePeriodInfo = useCallback(
    (botId: string, periodKey: string) => {
      const periodConf = packageConfig[botId]?.[periodKey];
      return {
        isAvailable: periodConf ? periodConf.isAvailable : false,
        statusBadge:
          periodConf?.statusBadge !== undefined
            ? periodConf.statusBadge
            : 'Yakında',
        paytrUrl: periodConf?.paytrUrl || '',
        customPrice: periodConf?.customPrice,
      };
    },
    [packageConfig]
  );

  const syncOrdersWithServer = useCallback(async () => {
    try {
      const res = await fetch('/api/orders', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json.orders) && json.orders.length > 0) {
          setOrders((prev) => {
            const updated = prev.map((localOrder) => {
              const serverMatch = json.orders.find((so: any) => so.id === localOrder.orderId);
              if (serverMatch) {
                const mappedStatus: 'Aktif' | 'Onaylandı' | 'PayTR Ödeme Bekleniyor' =
                  serverMatch.status === 'active' || serverMatch.deliveryStatus === 'Tamamlandı'
                    ? 'Onaylandı'
                    : serverMatch.status === 'cancelled' || serverMatch.deliveryStatus === 'İptal Edildi'
                    ? 'PayTR Ödeme Bekleniyor'
                    : 'PayTR Ödeme Bekleniyor';

                return {
                  ...localOrder,
                  status: mappedStatus,
                  deliveryStatus: serverMatch.deliveryStatus || 'Beklemede',
                  notes: serverMatch.notes || localOrder.notes,
                };
              }
              return localOrder;
            });
            try {
              localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
            } catch {}
            return updated;
          });
        }
      }
    } catch (e) {
      console.warn('Failed to sync orders with server:', e);
    }
  }, []);

  // Hydrate from localStorage and verify real backend session
  useEffect(() => {
    setIsMounted(true);
    refreshPackagesConfig();
    syncOrdersWithServer();

    // Periodic order sync every 12 seconds so delivery updates reflect in real-time
    const orderInterval = setInterval(() => {
      syncOrdersWithServer();
    }, 12000);

    const handleProductsUpdated = () => {
      refreshPackagesConfig();
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('wisp_products_updated', handleProductsUpdated);
    }
    return () => {
      clearInterval(orderInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('wisp_products_updated', handleProductsUpdated);
      }
    };
  }, [refreshPackagesConfig, syncOrdersWithServer]);

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(STORAGE_CART_KEY);
      if (savedCart) {
        setCartItems(JSON.parse(savedCart));
      }
      const savedUserStr = localStorage.getItem(STORAGE_USER_KEY);
      if (savedUserStr) {
        const parsedUser = JSON.parse(savedUserStr);
        if (parsedUser && parsedUser.id) {
          setUser(parsedUser);
          if (typeof parsedUser.balance === 'number') {
            setBalance(parsedUser.balance);
          }
          if (Array.isArray(parsedUser.transactions)) {
            setTransactions(parsedUser.transactions);
          }
          if (Array.isArray(parsedUser.orders)) {
            setOrders(parsedUser.orders);
          }
          fetch('/api/user/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: parsedUser.id,
              username: parsedUser.username,
              discriminator: parsedUser.discriminator,
              avatarUrl: parsedUser.avatarUrl,
              email: parsedUser.email,
              role: parsedUser.role || 'Müşteri',
              tier: parsedUser.tier || 'Free',
              balance: parsedUser.balance || 0,
            }),
          }).catch(() => {});
        } else {
          // Incomplete or invalid cached user
          setUser(null);
          setBalance(0);
          setTransactions([]);
          setOrders([]);
        }
      } else {
        // Not logged in: strictly clean state
        setUser(null);
        setBalance(0);
        setTransactions([]);
        setOrders([]);
      }

      // Purge any legacy global balance keys from old test sessions
      localStorage.removeItem('wisp_user_balance');
      localStorage.removeItem('wisp_user_transactions');
      localStorage.removeItem('wisp_balance_v2');
      localStorage.removeItem('wisp_transactions_v2');
    } catch (e) {
      console.error('Failed to load store from localStorage', e);
    }

    // Verify real Discord session from backend cookie and hydrate authoritative server data
    const refreshUserSession = () => {
      fetch('/api/auth/me', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          if (data?.user && data.user.id) {
            const u = data.user;
            setUser(u);
            setBalance(typeof u.balance === 'number' ? u.balance : 0);
            setTransactions(Array.isArray(u.transactions) ? u.transactions : []);
            setOrders(Array.isArray(u.orders) ? u.orders : []);
            try {
              localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(u));
              localStorage.setItem(STORAGE_BALANCE_KEY, (u.balance || 0).toString());
              localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(u.transactions || []));
              localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(u.orders || []));
            } catch {}

            // Proactively sync this customer presence to server and cloud store
            fetch('/api/user/sync', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: u.id,
                username: u.username,
                discriminator: u.discriminator,
                avatarUrl: u.avatarUrl,
                email: u.email,
                role: u.role || 'Müşteri',
                tier: u.tier || 'Free',
                balance: u.balance || 0,
              }),
            }).catch(() => {});
          } else {
            // Server confirmed NOT LOGGED IN: Wipe all user-specific data!
            setUser(null);
            setBalance(0);
            setTransactions([]);
            setOrders([]);
            try {
              localStorage.removeItem(STORAGE_USER_KEY);
              localStorage.removeItem(STORAGE_BALANCE_KEY);
              localStorage.removeItem(STORAGE_TRANSACTIONS_KEY);
              localStorage.removeItem(STORAGE_ORDERS_KEY);
              localStorage.removeItem('wisp_balance_v2');
              localStorage.removeItem('wisp_user_balance');
            } catch {}
          }
        })
        .catch((err) => {
          console.warn('Failed to fetch auth session:', err);
        });
    };

    refreshUserSession();
    const sessionPollInterval = setInterval(refreshUserSession, 10000);

    // Handle OAuth query params if any
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      // Handle referral query param (?ref=...)
      const refParam = params.get('ref');
      if (refParam) {
        localStorage.setItem('wisp_referrer_code', refParam.trim().toLowerCase());
      }

      const authError = params.get('auth_error');
      if (authError) {
        alert(`Discord Giriş Uyarısı:\n${authError}`);
        window.history.replaceState({}, '', window.location.pathname);
      }
      if (params.get('auth_success')) {
        refreshUserSession();
        window.history.replaceState({}, '', window.location.pathname);
      }
    }

    const handleBalanceUpdate = () => {
      refreshUserSession();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('wisp_balance_updated', handleBalanceUpdate);
      window.addEventListener('storage', handleBalanceUpdate);
    }

    return () => {
      clearInterval(sessionPollInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('wisp_balance_updated', handleBalanceUpdate);
        window.removeEventListener('storage', handleBalanceUpdate);
      }
    };
  }, []);

  // Sync cart to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems, isMounted]);

  // Sync user to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (user) {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_USER_KEY);
      }
    } catch (e) {
      console.error('Failed to save user to localStorage', e);
    }
  }, [user, isMounted]);

  // Sync orders to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
    } catch (e) {
      console.error('Failed to save orders to localStorage', e);
    }
  }, [orders, isMounted]);

  const addToCart = useCallback((item: Omit<CartItem, 'id'>) => {
    const uniqueId = `${item.productId}-${item.periodLabel}`;
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === uniqueId);
      if (existing) {
        return prev; // Already in cart
      }
      return [...prev, { ...item, id: uniqueId }];
    });
    // Open drawer smoothly after the flying particle lands (~680ms)
    setTimeout(() => {
      setIsCartOpen(true);
    }, 680);
  }, []);

  const removeFromCart = useCallback((cartItemId: string) => {
    setCartItems((prev) => {
      const next = prev.filter((item) => item.id !== cartItemId);
      if (next.length === 0) setAppliedCoupon(null);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAppliedCoupon(null);
  }, []);

  const cartCount = cartItems.length;

  const cartTotalNumeric = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + (item.numericPrice || 0), 0);
  }, [cartItems]);

  const cartTotalFormatted = useMemo(() => {
    return cartTotalNumeric.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [cartTotalNumeric]);

  const couponDiscountAmount = useMemo(() => {
    if (!appliedCoupon || cartTotalNumeric <= 0) return 0;
    if (appliedCoupon.discountType === 'percentage') {
      return Math.round((cartTotalNumeric * appliedCoupon.discountValue) / 100);
    }
    return Math.min(cartTotalNumeric, appliedCoupon.discountValue);
  }, [appliedCoupon, cartTotalNumeric]);

  const finalCartTotalNumeric = useMemo(() => {
    return Math.max(0, cartTotalNumeric - couponDiscountAmount);
  }, [cartTotalNumeric, couponDiscountAmount]);

  const finalCartTotalFormatted = useMemo(() => {
    return finalCartTotalNumeric.toLocaleString('tr-TR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }, [finalCartTotalNumeric]);

  const applyCoupon = useCallback(
    async (code: string) => {
      if (!code || !code.trim()) {
        return { success: false, error: 'Lütfen bir kupon kodu giriniz.' };
      }
      try {
        const res = await fetch('/api/coupons', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: code.trim().toUpperCase(), cartTotal: cartTotalNumeric }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          return { success: false, error: data.error || 'Geçersiz kupon kodu.' };
        }
        const c = data.coupon;
        setAppliedCoupon({
          code: c.code,
          discountType: c.discountType,
          discountValue: c.discountValue,
          discountAmount: data.discountAmount,
          finalTotal: data.finalTotal,
          description: c.description,
        });
        return {
          success: true,
          discountAmount: data.discountAmount,
          finalTotal: data.finalTotal,
        };
      } catch (e: any) {
        return { success: false, error: 'Kupon doğrulanırken hata oluştu.' };
      }
    },
    [cartTotalNumeric]
  );

  const removeCoupon = useCallback(() => {
    setAppliedCoupon(null);
  }, []);

  const startCheckout = useCallback(() => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  }, []);

  const addOrder = useCallback((newOrder: UserOrder) => {
    setOrders((prev) => {
      const updated = [newOrder, ...prev];
      if (user?.id || user?.username) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            orders: updated,
          }),
        }).catch((err) => console.warn('Failed to sync orders to user record:', err));
      }
      return updated;
    });
    setUser((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        activeBotsCount: (prev.activeBotsCount || 0) + newOrder.items.length,
      };
    });
  }, [user]);

  const deleteOrder = useCallback((orderId: string) => {
    setOrders((prev) => {
      const updated = prev.filter((o) => o.orderId !== orderId);
      try {
        localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update orders in localStorage', e);
      }
      return updated;
    });
  }, []);

  const clearOrders = useCallback(() => {
    setOrders([]);
    try {
      localStorage.removeItem(STORAGE_ORDERS_KEY);
    } catch (e) {
      console.error('Failed to clear orders in localStorage', e);
    }
  }, []);

  const loginWithDiscord = useCallback(() => {
    // Redirect to real Discord OAuth endpoint
    window.location.href = '/api/auth/discord';
  }, []);



  const logout = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error('Logout error:', e);
    }
    setUser(null);
    setBalance(0);
    setTransactions([]);
    setOrders([]);
    try {
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_BALANCE_KEY);
      localStorage.removeItem(STORAGE_TRANSACTIONS_KEY);
      localStorage.removeItem(STORAGE_ORDERS_KEY);
      localStorage.removeItem('wisp_balance_v2');
      localStorage.removeItem('wisp_user_balance');
      localStorage.removeItem('wisp_transactions_v2');
      localStorage.removeItem('wisp_user_transactions');
      localStorage.removeItem('wisp_user_orders_v2');
    } catch (e) {
      console.error(e);
    }
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated: UserProfile = { ...prev, ...updates };
      try {
        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save user profile:', e);
      }

      // Persist to server store
      fetch('/api/user/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updated,
          userId: updated.id,
        }),
      }).catch((err) => console.warn('Failed to sync profile to server:', err));

      return updated;
    });
  }, []);



  // Sync balance to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (user && user.id) {
        localStorage.setItem(STORAGE_BALANCE_KEY, balance.toString());
      } else {
        localStorage.removeItem(STORAGE_BALANCE_KEY);
      }
    } catch (e) {
      console.error('Failed to save balance to localStorage', e);
    }
  }, [balance, isMounted, user]);

  // Sync transactions to localStorage
  useEffect(() => {
    if (!isMounted) return;
    try {
      if (user && user.id) {
        localStorage.setItem(STORAGE_TRANSACTIONS_KEY, JSON.stringify(transactions));
      } else {
        localStorage.removeItem(STORAGE_TRANSACTIONS_KEY);
      }
    } catch (e) {
      console.error('Failed to save transactions to localStorage', e);
    }
  }, [transactions, isMounted, user]);

  const balanceFormatted = useMemo(() => {
    if (!user) return '0,00 TL';
    return (
      balance.toLocaleString('tr-TR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }) + ' TL'
    );
  }, [balance, user]);

  const depositBalance = useCallback(
    async (amount: number, paymentMethod: string, note?: string) => {
      const tx: BalanceTransaction = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'deposit',
        amount: amount,
        amountFormatted: `+${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
        description: note || `Bakiye Yükleme (${paymentMethod})`,
        status: 'Tamamlandı',
        paymentMethod,
      };

      const newBal = balance + amount;
      const newTxs = [tx, ...transactions];

      setBalance(newBal);
      setTransactions(newTxs);

      if (user?.id || user?.username) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            balance: newBal,
            transactions: newTxs,
          }),
        }).catch((err) => console.warn('Failed to sync balance deposit to server:', err));
      }

      return {
        success: true,
        bonus: 0,
        newBalance: newBal,
      };
    },
    [balance, transactions, user]
  );

  const deductBalance = useCallback(
    (amount: number, description: string) => {
      if (balance < amount) return false;

      const tx: BalanceTransaction = {
        id: `TX-${Date.now().toString().slice(-6)}`,
        date: new Date().toLocaleDateString('tr-TR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        type: 'spend',
        amount,
        amountFormatted: `-${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL`,
        description,
        status: 'Tamamlandı',
        paymentMethod: 'Mevcut Bakiye',
      };

      const newBal = Math.max(0, balance - amount);
      const newTxs = [tx, ...transactions];

      setBalance(newBal);
      setTransactions(newTxs);

      if (user?.id || user?.username) {
        fetch('/api/user/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id,
            username: user.username,
            balance: newBal,
            transactions: newTxs,
          }),
        }).catch((err) => console.warn('Failed to sync balance spend to server:', err));
      }

      return true;
    },
    [balance, transactions, user]
  );

  const value = useMemo(
    () => ({
      cartItems,
      cartCount,
      cartTotalFormatted,
      cartTotalNumeric,
      appliedCoupon,
      couponDiscountAmount,
      finalCartTotalNumeric,
      finalCartTotalFormatted,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      clearCart,
      isCheckoutOpen,
      setIsCheckoutOpen,
      startCheckout,
      orders,
      addOrder,
      deleteOrder,
      clearOrders,
      user,
      isLoggedIn: !!user,
      isLoginModalOpen,
      setIsLoginModalOpen,
      loginWithDiscord,
      logout,
      updateUserProfile,
      balance,
      balanceFormatted,
      transactions,
      isDepositModalOpen,
      setIsDepositModalOpen,
      depositPresetAmount,
      openDepositModal,
      depositBalance,
      deductBalance,
      packageConfig,
      dynamicPeriods,
      productOverrides,
      getProductOverride,
      getPackagePeriodInfo,
      refreshPackagesConfig,
      syncOrdersWithServer,
    }),
    [
      cartItems,
      cartCount,
      cartTotalFormatted,
      cartTotalNumeric,
      appliedCoupon,
      couponDiscountAmount,
      finalCartTotalNumeric,
      finalCartTotalFormatted,
      applyCoupon,
      removeCoupon,
      isCartOpen,
      addToCart,
      removeFromCart,
      clearCart,
      isCheckoutOpen,
      startCheckout,
      orders,
      addOrder,
      deleteOrder,
      clearOrders,
      user,
      isLoginModalOpen,
      loginWithDiscord,
      logout,
      updateUserProfile,
      balance,
      balanceFormatted,
      transactions,
      isDepositModalOpen,
      depositPresetAmount,
      openDepositModal,
      depositBalance,
      deductBalance,
      packageConfig,
      dynamicPeriods,
      productOverrides,
      getProductOverride,
      getPackagePeriodInfo,
      refreshPackagesConfig,
      syncOrdersWithServer,
    ]
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
