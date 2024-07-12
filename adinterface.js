let journeyData = [];
let distances = [];
let fees = [];
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
    function fetchUserData() {
    const userCsvPath = 'https://raw.githubusercontent.com/MuhammedAnees-loony/test/main/login.csv';  // GitHub URL for user data

    fetch(userCsvPath)
        .then(response => response.text())
        .then(data => {
            console.log('haii');
            users = parseCSV(data);
            console.log('User data fetched:', users);  // Log the fetched user data for debugging
        })
        .catch(error => console.error('Error fetching user data:', error));
}
// Function to parse CSV text into JSON
function parseCSV(data) {
    const lines = data.split('\n').filter(line => line.trim() !== '');
    const headers = lines[0].split(',');
    const result = [];

    for (let i = 1; i < lines.length; i++) {
        const obj = {};
        const currentLine = lines[i].split(',');

        for (let j = 0; j < headers.length; j++) {
            obj[headers[j].trim()] = currentLine[j].trim();
        }
        result.push(obj);
    }
    return result;
}
    
    // Populate both user tables
    function populateUserTables() {
        fetchUserData().then(users => {
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

            // Append the homeUserTableBody to the home table
            const homeUserTable = document.querySelector('#homeUserTable tbody');
            homeUserTable.innerHTML = ''; // Clear existing rows
            homeUserTable.appendChild(homeUserTableBody);
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
            // Loop through the JSON object and extract values
            jsonObject.forEach(item => {
                distances.push(item.distance);
                fees.push(item.fee);
            });
            displayJourneyData();
            // Now you have two arrays: distances and fees
            console.log("Distances:", distances);
            console.log("Fees:", fees);
        })
        .catch(error => {
            console.error('Error making POST request to Flask API:', error);
        });
    }

    // Handle search form submission
    adminSearchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const vehicleId = searchVehicleId.value;
        fetchJourneyData(vehicleId); // Fetch journey data for the entered vehicle ID
    });

    // Function to display journey data
    function displayJourneyData() {
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

    // Tab navigation functionality
    homeTab.addEventListener('click', function() {
        adminLogin.style.display = 'none';
        adminInterface.style.display = 'block';
        journeyDetails.style.display = 'block';
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
