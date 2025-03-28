document.addEventListener("DOMContentLoaded", () => {
    // Select DOM elements
    const categorySelect = document.getElementById('categorySelect');
    const nameInput = document.getElementById('nameInput');
    const resetButton = document.getElementById('resetGame');
    const responseMessage = document.getElementById('responseMessage');
    const countdownDisplay = document.getElementById('countdownDisplay'); // Get countdown element from HTML

    let selectedCategory = 'MRT Station'; // Default category
    let usedNames = new Set();  // To track used names
    let timer;  // Timer reference
    let countdown = 20; // 20 seconds countdown

    // Set default category
    categorySelect.value = selectedCategory;

    // Handle category change
    categorySelect.addEventListener('change', () => {
        selectedCategory = categorySelect.value;
        responseMessage.textContent = '';
        usedNames.clear();
        resetGame(); // Reset the game when category changes
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
        debounceTimeout = setTimeout(handleDebouncedSubmit, 500); // Set a new timeout for 0.5 seconds
    });

    // Handle game reset
    resetButton.addEventListener('click', resetGame);

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
            resetCountdown(); // Reset the countdown after a valid name
        }
        nameInput.value = ''; // Clear the input field
    }

    // Function to check if a name is valid
    function isValidName(name, category) {
        if (!name || !category) return false;
        const validNames = category === 'MRT Station' ? mrtStations : category === 'Mall' ? mallNames : new Set();
        return validNames.has(name);
    }

    // Start the countdown and update the display
    function startCountdown() {
        countdown = 20; // Reset countdown to 20 seconds
        countdownDisplay.textContent = `Time remaining: ${countdown}s`;
        timer = setInterval(() => {
            countdown--;
            countdownDisplay.textContent = `Time remaining: ${countdown}s`;
            if (countdown <= 0) {
                clearInterval(timer);
                responseMessage.textContent = 'Game Over! Time is up!';
                responseMessage.style.color = "red";
                nameInput.disabled = true; // Disable input after time is up
            }
        }, 1000);
    }

    // Reset the countdown (called after a valid name input)
    function resetCountdown() {
        clearInterval(timer); // Stop the previous countdown
        startCountdown(); // Start a new countdown
    }

    // Reset the game
    function resetGame() {
        usedNames.clear();
        responseMessage.textContent = 'Game reset. You can start fresh!';
        responseMessage.style.color = "black";
        nameInput.value = ''; // Clear the input field
        nameInput.disabled = false; // Enable input
        clearInterval(timer); // Stop the previous timer
        countdownDisplay.textContent = 'Time remaining: 20s'; // Reset countdown display
        startCountdown(); // Start the new countdown
    }

    // Start the countdown when the page is loaded
    startCountdown();
});
