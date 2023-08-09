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

// Makes API call to get client's IP address
async function getIpLocation() {
  const res = await fetch("https://api.ipify.org?format=json");
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  return res.json();
}

// Makes api call to get the weather from a specific ip address
async function getWeather() {
  let ipRes;
  try {
    ipRes = await getIpLocation();
  } catch (error) {
    // This will activate the closest `error.js` Error Boundary
    return "Uh Oh! Something went wrong and we couldn't fetch data the correct  Try again";
  }
  const res = await fetch(
    `https://api.weatherapi.com/v1/current.json?q=${ipRes.ip}`,
    {
      headers: {
        key: "03684ae6e20549df9d4190834230208",
      },
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  return res.json();
}
window.onload = function () {
  displayData();
};

// Displays data from async functions
async function displayData() {
  const coldResponse =
    "It seems a little cold for a traditional Glizzy. Perhaps some Mac'n'Glizzies is in order?";
  const hotResponse = "OH YOU BETTER BELIEVE THATS PRIME GLIZZY TIME";
  const wetResponse = "Rain or shine - IT'S GLIZZY TIME";
  const nightResponse =
    "It's a little late, champ. Get some rest - there will be plenty of time for Glizzies tomorrow.";
  let response;
  if (window.location.pathname.endsWith("HereBeGlizzies.html")) {
    response = await getWeather();
  } else {
    return;
  }

  document.getElementById(
    "location"
  ).innerText = `${response.location.name}` //${response.location.country}`;
  document.getElementById(
    "glizzySituation"
  ).innerText = `It's ${response.current.temp_f} degrees and ${response.current.condition.text}.`;
  let glizzyResponse = document.getElementById("glizzyResponse");

  if (response.current.temp_f < 60) {
    glizzyResponse.innerText = coldResponse;
  } else {
    glizzyResponse.innerText = hotResponse;
  }
  if (response.current.condition.text.includes("rain" || "mist")) {
    glizzyResponse.innerText += wetResponse;
  }
  if (
    response.current.is_day === 1 &&
    response.current.condition.text.includes("sun")
  ) {
    glizzyResponse.innerText = "Suns out Buns out" + " " + hotResponse;
  }
  if (response.current.is_day === 0) {
    glizzyResponse.innerText = nightResponse;
  }
}
