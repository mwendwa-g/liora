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

let allcategories = [];
function fetchCategories() {
    fetch(`${aappii}/categories`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json' 
        }
    })
    .then(res => res.json())
    .then(data => {
        allcategories = data;
        tableCategories(data);
    })
    .catch(err => console.error("Error fetching categories: ", err))
}
window.onload = function() {
    fetchCategories();
};

//show categories
function tableCategories(categories){
    const tablebodydetails = document.getElementById('table-categories-details');
    tablebodydetails.innerHTML = "";
    if(categories.length === 0) {
        categorylistrow.innerHTML = "No categories at the moment"
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
                        <div class="rounded bg-light avatar-md d-flex align-items-center justify-content-center" style="overflow: hidden;">
                            <img src="${category.image}" alt="${category.name}" style="width: 100%;">
                        </div>
                        <p class="text-dark fw-medium fs-15 mb-0" style="text-transform: capitalize;">${category.name}</p>
                    </div>

            </td>
            <td>Admin</td>
            <td>${category._id}</td>
            <td>${category.productCount}</td>
            <td>
                    <div class="d-flex gap-2">
                        <!--<a href="#!" class="btn btn-light btn-sm"><iconify-icon icon="solar:eye-broken" class="align-middle fs-18"></iconify-icon></a>-->
                        <a href="#!" class="btn btn-soft-primary btn-sm edit-name" data-id="${category._id}" data-name="${category.name}"><iconify-icon icon="solar:pen-2-broken" class="align-middle fs-18"></iconify-icon></a>
                        <a href="#!" class="btn btn-soft-danger btn-sm delete-caetegory-list-html" data-id="${category._id}" data-name="${category.name}"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" class="align-middle fs-18"></iconify-icon></a>
                    </div>
            </td>
        `;
        tablebodydetails.appendChild(tablerow);
    })
}

//delete category
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.closest(".delete-caetegory-list-html")) {
            const button = event.target.closest(".delete-caetegory-list-html");
            const categoryId = button.getAttribute("data-id");
            const categoryName = button.getAttribute("data-name");
            if (confirm(`${categoryName} will be deleted with its products. Are you sure?`)) {
                deleteCategory(categoryId);
            }
        }
    });

    function deleteCategory(categoryId) {
        fetch(`${aappii}/categories/${categoryId}`, {
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
        fetch(`${aappii}/categories/${categoryId}`, {
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
                location.reload()
            } else {
                alert("Error: " + data.message);
            }
        })
        .catch(error => console.error("Error updating category name:", error));
    }
});
