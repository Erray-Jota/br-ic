import { useJsApiLoader } from '@react-google-maps/api';
import { GoogleMapsContext } from '../contexts/GoogleMapsContext';

const libraries = ['places'];

export const GoogleMapsLoader = ({ children }) => {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_API_KEY,
    libraries,
  });

  // Always render children so the app doesn't crash/block on map error
  return (
    <GoogleMapsContext.Provider value={{ isLoaded, loadError }}>
      {children}
    </GoogleMapsContext.Provider>
  );
};
