document.addEventListener('DOMContentLoaded', () => {
    // Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    const animateCounters = () => {
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                const count = +counter.innerText;
                const inc = target / speed;

                if (count < target) {
                    counter.innerText = Math.ceil(count + inc);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target.toLocaleString();
                }
            };
            updateCount();
        });
    };

    // Intersection Observer for Counters
    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });
        observer.observe(statsSection);
    }

    // Mock Data for Groups
    const groups = [
        {
            name: "Green Earth Foundation",
            trees: "25,000",
            area: "120 Acres",
            location: "Amazon, Brazil",
            image: "assets/images/forest-about.jpg"
        },
        {
            name: "EcoWarriors NGO",
            trees: "18,500",
            area: "85 Acres",
            location: "Nairobi, Kenya",
            image: "assets/images/volunteers.jpg"
        },
        {
            name: "Global Releaf",
            trees: "42,000",
            area: "200 Acres",
            location: "Sumatra, Indonesia",
            image: "assets/images/hero-bg.jpg"
        }
    ];

    const groupsContainer = document.getElementById('groups-container');
    if (groupsContainer) {
        groups.forEach(group => {
            const card = `
                <div class="group-card" data-aos="fade-up">
                    <div class="group-img">
                        <img src="${group.image}" alt="${group.name}">
                    </div>
                    <div class="group-info">
                        <h3>${group.name}</h3>
                        <div class="group-meta">
                            <span><i class="fas fa-tree"></i> ${group.trees}</span>
                            <span><i class="fas fa-map-marker-alt"></i> ${group.location}</span>
                        </div>
                        <p class="mt-1">Area: ${group.area}</p>
                    </div>
                </div>
            `;
            groupsContainer.innerHTML += card;
        });
    }

    // Leaflet Map Initialization
    const mapElement = document.getElementById('map');
    if (mapElement) {
        const map = L.map('map').setView([20, 0], 2);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        const locations = [
            { lat: -3.4653, lng: -62.2159, name: "Amazon Basin", trees: "25,000" },
            { lat: -1.2921, lng: 36.8219, name: "Nairobi Forest", trees: "18,500" },
            { lat: -0.7893, lng: 113.9213, name: "Sumatra Reforestation", trees: "42,000" },
            { lat: 28.6139, lng: 77.2090, name: "Delhi Green Belt", trees: "12,000" }
        ];

        locations.forEach(loc => {
            L.marker([loc.lat, loc.lng]).addTo(map)
                .bindPopup(`<b>${loc.name}</b><br>Trees Planted: ${loc.trees}<br><a href="dashboard.html">View Analysis</a>`);
        });
    }

    // Form Submission Mockup
    const ngoForm = document.getElementById('ngo-form');
    if (ngoForm) {
        ngoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Registration submitted successfully! Our team will contact you soon.');
            ngoForm.reset();
        });
    }

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Dashboard Modal Logic
const modal = document.getElementById('plantation-modal');
const openBtn = document.getElementById('open-modal');
const closeBtn = document.querySelector('.close-modal');
const plantationForm = document.getElementById('new-plantation-form');
const tableBody = document.querySelector('.data-table tbody');

if (openBtn && modal) {
    openBtn.onclick = () => modal.style.display = 'block';
    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = 'none';
    };
}

if (plantationForm) {
    plantationForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const location = document.getElementById('p-location').value;
        const date = document.getElementById('p-date').value;
        const trees = document.getElementById('p-trees').value;
        
        // Create new row
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${location}</td>
            <td>${new Date(date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}</td>
            <td>${Number(trees).toLocaleString()}</td>
            <td><span class="badge badge-primary">Pending</span></td>
            <td><span class="badge badge-secondary">Queued</span></td>
        `;
        
        // Add to table
        if (tableBody) {
            tableBody.insertBefore(newRow, tableBody.firstChild);
        }
        
        // Update stats (mock update)
        const totalTreesEl = document.querySelector('.stat-card .value');
        if (totalTreesEl) {
            let currentTotal = parseInt(totalTreesEl.innerText.replace(/,/g, ''));
            totalTreesEl.innerText = (currentTotal + parseInt(trees)).toLocaleString();
        }
        
        // Close modal and reset form
        modal.style.display = 'none';
        plantationForm.reset();
        alert('New plantation added successfully!');
    });
}


// Dashboard Functional Enhancements
document.addEventListener('DOMContentLoaded', () => {

    const alertBox = document.getElementById('dashboard-alert');

    function showAlert(message) {
        if (!alertBox) return;

        alertBox.innerHTML = `
            <div style="background:#d4edda;color:#155724;padding:12px 18px;border-radius:10px;margin-bottom:20px;font-weight:600;">
                ${message}
            </div>
        `;

        setTimeout(() => {
            alertBox.innerHTML = '';
        }, 3000);
    }

    // Plantation table interaction
    const plantationRows = document.querySelectorAll('.data-table tbody tr');

    plantationRows.forEach(row => {
        row.style.cursor = 'pointer';

        row.addEventListener('click', () => {
            const location = row.children[0].innerText;
            const trees = row.children[2].innerText;

            showAlert(`Loaded plantation data for ${location} with ${trees} trees.`);
        });
    });

    // Upload functionality
    const uploadButton = document.querySelector('.upload-area button');

    if (uploadButton) {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.jpg,.jpeg,.png,.tif,.tiff';
        fileInput.style.display = 'none';

        document.body.appendChild(fileInput);

        uploadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                showAlert(`Satellite data uploaded: ${fileInput.files[0].name}`);
            }
        });
    }

    // Impact report cards
    const statCards = document.querySelectorAll('.stat-card');

    statCards.forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.label')?.innerText || 'Statistic';
            const value = card.querySelector('.value')?.innerText || '';

            showAlert(`${title}: ${value}`);
        });
    });

    // Geolocation support
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lon = position.coords.longitude.toFixed(4);

            console.log(`User location: ${lat}, ${lon}`);
        });
    }
});
