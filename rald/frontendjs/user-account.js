const aappii = "/api/lioracas";

/*const toLogin = document.getElementById("btnto-login");
const toCreate = document.getElementById("btnto-create");
const loginForm = document.getElementById("login-account");
const signupForm = document.getElementById("first-signup-form");
loginForm.style.display = "none";
toLogin.addEventListener("click", (e) => {
    e.preventDefault();
    loginForm.style.display = "initial";
    signupForm.style.display = "none";
})*/
document.getElementById("user-account-create").addEventListener("click",async(e)=>{
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
        country : document.getElementById("user-country").value.trim()
    }
    for (const key in userData) {
        if (!userData[key]) {
            alert(`Please fill in all fields. Missing: ${key}`);
            return;
        }
    }
    try {
        const response = await fetch(`${aappii}/users/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });
        const result = await response.json();
        if (response.ok) {
            alert("Account created successfully!");
            localStorage.setItem("lioralogged", true);
            location.reload();
        } else {
            alert("Error: " + result.message);
            //location.reload()
        }
    } catch (error) {
        alert("An error occurred: " + error.message);
    }
})


document.getElementById("user-account-login").addEventListener("click",async(e)=>{
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const password = document.getElementById("login-passwd").value.trim();
    if (!email || !password) {
        alert("Please fill in email and password fields.");
        return;
    }
    await logUserIn(email, password);
})
async function logUserIn(email, password) {
    try {
        const response = await fetch(`${aappii}/users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });
        const result = await response.json();
        if (response.ok) {
            localStorage.setItem("token", result.token);
            redirectUserBasedOnRole(result.token);
        } else {
            alert("Login failed: " + result.message);
        }
    } catch (error) {
        alert(error.message);
    }
}

function redirectUserBasedOnRole(token) {
    try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const userRole = decodedToken.role;
        if (userRole === "admin") {
            window.location.href = "rald/index.html";
        } else if (userRole === "delivery") {
            window.location.href = "delivery/orders-list.html";
        } else if (userRole === "customer") {
            window.location.href = "index.html";
        }
    } catch (error) {
        console.error("Invalid token", error);
        alert("Invalid login session. Please log in again.");
        localStorage.removeItem("token");
    }
}

document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem("lioralogged")) {
            document.getElementById("first-signup-form").style.display = "none";
        }
        else{
            document.getElementById("login-account").style.display = "none";
            document.getElementById("first-signup-form").style.display = "block";
        }
    }
)


document.querySelector(".account-log-out").addEventListener("click", () => {
    const token = localStorage.getItem("token")
    if(!token){
        return;
    }
    else if(token){
        const confirmLogout = confirm("Are you sure you want to log out?");
        if (confirmLogout) {
                localStorage.removeItem("token");
                location.reload();
        }
    }
});

//reset paasword
document.querySelector(".user-set-password").addEventListener("click", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value.trim();
    const newPassword = prompt("Enter your new password:");
    if (!newPassword) return alert("You reset the update.");
    if(!email) return alert("Email please!");

    try {
        const userResponse = await fetch(`${aappii}/users/email/${email}`);
        const user = await userResponse.json();
        if (!user) throw new Error("User not found");
        const userId = user._id;
        const updateResponse = await fetch(`${aappii}/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password: newPassword }),
        });
        const updateData = await updateResponse.json();
        if (!updateResponse.ok) throw new Error("Password reset failed");

        alert("Password reset successful! You can now log in.");
    } catch (error) {
        alert("Error: " + error.message);
    }
})