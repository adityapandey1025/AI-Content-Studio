# Architecture Diagram (Mermaid)

```mermaid
flowchart TD
    A[User Browser] -->|HTTPS| B[Express Server]
    B --> C[Static Frontend Files]
    B --> D[/api/generate]
    D --> E[Validation Middleware]
    E --> F[Generate Controller]
    F --> G[OpenRouter Service]
    G --> H[OpenRouter API]
    H -->|Streaming Tokens| G
    G -->|Chunked Stream| F
    F -->|Streamed Response| A

    B --> I[/api/health]
    B --> J[Security Middleware: Helmet/CORS/Rate Limit]
    B --> K[Logging + Compression]
```

## Layers

- **Frontend (Vanilla JS)**: UI, prompt management, stream rendering, localStorage history.
- **Controller Layer**: Handles request/response and streaming output.
- **Service Layer**: Talks to OpenRouter API and parses streamed SSE chunks.
- **Middleware Layer**: Validation, rate limiting, error handling, security headers.
- **Config Layer**: Environment configuration and constants.

