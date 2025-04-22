document.getElementById("formula").addEventListener("change", function() {
    var formula = document.getElementById("formula").value;
    document.getElementById("skinfold-inputs").style.display = (formula === "jackson") ? "block" : "none";
    document.getElementById("circumference-inputs").style.display = (formula === "ymca" || formula === "navy") ? "block" : "none";
});

document.getElementById("calculate-body-fat").addEventListener("click", function() {
    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
    }

    var gender = document.getElementById("gender").value;
    var formula = document.getElementById("formula").value;
    var bodyFatPercentage;

    if (formula === "jackson") {
        var chestInput = sanitizeInput(document.getElementById("chest").value);
        var abdomenInput = sanitizeInput(document.getElementById("abdomen").value);
        var thighInput = sanitizeInput(document.getElementById("thigh").value);
        var tricepsInput = sanitizeInput(document.getElementById("triceps").value);
        var suprailiacInput = sanitizeInput(document.getElementById("suprailiac").value);
        var midaxillaryInput = sanitizeInput(document.getElementById("midaxillary").value);
        var skinfoldUnit = document.getElementById("skinfold-unit").value;

        var chest = parseFloat(chestInput);
        var abdomen = parseFloat(abdomenInput);
        var thigh = parseFloat(thighInput);
        var triceps = parseFloat(tricepsInput);
        var suprailiac = parseFloat(suprailiacInput);
        var midaxillary = parseFloat(midaxillaryInput);

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
            document.getElementById("body-fat-result").textContent = "Please enter valid numbers for circumference measurements.";
            return;
        }
        if (neck <= 0 || waist <= 0 || height <= 0 || (gender === "female" && hip <= 0)) {
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
