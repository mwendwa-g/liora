const token = localStorage.getItem("authToken");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

if (cart.length === 0) {
    console.error("Cart is empty. Not sending request.");
} else {
    fetch("/api/f1/products/cart/items", { 
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ cart })
    })
    .then(res => res.json())
    .then(products => {
        renderCart(products);  //Call function to display cart items
    })
    .catch(err => console.error(err));
}

function getcartProducts() {
    if (cart.length === 0) {
        console.error("Cart is empty. Not sending request.");
    } else {
        fetch("/api/f1/products/cart/items", { 
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ cart })
        })
        .then(res => res.json())
        .then(products => {
            console.log("Products",products)
            renderCart(products);  
        })
        .catch(err => console.error(err));
    }
}

const listProductHtml = document.getElementById("list-cart-html");
function renderCart(products) {
    listProductHtml.innerHTML = ""
    products.forEach(item => {
    const cartItem = cart.find(cartItem => cartItem.product_id === item._id);
    const quantity = cartItem ? cartItem.quantity : 1;
        listProductHtml.innerHTML += `
        <div class="item" data-id="${item._id}" data-price="${item.currentprice}">
            <div class="image">
                <img src="${item.image}" alt="">
            </div>
            <div class="name" style="text-transform: capitalize;">${item.description}</div>
            <div class="totalPrice price-value">${item.currentprice * quantity}</div>
            <div class="quantity">
                <span class="minus">-</span>
                <span class="quantity-value">${quantity}</span>
                <span class="plus">+</span>
            </div>
        </div>
        `;
    })
    addCartEventListeners();
}

function addCartEventListeners() {
    document.querySelectorAll(".item").forEach(item => {
        const productId = item.getAttribute("data-id");
        const pricePerUnit = parseFloat(item.getAttribute("data-price")); 
        const quantityElement = item.querySelector(".quantity-value");
        const priceElement = item.querySelector(".price-value");
        const minusButton = item.querySelector(".minus");
        const plusButton = item.querySelector(".plus");

        const cartItem = cart.find(cartItem => cartItem.product_id === productId);
        let quantity = cartItem ? cartItem.quantity : 1;

        minusButton.addEventListener("click", () => {
            if (quantity > 1) {
                quantity--;
                quantityElement.textContent = quantity;
                priceElement.textContent = (pricePerUnit * quantity).toFixed(0);
                updateCartQuantity(productId, quantity);
            }else {
                removeCartItem(productId);
                item.remove(); 
                updateCartLength();
            }
        });

        plusButton.addEventListener("click", () => {
            quantity++;
            quantityElement.textContent = quantity;
            priceElement.textContent = (pricePerUnit * quantity).toFixed(0);
            updateCartQuantity(productId, quantity);
        });
    });
}

// Function to update cart quantity in localStorage
function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.product_id === productId);
    if (item) {
        item.quantity = parseInt(quantity, 10); 
        localStorage.setItem("cart", JSON.stringify(cart));
    } else {
        console.warn(`Product not found in cart.`);
    }
}

function removeCartItem(productId) {
    // Filter out the product
    cart = cart.filter(item => item.product_id !== productId);

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartLength();
}

function updateCartLength() {
    const cartlength = document.getElementById("cartlength");
    cartlength.textContent = cart.length;
}

console.log(cart)

const checkout = document.getElementById("place-order");
checkout.addEventListener("click", handleCheckout);
async function handleCheckout () {
    if (!token) {
        alert('You must be logged in to checkout.');
        return;
    }
    const userId = getUserIdFromToken(token); 
    if (!userId) {
        alert('Invalid session. Please log in again.');
        return;
    }
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const productDetails = await Promise.all(cartItems.map(async (item) => {
        const response = await fetch(`/api/f1/products/${item.product_id}`);
        const product = await response.json();
        return {
            ...item,
            price: product.currentprice // Assuming API returns `currentprice`
        };
    }));

    // Calculate total price
    const totalPrice = productDetails.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Show confirmation alert
    const confirmOrder = window.confirm(`Your total is ksh ${totalPrice.toFixed(2)}. Do you want to proceed?`);
    if (!confirmOrder) return;

    // Format cart data for API
    const orderData = {
        user: userId,
        orderItems: cartItems.map(item => ({
            product: item.product_id, 
            quantity: item.quantity
        }))
    };

    try {
        const response = await fetch('/api/f1/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(orderData)
        });

        if (!response.ok) throw new Error('Failed to place order');

        const order = await response.json();
        console.log('Order placed:', order);
        alert('Your order is placed!');
        localStorage.removeItem('cart');
        window.location.reload();
    } catch (error) {
        console.error(error);
        alert('Order failed!');
    }
};

const getUserIdFromToken = (token) => {
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1])); 
        return payload.userId; 
    } catch (error) {
        console.error('Invalid token:', error);
        return null;
    }
};
