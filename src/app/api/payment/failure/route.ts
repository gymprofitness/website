import { NextRequest, NextResponse } from "next/server";

// Force dynamic evaluation of the route
export const dynamic = 'force-dynamic';

// Handle OPTIONS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

// Handle POST requests from PayU
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const txnid = formData.get("txnid") as string;
    const error = formData.get("error") as string;
    
    // Here you would update your database with payment failure
    
    return NextResponse.redirect(
      new URL(`/account/user/purchase-plan/payment-status?status=failure&txnid=${txnid}&error=${error}`, request.url)
    );
  } catch (error: any) {
    console.error("Payment failure handling error:", error);
    
    return NextResponse.redirect(
      new URL(`/account/user/purchase-plan/payment-status?status=error&message=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
