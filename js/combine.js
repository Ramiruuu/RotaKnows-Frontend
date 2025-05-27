document.addEventListener('DOMContentLoaded', function () {
  const weatherDiv = document.getElementById('weather-result');
  const traveltimeDiv = document.getElementById('traveltime-result');
  const newsDiv = document.getElementById('news');
  const locationDiv = document.getElementById('location-result');
  const foursquareDiv = document.getElementById('foursquare-result');

  window.fetchServices = function () {
    const location = document.getElementById('location').value.trim();
    if (!location) {
      weatherDiv.innerHTML = 'Please enter a location.';
      traveltimeDiv.innerHTML = '';
      newsDiv.innerHTML = '';
      locationDiv.innerHTML = '';
      foursquareDiv.innerHTML = '';
      return;
    }

    // 1. Geocode first to get lat/lon for other services
    locationDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
    fetch(`http://localhost/RotaKnows-Commuting-Made-Easier/public/api/geocode/${encodeURIComponent(location)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const geo = data[0];
          locationDiv.innerHTML = `
            <div class="location-card">
              <h3>Location</h3>
              <p><strong>Address:</strong> ${geo.display_name || location}</p>
              <p><strong>Latitude:</strong> ${geo.lat}</p>
              <p><strong>Longitude:</strong> ${geo.lon}</p>
            </div>
          `;

          // 2. Weather (POST with city)
          weatherDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          fetch(`http://localhost/RotaKnows-Commuting-Made-Easier/public/api/weather`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city: location })
          })
            .then(res => res.json())
            .then(data => {
              if (data.weather && data.weather.main && data.weather.weather) {
                weatherDiv.innerHTML = `
                  <div class="weather-card">
                    <h3>Weather</h3>
                    <p><strong>Temperature:</strong> ${data.weather.main.temp}°C</p>
                    <p><strong>Condition:</strong> ${data.weather.weather[0].description}</p>
                  </div>
                `;
              } else {
                weatherDiv.innerHTML = 'No weather data found.';
              }
            })
            .catch(() => weatherDiv.innerHTML = 'Error fetching weather.');

          // 3. Travel Time (TomTom)
          traveltimeDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          fetch(`http://localhost/RotaKnows-Commuting-Made-Easier/public/api/tomtom/route?origin_lat=${geo.lat}&origin_lon=${geo.lon}&destination_lat=${geo.lat}&destination_lon=${geo.lon}`)
            .then(res => res.json())
            .then(data => {
              if (data.routes && data.routes[0]) {
                const summary = data.routes[0].summary;
                traveltimeDiv.innerHTML = `
                  <div class="travel-card">
                    <h3>Travel Time</h3>
                    <p><strong>From:</strong> ${location}</p>
                    <p><strong>To:</strong> ${location}</p>
                    <p><strong>Duration:</strong> ${(summary.travelTimeInSeconds / 60).toFixed(1)} mins</p>
                    <p><strong>Distance:</strong> ${(summary.lengthInMeters / 1000).toFixed(2)} km</p>
                  </div>
                `;
              } else {
                traveltimeDiv.innerHTML = 'No travel time found.';
              }
            })
            .catch(() => traveltimeDiv.innerHTML = 'Error fetching travel time.');

          // 4. Places (Foursquare)
          foursquareDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          fetch(`http://localhost/RotaKnows-Commuting-Made-Easier/public/api/places?query=mall&lat=${geo.lat}&lon=${geo.lon}`)
            .then(res => res.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                foursquareDiv.innerHTML = data.results.slice(0, 3).map(place => ` 
                  <div class="foursquare-card">
                    <h3>Places</h3>
                    <h3>${place.name}</h3>
                    <p>${place.location && place.location.formatted_address ? place.location.formatted_address : ''}</p>
                  </div>
                `).join('');
              } else {
                foursquareDiv.innerHTML = 'No places found.';
              }
            })
            .catch(() => foursquareDiv.innerHTML = 'Error fetching places.');

        } else {
          locationDiv.innerHTML = 'No location data found.';
          weatherDiv.innerHTML = '';
          traveltimeDiv.innerHTML = '';
          foursquareDiv.innerHTML = '';
        }
      })
      .catch(() => {
        locationDiv.innerHTML = 'Error fetching location.';
        weatherDiv.innerHTML = '';
        traveltimeDiv.innerHTML = '';
        foursquareDiv.innerHTML = '';
      });

    // 5. News (can run in parallel)
    newsDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
    fetch(`http://localhost/RotaKnows-Commuting-Made-Easier/public/api/gnews/${encodeURIComponent(location)}`)
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          const limitedArticles = data.articles.slice(0, 3);
          newsDiv.innerHTML = limitedArticles.map(article => `
            <div class="news-card">
            <h3>News</h3>
              <h3>${article.title}</h3>
              <p>${article.description || ''}</p>
              <a href="${article.url}" target="_blank">Read more</a>
            </div>
          `).join('');
        } else {
          newsDiv.innerHTML = 'No news found for this query.';
        }
      })
      .catch(() => newsDiv.innerHTML = 'Error fetching news.');
  };
});