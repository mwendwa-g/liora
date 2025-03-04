//GETTING ALL PRODUCTS
const token = localStorage.getItem("authToken")
async function fetchProducts() {
    const res = await fetch('/api/f1/products', {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    });
    const data = await res.json();
    allproducts = data;
    productlistsearching(allproducts) 
    renderProducts(data);
    attacheventlisteners()
}
fetchProducts();
function renderProducts(products) {
    const productlisttable = document.getElementById("product-list-table");
    productlisttable.innerHTML = "";
    if(products.length === 0) {
        productlisttable.innerHTML = "No product with this name found";
    }
    products.forEach(product => {
        const prodrow  = document.createElement('tr');
        prodrow.innerHTML = `
        <td>
                <div class="form-check ms-1">
                    <input type="checkbox" class="form-check-input" id="customCheck2">
                    <label class="form-check-label" for="customCheck2">&nbsp;</label>
                </div>
        </td>
        <td>
                <div class="d-flex align-items-center gap-2">
                    <div class="rounded bg-light avatar-md d-flex align-items-center justify-content-center">
                        <img src="${product.image}" alt="${product.description}" class="img-fluid" />
                    </div>
                    <div>
                        <a href="#!" class="text-dark fw-medium fs-15" style="text-transform: capitalize;">${product.description}</a>
                        <p class="text-muted mb-0 mt-1 fs-13"><span>Size : </span>${product.weight}</p>
                    </div>
                </div>

        </td>
        <td>${product.currentprice}</td>
        <td>
                <p class="mb-1 text-muted"><span class="text-dark fw-medium">${product.countInStock} Items</span> Left</p>
        </td>
        <td style="text-transform: capitalize;">${product.brand}</td>
        <td> <span class="badge p-1 bg-light text-dark fs-12 me-1"><i class="bx bxs-star align-text-top fs-14 text-warning me-1"></i>${product.rating}</span>${product.numReviews} Reviews</td>
        <td>
                <div class="d-flex gap-2">
                    <a href="product-edit.html" class="btn btn-light btn-sm"><iconify-icon icon="solar:eye-broken" class="align-middle fs-18" data-id="${product._id}" id="copy-product-id"></iconify-icon></a>
                    <a href="#!" class="btn btn-soft-primary btn-sm product-list-price" data-id="${product._id}" curprice="${product.currentprice}"><iconify-icon icon="solar:pen-2-broken" class="align-middle fs-18"></iconify-icon></a>
                    <a href="#!" class="btn btn-soft-danger btn-sm product-list-delete" data-id="${product._id}"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" class="align-middle fs-18"></iconify-icon></a>
                </div>
        </td>
        `;
        productlisttable.appendChild(prodrow);
    })
}

function productlistsearching(allproducts){
    document.getElementById('product-list-search').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const products = allproducts.filter(product => 
        product.description.toLowerCase().includes(searchQuery)
    );
    renderProducts(products);
    console.log(allproducts)
    });
}

//DELETING A PRODUCT
function attacheventlisteners(){
    const productdeletes = document.querySelectorAll('.product-list-delete');
    productdeletes.forEach(button => {
        button.addEventListener('click', async function () {
            const productId = this.getAttribute('data-id');
            if (!confirm("Are you sure you want to delete this product?")) return;
            try {
                const res = await fetch(`/api/f1/products/${productId}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    //alert("Product deleted successfully!");
                    fetchProducts(); 
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product.");
            }
        });
    });

    const pricechanges = document.querySelectorAll('.product-list-price');
    pricechanges.forEach(button=>{
        button.addEventListener('click',async function (){
            const currentPrice = this.getAttribute('curprice')
            const productId = this.getAttribute('data-id')
            const newPrice = prompt("Enter the new price:", currentPrice);
            if (!newPrice || isNaN(newPrice)) {
                alert("Invalid entry. Please enter a valid number.");
                return;
            }
            try {
                const res = await fetch(`/api/f1/products/${productId}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ currentprice: newPrice })
                });
    
                const data = await res.json();
    
                if (res.ok) {
                    //alert("Price updated successfully!");
                    fetchProducts();
                } else {
                    alert(`Error: ${data.message}`);
                }
            } catch (error) {
                console.error("Error updating price:", error);
                alert("An error occurred while updating the price.");
            }
        })
    })
}

//
document.addEventListener("click", function (event) {
    // Check if the clicked element is the icon
    if (event.target.matches("iconify-icon")) {
        const productId = event.target.getAttribute("data-id"); // Get the ID from data-id attribute
        
        if (productId) {
            // Copy the product ID to clipboard
            navigator.clipboard.writeText(productId)
                .then(() => {
                    alert("Product Identified");
                })
                .catch(err => {
                    console.error("Failed to copy Product ID: ", err);
                });
        }
    }
});
