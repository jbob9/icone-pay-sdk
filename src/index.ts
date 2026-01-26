import {
    IconePaySDKOptions,
    InitPaymentParams,
    InitPaymentResponse,
    initPaymentSchema,
} from "./types.js";

const DEFAULT_BASE_URL = "https://pay.iconeht.com";

export class IconePaySDK {
    private readonly apiKey: string;
    private readonly baseUrl: string;
    private readonly fetchFn: typeof fetch;

    constructor(apiKey: string, options: IconePaySDKOptions = {}) {
        if (!apiKey) {
            throw new Error("IconePaySDK requires a valid API key");
        }

        this.apiKey = apiKey;
        this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL;
        const selectedFetch = options.fetchFn ?? globalThis.fetch;

        if (!selectedFetch) {
            throw new Error(
                "Fetch API is not available. Provide a custom fetchFn in the SDK options."
            );
        }

        this.fetchFn = selectedFetch;
    }

    async initPayment(
        payload: InitPaymentParams
    ): Promise<InitPaymentResponse> {
        const parsedPayload = initPaymentSchema.safeParse(payload);

        if (!parsedPayload.success) {
            const message = parsedPayload.error.issues
                .map(
                    (issue) =>
                        `${issue.path.join(".") || "payload"}: ${issue.message}`
                )
                .join("; ");

            return {
                error: true,
                message,
            };
        }

        const mode = parsedPayload.data.mode ?? "live";
        const endpoint = mode === "test" ? "/api/test-payment" : "/api/init-payment";

        // Remove mode from payload before sending to API
        const { mode: _, ...apiPayload } = parsedPayload.data;

        try {
            const response = await this.fetchFn(`${this.baseUrl}${endpoint}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-api-key": this.apiKey,
                },
                body: JSON.stringify(apiPayload),
            });

            if (!response.ok) {
                const errorText = await response.text();
                return {
                    error: true,
                    message:
                        errorText || "Icone Pay API returned an unexpected response",
                };
            }

            const result = (await response.json()) as {
                url?: string;
                message?: string;
            };

            return {
                error: false,
                message: result.message ?? "Payment initiated successfully",
                url: result.url ?? "",
            };
        } catch (error) {
            const message =
                error instanceof Error ? error.message : "Unknown error";
            return {
                error: true,
                message,
                url: null,
            };
        }
    }
}

export * from "./types.js";

