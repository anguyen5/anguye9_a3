
// A3
const express = require('express');
var cors = require('cors');
const app = express();
const port = 3000;

app.use(cors({
  origin: '*'
}));

// Middleware to parse JSON bodies
app.use(express.json());

// define a route using a callback function that will be invoked
// when the user makes a HTTP request to the root of the folder (URL)
// display some information about the REST Service
app.post('/', function (req, res) {
  res.status(200);
  res.send("<h1>This Fitness calculator can help you to estimate BMI, total body fat, ideal weight, and amount of daily calories burned with low activity. \nTo do so, fill out the form and click 'Calculate' button. </h1>");
  console.log("a request has been processed in / (root) ");
});


// Calculate BMI
app.post('/bmi', (req, res, next) => {
  console.log(req.url);
  console.log("req.body: ", req.body);
  const { height, weight } = req.body;
  if (!height || !weight) {
    return res.status(400).json({ error: 'Height and weight are required' });
  }

  const bmi = calculateBMI(height, weight);
  console.log("bmi: ", bmi);
  //make response in JSON format
  res.json({ bmi });
});

// Calculate body fat
app.post('/bodyfat', (req, res) => {
  console.log(req.url);
  console.log("req.body: ", req.body);
  const { age, gender, bmi } = req.body;

  if (!age || !gender || !bmi) {
    return res.status(400).json({ error: 'Age, gender, and bmi are required for body fat calculation' });
  }

  const bodyFat = calculateBodyFat(age, gender, bmi);
  console.log("bodyFat: ", bodyFat);

  res.json({ bodyFat });
});

// Calculate ideal weight
app.post('/idealweight', (req, res) => {
  const { height, gender } = req.body;
  if (!height || !gender) {
    return res.status(400).json({ error: 'Height and gender are required' });
  }

  const idealWeight = calculateIdealWeight(height, gender);
  res.json({ idealWeight });
});

// Calculate calories burned
app.post('/caloriesburned', (req, res) => {
  const { age, gender, weight, height } = req.body;
  if (!age || !gender || !weight || !height) {
    return res.status(400).json({ error: 'Age, gender, weight, and height are required' });
  }

  const caloriesBurned = calculateCaloriesBurned(age, gender, weight, height);
  res.json({ caloriesBurned });
});

//*********      calculations    ************ *
//The formula is BMI = kg/(m*m)
function calculateBMI(height, weight) {
  return weight / (height * height);
}

// body fat result in % using DEURENBERG FORMULA
// https://www.gaiam.com/blogs/discover/how-to-calculate-your-ideal-body-fat-percentage
function calculateBodyFat(age, gender, bmi) {
  var bodyFat;
  if (gender === "male") {
   
    bodyFat = 1.20 * bmi + 0.23 * age - 16.2;
  } else {
    bodyFat = 1.20 * bmi + 0.23 * age - 5.4;
  }

  return bodyFat;
}

//Ideal weight in kg, height in meters
function calculateIdealWeight(height, gender) {
 // Use Robinson law
  const heightInches = height * 39.37;

  let idealWeight;
  if (gender === 'male') {
    idealWeight = 52 + 1.9 * (heightInches - 60);
  } else if (gender === 'female') {
    idealWeight = 49 + 1.7 * (heightInches - 60);
  } else {
    throw new Error('Invalid gender. Please specify "male" or "female".');
  }

  return idealWeight;

}

/**
 * estimation for no activity (lazy and passive person).
 * For men: 66 + (6.2 x weight) + (12.7 x height) – (6.76 x age)
 * For women: 655.1 + (4.35 x weight) + (4.7 x height) – (4.7 x age)
*/
function calculateCaloriesBurned(age, gender, weight, height) {
  if (gender == "male") {
    var caloriesBurned = 66 + (6.2 * weight) + (12.7 * height) - (6.76 * age);
  } else {
    var caloriesBurned = 655.1 + (4.35 * weight) + (4.7 * height) - (4.7 * age);
  }
  return caloriesBurned;
}

// Default route to handle invalid URLs
app.all('*', (req, res) => {
  return res.status(404).json({ error: 'Route not found' });
});

app.listen(port, () => {
  return console.log(`Server is running on http://localhost:${port}`);
});