import Anthropic from "@anthropic-ai/sdk";

export const ai = new Anthropic({
    apiKey : process.env.CLAUDE_API_KEY,
})