import { z } from "zod";

export const initPaymentSchema = z.object({
    action: z.string(),
    successUrl: z.string(),
    cancelUrl: z.string(),
    currency: z.enum(["htg", "usd"]).default("htg"),
    shipping: z.number().default(0).optional(),
    taxes: z.number().default(0).optional(),
    discount: z
        .object({
            code: z.string(),
            amount: z.number(),
        })
        .optional(),
    amount: z.number(),
    referenceId: z.string(),
    items: z
        .object({
            name: z.string(),
            quantity: z.number().min(1),
            imageUrl: z.string().url().optional(),
            currency: z.enum(["htg", "usd"]).default("htg"),
            unitPrice: z.number().min(0),
        })
        .array(),
});

export type InitPaymentParams = z.infer<typeof initPaymentSchema>;

export interface InitPaymentResponse {
    error: boolean;
    message: string;
    url?: string | null;
}

export interface IconePaySDKOptions {
    baseUrl?: string;
    fetchFn?: typeof fetch;
}
