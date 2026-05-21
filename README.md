# Proposal Generate Rag Based

## Project Overview
proposal-generate is an AI-powered proposal generation system that helps teams draft client-ready proposals using retrieval-augmented generation (RAG) over historical proposal content.

The platform combines a Next.js frontend with an Express/TypeScript backend, PostgreSQL vector search, local embedding generation, and Groq-hosted LLM inference. A user submits a new client requirement, the system retrieves the most relevant past proposals using vector similarity, and an LLM generates a grounded response based only on that retrieved context.

### Business Purpose
proposal-generate is designed to reduce proposal turnaround time, improve consistency across client responses, and help sales or delivery teams reuse institutional knowledge captured in previous proposals.

### Core Functionality
- Accepts a natural-language project requirement from the user
- Converts the query into embeddings
- Searches a proposal knowledge base using vector similarity
- Filters and ranks the most relevant prior proposals
- Generates a concise proposal draft based on retrieved context only
- Returns both the generated answer and the supporting proposal sources

### Main Problem Solved
proposal-generate solves the problem of slow, inconsistent, and manually repetitive proposal drafting by turning historical proposal content into a searchable AI knowledge layer.

## Features
### Main Capabilities
- Proposal knowledge base ingestion via API
- Semantic similarity search over stored proposals
- AI-generated proposal drafting grounded in retrieved context
- Relevance scoring for retrieved proposal matches
- Simple UI for entering requirements and reviewing AI output

### AI Features
- Retrieval-augmented generation (RAG)
- Local embedding generation using `Xenova/all-MiniLM-L6-v2`
- LLM answer generation through Groq
- Similarity thresholding to reduce hallucinated or weakly grounded responses

### Automation
- Automatic embedding generation during proposal ingestion
- Automatic vector search on every user query
- Automatic source filtering, ranking, and response generation

### Integrations
- Groq API for LLM inference
- PostgreSQL with vector similarity support
- `@xenova/transformers` for embedding generation inside the backend service

## Tech Stack
- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS 4
- Backend: Node.js, Express 5, TypeScript
- Database: PostgreSQL
- AI/LLM: Groq SDK, `@xenova/transformers`, `Xenova/all-MiniLM-L6-v2`
- Storage: PostgreSQL for proposal content, metadata, and embeddings

## System Architecture
### Data Lifecycle
1. Proposal text and optional metadata are submitted to `/api/proposals/add`.
2. The backend creates an embedding vector.
3. Proposal content, vector embedding, and metadata are stored in PostgreSQL.
4. A user submits a new requirement.
5. The system embeds the requirement and retrieves similar records.
6. Retrieved records are used as temporary context for response generation.
7. The final answer and source set are returned to the frontend.

## Project Workflow
### End-to-End Workflow
1. Prepare PostgreSQL with vector search support.
2. Load historical proposals through the ingestion API.
3. Start frontend and backend services.
4. User submits a requirement from the web app.
5. Backend retrieves similar proposals and generates an answer.
6. User reviews the response and supporting source records.

## Flow Diagram
```mermaid
flowchart TD
    A[User enters project requirement in frontend] --> B[Next.js UI sends POST /api/proposals/ask]
    B --> C[Express backend receives query]
    C --> D[Embedding service generates query vector]
    D --> E[PostgreSQL vector similarity search on proposals table]
    E --> F[Top matches returned with similarity score]
    F --> G[Backend filters and ranks relevant proposals]
    G --> H{Enough relevant context?}
    H -- No --> I[Return fallback response with no sources]
    H -- Yes --> J[Build grounded prompt from top proposal content]
    J --> K[Groq LLM generates proposal draft]
    K --> L[Backend returns answer and sources]
    L --> M[Frontend renders proposal and supporting past work]
```

## Installation Guide
### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd proposaliq
```

### 2. Install Dependencies
Install frontend dependencies:
```bash
cd proposaliq-frontend
npm install
```

Install backend dependencies:
```bash
cd ../proposaliq-backend
npm install
```

### 3. Configure Environment Variables
Create or update the environment files:
- `proposaliq-backend/.env`
- `proposaliq-frontend/.env.local`

Use the environment variable reference in the next section.

### 4. Prepare the Database
Recommended bootstrap SQL:
```sql
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS proposals (
  id BIGSERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  embedding VECTOR(384) NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```
index for faster similarity search at scale:
```sql
CREATE INDEX IF NOT EXISTS proposals_embedding_idx
ON proposals
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);
```

### 5. Run Development Servers
Start the backend:
```bash
cd proposaliq-backend
npm run dev
```

Start the frontend in a separate terminal:
```bash
cd proposaliq-frontend
npm run dev
```

Default local URLs:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

### 6. Build for Production
Frontend build:
```bash
cd proposaliq-frontend
npm run build
npm run start
```

## Environment Variables
### Backend
| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | Port used by the Express API. Defaults to `5000`. |
| `DATABASE_URL` | Yes | PostgreSQL connection string for the proposal database. |
| `GROQ_API_KEY` | Yes | API key used for Groq LLM requests. |
| `GROQ_MODEL` | No | Groq model name. Defaults to `llama-3.1-8b-instant`. |

Example backend `.env`:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/proposaliq
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.1-8b-instant
```

### Frontend
| Variable | Required | Description |
| --- | --- | --- |
| `NEXT_PUBLIC_API_BASE_URL` | Recommended | Base URL for the backend API. |

Example frontend `.env.local`:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api/proposals
```
## Third-Party Services
- Groq: hosted LLM inference for final proposal generation
- PostgreSQL: persistent data store for proposals and embeddings
- pgvector-compatible PostgreSQL setup: required for vector similarity operator support
- Hugging Face model via `@xenova/transformers`: local embedding model loading inside the backend runtime

## API Examples
### Add a Proposal
```bash
curl -X POST http://localhost:5000/api/proposals/add \
  -H "Content-Type: application/json" \
  -d '{
    "content": "We built an AI chatbot for ecommerce support with CRM integration and analytics dashboards.",
    "metadata": {"industry": "ecommerce", "region": "US"}
  }'
```

### Search Similar Proposals
```bash
curl -X POST http://localhost:5000/api/proposals/search \
  -H "Content-Type: application/json" \
  -d '{"query": "customer support chatbot for online store"}'
```

### Ask for a Proposal Draft
```bash
curl -X POST http://localhost:5000/api/proposals/ask \
  -H "Content-Type: application/json" \
  -d '{"query": "Build an AI assistant for ecommerce customer support with workflow automation"}'
```
### Current UI References
![ProposalIQ Screenshot 1](./proposaliq-screenshots/1.png)
![ProposalIQ Screenshot 2](./proposaliq-screenshots/2.png)
![ProposalIQ Screenshot 3](./proposaliq-screenshots/3.png)
