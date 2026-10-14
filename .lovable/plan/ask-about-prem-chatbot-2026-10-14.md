# Ask-about-Prem chatbot

## What visitors get
- A floating "Ask about Prem" button that sits clear of the bottom navigation bar. It opens a chat panel styled like the rest of the site (light blueprint look, thin borders, mono font).
- One conversation with a "New chat" reset button. Nothing is saved: the chat clears on refresh.
- A few suggested questions, such as "What has Prem built?", "What's his tech stack?" and "How do I contact him?"
- Answers come only from your portfolio content: profile, projects, journey, achievements, skills and Moments. When something isn't in that content, the bot says it doesn't know. It never makes things up and never shares a phone number.
- Anything you change in the admin dashboard shows up in the bot's answers automatically.
- Replies stream in word by word and support simple formatting like lists and links.

## Technical details
- Server route `src/routes/api/chat.ts` (POST). It loads portfolio data on the server, builds a grounded system prompt, and streams through the Lovable AI Gateway with the AI SDK. It uses the default chat model on the Responses API, with low reasoning effort and `store: false`.
- Input is checked with Zod: at most 20 messages and 2,000 characters each. Each visitor is rate-limited using the existing `rate-limit.server.ts`.
- Gateway errors 429 and 402 are shown as friendly messages in the chat. A `LOVABLE_API_KEY` is created if one doesn't exist yet.
- Client: a `ChatWidget` component built with `useChat` and AI Elements (Conversation, Message, MessageResponse, PromptInput), mounted on the homepage.
- New packages: `ai`, `@ai-sdk/openai`, `@ai-sdk/react`, and the AI Elements components.
- Check: send a real question and confirm the streamed answer uses your actual data.
