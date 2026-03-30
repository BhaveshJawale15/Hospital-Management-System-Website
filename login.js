// login.js

let selectedRole = 'patient'; // Default

function selectRole(role) {
    selectedRole = role;
    
    // Update Tab UI
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => tab.classList.remove('active'));
    const activeTab = document.getElementById(`tab-${role}`);
    if (activeTab) activeTab.classList.add('active');

    // Update Labels
    const emailLabel = document.querySelector('label[for="email"]');
    const emailInput = document.getElementById('email');

    if (emailLabel && emailInput) {
        if (role === 'patient') {
            emailLabel.innerText = "Email Address";
            emailInput.placeholder = "you@example.com";
        } else if (role === 'doctor') {
            emailLabel.innerText = "Doctor ID";
            emailInput.placeholder = "Enter your Doctor ID";
        } else if (role === 'admin') {
            emailLabel.innerText = "Admin ID";
            emailInput.placeholder = "Enter Admin Credentials";
        }
    }

    // Toggle "Create Account" - Only for Patients
    const registerLink = document.getElementById('register-link');
    const separator = document.getElementById('link-separator');
    if (registerLink && separator) {
        const isPatient = (role === 'patient');
        registerLink.style.display = isPatient ? "inline" : "none";
        separator.style.display = isPatient ? "inline" : "none";
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const loginBtn = document.getElementById('btn-login');
            loginBtn.innerText = "Logging in...";
            loginBtn.classList.add('loading');

            // Save the name for the Dashboard to use
            const registeredName = localStorage.getItem('registeredName');
            localStorage.setItem('activeUser', registeredName || "Valued Patient");

            setTimeout(() => {
                // Redirect logic based on the role
                if (selectedRole === 'patient') {
                    window.location.href = "patient-dashboard.html";
                } else if (selectedRole === 'doctor') {
                    window.location.href = "doctor-dashboard.html";
                } else if (selectedRole === 'admin') {
                    window.location.href = "admin-dashboard.html";
                }
            }, 1200);
        });
    }
});

// register logic
document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const registerBtn = document.getElementById('btn-register');
    
    // 1. Change button state
    registerBtn.innerText = "Creating account...";
    registerBtn.classList.add('loading');

    // 2. Simulate account creation delay
    setTimeout(() => {
        // 3. Redirect back to login after registration
        window.location.href = "login.html";
    }, 2000);
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const fullName = document.getElementById('fullname').value;
    const statusMsg = document.getElementById('status-message');
    const registerBtn = document.getElementById('btn-register');
    
    // Save to the browser's temporary storage
    localStorage.setItem('tempUser', fullName);

    // 1. Show the custom message on screen
    statusMsg.classList.remove('hidden');
    registerBtn.innerText = "Processing...";
    registerBtn.classList.add('loading');

    // 2. Redirect to login after 2 seconds
    setTimeout(() => {
        window.location.href = "login.html";
    }, 2000);
});

