import { NextRequest, NextResponse } from "next/server";
import { verifyPayuPayment } from "@/actions/payments";

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
    
    if (!txnid) {
      return NextResponse.json({ success: false, message: "Transaction ID missing" }, { status: 400 });
    }
    
    // Verify the payment status with PayU
    const verificationResult = await verifyPayuPayment(txnid);
    
    // Here you would update your database with payment status
    
    return NextResponse.redirect(
      new URL(`/account/user/purchase-plan/payment-status?status=success&txnid=${txnid}`, request.url)
    );
  } catch (error: any) {
    console.error("Payment verification error:", error);
    
    return NextResponse.redirect(
      new URL(`/account/user/purchase-plan/payment-status?status=error&message=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
