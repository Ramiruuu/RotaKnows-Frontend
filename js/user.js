// Handles validation for signup and login forms

document.addEventListener('DOMContentLoaded', () => {
  // Signup form validation
  const signupForm = document.querySelector('.signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', e => {
      const email = signupForm.querySelector('input[type="email"]').value.trim();
      const password = signupForm.querySelector('input[type="password"]').value;
      if (!email.includes('@') || password.length < 6) {
        e.preventDefault();
        alert('Please enter a valid email and a password with at least 6 characters.');
      }
    });
  }

  // Login form validation
  const loginForm = document.querySelector('.login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      const email = loginForm.querySelector('input[type="email"]').value.trim();
      const password = loginForm.querySelector('input[type="password"]').value;
      if (!email.includes('@') || password.length < 6) {
        e.preventDefault();
        alert('Invalid email or password. Please try again.');
      }
    });
  }
});