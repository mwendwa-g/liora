const token = localStorage.getItem("authToken");
//GETTING TOTAL NUMBER OF PRODUCTS
const allproductscount = document.getElementById("all-products-lark-dash");
fetch('/api/f1/products/get/count',{
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    allproductscount.textContent = data.productCount
})
.catch(err => console.error("Error fetching categories: ", err))

//GETTING TOTAL SALES
const totasales = document.getElementById('lark-total-sales');
fetch('/api/f1/orders/get/totalsales', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    totasales.textContent = `${data.totalSales}`;
})
.catch(err => console.error("Error fetching categories: ", err))

//GETTING NUMBER OF ALL THE CUSTOMERS
const totalclients = document.getElementById('shop-customers-all');
fetch('/api/f1/users/get/count', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    totalclients.textContent = data.userCount;
    console.log(data)
})
.catch(err => console.error("Error fetching Users: ", err))

//GETTING THE TOTAL ORDERS MADE
const totalorders = document.getElementById('lark-total-orders');
fetch('/api/f1/orders/get/count', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    totalorders.textContent = data.orderCount;
    document.getElementById("of-all-orders").textContent = data.orderCount;
})
.catch(err => console.error("Error fetching Orders: ", err))

//DISPLAYING FIVE ORDERS ONLY ON THE DASHBOARD
fetch('/api/f1/orders/five', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    orders = data
    const fiveorders = document.getElementById('lark-five-orders')
    fiveorders.innerHTML = "";
    orders.forEach(order=>{
        const ordertr = document.createElement('tr')
        ordertr.innerHTML = `
        <td class="ps-3">
            <a href="order-detail.html">${order.id}</a>
        </td>
        <td>${new Date(order.dateOrdered).toLocaleDateString()} <br>
        ${new Date(order.dateOrdered).toLocaleTimeString()}</td>
        <td>
            ${order.orderItems.length}
        </td>
        <td>
            <a href="#!">${order.user.name}</a>
        </td>
        <td>${order.user.email}</td>
        <td>${order.user.phone}</td>
        <td>${order.user.apartment}</td>
        <td>${order.user.city}</td>
        <td>
            <i class="bx bxs-circle text-success me-1"></i>${order.status}
        </td>
        `;
        fiveorders.appendChild(ordertr)
    })
})
.catch(err => console.error("Error fetching Orders: ", err))
