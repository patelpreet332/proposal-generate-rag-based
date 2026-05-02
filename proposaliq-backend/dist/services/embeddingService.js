"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateEmbedding = void 0;
const transformers_1 = require("@xenova/transformers");
let extractor = null;
const loadModel = async () => {
    if (!extractor) {
        extractor = await (0, transformers_1.pipeline)('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    }
    return extractor;
};
const generateEmbedding = async (text) => {
    const model = await loadModel();
    const result = await model(text, {
        pooling: 'mean',
        normalize: true,
    });
    return Array.from(result.data);
};
exports.generateEmbedding = generateEmbedding;
