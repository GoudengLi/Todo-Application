import React, { useState, useEffect } from 'react';

const GoogleMap = () => {
  const [coordinates, setCoordinates] = useState(null);
  const [location, setLocation] = useState('');
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        error => {
          console.error('获取地理位置出错:', error);
        }
      );
    } else {
      console.error('该浏览器不支持地理位置功能.');
    }
  }, []);

  useEffect(() => {
    if (coordinates) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.lat},${coordinates.lng}&language=en&key=YOUR_GOOGLE_MAPS_API_KEY`)
        .then(response => response.json())
        .then(data => {
          if (data.results.length > 0) {
            setLocation(data.results[0].formatted_address);
          }
        })
        .catch(error => {
          console.error('获取地名信息出错:', error);
        });

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${coordinates.lat}&lon=${coordinates.lng}&units=metric&lang=en&appid=e22ae78022bb406a0d91b87eb581646c`)
        .then(response => response.json())
        .then(data => {
          setWeather(data);
        })
        .catch(error => {
          console.error('获取天气信息出错:', error);
        });
    }
  }, [coordinates]);

  useEffect(() => {
    if (coordinates) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCHFbUw9TjQzw8vZY80ZXrGeyx3FkYRT2M&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      window.initMap = initMap; // 将 initMap 函数暴露给全局作用域
    }
  }, [coordinates]);

  const initMap = () => {
    if (coordinates) {
      const map = new window.google.maps.Map(document.getElementById('map'), {
        center: coordinates,
        zoom: 10
      });
      new window.google.maps.Marker({
        position: coordinates,
        map: map
      });
    }
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '400px' }}></div>

      {location && <p>当前位置: {location}</p>}

      {weather && (
        <div>
          <p>天气情况: {weather.weather[0].description}</p>
          <p>当前温度: {weather.main.temp}°C</p>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;


