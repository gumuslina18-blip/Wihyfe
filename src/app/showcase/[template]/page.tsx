'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DonateMarketView, MdtCadView, CashVCommunityView } from '@/components/ShowcaseDemoViews';

export default function ShowcasePage() {
  const params = useParams();
  const template = (params?.template as string) || 'donate-market';

  if (template === 'mdt-cad') {
    return <MdtCadView />;
  }
  if (template === 'community-cashv' || template === 'cashv' || template === 'community') {
    return <CashVCommunityView />;
  }

  // Default: donate-market
  return <DonateMarketView />;
}
