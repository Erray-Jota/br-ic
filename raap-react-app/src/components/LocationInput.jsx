import { useState, useRef, useEffect } from 'react';
import { findNearestRaapCity } from '../data/raapCities';

/**
 * LocationInput Component
 * Provides autocomplete for US cities and zip codes via Google Geocoding API
 * Filters to show only cities and towns (no streets, airports, etc.)
 * Calculates nearest RaaP city for cost factors without displaying it to user
 */
const LocationInput = ({ value, onChange, label, placeholder = 'Enter city or zip code' }) => {
  const [inputValue, setInputValue] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const wrapperRef = useRef(null);
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

  // Update input value when prop changes (only on external value changes, not internal edits)
  useEffect(() => {
    setInputValue(value || '');
  }, [value, setInputValue]);

  // Search using Google Geocoding API - Reliable and handles military bases well
  const searchLocations = async (query) => {
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
      if (!apiKey) {
        console.error('Google API key not found');
        setSuggestions([]);
        return;
      }

      // Use Google Places API for autocomplete (more reliable than geocoding alone)
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=country:us`;
      
      const response = await fetch(url);
      const data = await response.json();
      console.log('Google Places response:', data.predictions?.length || 0, 'results');

      if (data.predictions && data.predictions.length > 0) {
        const results = await Promise.all(
          data.predictions.slice(0, 8).map(async (prediction) => {
            try {
              // Get detailed information including lat/lng using Place ID
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${prediction.place_id}&key=${apiKey}&fields=geometry,formatted_address`;
              const detailsResponse = await fetch(detailsUrl);
              const detailsData = await detailsResponse.json();
              
              if (detailsData.result && detailsData.result.geometry) {
                const lat = detailsData.result.geometry.location.lat;
                const lng = detailsData.result.geometry.location.lng;
                return {
                  display: prediction.description,
                  fullDisplay: detailsData.result.formatted_address || prediction.description,
                  lat,
                  lng,
                  zip: ''
                };
              }
            } catch (err) {
              console.error('Error fetching place details:', err);
            }
            return null;
          })
        );

        const validResults = results.filter(r => r !== null);
        setSuggestions(validResults);
        setShowSuggestions(validResults.length > 0);
        console.log('Filtered results:', validResults.length);
      } else {
        console.log('No results found');
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
    const displayValue = location.display;
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
      nearestRaapCity: nearestRaapCity.name,
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
        onFocus={(e) => {
          // Select all text when clicking on the box
          e.target.select();
          // Trigger search for current value
          if (inputValue.length >= 2) {
            searchLocations(inputValue);
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
          {suggestions.map((location, index) => (
            <div
              key={`${location.lat}-${location.lng}-${index}`}
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
