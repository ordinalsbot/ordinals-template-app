import { NextResponse } from 'next/server';

import { MEMPOOL_URL, ORDINALSBOT_PUBLIC_API_KEY } from '@/lib/constants';
import { handleErrorBehaviour, httpError } from '@/lib/utilities';
import apiClient from '@/lib/utilities/apiClient';

export async function GET() {
  try {
    const response = await apiClient.get<number>(`/api/blocks/tip/height`, {
      baseUrl: MEMPOOL_URL,
      headers: {
        'x-api-key': ORDINALSBOT_PUBLIC_API_KEY,
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'CDN-Cache-Control': 'no-store'
      },
      cache: 'no-store'
    });

    const blockHeight = Number(response.data);
    if (isNaN(blockHeight)) {
      throw new httpError('Invalid response format. Expected a number.');
    }

    return NextResponse.json(blockHeight);
  } catch (error: any) {
    return handleErrorBehaviour(error);
  }
}
