# Prompt Engineering Documentation

## Strategy

The system prompt enforces:

- professional writing quality
- clarity and structure
- relevance and brevity
- markdown-friendly formatting

User prompt is normalized by:

1. selected content type mapping (e.g., "LinkedIn Post")
2. user input context
3. output quality requirements (engaging tone, low repetition, concise structure)

## Prompt Template Pattern

```text
Create a <Content Type> based on the prompt below.

Prompt:
<user text>

Requirements:
- Keep it relevant and high quality.
- Use a clear, engaging tone.
- Include concise headings or bullet points when suitable.
- Avoid filler and repetition.
```

## Why This Works

- Role + constraints reduce hallucinated irrelevant output.
- Explicit format instruction improves consistency across content categories.
- Compact requirement bullets reduce token overhead while preserving quality.

## Safety and Reliability

- API key remains server-side only.
- Input is validated and bounded (3-5000 chars).
- Rate limiting reduces abuse.

