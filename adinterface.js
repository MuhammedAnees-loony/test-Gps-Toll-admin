document.addEventListener('DOMContentLoaded', function() {
    // Dummy admin credentials for login
    const adminCredentials = {
        username: 'admin',
        password: 'Admin@gps24'
    };
    
    // Elements
    const homeTab = document.getElementById('homeTab');
    const loginTab = document.getElementById('loginTab');
    const adminLogin = document.getElementById('adminLogin');
    const adminInterface = document.getElementById('adminInterface');
    const adminSearchForm = document.getElementById('adminSearchForm');
    const searchVehicleId = document.getElementById('searchVehicleId');
    const journeyDetails = document.getElementById('journeyDetails');
    const homeContent = document.getElementById('homeContent');
    
    const adminLoginForm = document.getElementById('adminLoginForm');
    const adminUsername = document.getElementById('adminUsername');
    const adminPassword = document.getElementById('adminPassword');
    const userTableBody = document.querySelector('#userTable tbody');
    const homeUserTableBody = document.createElement('tbody');
    
    // Admin login functionality
    adminLoginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = adminUsername.value;
        const password = adminPassword.value;
    
        if (username === adminCredentials.username && password === adminCredentials.password) {
            adminLogin.style.display = 'none';
            adminInterface.style.display = 'none';
            homeContent.style.display = 'block'; // Show home tab contents
            populateUserTables(); // Populate user tables
            homeTab.click(); // Activate home tab
        } else {
            alert('Invalid credentials');
        }
    });
    
    // Fetch data from CSV
    function fetchDataFromCSV() {
        // Replace with the path to your actual CSV file
        const csvUrl = 'login.csv';
        return fetch(csvUrl)
            .then(response => response.text())
            .then(data => {
                const rows = data.split('\n').slice(1); // Skip header row
                return rows.map(row => {
                    const [userId, vehicleId] = row.split(',');
                    return { userId, vehicleId };
                });
            });
    }
    
    // Populate both user tables
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
    
    // Fetch journey data and update the journey details section
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
    
            // Populate the journey details table
            document.getElementById('journey1Distance').textContent = distances[0];
            document.getElementById('journey1Fee').textContent = fees[0];
            document.getElementById('journey1PaymentStatus').textContent = data.journey1.payment_status;
    
            document.getElementById('journey2Distance').textContent = distances[1];
            document.getElementById('journey2Fee').textContent = fees[1];
            document.getElementById('journey2PaymentStatus').textContent = data.journey2.payment_status;
    
            document.getElementById('journey3Distance').textContent = distances[2];
            document.getElementById('journey3Fee').textContent = fees[2];
            document.getElementById('journey3PaymentStatus').textContent = data.journey3.payment_status;
    
            document.getElementById('journey4Distance').textContent = distances[3];
            document.getElementById('journey4Fee').textContent = fees[3];
            document.getElementById('journey4PaymentStatus').textContent = data.journey4.payment_status;
    
            document.getElementById('journey5Distance').textContent = distances[4];
            document.getElementById('journey5Fee').textContent = fees[4];
            document.getElementById('journey5PaymentStatus').textContent = data.journey5.payment_status;
    
            // Populate the total summary
            document.getElementById('totalDistance').textContent = distances.reduce((acc, curr) => acc + curr, 0);
            document.getElementById('totalFees').textContent = fees.reduce((acc, curr) => acc + curr, 0);
    
            journeyDetails.style.display = 'block'; // Show the journey details section
        })
        .catch(error => {
            console.error('Error fetching journey data:', error);
        });
    }
    
    // Handle search form submission
    adminSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const vehicleId = searchVehicleId.value;
        fetchJourneyData(vehicleId); // Fetch journey data for the entered vehicle ID
    });
    
    // Tab navigation functionality
    homeTab.addEventListener('click', function() {
        adminLogin.style.display = 'none';
        adminInterface.style.display = 'none';
        journeyDetails.style.display = 'none';
        homeContent.style.display = 'block';
    });
    
    loginTab.addEventListener('click', function() {
        adminLogin.style.display = 'block';
        adminInterface.style.display = 'none';
        journeyDetails.style.display = 'none';
        homeContent.style.display = 'none';
    });
    
    // Initial tab activation
    loginTab.click(); // Show login tab by default
});    
