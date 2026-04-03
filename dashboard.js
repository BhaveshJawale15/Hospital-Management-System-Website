document.addEventListener('DOMContentLoaded', () => {
    // Select all navigation links and tab content sections
    const navLinks = document.querySelectorAll('.nav-link');
    const tabContents = document.querySelectorAll('.tab-content');

    // 1. UNIQUE KEY PER PORTAL
    // This creates a different "memory slot" for admin.html, doctor.html, etc.
    const pageKey = window.location.pathname.split("/").pop() + "_activeTab";

    // 2. LOAD SAVED STATE
    const savedTabId = localStorage.getItem(pageKey);

    if (savedTabId && document.getElementById(savedTabId)) {
        // Clear default 'active' classes from HTML
        navLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Apply saved active classes
        const targetLink = document.querySelector(`[data-target="${savedTabId}"]`);
        const targetContent = document.getElementById(savedTabId);
        
        if (targetLink && targetContent) {
            targetLink.classList.add('active');
            targetContent.classList.add('active');
        }
    }

    // 3. TAB CLICKING LOGIC (The only one you need)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-target');

            // Safety check: skip if the target ID doesn't exist in HTML
            if (!document.getElementById(targetId)) {
                console.error(`Target ID "${targetId}" not found in HTML!`);
                return;
            }

            // UI Update: Remove active from others, add to this one
            navLinks.forEach(l => l.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            this.classList.add('active');
            document.getElementById(targetId).classList.add('active');

            // Save the ID to LocalStorage so it persists on refresh
            localStorage.setItem(pageKey, targetId);
        });
    });

    // 4. LOGOUT LOGIC
    // Clears the memory when the user logs out
    const logoutBtn = document.querySelector('.sidebar-footer a');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem(pageKey);
        });
    }
});


const menuMap = {
    'Dashboard': 'content-dashboard',
    'Medical Records': 'content-medical-records',
    // ... rest of the mapping
};


// Function to show or hide modals
function toggleModal(modalId, show) {
    const modal = document.getElementById(modalId);
    if (show) {
        modal.style.display = 'flex';
    } else {
        modal.style.display = 'none';
    }
}

// Close modal if user clicks outside the content box
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.style.display = 'none';
    }
}