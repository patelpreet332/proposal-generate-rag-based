"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProposalAnswer = exports.searchSimilarProposals = exports.insertProposal = void 0;
const db_1 = require("../db");
const embeddingService_1 = require("./embeddingService");
const llmService_1 = require("./llmService");
const insertProposal = async (content, metadata = {}) => {
    const embedding = await (0, embeddingService_1.generateEmbedding)(content);
    const formattedEmbedding = `[${embedding.join(',')}]`;
    const query = `
    INSERT INTO proposals (content, embedding, metadata)
    VALUES ($1, $2, $3)
  `;
    await db_1.pool.query(query, [content, formattedEmbedding, metadata]);
};
exports.insertProposal = insertProposal;
const searchSimilarProposals = async (query) => {
    const embedding = await (0, embeddingService_1.generateEmbedding)(query);
    const formattedEmbedding = `[${embedding.join(',')}]`;
    const sql = `
    SELECT content, metadata,
    1 - (embedding <=> $1) AS similarity
    FROM proposals
    ORDER BY embedding <=> $1
    LIMIT 5;
  `;
    const result = await db_1.pool.query(sql, [formattedEmbedding]);
    return result.rows;
};
exports.searchSimilarProposals = searchSimilarProposals;
const generateProposalAnswer = async (query) => {
    const results = await (0, exports.searchSimilarProposals)(query);
    const MIN_SIMILARITY = 0.5;
    const filteredResults = results.filter((r) => r.similarity >= MIN_SIMILARITY);
    const sortedResults = filteredResults.sort((a, b) => b.similarity - a.similarity);
    const topResults = sortedResults.slice(0, 3);
    if (!topResults.length || topResults[0].similarity < 0.6) {
        return {
            answer: 'I don’t have enough relevant data to answer this.',
            sources: [],
        };
    }
    const context = topResults.map((r) => r.content).join('\n---\n');
    const answer = await (0, llmService_1.generateResponse)(query, context);
    return {
        answer,
        sources: topResults,
    };
};
exports.generateProposalAnswer = generateProposalAnswer;
