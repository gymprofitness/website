"use server";
import crypto from "crypto";

// PayU configuration
const MERCHANT_KEY = process.env.PAYU_MERCHANT_KEY || "";
const MERCHANT_SALT = process.env.PAYU_MERCHANT_SALT || "";
const ENVIRONMENT = process.env.NODE_ENV === "production" ? "LIVE" : "TEST";
const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://trackyfy.in.net";

// Generate hash for PayU
const generateHash = (data: any) => {
  const hashString = `${MERCHANT_KEY}|${data.txnid}|${data.amount}|${data.productinfo}|${data.firstname}|${data.email}|||||||||||${MERCHANT_SALT}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

export const initiatePayuPayment = async (paymentData: {
  txnid: string;
  amount: number;
  productinfo: string;
  firstname: string;
  email: string;
  phone: string;
}) => {
  try {
    const data = {
      key: MERCHANT_KEY,
      txnid: paymentData.txnid,
      amount: paymentData.amount,
      productinfo: paymentData.productinfo,
      firstname: paymentData.firstname,
      email: paymentData.email,
      phone: paymentData.phone,
      surl: `${BASE_URL}/api/payment/success`,
      furl: `${BASE_URL}/api/payment/failure`,
    };

    // Generate hash
    const hash = generateHash(data);

    return {
      success: true,
      data: {
        ...data,
        hash,
        environment: ENVIRONMENT,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const verifyPayuPayment = async (txnid: string) => {
  try {
    // For a real implementation, you would verify with PayU API
    // This is a simplified version
    return {
      success: true,
      data: {
        txnid,
        status: "success",
        amount: 0,
        mode: "Credit Card"
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};
