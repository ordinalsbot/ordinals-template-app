import { NextResponse } from 'next/server';

import { ApiClient } from '..';

export class httpError extends Error {
  statusCode: number;
  errors: Array<Record<string, any>> | null;
  constructor(message: string, statusCode: number = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Object.setPrototypeOf(this, httpError.prototype);
  }
}

export const handleErrorBehaviour = async (error: unknown) => {
  if (error instanceof httpError) {
    const errorVal = error.errors ?? [
      {
        msg: error.message
      }
    ];
    return NextResponse.json({ success: false, errors: errorVal }, { status: error.statusCode });
  }

  console.error('Internal error: ', error);
  return NextResponse.json(
    { success: false, errors: [{ msg: ApiClient.defaultErrorMessage(500, 'An unknown error occurred') }] },
    { status: 500 }
  );
};
