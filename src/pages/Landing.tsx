import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Users, Building2, Truck, Shield, Clock, ArrowRight } from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient min-h-screen flex flex-col relative overflow-hidden">
        {/* Pattern overlay */}
        <div className="absolute inset-0 pattern-overlay opacity-30" />
        
        {/* Floating decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent/10 blur-3xl float" />
        <div className="absolute bottom-40 right-20 w-48 h-48 rounded-full bg-primary-foreground/5 blur-3xl float" style={{ animationDelay: '2s' }} />
        
        {/* Navigation */}
        <nav className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Heart className="h-8 w-8 text-accent" />
            <span className="text-2xl font-serif font-bold text-primary-foreground">Thodar</span>
          </div>
          <div className="flex gap-4">
            <Button variant="ghost" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center container mx-auto px-6">
          <div className="text-center max-w-4xl animate-fade-up">
            {/* Tagline */}
            <p className="text-accent font-medium tracking-widest uppercase text-sm mb-6">
              Connecting Lives Through Care
            </p>
            
            {/* Main Title */}
            <h1 className="font-serif text-6xl md:text-8xl font-bold text-primary-foreground mb-6 tracking-tight">
              Thodar
            </h1>
            
            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-primary-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
              A unified platform bridging donors, healthcare facilities, and NGOs to ensure 
              <span className="text-accent font-medium"> life-saving resources</span> reach those who need them most.
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="accent-gradient text-accent-foreground font-semibold px-8 py-6 text-lg glow hover:scale-105 transition-transform" asChild>
                <Link to="/register">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 px-8 py-6 text-lg" asChild>
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-foreground/50 animate-bounce">
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-current rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4 gradient-text">
              Empowering Healthcare Together
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Three pillars working in harmony to save lives and strengthen communities
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Donor Card */}
            <div className="elevated-card p-8 text-center group">
              <div className="w-16 h-16 rounded-2xl accent-gradient mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Heart className="h-8 w-8 text-accent-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">For Donors</h3>
              <p className="text-muted-foreground leading-relaxed">
                Donate blood, medicine, or medical equipment. Track your impact and see the lives you've touched through your generosity.
              </p>
            </div>

            {/* Healthcare Facility Card */}
            <div className="elevated-card p-8 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Building2 className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">For Healthcare Facilities</h3>
              <p className="text-muted-foreground leading-relaxed">
                Request critical supplies or donate surplus equipment. Join a network that ensures resources flow where needed.
              </p>
            </div>

            {/* NGO Card */}
            <div className="elevated-card p-8 text-center group">
              <div className="w-16 h-16 rounded-2xl bg-success mx-auto mb-6 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Users className="h-8 w-8 text-success-foreground" />
              </div>
              <h3 className="font-serif text-2xl font-semibold mb-4">For NGOs</h3>
              <p className="text-muted-foreground leading-relaxed">
                Coordinate donations and requests seamlessly. Our smart matching ensures efficient resource allocation.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-muted/30 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">
              How It <span className="gradient-text">Works</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Register</h4>
              <p className="text-muted-foreground text-sm">
                Sign up as a donor, healthcare facility, or NGO
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Connect</h4>
              <p className="text-muted-foreground text-sm">
                Donate supplies or submit resource requests
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Match</h4>
              <p className="text-muted-foreground text-sm">
                Our system intelligently matches donations with needs
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 rounded-full accent-gradient text-accent-foreground font-bold text-xl flex items-center justify-center mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Deliver</h4>
              <p className="text-muted-foreground text-sm">
                Resources reach those in need, tracked every step
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Verified & Secure</h4>
                <p className="text-muted-foreground text-sm">
                  All donors and facilities are verified. Your data is encrypted and protected.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Real-time Tracking</h4>
                <p className="text-muted-foreground text-sm">
                  Monitor your donations from pickup to delivery with live status updates.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center flex-shrink-0">
                <Truck className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Flexible Delivery</h4>
                <p className="text-muted-foreground text-sm">
                  Choose pickup or self-drop options that work best for your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="hero-gradient py-12">
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Heart className="h-6 w-6 text-accent" />
            <span className="text-xl font-serif font-bold text-primary-foreground">Thodar</span>
          </div>
          <p className="text-primary-foreground/60 text-sm">
            © 2024 Thodar. Connecting lives through care.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
