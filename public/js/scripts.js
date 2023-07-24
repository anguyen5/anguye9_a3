
window.addEventListener('DOMContentLoaded', event => {
   
    // BMI
    const form = document.getElementById('calculatorForm');
    const statusDiv = document.getElementById('status');

    async function callAPI(route, data) {
        console.log("route: ", route);

        const formData = new FormData(form);
        console.log("formData", formData);

        var height_m = (formData.get("height_ft") * 30.48 + formData.get("height_in") * 2.54) / 100.0;
        var weight_kg = formData.get("weight") * 0.453592;
        var age_ = formData.get("age");
        var gender_ = formData.get("gender");

        data.height = height_m;
        data.weight = weight_kg;
        data.age = Number(age_);
        data.gender= gender_;

        console.log("data", data);

        try {
            const res = await fetch(route, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            json = await res.json();

            console.log("API response: ", json);
            //statusDiv.innerHTML = `<p>Result: ${JSON.stringify(json)}</p>`;

            return json;
        } catch (error) {
            console.log("Error: ", error.message);
            statusDiv.innerHTML = `<p>Error: ${error.message}</p>`;
            return null;
        }
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const bmiJSON = await callAPI(`/bmi`, {});
        const bodyFatJSON = await callAPI(`/bodyfat`, {bmi: bmiJSON.bmi});
        const weightJSON = await callAPI(`/idealweight`, {bmi: bmiJSON.idealWeight});
        const calorieJSON = await callAPI(`/caloriesburned`, {});

      

        $("#valueBMI").html("Your BMI is " + bmiJSON.bmi.toFixed(2));
        $("#valueBodyfat").html("Your Body Fat is " + bodyFatJSON.bodyFat.toFixed(2));
        $("#valueBodyfatMean").html("valueBodyfatMean:  " + bodyFatJSON.notify);
        $("#idealWeight").html("Value Idea Weight: " + (weightJSON.idealWeight*2.20462).toFixed(2));
        $("#calories").html("You need to Burn Calories: " + calorieJSON.caloriesBurned.toFixed(2));

        const formData = new FormData(form);
        var gender_ = formData.get("gender");
        console.log("gender_ : "+ gender_);
        console.log("bodyFatJSON.bodyFat: " , bodyFatJSON.bodyFat);
        var bodyFatCategory = "";

        if (gender_ === "male") {
            if (bodyFatJSON.bodyFat <= 8) {
              document.getElementById("valueBodyfatMean").innerText = "Classification: Underfat";
              bodyFatCategory = "Underfat";

            } else if (bodyFatJSON.bodyFat < 20) {
              document.getElementById("valueBodyfatMean").innerText = "Classification: Healthy";
              bodyFatCategory = "Healthy";
            } else if (bodyFatJSON.bodyFat < 25) {
              document.getElementById("valueBodyfatMean").innerText = "Classification: Overfat";
              bodyFatCategory = "Overfat";
            } else {
              document.getElementById("valueBodyfatMean").innerText = "Classification: Obese";
              bodyFatCategory = "Obese";
          }
        }
        else{
            if (bodyFatJSON.bodyFat <= 21) {
                document.getElementById("valueBodyfatMean").innerText = "Classification: Underfat";
                bodyFatCategory = "Underfat";
              } else if (bodyFatJSON.bodyFat < 33) {
                document.getElementById("valueBodyfatMean").innerText = "Classification: Healthy";
                bodyFatCategory = "Healthy";
              } else if (bodyFatJSON.bodyFat < 39) {
                document.getElementById("valueBodyfatMean").innerText = "Classification: Overfat";
                bodyFatCategory = "Overfat";
              } else {
                document.getElementById("valueBodyfatMean").innerText = "Classification: Obese";
                bodyFatCategory = "Obese";
            }
        }

        console.log("show table");

        $("#infoDialog").modal("show");
         // map response data to HTML elements in modal
         $("#valueBMI_").html("BMI:  " +bmiJSON.bmi.toFixed(2));
         $("#valueBodyfat_").html("Body Fat:  " + bodyFatJSON.bodyFat.toFixed(2));
         $("#valueBodyfatMean_").html("Classification:  " +bodyFatCategory);
         $("#idealWeight_").html("Value Idea Weight:  " + (weightJSON.idealWeight*2.20462).toFixed(2));
         $("#calories_").html("Calories Burn:  " + calorieJSON.caloriesBurned.toFixed(2));

        // retrieve modal
        var modal = document.getElementById("infoDialog");

        // retrieve span when closing the modal
        // var span = document.getElementsByClassName("close")[0];

        // if the user clicks on the closing icon (x), then clear the modal
        // span.onclick = function () {
        //     modal.style.display = "none";
        // };

        // if the user clicks anywhere on the page outside modal boundary, then clear the modal
        window.onclick = function (event) {
            if (event.target === modal) {
                modal.style.display = "none";
            }
        };

       


    });
})
