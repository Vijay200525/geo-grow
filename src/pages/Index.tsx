import { useState } from "react";
import { LandingPage } from "@/components/LandingPage";
import { LocationModal } from "@/components/LocationModal";
import { Dashboard } from "@/components/Dashboard";

type AppState = 'landing' | 'location' | 'dashboard';

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);

  const handleAuthAction = () => {
    setAppState('location');
  };

  const handleLocationSet = (lat: number, lng: number, address: string) => {
    setUserLocation({ lat, lng, address });
    setAppState('dashboard');
  };

  const handleBackToLanding = () => {
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
        onLogin={handleAuthAction}
        onRegister={handleAuthAction}
        onGuest={handleAuthAction}
      />
      
      <LocationModal
        isOpen={appState === 'location'}
        onLocationSet={handleLocationSet}
      />
    </>
  );
};

export default Index;
