document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('news-form');
  const newsDiv = document.getElementById('news');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const query = document.getElementById('news-query').value.trim();
    const url = `http://127.0.0.1:8000/api/gnews/${encodeURIComponent(query)}`;

    // Show a loading spinner or animation
    newsDiv.innerHTML = 'Loading...';

    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.articles && data.articles.length > 0) {
          // Limit to 5 results
          const limitedArticles = data.articles.slice(0, 8);
          newsDiv.innerHTML = limitedArticles.map(article => `
            <div class="news-card">
              <h3>${article.title}</h3>
              <p>${article.description || ''}</p>
              <a href="${article.url}" target="_blank">Read more</a>
            </div>
          `).join('');
        } else {
          newsDiv.innerHTML = 'No news found for this query.';
        }
      })
      .catch(error => {
        newsDiv.innerHTML = 'Error fetching news: ' + error;
      });
  });
});

