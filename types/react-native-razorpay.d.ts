declare module 'react-native-razorpay' {
    export interface RazorpayOptions {
        /** Razorpay API Key ID (rzp_live_xxx or rzp_test_xxx) */
        key: string;
        /** Amount in paise (INR × 100) */
        amount: number;
        /** 3-letter ISO currency code, e.g. 'INR' */
        currency?: string;
        /** Display name of your business */
        name?: string;
        /** Short description shown in the payment sheet */
        description?: string;
        /** Order ID generated on your server via Razorpay API */
        order_id?: string;
        /** URL to your business logo */
        image?: string;
        /** Pre-fill customer details */
        prefill?: {
            name?: string;
            email?: string;
            contact?: string;
        };
        /** Customise the checkout UI */
        theme?: {
            color?: string;
            hide_topbar?: boolean;
        };
        /** Extra notes attached to the payment */
        notes?: Record<string, string>;
        /** Restrict/allow specific payment methods */
        config?: {
            display?: {
                blocks?: Record<string, { name: string; instruments: object[] }>;
                sequence?: string[];
                preferences?: { show_default_blocks?: boolean };
            };
        };
    }

    export interface RazorpaySuccessResponse {
        /** Razorpay Payment ID */
        razorpay_payment_id: string;
        /** Razorpay Order ID (if order_id was passed) */
        razorpay_order_id?: string;
        /** HMAC-SHA256 signature for server-side verification */
        razorpay_signature?: string;
    }

    export interface RazorpayError {
        /** Error code: 0 = network, 2 = user dismissed */
        code: number;
        description: string;
    }

    const RazorpayCheckout: {
        open(options: RazorpayOptions): Promise<RazorpaySuccessResponse>;
    };

    export default RazorpayCheckout;
}
