// src/components/hooks/useAI.js
import { useState } from 'react';

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY || '';
const ANTHROPIC_MODEL = "claude-3-5-sonnet-20241022";

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const callAnthropic = async (messages, max_tokens = 1000) => {
    if (!ANTHROPIC_API_KEY) throw new Error("API key not configured");

    setLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens,
          messages
        })
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      return data.content.find(c => c.type === "text")?.text || "";
    } finally {
      setLoading(false);
    }
  };

  return { callAnthropic, loading };
};