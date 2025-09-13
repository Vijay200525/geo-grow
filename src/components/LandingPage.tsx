import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, TrendingUp, Target, Users } from "lucide-react";

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
  onGuest: () => void;
}

export const LandingPage = ({ onLogin, onRegister, onGuest }: LandingPageProps) => {
  return (
    <div className="min-h-screen bg-gradient-hero text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <MapPin className="h-12 w-12 text-accent mr-3" />
            <h1 className="text-5xl font-bold">HotspotPro</h1>
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
              Join thousands of successful business owners who use HotspotPro
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
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
              className="w-full sm:w-auto border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              Try as Guest
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};