"use client";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import PageTitle from "@/components/ui/page-title";
import { CheckCircle, XCircle } from "lucide-react";
import { Suspense } from "react";

// Create a separate component that uses useSearchParams
function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const txnid = searchParams.get("txnid");
  const error = searchParams.get("error");
  
  return (
    <div className="mt-8 p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
      {status === "success" ? (
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Successful</h2>
          <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Transaction ID:</span>
              <span className="font-medium">{txnid}</span>
            </div>
          </div>
          <Button asChild>
            <a href="/account/user/dashboard">Go to Dashboard</a>
          </Button>
        </div>
      ) : (
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-2">
            {error ? `Error: ${error}` : "Your payment could not be processed."}
          </p>
          <p className="text-gray-600 mb-6">Please try again or contact support if the issue persists.</p>
          <Button asChild>
            <a href="/account/user/purchase-plan">Try Again</a>
          </Button>
        </div>
      )}
    </div>
  );
}

// Main component with Suspense boundary
export default function PaymentStatusPage() {
  return (
    <div className="max-w-4xl mx-auto px-4">
      <PageTitle title="Payment Status" />
      <Suspense fallback={<div className="mt-8 p-8 text-center">Loading payment status...</div>}>
        <PaymentStatusContent />
      </Suspense>
    </div>
  );
}
