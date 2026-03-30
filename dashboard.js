document.addEventListener('DOMContentLoaded', () => {
    // 1. Retrieve the logged-in user's name from localStorage
    const userName = localStorage.getItem('activeUser') || "John Doe";
    const nameDisplay = document.getElementById('dashUserName');
    const initialDisplay = document.getElementById('userInitial');

    // 2. Update the UI
    if (nameDisplay) nameDisplay.innerText = userName;
    if (initialDisplay) initialDisplay.innerText = userName.charAt(0).toUpperCase();

    // 3. Logout Functionality
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            localStorage.removeItem('activeUser'); // Clear session
        });
    }
});