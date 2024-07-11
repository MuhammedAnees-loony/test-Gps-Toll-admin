document.addEventListener("DOMContentLoaded", function() {
    const homeTab = document.getElementById('homeTab');
    const loginTab = document.getElementById('loginTab');
    const homeContent = document.getElementById('homeContent');
    const homeUserTableBody = document.querySelector('#homeUserTable tbody');
    const adminLogin = document.getElementById('adminLogin');
    const adminInterface = document.getElementById('adminInterface');
    const journeyDetails = document.getElementById('journeyDetails');
    const userTableBody = document.querySelector('#userTable tbody');
    const adminSearchForm = document.getElementById('adminSearchForm');
    const searchVehicleId = document.getElementById('searchVehicleId');

    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');

    const adminCredentials = {
        username: 'admin',
        password: 'Admin@gps24'
    };

    // Function to fetch data from CSV file
    async function fetchDataFromCSV(url) {
        const response = await fetch(url);
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Remove header row
        return rows.map(row => {
            const [username, userId, vehicleId] = row.split(',');
            return { username, userId, vehicleId };
        });
    }

    // Populate home user table
    async function populateHomeUserTable() {
        const users = await fetchDataFromCSV('https://raw.githubusercontent.com/MuhammedAnees-loony/test/main/login.csv');
        users.forEach(user => {
            const row = document.createElement('tr');
            const userIdCell = document.createElement('td');
            const vehicleIdCell = document.createElement('td');

            userIdCell.textContent = user.userId;
            vehicleIdCell.textContent = user.vehicleId;

            row.appendChild(userIdCell);
            row.appendChild(vehicleIdCell);
            homeUserTableBody.appendChild(row);
        });
    }

    // Admin login form submission
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = adminUsername.value;
        const password = adminPassword.value;

        if (username === adminCredentials.username && password === adminCredentials.password) {
            adminLogin.style.display = 'none';
            adminInterface.style.display = 'block';
            populateUserTable(); // Populate admin user table
            homeTab.click(); // Activate home tab
        } else {
            alert('Invalid credentials');
        }
    });

    // Populate admin user table
    function populateUserTable() {
        fetchDataFromCSV('https://raw.githubusercontent.com/MuhammedAnees-loony/test/main/login.csv').then(users => {
            users.forEach(user => {
                const row = document.createElement('tr');
                const userIdCell = document.createElement('td');
                const vehicleIdCell = document.createElement('td');

                userIdCell.textContent = user.userId;
                vehicleIdCell.textContent = user.vehicleId;

                row.appendChild(userIdCell);
                row.appendChild(vehicleIdCell);
                userTableBody.appendChild(row);
            });
        });
    }

    // Function to display journey details
    function displayJourneyDetails(distances, fees) {
        // Check if fees and distances are arrays and not empty
        if (Array.isArray(fees) && fees.length > 0 && Array.isArray(distances) && distances.length > 0) {
            // Update the table rows with journey details
            distances.forEach((distance, index) => {
                const fee = fees[index];
                const journeyNumber = index + 1;

                // Update table cells with journey data
                const distanceCell = document.getElementById(`j${journeyNumber}-distance`);
                const feeCell = document.getElementById(`j${journeyNumber}-fees`);

                if (distanceCell && feeCell) {
                    distanceCell.textContent = `${distance.toFixed(2)} m`;
                    feeCell.textContent = `Rs${fee.toFixed(2)}`;
                }
            });

            // Log the distances and fees for debugging
            console.log("Distances:", distances);
            console.log("Fees:", fees);

            // Update the total distance and total toll
            const totalDistance = distances.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);
            const totalToll = fees.reduce((acc, curr) => acc + parseFloat(curr), 0).toFixed(2);

            document.getElementById('totalDistance').textContent = `${totalDistance} m`;
            document.getElementById('totalToll').textContent = `Rs${totalToll}`;

        } else {
            console.error('Fees or distances array is not valid or is empty.');
        }
    }

    // Show login interface by default
    adminLogin.style.display = 'block';
    adminInterface.style.display = 'none';
    journeyDetails.style.display = 'none';
    homeContent.style.display = 'none';

    // Switch to home tab on click
    homeTab.addEventListener('click', function() {
        adminLogin.style.display = 'none';
        adminInterface.style.display = 'block';
        journeyDetails.style.display = 'block';
        homeContent.style.display = 'block';
        populateHomeUserTable(); // Populate home user table
    });

    // Switch to login/register tab on click
    loginTab.addEventListener('click', function() {
        adminLogin.style.display = 'block';
        adminInterface.style.display = 'none';
        journeyDetails.style.display = 'none';
        homeContent.style.display = 'none';
    });
});
