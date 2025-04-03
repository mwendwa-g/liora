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


document.addEventListener('DOMContentLoaded', () => {
    fetchCategories()
    document.getElementById("add-size-btn").addEventListener("click", function(event) {
        event.preventDefault();
        const sizesDiv = document.getElementById("sizes-div");
        const sizeInput = document.createElement("input");
        sizeInput.type = "text";
        sizeInput.style.width = "50px";
        sizeInput.className = "form-control product-size";
        sizesDiv.appendChild(sizeInput);
    });
});

function fetchCategories() {
    fetch(`${aappii}/categories/subcategories/all`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(data => {
        fillCategories(data);
    })
    .catch(err => console.error("Error fetching categories: ", err));
}

function fillCategories(data) {
    const selectElement = document.getElementById("product-categories");
    if (!selectElement) {
        console.error("Category dropdown not found!");
        return;
    }
    selectElement.innerHTML = '';
    const placeholderOption = document.createElement("option");
    placeholderOption.value = "";
    placeholderOption.textContent = "Select a Category";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption);
    if (!Array.isArray(data) || data.length === 0) {
        console.warn("No categories available.");
        return;
    }
    data.forEach(category => {
        const option = document.createElement("option");
        option.value = category._id;
        option.textContent = category.name;
        selectElement.appendChild(option);
    });
}

//PRODUCT CREATION 
async function submitProduct() {
    const formData = new FormData();

    const image = document.getElementById("main-product-image").files[0];
    const gallery = document.getElementById("product-gallery-images").files;
    for (let i = 0; i < gallery.length; i++) {
        formData.append("gallery", gallery[i]);
    }
    const description = document.getElementById("product-description").value;
    const name = document.getElementById("product-name").value;
    const price = document.getElementById("current-price").value;
    const originalprice = document.getElementById("original-price").value;
    //const color = document.getElementById("product-color").value;
    const stock = document.getElementById("product-stock").value;
    const featured = document.getElementById("featured-status").checked ? "true" : "false";
    const category = document.getElementById("product-categories").value;
    const brand = document.getElementById("product-brand").value;
    const reviews = document.getElementById("product-reviews").value;

    const sizes = document.querySelectorAll(".product-size")
    sizes.forEach(size => {
        if (size.value) {
            formData.append("sizes[]", size.value);
        }
    });

    if(!image || !name || !price || !category ){
        alert("Please fill all required fields!");
        return;
    }

    formData.append("image", image);
    formData.append("name", name);
    formData.append("description", description);
    formData.append("originalprice", originalprice);
    formData.append("price", price);
    //formData.append("color", color);
    formData.append("stock", stock);
    formData.append("featured", featured);
    formData.append("category", category);
    if(brand){
        formData.append("brand", brand);
    }
    //formData.append("sizes", JSON.stringify(selectedsizes));
    formData.append("reviews", reviews);

    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const progressText = document.getElementById("progress-text");

    // Show the progress bar
    progressContainer.style.display = "block";
    progressBar.style.width = "10%"; // Start at 10%
    progressText.textContent = "Uploading...";

    try {
        // Simulate progress increase before fetch
        setTimeout(() => progressBar.style.width = "30%", 500);
        setTimeout(() => progressBar.style.width = "70%", 1000);

        const response = await fetch(`${aappii}/products`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
            body: formData, 
        });
        progressBar.style.width = "90%";
        const result = await response.json();
        if (response.ok) {
            progressBar.style.width = "100%"; // Complete the progress bar
            alert("Product created successfully!");
            location.reload()
        } else {
            console.error("Error:", result);
            alert(`Error: ${result.message || "Failed to create product"}`);
        }
    } catch (error) {
        console.error("Error:", result);
        alert("Original price must be greater than current price");
    }
}


document.getElementById('product-create-add').addEventListener('click',(e)=>{
    e.preventDefault();
    submitProduct()
});
