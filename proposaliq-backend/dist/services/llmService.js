"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateResponse = void 0;
const groq_sdk_1 = __importDefault(require("groq-sdk"));
const env_1 = require("../config/env");
const groq = new groq_sdk_1.default({
    apiKey: env_1.ENV.GROQ_API_KEY,
});
const generateResponse = async (query, context) => {
    const prompt = `
You are generating a proposal based ONLY on the provided context.

Rules:
- Do NOT invent pricing, timelines, or assumptions
- Use only the given context
- Keep response concise and practical
- Focus on real capabilities and implementation

Context:
${context}

User Query:
${query}

Generate a professional proposal.
`;
    const completion = await groq.chat.completions.create({
        model: env_1.ENV.GROQ_MODEL,
        messages: [
            {
                role: 'user',
                content: prompt,
            },
        ],
        temperature: 0.3,
    });
    return completion.choices[0]?.message?.content || '';
};
exports.generateResponse = generateResponse;
