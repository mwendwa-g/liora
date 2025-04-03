const aappii = "/api/lioracas";
const token = localStorage.getItem("token");

window.onload = function() {
    checkUserRole();
}

function checkUserRole() {
    if (!token) {
        window.location.href = '../index.html';
        return;
    }

    const decodedToken = decodeJwt(token);
    const userRole = decodedToken.role;
    
    if (userRole === "admin") {
        return;
    } else {
        window.location.href = '../index.html';
    }
}

function decodeJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Failed to decode token:", e);
        return null;
    }
}

document.getElementById("user-create-add").addEventListener("click",async(e)=>{
    e.preventDefault();
    const userData = {
        name : document.getElementById("user-name").value.trim(),
        phone : document.getElementById("user-phone").value.trim(),
        email : document.getElementById("user-email").value.trim(),
        password : document.getElementById("user-password").value.trim(),
        housenumber : document.getElementById("user-house").value.trim(),
        plotnumber : document.getElementById("user-plot").value.trim(),
        street : document.getElementById("user-street").value.trim(),
        landmark : document.getElementById("user-landmark").value.trim(),
        county : document.getElementById("user-county").value.trim(),
        country : document.getElementById("user-country").value.trim(),
        role : document.getElementById("user-role").value.trim()
    }
    for (const key in userData) {
        if (!userData[key]) {
            alert(`Please fill in all fields. Missing: ${key}`);
            return;
        }
    }
    try {
        const response = await fetch(`${aappii}/users/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Account created successfully!");
            location.reload()
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
})