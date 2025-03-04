//CREATING AN ACCOUNT   
document.getElementById("account-create-bt").addEventListener("click", async (event) => {
    event.preventDefault(); 
    const form = document.querySelector(".account-create-data");
    const formData = {
        name: document.getElementById("name").value.trim(),
        email: document.getElementById("email").value.trim(),
        password: document.getElementById("password").value.trim(),
        phone: document.getElementById("phone").value.trim(),
        street: document.getElementById("street").value.trim(),
        apartment: document.getElementById("apartment").value.trim(),
        zip: document.getElementById("zip").value.trim(),
        city: document.getElementById("city").value.trim(),
        country: document.getElementById("country").value.trim(),
    };
    for (const key in formData) {
        if (!formData[key]) {
            alert(`Please fill in all fields. Missing: ${key}`);
            return;
        }
    }
    try {
        const response = await fetch("/api/f1/users/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Account created successfully!");
            window.location.href = "index.html";
            form.reset();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
});

//ACCOUNT LOGIN
document.getElementById("account-login-bt").addEventListener("click", async (event) => {
    event.preventDefault();
    const email = document.querySelector(".account-signin-data input[name='email']").value.trim();
    const password = document.querySelector(".account-signin-data input[name='password']").value.trim();
    if (!email || !password) {
        alert("Please fill in both email and password.");
        return;
    }
    try {
        const response = await fetch("/api/f1/users/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("authToken", result.token);
            localStorage.setItem("userEmail", result.user);
            document.querySelector(".account-signin-data input[name='email']").value = "";
            document.querySelector(".account-signin-data input[name='password']").value = "";
            window.location.href = "index.html";
            const userEmail = result.user;
            updateUserDisplay(userEmail);
        } else {
            alert("An error occurred: Try again later");
        }
    } catch (error) {
        if (confirm("Forgot Password? Click OK to reset.")) {
            resetPassword(email);
        }
    }
});

async function resetPassword(email) {
    const newPassword = prompt("Enter your new password:");

    if (!newPassword) return alert("You reset the update.");

    try {
        // Fetch user ID based on email (Assuming you have an API for that)
        const userResponse = await fetch(`/api/f1/users/email/${email}`);
        const user = await userResponse.json();
        //console.log(user)
        if (!user) throw new Error("User not found");
        const userId = user._id;
        // Send password update request
        const updateResponse = await fetch(`/api/f1/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
        });
        const updateData = await updateResponse.json(); 
        console.log("Update response:", updateData);
        if (!updateResponse.ok) throw new Error("Password reset failed");

        alert("Password reset successful! You can now log in.");
    } catch (error) {
        alert("Error: " + error.message);
    }
}

//AUTO LOGIN ON PAGE LOAD//AUTO LOGIN ON PAGE LOAD
document.addEventListener("DOMContentLoaded", () => {
    checkAndLogoutIfExpired()
    const token = localStorage.getItem("authToken");
    const userEmail = localStorage.getItem("userEmail");
    if (token && userEmail) {
        updateUserDisplay(userEmail);
    }
});

function updateUserDisplay(userEmail) {
    const firstLetter = userEmail.charAt(0).toUpperCase();
    const profileLetter = document.querySelector(".dp-profile");
    const profileName = document.getElementById("account-email-owner");

    if (profileLetter) profileLetter.textContent = firstLetter;
    if (profileName) profileName.textContent = userEmail;
    console.log(userEmail);
}

//LOGING OUT
document.getElementById("log-out-icon").addEventListener("click", () => {
    const token = localStorage.getItem("authToken")
    if(!token){
        return;
    }
    else if(token){
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
                localStorage.removeItem("authToken");
                localStorage.removeItem("userEmail");
                window.location.href = "index.html";
        }
    }
    
});

//LOGGING OUT ON TOKEN EXPIRY
function checkAndLogoutIfExpired() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    if (isTokenExpired(token)) {
        logoutUser();
    } else {
        // Get token expiration time and set a timeout for auto logout
        const decoded = parseJwt(token);
        const expTime = decoded.exp * 1000; // Convert to milliseconds
        const timeLeft = expTime - Date.now();

        setTimeout(() => {
            logoutUser();
        }, timeLeft);
    }
}
function logoutUser() {
    alert("Your session has expired. Please log in again.");
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    window.location.href = "index.html";
}


function isTokenExpired(token) {
    if (!token) return true; 
    try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        const exp = decoded.exp * 1000; // Convert to milliseconds
        return Date.now() >= exp; // Check if current time is past expiration
    } catch (e) {
        return true; // If decoding fails, treat as expired
    }
}


//GOING TO ADMIN DASHBOARD
function parseJwt(token) {
    try {
        return JSON.parse(atob(token.split(".")[1]));
    } catch (e) {
        return null;
    }
}

document.getElementById("to-admin-link").addEventListener("click", (event) => {
    event.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) {
        //alert("You must be logged in to access this page.");
        return;
    }
    const decodedToken = parseJwt(token);
    //console.log("Decoded Token:", decodedToken);

    if (decodedToken && decodedToken.isAdmin) {
        window.location.href = "lark-dash.html";
    } else {
        //alert("You do not have permission to access the admin dashboard.");
        return;
    }
});



