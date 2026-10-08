import { useState, useEffect, useRef } from "react";
import { useRoute } from "wouter";
import { useUser } from "@/hooks/use-users";
import { useMessages, useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Phone, Video, ArrowLeft, MoreVertical } from "lucide-react";
import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export default function Chat() {
  const [match, params] = useRoute("/chat/:userId");
  const userId = params?.userId;
  const { user: currentUser } = useAuth();
  
  // Fetch partner info
  const { data: partner } = useUser(userId || "");
  // Fetch messages
  const { data: messages } = useMessages(userId || "");
  const { mutate: sendMessage, isPending } = useSendMessage();
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !userId) return;

    sendMessage({ receiverId: userId, content: inputText });
    setInputText("");
  };

  const handleCall = () => {
    if (partner?.phoneNumber) {
      window.location.href = `tel:${partner.phoneNumber}`;
    } else {
      alert("This user hasn't added a phone number yet.");
    }
  };

  if (!userId) return <div>Select a match to chat</div>;

  return (
    <div className="fixed inset-0 md:pl-64 flex flex-col bg-background">
      {/* Header */}
      <header className="px-4 py-3 bg-card border-b border-border flex items-center justify-between shadow-sm z-10">
        <div className="flex items-center gap-3">
          <Link href="/matches" className="md:hidden p-2 -ml-2 hover:bg-muted rounded-full">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          
          <div className="relative">
            <img 
              src={partner?.profileImageUrl || `https://ui-avatars.com/api/?name=${partner?.firstName || 'U'}&background=random`} 
              alt="Partner" 
              className="w-10 h-10 rounded-full object-cover border border-border"
            />
            {partner?.isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
            )}
          </div>
          
          <div>
            <h3 className="font-bold text-sm md:text-base leading-none">
              {partner?.firstName || "Loading..."}
            </h3>
            <span className="text-xs text-muted-foreground">
              {partner?.isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={handleCall} className="rounded-full">
            <Phone className="w-5 h-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full hidden sm:flex">
            <Video className="w-5 h-5 text-primary" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="w-5 h-5 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#F5F2F0]">
        {!messages || messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8 opacity-50">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <MessageCircle className="w-12 h-12 text-primary" />
            </div>
            <p>Start the conversation with {partner?.firstName}!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div 
                  className={cn(
                    "max-w-[75%] px-4 py-3 rounded-2xl text-sm shadow-sm relative group",
                    isMe 
                      ? "bg-primary text-primary-foreground rounded-br-none" 
                      : "bg-white text-foreground rounded-bl-none"
                  )}
                >
                  {msg.content}
                  <div className={cn(
                    "text-[10px] opacity-70 mt-1 text-right",
                    isMe ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {format(new Date(msg.createdAt || Date.now()), 'HH:mm')}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-card border-t border-border pb-safe">
        <form onSubmit={handleSend} className="flex items-center gap-2 max-w-4xl mx-auto">
          <Input 
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message..."
            className="rounded-full bg-muted/50 border-transparent focus:bg-white transition-all h-12 px-6 shadow-inner"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={!inputText.trim() || isPending}
            className="rounded-full w-12 h-12 shrink-0 shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90"
          >
            <Send className="w-5 h-5 ml-0.5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
