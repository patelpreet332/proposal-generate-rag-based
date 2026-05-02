"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmbedding = void 0;
const transformers_1 = require("@xenova/transformers");
let extractor = null;
const getEmbedding = async (text) => {
    if (!extractor) {
        extractor = await (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    const result = await extractor(text, {
        pooling: 'mean',
        normalize: true,
    });
    return Array.from(result.data);
};
exports.getEmbedding = getEmbedding;
