import { useState, useRef, useEffect, useContext } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { findNearestRaapCity } from '../data/raapCities';
import { GoogleMapsContext } from '../contexts/GoogleMapsContext';

/**
 * LocationInput Component
 * Provides autocomplete for US cities and zip codes via Google Places Autocomplete
 * Calculates nearest RaaP city for cost factors without displaying it to user
 */
const LocationInput = ({ value, onChange, label, placeholder = 'Enter city or zip code' }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const autocompleteRef = useRef(null);
  const { isLoaded, loadError } = useContext(GoogleMapsContext);

  // Update input value when prop changes
  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();

      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();

        // Use formatted address for display
        const formattedAddress = place.formatted_address;
        setInputValue(formattedAddress);

        // Find nearest RaaP city to calculate cost factor
        const nearestRaapCity = findNearestRaapCity(lat, lng);

        // Call onChange with both display location and calculated factor
        onChange({
          displayLocation: formattedAddress,
          factor: nearestRaapCity.factor,
          coordinates: { lat, lng },
          nearestRaapCity: nearestRaapCity.name,
        });
      } else {
        console.log('No geometry available for place');
      }
    }
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  // Handle Map Load Error - Fallback to simple input
  if (loadError) {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
            {label}
          </label>
        )}
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #ef4444', // Red border to indicate issue
            borderRadius: '6px',
            outline: 'none',
          }}
        />
        <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px' }}>
          Location services unavailable. Manual entry only.
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div style={{ width: '100%' }}>
        {label && (
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
            {label}
          </label>
        )}
        <input
          type="text"
          value={inputValue}
          disabled
          placeholder="Loading maps..."
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            backgroundColor: '#f3f4f6',
            cursor: 'not-allowed'
          }}
        />
      </div>
    );
  }

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
          {label}
        </label>
      )}
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          types: ['(cities)'],
          componentRestrictions: { country: 'us' }
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            padding: '10px 12px',
            fontSize: '14px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={(e) => {
            e.target.style.borderColor = '#9ca3af';
          }}
          onMouseLeave={(e) => {
            e.target.style.borderColor = '#d1d5db';
          }}
          onFocus={(e) => e.target.select()}
        />
      </Autocomplete>
    </div>
  );
};

export default LocationInput;
