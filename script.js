// Global Variables
var currentlyPlaying; // The ringtone that is currently playing
var canvas; var ctx; // The Base Canvas + Context
var ticks; var ticksCtx; // The Ticks Canvas + Context
var loadingLayer; var loadCtx; // The Loading Bar Canvas + Context
var intervalTimer; var isPaused = true; var timeElapsed = 0; // Loading Bar Timer 
var fadeOutTimer = []; // Timer for Fading Out on Play/Pause
var canvases;

// When a Ringtone is pressed
function openPopup(toneObject, popup, cover, tone, toneURL, category) {
  // Setting values to visual elements
  let infoLabels = popup.children[1].children; // All of the HTML Elements in the Popup
  document.getElementsByClassName('popupTitle')[0].innerText = toneObject.name; // Title
  document.getElementsByClassName('song_data')[0].innerHTML = toneObject.songs; // Songs
  document.getElementsByClassName('song_data')[1].innerHTML = toneObject.album; // Album Name
  document.getElementsByClassName('song_data')[2].innerHTML = toneObject.artist;// Artist
  document.getElementsByClassName('song_data')[3].innerHTML = toneObject.studio;// Studio
  document.getElementsByClassName('ringtoneCover')[0].src = cover;              // Album Cover
  document.getElementsByClassName('withinPopupImage')[0].src = "Images/" + returnImageFromCategory(category) // Category
  setRecommendationVariables(toneObject.recommended);
  // Loading Bar Canvas Layers
  canvas =  document.getElementById('progressBar'); canvas.width = document.getElementById('progressBar').offsetWidth; canvas.height = canvas.width;
  ctx = canvas.getContext('2d');
  ticks = document.getElementById('ticks'); ticks.width = canvas.width; ticks.height = canvas.height;
  ticksCtx = ticks.getContext('2d');
  loadingLayer = document.getElementById('loader'); loadingLayer. width = canvas.width; loadingLayer.height = canvas.height;
  loadCtx = loadingLayer.getContext('2d');
  // Set the loading bar opacity to transparent
  canvases = [canvas, ticks, loadingLayer];
  for (var i = 0; i < canvases.length; i++) { canvases[i].style.opacity = 0; };
  // Adding Popup Close Action
  let closer = document.getElementById("closeButton"); closer.addEventListener('click', function() { closePopup(popup, tone, toneObject) }); // When you press the X button
  createProgresser(document.getElementById('progressBar'), toneObject.length); // Creates the progress bar
  // Setting Download Elements
  let aTag = document.getElementById('ringtoneDownload'); aTag.href = toneURL; aTag.download = tone
  // Play Audio Action
  document.getElementsByClassName('playRingtone')[0].onclick = function() {
    playAudio(tone, toneObject, document.getElementById('progressBar'));
  }

  document.getElementById('youtubeButton').onclick = function() { window.open(toneObject.youtube, '_blank').focus(); }
  document.getElementById('lengthPara').innerText = toneObject.length
  document.getElementById('downloadsPara').innerText = toneObject.downloads
  document.getElementById('popupButton').onclick = function(){changeDownloads(toneObject.downloads, category, toneObject.name)}
}

function createProgresser(loader, lines) {
  let degreesSpacing = 360 / lines; // The amount of ticks necessary
  createCircularProgresser(loader); // Creating the progress loader
  //createTimestampTicks(degreesSpacing, lines); // Creating the Ticks (not currently in use (don't delete))
}

// Create Circular Shapes
function createCircularProgresser(loader) {
  ctx.beginPath();
  ctx.arc(loader.offsetWidth / 2, loader.offsetWidth / 2, loader.offsetWidth / 2 - 21, 0, Math.PI * 2, false)
  ctx.lineWidth = 21;
  ctx.strokeStyle = "black"
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(loader.offsetWidth / 2, loader.offsetWidth / 2, loader.offsetWidth / 2 - 21, 0, Math.PI * 2, false)
  ctx.lineWidth = 15;
  ctx.strokeStyle = "white"
  ctx.stroke();
}

// Create Ticks
function createTimestampTicks(spacing, lines) {
  ticksCtx.beginPath();
  ticksCtx.translate(73, 73);
  ticksCtx.fillStyle = "black";
  ticksCtx.fillRect(0, -73 + 21 - 7.5, 2, 15);
  ticksCtx.translate(0, 0);

  for (var i = 0; i < lines - 1; i++) {
    ticksCtx.beginPath();
    ticksCtx.translate(0, 0);
    ticksCtx.rotate(toRad(spacing));
    ticksCtx.fillStyle = "black";
    ticksCtx.fillRect(0, -73 + 21 - 7.5, 2, 15);
  }; ticksCtx.translate(-73, -73); 
}

// Closes the Popup
function closePopup(popup, tone, toneObject) {
  popup.style.display = 'none';
  tone.pause(); currentlyPlaying = null; isPaused = true; tone.currentTime = 0; timeElapsed = 0; clearInterval(intervalTimer);
  ctx.clearRect(0, 0, canvas.width, canvas.height); 
  ticksCtx.clearRect(0, 0, canvas.width, canvas.height);
  loadCtx.clearRect(0, 0, canvas.width, canvas.height);
}

// When you click Play Audio
function playAudio(tone, toneObject, loader) {
  tone.volume = 0.5; // Sets Volume
  if (isPaused) { // Music was paused or never played
    
    isPaused = false; // Sets Paused to False
    clearTimeout(fadeOutTimer) // Removing Timers to avoid duplicates
    fadeInCanvases(); // Fade in Every Canvas Layer
    // In 4 Seconds Fade out Layers
    fadeOutTimer = setTimeout(function() {
      fadeOutCanvases();
    }, 4000);
    // Move Progress Bar Forward
    intervalTimer = setInterval(function() {
      drawNewArc(timeElapsed, toneObject.length, loader); timeElapsed++;
    }, (toneObject.length / 360 * 1000));
    currentlyPlaying = tone; // Set the currently playing tone to current tone
    currentlyPlaying.play(); // Plays the tone
    
  } else { // Music is currently playing
    
    isPaused = true; // Sets Paused to True
    clearInterval(intervalTimer); // Removing Loading Bar Timer
    clearTimeout(fadeOutTimer); // Removing Timers to avoid duplicates
    fadeInCanvases(); // Fade in every layer
     // Fade out every layer in 1.5 seconds
    fadeOutTimer = setTimeout(function() {
      fadeOutCanvases();
    }, 1500);
    currentlyPlaying.pause(); // Pause the song
    
  }
}

// Moves the Circular Loader Forward
function drawNewArc(time, final, loader) {
  if (time >= 361) { 
    clearInterval(intervalTimer);
    fadeOutCanvases();
    timeElapsed = 0; isPaused = true;
    setTimeout(function() { loadCtx.clearRect(0, 0, canvas.width, canvas.height) }, 700)
    return;
  }
  let space = 360 / final

  loadCtx.beginPath();
  loadCtx.arc(loader.offsetWidth / 2, loader.offsetWidth / 2, loader.offsetWidth / 2 - 21, toRad(-90), toRad(time - 90), false)
  loadCtx.lineWidth = 15;
  loadCtx.strokeStyle = "#222";
  loadCtx.stroke();

  // To change the color of the ticks
  /*if (time % space == 0 && time != 0) {
    ticksCtx.beginPath();
    ticksCtx.translate(73, 73);
    ticksCtx.rotate(toRad(time + space));
    ticksCtx.fillStyle = "white";
    ticksCtx.fillRect(0, -73 + 20 - 7.5, 2, 17);
    ticksCtx.rotate(toRad(-time - space));
    ticksCtx.translate(-73, -73);
  }*/
}

function setRecommendationVariables(recommended) {
  if (recommended == undefined) {
    document.getElementsByClassName('recommendation')[0].style.display = 'none';
  } else {
    document.getElementsByClassName('recommendation')[0].style.display = 'flex';
    document.getElementsByClassName('who_recommended')[0].innerText = recommended;
  }
}

function changeDownloads(downloads, category, name) {
  console.log("Change Downloads");
  const reference = firestore.collection(category);
  reference.doc(name).set({Downloads: (downloads + 1)}, {merge: true} );
}

function returnImageFromCategory(category) {
  console.log(category)
  switch(category) {
    case "Films":
      return "Movie.jpg";
    case "Songs":
      return "mic.png";
    case "Memes":
      return "Memes.jpg";
  }
}

function fadeOutCanvases() {
  for (var i = 0; i < canvases.length; i++) { fadeOut(canvases[i]) };
}

function fadeInCanvases() {
  for (var i = 0; i < canvases.length; i++) { fadeIn(canvases[i]) };
}

// Fades out an Object
function fadeOut(element) {
  //console.log("Fade Out")
  var fadeEffect = setInterval(function () {
    if (element.style.opacity > 0) {
      element.style.opacity -= 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 50);
}

// Fades in an Object
function fadeIn(element) {
  //console.log("Fade In")
  var counter = 0
  var fadeEffect = setInterval(function () {
    if (element.style.opacity < 1) {
      element.style.opacity = counter; counter += 0.1;
    } else {
      clearInterval(fadeEffect);
    }
  }, 50);
}

/*window.onscroll = scrollLine();
function scrollLine() {
  console.log((document.getElementById("lineScroll")));
}*/

// Converts Degrees to Radians
function toRad(deg) {
  return deg * Math.PI / 180
}