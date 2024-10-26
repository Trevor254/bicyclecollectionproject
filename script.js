const bicycleForm = document.getElementById("bicycle-form");
const bicycleList = document.getElementById("bicycle-list");

// Update the API URL to use port 3001
const API_URL = 'http://localhost:3001';

let currentEditId = null; // Store the ID of the bicycle being edited

// Load bicycles from db.json
const loadBicyclesFromDB = async () => {
    try {
        const response = await fetch(`${API_URL}/bicycles`);
        if (!response.ok) throw new Error('Network response was not ok');
        const bicycles = await response.json();
        displayBicycles(bicycles); // Call the displayBicycles function to update the UI
    } catch (error) {
        console.error('Error fetching bicycles:', error);
        bicycleList.innerHTML = '<p>No bicycles found.</p>'; // Display a message if there are no bicycles
    }
};

// Display bicycles in the HTML
const displayBicycles = (bicycles) => {
    bicycleList.innerHTML = ''; // Clear existing list

    if (bicycles.length === 0) {
        bicycleList.innerHTML = '<p>No bicycles added yet.</p>'; // Message when no bicycles are available
        return;
    }

    bicycles.forEach(bicycle => {
        const bikeItem = document.createElement('div');
        bikeItem.className = 'bicycle-item';
        bikeItem.setAttribute('data-id', bicycle.id); // Set the data-id attribute for each bike

        bikeItem.innerHTML = `
            <h3>${bicycle.brand} ${bicycle.model}</h3>
            <p>Type: ${bicycle.type}</p>
            <p>Color: ${bicycle.color}</p>
            <p>Price: $${bicycle.price}</p>
            <img src="${bicycle.image}" alt="${bicycle.brand} ${bicycle.model}" style="width: 100px; height: auto;">
            <button class="edit-btn" data-id="${bicycle.id}">Edit</button>
            <button class="delete-btn" data-id="${bicycle.id}">Delete</button>
        `;
        bicycleList.appendChild(bikeItem);
    });

    // Attach event listeners to the edit and delete buttons after rendering the list
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => editBicycle(button.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteBicycle(button.dataset.id));
    });
};

// Add a new bicycle
const addBicycle = async (bicycle) => {
    try {
        const response = await fetch(`${API_URL}/bicycles`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bicycle),
        });

        if (response.ok) {
            loadBicyclesFromDB(); // Reload bicycles after adding a new one
            bicycleForm.reset(); // Reset the form after adding
        } else {
            console.error('Failed to add bicycle:', response.statusText);
        }
    } catch (error) {
        console.error('Error adding bicycle:', error);
    }
};

// Update an existing bicycle
const updateBicycle = async (bicycle) => {
    try {
        const response = await fetch(`${API_URL}/bicycles/${currentEditId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bicycle),
        });

        if (response.ok) {
            loadBicyclesFromDB(); // Reload bicycles after updating
            currentEditId = null; // Reset edit ID
            bicycleForm.reset(); // Reset the form
            document.querySelector("button[type='submit']").innerText = "Add Bicycle"; // Change button text back
        } else {
            console.error('Failed to update bicycle:', response.statusText);
        }
    } catch (error) {
        console.error('Error updating bicycle:', error);
    }
};

// Delete a bicycle
const deleteBicycle = async (id) => {
    try {
        const response = await fetch(`${API_URL}/bicycles/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            loadBicyclesFromDB(); // Reload bicycles after deleting
        } else {
            console.error('Failed to delete bicycle:', response.statusText);
        }
    } catch (error) {
        console.error('Error deleting bicycle:', error);
    }
};

// Edit a bicycle
const editBicycle = async (id) => {
    try {
        const response = await fetch(`${API_URL}/bicycles/${id}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const bicycle = await response.json();

        document.getElementById("brand").value = bicycle.brand; // Set brand
        document.getElementById("model").value = bicycle.model; // Set model
        document.getElementById("type").value = bicycle.type; // Set type
        document.getElementById("color").value = bicycle.color; // Set color
        document.getElementById("price").value = bicycle.price; // Set price
        document.getElementById("image").value = bicycle.image; // Set image

        currentEditId = id; // Set current edit ID
        document.querySelector("button[type='submit']").innerText = "Update Bicycle"; // Change button text to "Update"
    } catch (error) {
        console.error('Error fetching bicycle to edit:', error);
    }
};

// Event listener for the bicycle form submission
bicycleForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default form submission

    const newBicycle = {
        brand: document.getElementById("brand").value,
        model: document.getElementById("model").value,
        type: document.getElementById("type").value,
        color: document.getElementById("color").value,
        price: parseFloat(document.getElementById("price").value),
        image: document.getElementById("image").value,
    };

    if (currentEditId) {
        updateBicycle(newBicycle); // Update existing bicycle
    } else {
        addBicycle(newBicycle); // Add new bicycle
    }
});

// Load bicycles when the page is loaded
window.onload = loadBicyclesFromDB;
