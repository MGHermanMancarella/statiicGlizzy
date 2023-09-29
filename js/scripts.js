"use strict";
const locationForm = document.getElementById("locationForm");
const glizzyResponse = document.getElementById("glizzyResponse");
const chatBox = document.getElementById("chatbox")

/*!
 * Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
 */
// Highlights current date on contact page
// window.addEventListener('DOMContentLoaded', event => {
//     const listHoursArray = document.body.querySelectorAll('.list-hours li');
//     listHoursArray[new Date().getDay()].classList.add(('today'));
// })

// Makes API call to get client's IP address NOTE: The ip tracker was too inaccurate
// async function getIpLocation() {
//   const res = await fetch("https://api.ipify.org?format=json");
//   // The return value is *not* serialized
//   // You can return Date, Map, Set, etc.

//   if (!res.ok) {
//     // This will activate the closest `error.js` Error Boundary
//     throw new Error("Failed to fetch data");
//   }
//   return res.json();
// }

/** Add event listener to location form
 *
 * form submits the query string that will be passed into the API call.
 * That data can be anything location related, spaces included.
 * - 99999
 * - city name
 *
 */
locationForm.addEventListener("submit", (event) => {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Get the location query from the input field
  const locationQuery = document.getElementById("locationQuery").value;

  // Hide the form
  document.getElementById("locationForm").style.display = "none";

  // Send a GET request to the API
  displayData(locationQuery);
});

/* Makes api call to get the weather from a specific location */
async function getWeather(locationQuery) {
  let res;
  try {
    res = await fetch(
      `https://weatherapiproxy.onrender.com?locationQuery=${locationQuery}`
    );
  } catch (error) {
    locationForm.style.display = "block";
    document.getElementById("error").style.display = "block";
    throw error;
  }
  return res.json();
}

// Displays data from async functions
async function displayData(locationQuery) {
  // Canned Responses:
  const coldResponse =
    "It seems a little cold for a traditional Glizzy. Perhaps some Mac'n'Glizzies is in order?";
  const hotResponse = "OH YOU BETTER BELIEVE THATS PRIME GLIZZY TIME";
  const wetResponse = "Rain or shine - IT'S GLIZZY TIME";
  const nightResponse =
    "It's a little late, champ. Get some rest - there will be plenty of time for Glizzies tomorrow.";

  //API call:
  let response;
  try {
    response = await getWeather(locationQuery);
  } catch (error) {
    document.getElementById("error").style.display = "block";
    return;
  }

  // Show Hidden Elements:
  document.getElementById("youin").style.display = "block";
  document.getElementById("glizzyLand").style.display = "block";

  // Populate Elements with Response Data:
  document.getElementById("location").innerText = `${response.location.name}`;
  document.getElementById(
    "glizzySituation"
  ).innerText = `It's ${response.current.temp_f} degrees and ${response.current.condition.text}.`;

  // Canned Response Logic
  if (response.current.temp_f < 60) {
    glizzyResponse.innerText = coldResponse;
  } else {
    glizzyResponse.innerText = hotResponse;
  }
  if (response.current.condition.text.includes("rain" || "mist")) {
    glizzyResponse.innerText = wetResponse;
  }
  if (
    response.current.is_day === 1 &&
    response.current.condition.text.includes("Sunny")
  ) {
    glizzyResponse.innerText = "Suns out Buns out" + " " + hotResponse;
  }
  if (response.current.is_day === 0) {
    glizzyResponse.innerText = nightResponse;
  }
}


/* Get user location*/
function getLocation() {
  if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
  } else {
      document.getElementById("demo").innerHTML = "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  document.getElementById("demo").innerHTML = "Latitude: " + position.coords.latitude +
  "<br>Longitude: " + position.coords.longitude;
}

// Location errors
function showError(error) {
  switch(error.code) {
      case error.PERMISSION_DENIED:
          document.getElementById("demo").innerHTML = "User denied the request for Geolocation.";
          break;
      case error.POSITION_UNAVAILABLE:
          document.getElementById("demo").innerHTML = "Location information is unavailable.";
          break;
      case error.TIMEOUT:
          document.getElementById("demo").innerHTML = "The request to get user location timed out.";
          break;
      case error.UNKNOWN_ERROR:
          document.getElementById("demo").innerHTML = "An unknown error occurred.";
          break;
  }
}

/////////////////////Chatbot////////////////////////

async function chat(prompt) {
  let res;
  try {
    res = await fetch(
      `https://weatherapiproxy.onrender.com/chat?`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({prompt: encodeURIComponent(prompt)})
      }
    );
  } catch (error) {
    chatBox.innerText = chatBox.innerText + error
  }
  if (res.ok) {
    return res.json();
  } else {
    console.log("network response error")
  }
}