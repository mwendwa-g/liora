const token = localStorage.getItem("authToken");

document.getElementById("product-edit-gallery").addEventListener("click", function () {
    const productId = document.getElementById("product-edit-id").value.trim();
    if (!productId) {
        alert("Product ID is missing!");
        return;
    }
    const fileInput = document.getElementById("product-edit-images");
    const files = fileInput.files; 
    const formData = new FormData();
    if (files.length === 0) {
        alert("No images selected!");
        return;
    }
    for (let i = 0; i < files.length; i++) {
        formData.append("images", files[i]);
    }
    fetch(`/api/f1/products/gallery-images/${productId}`, {
        method: "PUT",
        headers: {
            'Authorization': `Bearer ${token}`, 
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Images uploaded successfully!", data);
        alert("Images uploaded successfully!");
        fileInput.value = "";
    })
    .catch(error => {
        console.error("Error uploading images:", error);
        alert("Error uploading images. Check console for details.");
    });
});
