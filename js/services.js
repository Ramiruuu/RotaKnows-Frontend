document.addEventListener("DOMContentLoaded", () => {
  const newsForm = document.getElementById("news-form");
  const newsQuery = document.getElementById("news-query");
  const newsResult = document.getElementById("news-result");

  // Handle form submission
  newsForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = newsQuery.value.trim();

    if (!query) return;

    newsResult.innerHTML = "<p>Loading news...</p>";

    await fetchNews(query);
  });

  // Fetch default tech news on page load
  fetchNews("tech");

  // Function to fetch news
  async function fetchNews(query) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/gnews/${encodeURIComponent(query)}`, {
        method: "GET",
        credentials: "include", // only include if backend uses cookies
        headers: {
          "Accept": "application/json",
        }
      });

      if (!res.ok) throw new Error("Failed to fetch news.");

      const data = await res.json();
      newsResult.innerHTML = "";

      if (!data.articles || data.articles.length === 0) {
        newsResult.innerHTML = "<p>No articles found.</p>";
        return;
      }

      data.articles.forEach(article => {
        const card = document.createElement("div");
        card.className = "news-card";
        card.innerHTML = `
          <h3>${article.title}</h3>
          <p>${article.description || "No description available."}</p>
          <a href="${article.url}" target="_blank">Read more</a>
        `;
        newsResult.appendChild(card);
      });

    } catch (error) {
      newsResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
  }
});
