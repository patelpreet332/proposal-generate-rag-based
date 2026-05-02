"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const proposalService_1 = require("../services/proposalService");
const router = express_1.default.Router();
router.post('/add', async (req, res) => {
    try {
        const { content, metadata } = req.body;
        await (0, proposalService_1.insertProposal)(content, metadata);
        res.json({ message: 'Proposal stored successfully' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Insert failed' });
    }
});
router.post('/search', async (req, res) => {
    try {
        const { query } = req.body;
        const results = await (0, proposalService_1.searchSimilarProposals)(query);
        res.json({ results });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Search failed' });
    }
});
//Full RAG
router.post('/ask', async (req, res) => {
    try {
        const { query } = req.body;
        const response = await (0, proposalService_1.generateProposalAnswer)(query);
        res.json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'RAG failed' });
    }
});
exports.default = router;
