import { useState } from "react";
import { useUsers, useUpdateProfile } from "@/hooks/use-users";
import { useCreateMatch } from "@/hooks/use-matches";
import { useAuth } from "@/hooks/use-auth";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, X, MapPin, Info, Briefcase, Ruler, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export default function Discover() {
  const { user } = useAuth();
  const { data: users, isLoading } = useUsers();
  const { mutate: swipe } = useCreateMatch();
  const { mutate: updateProfile } = useUpdateProfile();
  const { toast } = useToast();
  
  // Simple index tracking for swipe deck
  const [currentIndex, setCurrentIndex] = useState(0);

  // If user hasn't completed onboarding, show that first
  const showOnboarding = user && !user.age;

  if (isLoading) {
    return (
      <div className="p-4 md:p-8 flex justify-center items-center h-full min-h-[80vh]">
        <div className="w-full max-w-md space-y-4">
          <Skeleton className="h-[500px] w-full rounded-3xl" />
          <div className="flex justify-between px-8">
            <Skeleton className="h-16 w-16 rounded-full" />
            <Skeleton className="h-16 w-16 rounded-full" />
          </div>
        </div>
      </div>
    );
  }

  // Filter out self and users already acted upon (ideally filtered by backend, but MVP)
  const potentialMatches = users?.filter(u => u.id !== user?.id) || [];
  const currentProfile = potentialMatches[currentIndex];

  const handleSwipe = (direction: 'left' | 'right') => {
    if (!currentProfile) return;

    swipe({
      targetUserId: currentProfile.id,
      action: direction === 'right' ? 'like' : 'pass'
    }, {
      onSuccess: (data) => {
        if (data.status === 'matched') {
          toast({
            title: "It's a Match! 🎉",
            description: `You and ${currentProfile.firstName} liked each other!`,
            className: "bg-gradient-to-r from-primary to-secondary text-white border-none",
          });
        }
      }
    });

    // Animate out and move next
    setTimeout(() => setCurrentIndex(prev => prev + 1), 200);
  };

  if (!currentProfile && !showOnboarding) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-6 text-center">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <SearchIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-3xl font-display font-bold mb-3">No more profiles</h2>
        <p className="text-muted-foreground max-w-md mb-8">
          You've seen everyone in your area for now. Check back later or update your preferences!
        </p>
        <Button variant="outline" className="rounded-full" onClick={() => window.location.reload()}>
          Refresh
        </Button>
      </div>
    );
  }

  return (
    <div className="container max-w-lg mx-auto pb-24 pt-6 md:pt-12 px-4 h-full relative">
      <h1 className="text-2xl font-display font-bold mb-6 flex items-center gap-2">
        <Sparkles className="w-6 h-6 text-secondary fill-secondary" />
        Discover
      </h1>

      <div className="relative h-[65vh] w-full">
        <AnimatePresence>
          {currentProfile && (
            <motion.div
              key={currentProfile.id}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.05, opacity: 0, x: 0 }} // Simplified exit for MVP
              transition={{ duration: 0.3 }}
              className="absolute inset-0 w-full h-full"
            >
              <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl bg-white border border-border">
                {/* Profile Image */}
                <img 
                  src={currentProfile.profileImageUrl || `https://ui-avatars.com/api/?name=${currentProfile.firstName}&background=random&size=512`} 
                  alt={currentProfile.firstName || "User"}
                  className="w-full h-full object-cover"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Content */}
                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <h2 className="text-3xl font-bold font-display flex items-baseline gap-2">
                        {currentProfile.firstName}
                        <span className="text-xl font-medium opacity-80">{currentProfile.age || 24}</span>
                      </h2>
                      {currentProfile.location && (
                        <div className="flex items-center gap-1 text-sm opacity-90 mt-1">
                          <MapPin className="w-3 h-3" />
                          {currentProfile.location}
                        </div>
                      )}
                    </div>
                  </div>

                  {currentProfile.bio && (
                    <p className="text-sm opacity-80 line-clamp-2 mb-4">
                      "{currentProfile.bio}"
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2 text-xs">
                    {currentProfile.gender && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full border border-white/10">
                        {currentProfile.gender}
                      </span>
                    )}
                    <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full border border-white/10 flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> 175cm
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full border border-white/10 flex items-center gap-1">
                      <Briefcase className="w-3 h-3" /> Professional
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-6 mt-8">
        <Button
          size="lg"
          variant="outline"
          className="h-16 w-16 rounded-full border-2 border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive transition-all hover:scale-110 shadow-lg"
          onClick={() => handleSwipe('left')}
        >
          <X className="w-8 h-8" />
        </Button>
        
        <Button
          size="lg"
          className="h-16 w-16 rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-110 shadow-xl shadow-primary/30 transition-all border-none"
          onClick={() => handleSwipe('right')}
        >
          <Heart className="w-8 h-8 fill-current" />
        </Button>
      </div>
    </div>
  );
}

function SearchIcon(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
  );
}
