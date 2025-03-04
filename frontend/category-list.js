const token = localStorage.getItem("authToken")
//DISPLAYING CATEGORIES ON THE TOP GRID
let allcategories = [];
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
        allcategories = data;
        tableCategories(data);
        //console.log(data);
    })
    .catch(err => console.error("Error fetching categories: ", err))
}
window.onload = function() {
    fetchCategories();
};

//DISPLAYING CATEGORIES WITH DETAILS IN THE CATEGORY TABLE
function tableCategories(categories){
    const tablebodydetails = document.getElementById('table-categories-details');
    tablebodydetails.innerHTML = "";
    if(categories.length === 0) {
        categorylistrow.innerHTML = "error fetching categories"
    }
    categories.forEach(category=>{
        const tablerow = document.createElement('tr');
        tablerow.innerHTML = `
            <td>
                    <div class="form-check">
                        <input type="checkbox" class="form-check-input" id="customCheck2">
                        <label class="form-check-label" for="customCheck2"></label>
                    </div>
            </td>
            <td>
                    <div class="d-flex align-items-center gap-2">
                        <div class="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                            ${category.icon}
                        </div>
                        <p class="text-dark fw-medium fs-15 mb-0">${category.icon}</p>
                    </div>

            </td>
            <td style="text-transform: capitalize;">${category.name}</td>
            <td>Admin</td>
            <td>${category._id}</td>
            <td>${category.productCount}</td>
            <td>
                    <div class="d-flex gap-2">
                        <a href="#!" class="btn btn-light btn-sm"><iconify-icon icon="solar:eye-broken" class="align-middle fs-18"></iconify-icon></a>
                        <a href="#!" class="btn btn-soft-primary btn-sm edit-name" data-id="${category._id}" data-name="${category.name}"><iconify-icon icon="solar:pen-2-broken" class="align-middle fs-18"></iconify-icon></a>
                        <a href="#!" class="btn btn-soft-danger btn-sm delete-caetegory-list-html" data-id="${category._id}" data-name="${category.name}"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" class="align-middle fs-18"></iconify-icon></a>
                    </div>
            </td>
        `;
        tablebodydetails.appendChild(tablerow);
    })
}

//DELETING A CATEGORY FROM CATEGORY LIST HTML FILE
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".delete-caetegory-list-html")) {
            const button = event.target.closest(".delete-caetegory-list-html");
            const categoryId = button.getAttribute("data-id");
            const categoryName = button.getAttribute("data-name");
            
            if (confirm(`Confirm delete of ${categoryName}?`)) {
                deleteCategory(categoryId);
            }
        }
    });

    function deleteCategory(categoryId) {
        fetch(`/api/f1/categories/${categoryId}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //alert("Category deleted successfully!");
                location.reload();
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error deleting category:", error));
    }
});

//EDITING THE NAME OF A CATEGORY
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".edit-name")) {
            const button = event.target.closest(".edit-name");
            const categoryId = button.getAttribute("data-id");
            const currentName = button.getAttribute("data-name");

            const newName = prompt("Enter new category name:", currentName);
            if (newName !== null && newName.trim() !== "" && newName !== currentName) {
                updateCategoryName(categoryId, newName);
            }
        }
    });

    function updateCategoryName(categoryId, newName) {
        fetch(`/api/f1/categories/${categoryId}`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`, 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify({ name: newName })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log("Category name updated successfully!");
                document.querySelector(`[data-id="${categoryId}"]`).setAttribute("data-name", newName);
                document.querySelector(`[data-id="${categoryId}"]`).closest("tr").querySelector("td:nth-child(2) p").textContent = newName;
                location.reload()
            } else {
                console.log("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error updating category name:", error));
    }
});
