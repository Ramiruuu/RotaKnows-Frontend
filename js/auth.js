const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

// Sliding panel logic
signUpButton.addEventListener('click', () => {
    container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
    container.classList.remove("right-panel-active");
});

// Fixed credentials for demo login
const validUsers = [
    { email: "test@gmail.com", password: "test123" },
    { email: "test1@test.com", password: "test123" },
    { email: "rotaknows@gmail.com", password: "rota123" }
];

// Register form logic (adds new user to validUsers array)
const registerForm = document.querySelector('.sign-up-container form');
if (registerForm) {
    registerForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const name = registerForm.querySelector('input[type="text"]').value.trim();
        const email = registerForm.querySelector('input[type="email"]').value.trim();
        const password = registerForm.querySelector('input[type="password"]').value.trim();

        // Check if email already exists
        const exists = validUsers.some(user => user.email === email);
        if (exists) {
            alert("Email already registered.");
            return;
        }

        // Add new user to validUsers array
        validUsers.push({ email, password });
        alert("Registration successful! You can now log in.");
        container.classList.remove("right-panel-active"); // Switch to login panel
        registerForm.reset();
    });
}

// Login form validation
const loginForm = document.querySelector('.sign-in-container form');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = loginForm.querySelector('input[type="email"]').value.trim();
        const password = loginForm.querySelector('input[type="password"]').value.trim();
        const found = validUsers.some(user => user.email === email && user.password === password);
        if (found) {
            alert("Login successful!");
            // Redirect or further logic here
        } else {
            alert("Invalid email or password.");
        }
    });
}