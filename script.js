// Function to handle the formula change (can be called on load and on change)
function handleFormulaChange() {
    var formula = document.getElementById("formula").value;
    var skinfoldInputs = document.getElementById("skinfold-inputs");
    var circumferenceInputs = document.getElementById("circumference-inputs");
    var ymcaInputs = document.getElementById("ymca-inputs"); // Get the YMCA inputs div

    // Hide all input sections first to ensure only the correct one is shown
    skinfoldInputs.classList.remove("show");
    skinfoldInputs.classList.add("hide");
    circumferenceInputs.classList.remove("show");
    circumferenceInputs.classList.add("hide");
    ymcaInputs.classList.remove("show"); // Hide YMCA inputs
    ymcaInputs.classList.add("hide");    // Hide YMCA inputs


    if (formula === "jackson") {
        skinfoldInputs.classList.remove("hide");
        skinfoldInputs.classList.add("show");
    } else if (formula === "navy") { // Now only for NAVY
        circumferenceInputs.classList.remove("hide");
        circumferenceInputs.classList.add("show");
    } else if (formula === "ymca") { // Dedicated block for YMCA
        ymcaInputs.classList.remove("hide");
        ymcaInputs.classList.add("show");
    } else {
        // Fallback: If no recognized formula, hide all.
        // This block is now less likely to be hit if all formulas are handled.
    }
}

// Add event listener for changes to the formula dropdown
document.getElementById("formula").addEventListener("change", handleFormulaChange);

// Call it once when the script loads to set the initial state
// This ensures that either skinfold, circumference, or YMCA inputs are shown/hidden
// based on the default selected formula when the page first loads.
handleFormulaChange();


document.getElementById("calculate-body-fat").addEventListener("click", function() {
    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
    }

    var gender = document.getElementById("gender").value;
    var formula = document.getElementById("formula").value;
    var bodyFatPercentage;

    document.getElementById("body-fat-result").textContent = "Calculating...";

    if (formula === "jackson") {
        // --- Jackson/Pollock Calculation Logic (You need to implement this fully) ---
        var chest = parseFloat(sanitizeInput(document.getElementById("chest").value));
        var abdomen = parseFloat(sanitizeInput(document.getElementById("abdomen").value));
        var thigh = parseFloat(sanitizeInput(document.getElementById("thigh").value));
        var triceps = parseFloat(sanitizeInput(document.getElementById("triceps").value));
        var suprailiac = parseFloat(sanitizeInput(document.getElementById("suprailiac").value));
        var midaxillary = parseFloat(sanitizeInput(document.getElementById("midaxillary").value));
        var skinfoldUnit = document.getElementById("skinfold-unit").value;

        // Basic validation for Jackson
        if (isNaN(chest) || isNaN(abdomen) || isNaN(thigh) ||
            isNaN(triceps) || isNaN(suprailiac) || isNaN(midaxillary)) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for all skinfold measurements.";
            return;
        }

        // Convert inches to mm if needed for consistency with formulas
        if (skinfoldUnit === "inches") {
            chest *= 25.4;
            abdomen *= 25.4;
            thigh *= 25.4;
            triceps *= 25.4;
            suprailiac *= 25.4;
            midaxillary *= 25.4;
        }

        // Placeholder for Jackson/Pollock calculation - replace with actual formulas
        // This is a simplified example. Jackson/Pollock has different formulas
        // depending on the number of sites (3-site, 7-site) and gender.
        // You'll need to choose and implement the specific formula.
        var sumOfFolds;
        if (gender === "male") {
             // Example for Male 3-site (Chest, Abdomen, Thigh) or Male 7-site
             // This is a placeholder, ensure you use the correct formula for your chosen sites
             sumOfFolds = chest + abdomen + thigh; // Adjust for 3-site, 7-site
             // bodyFatPercentage = YOUR_MALE_JACKSON_POLLOCK_CALCULATION;
             document.getElementById("body-fat-result").textContent = "Jackson/Pollock (male) formula not fully implemented yet. Provide actual formula.";
             return;
        } else { // Female Jackson/Pollock
             // Example for Female 3-site (Triceps, Suprailiac, Thigh) or Female 7-site
             // This is a placeholder, ensure you use the correct formula for your chosen sites
             sumOfFolds = triceps + suprailiac + thigh; // Adjust for 3-site, 7-site
             // bodyFatPercentage = YOUR_FEMALE_JACKSON_POLLOCK_CALCULATION;
             document.getElementById("body-fat-result").textContent = "Jackson/Pollock (female) formula not fully implemented yet. Provide actual formula.";
             return;
        }


    } else if (formula === "navy") { // Logic for NAVY formula
        var neckInput = sanitizeInput(document.getElementById("neck").value);
        var waistInput = sanitizeInput(document.getElementById("waist").value);
        var hipInput = sanitizeInput(document.getElementById("hip").value);
        var heightInput = sanitizeInput(document.getElementById("height").value);
        var unit = document.getElementById("unit").value;

        var neck = parseFloat(neckInput);
        var waist = parseFloat(waistInput);
        var hip = parseFloat(hipInput);
        var height = parseFloat(heightInput);

        // Input Validation for NAVY
        if (isNaN(neck) || isNaN(waist) || isNaN(height) || (gender === "female" && isNaN(hip))) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Neck, Waist, Height (and Hip for females) for Navy formula.";
            return;
        }
        if (neck <= 0 || waist <= 0 || height <= 0 || (gender === "female" && hip <= 0)) {
            document.getElementById("body-fat-result").textContent = "Measurements must be greater than zero for Navy formula.";
            return;
        }

        // Unit Conversion for NAVY (to inches for formulas)
        if (unit === "cm") {
            neck = neck / 2.54;
            waist = waist / 2.54;
            if (gender === "female") {
                hip = hip / 2.54;
            }
            height = height / 2.54;
        }

        if (gender === "male") {
            // Male Navy Formula
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * (Math.log10(waist - neck)) + 0.15456 * (Math.log10(height))) - 450;
        } else { // Female Navy
            // Female Navy Formula
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * (Math.log10(waist + hip - neck)) + 0.22100 * (Math.log10(height))) - 450;
        }

    } else if (formula === "ymca") { // Logic for YMCA formula
        var ymcaWaistInput = sanitizeInput(document.getElementById("ymca-waist").value);
        var weightInput = sanitizeInput(document.getElementById("weight").value);
        var ymcaUnit = document.getElementById("ymca-unit").value;

        var ymcaWaist = parseFloat(ymcaWaistInput);
        var weight = parseFloat(weightInput);

        // Input Validation for YMCA
        if (isNaN(ymcaWaist) || isNaN(weight)) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Waist and Weight for YMCA formula.";
            return;
        }
        if (ymcaWaist <= 0 || weight <= 0) {
            document.getElementById("body-fat-result").textContent = "Measurements must be greater than zero for YMCA formula.";
            return;
        }

        // YMCA specific unit conversion (to lbs and inches, as is common for YMCA formulas)
        if (ymcaUnit === "cm_kg") {
            ymcaWaist = ymcaWaist / 2.54; // Convert cm to inches
            weight = weight * 2.20462; // Convert kg to lbs
        }

        // *** ACTUAL YMCA FORMULAS GO HERE ***
        // These are the commonly cited YMCA formulas.
        if (gender === "male") {
            bodyFatPercentage = ( (weight * 1.634) + (ymcaWaist * -0.098) - 13.916 ) / weight * 100; // This is one common formula
            // Another common one for males: bodyFatPercentage = ( (waist * 0.741) - (weight * 0.082) - 4.474 ) / weight * 100;
        } else { // Female YMCA
            bodyFatPercentage = ( (weight * 1.634) + (ymcaWaist * -0.177) - 24.316 ) / weight * 100; // This is one common formula
            // Another common one for females: bodyFatPercentage = ( (waist * 0.741) - (weight * 0.082) - 34.409 ) / weight * 100;
        }

    } else {
        document.getElementById("body-fat-result").textContent = "Please select a body fat calculation formula.";
        return;
    }

    // Final display of result
    if (typeof bodyFatPercentage === 'number' && !isNaN(bodyFatPercentage)) {
        // Ensure result is within a reasonable range for body fat percentage
        if (bodyFatPercentage < 0) bodyFatPercentage = 0; // Body fat cannot be negative
        if (bodyFatPercentage > 100) bodyFatPercentage = 100; // Cap at 100%

        document.getElementById("body-fat-result").textContent = "Estimated body fat percentage: " + bodyFatPercentage.toFixed(2) + "%.";
    } else {
        document.getElementById("body-fat-result").textContent = "Could not calculate body fat. Please ensure all inputs are correct and a formula is selected.";
    }
});
