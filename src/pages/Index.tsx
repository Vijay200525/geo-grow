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
  const [userProfile, setUserProfile] = useState<{display_name?: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user profile if logged in
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        } else {
          setUserProfile(null);
        }
        
        // If user just logged in, redirect to location selection
        if (event === 'SIGNED_IN' && session) {
          setAppState('location');
        }
        
        // If user logged out, go back to landing
        if (event === 'SIGNED_OUT') {
          setAppState('landing');
          setUserLocation(null);
          setUserProfile(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Fetch user profile if logged in
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
      
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

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }
      
      setUserProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

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

  const handleBackToLandingWithoutLogout = () => {
    setAppState('landing');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAppState('landing');
    setUserLocation(null);
  };

  const handleChangeLocation = () => {
    setAppState('location');
  };

  if (appState === 'dashboard' && userLocation) {
    return (
      <Dashboard
        userLocation={userLocation}
        onBack={handleBackToLanding}
        onChangeLocation={handleChangeLocation}
      />
    );
  }

  return (
    <>
      <LandingPage
        onLogin={handleLogin}
        onRegister={handleRegister}
        onGuest={handleGuest}
        user={user}
        userProfile={userProfile}
        onLogout={handleLogout}
      />
      
      <LocationModal
        isOpen={appState === 'location'}
        onLocationSet={handleLocationSet}
        onClose={handleBackToLandingWithoutLogout}
      />
    </>
  );
};

export default Index;
