import ordinalsbot from '@/lib/ob';

export async function GET() {
  return Response.json(await ordinalsbot.Mempool().getFeeEstimation());
};