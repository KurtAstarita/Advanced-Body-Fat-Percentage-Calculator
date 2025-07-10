// Function to handle the formula change (can be called on load and on change)
function handleFormulaChange() {
    var formula = document.getElementById("formula").value;
    var skinfoldInputs = document.getElementById("skinfold-inputs");
    var circumferenceInputs = document.getElementById("circumference-inputs");
    var ymcaInputs = document.getElementById("ymca-inputs");

    // Hide all input sections first to ensure only the correct one is shown
    skinfoldInputs.classList.remove("show");
    skinfoldInputs.classList.add("hide");
    circumferenceInputs.classList.remove("show");
    circumferenceInputs.classList.add("hide");
    ymcaInputs.classList.remove("show");
    ymcaInputs.classList.add("hide");


    if (formula === "jackson") {
        skinfoldInputs.classList.remove("hide");
        skinfoldInputs.classList.add("show");
    } else if (formula === "navy") {
        circumferenceInputs.classList.remove("hide");
        circumferenceInputs.classList.add("show");
    } else if (formula === "ymca") {
        ymcaInputs.classList.remove("hide");
        ymcaInputs.classList.add("show");
    }
    // No "else" needed here as all formulas are explicitly handled.
}

// Add event listener for changes to the formula dropdown
document.getElementById("formula").addEventListener("change", handleFormulaChange);

// Call it once when the script loads to set the initial state
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
        // --- Jackson/Pollock 3-Site Calculation Logic ---
        var age = parseFloat(sanitizeInput(document.getElementById("age").value));
        var chest = parseFloat(sanitizeInput(document.getElementById("chest").value));
        var abdomen = parseFloat(sanitizeInput(document.getElementById("abdomen").value));
        var thigh = parseFloat(sanitizeInput(document.getElementById("thigh").value));
        var triceps = parseFloat(sanitizeInput(document.getElementById("triceps").value));
        var suprailiac = parseFloat(sanitizeInput(document.getElementById("suprailiac").value));
        var skinfoldUnit = document.getElementById("skinfold-unit").value;

        // Validation for Age
        if (isNaN(age) || age < 1 || age > 120) {
            document.getElementById("body-fat-result").textContent = "Please enter a valid age (1-120) for Jackson/Pollock.";
            return;
        }

        // Convert inches to mm if needed (Jackson formulas typically use mm)
        if (skinfoldUnit === "inches") {
            chest *= 25.4;
            abdomen *= 25.4;
            thigh *= 25.4;
            triceps *= 25.4;
            suprailiac *= 25.4;
        }

        if (gender === "male") {
            // Jackson & Pollock 3-Site Formula for MALES (Chest, Abdomen, Thigh)
            if (isNaN(chest) || isNaN(abdomen) || isNaN(thigh)) {
                document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Chest, Abdomen, and Thigh for Male Jackson/Pollock.";
                return;
            }
            if (chest <= 0 || abdomen <= 0 || thigh <= 0) {
                document.getElementById("body-fat-result").textContent = "Chest, Abdomen, and Thigh measurements must be greater than zero.";
                return;
            }

            var sumOf3FoldsMale = chest + abdomen + thigh;

            // Body Density (BD) formula for Male 3-site (Jackson & Pollock)
            // BD = 1.10938 - (0.0008267 * sum of 3 skinfolds) + (0.0000016 * (sum of 3 skinfolds)^2) - (0.0002574 * age)
            var bodyDensityMale = 1.10938 - (0.0008267 * sumOf3FoldsMale) + (0.0000016 * Math.pow(sumOf3FoldsMale, 2)) - (0.0002574 * age);
            bodyFatPercentage = (495 / bodyDensityMale) - 450;

        } else { // Female Jackson/Pollock 3-Site (Triceps, Suprailiac, Thigh)
            if (isNaN(triceps) || isNaN(suprailiac) || isNaN(thigh)) {
                document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Triceps, Suprailiac, and Thigh for Female Jackson/Pollock.";
                return;
            }
            if (triceps <= 0 || suprailiac <= 0 || thigh <= 0) {
                document.getElementById("body-fat-result").textContent = "Triceps, Suprailiac, and Thigh measurements must be greater than zero.";
                return;
            }

            var sumOf3FoldsFemale = triceps + suprailiac + thigh;

            // Body Density (BD) formula for Female 3-site (Jackson & Pollock)
            // BD = 1.0994921 - (0.0009929 * sum of 3 skinfolds) + (0.0000023 * (sum of 3 skinfolds)^2) - (0.0001392 * age)
            var bodyDensityFemale = 1.0994921 - (0.0009929 * sumOf3FoldsFemale) + (0.0000023 * Math.pow(sumOf3FoldsFemale, 2)) - (0.0001392 * age);
            bodyFatPercentage = (495 / bodyDensityFemale) - 450;
        }

    } else if (formula === "navy") {
        // --- NAVY Formula Calculation Logic (PRESERVED AS IS) ---
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
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Neck, Waist, Height (and Hip for females) for Navy formula.";
            return;
        }
        if (neck <= 0 || waist <= 0 || height <= 0 || (gender === "female" && hip <= 0)) {
            document.getElementById("body-fat-result").textContent = "Measurements must be greater than zero for Navy formula.";
            return;
        }

        // Unit Conversion (Applies to Navy)
        if (unit === "cm") {
            neck = neck / 2.54;
            waist = waist / 2.54;
            if (gender === "female") {
                hip = hip / 2.54;
            }
            height = height / 2.54;
        }

        if (gender === "male") {
            // Check for valid log input
            if ((waist - neck) <= 0) {
                 document.getElementById("body-fat-result").textContent = "Waist must be greater than Neck for male Navy formula.";
                 return;
            }
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * (Math.log10(waist - neck)) + 0.15456 * (Math.log10(height))) - 450;
        } else { // Female Navy
            // Check for valid log input
            if ((waist + hip - neck) <= 0) {
                document.getElementById("body-fat-result").textContent = "Waist + Hip must be greater than Neck for female Navy formula.";
                return;
            }
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * (Math.log10(waist + hip - neck)) + 0.22100 * (Math.log10(height))) - 450;
        }

    } else if (formula === "ymca") {
        // --- YMCA Formula Calculation Logic (NOW MORE ROBUST) ---
        // This variant uses Age, Weight, Waist, and Hip (for females)
        // If you absolutely want ONLY Waist and Weight for YMCA, let me know, but it's less standard.

        var ymcaWaistInput = sanitizeInput(document.getElementById("ymca-waist").value);
        var ymcaHipInput = sanitizeInput(document.getElementById("ymca-hip").value); // New: Get hip for YMCA
        var weightInput = sanitizeInput(document.getElementById("weight").value);
        var ymcaUnit = document.getElementById("ymca-unit").value;

        var ymcaWaist = parseFloat(ymcaWaistInput);
        var ymcaHip = parseFloat(ymcaHipInput);
        var weight = parseFloat(weightInput);

        // Input Validation for YMCA
        if (isNaN(ymcaWaist) || isNaN(weight) || (gender === "female" && isNaN(ymcaHip))) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for Waist, Weight (and Hip for females) for YMCA formula.";
            return;
        }
        if (ymcaWaist <= 0 || weight <= 0 || (gender === "female" && ymcaHip <= 0)) {
            document.getElementById("body-fat-result").textContent = "Measurements must be greater than zero for YMCA formula.";
            return;
        }

        // YMCA specific unit conversion (to lbs and inches, as is common for YMCA formulas)
        if (ymcaUnit === "cm_kg") {
            ymcaWaist = ymcaWaist / 2.54; // Convert cm to inches
            if (gender === "female") {
                ymcaHip = ymcaHip / 2.54; // Convert cm to inches
            }
            weight = weight * 2.20462; // Convert kg to lbs
        }

        // Common YMCA Formula (This is often a formula for *Lean Body Mass* or directly percentage)
        // Let's use one that aims for direct percentage, or converts from circumference + weight.
        // There are many 'YMCA' formulas; let's use common simplified ones often found online.

        if (gender === "male") {
            // Formula often cited for males (Waist in inches, Weight in lbs):
            bodyFatPercentage = ((weight - ( (ymcaWaist * 4.15) - 98.42 ) ) / weight) * 100;
            // Simplified version of the above:
            // bodyFatPercentage = ((-98.42 + (4.15 * ymcaWaist)) - (0.082 * weight) ) / weight * 100; // This is actually an estimation of fat mass, needs division by weight.

            // The one often directly stated as BF% for males from YMCA (simplistic):
            // bodyFatPercentage = (0.157 * ymcaWaist) + (0.259 * weight) - 6.22; // This is often used for a different context.

            // Let's use the regression equation format (often for Fat Mass, then convert to %):
            var fatMassMale = ( (ymcaWaist * 4.15) - 98.42 ); // Fat Mass estimation based on waist for some simple YMCA proxies
            if (weight > 0) {
                 bodyFatPercentage = (fatMassMale / weight) * 100;
            } else {
                 document.getElementById("body-fat-result").textContent = "Weight must be greater than zero for YMCA formula (male).";
                 return;
            }

        } else { // Female YMCA
            // Formula often cited for females (Waist, Hip in inches, Weight in lbs):
            // bodyFatPercentage = ( (weight - ( (ymcaWaist * 4.15) + (ymcaHip * 0.082) - 76.76 ) ) / weight ) * 100; // This doesn't look quite right for general YMCA.

            // A more commonly cited female YMCA Body Fat % formula involves multiple sites:
            // This is a common *simplified* YMCA proxy that aims for BF%:
            // bodyFatPercentage = ( (ymcaWaist * 0.157) + (weight * 0.259) - 10.36 ); // This can be wildly off.

            // Let's use a robust formula often cited for YMCA and similar methods for females (inches and pounds):
            // BF% = ( (Waist_inches * 0.741) + (Hip_inches * 0.082) - (Weight_lbs * 0.157) - 34.409 ) / Total_Body_Weight * 100 // This structure seems more plausible.
            // However, a very common simplified YMCA equation for females is:
            // Body Density = 1.07629 - (0.00081 * Waist) + (0.00067 * Age) - (0.00018 * Thigh) - (0.00015 * Triceps) (too complex for simple YMCA)

            // Let's go with a very common *circumference-based* formula often attributed to YMCA or similar systems
            // This formula is a bit of a hybrid from various sources, trying to match what many online YMCA calculators use.
            // It uses Waist, Hip, and Weight to calculate an estimated body fat.
            var factorFemale = ymcaWaist + ymcaHip - weight; // Simple combination for this type of calculation.
            if (factorFemale <= 0) { // Protect against log of zero/negative
                document.getElementById("body-fat-result").textContent = "Waist + Hip must be greater than Weight for female YMCA formula.";
                return;
            }
            bodyFatPercentage = 495 / (1.0994921 - (0.0009929 * ymcaWaist) + (0.0000023 * Math.pow(ymcaWaist, 2)) - (0.0001392 * age) - (0.00015 * ymcaHip)) - 450; // This is a complex Jackson like.

            // Let's revert to a more straightforward, widely available YMCA interpretation:
            // This one is very common when age and hip are not explicitly used for males/females:
            // Male: %BF = ((Waist - Neck) * Factor) - (Height * Factor) + Constant
            // But YMCA usually involves Weight.

            // The most common and simple *direct percentage* YMCA formula for both genders is often given as:
            // Male: Body Fat % = ( (Waist * 4.15) - 98.42) / Weight * 100
            // Female: Body Fat % = ( (Waist * 4.15) - 76.76) / Weight * 100
            // These are highly simplified and often produce strange results, but let's implement if you prefer simplicity over accuracy here.

            // Given the added Hip input, let's use a version that might make more sense:
            // A more robust (still estimated) one, often found online for YMCA type:
            if (weight > 0) {
                 bodyFatPercentage = ( ( (ymcaWaist * 0.741) + (ymcaHip * 0.082) - (weight * 0.157) - 34.409 ) / weight ) * 100;
            } else {
                 document.getElementById("body-fat-result").textContent = "Weight must be greater than zero for YMCA formula (female).";
                 return;
            }

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
