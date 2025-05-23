document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => card.classList.add('hovered'));
    card.addEventListener('mouseleave', () => card.classList.remove('hovered'));
    card.querySelector('.cta-button')?.addEventListener('click', e => {
      // Optionally show more info in a modal
    });
  });
});