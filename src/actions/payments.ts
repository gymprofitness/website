"use server";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export const getStripePaymentIntent = async (amount: number) => {
  try {
    console.log(`Creating payment intent for amount: ${amount}`);
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Amount in cents
      currency: "inr",
      description: "Payment for your order",
    });
    console.log("Payment intent created successfully");
    return {
      success: true,
      data: paymentIntent.client_secret,
    };
  } catch (error: any) {
    console.error("Error creating payment intent:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};
