document.getElementById("loginForm").addEventListener("submit", function(event) {
  event.preventDefault(); // Prevent form submission

  // Retrieve form values
  var username = document.getElementById("mail").value;
  var password = document.getElementById("pass").value;

  // Create an HTTP request
  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  // Define the data to be sent to the server
  var data = JSON.stringify({
    username: username,
    password: password
  });

  // Send the data to the server
  xhr.send(data);

  // Reset the form fields
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
});
