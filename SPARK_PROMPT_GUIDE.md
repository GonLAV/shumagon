## Spark Prompt Guide — Build “Legit, Magic” Features

Use this template when asking Copilot (or any AI agent) to design and build ambitious, production-grade features. The clearer and bolder the prompt, the better the output.

### Golden Rule
> AI builds at the level of clarity + ambition you provide.

### Copy-Paste Prompt
```
You are a principal engineer + product architect with 15+ years experience.

Design and build a CRAZY, production-grade app — not a demo.

GOAL:
[What problem does the app solve? Who is it for?]

CORE WOW FACTOR:
[What makes it feel magical / 10x better than others?]

TECH CONSTRAINTS:
- Frontend: [React / Next.js / Mobile / etc]
- Backend: [Node / .NET / Python / Serverless]
- DB: [Postgres / Mongo / Redis]
- Auth: [JWT / OAuth / SSO]
- Infra: [AWS / Azure / GCP]

REQUIREMENTS:
- Clean architecture
- Scalable & modular
- Real-world edge cases
- Error handling
- Security best practices
- Performance considerations

DELIVERABLES (STEP BY STEP):
1) High-level architecture diagram (explain it in text)
2) Data models
3) API contracts
4) Folder structure
5) Core logic implementation
6) One killer feature implemented fully
7) What to build next

IMPORTANT:
- Ask clarifying questions ONLY if absolutely required
- Make strong engineering decisions
- Explain WHY each decision is made
```

### Power Tricks
1. Tell the AI to be opinionated: “Make strong decisions, don’t ask me for every choice.”
2. Force depth: “No placeholders. No TODOs.”
3. Force realism: “Assume 100k users, bad networks, partial failures.”
4. Force iteration: After the first output, ask “Refactor this like it’s going to production in 6 months.”

### Example Prompt
```
Build a next-gen delivery tracking app that feels alive.

Users should see:
- Real-time courier movement
- ETA confidence score
- Smart rerouting when delays happen
- AI-generated delivery updates written in human tone

Make it feel like Uber + Notion + AI assistant.

Use:
- Next.js
- Node.js
- Postgres
- WebSockets
- Map integration

Treat this like a real startup MVP.
```

