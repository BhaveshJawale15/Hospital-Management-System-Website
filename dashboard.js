document.addEventListener('DOMContentLoaded', () => {
    const navLinks = document.querySelectorAll('.sidebar-nav a');
    const sections = document.querySelectorAll('.tab-content');

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Check if the link has text (skipping icons or logos)
            const linkText = link.innerText.trim();
            
            // Map text to section IDs
            const menuMap = {
                'Dashboard': 'content-dashboard',
                'Medical Records': 'content-medical-records',
                'Prescriptions': 'content-prescriptions',
                'Lab Reports': 'content-lab-reports',
                'Telemedicine': 'content-telemedicine',
                'Profile Settings': 'content-profile-settings'
            };

            if (menuMap[linkText]) {
                e.preventDefault();

                // 1. Update Active Sidebar Link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');

                // 2. Switch Content Section
                sections.forEach(s => s.classList.remove('active'));
                document.getElementById(menuMap[linkText]).classList.add('active');
            }
        });
    });

    // Handle initial login data (Name and Initial)
    const user = localStorage.getItem('activeUser') || "John Doe";
    document.getElementById('dashUserName').innerText = user;
    document.getElementById('userInitial').innerText = user.charAt(0).toUpperCase();
});

const menuMap = {
    'Dashboard': 'content-dashboard',
    'Medical Records': 'content-medical-records',
    // ... rest of the mapping
};







// doctor-dashboard





// Tab Switching Logic
    const links = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.tab-content');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('data-target');

            // Remove active classes
            links.forEach(l => l.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Add active class to clicked link and target section
            link.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });