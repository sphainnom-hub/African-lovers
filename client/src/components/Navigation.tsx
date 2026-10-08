import { Link, useLocation } from "wouter";
import { Heart, MessageCircle, User, Search, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

export function Navigation() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const navItems = [
    { href: "/", icon: Search, label: "Discover" },
    { href: "/matches", icon: Heart, label: "Matches" },
    { href: "/chat", icon: MessageCircle, label: "Chat" },
    { href: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 p-6">
        <div className="flex items-center gap-3 mb-12">
          <img src="/assets/logo.png" alt="African Lovers Logo" className="w-10 h-10 object-contain" />
          <span className="font-display font-bold text-xl text-primary">African Lovers</span>
        </div>

        <div className="space-y-2 flex-1">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                isActive 
                  ? "bg-primary/10 text-primary font-medium shadow-sm" 
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}>
                <item.icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                {item.label}
              </Link>
            );
          })}
        </div>

        <button 
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors mt-auto"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full bg-card/95 backdrop-blur-lg border-t border-border z-50 pb-safe">
        <div className="flex justify-around items-center p-2">
          {navItems.map((item) => {
            const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} className={cn(
                "flex flex-col items-center justify-center p-3 rounded-2xl w-full transition-all duration-200",
                isActive ? "text-primary scale-105" : "text-muted-foreground hover:bg-muted/50"
              )}>
                <item.icon className={cn("w-6 h-6 mb-1", isActive && "fill-current")} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
