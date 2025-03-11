document.querySelector('.submit').addEventListener('click', function () {
    var email = document.getElementById('mail').value;
    var password = document.getElementById('pass').value;

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/login", true);
  xhr.setRequestHeader("Content-Type", "application/json");

  var data = JSON.stringify({
    email: email,
    password: password
  });

  xhr.send(data);

  window.onload(function() {
      window.location.href = "https://www.google.com";
    });

  // Reset the form fields
  document.getElementById("mail").value = "";
  document.getElementById("pass").value = "";

});