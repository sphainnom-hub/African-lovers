import { Button } from "@/components/ui/button";
import { ArrowRight, Heart } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen bg-[#FDF8F5] relative overflow-hidden">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-gradient-to-bl from-secondary/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-primary/10 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <img src="/assets/logo.png" alt="African Lovers Logo" className="w-12 h-12 object-contain" />
          <span className="font-display font-bold text-xl tracking-tight text-foreground">African Lovers</span>
        </div>
        <Button onClick={handleLogin} variant="outline" className="border-primary/20 hover:bg-primary/5 hover:text-primary rounded-full px-6">
          Sign In
        </Button>
      </nav>

      {/* Hero Content */}
      <main className="relative z-10 container mx-auto px-6 pt-12 pb-20 lg:pt-24 lg:flex lg:items-center lg:gap-16">
        <div className="lg:w-1/2 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur border border-primary/10 text-primary text-sm font-medium mb-8 animate-fade-in-up">
            <Heart className="w-4 h-4 fill-primary" />
            <span>Find your perfect match today</span>
          </div>
          
          <h1 className="font-display text-5xl lg:text-7xl font-bold leading-[1.1] mb-6 text-foreground">
            Connect with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Real Love
            </span>
          </h1>
          
          <p className="text-lg lg:text-xl text-muted-foreground mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            Discover meaningful connections with people who share your culture, values, and passions across the continent and beyond.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
            <Button 
              onClick={handleLogin} 
              size="lg" 
              className="w-full sm:w-auto rounded-full text-lg px-8 h-14 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:-translate-y-1"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <p className="text-sm text-muted-foreground mt-4 sm:mt-0">
              Join 10,000+ happy couples
            </p>
          </div>
        </div>

        <div className="lg:w-1/2 mt-16 lg:mt-0 relative">
          <div className="relative z-10 grid grid-cols-2 gap-4">
            <div className="space-y-4 pt-12">
              {/* Couple smiling outdoors */}
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1542596594-649edbc13630?w=600&auto=format&fit=crop" 
                  alt="Happy couple smiling" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Hands holding */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl translate-x-4">
                <img 
                  src="https://pixabay.com/get/g2933a9d3cf7f523f340cd044b7fdd10ed37762bec221d617aec2761236379de5450d9e9bd67b2b0a1874bf89f13ea2c68ef567649018c2f9cd25f18f9836944d_1280.jpg" 
                  alt="Holding hands" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="space-y-4">
              {/* Couple laughing */}
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-xl -translate-x-4">
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop" 
                  alt="Friends laughing" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Portrait */}
              <div className="aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl rotate-[2deg] hover:rotate-0 transition-transform duration-500">
                <img 
                  src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&auto=format&fit=crop" 
                  alt="Portrait of a woman" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
