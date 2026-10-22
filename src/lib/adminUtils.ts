/**
 * Admin panel yardımcıları: tarih ayrıştırma, günlük kovalar (gerçek veriden grafik)
 * ve CSV dışa aktarma. Hiçbir sahte veri üretmez.
 */

/** "17.10.2026" veya "17.10.2026 19:45" biçimini Date'e çevirir. Geçersizse null. */
export function parseTrDate(value?: string): Date | null {
  if (!value) return null;
  const m = value.match(/(\d{1,2})\.(\d{1,2})\.(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if (!m) return null;
  const [, d, mo, y, h, mi] = m;
  const date = new Date(Number(y), Number(mo) - 1, Number(d), Number(h || 0), Number(mi || 0));
  return isNaN(date.getTime()) ? null : date;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export interface DayBucket {
  label: string;
  date: Date;
  count: number;
  sum: number;
}

/** Son `days` günü (bugün dahil) kovalara ayırır. Gerçek kayıtlardan sayım ve toplam üretir. */
export function dailyBuckets<T>(
  items: T[],
  getDate: (item: T) => string | undefined,
  days: number,
  getValue?: (item: T) => number,
  filter?: (item: T) => boolean
): DayBucket[] {
  const today = startOfDay(new Date());
  const buckets: DayBucket[] = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    buckets.push({
      date,
      count: 0,
      sum: 0,
      label: date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' }),
    });
  }
  items.forEach((item) => {
    if (filter && !filter(item)) return;
    const parsed = parseTrDate(getDate(item));
    if (!parsed) return;
    const day = startOfDay(parsed).getTime();
    const bucket = buckets.find((b) => b.date.getTime() === day);
    if (bucket) {
      bucket.count += 1;
      bucket.sum += getValue ? getValue(item) : 0;
    }
  });
  return buckets;
}

/** Değer dizisini SVG sparkline yoluna (viewBox 0 0 100 40) çevirir. Tümü 0 ise düz çizgi. */
export function sparklinePath(values: number[]): string {
  if (values.length < 2) return 'M 0,34 L 100,34';
  const max = Math.max(...values);
  const step = 100 / (values.length - 1);
  return values
    .map((v, i) => {
      const x = i * step;
      const y = max === 0 ? 34 : 34 - (v / max) * 28;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function csvCell(value: unknown): string {
  const s = value === undefined || value === null ? '' : String(value);
  // Excel formül enjeksiyonunu engelle
  const safe = /^[=+\-@]/.test(s) ? `'${s}` : s;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** Tarayıcıda CSV indirir (UTF-8 BOM ile, Excel Türkçe karakter uyumlu). */
export function downloadCsv(filename: string, header: string[], rows: unknown[][]): void {
  if (typeof window === 'undefined') return;
  const lines = [header, ...rows].map((r) => r.map(csvCell).join(';'));
  const blob = new Blob(['\ufeff' + lines.join('\r\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** PIN son kullanma tarihine kalan gün. Ayrıştırılamazsa null. */
export function daysUntil(dateStr?: string): number | null {
  const d = parseTrDate(dateStr);
  if (!d) return null;
  const end = startOfDay(d).getTime() + 24 * 3600 * 1000;
  return Math.ceil((end - Date.now()) / (24 * 3600 * 1000));
}
