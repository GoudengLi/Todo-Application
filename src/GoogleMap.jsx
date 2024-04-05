import React, { useState, useEffect } from 'react';

const GoogleMap = ({ initialCoordinates }) => {
  const [coordinates, setCoordinates] = useState(initialCoordinates);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    setCoordinates(initialCoordinates);
  }, [initialCoordinates]);

  const initMap = () => {
    if (coordinates && window.google) {
      const center = new window.google.maps.LatLng(coordinates.latitude, coordinates.longitude);
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: center,
        zoom: 10
      });
      new window.google.maps.Marker({
        position: center,
        map: map
      });
    }
  };

  useEffect(() => {
    if (coordinates) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.latitude},${coordinates.longitude}&language=en&key=AIzaSyCHFbUw9TjQzw8vZY80ZXrGeyx3FkYRT2M`)
        .then(response => response.json())
        .then(data => {
          if (data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          }
        })
        .catch(error => {
          console.error('Error fetching location:', error);
        });

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=metric&lang=en&appid=e22ae78022bb406a0d91b87eb581646c`)
        .then(response => response.json())
        .then(data => {
          setWeather(data);
        })
        .catch(error => {
          console.error('Error fetching weather:', error);
        });
    }
  }, [coordinates]);

  useEffect(() => {
    window.initMap = initMap; // Expose initMap function to global scope
    window.onload = initMap; // Call initMap when the entire page is loaded
    
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCHFbUw9TjQzw8vZY80ZXrGeyx3FkYRT2M&callback=initMap&libraries=places`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.initMap = initMap;
    } else {
      initMap(); // Call initMap directly if google object is already defined
    }
  }, [coordinates]);

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>
      {location && <p>location：{location}</p>}
      {weather && (
        <div>
          <p>weather：{weather.weather[0].description}</p>
          <p>temperature：{weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;


