

window.onload = function () {
    console.log("Welcome to ShopEase!");
};


function searchProduct() {
    let input = document.querySelector(".search-box input");

    if (input && input.value.trim() !== "") {
        alert("Searching for: " + input.value);
    } else {
        alert("Please enter a product name.");
    }
}


let searchBtn = document.querySelector(".search-box button");

if (searchBtn) {
    searchBtn.addEventListener("click", searchProduct);
}


let cartButtons = document.querySelectorAll(".card button");

cartButtons.forEach(function(button) {
    button.addEventListener("click", function() {
        alert("Product added to cart!");
    });
});


let loginForm = document.querySelector(".login-box form");

if (loginForm) {

    loginForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let email = loginForm.querySelector("input[type='email']").value;
        let password = loginForm.querySelector("input[type='password']").value;

        if (email === "" || password === "") {
            alert("Please fill all fields.");
            return;
        }

        alert("Login Successful!");
        window.location.href = "index.html";

    });

}


let registerForm = document.querySelector(".register-box form");

if (registerForm) {

    registerForm.addEventListener("submit", function(event) {

        event.preventDefault();

        let name = registerForm.querySelector("input[type='text']").value;
        let email = registerForm.querySelector("input[type='email']").value;
        let password = registerForm.querySelectorAll("input[type='password']")[0].value;
        let confirm = registerForm.querySelectorAll("input[type='password']")[1].value;

        if (name === "" || email === "" || password === "" || confirm === "") {
            alert("Please fill all fields.");
            return;
        }

        if (password !== confirm) {
            alert("Passwords do not match.");
            return;
        }

        alert("Registration Successful!");
        window.location.href = "login.html";

    });

}


let dashboardButtons = document.querySelectorAll(".dashboard button");

dashboardButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        alert("Feature Coming Soon!");

    });

});