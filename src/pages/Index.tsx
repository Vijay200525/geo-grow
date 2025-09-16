import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LandingPage } from "@/components/LandingPage";
import { LocationModal } from "@/components/LocationModal";
import { Dashboard } from "@/components/Dashboard";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

type AppState = 'landing' | 'location' | 'dashboard';

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // If user just logged in, redirect to location selection
        if (event === 'SIGNED_IN' && session) {
          setAppState('location');
        }
        
        // If user logged out, go back to landing
        if (event === 'SIGNED_OUT') {
          setAppState('landing');
          setUserLocation(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // If user is already logged in, show location or dashboard
      if (session) {
        if (userLocation) {
          setAppState('dashboard');
        } else {
          setAppState('location');
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [userLocation]);

  const handleLogin = () => {
    navigate('/auth/login');
  };

  const handleRegister = () => {
    navigate('/auth/signup');
  };

  const handleGuest = () => {
    setAppState('location');
  };

  const handleLocationSet = (lat: number, lng: number, address: string) => {
    setUserLocation({ lat, lng, address });
    setAppState('dashboard');
  };

  const handleBackToLanding = async () => {
    if (user) {
      await supabase.auth.signOut();
    }
    setAppState('landing');
    setUserLocation(null);
  };

  if (appState === 'dashboard' && userLocation) {
    return (
      <Dashboard
        userLocation={userLocation}
        onBack={handleBackToLanding}
      />
    );
  }

  return (
    <>
      <LandingPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuest={handleGuest}
      />
      
      <LocationModal
        isOpen={appState === 'location'}
        onLocationSet={handleLocationSet}
      />
    </>
  );
};

export default Index;
