'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { DonateMarketView, MdtCadView } from '@/components/ShowcaseDemoViews';

export default function ShowcasePage() {
  const params = useParams();
  const template = (params?.template as string) || 'donate-market';

  if (template === 'mdt-cad') {
    return <MdtCadView />;
  }

  // Default: donate-market
  return <DonateMarketView />;
}
