// request for password from server.js and check with user input
function login() {
  event.preventDefault();
  var form = document.getElementById("loginForm");
  if (form.reportValidity() == false) {
    return false;
  }
  var request = new XMLHttpRequest();
  request.open("get", "/login", true);
  request.onload = function () {
    result = JSON.parse(request.responseText);
    check(result.password);
  };
  request.send();
}
function check(password) {
  var userInput = document.getElementById("password").value;

  if (userInput === password) {
    alert("Login Successfully. Click OK to be redirected to Homepage.");
    location.href = "e_commerce.html";
  } else {
    alert("Login Failure. Please enter the correct password.");
    location.reload();
  }
}
