# Testing Guide

## 1) Health Check

### Request

`GET /api/health`

### Expected

`200 OK` with success JSON.

---

## 2) Generation - Valid Request

### Request

`POST /api/generate`

```json
{
  "text": "Write a professional LinkedIn launch post for an AI writing app",
  "type": "linkedin-post"
}
```

### Expected

- HTTP 200
- Chunked text stream
- Frontend renders progressive markdown output

---

## 3) Validation Error Cases

### Case A: Missing text

```json
{
  "type": "blog"
}
```

Expected: `400` validation failed.

### Case B: Invalid type

```json
{
  "text": "hello",
  "type": "invalid-type"
}
```

Expected: `400` validation failed.

### Case C: Too short text

```json
{
  "text": "hi",
  "type": "email"
}
```

Expected: `400` validation failed.

---

## 4) Rate Limit Test

Send rapid repeated requests beyond configured threshold (`RATE_LIMIT_MAX`).

Expected: `429 Too Many Requests`.

---

## 5) Edge Cases

- Prompt exactly 5000 characters
- Prompt with newline-heavy content
- Unicode content
- Network interruption mid-stream
- Browser refresh during generation

Expected:

- Input validation works
- App remains stable and recovers with next request

