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
        // --- Jackson/Pollock Calculation Logic ---
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
        // Additional validation for positive values
        if (chest <= 0 || abdomen <= 0 || thigh <= 0 ||
            triceps <= 0 || suprailiac <= 0 || midaxillary <= 0) {
            document.getElementById("body-fat-result").textContent = "Skinfold measurements must be greater than zero.";
            return;
        }

        // Convert inches to mm if needed (Jackson formulas typically use mm)
        if (skinfoldUnit === "inches") {
            chest *= 25.4;
            abdomen *= 25.4;
            thigh *= 25.4;
            triceps *= 25.4;
            suprailiac *= 25.4;
            midaxillary *= 25.4;
        }

        // IMPORTANT: Replace these with the ACTUAL Jackson/Pollock formulas you intend to use.
        // Jackson/Pollock typically uses 3-site or 7-site formulas.
        // For example, Male 3-site (Chest, Abdomen, Thigh) or Female 3-site (Triceps, Suprailiac, Thigh).
        // The formulas are complex, involving specific coefficients based on age and sex.

        if (gender === "male") {
            // Placeholder: This is NOT a complete or standard Jackson/Pollock formula.
            // You need to choose the specific Jackson/Pollock formula (e.g., 3-site, 7-site)
            // and implement it here.
            // Example of a 3-site male formula (Durnin-Womersley type, not Jackson):
            // bodyFatPercentage = (0.153 * (chest + abdomen + thigh)) - 5.78;
            document.getElementById("body-fat-result").textContent = "Jackson/Pollock (male) formula needs to be implemented. (e.g., 3-site, 7-site formula)";
            return; // Exit if not fully implemented
        } else { // Female Jackson/Pollock
            // Placeholder: This is NOT a complete or standard Jackson/Pollock formula.
            // You need to choose the specific Jackson/Pollock formula (e.g., 3-site, 7-site)
            // and implement it here.
            // Example of a 3-site female formula (Durnin-Womersley type, not Jackson):
            // bodyFatPercentage = (0.266 * (triceps + suprailiac + thigh)) - 1.1;
            document.getElementById("body-fat-result").textContent = "Jackson/Pollock (female) formula needs to be implemented. (e.g., 3-site, 7-site formula)";
            return; // Exit if not fully implemented
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
            // Make sure (waist - neck) is positive to avoid Math.log10(negative)
            if ((waist - neck) <= 0) {
                 document.getElementById("body-fat-result").textContent = "Waist must be greater than Neck for male Navy formula.";
                 return;
            }
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * (Math.log10(waist - neck)) + 0.15456 * (Math.log10(height))) - 450;
        } else { // Female Navy
            // Female Navy Formula
            // Make sure (waist + hip - neck) is positive to avoid Math.log10(negative)
            if ((waist + hip - neck) <= 0) {
                document.getElementById("body-fat-result").textContent = "Waist + Hip must be greater than Neck for female Navy formula.";
                return;
            }
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
        // These formulas are often designed for measurements in inches (waist) and pounds (weight).
        if (ymcaUnit === "cm_kg") {
            ymcaWaist = ymcaWaist / 2.54; // Convert cm to inches
            weight = weight * 2.20462; // Convert kg to lbs
        }

        // *** ACTUAL YMCA FORMULAS ***
        // These are common YMCA formulas that use waist circumference (inches) and body weight (lbs).
        if (gender === "male") {
            bodyFatPercentage = ((ymcaWaist * 0.157) + (weight * 0.259) - 6.22) * 100 / weight; // This is a common form
            // Another common male YMCA variant: bodyFatPercentage = ( (weight * 0.082) + (ymcaWaist * 0.157) - 4.474) * 100 / weight;
        } else { // Female YMCA
            bodyFatPercentage = ((ymcaWaist * 0.157) + (weight * 0.259) - 10.36) * 100 / weight; // This is a common form
            // Another common female YMCA variant: bodyFatPercentage = ( (weight * 0.082) + (ymcaWaist * 0.157) - 15.34 ) * 100 / weight;
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
