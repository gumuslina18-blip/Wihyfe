import { NextResponse } from 'next/server';
import { reloadStore } from '@/lib/serverStore';
import { BILLING_PERIODS, getAllBotProducts } from '@/config/site';

export const dynamic = 'force-dynamic';

export async function GET() {
  const currentStore = reloadStore();
  const allProducts = getAllBotProducts();

  // Compute dynamic periods
  const dynamicPeriods = BILLING_PERIODS.map((period) => {
    let anyPackageAvailable = false;
    let anyStatusBadge: string | undefined = undefined;

    allProducts.forEach((bot) => {
      const cfg = currentStore.packageConfig[bot.id]?.[period.id];
      if (cfg?.isAvailable) {
        anyPackageAvailable = true;
      }
      if (cfg?.statusBadge) {
        anyStatusBadge = cfg.statusBadge;
      }
    });

    const isAvailable = anyPackageAvailable;
    const statusBadge = anyPackageAvailable ? '' : (anyStatusBadge || period.statusBadge || 'Yakında');

    return {
      ...period,
      isAvailable,
      statusBadge: isAvailable ? '' : statusBadge,
    };
  });

  return NextResponse.json({
    packageConfig: currentStore.packageConfig,
    dynamicPeriods,
    productOverrides: currentStore.productOverrides || {},
  });
}
