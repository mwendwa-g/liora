const token = localStorage.getItem("authToken");

const createCategory = document.getElementById('create-category')
createCategory.addEventListener("click", async function (e){
    e.preventDefault();
    const name = document.getElementById("category-name").value;
    if (!name) {
        alert("Please fill in the name field");
        return;
    }
    const categoryData = { name};
    try {
        const response = await fetch("/api/f1/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` 
            },
            body: JSON.stringify(categoryData),
        });

        const result = await response.json();

        if (response.ok) {
            alert("Created Successfully")
            document.getElementById("category-name").value = "";
            document.getElementById("category-icon").value = "";
            window.location.reload();
        } else {
            alert("Error: " + result.message);
        }
    } catch (error) {
        console.error("Error submitting form:", error);
    }
});

