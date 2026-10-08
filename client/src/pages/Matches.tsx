import { useMatches } from "@/hooks/use-matches";
import { Link } from "wouter";
import { MessageCircle, HeartCrack } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Matches() {
  const { data: matches, isLoading } = useMatches();

  if (isLoading) {
    return (
      <div className="container max-w-4xl mx-auto p-6 md:p-12 space-y-6">
        <Skeleton className="h-10 w-48" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  // Filter only accepted matches for the list
  // The API returns { ...match, partner: user }
  const activeMatches = matches?.filter(m => m.status === 'accepted' || m.status === 'pending'); // In a real app, only show 'accepted' here, 'pending' elsewhere

  if (!activeMatches || activeMatches.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
          <HeartCrack className="w-10 h-10 text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-display font-bold mb-2">No matches yet</h2>
        <p className="text-muted-foreground max-w-xs mb-8">
          Don't worry! Keep discovering people and you'll find someone special soon.
        </p>
        <Link href="/" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors">
          Start Discovering
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl mx-auto p-4 md:p-12 pb-24">
      <h1 className="text-3xl font-display font-bold mb-8">Your Matches</h1>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
        {activeMatches.map((match) => (
          <Link key={match.id} href={`/chat/${match.partner.id}`} className="group relative block aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-md hover:shadow-xl transition-all hover:-translate-y-1">
            <img 
              src={match.partner.profileImageUrl || `https://ui-avatars.com/api/?name=${match.partner.firstName}&background=random`} 
              alt={match.partner.firstName || "Match"}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
            
            <div className="absolute bottom-0 left-0 w-full p-4">
              <h3 className="text-white font-bold font-display text-lg truncate">
                {match.partner.firstName}, {match.partner.age || 24}
              </h3>
              <div className="flex items-center gap-1 text-white/80 text-xs mt-1">
                <MessageCircle className="w-3 h-3" />
                <span>Tap to chat</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
