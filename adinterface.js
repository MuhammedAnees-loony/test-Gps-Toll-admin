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
    async function fetchDataFromCSV() {
        const response = await fetch('https://raw.githubusercontent.com/MuhammedAnees-loony/test/main/login.csv');
        const data = await response.text();
        const rows = data.split('\n').slice(1); // Remove header row
        return rows.map(row => {
            const [userId, vehicleId] = row.split(',');
            return { userId, vehicleId };
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
            populateUserTables(); // Populate user tables
            homeTab.click(); // Activate home tab
        } else {
            alert('Invalid credentials');
        }
    });

    // Populate user tables
    function populateUserTables() {
        fetchDataFromCSV().then(users => {
            // Clear existing table bodies
            homeUserTableBody.innerHTML = '';
            userTableBody.innerHTML = '';

            users.forEach(user => {
                if (user.userId.startsWith('CC-') && user.vehicleId.startsWith('V')) {
                    // Create row for admin interface table
                    const adminRow = document.createElement('tr');
                    const adminUserIdCell = document.createElement('td');
                    const adminVehicleIdCell = document.createElement('td');

                    adminUserIdCell.textContent = user.userId;
                    adminVehicleIdCell.textContent = user.vehicleId;

                    adminRow.appendChild(adminUserIdCell);
                    adminRow.appendChild(adminVehicleIdCell);
                    userTableBody.appendChild(adminRow);

                    // Create row for home tab table
                    const homeRow = document.createElement('tr');
                    const homeUserIdCell = document.createElement('td');
                    const homeVehicleIdCell = document.createElement('td');

                    homeUserIdCell.textContent = user.userId;
                    homeVehicleIdCell.textContent = user.vehicleId;

                    homeRow.appendChild(homeUserIdCell);
                    homeRow.appendChild(homeVehicleIdCell);
                    homeUserTableBody.appendChild(homeRow);
                }
            });
        });
    }

    // Function to fetch journey data
    function fetchJourneyData(vehicleId) {
        const apiUrl = 'http://127.0.0.1:5000/predict'; // Replace with your Flask API URL

        // Prepare the request body
        const requestBody = {
            vehicle_id: vehicleId
        };

        // Send POST request to Flask API
        fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Expecting JSON response
        })
        .then(data => {
            console.log('Journey data fetched successfully:', data);
            let jsonObject = JSON.parse(data);
            let distances = [];
            let fees = [];
            // Loop through the JSON object and extract values
            jsonObject.forEach(item => {
                distances.push(item.distance);
                fees.push(item.fee);
            });

            // Now you have two arrays: distances and fees
            console.log("Distances:", distances);
            console.log("Fees:", fees);
        })
        .catch(error => {
            console.error('Error making POST request to Flask API:', error);
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
        populateUserTables(); // Populate home user table
    });

    // Switch to login/register tab on click
    loginTab.addEventListener('click', function() {
        adminLogin.style.display = 'block';
        adminInterface.style.display = 'none';
        journeyDetails.style.display = 'none';
        homeContent.style.display = 'none';
    });
    homeTab.click();
});
