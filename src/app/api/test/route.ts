import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const type = req.nextUrl.searchParams.get('type');

  switch (type) {
    case 'json':
      return NextResponse.json({ message: 'This is a JSON response' });

    case 'text':
      return new NextResponse('This is plain text response', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      });

    case 'html':
      return new NextResponse('<html><body><h1>This is an HTML response</h1></body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      });

    case 'blob':
      const data = new Uint8Array([72, 101, 108, 108, 111]); // "Hello" in bytes
      return new NextResponse(data, {
        status: 200,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename="dummy.bin"'
        }
      });

    default:
      return new NextResponse('Invalid or missing type. Use ?type=json|text|html|blob', {
        status: 400,
        headers: { 'Content-Type': 'text/plain' }
      });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    message: 'POST request received',
    receivedData: body
  });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  return NextResponse.json({
    message: 'PUT request received',
    updatedData: body
  });
}

export async function DELETE() {
  return NextResponse.json({
    message: 'DELETE request received. Resource deleted.'
  });
}
