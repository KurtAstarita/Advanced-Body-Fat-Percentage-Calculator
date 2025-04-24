document.getElementById("formula").addEventListener("change", function() {
    var formula = document.getElementById("formula").value;
    var skinfoldInputs = document.getElementById("skinfold-inputs");
    var circumferenceInputs = document.getElementById("circumference-inputs");

    if (formula === "jackson") {
        skinfoldInputs.classList.add("show");
        skinfoldInputs.classList.remove("hide");
        circumferenceInputs.classList.add("hide");
        circumferenceInputs.classList.remove("show");
    } else if (formula === "ymca" || formula === "navy") {
        circumferenceInputs.classList.add("show");
        circumferenceInputs.classList.remove("hide");
        skinfoldInputs.classList.add("hide");
        skinfoldInputs.classList.remove("show");
    } else {
        skinfoldInputs.classList.add("hide");
        skinfoldInputs.classList.remove("show");
        circumferenceInputs.classList.add("hide");
        circumferenceInputs.classList.remove("show");
    }
});

document.getElementById("calculate-body-fat").addEventListener("click", function() {
    function sanitizeInput(input) {
        return DOMPurify.sanitize(input);
    }

    var gender = document.getElementById("gender").value;
    var formula = document.getElementById("formula").value;
    var bodyFatPercentage;

    if (formula === "jackson") {
        // ... (Jackson formula calculation remains the same)
    } else if (formula === "navy") { // Modified condition
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
