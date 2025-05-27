document.addEventListener('DOMContentLoaded', function () {
  const weatherDiv = document.getElementById('weather-result');
  const traveltimeDiv = document.getElementById('traveltime-result');
  const newsDiv = document.getElementById('news');
  const locationDiv = document.getElementById('location-result');
  const foursquareDiv = document.getElementById('foursquare-result');
  const fareDiv = document.getElementById('fare-result'); // Add this line

  window.fetchServices = function () {
    const fromLocation = document.getElementById('from-location').value.trim();
    const toLocation = document.getElementById('to-location').value.trim();

    // Clear previous results
    weatherDiv.innerHTML = '';
    traveltimeDiv.innerHTML = '';
    newsDiv.innerHTML = '';
    locationDiv.innerHTML = '';
    foursquareDiv.innerHTML = '';
    fareDiv.innerHTML = ''; // Clear fare result

    if (!fromLocation || !toLocation) {
      weatherDiv.innerHTML = 'Please enter both starting location and destination.';
      return;
    }

    // Add Result text just below the Get Services button (above all results)
    const resultText = document.createElement('div');
    resultText.className = 'result-header';
    resultText.style.textAlign = 'center';
    resultText.style.marginBottom = '1.2rem';
    resultText.style.fontSize = '1.08rem';
    resultText.style.fontWeight = '600';
    resultText.style.letterSpacing = '0.2px';
    resultText.innerHTML = `Showing results for <span style="color:#ffd700">${fromLocation}</span> to <span style="color:#ffd700">${toLocation}</span>`;

    // Insert right after the location-input (Get Services button)
    const locationInput = document.querySelector('.location-input');
    const prevHeader = locationInput.nextElementSibling && locationInput.nextElementSibling.classList.contains('result-header')
      ? locationInput.nextElementSibling
      : null;
    if (prevHeader) prevHeader.remove();
    locationInput.parentNode.insertBefore(resultText, locationInput.nextElementSibling);

    // 1. Geocode destination to get lat/lon for other services
    locationDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
    fetch(`http://127.0.0.1:8000/api/geocode/${encodeURIComponent(toLocation)}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const geo = data[0];
          locationDiv.innerHTML = `
            <div class="location-card">
              <h3>Destination</h3>
              <p><strong>Address:</strong> ${geo.display_name || toLocation}</p>
              <p><strong>Latitude:</strong> ${geo.lat}</p>
              <p><strong>Longitude:</strong> ${geo.lon}</p>
            </div>
          `;

          // 2. Weather at destination
          weatherDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          fetch(`http://127.0.0.1:8000/api/weather`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ city: toLocation })
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

          // 3. Travel Time from origin to destination
          traveltimeDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          // Geocode origin for coordinates
          fetch(`http://127.0.0.1:8000/api/geocode/${encodeURIComponent(fromLocation)}`)
            .then(res => res.json())
            .then(originData => {
              if (Array.isArray(originData) && originData.length > 0) {
                const originGeo = originData[0];
                fetch(`http://127.0.0.1:8000/api/tomtom/route?origin_lat=${originGeo.lat}&origin_lon=${originGeo.lon}&destination_lat=${geo.lat}&destination_lon=${geo.lon}`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.routes && data.routes[0] && data.routes[0].summary) {
                      const summary = data.routes[0].summary;
                        traveltimeDiv.innerHTML = `
                        <div class="travel-card">
                          <h3>Travel Time</h3>
                          <p><strong>From:</strong> ${fromLocation}</p>
                          <p><strong>To:</strong> ${toLocation}</p>
                          <p><strong>Length in Meters:</strong> ${summary.lengthInMeters}</p>
                          <p><strong>Travel Time in Seconds:</strong> ${summary.travelTimeInSeconds}</p>
                          <p><strong>Departure:</strong> ${new Date(summary.departureTime).toLocaleString()}</p>
                          <p><strong>Arrival:</strong> ${new Date(summary.arrivalTime).toLocaleString()}</p>
                        </div>
                        `;

                        // Fare calculation based on travel distance (simple example)
                        // For example: base fare + per km rate
                        const baseFare = 50; // base fare in your currency
                        const perKmRate = 15; // per km rate in your currency
                        const distanceKm = summary.lengthInMeters / 1000;
                        const estimatedFare = Math.round(baseFare + (distanceKm * perKmRate));

                        fareDiv.innerHTML = `
                          <div class="travel-card">
                          <h3>Fare Estimate</h3>
                          <p><strong>Distance:</strong> ${distanceKm.toFixed(2)} km</p>
                          <p><strong>Estimated Fare:</strong> ₱${estimatedFare}</p>
                          </div>
                        `;
                    } else {
                      traveltimeDiv.innerHTML = 'No travel time found.';
                    }
                  })
                  .catch(() => traveltimeDiv.innerHTML = 'Error fetching travel time.');
              } else {
                traveltimeDiv.innerHTML = 'Invalid starting location.';
              }
            })
            .catch(() => traveltimeDiv.innerHTML = 'Error fetching origin location.');

          // 4. Places (Foursquare) at destination
          foursquareDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
          fetch(`http://127.0.0.1:8000/api/places?query=mall&lat=${geo.lat}&lon=${geo.lon}`)
            .then(res => res.json())
            .then(data => {
              if (data.results && data.results.length > 0) {
                foursquareDiv.innerHTML = data.results.slice(0, 4).map(place => ` 
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
          locationDiv.innerHTML = 'No destination location data found.';
          weatherDiv.innerHTML = '';
          traveltimeDiv.innerHTML = '';
          foursquareDiv.innerHTML = '';
        }
      })
      .catch(() => {
        locationDiv.innerHTML = 'Error fetching destination location.';
        weatherDiv.innerHTML = '';
        traveltimeDiv.innerHTML = '';
        foursquareDiv.innerHTML = '';
      });

    // 5. News at destination (can run in parallel)
    newsDiv.innerHTML = `<div class="loading-spinner"><div class="spinner-circle"></div></div>`;
    fetch(`http://127.0.0.1:8000/api/gnews/${encodeURIComponent(toLocation)}`)
      .then(res => res.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          const limitedArticles = data.articles.slice(0, 4);
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
  }
});
