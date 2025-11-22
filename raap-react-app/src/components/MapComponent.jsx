import React, { useContext, useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { GoogleMapsContext } from './GoogleMapsLoader';

const defaultContainerStyle = {
    width: '100%',
    height: '400px'
};

const defaultCenter = {
    lat: 37.7749,
    lng: -122.4194
};

export const MapComponent = ({
    center = defaultCenter,
    zoom = 10,
    markers = [],
    showRoute = false,
    height = '400px',
    onRouteCalculated = null,
    autoFitBounds = false
}) => {
    const { isLoaded } = useContext(GoogleMapsContext);
    const [directions, setDirections] = useState(null);
    const [map, setMap] = useState(null);
    const hasFitBounds = useRef(false);

    const containerStyle = {
        width: '100%',
        height: height
    };

    // Fetch directions when showRoute is enabled and we have exactly 2 markers
    useEffect(() => {
        if (!isLoaded || !showRoute || markers.length !== 2) {
            setDirections(null);
            hasFitBounds.current = false;
            if (onRouteCalculated) {
                onRouteCalculated(null);
            }
            return;
        }

        // Reset fit bounds flag when markers change
        hasFitBounds.current = false;

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
            {
                origin: markers[0].position,
                destination: markers[1].position,
                travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    setDirections(result);

                    // Fit bounds only once when route is first loaded
                    if (map && !hasFitBounds.current) {
                        const bounds = new window.google.maps.LatLngBounds();
                        result.routes[0].legs[0].steps.forEach(step => {
                            bounds.extend(step.start_location);
                            bounds.extend(step.end_location);
                        });
                        map.fitBounds(bounds);
                        hasFitBounds.current = true;
                    }

                    // Extract route metadata
                    if (onRouteCalculated && result.routes[0]) {
                        const route = result.routes[0];
                        const leg = route.legs[0];

                        const metadata = {
                            distance: leg.distance.text,
                            distanceValue: leg.distance.value,
                            duration: leg.duration.text,
                            durationValue: leg.duration.value,
                            startAddress: leg.start_address,
                            endAddress: leg.end_address,
                            warnings: route.warnings || []
                        };

                        onRouteCalculated(metadata);
                    }
                } else {
                    console.error('Directions request failed:', status);
                    setDirections(null);
                    if (onRouteCalculated) {
                        onRouteCalculated(null);
                    }
                }
            }
        );
    }, [isLoaded, showRoute, markers, onRouteCalculated, map]);


    if (!isLoaded) {
        return <div>Loading Map...</div>;
    }

    const onLoad = (mapInstance) => {
        setMap(mapInstance);
    };

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={zoom}
            onLoad={onLoad}
            options={{
                zoomControl: true,
                mapTypeControl: false,
                scaleControl: true,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: true,
                gestureHandling: 'greedy'
            }}
        >
            {/* Show markers only if not showing directions */}
            {!directions && markers.map((marker, index) => {
                // Create custom icon if icon data is provided
                let icon = undefined;
                if (marker.icon) {
                    icon = {
                        path: marker.icon.path || window.google.maps.SymbolPath.CIRCLE,
                        fillColor: marker.icon.fillColor || '#FF0000',
                        fillOpacity: marker.icon.fillOpacity || 1,
                        strokeColor: marker.icon.strokeColor || '#FFFFFF',
                        strokeWeight: marker.icon.strokeWeight || 2,
                        scale: marker.icon.scale || 8,
                    };
                }

                return (
                    <Marker
                        key={index}
                        position={marker.position}
                        title={marker.title}
                        icon={icon}
                        label={marker.label}
                    />
                );
            })}

            {/* Show directions route if available */}
            {directions && (
                <DirectionsRenderer
                    directions={directions}
                    options={{
                        suppressMarkers: false,
                        preserveViewport: true,
                        polylineOptions: {
                            strokeColor: '#2563EB',
                            strokeOpacity: 0.8,
                            strokeWeight: 4
                        }
                    }}
                />
            )}
        </GoogleMap>
    );
};
