import axios from "axios";

import { POST } from "@/app/api/ai-career-chat-agent/route";
import { enforceAiAvailability } from "@/lib/ai/kill-switch";

jest.mock("axios", () => ({
    __esModule: true,
    default: {
        post: jest.fn(),
    },
}));

jest.mock("@clerk/nextjs/server", () => ({
    currentUser: jest.fn().mockResolvedValue({
        primaryEmailAddress: { emailAddress: "student@example.com" },
    }),
}));

jest.mock("@/lib/auth-utils", () => ({
    checkUserBlock: jest.fn().mockResolvedValue({ errorResponse: null }),
}));

jest.mock("@/lib/ai/kill-switch", () => ({
    buildAiProviderErrorResponse: jest.fn(),
    enforceAiAvailability: jest.fn().mockResolvedValue(null),
}));

describe("AI Career Chat API Endpoint", () => {
    it("returns 400 for malformed JSON before quota or provider calls", async () => {
        const request = new Request("http://localhost/api/ai-career-chat-agent", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: "not-json",
        });

        const response = await POST(request as any);

        expect(response.status).toBe(400);
        await expect(response.json()).resolves.toEqual({
            error: "Invalid JSON body",
        });
        expect(enforceAiAvailability).not.toHaveBeenCalled();
        expect(axios.post).not.toHaveBeenCalled();
    });
});
