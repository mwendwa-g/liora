const token = localStorage.getItem("authToken") 

let cart = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener('DOMContentLoaded', function() {
    fetchCategories();
})

//GETTING ALL CATEGORIES
function fetchCategories() {
    fetch('/api/f1/categories', {
        method: 'GET',
        headers: { 
            'Content-Type': 'application/json' 
        }
    })
    .then(res => res.json())
    .then(data => {
        //console.log("Categories",data);
        renderProducts(data);
    })
    .catch(err => console.error("Error fetching categories: ", err))
}


const mukuthi = document.getElementById("products-mukuthi")
async function renderProducts(categories){
    mukuthi.innerHTML = "";
    for (const category of categories) {
        const section = document.createElement("section");
        section.className = "content-full-width";
        section.id = `${category.id}`;
        section.innerHTML = `
        <header class="woocommerce-products-header"></header>
            <div class="woocommerce-notices-wrapper"></div>
            <div class="view-mode">
                <p name="orderby" class="orderby" aria-label="Shop order" style="text-transform: capitalize;">${category.name}</p>
            </div>
            <ul class="products columns-4" id="products-holder-${category.id}">
            </ul>
        </header>
        `;
        mukuthi.appendChild(section);

        // Fetch and render products for this category
        const products = await fetchProducts(category.id);
        displayProducts(products, category.id);
    }
}

async function fetchProducts(categoryId) {
    const res = await fetch(`/api/f1/products?categories=${categoryId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
        }
    })
    const data = await res.json();
    return data;
}

function displayProducts (products, categoryId){
    const productList = document.getElementById(`products-holder-${categoryId}`);
    productList.innerHTML = "";
    if (products.length === 0) {
        productList.innerHTML = "<li style='color: #7bdcb5;font-size: .7rem;'>No products under this category yet</li>";
        return;
    }
    products.forEach(product => {
        productList.innerHTML += `
        <li class="product" style="width: 150px;">
            <div class="woo-type21">
                <div class="column dt-sc-one-fourth">
                    <div class="product-wrapper">
                        <div class='product-thumb'>
                            <a class="image" href="" title="Black Forest Perfume 100 ml">
                                <img width="420" height="420" src="${product.image}" class="attachment-shop_catalog size-shop_catalog wp-post-image" alt="" decoding="async" fetchpriority="high" srcset=""/>
                                <img width="1000" height="1333" src="${product.images[0]}" class="secondary-image attachment-shop-catalog" alt="" decoding="async" srcset=""/>
                            </a>
                            <div class="product-buttons-wrapper">
                                <div class="wc_inline_buttons">
                                    <div class="wc_cart_btn_wrapper wc_btn_inline">
                                        <a href="" data-quantity="1" class="dt-sc-button too-small button product_type_simple add_to_cart_button ajax_add_to_cart addToCart" data-product_sku="" aria-label="${product.description}&rdquo; to your cart" rel="nofollow" data-id="${product.id}">Add to cart</a>
                                    </div>
                                    <div class="wcwl_btn_wrapper wc_btn_inline">
                                        <div class="yith-wcwl-add-to-wishlist add-to-wishlist-11175  wishlist-fragment on-first-load" data-fragment-ref="11175" data-fragment-options="{&quot;base_url&quot;:&quot;&quot;,&quot;in_default_wishlist&quot;:false,&quot;is_single&quot;:false,&quot;show_exists&quot;:false,&quot;product_id&quot;:11175,&quot;parent_product_id&quot;:11175,&quot;product_type&quot;:&quot;simple&quot;,&quot;show_view&quot;:false,&quot;browse_wishlist_text&quot;:&quot;Browse Wishlist&quot;,&quot;already_in_wishslist_text&quot;:&quot;The product is already in the wishlist!&quot;,&quot;product_added_text&quot;:&quot;Product added!&quot;,&quot;heading_icon&quot;:&quot;&quot;,&quot;available_multi_wishlist&quot;:false,&quot;disable_wishlist&quot;:false,&quot;show_count&quot;:false,&quot;ajax_loading&quot;:false,&quot;loop_position&quot;:false,&quot;item&quot;:&quot;add_to_wishlist&quot;}">
                                            <!-- ADD TO WISHLIST -->
                                            <div class="yith-wcwl-add-button">
                                                <a href="?add_to_wishlist=11175" rel="nofollow" data-product-id="11175" data-product-type="simple" data-original-product-id="11175" class="add_to_wishlist single_add_to_wishlist" data-title="Add to Wishlist">
                                                    <span>Add to Wishlist</span>
                                                </a>
                                            </div>
                                            <!-- COUNT TEXT -->
                                        </div>
                                    </div>
                                    <div class="wcqv_btn_wrapper wc_btn_inline">
                                        <a href="javascript:void(0)" class="button yith-wcqv-button" data-product_id="11184">Quick View</a>
                                    </div>
                                    <div class="wc_compare_btn_wrapper wc_btn_inline">
                                        <a href="javascript:void(0)" class="button compare yith-woocompare-button" data-product_id="11184" rel="nofollow">Compare</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class='product-details'>
                            <h5>
                                <a href="">${product.description}</a>
                            </h5>
                            <span class="product-price">
                                <span class="price">
                                    <span class="woocommerce-Price-amount amount">
                                        <bdi>
                                            <span class="woocommerce-Price-currencySymbol">Ksh</span>
                                            ${product.currentprice}
                                        </bdi>
                                    </span>
                                </span>
                            </span>
                            <div class="product-rating-wrapper">
                                <div class="star-rating" role="img" aria-label="Rated ${product.rating} out of 5">
                                    <span style="width: ${((product.rating/5)*100).toFixed(0)}%">
                                        Rated <strong class="rating">${product.rating}</strong>
                                        out of 5
                                    </span>
                                </div>
                            </div>
                            <div class="product-description">
                                <p>Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est. Mauris placerat eleifend leo.</p>
                            </div>
                        </div>
                    </div>
                    <!-- .product-wrapper -->
                </div>
                <!-- .column -->
            </div>
            <!-- .style -->
        </li>
        `;
    })
}

document.getElementById("product-search").addEventListener("input", function () {
    const searchTerm = this.value.toLowerCase();
    
    document.querySelectorAll(".product").forEach(product => {
        const productName = product.querySelector("h5 a").textContent.toLowerCase();
        
        if (!productName.includes(searchTerm)) {
            product.style.display = "none"; 
        } else {
            product.style.display = "initial"; 
        }
    });
});


mukuthi.addEventListener("click", function (event) {
    if (event.target.classList.contains('addToCart')) {
        if(!token){
            alert(" Please log in to shop.");
            event.preventDefault();
            return;
        }
        else if(token){
            const productId = event.target.getAttribute('data-id');
            event.preventDefault();
            addToCart(productId);
        }
        
    }
})

function addToCart(productId) {
    let positionthisproductincart = cart.findIndex(cart => cart.product_id === productId);
    if(cart.length <= 0){
        cart = [{
            product_id: productId,
            quantity: 1
        }]
        alert("Added to cart")
    }else if(positionthisproductincart < 0){
        cart.push({
            product_id: productId,
            quantity: 1
        })
        alert("Added to cart")
    }else{
        alert("Already in Cart")
    }
    console.log("Cart Items",cart);
    localStorage.setItem("cart", JSON.stringify(cart));
}


