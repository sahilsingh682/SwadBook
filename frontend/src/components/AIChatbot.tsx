import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, Sparkles, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { FAMOUS_RECIPES } from '@/data/famousRecipes';

interface RecipeSource {
  id: string;
  title: string;
  state?: string | null;
  dietary_type?: string | null;
  calories?: number | null;
  protein?: number | null;
  preparation_time?: number;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: RecipeSource[];
}

function localRagSearch(query: string): { response: string; sources: RecipeSource[] } {
  const tokens = query
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const q = query.toLowerCase();
  const wantNonVeg = q.includes('non-veg') || q.includes('non veg') || q.includes('chicken') || q.includes('fish') || q.includes('mutton');
  const wantVeg = !wantNonVeg && (q.includes('veg') || q.includes('paneer') || q.includes('dal'));

  const scored = FAMOUS_RECIPES.map((r) => {
    const haystack = [
      r.title,
      r.description,
      r.state,
      r.dietary_type,
      r.meal_type,
      ...r.tags,
      ...r.ingredients,
    ].join(' ').toLowerCase();

    let score = 0;
    for (const token of tokens) {
      if (r.title.toLowerCase().includes(token)) score += 6;
      if (r.state.toLowerCase().includes(token)) score += 5;
      if (r.tags.some((t) => t.includes(token))) score += 4;
      if (haystack.includes(token)) score += 2;
    }
    if (wantVeg && r.dietary_type === 'vegetarian') score += 5;
    if (wantNonVeg && r.dietary_type === 'non-vegetarian') score += 5;
    if ((q.includes('protein') || q.includes('gym')) && r.protein >= 18) score += 5;
    if ((q.includes('low cal') || q.includes('weight loss')) && r.calories <= 350) score += 4;
    return { r, score };
  }).sort((a, b) => b.score - a.score);

  const top = (scored.some((s) => s.score > 0) ? scored.filter((s) => s.score > 0) : scored)
    .slice(0, 3)
    .map((s) => s.r);

  const lines = top.map(
    (r) => `- **${r.title}** (${r.state} · ${r.dietary_type}): **${r.calories} kcal**, **${r.protein}g protein**, ${r.preparation_time} min`
  );

  return {
    response: `Here are the best matching dishes from **Zaika** for your query:\n\n${lines.join('\n')}\n\nTap any recipe chip below to view full ingredients & steps!`,
    sources: top.map((r) => ({
      id: r.id,
      title: r.title,
      state: r.state,
      dietary_type: r.dietary_type,
      calories: r.calories,
      protein: r.protein,
      preparation_time: r.preparation_time,
    })),
  };
}

function renderInlineFormatting(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      return (
        <span key={i} className="italic">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <span key={i}>{part.replace(/\*/g, '')}</span>;
  });
}

function FormattedMessage({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className="text-sm space-y-1.5 leading-relaxed">
      {lines.map((rawLine, idx) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={idx} className="h-1" />;
        }

        const headingMatch = line.match(/^#{1,3}\s+(.*)$/);
        if (headingMatch) {
          return (
            <p key={idx} className="font-semibold text-foreground pt-1">
              {renderInlineFormatting(headingMatch[1])}
            </p>
          );
        }

        const bulletMatch = line.match(/^(?:[-*•])\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="text-primary font-bold mt-0.5">•</span>
              <span className="flex-1">{renderInlineFormatting(bulletMatch[1])}</span>
            </div>
          );
        }

        const orderedMatch = line.match(/^(\d+\.)\s+(.*)$/);
        if (orderedMatch) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-1">
              <span className="font-semibold text-primary shrink-0">{orderedMatch[1]}</span>
              <span className="flex-1">{renderInlineFormatting(orderedMatch[2])}</span>
            </div>
          );
        }

        return <p key={idx}>{renderInlineFormatting(line)}</p>;
      })}
    </div>
  );
}

const STARTER_PROMPTS = [
  'High-protein veg gym dinner',
  'Healthy breakfast under 350 kcal',
  'Famous high-protein dishes from Punjab',
];

export function AIChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessageText = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: text };
    const nextHistory = [...messages, userMessage];
    setMessages(nextHistory);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('ai-dietician', {
        body: {
          messages: nextHistory.map((m) => ({ role: m.role, content: m.content })),
        },
      });

      if (!error && data?.response) {
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: data.response,
            sources: Array.isArray(data.sources) ? data.sources : [],
          },
        ]);
        return;
      }

      // Client-side RAG fallback if edge function is unreachable
      const fallback = localRagSearch(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallback.response,
          sources: fallback.sources,
        },
      ]);
    } catch {
      const fallback = localRagSearch(text);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: fallback.response,
          sources: fallback.sources,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = () => sendMessageText(input);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 right-4 md:bottom-6 md:right-6 h-14 w-14 rounded-full shadow-warm transition-smooth hover:scale-110 z-50"
          size="icon"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-3 md:bottom-6 md:right-6 w-[calc(100vw-1.5rem)] sm:w-96 h-[520px] max-h-[75vh] md:max-h-[80vh] flex flex-col shadow-warm z-50 transition-smooth">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary text-primary-foreground rounded-t-lg">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <div>
                <h3 className="font-semibold leading-none">AI Dietician</h3>
                <span className="text-[10px] opacity-85 flex items-center gap-1 mt-0.5">
                  <Sparkles className="h-2.5 w-2.5" /> RAG · Grounded in Zaika Recipes
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            {messages.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4 space-y-4">
                <div>
                  <p className="mb-1.5 font-medium text-foreground">👋 Hi! I&apos;m your Zaika AI Dietician.</p>
                  <p className="text-xs">
                    Powered by RAG — I search live Zaika recipes &amp; macros to give personalized meal recommendations.
                  </p>
                </div>
                <div className="space-y-1.5 text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Try asking:</p>
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() => sendMessageText(prompt)}
                      className="w-full text-left text-xs px-3 py-2 rounded-lg bg-muted/60 hover:bg-muted text-foreground transition-colors border border-border/50"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex flex-col ${message.role === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-lg p-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    {message.role === 'assistant' ? (
                      <FormattedMessage content={message.content} />
                    ) : (
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    )}
                  </div>

                  {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                    <div className="mt-2 max-w-[90%] flex flex-wrap gap-1.5">
                      {message.sources.map((src) => (
                        <button
                          key={src.id}
                          type="button"
                          onClick={() => {
                            navigate(`/recipe/${src.id}`);
                            setIsOpen(false);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary font-medium transition-colors border border-primary/20"
                        >
                          <span className="truncate max-w-[160px]">{src.title}</span>
                          {src.protein ? <span className="opacity-75">· {src.protein}g P</span> : null}
                          <ArrowUpRight className="h-3 w-3 shrink-0" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-lg p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about diet, macros, or recipes..."
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
