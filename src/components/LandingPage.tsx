import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp, Target, Users, Database, Github, CheckCircle, ExternalLink, User, LogOut } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
  user: SupabaseUser | null;
  userProfile: { display_name?: string } | null;
  onLogout: () => void;
}

export const LandingPage = ({ onLogin, onRegister, onGuest, user, userProfile, onLogout }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* User Status */}
        <div className="absolute top-4 right-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 bg-card/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20 hover:bg-card/20">
                  <User className="h-4 w-4 text-accent" />
                  <span className="text-sm font-medium">
                    {userProfile?.display_name || 'User'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={onLogout} className="text-destructive focus:text-destructive">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2 bg-card/10 backdrop-blur-sm rounded-lg px-3 py-2 border border-white/20">
              <User className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium">Guest</span>
            </div>
          )}
        </div>
        
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 text-accent mr-3" />
            <h1 className="text-5xl font-bold">HotspotsNearMe</h1>
          </div>
          <p className="text-xl text-primary-foreground/80 max-w-2xl mx-auto">
            Discover the perfect location for your next business venture with AI-powered 
            hotspot analysis and real-time market intelligence.
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Market Intelligence
              </h3>
              <p className="text-muted-foreground">
                Advanced analytics to identify high-performing commercial areas
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Target className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Precision Targeting
              </h3>
              <p className="text-muted-foreground">
                Find locations optimized for your specific business type
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-card-foreground mb-2">
                Demographic Insights
              </h3>
              <p className="text-muted-foreground">
                Comprehensive foot traffic and customer profile analysis
              </p>
            </CardContent>
          </Card>
        </div>


        {/* CTA Section */}
        <div className="text-center">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Location?</h2>
            <p className="text-lg text-primary-foreground/80">
              Join thousands of successful business owners who use HotspotsNearMe
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
            {user ? (
              <Button 
                onClick={onGuest}
                className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                size="lg"
              >
                Find Hotspots
              </Button>
            ) : (
              <>
                <Button 
                  onClick={onLogin}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  Login
                </Button>
                
                <Button 
                  onClick={onRegister}
                  className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  Get Started
                </Button>
                
                <Button 
                  onClick={onGuest}
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 hover:text-white"
                >
                  Try as Guest
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};