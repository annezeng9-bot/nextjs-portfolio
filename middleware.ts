import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const unlocked = request.cookies.get('data_unlocked')?.value;
  if (unlocked !== '1') {
    const url = request.nextUrl.clone();
    url.pathname = '/data';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/data/:path+'],
};
