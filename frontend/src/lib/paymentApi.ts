import { apiRequest } from "./apiClient";

interface VerifyPaymentResponse {
  success: boolean;
  message: string;
  data: {
    alreadyProcessed?: boolean;
    order?: unknown;
    payment?: unknown;
  };
}

export const verifyPayment = async (payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  const data = await apiRequest<VerifyPaymentResponse>("/v1/payments/verify", {
    method: "POST",
    body: payload,
  });

  return data.data;
};

export const loadRazorpayScript = (): Promise<boolean> =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: (response: unknown) => void) => void;
    };
  }
}

interface PaymentConfigResponse {
  success: boolean;
  message: string;
  data: {
    onlineEnabled: boolean;
    providers: { razorpay: boolean; cod: boolean };
    keyId: string | null;
    methods: string[];
  };
}

export const getPaymentConfig = async () => {
  const data = await apiRequest<PaymentConfigResponse>("/v1/payments/config", {
    auth: false,
  });
  return data.data;
};

export const openRazorpayCheckout = async (options: {
  keyId: string;
  orderId: string;
  amount: number;
  currency: string;
  name?: string;
  description?: string;
  /** Prefer this method in Razorpay Checkout (upi | card | netbanking) */
  preferredMethod?: "upi" | "card" | "netbanking";
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  onSuccess: (response: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }) => void | Promise<void>;
  onDismiss?: () => void;
}) => {
  const loaded = await loadRazorpayScript();
  if (!loaded || !window.Razorpay) {
    throw new Error("Unable to load payment gateway. Please try again.");
  }

  const checkoutOptions: Record<string, unknown> = {
    key: options.keyId,
    amount: options.amount,
    currency: options.currency,
    name: options.name || "ENU Foods",
    description: options.description || "Order payment",
    order_id: options.orderId,
    prefill: options.prefill,
    theme: { color: "#284C38" },
    handler: (response: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
    }) => {
      void options.onSuccess(response);
    },
    modal: {
      ondismiss: () => {
        options.onDismiss?.();
      },
    },
  };

  if (options.preferredMethod) {
    checkoutOptions.method = {
      upi: options.preferredMethod === "upi",
      card: options.preferredMethod === "card",
      netbanking: options.preferredMethod === "netbanking",
      wallet: false,
      emi: false,
      paylater: false,
    };
  }

  const razorpay = new window.Razorpay(checkoutOptions);
  razorpay.open();
};
