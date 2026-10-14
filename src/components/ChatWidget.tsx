import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { MessageSquareText, RotateCcw, X } from "lucide-react";
import { toast } from "sonner";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";

const SUGGESTIONS = ["What has Prem built?", "What's his tech stack?", "What are his achievements?", "How do I contact him?"];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const { messages, sendMessage, status, stop, setMessages, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
    onError: (e) => toast.error(e.message || "Couldn't reach the assistant."),
  });
  const busy = status === "submitted" || status === "streaming";
  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy) return;
    sendMessage({ text: t });
  };

  return (
    <>
      {!open && (
        <button
          onClick={() => setOpen(true)}
          aria-label="Ask about Prem"
          className="fixed bottom-24 right-4 z-50 flex items-center gap-2 border border-foreground bg-foreground px-4 py-3 font-mono text-xs uppercase tracking-widest text-background shadow-lg transition-transform hover:-translate-y-0.5 sm:right-6"
        >
          <MessageSquareText className="size-4" /> Ask about Prem
        </button>
      )}
      {open && (
        <div
          role="dialog"
          aria-label="Ask about Prem"
          className="fixed inset-x-3 bottom-24 z-50 flex h-[min(70vh,560px)] flex-col border border-border bg-background shadow-2xl sm:inset-x-auto sm:right-6 sm:w-[400px]"
        >
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex size-7 items-center justify-center border border-foreground font-mono text-[11px] font-bold">PS</span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest">Ask about Prem</p>
                <p className="text-[11px] text-muted-foreground">Answers from his portfolio</p>
              </div>
            </div>
            <div className="flex gap-1">
              <button aria-label="New chat" onClick={() => { stop(); setMessages([]); }} className="p-1.5 text-muted-foreground hover:text-foreground">
                <RotateCcw className="size-4" />
              </button>
              <button aria-label="Close chat" onClick={() => setOpen(false)} className="p-1.5 text-muted-foreground hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
          </div>
          <Conversation className="flex-1">
            <ConversationContent>
              {messages.length === 0 && (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">Hi! Ask me anything about Prem's work, projects or journey.</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => send(s)} className="border border-border px-2.5 py-1.5 text-left text-xs hover:border-foreground">
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <Message key={m.id} from={m.role}>
                  <MessageContent>
                    {m.parts.map((p, i) =>
                      p.type === "text" ? (
                        m.role === "assistant" ? <MessageResponse key={i}>{p.text}</MessageResponse> : <span key={i}>{p.text}</span>
                      ) : null,
                    )}
                  </MessageContent>
                </Message>
              ))}
              {status === "submitted" && <Shimmer className="text-sm">Thinking...</Shimmer>}
              {error && !busy && <p className="text-xs text-destructive">{error.message || "Something went wrong."}</p>}
            </ConversationContent>
            <ConversationScrollButton />
          </Conversation>
          <div className="border-t border-border p-3">
            <PromptInput onSubmit={(msg) => send(msg.text)}>
              <PromptInputBody>
                <PromptInputTextarea autoFocus placeholder="Ask about Prem…" maxLength={2000} />
              </PromptInputBody>
              <PromptInputFooter className="justify-end">
                <PromptInputSubmit status={status} onStop={stop} />
              </PromptInputFooter>
            </PromptInput>
          </div>
        </div>
      )}
    </>
  );
}
