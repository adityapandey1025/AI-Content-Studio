const { env } = require("../config/env");
const { CONTENT_TYPE_LABELS } = require("../config/constants");
const { AppError } = require("../utils/AppError");
const { estimateTokens } = require("../utils/tokenEstimator");

const buildMessages = ({ text, type }) => {
  const contentLabel = CONTENT_TYPE_LABELS[type] || type;

  return [
    {
      role: "system",
      content:
        "You are an expert writing assistant. Produce polished, human-quality, original content with strong structure and clarity. Use Markdown where useful."
    },
    {
      role: "user",
      content: `Create a ${contentLabel} based on the prompt below.\n\nPrompt:\n${text}\n\nRequirements:\n- Keep it relevant and high quality.\n- Use a clear, engaging tone.\n- Include concise headings or bullet points when suitable.\n- Avoid filler and repetition.`
    }
  ];
};

const parseOpenRouterStream = async (stream, onDelta) => {
  const reader = stream.getReader();
  const decoder = new TextDecoder("utf-8");
  let buffered = "";
  let finalText = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffered += decoder.decode(value, { stream: true });
    const events = buffered.split("\n\n");
    buffered = events.pop() || "";

    for (const event of events) {
      const lines = event
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean);

      for (const line of lines) {
        if (!line.startsWith("data:")) {
          continue;
        }

        const payload = line.replace(/^data:\s*/, "");
        if (payload === "[DONE]") {
          return finalText;
        }

        let parsed;
        try {
          parsed = JSON.parse(payload);
        } catch (_error) {
          continue;
        }

        const delta = parsed?.choices?.[0]?.delta?.content;
        if (delta) {
          finalText += delta;
          onDelta(delta);
        }
      }
    }
  }

  return finalText;
};

const streamGeneratedContent = async ({ text, type, onChunk }) => {
  const requestBody = {
    model: env.OPENROUTER_MODEL,
    stream: true,
    messages: buildMessages({ text, type })
  };

  const response = await fetch(`${env.OPENROUTER_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": env.OPENROUTER_APP_URL,
      "X-Title": env.OPENROUTER_APP_NAME
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    let errorMessage = `OpenRouter request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData?.error?.message) {
        errorMessage = errorData.error.message;
      }
    } catch (_error) {
      // Preserve default message if JSON parsing fails.
    }
    throw new AppError(errorMessage, 502);
  }

  if (!response.body) {
    throw new AppError("OpenRouter did not return a stream body", 502);
  }

  const finalText = await parseOpenRouterStream(response.body, onChunk);

  return {
    model: env.OPENROUTER_MODEL,
    outputText: finalText,
    estimatedInputTokens: estimateTokens(text),
    estimatedOutputTokens: estimateTokens(finalText)
  };
};

module.exports = { streamGeneratedContent };

