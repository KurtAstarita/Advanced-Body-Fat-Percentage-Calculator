// script.js
document.getElementById("formula").addEventListener("change", function() {
    var formula = document.getElementById("formula").value;
    document.getElementById("skinfold-inputs").style.display = (formula === "jackson") ? "block" : "none";
    document.getElementById("circumference-inputs").style.display = (formula === "ymca" || formula === "navy") ? "block" : "none";
});

document.getElementById("calculate-body-fat").addEventListener("click", function() {
    // Function to sanitize input (mainly to trim whitespace)
    function sanitizeInput(input) {
        return input.trim();
    }

    var gender = document.getElementById("gender").value;
    var formula = document.getElementById("formula").value;
    var bodyFatPercentage;

    if (formula === "jackson") {
        var chest = parseFloat(sanitizeInput(document.getElementById("chest").value));
        var abdomen = parseFloat(sanitizeInput(document.getElementById("abdomen").value));
        var thigh = parseFloat(sanitizeInput(document.getElementById("thigh").value));
        var triceps = parseFloat(sanitizeInput(document.getElementById("triceps").value));
        var suprailiac = parseFloat(sanitizeInput(document.getElementById("suprailiac").value));
        var midaxillary = parseFloat(sanitizeInput(document.getElementById("midaxillary").value));
        var skinfoldUnit = document.getElementById("skinfold-unit").value;

        // Input Validation
        if (isNaN(chest) || isNaN(abdomen) || isNaN(thigh) || isNaN(triceps) || isNaN(suprailiac) || isNaN(midaxillary)) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for skinfold measurements.";
            return;
        }

        if (chest <= 0 || abdomen <= 0 || thigh <= 0 || triceps <= 0 || suprailiac <= 0 || midaxillary <= 0) {
            document.getElementById("body-fat-result").textContent = "Skinfold measurements must be greater than zero.";
            return;
        }

        // Convert inches to mm if needed
        if (skinfoldUnit === "inches") {
            chest = chest * 25.4;
            abdomen = abdomen * 25.4;
            thigh = thigh * 25.4;
            triceps = triceps * 25.4;
            suprailiac = suprailiac * 25.4;
            midaxillary = midaxillary * 25.4;
        }

        var sumSkinfolds = chest + abdomen + thigh + triceps + suprailiac + midaxillary;
        var density;

        if (gender === "male") {
            density = 1.112 - 0.00043499 * sumSkinfolds + 0.00000055 * sumSkinfolds * sumSkinfolds;
        } else {
            density = 1.097 - 0.00046971 * sumSkinfolds + 0.00000056 * sumSkinfolds * sumSkinfolds;
        }

        bodyFatPercentage = (495 / density) - 450;
    } else if (formula === "ymca" || formula === "navy") {
        var neck = parseFloat(sanitizeInput(document.getElementById("neck").value));
        var waist = parseFloat(sanitizeInput(document.getElementById("waist").value));
        var hip = parseFloat(sanitizeInput(document.getElementById("hip").value));
        var height = parseFloat(sanitizeInput(document.getElementById("height").value));
        var unit = document.getElementById("unit").value;

        // Input Validation
        if (isNaN(neck) || isNaN(waist) || isNaN(height)) {
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for circumference measurements.";
            return;
        }
        if (neck <= 0 || waist <= 0 || height <= 0) {
            document.getElementById("body-fat-result").textContent = "Circumference measurements must be greater than zero.";
            return;
        }

        if (unit === "cm") {
            neck = neck / 2.54;
            waist = waist / 2.54;
            if (gender === "female") {
                hip = hip / 2.54;
            }
            height = height / 2.54;
        }

        if (gender === "male") {
            bodyFatPercentage = 495 / (1.0324 - 0.19077 * (Math.log10(waist - neck)) + 0.15456 * (Math.log10(height))) - 450;
        } else {
            bodyFatPercentage = 495 / (1.29579 - 0.35004 * (Math.log10(waist + hip - neck)) + 0.22100 * (Math.log10(height))) - 450;
        }
    }

    document.getElementById("body-fat-result").textContent = "Estimated body fat percentage: " + bodyFatPercentage.toFixed(2) + "%.";
});
