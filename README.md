
```markdown
# Chat-AI Text Processor 🤖

[![React](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?logo=vercel&logoColor=white)](https://vercel.com/)
[![Render](https://img.shields.io/badge/Render-ff4f00?logo=render&logoColor=white)](https://render.com/)

---

A responsive React-based AI chat interface that detects language, translates text, and summarizes long content using OpenAI and Azure Translator APIs. Backend is powered by Express.js and securely handles API requests.

**Live Demo:** [Frontend on Vercel](#) | [Backend on Render](#)

---

## Features ✨

- **Language Detection** – Detect the language of user input.
- **Translation** – Supports multiple languages: English, French, German, Hausa, Igbo, Spanish, Turkish, Yoruba.
- **Summarization** – Summarizes English text with 150+ words.
- **Real-time Chat UI** – Chat interface with loading indicators and dynamic updates.
- **Responsive Design** – Mobile-friendly layout.
- **Error Handling** – Displays API errors and usage feedback gracefully.

---

## Tech Stack 🛠️

- **Frontend:** React, Axios, CSS
- **Backend:** Node.js, Express.js, Axios
- **APIs:** Azure Translator, OpenAI GPT-4o-mini
- **Deployment:** Vercel (frontend), Render (backend)

---

## Project Structure

```

my-chat-ai/
├── public/             # Frontend public assets
├── src/                # React frontend code
│   ├── components/     # Hooks & reusable components
│   └── App.js
├── server/             # Backend Express server
│   └── proxy-server.js
├── .env.local          # Frontend env variables
├── server/.env         # Backend env variables
├── package.json        # Frontend dependencies
├── server/package.json # Backend dependencies
└── README.md

````

---

## Getting Started 🚀

### Install Frontend

```bash
git clone <your-github-repo-url>
cd my-chat-ai
npm install
````

### Install Backend

```bash
cd server
npm install
```

### Environment Variables

**Frontend (`.env.local` in root):**

```
REACT_APP_API_URL=http://localhost:5000
```

**Backend (`server/.env`):**

```
AZURE_TRANSLATOR_KEY=your-azure-key
AZURE_TRANSLATOR_REGION=your-azure-region
AZURE_TRANSLATOR_ENDPOINT=your-azure-endpoint
OPENAI_API_KEY=your-openai-key
PORT=5000
```

> **Important:** Never commit `.env` or `.env.local` files.

---

### Run Locally

**Backend:**

```bash
cd server
npm run dev
```

**Frontend:**

```bash
cd ..
npm start
```

Visit [http://localhost:3000](http://localhost:3000)

---

## Deployment

* **Backend:** Deploy to [Render](https://render.com)
* **Frontend:** Deploy to [Vercel](https://vercel.com)
* Configure environment variables on the respective platforms.

---
