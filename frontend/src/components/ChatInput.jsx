import { useState } from "react";
import { SendHorizontal } from "lucide-react";

export default function ChatInput({ onSend, disabled }) {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="flex items-end gap-2 rounded-2xl border border-charcoal-600 bg-charcoal-900 p-2 focus-within:border-lime-400/50">
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about workouts, muscle building, fat loss..."
        rows={1}
        disabled={disabled}
        className="max-h-32 min-h-[2.5rem] flex-1 resize-none bg-transparent px-2 py-2 text-sm text-neutral-100 placeholder:text-neutral-500 focus:outline-none disabled:opacity-60"
      />
      <button
        onClick={submit}
        disabled={disabled || !value.trim()}
        aria-label="Send message"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400 text-charcoal-950 transition-transform enabled:hover:scale-105 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <SendHorizontal className="h-4.5 w-4.5" />
      </button>
    </div>
  );
}
