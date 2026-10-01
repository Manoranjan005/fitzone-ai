import { Dumbbell, User } from "lucide-react";

// Lightweight formatter: turns **bold**, `## headings`, `- bullets` and
// `1. numbered` lines into structured JSX without pulling in a markdown lib.
function formatInline(text, keyPrefix) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-semibold text-neutral-100">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function formatContent(content) {
  const lines = content.split("\n");
  const blocks = [];
  let listBuffer = [];
  let listType = null;

  const flushList = (key) => {
    if (listBuffer.length === 0) return;
    const ListTag = listType === "ol" ? "ol" : "ul";
    blocks.push(
      <ListTag
        key={`list-${key}`}
        className={
          listType === "ol"
            ? "ml-5 list-decimal space-y-1 marker:text-lime-400"
            : "ml-5 list-disc space-y-1 marker:text-lime-400"
        }
      >
        {listBuffer.map((item, i) => (
          <li key={i}>{formatInline(item, `li-${key}-${i}`)}</li>
        ))}
      </ListTag>
    );
    listBuffer = [];
    listType = null;
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();

    if (/^#{1,3}\s+/.test(trimmed)) {
      flushList(idx);
      blocks.push(
        <h4 key={`h-${idx}`} className="mt-2 font-display text-sm font-semibold text-lime-400">
          {trimmed.replace(/^#{1,3}\s+/, "")}
        </h4>
      );
    } else if (/^[-*]\s+/.test(trimmed)) {
      if (listType !== "ul") flushList(idx);
      listType = "ul";
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ""));
    } else if (/^\d+\.\s+/.test(trimmed)) {
      if (listType !== "ol") flushList(idx);
      listType = "ol";
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ""));
    } else if (trimmed === "") {
      flushList(idx);
    } else {
      flushList(idx);
      blocks.push(
        <p key={`p-${idx}`} className="leading-relaxed">
          {formatInline(trimmed, `p-${idx}`)}
        </p>
      );
    }
  });
  flushList("end");

  return blocks;
}

export default function MessageBubble({ role, content }) {
  const isUser = role === "user";

  return (
    <div className={`flex w-full gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-charcoal-700 text-neutral-300" : "bg-lime-400 text-charcoal-950"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Dumbbell className="h-4 w-4" strokeWidth={2.5} />}
      </div>

      <div
        className={`max-w-[80%] space-y-2 rounded-2xl px-4 py-3 text-sm animate-slide-up sm:max-w-[75%] ${
          isUser
            ? "rounded-tr-sm bg-lime-400 text-charcoal-950"
            : "rounded-tl-sm border border-charcoal-600 bg-charcoal-900/80 text-neutral-200"
        }`}
      >
        {formatContent(content)}
      </div>
    </div>
  );
}
