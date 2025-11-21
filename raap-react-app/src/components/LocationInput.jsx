import { useState, useRef, useEffect } from 'react';
import { findNearestRaapCity } from '../data/raapCities';

/**
 * LocationInput Component
 * Provides autocomplete for US cities and zip codes via Google Geocoding API
 * Supports all 44,000+ US zip codes
 * Calculates nearest RaaP city for cost factors without displaying it to user
 */
const LocationInput = ({ value, onChange, label, placeholder = 'Enter city or zip code' }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY || '';
  const debounceTimer = useRef(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update input value when prop changes
  useEffect(() => {
    if (value !== inputValue) {
      setInputValue(value || '');
    }
  }, [value]);

  // Search using Google Geocoding API directly
  const searchLocations = async (query) => {
    console.log('🔍 LocationInput - API Key present:', !!apiKey);
    console.log('🔍 LocationInput - Query:', query);

    if (!apiKey || query.length < 2) {
      if (!apiKey) {
        console.warn('⚠️ No Google API key found! Check your .env file');
      }
      setSuggestions([]);
      return;
    }

    try {
      console.log('🌐 Fetching locations from Google Geocoding API...');
      // Use Geocoding API to find locations
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&country=us&key=${apiKey}`
      );

      const data = await response.json();
      console.log('📍 Google API Response:', data);

      if (data.status === 'OK' && data.results && data.results.length > 0) {
        const results = data.results.slice(0, 8).map((result) => {
          const location = result.geometry.location;
          const formatted = result.formatted_address;
          
          // Extract zip code and city info
          const zipMatch = formatted.match(/(\d{5})/);
          const zipCode = zipMatch ? zipMatch[1] : '';
          
          return {
            display: formatted.split(',').slice(0, 2).join(',').trim(),
            fullDisplay: formatted,
            lat: location.lat,
            lng: location.lng,
            zip: zipCode
          };
        });
        
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error('Location search error:', err);
      setSuggestions([]);
    }
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setSelectedIndex(-1);

    // Debounce API calls
    clearTimeout(debounceTimer.current);
    if (newValue.length >= 2) {
      debounceTimer.current = setTimeout(() => {
        searchLocations(newValue);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (location) => {
    const displayValue = location.fullDisplay || location.display;
    setInputValue(displayValue);
    setShowSuggestions(false);
    setSuggestions([]);

    // Find nearest RaaP city to calculate cost factor
    const nearestRaapCity = findNearestRaapCity(location.lat, location.lng);

    // Call onChange with both display location and calculated factor
    onChange({
      displayLocation: displayValue,
      factor: nearestRaapCity.factor,
      coordinates: { lat: location.lat, lng: location.lng },
      nearestRaapCity: nearestRaapCity.name, // For internal use only, never displayed
    });
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : prev));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSuggestions([]);
        break;
    }
  };

  const handleBlur = () => {
    // Delay to allow click on suggestion to register
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={wrapperRef}>
      {label && (
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: '#374151' }}>
          {label}
        </label>
      )}
      <input
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        onFocus={() => {
          if (suggestions.length > 0) {
            setShowSuggestions(true);
          }
        }}
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
      />

      {showSuggestions && suggestions.length > 0 && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            marginTop: '4px',
            background: 'white',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            maxHeight: '300px',
            overflowY: 'auto',
            zIndex: 1000,
          }}
        >
          {suggestions.length > 0 ? (
            suggestions.map((location, index) => (
              <div
                key={`${location.lat}-${location.lng}`}
                onClick={() => handleSelectSuggestion(location)}
                onMouseEnter={() => setSelectedIndex(index)}
                style={{
                  padding: '10px 12px',
                  cursor: 'pointer',
                  background: selectedIndex === index ? '#f3f4f6' : 'white',
                  borderBottom: index < suggestions.length - 1 ? '1px solid #e5e7eb' : 'none',
                  transition: 'background-color 0.15s',
                }}
              >
                <div style={{ fontSize: '14px', fontWeight: 500, color: '#111827' }}>
                  {location.display}
                </div>
                {location.zip && (
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>
                    Zip: {location.zip}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div style={{ padding: '10px 12px', color: '#9ca3af', fontSize: '13px' }}>
              No locations found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
