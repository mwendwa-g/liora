const token = localStorage.getItem("authToken");
//GETTING THEM PRODS
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

const productlistcontainer = document.getElementById("products-grid-products");
function renderProducts(products) {
    productlistcontainer.innerHTML = "";
    if(products.length === 0) {
        productlistcontainer.innerHTML = "No product found";
    }
    products.forEach(product => {
        const proddiv  = document.createElement('div');
        proddiv.className = "col-md-6";
        proddiv.classList.add("col-xl-3");
        proddiv.innerHTML = `
        <div class="card">
                <img src="${product.image}" alt="${product.description}" class="img-fluid ">
                <div class="card-body bg-light-subtle rounded-bottom">
                    <a href="product-details.html" class="text-dark fw-medium fs-16">${product.description}</a>
                    <div class="my-1">
                        <div class="d-flex gap-2 align-items-center">
                            
                            <p class="mb-0 fw-medium fs-15 text-dark">${product.rating}<span class="text-muted fs-13">(${product.numReviews} Reviews)</span></p>
                        </div>
                    </div>
                    <h4 class="fw-semibold text-dark mt-2 d-flex align-items-center gap-2">
                        <span class="text-muted text-decoration-line-through">ksh${product.originalprice}</span> ksh${product.currentprice} <small class="text-muted"> (${(((product.originalprice-product.currentprice)/product.originalprice)*100).toFixed(0)}%)</small>
                    </h4>
                    <div class="mt-3">
                        <div class="d-flex gap-2">
                            <div class="dropdown">
                                    <a href="#" class="btn btn-soft-primary border border-primary-subtle" data-bs-toggle="dropdown" aria-expanded="false"><i class='bx bx-dots-horizontal-rounded'></i></a>
                                    <div class="dropdown-menu">
                                        <!-- item-->
                                        <a href="#!" class="dropdown-item product-grid-price" data-id="${product._id}" data-price="${product.originalprice}">Price</a>
                                        <!-- item-->
                                        <a href="#!" class="dropdown-item">Overview</a>
                                        <!-- item-->
                                        <a href="#!" class="dropdown-item product-grid-delete" data-id="${product._id}" data-name="${product.description}">Delete</a>
                                    </div>
                            </div>
                            <a href="javascript:void(0);" class="btn btn-outline-dark border border-secondary-subtle d-flex align-items-center justify-content-center gap-1 w-100 addCart" data-id="${product._id}"><i class='bx bx-cart align-middle'></i>Shop</a>
                        </div>
                    </div>
                </div>
                <span class="position-absolute top-0 end-0 p-3">
                    <button type="button" class="btn btn-soft-danger avatar-sm d-inline-flex align-items-center justify-content-center fs-20 rounded-circle"><iconify-icon icon="solar:heart-broken"></iconify-icon></button>
                </span>
        </div>
        `;
        productlistcontainer.appendChild(proddiv);
    })
}

function productlistsearching(allproducts){
    document.getElementById('product-grid-search').addEventListener('input', function () {
    const searchQuery = this.value.toLowerCase();
    const products = allproducts.filter(product => 
        product.description.toLowerCase().includes(searchQuery)
    );
    renderProducts(products);
    console.log(allproducts)
    });
}

//ACTIONS
function attacheventlisteners() {
    const productdeletes = document.querySelectorAll('.product-grid-delete');
    productdeletes.forEach(button=>{
        button.addEventListener('click', async function(){
            const id = this.getAttribute('data-id');
            const name = this.getAttribute('data-name');
            if (!confirm(`Are you sure you want to delete ${name}`)) return;
            try {
                const res = await fetch(`/api/f1/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    alert("Product deleted");
                    fetchProducts(); 
                } else {
                    //alert(`Error: ${data.message}`);
                }
            } catch (error) {
                //console.error("Error deleting product:", error);
                alert("An error occurred");
            }
        })
    });

    const pricechanges = document.querySelectorAll('.product-grid-price');
    pricechanges.forEach(button=>{
        button.addEventListener('click', async function (){
            const origiprice = this.getAttribute('data-price')
            const id = this.getAttribute('data-id');
            const newPrice = prompt("Enter the price:", origiprice);
            if (!newPrice || isNaN(newPrice)) {
                alert("Invalid entry. Please enter a valid number.");
                return;
            }
            try {
                const res = await fetch(`/api/f1/products/${id}`, {
                    method: 'PUT',
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}` 
                    },
                    body: JSON.stringify({ originalprice: newPrice })
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



