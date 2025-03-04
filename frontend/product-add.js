const token = localStorage.getItem("authToken");
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories()
});

function fetchCategories() {
    fetch('/api/f1/categories', {
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

document.getElementById('product-create-add').addEventListener('click',()=>{submitProduct()});

//PRODUCT CREATION 
async function submitProduct() {
    const formData = new FormData();
    formData.append("description", document.getElementById("product-name").value);
    formData.append("richDescription", document.getElementById("description").value);
    formData.append("originalprice", document.getElementById("initial-price").value);
    formData.append("currentprice", document.getElementById("current-price").value);
    formData.append("weight", document.getElementById("product-weight").value.trim());
    formData.append("countInStock", document.getElementById("product-stock").value);
    formData.append("category", document.getElementById("product-categories").value);
    formData.append("brand", document.getElementById("product-brand").value);

    const fileInput = document.getElementById("product-add-image");
    if (fileInput.files.length > 0) {
        formData.append("image", fileInput.files[0]); 
    } else {
        console.warn("No image selected!");
    }
    try {
        const response = await fetch("/api/f1/products", {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`, 
            },
            body: formData, 
        });
        const result = await response.json();
        if (response.ok) {
            alert("Product created successfully!");
            location.reload()
            console.log("Product created:", result);
        } else {
            console.error("Error:", result);
            alert(`Error: ${result.message || "Failed to create product"}`);
        }
    } catch (error) {
        console.error("Request failed:", error);
        alert("Something went wrong!");
    }
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
    selectElement.addEventListener("change", () => {
        console.log("Selected category:", selectElement.value);
    });
}
