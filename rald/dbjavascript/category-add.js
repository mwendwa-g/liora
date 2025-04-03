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

//fill categories
document.addEventListener("DOMContentLoaded", async function () {
    const parentCategorySelect = document.getElementById("parent-category");
    try {
        const response = await fetch(`${aappii}/categories/parents`);
        const categories = await response.json();
        if (categories.length === 0) {
            parentCategorySelect.innerHTML = `<option value="">No categories found</option>`;
            return;
        }
        let optionsHTML = `<option value="">Select Parent Category</option>`;
        for (const category of categories) {
            optionsHTML += `<option value="${category._id}">${category.name}</option>`;
        }

        parentCategorySelect.innerHTML = optionsHTML; 
    } catch (error) {
        console.error("Error fetching categories:", error);
        parentCategorySelect.innerHTML = `<option value="">Error loading categories</option>`;
    }
});


const createCategory = document.getElementById('create-category')
createCategory.addEventListener("click", async function (e){
    e.preventDefault();
    const image = document.getElementById("category-image");
    const name = document.getElementById("category-name").value;
    const color = document.getElementById("category-color").value;
    const description = document.getElementById("category-description").value;
    const parentcategory = document.getElementById("parent-category").value;
    if(!name){
        alert("Please fill in all required fields");
    }
    const formData = new FormData();
    formData.append("image", image.files[0]);
    formData.append("name", name);
    formData.append("color", color);
    formData.append("description", description);
    formData.append("parentCategory", parentcategory);
    try {
        const response = await fetch(`${aappii}/categories`, {
            method: "POST",
            body: formData,
        });

        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || "Error creating category");
        }

        alert("Category created");
        window.location.reload();

    } catch (error) {
        console.error("Error:", error);
        alert(error.message);
    }
})

