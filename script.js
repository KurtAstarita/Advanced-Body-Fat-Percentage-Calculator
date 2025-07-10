// Function to handle the formula change (can be called on load and on change)
function handleFormulaChange() {
    var formula = document.getElementById("formula").value;
    var skinfoldInputs = document.getElementById("skinfold-inputs");
    var circumferenceInputs = document.getElementById("circumference-inputs");

    if (formula === "jackson") {
        skinfoldInputs.classList.add("show");
        skinfoldInputs.classList.remove("hide");
        circumferenceInputs.classList.add("hide");
        circumferenceInputs.classList.remove("show");
    } else if (formula === "navy" || formula === "ymca") {
        circumferenceInputs.classList.add("show");
        circumferenceInputs.classList.remove("hide");
        skinfoldInputs.classList.add("hide");
        skinfoldInputs.classList.remove("show");
    } else {
        // This 'else' block handles cases where no specific formula type is selected,
        // which might occur if you add other options without corresponding input types
        skinfoldInputs.classList.add("hide");
        skinfoldInputs.classList.remove("show");
        circumferenceInputs.classList.add("hide");
        circumferenceInputs.classList.remove("show");
    }
}

// Add event listener for changes to the formula dropdown
document.getElementById("formula").addEventListener("change", handleFormulaChange);

// Call it once when the script loads to set the initial state
// This ensures that either skinfold or circumference inputs are shown/hidden
// based on the default selected formula when the page first loads.
handleFormulaChange();


document.getElementById("calculate-body-fat").addEventListener("click", function() {
    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
    }

    var gender = document.getElementById("gender").value;
    var formula = document.getElementById("formula").value;
    var bodyFatPercentage; // This variable is declared here

    // Initialize result display to clear previous messages or show a default
    document.getElementById("body-fat-result").textContent = "Calculating..."; // Or clear it: ""

    if (formula === "jackson") {
        // Your existing Jackson formula calculation code
        // Make sure it calculates bodyFatPercentage and assigns it
        // Example: bodyFatPercentage = calculateJackson();
    } else if (formula === "navy" || formula === "ymca") { // COMBINE or ADD YMCA SPECIFIC LOGIC
        var neckInput = sanitizeInput(document.getElementById("neck").value);
        var waistInput = sanitizeInput(document.getElementById("waist").value);
        var hipInput = sanitizeInput(document.getElementById("hip").value);
        var heightInput = sanitizeInput(document.getElementById("height").value);
        var unit = document.getElementById("unit").value;

        var neck = parseFloat(neckInput);
        var waist = parseFloat(waistInput);
        var hip = parseFloat(hipInput);
        var height = parseFloat(heightInput);

        // Input Validation
        if (isNaN(neck) || isNaN(waist) || isNaN(height) || (gender === "female" && isNaN(hip))) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for all required measurements.";
            return; // Stop execution here if validation fails
        }
        if (neck <= 0 || waist <= 0 || height <= 0 || (gender === "female" && hip <= 0)) {
            document.getElementById("body-fat-result").textContent = "Measurements must be greater than zero.";
            return; // Stop execution here if validation fails
        }

        // Unit Conversion (Applies to both Navy and YMCA if they use the same units)
        if (unit === "cm") {
            neck = neck / 2.54;
            waist = waist / 2.54;
            if (gender === "female") {
                hip = hip / 2.54;
            }
            height = height / 2.54;
        }

        if (formula === "navy") {
            if (gender === "male") {
                bodyFatPercentage = 495 / (1.0324 - 0.19077 * (Math.log10(waist - neck)) + 0.15456 * (Math.log10(height))) - 450;
            } else { // Female Navy
                bodyFatPercentage = 495 / (1.29579 - 0.35004 * (Math.log10(waist + hip - neck)) + 0.22100 * (Math.log10(height))) - 450;
            }
        } else if (formula === "ymca") {
            // *** IMPORTANT: Add your specific YMCA calculation logic here ***
            // This is where you would calculate bodyFatPercentage for YMCA
            // Example for YMCA (replace with actual formula if different):
            if (gender === "male") {
                 // Male YMCA formula: (76.5 * waist) - 4404.5; // (This is a simplified example, use your actual YMCA formula)
                 // bodyFatPercentage = YOUR_MALE_YMCA_CALCULATION_HERE;
                 document.getElementById("body-fat-result").textContent = "YMCA formula for male is not yet implemented or selected."; // Placeholder
                 return; // Prevent further execution if not truly implemented
            } else { // Female YMCA
                 // Female YMCA formula: (76.5 * waist) + (100 * hip) - (145 * neck) - 4404.5; // (Simplified example)
                 // bodyFatPercentage = YOUR_FEMALE_YMCA_CALCULATION_HERE;
                 document.getElementById("body-fat-result").textContent = "YMCA formula for female is not yet implemented or selected."; // Placeholder
                 return; // Prevent further execution if not truly implemented
            }
        }
    } else {
        // If no formula is selected or an unknown formula is somehow chosen
        document.getElementById("body-fat-result").textContent = "Please select a body fat calculation formula.";
        return; // Exit the function to prevent undefined access
    }

    // After all calculations, check if bodyFatPercentage actually has a number
    if (typeof bodyFatPercentage === 'number' && !isNaN(bodyFatPercentage)) {
        document.getElementById("body-fat-result").textContent = "Estimated body fat percentage: " + bodyFatPercentage.toFixed(2) + "%.";
    } else {
        document.getElementById("body-fat-result").textContent = "Could not calculate body fat. Please ensure all inputs are correct and a formula is selected.";
    }
});
