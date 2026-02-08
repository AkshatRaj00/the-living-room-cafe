declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export const initiateRazorpayPayment = (
  amount: number,
  customerDetails: { name: string; email: string; phone: string },
  onSuccess: (paymentId: string) => void,
  onFailure: () => void
) => {
  const options: RazorpayOptions = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_xxxxx', // Replace with your key
    amount: amount * 100, // Amount in paise
    currency: 'INR',
    name: 'The Living Room Cafe',
    description: 'Food Order Payment',
    handler: function (response: any) {
      // Payment successful
      onSuccess(response.razorpay_payment_id)
    },
    prefill: {
      name: customerDetails.name,
      email: customerDetails.email,
      contact: customerDetails.phone,
    },
    theme: {
      color: '#16a34a', // Green color
    },
  }

  const razorpay = new window.Razorpay(options)
  
  razorpay.on('payment.failed', function () {
    onFailure()
  })

  razorpay.open()
}
