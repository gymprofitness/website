// app/api/payment/success/route.ts
import { NextRequest } from "next/server";

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const txnid = formData.get("txnid") as string;
    const status = formData.get("status") as string;
    const mihpayid = formData.get("mihpayid") as string;
    
    // Here you would update your database with payment status
    // await updatePaymentInDatabase(txnid, status, mihpayid);
    
    // Return a 302 redirect to change from POST to GET
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/account/user/purchase-plan/payment-status?status=${status || "success"}&txnid=${txnid}`
      }
    });
  } catch (error: any) {
    console.error("Payment success handling error:", error);
    
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/account/user/purchase-plan/payment-status?status=error&message=${encodeURIComponent(error.message)}`
      }
    });
  }
}

// Also implement OPTIONS for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}
