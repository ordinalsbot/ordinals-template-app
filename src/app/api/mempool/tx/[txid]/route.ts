import { NextRequest, NextResponse } from 'next/server';

import { MEMPOOL_URL, ORDINALSBOT_PUBLIC_API_KEY } from '@/lib/constants';
import { handleErrorBehaviour, httpError } from '@/lib/utilities';
import apiClient from '@/lib/utilities/apiClient';

export async function GET(_request: NextRequest, context: { params: { txid: string } }) {
  const { txid } = context.params;

  if (!txid) {
    throw new httpError('txid is required', 400);
  }

  const apiUrl = `/api/tx/${txid}?txid=${txid}`;

  try {
    const response = await apiClient.get(apiUrl, {
      baseUrl: MEMPOOL_URL,
      headers: {
        'x-api-key': ORDINALSBOT_PUBLIC_API_KEY,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'CDN-Cache-Control': 'no-store'
      },
      cache: 'no-cache'
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    return handleErrorBehaviour(error);
  }
}
