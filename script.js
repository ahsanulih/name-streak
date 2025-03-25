document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const categorySelect = document.getElementById('categorySelect');
    const nameInput = document.getElementById('nameInput');
    const resetButton = document.getElementById('resetGame');
    const responseMessage = document.getElementById('responseMessage');

    let selectedCategory = 'MRT Station'; // Default category
    let usedNames = new Set();  // To track used names

    // Set default category
    categorySelect.value = selectedCategory;

    // Handle category change
    categorySelect.addEventListener('change', () => {
        selectedCategory = categorySelect.value;
        responseMessage.textContent = '';
        usedNames.clear();
    });

    // Debounced function to handle name submission
    let debounceTimeout;
    const handleDebouncedSubmit = () => {
        const name = nameInput.value.trim().toLowerCase();
        if (name) {
            handleNameSubmit(name); // Call the same logic as submitButton click
        } else {
            responseMessage.textContent = 'Please enter a name!';
            responseMessage.style.color = "black";
        }
    };

    // Automatically submit 0.5 second after input (on typing or speech-to-text)
    nameInput.addEventListener('input', () => {
        clearTimeout(debounceTimeout); // Clear previous timeout
        debounceTimeout = setTimeout(handleDebouncedSubmit, 500); // Set a new timeout for 1 second
    });

    // Handle game reset
    resetButton.addEventListener('click', () => {
        usedNames.clear();
        responseMessage.textContent = 'Game reset. You can start fresh!';
        responseMessage.style.color = "black";
        nameInput.value = ''; // Clear the input field
    });

    // Function to handle name submission
    function handleNameSubmit(name) {
        if (!name) {
            responseMessage.textContent = 'Please enter a name!';
            responseMessage.style.color = "black";
        } else if (usedNames.has(name)) {
            responseMessage.textContent = `"${name}" has already been used. Try another one!`;
            responseMessage.style.color = "orange";
        } else if (!isValidName(name, selectedCategory)) {
            responseMessage.textContent = `"${name}" is not a valid ${selectedCategory}.`;
            responseMessage.style.color = "red";
        } else {
            usedNames.add(name);
            responseMessage.textContent = `Good job! "${name}" is a valid ${selectedCategory}.`;
            responseMessage.style.color = "green";
        }
        nameInput.value = ''; // Clear the input field
    }

    // Function to check if a name is valid
    function isValidName(name, category) {
        if (!name || !category) return false;
        const validNames = category === 'MRT Station' ? mrtStations : category === 'Mall' ? mallNames : new Set();
        return validNames.has(name);
    }
});
