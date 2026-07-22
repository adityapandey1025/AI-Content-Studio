const STORAGE_KEYS = {
  theme: "aics-theme",
  history: "aics-history",
  usage: "aics-usage-count"
};

const promptTemplates = [
  {
    id: "tpl-blog-startup",
    type: "blog",
    label: "Startup Blog Launch",
    text: "Write a 700-word blog post announcing the launch of a productivity SaaS for remote teams. Include problem, solution, key features, and CTA."
  },
  {
    id: "tpl-email-followup",
    type: "email",
    label: "Formal Client Email",
    text: "Write a polite follow-up email to a client after a project demo. Summarize key points and ask for feedback."
  },
  {
    id: "tpl-linkedin-product",
    type: "linkedin-post",
    label: "Product Launch LinkedIn Post",
    text: "Write a professional LinkedIn post announcing the launch of a productivity SaaS for remote teams. Keep it confident and concise with a CTA."
  },
  {
    id: "tpl-instagram-travel",
    type: "instagram-caption",
    label: "Travel Instagram Caption",
    text: "Write an engaging Instagram caption for a travel photo in Bali with emojis and 8 relevant hashtags."
  },
  {
    id: "tpl-tweet-app",
    type: "tweet",
    label: "Tweet Product Teaser",
    text: "Write a catchy tweet announcing a new AI writing app for students and creators. Keep it short and high-impact."
  },
  {
    id: "tpl-summary-article",
    type: "summary",
    label: "Quick Summary",
    text: "Summarize the following topic in concise bullet points: cloud-native architecture for modern web applications."
  },
  {
    id: "tpl-essay-ai",
    type: "essay",
    label: "AI Impact Essay",
    text: "Write a structured essay on how artificial intelligence is transforming higher education with examples and balanced arguments."
  },
  {
    id: "tpl-story-future",
    type: "story",
    label: "Creative Future Story",
    text: "Write a short inspirational story set in 2035 where a student builds an AI startup from a college project."
  },
  {
    id: "tpl-quote-focus",
    type: "motivational-quote",
    label: "Motivational Quote",
    text: "Create 5 original motivational quotes about discipline, consistency, and growth for students."
  },
  {
    id: "tpl-proposal-aihelpdesk",
    type: "business-proposal",
    label: "AI Helpdesk Proposal",
    text: "Draft the opening section of a business proposal for implementing an AI chatbot for a university helpdesk."
  },
  {
    id: "tpl-reply-client",
    type: "professional-reply",
    label: "Professional Client Reply",
    text: "Write a professional reply to a client apologizing for delayed delivery and providing a revised timeline."
  },
  {
    id: "tpl-resume-fresher",
    type: "resume-objective",
    label: "Resume Objective",
    text: "Create a strong resume objective for a fresher software engineer focused on web development and AI."
  },
  {
    id: "tpl-cover-junior",
    type: "cover-letter",
    label: "Junior Dev Cover Letter",
    text: "Write a cover letter for a junior software engineer role focused on Node.js, JavaScript, and problem solving."
  }
];

const elements = {
  themeToggle: document.getElementById("themeToggle"),
  themeIcon: document.getElementById("themeIcon"),
  templateSelect: document.getElementById("templateSelect"),
  contentType: document.getElementById("contentType"),
  promptInput: document.getElementById("promptInput"),
  promptChars: document.getElementById("promptChars"),
  promptWords: document.getElementById("promptWords"),
  promptTokens: document.getElementById("promptTokens"),
  generateBtn: document.getElementById("generateBtn"),
  regenerateBtn: document.getElementById("regenerateBtn"),
  clearBtn: document.getElementById("clearBtn"),
  outputContent: document.getElementById("outputContent"),
  outputMarkdownSource: document.getElementById("outputMarkdownSource"),
  renderedTabBtn: document.getElementById("renderedTabBtn"),
  rawTabBtn: document.getElementById("rawTabBtn"),
  outputWords: document.getElementById("outputWords"),
  outputChars: document.getElementById("outputChars"),
  outputReadTime: document.getElementById("outputReadTime"),
  usageCount: document.getElementById("usageCount"),
  typingStatus: document.getElementById("typingStatus"),
  emptyState: document.getElementById("emptyState"),
  skeleton: document.getElementById("skeleton"),
  copyBtn: document.getElementById("copyBtn"),
  downloadTxtBtn: document.getElementById("downloadTxtBtn"),
  downloadPdfBtn: document.getElementById("downloadPdfBtn"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
  historyList: document.getElementById("historyList"),
  toastContainer: document.getElementById("toastContainer")
};

let latestOutput = "";
let lastPayload = null;
let isGenerating = false;
let currentOutputView = "rendered";

const estimateTokens = (text) => Math.ceil((text || "").length / 4);

const countWords = (text) => {
  const matches = (text || "").trim().match(/\S+/g);
  return matches ? matches.length : 0;
};

const showToast = (message, type = "success") => {
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  elements.toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2600);
};

const getTemplateById = (id) => promptTemplates.find((template) => template.id === id);

const renderTemplateOptions = (type) => {
  const previousValue = elements.templateSelect.value;
  const matchingTemplates = promptTemplates.filter((template) => template.type === type);

  elements.templateSelect.innerHTML = "";
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Choose a template for selected content type";
  elements.templateSelect.appendChild(defaultOption);

  matchingTemplates.forEach((template) => {
    const option = document.createElement("option");
    option.value = template.id;
    option.textContent = template.label;
    elements.templateSelect.appendChild(option);
  });

  if (previousValue && matchingTemplates.some((template) => template.id === previousValue)) {
    elements.templateSelect.value = previousValue;
  } else {
    elements.templateSelect.value = "";
  }
};

const setTheme = (theme) => {
  document.body.classList.toggle("light", theme === "light");
  elements.themeIcon.textContent = theme === "light" ? "☀️" : "🌙";
  localStorage.setItem(STORAGE_KEYS.theme, theme);
};

const updatePromptStats = () => {
  const text = elements.promptInput.value;
  elements.promptChars.textContent = `${text.length} / 5000 chars`;
  elements.promptWords.textContent = `${countWords(text)} words`;
  elements.promptTokens.textContent = `~${estimateTokens(text)} tokens`;
};

const updateOutputStats = (text) => {
  const words = countWords(text);
  const chars = text.length;
  const readingMinutes = words === 0 ? 0 : Math.max(1, Math.ceil(words / 200));
  elements.outputWords.textContent = `Words: ${words}`;
  elements.outputChars.textContent = `Characters: ${chars}`;
  elements.outputReadTime.textContent = `Reading Time: ${readingMinutes} min`;
};

const escapeHtml = (text) =>
  (text || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const parseMarkdownSafely = (markdownText) => {
  if (window.marked && typeof window.marked.parse === "function") {
    return window.marked.parse(markdownText || "");
  }

  if (typeof window.marked === "function") {
    return window.marked(markdownText || "");
  }

  const escaped = escapeHtml(markdownText || "");
  return escaped.replace(/\n/g, "<br>");
};

const sanitizeHtmlSafely = (rawHtml) => {
  if (window.DOMPurify && typeof window.DOMPurify.sanitize === "function") {
    return window.DOMPurify.sanitize(rawHtml);
  }
  return rawHtml;
};

const renderMarkdown = (markdownText) => {
  const rawHtml = parseMarkdownSafely(markdownText);
  elements.outputContent.innerHTML = sanitizeHtmlSafely(rawHtml);
  elements.outputMarkdownSource.textContent = markdownText || "";
};

const toPlainTextFromMarkdown = (markdownText) => {
  const rawHtml = parseMarkdownSafely(markdownText || "");
  const sanitized = sanitizeHtmlSafely(rawHtml);
  const tmp = document.createElement("div");
  tmp.innerHTML = sanitized;
  return tmp.innerText || tmp.textContent || markdownText || "";
};

const normalizeTextForPdf = (text) =>
  (text || "")
    .replace(/•/g, "- ")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .replace(/—/g, "-")
    .replace(/–/g, "-")
    .replace(/…/g, "...")
    .normalize("NFKD")
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, "");

const updateUsageCount = () => {
  const current = Number(localStorage.getItem(STORAGE_KEYS.usage) || "0");
  elements.usageCount.textContent = `AI Usage: ${current}`;
};

const incrementUsageCount = () => {
  const current = Number(localStorage.getItem(STORAGE_KEYS.usage) || "0") + 1;
  localStorage.setItem(STORAGE_KEYS.usage, String(current));
  elements.usageCount.textContent = `AI Usage: ${current}`;
};

const saveHistory = (item) => {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  history.unshift(item);
  const deduped = history
    .filter((entry, index, arr) => arr.findIndex((i) => i.prompt === entry.prompt) === index)
    .slice(0, 8);
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(deduped));
  renderHistory();
};

const renderHistory = () => {
  const history = JSON.parse(localStorage.getItem(STORAGE_KEYS.history) || "[]");
  elements.historyList.innerHTML = "";

  if (!history.length) {
    const empty = document.createElement("li");
    empty.className = "history-item";
    empty.textContent = "No recent prompts yet.";
    elements.historyList.appendChild(empty);
    return;
  }

  history.forEach((entry) => {
    const item = document.createElement("li");
    item.className = "history-item";
    const button = document.createElement("button");
    button.textContent = entry.prompt.length > 95 ? `${entry.prompt.slice(0, 95)}...` : entry.prompt;
    button.addEventListener("click", () => {
      elements.promptInput.value = entry.prompt;
      elements.contentType.value = entry.type;
      updatePromptStats();
      showToast("Prompt loaded from history");
    });

    const meta = document.createElement("small");
    meta.textContent = new Date(entry.createdAt).toLocaleString();
    item.appendChild(button);
    item.appendChild(meta);
    elements.historyList.appendChild(item);
  });
};

const setLoadingState = (loading) => {
  isGenerating = loading;
  elements.generateBtn.disabled = loading;
  elements.regenerateBtn.disabled = loading || !lastPayload;
  elements.copyBtn.disabled = loading || !latestOutput;
  elements.downloadTxtBtn.disabled = loading || !latestOutput;
  elements.downloadPdfBtn.disabled = loading || !latestOutput;
  elements.typingStatus.textContent = loading ? "Streaming AI response..." : "";
  elements.skeleton.classList.toggle("hidden", !loading);
};

const setOutputView = (view) => {
  currentOutputView = view;
  const showingRendered = view === "rendered";
  elements.outputContent.classList.toggle("hidden", !showingRendered);
  elements.outputMarkdownSource.classList.toggle("hidden", showingRendered);
  elements.renderedTabBtn.classList.toggle("is-active", showingRendered);
  elements.rawTabBtn.classList.toggle("is-active", !showingRendered);
};

const initializeTiltEffects = () => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const isTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  if (reduceMotion || isTouch || window.innerWidth <= 980) {
    return;
  }

  const maxTilt = 5;
  const cards = document.querySelectorAll(".tilt-card");

  cards.forEach((card) => {
    const handleMove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateY = ((x - centerX) / centerX) * maxTilt;
      const rotateX = ((centerY - y) / centerY) * maxTilt;

      card.style.setProperty("--rx", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--ry", `${rotateY.toFixed(2)}deg`);
    };

    const handleLeave = () => {
      card.style.setProperty("--rx", "0deg");
      card.style.setProperty("--ry", "0deg");
    };

    card.addEventListener("mousemove", handleMove);
    card.addEventListener("mouseleave", handleLeave);
  });
};

const autoResizeTextarea = () => {
  elements.promptInput.style.height = "auto";
  elements.promptInput.style.height = `${elements.promptInput.scrollHeight}px`;
};

const streamGeneration = async (payload) => {
  if (isGenerating) {
    return;
  }

  setLoadingState(true);
  latestOutput = "";
  elements.emptyState.classList.add("hidden");
  elements.outputContent.innerHTML = "";
  updateOutputStats("");

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || "Generation request failed");
    }

    if (!response.body) {
      throw new Error("No response stream available");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }
      const chunk = decoder.decode(value, { stream: true });
      latestOutput += chunk;
      renderMarkdown(latestOutput);
      updateOutputStats(latestOutput);
    }

    lastPayload = payload;
    incrementUsageCount();
    saveHistory({
      prompt: payload.text,
      type: payload.type,
      createdAt: Date.now()
    });
    showToast("Content generated successfully");
  } catch (error) {
    showToast(error.message || "Something went wrong", "error");
    if (!latestOutput) {
      elements.emptyState.classList.remove("hidden");
    }
  } finally {
    elements.skeleton.classList.add("hidden");
    setLoadingState(false);
    elements.copyBtn.disabled = !latestOutput;
    elements.downloadTxtBtn.disabled = !latestOutput;
    elements.downloadPdfBtn.disabled = !latestOutput;
  }
};

const copyOutput = async () => {
  if (!latestOutput) {
    showToast("Nothing to copy", "error");
    return;
  }
  await navigator.clipboard.writeText(latestOutput);
  showToast("Copied to clipboard");
};

const downloadTxt = () => {
  if (!latestOutput) {
    showToast("Nothing to download", "error");
    return;
  }
  const blob = new Blob([latestOutput], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ai-content-output.txt";
  a.click();
  URL.revokeObjectURL(url);
};

const downloadPdf = () => {
  if (!latestOutput) {
    showToast("Nothing to download", "error");
    return;
  }

  if (!window.jspdf || typeof window.jspdf.jsPDF !== "function") {
    showToast("PDF library failed to load. Refresh and try again.", "error");
    return;
  }

  const renderedPlainText = toPlainTextFromMarkdown(latestOutput);
  const pdfText = normalizeTextForPdf(renderedPlainText).trim();
  if (!pdfText) {
    showToast("Unable to export empty/unsupported content to PDF", "error");
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const marginX = 15;
  const marginY = 15;
  const lineHeight = 7;
  const pageHeight = doc.internal.pageSize.getHeight();
  const usableWidth = doc.internal.pageSize.getWidth() - marginX * 2;
  const maxY = pageHeight - marginY;
  const lines = doc.splitTextToSize(pdfText, usableWidth);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  let y = marginY;
  lines.forEach((line) => {
    if (y > maxY) {
      doc.addPage();
      y = marginY;
    }
    doc.text(line, marginX, y);
    y += lineHeight;
  });

  doc.save(`ai-content-output-${Date.now()}.pdf`);
};

const clearOutput = () => {
  latestOutput = "";
  elements.outputContent.innerHTML = "";
  elements.outputMarkdownSource.textContent = "";
  elements.emptyState.classList.remove("hidden");
  updateOutputStats("");
  setLoadingState(false);
};

const initializeTemplates = () => {
  renderTemplateOptions(elements.contentType.value);
};

const initializeEvents = () => {
  elements.themeToggle.addEventListener("click", () => {
    const newTheme = document.body.classList.contains("light") ? "dark" : "light";
    setTheme(newTheme);
  });

  elements.promptInput.addEventListener("input", () => {
    updatePromptStats();
    autoResizeTextarea();
  });

  elements.templateSelect.addEventListener("change", (event) => {
    const templateId = event.target.value;
    if (templateId === "") {
      return;
    }
    const template = getTemplateById(templateId);
    if (!template) {
      return;
    }

    if (elements.contentType.value !== template.type) {
      elements.contentType.value = template.type;
      renderTemplateOptions(template.type);
      elements.templateSelect.value = template.id;
      showToast("Template and content type synced");
    }

    elements.promptInput.value = template.text;
    updatePromptStats();
    autoResizeTextarea();
  });

  elements.contentType.addEventListener("change", () => {
    renderTemplateOptions(elements.contentType.value);
  });

  elements.generateBtn.addEventListener("click", () => {
    const text = elements.promptInput.value.trim();
    const type = elements.contentType.value;

    if (text.length < 3) {
      showToast("Please enter at least 3 characters", "error");
      return;
    }

    streamGeneration({ text, type });
  });

  elements.regenerateBtn.addEventListener("click", () => {
    if (!lastPayload) {
      showToast("Nothing to regenerate yet", "error");
      return;
    }
    streamGeneration(lastPayload);
  });

  elements.clearBtn.addEventListener("click", () => {
    elements.promptInput.value = "";
    updatePromptStats();
    autoResizeTextarea();
    clearOutput();
  });

  elements.copyBtn.addEventListener("click", copyOutput);
  elements.downloadTxtBtn.addEventListener("click", downloadTxt);
  elements.downloadPdfBtn.addEventListener("click", downloadPdf);
  elements.renderedTabBtn.addEventListener("click", () => setOutputView("rendered"));
  elements.rawTabBtn.addEventListener("click", () => setOutputView("raw"));

  elements.clearHistoryBtn.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEYS.history);
    renderHistory();
    showToast("History cleared");
  });

  document.addEventListener("keydown", (event) => {
    if (event.ctrlKey && event.key === "Enter") {
      event.preventDefault();
      elements.generateBtn.click();
    }
    if (event.ctrlKey && event.key.toLowerCase() === "k") {
      event.preventDefault();
      elements.promptInput.focus();
    }
    if (event.key === "Escape") {
      clearOutput();
    }
  });
};

const initialize = () => {
  initializeTemplates();
  initializeEvents();
  initializeTiltEffects();
  renderHistory();
  updatePromptStats();
  updateUsageCount();
  autoResizeTextarea();
  const preferredTheme = localStorage.getItem(STORAGE_KEYS.theme) || "dark";
  setTheme(preferredTheme);
  setOutputView(currentOutputView);
  setLoadingState(false);
};

initialize();
