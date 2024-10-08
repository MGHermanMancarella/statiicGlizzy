"use strict";

//chat questions and response variables
import * as chatbotQsAndRs from "./chatResponses.js";

const glizzyResponse = document.getElementById("glizzyResponse");
const sendIt = document.querySelector(".send-icon");
const chatBox = document.getElementById("msg-page");
const prompt = document.getElementById("prompt");
const locationForm = document.getElementById("locationForm");
const marriageBtn = document.getElementById("marriageBtn");
const WWIIBtn = document.getElementById("WWIIBtn");
const sandwichBtn = document.getElementById("sandwichBtn");
const wetWaterBtn = document.getElementById("wetWaterBtn");
const foolsBtn = document.getElementById("foolsBtn");

const suggestions = [marriageBtn, WWIIBtn, sandwichBtn, wetWaterBtn, foolsBtn];

/*!
 * Start Bootstrap - Business Casual v7.0.9 (https://startbootstrap.com/theme/business-casual)
 * Copyright 2013-2023 Start Bootstrap
 * Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-business-casual/blob/master/LICENSE)
 */

/** Add event listener to location form
 *
 * form submits the query string that will be passed into the API call.
 * That data can be anything location related, spaces included.
 * - 99999
 * - city name
 *
 */
if (locationForm) {
  locationForm.addEventListener("submit", (event) => {
    // Prevent the default form submission behavior
    event.preventDefault();

    // Get the location query from the input field
    const locationQuery = document.getElementById("locationQuery").value;

    // Hide the form
    locationForm.style.display = "none";

    // Send a GET request to the API
    displayData(locationQuery);
  });
}

/* Makes api call to get the weather from a specific location */
async function getWeather(locationQuery) {
  let res;
  try {
    res = await fetch(
      `https://api.isitglizzyweather.site?locationQuery=${locationQuery}`
      // `https://weatherapiproxy.onrender.com?locationQuery=${locationQuery}`
      // `http://127.0.0.1:5001?locationQuery=${locationQuery}`
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
  const hotResponse = "OH YOU BETTER BELIEVE THATS PRIME GLIZZY WEATHER";
  const wetResponse = "Rain or shine - IT'S GLIZZY TIME";
  const nightResponse =
    "It's a little late, champ. Get some rest - there will be plenty of time for Glizzies tomorrow.";

  //API call:
  let response;
  try {
    response = await getWeather(locationQuery);
    // Hide Form:
    document.getElementById("formDiv").classList.add("hidden-important");
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
    glizzyResponse.innerText = "Suns out Buns out" + " - " + hotResponse;
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
    document.getElementById("demo").innerHTML =
      "Geolocation is not supported by this browser.";
  }
}

function showPosition(position) {
  document.getElementById("demo").innerHTML =
    "Latitude: " +
    position.coords.latitude +
    "<br>Longitude: " +
    position.coords.longitude;
}

// Location errors
function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      document.getElementById("demo").innerHTML =
        "User denied the request for Geolocation.";
      break;
    case error.POSITION_UNAVAILABLE:
      document.getElementById("demo").innerHTML =
        "Location information is unavailable.";
      break;
    case error.TIMEOUT:
      document.getElementById("demo").innerHTML =
        "The request to get user location timed out.";
      break;
    case error.UNKNOWN_ERROR:
      document.getElementById("demo").innerHTML = "An unknown error occurred.";
      break;
  }
}

////////////////////////////////// Chatbot //////////////////////////////////

if (chatBox) {
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Assign event listener to suggested question buttons:
if (sendIt || prompt) {
  suggestions.forEach(function (btn) {
    btn.addEventListener("click", function (event) {
      let responseDivId = event.target.id.slice(0, -3);
      let questionDivId = responseDivId + "Q";
      const question = document.createElement("div");
      question.innerHTML = chatbotQsAndRs[questionDivId];
      const response = document.createElement("div");
      response.innerHTML = chatbotQsAndRs[responseDivId];
      // console.log('question', question)
      // console.log('response-', response)
      setTimeout(() => {
        chatBox.appendChild(question);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 500);
      setTimeout(() => {
        chatBox.appendChild(response);
        chatBox.scrollTop = chatBox.scrollHeight;
      }, 2000);
    });
  });
}

// Assign a click event listener to send icon & keydown: enter
if (sendIt || prompt) {
  sendIt.addEventListener("click", sendReceive, (prompt.value = ""));
  prompt.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      sendReceive();
      prompt.value = "";
    }
  });
}
/** Send message and handle response
 *
 */
function sendReceive() {
  let message = document.getElementById("prompt").value;
  prompt.value = "";
  // console.log(message); // Log the message to the console
  createOutgoingMessageHTML(message);

  chat(message).then((resp) => {
    // console.log(resp.Glizzy_Bot);
    createResponseMessageHTML(resp.Glizzy_Bot);
  });
}

async function chat(prompt) {
  let res;
  try {
    res = await fetch(`https://api.isitglizzyweather.site/chat`, {
    // res = await fetch(`https://weatherapiproxy.onrender.com/chat?`, {
      // res = await fetch(`http://127.0.0.1:5001/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: encodeURIComponent(prompt) }),
    });
  } catch (error) {
    chatBox.innerText = chatBox.innerText + error;
  }
  if (res.ok) {
    return res.json();
  } else {
    console.log("network response error");
  }
}

// Create a function to encapsulate the code
function createResponseMessageHTML(message) {
  // Create the main div element
  let receivedChatsDiv = document.createElement("div");
  receivedChatsDiv.className = "received-chats";

  // Create the image div element
  let imageDiv = document.createElement("div");
  imageDiv.className = "received-chats-img";

  // Create the image element
  let image = document.createElement("img");
  image.src = "./assets/img/chat/Dawg.png";

  // Append the image to the image div
  imageDiv.appendChild(image);

  // Create the message div element
  let messageDiv = document.createElement("div");
  messageDiv.className = "received-msg";

  // Create the inbox div element
  let inboxDiv = document.createElement("div");
  inboxDiv.className = "received-msg-inbox";

  // Create the paragraph element
  let paragraph = document.createElement("p");
  paragraph.textContent = message; // Set the message text

  // Append the paragraph to the inbox div
  inboxDiv.appendChild(paragraph);

  // Append the inbox div to the message div
  messageDiv.appendChild(inboxDiv);

  // Append the image div and message div to the main div
  receivedChatsDiv.appendChild(imageDiv);
  receivedChatsDiv.appendChild(messageDiv);

  // Append the main div to the body or another container element
  chatBox.appendChild(receivedChatsDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function createOutgoingMessageHTML(message) {
  // Create the main div element
  let outgoingChatsDiv = document.createElement("div");
  outgoingChatsDiv.className = "outgoing-chats";

  // Create the image div element
  let imageDiv = document.createElement("div");
  imageDiv.className = "outgoing-chats-img";

  // Create the image element
  let image = document.createElement("img");
  image.src = "./assets/img/chat/Chimkin.png";

  // Append the image to the image div
  imageDiv.appendChild(image);

  // Create the message div element
  let messageDiv = document.createElement("div");
  messageDiv.className = "outgoing-msg";

  // Create the message content div element
  let msgContentDiv = document.createElement("div");
  msgContentDiv.className = "outgoing-chats-msg";

  // Loop through the messages array and create a paragraph for each message
  let paragraph = document.createElement("p");
  paragraph.textContent = message; // Set the message text
  msgContentDiv.appendChild(paragraph);

  // Append the message content div to the message div
  messageDiv.appendChild(msgContentDiv);

  // Append the image div and message div to the main div
  outgoingChatsDiv.appendChild(imageDiv);
  outgoingChatsDiv.appendChild(messageDiv);

  // Append the main div to the body or another container element
  chatBox.appendChild(outgoingChatsDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}
