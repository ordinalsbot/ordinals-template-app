import { MEMPOOL_SPACE_URL } from '@/lib/constants';

export async function GET() {
  try {
    const response = await fetch(`${MEMPOOL_SPACE_URL}/api/v1/fees/recommended`);
    const feeRates = await response.json();
    return Response.json(feeRates);
  } catch (error) {
    console.log(error);
    return Response.json({ success: false, error: 'something went wrong' }, { status: 400 });
  }
}
