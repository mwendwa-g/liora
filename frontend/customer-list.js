const token = localStorage.getItem("authToken")
//GETTING NUMBER OF ALL THE CUSTOMERS
const totalclients = document.getElementById('customer-list-all-customers');
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
})
.catch(err => console.error("Error fetching Users: ", err))
//GETTING THE TOTAL ORDERS MADE
const totalorders = document.getElementById('customer-list-orders');
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
})
.catch(err => console.error("Error fetching Orders: ", err))
//GETTING TOTAL SALES
const totasales = document.getElementById('customer-list-invoice');
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

//A LIST OF ALL CUSTOMERS
const customerlist = document.getElementById('customoer-list-holder');
fetch('/api/f1/users', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})
.then(res => res.json())
.then(data => {
    console.log(data)
    customerlist.innerHTML = ""
    data.forEach(user => {
        const customer = document.createElement('tr');
        customer.innerHTML = `
        <td>
            <div class="form-check">
                    <input type="checkbox" class="form-check-input" id="customCheck2">
                    <label class="form-check-label" for="customCheck2">&nbsp;</label>
            </div>
        </td>
        <td>${user.name}</td>
        <td><a href="javascript: void(0);" class="text-body">${user.email}</a> </td>
        <td> <span class="badge bg-success-subtle text-success py-1 px-2">${user.isAdmin ? 'Admin' : 'Customer'}</span> </td>
        <td>${user.phone}</td>
        <td>ksh ${user.totalSpent}</td>
        <td>${user.city}</td>
        <td>${user.street}</td>
        <td>
            <div class="d-flex gap-2">
                    <a href="#!" class="btn btn-light btn-sm"><iconify-icon icon="solar:eye-broken" class="align-middle fs-18"></iconify-icon></a>
                    <a href="#!" class="btn btn-soft-primary btn-sm" data-bs-toggle="modal" data-bs-target="#staticBackdrop"><iconify-icon icon="solar:pen-2-broken" class="align-middle fs-18"></iconify-icon></a>
                    <a href="#!" class="btn btn-soft-danger btn-sm"><iconify-icon icon="solar:trash-bin-minimalistic-2-broken" onclick="deleteUser('${user._id}')" class="align-middle fs-18"></iconify-icon></a>
            </div>
        </td>
        `;
        customerlist.appendChild(customer);
    })
})
.catch(err => console.error("Error fetching categories: ", err))

//DELETING A USER
async function deleteUser(userId) {
    if (!confirm("Are you sure you want to delete this user?")) {
        return; 
    }
    try {
        const response = await fetch(`/api/f1/users/${userId}`, { 
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            location.reload(); 
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        alert("Something went wrong. Please try again.");
        console.error(error);
    }
}
