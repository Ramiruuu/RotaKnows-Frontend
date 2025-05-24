document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('calendar-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('event-title').value;
    const date = document.getElementById('event-date').value;
    const resultDiv = document.getElementById('calendar-result');
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, date })
      });
      const data = await response.json();
      if (response.ok) {
        resultDiv.innerHTML = `
          <h3>Event Added</h3>
          <p>Title: ${data.title}</p>
          <p>Date: ${data.date}</p>
        `;
        if (window.gsap) {
          gsap.from(resultDiv, { opacity: 0, y: 20, duration: 1 });
        }
      } else {
        resultDiv.innerHTML = `<p class="error">Error: ${data.message}</p>`;
      }
    } catch (error) {
      resultDiv.innerHTML = `<p class="error">Failed to add event. Please try again.</p>`;
    }
  });
});