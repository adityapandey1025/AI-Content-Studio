const estimateTokens = (text) => {
  if (!text || typeof text !== "string") {
    return 0;
  }
  // Approximation: ~4 characters per token for English text.
  return Math.ceil(text.length / 4);
};

const countWords = (text) => {
  if (!text || typeof text !== "string") {
    return 0;
  }
  const words = text.trim().match(/\S+/g);
  return words ? words.length : 0;
};

module.exports = {
  estimateTokens,
  countWords
};

