function SimpleMarkerWithWeather() {
  const [showMap, setShowMap] = useState(false);

  function toggleMap() {
    setShowMap(!showMap);
  }
  useEffect(() => {
    initMap();
  }, []); // Run once on component mount

  function initMap() {
    var map = new window.google.maps.Map(document.getElementById('map'), {
      center: { lat: 40.12150192260742, lng: -100.45039367675781 },
      zoom: 4,
      // Set language to Chinese
      language: 'zh-CN'
    });

    // Get weather information for the center of the map
    getWeather(map.getCenter());
  }

  function getWeather(location) {
    var apiKey = 'YOUR_OPENWEATHERMAP_API_KEY';
    var apiUrl = 'https://api.openweathermap.org/data/2.5/weather?lat=' + location.lat() + '&lon=' + location.lng() + '&appid=' + apiKey;

    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        var weatherDescription = data.weather[0].description;
        var temperature = data.main.temp - 273.15; // Convert temperature from Kelvin to Celsius

        var weatherInfo = "Location: " + data.name + "<br>Weather: " + weatherDescription + "<br>Temperature: " + temperature.toFixed(2) + "°C";

        document.getElementById('weather-info').innerHTML = weatherInfo;
      })
      .catch(error => console.error('Error fetching weather data:', error));
  }

  return (
    <div>
    <button onClick={toggleMap}>{showMap ? 'Hide Map' : 'Show Map'}</button>
    {showMap && (
      <>
        <div id="weather-info"></div>
        <div id="map" style={{ height: '400px' }}></div>
        <div>
      <h1>Weather App</h1>
      <SimpleMarkerWithWeather />
    </div>
      </>
    )}
  </div>
  );
}

