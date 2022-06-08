/* * * * * * * * * * * * * * * * 
      Global Variables
* * * * * * * * * * * * * * * */

/* * * * * Firebase References * * * * */
var reference; // Creating Global Firebase Reference
var currentReference; // The Current Reference to Firestore Specifically
/* * * * * All Tone Categories * * * * */
var allCategories = ["Recommended", "Films", "Songs", "Popular", "Memes"] // All ringtone categories
var ringtoneCategories = ["Films", "Songs", "Memes"]; // Each Category Listed
var currentCategory; // Current Category based on Header Button Clicks
/* * * Category Ringtone Buttons for Storage * * */
var visitedPages = [false, true, false, false, false]; // If the user has visited the page; Recommended will be True in the Future
var recommendedToneButtons = []; var filmToneButtons = []; var songToneButtons = []; var memeToneButtons = []; var popularToneButtons = []; // Storage for Every Button of Each Ringtone Category 
var recommendedMessages = []; var filmMessages = []; var songMessages = []; var memeMessages = []; var popularMessages = []; // Storage for Each Texttone Category
var ringtoneButtonArrays = [recommendedToneButtons, filmToneButtons, songToneButtons, memeToneButtons, popularToneButtons] // Array for Ringtones
var texttoneButtonArrays = [recommendedMessages, filmMessages, songMessages, memeMessages, popularMessages]; // Array for Texttones 
var arrayOfAllToneButtons = [ringtoneButtonArrays, texttoneButtonArrays]; // Array for Array of Ringtones and Texttones
var currentTonesArray = filmTones; var currentMessagesArray = filmMessages; // Current Ringtones and Texttones Lists
/* * * Category Ringtones for Storage * * */
var recommendedTones = []; var filmTones = []; var songTones = []; var memeTones = []; var popularTones = []; // Storage for Each Ringtone Category 
var tonesArrays = [recommendedTones, filmTones, songTones, popularTones, memeTones]; // Array of Tones (Ringtones + Texttones)
var recommendedRingtones = []; var filmRingtones = []; var songRingtones = []; var memeRingtoness = []; var popularRingtones = []; // Storage for Each Ringtone Category 
var recommendedTexttones = []; var filmTexttones = []; var songTexttones = []; var memeTexttoness = []; var popularTexttones = []; // Storage for Each Texttone Category
var ringtoneArrays = [recommendedRingtones, filmRingtones, songRingtones,  memeRingtoness, popularRingtones]; // Array of Arrays for Each Ringtone Category 
var texttoneArrays = [recommendedTexttones, filmTexttones, songTexttones,  memeTexttoness, popularTexttones]; // Array of Arrays for Each Texttone Category 
var arrayOfAllTones = [ringtoneArrays, texttoneArrays];
/* * * * * Upper Header Buttons * * * * */
var recommendedButton; var filmsButton; var songsButton; var memesButton; var popularButton; // All of the Header Buttons
var headButtons = [filmsButton, songsButton, memesButton]; // Which buttons align with @ringtoneCategories
var currentButton = filmsButton; // Which Button was most recently pressed.
/* * * Ringtone and Texttione Housing * * */
var ringtoneDiv; var texttoneDiv;
/* * * * * The Query to be Called * * * * */
var newQuery; // The Next Query to be Called on Page Scroll
var lastDocument; // The Last Document in the Most Recent Query
/* * * * * * * Popup Objects * * * * * * */
var popup; // The popup object
var closer; // The Close Button
var downloadButton; // Download Button
/* * * * Ringtone & Texttone Header * * * */
var ringtoneLabel; // Ringtone Label
var texttoneLabel; // Texttone Label
var verticalLine;  // The Veritcal Line that Splits Ringtones & Texttones

/* * * * * * * * * * * * * * * * 
        Window.onload
* * * * * * * * * * * * * * * */

/*

Set up buttons onclicks
Sets up firebase storage and data
Get Data ✔
  convert objects to Tone ✔
  store array of tone objects ✔
Sort the Data (by popularity) ✔
Randomize ✔
Create Buttons (Assign Id = ringtone name)
  Get Covers
  Get Ringtones
Align buttons w/ Objects
2, 1, 3 - 2, 1, 3
Split Ringtones and Texttones
Add them into divs

*/

// Array of Booleans for Each Category, if they have clicked the button set to true, default is false (except for Recommended)

// Whenever the site fully loads
window.onload = function() {
  createHTML(); // Creating the Buttons
  setOnclicks(); // Setting up OnClicks
  generateReferences(); // Setting References
  getData(20, [allCategories[1]], allCategories[1]);
}

/* * * * * * * * * * * * * * * * 
     Immediate Function
* * * * * * * * * * * * * * * */

// Getting Objects from HTML
function createHTML() {
  // Header Objects
  ringtoneDiv = document.querySelector('.inner_ringtone_housing');
  texttoneDiv = document.querySelector('.inner_texttone_housing');
  headButtons[0] = document.getElementById('recommended_button');
  headButtons[1] = document.getElementById('films_button');
  headButtons[2] = document.getElementById('songs_button');
  headButtons[3] = document.getElementById('popular_button');
  headButtons[4] = document.getElementById('memes_button');
  recommendedButton = document.getElementById('recommended_button');
  popularButton = document.getElementById('popular_button');
  // Vertical Line Height
  verticalLine = document.getElementsByClassName('centerLine')[0];
  verticalLine.style.height = innerHeight - 190 + "px";
  // Moves Labels to Correct Location
  ringtoneLabel = document.getElementsByClassName('ringtoneWordsDiv')[0];
  texttoneLabel = document.getElementsByClassName('texttoneWordsDiv')[0];
  moveLabels();
  // Popup Objects
  popup = document.getElementById("popup");
}

// Setting up Onclicks
function setOnclicks() {
  for(let i = 0; i < headButtons.length; i++) {
    headButtons[i].addEventListener('click', () => onClickNum(i));
  }
}

// Setting Firebase and Pre Data Retrieval Variables
function generateReferences() {
  reference = storage.ref(); // For the Album Cover and Ringtone Storage
  currentReference = firestore.collection(ringtoneCategories[0]); // For the Information Database
  currentCategory = ringtoneCategories[0];
}

// Adds in Already Loaded Objects if Present
function loadPreviousObjects(category) {
  ringtoneDiv.innerHTML = ''; texttoneDiv.innerHTML = '';
  let ringtones = ringtoneButtonArrays[findSectionFromCategory(category)]; let texttones = texttoneButtonArrays[findSectionFromCategory(category)]
  for (let i = 0; i < ringtones.length; i++) {
    ringtoneDiv.appendChild(ringtones[i]);
  }
  for(let i = 0; i < texttones.length; i++) {
     texttoneDiv.appendChild(texttones[i]);
  }
}

// Gets Data from firebase
function getData(limit, categories, secondary) { //returns array with the data
  ringtoneDiv.innerHTML = ''; texttoneDiv.innerHTML = '';
  categories.forEach((category) => { // For every category
    currentReference = firestore.collection(category) // Setting the new reference
    currentReference.orderBy("Downloads", "desc").startAt(10000).limit(limit).get().then((query) => {
      query.forEach((doc) => { // For Each Document of Data Obtained
        placeDataObjects(convertToTone(doc.data(), category), secondary); // Array Placement
      }); placeDataObjects(null, secondary);
    });
  }); 
}

// Gets Recommended Objects from Firebase
function getRecommendedData(limit, categories, secondary) { //returns array with the data
  categories.forEach((category) => { // For every category
    currentReference = firestore.collection(category) // Setting the new reference
    currentReference.where("Recommended", "!=", "").orderBy("Recommended", "desc").limit(limit).get().then((query) => {
      query.forEach((doc) => { // For Each Document of Data Obtained
        placeDataObjects(convertToTone(doc.data(), category), secondary); // Send them to be placed in arrays
      }); placeDataObjects(null, secondary);
    });
  });
}

/* * * * * * * * * * * * * * * * 
     Secondary Functions
* * * * * * * * * * * * * * * */

// Places Data Objects in Arrays
function placeDataObjects(data, realCategory) {
  if (data == null) {
    console.log("@placeDataObjects() complete");
    randomizeTones(tonesArrays[findSectionFromCategory(realCategory)], realCategory); // Send them to be sorted
    return;
  }; tonesArrays[findSectionFromCategory(realCategory)].push(data); // Add Data object to array
}

// Randomizes the Ringtones
function randomizeTones(tones, realCategory) {
  console.log("@randomizeTones()");
  if (realCategory == allCategories[3] || realCategory == allCategories[0]) { // If Popular or Recommended
    createRingtoneButtons(smartRandomize(tones), realCategory) // Do a smart sort
  } else { // If not Popular
    createRingtoneButtons(regularRandomize(tones), realCategory) // Do the regular sort
  }
}

// Creates Ringtone Buttons from an Array of Tones Objects
function createRingtoneButtons(tonesArray, category) {
  console.log("@createRingtoneButtons()");
  tonesArray.forEach((toneObject) => {
    var ringtoneObject = new Image(getBoxSize(), getBoxSize()) // Creating the Image
    reference.child('Album Covers/' + toneObject.category + '/' + toneObject.cover).getDownloadURL().then((url) => { // Getting Album Cover

      // Aesthetics & Margin
      setValues(ringtoneObject); // Setting Border and Margins
      ringtoneObject.src = url; // Setting the Image
      ringtoneObject.id = toneObject.name; // Giving Unique ID
    
      // Getting the Ringtone
      reference.child('Ringtones/' + toneObject.category + '/' + toneObject.name + ".m4r").getDownloadURL().then((toneURL) => { // Getting Audio File

        // Audio & OnClick
        let tone = new Audio(toneURL); // Creating Audio Object
        ringtoneObject.addEventListener('click', function() {
          popup.style.display = "block"; openPopup(toneObject, popup, url, tone, toneURL, category) // On Image Click
        }); addButtonToArray(ringtoneObject, tonesArray, category); // Adds Button to Array of Buttons
    
        // Error Handling (We need to add Something Here Later)
        }).catch((error) => { console.log("An Error Occured: " + error) });
      }).catch((error) => { console.log("An Error Occured: " + error) });
  }); 
}

// Adds Button (input) to Array of Buttons
function addButtonToArray(button, toneObjects, category) {
  ringtoneButtonArrays[findSectionFromCategory(category)].push(button);
  if (ringtoneButtonArrays[findSectionFromCategory(category)].length >= toneObjects.length) {
    console.log("@addButtonToArray() complete")
    linkButtonsToObjects(ringtoneButtonArrays[findSectionFromCategory(category)], toneObjects, category)
    return;
  }
}

// Sorts Array of Buttons to align w/ Array of Tone Data Sets
function linkButtonsToObjects(buttons, toneObjects, category) {
  console.log("@linkButtonsToObjects()")
  var finalButtons = [];
  for(let i = 0; i < toneObjects.length; i++) {
    for(let j = 0; j < buttons.length; j++) {
      if(toneObjects[i].name == buttons[j].id) {
        finalButtons.push(buttons[j]); break;
      } } };
  ringtoneButtonArrays[findSectionFromCategory(category)] = finalButtons;
  splitRingtones(finalButtons, toneObjects, category)
}

// Splits Into Arrays of Ringtones & Texttones
function splitRingtones(buttons, toneObjects, category) {
  console.log("@splitRingtones()")
  ringtoneButtonArrays[findSectionFromCategory(category)] = [];
  for (let i = 0; i < toneObjects.length; i++) {
    if(isRingTone(toneObjects[i])) {
      ringtoneButtonArrays[findSectionFromCategory(category)].push(buttons[i])
      ringtoneArrays[findSectionFromCategory(category)].push(toneObjects[i])
    } else {
      texttoneButtonArrays[findSectionFromCategory(category)].push(buttons[i])
      texttoneArrays[findSectionFromCategory(category)].push(toneObjects[i])
    }
  }; console.log(arrayOfAllTones); console.log(arrayOfAllToneButtons); addButtonsToDiv(category)
}

// Adds all buttons to Div in Correct Order
function addButtonsToDiv(category) {
  console.log("@addButtonsToDiv()")
  let ringtones = ringtoneButtonArrays[findSectionFromCategory(category)]; let texttones = texttoneButtonArrays[findSectionFromCategory(category)]
  for (let i = 0; i < ringtones.length; i++) {
    ringtoneDiv.appendChild(ringtones[i]);
  }
  for(let i = 0; i < texttones.length; i++){
     texttoneDiv.appendChild(texttones[i]);
  }; console.log("Sequence Complete \n"); changeSpacing();
}

/* * * * * * * * * * * * * * * * 
     Tertiary Functions
* * * * * * * * * * * * * * * */

// Checks if a Tone is a Ringtone (longer than 8 seconds)
function isRingTone(tone) { return tone.length > 8 }

// The Smart Array Sort (Splits Objects into []s of 4, then randomizes [] objects)
function smartRandomize(tones) {
  var toneArraysForRecombining = []; // holds arrays of 4 or 5
  for(let i = 0; i<tones.length/4; i++) { toneArraysForRecombining.push(new Array()) } // Set Amount of Arrays Necessary
  for(let i = 0; i < tones.length; i++) { // For Each Tone Object
    toneArraysForRecombining[Math.floor(i/4)][i%4] = tones[i]; // Add Tone to Array, Add Array to 2d Array
    if(i % 4 == 3 || i == tones.length) { regularRandomize(toneArraysForRecombining[Math.floor(i/4)]) }
  }; 
  var finalArray = []; for(let i = 0; i < toneArraysForRecombining.length; i++) { // Randomize The Objects within Each Array
    for(let j = 0; j < toneArraysForRecombining[i].length; j++){
      finalArray.push(toneArraysForRecombining[i][j]);
    }
  }; return finalArray;
}

// The Regular Array Sort
function regularRandomize(tones) {
  let ringtones = tones.sort( () => Math.random() - 0.5); tones.sort( () => Math.random() - 0.5); // Regular Randomize
  return ringtones;
}

// Sort Helper Function
function swap(items, leftIndex, rightIndex) {
  var temp = items[leftIndex]; items[leftIndex] = items[rightIndex]; items[rightIndex] = temp;
}

function partition(items, left, right) {
  var pivot = items[Math.floor((right + left) / 2)].downloads, /*middle element*/ i = left, /*left pointer*/ j = right; /*right pointer*/
  while (i <= j) { 
    while (items[i].Downloads < pivot) { i++; }
    while (items[j].Downloads > pivot) { j--; }
    if (i <= j) { swap(items, i, j); i++; j--; }
  }; return i;
}

function quickSort(items, left, right) {
  var index; if (items.length > 1) {
    index = partition(items, left, right); //index returned from partition
    if (left < index - 1) { quickSort(items, left, index - 1) } // more elements on the left side of the pivot
    if (index < right) { quickSort(items, index, right) }; // more elements on the right side of the pivot
  }; return items;
}

// Converts Firestore Object to a new Tone() Object
function convertToTone(data, category) {
  return new Tone(data.Album, data.Artist, data.Cover, data.Downloads, data.Length, data.Name, data.Songs, data.Studio, data.Youtube, category, data.Recommended)
}

// Tone Class
let Tone = class {
  constructor(album, artist, cover, downloads, length, name, songs, studio, youtube, category, recommended) {
    this.album = album; this.artist = artist; this.cover = cover; this.downloads = downloads; this.length = length; this.name = name; this.songs = songs; this.studio = studio; this.youtube = youtube; this.category = category; this.recommended = recommended; 
  }
}

// Takes in a category, finds it in all of the categories, returns ringtoneArray
function findSectionFromCategory(category) {
  for (var i = 0; i < allCategories.length; i++) {
    if(allCategories[i] == category) { return i }
  }; return -1;
}

// Function for calling a new query once scrolled far enough (for later)
function callNewQuery() {
  /*
    lastDocument = query.docs[query.docs.length - 1] // Setting the last obtained document
    newQuery = currentReference.orderBy("Downloads").startAfter(lastDocument).limit(10) // Setting the Next Query to be called
  */
  newQuery.get().then((query) => { // Obtaining objects from the newest query
    query.forEach((doc) => { // For Each Doc
      createRingtoneObject(doc.data()) // Create a ringtone object
    })
    newQuery = currentReference.orderBy("Name").startAfter(lastDocument).limit(10) // Create the Next Query
  })
}

/* * * * * * * * * * * * * * * * 
    Primary HTML Functions
* * * * * * * * * * * * * * * */

// Onclicks for every button
function onClickNum(categoryNum) {
  console.log(allCategories[categoryNum] + " Button Clicked")
  if (categoryNum == 3) { // If Popular
    if (visitedPages[categoryNum]) { loadPreviousObjects('Popular') }
    else { getData(1, ["Films", "Songs", "Memes"], allCategories[3]); visitedPages[categoryNum] = true; }
  } else if (categoryNum == 0) { // If Recommended
    if (visitedPages[categoryNum]) { loadPreviousObjects('Recommended') }
    else { getRecommendedData(3, ["Films", "Songs", "Memes"], allCategories[0]); visitedPages[categoryNum] = true; }
  } else { // If Films, Songs, Memes
    if (visitedPages[categoryNum]) { loadPreviousObjects(allCategories[categoryNum]) }
    else { getData(2, [allCategories[categoryNum]], allCategories[categoryNum]); visitedPages[categoryNum] = true; }
  }
}

// When the Window Changes Size
window.onresize = function() {
  moveLabels(); // Moves the Ringtone and Texttone Labels
  changeSpacing();
}

// Moves the Ringtone and Texttone Labels
function moveLabels() {
  ringtoneLabel.style.marginLeft = (ringtoneDiv.clientWidth - (ringtoneLabel.clientWidth)) / 2 + "px";
  texttoneLabel.style.marginLeft = (innerWidth * 0.65) + (texttoneDiv.clientWidth - (texttoneLabel.clientWidth)) / 2 - 25 + "px";
  verticalLine.style.height = innerHeight - 150 - 16.5 - 25 + "px"
}

// Changes the Margins of Every Ringtone & Texttone Object
function changeSpacing() { 
  // Changing Ringtone Values
  var ringtoneGridTemplateStyle = "auto"; for (var i = 0; i < getObjectCount() - 1; i++) { ringtoneGridTemplateStyle += " auto" }
  ringtoneDiv.style.gridTemplateColumns = ringtoneGridTemplateStyle;
  const ringtoneElements = ringtoneDiv.getElementsByTagName('*');
  for (var i = 0; i < ringtoneElements.length; i++) {
    ringtoneElements[i].style.width = getBoxSize() + "px"; ringtoneElements[i].style.height = getBoxSize() + "px";
  }

  // Changing Texttone Values
  var texttoneGridTemplateStyle = "auto"; for (var i = 0; i < getTexttoneCount() - 1; i++) { texttoneGridTemplateStyle += " auto" }
  texttoneDiv.style.gridTemplateColumns = texttoneGridTemplateStyle;
  const texttoneElements = texttoneDiv.getElementsByTagName('*');
  for (var i = 0; i < texttoneElements.length; i++) {
    texttoneElements[i].style.width = getBoxSize() + "px"; texttoneElements[i].style.height = getBoxSize() + "px";
  }
}

/* * * * * * * * * * * * * * * * 
   Secondary HTML Functions
* * * * * * * * * * * * * * * */

// Gets the ringtone button size based on screen width
function getBoxSize() {
  if (innerWidth > 1440 && innerWidth < 2000) { return 160 }
  else if (innerWidth >= 2000) { return 180 } 
  else if (innerWidth <= 575 && innerWidth > 500) { return 130 } 
  else if (innerWidth <= 500 && innerWidth > 450) { return 115 } 
  else if (innerWidth <= 450 && innerWidth > 400) { return 100 } 
  else if (innerWidth <= 400 && innerWidth > 350) { return 80 } 
  else if (innerWidth <= 350 && innerWidth > 300) { return 60 } 
  else { return 150 }
}

// Get the amount of ringtone buttons per row based on screen size
function getObjectCount() {
  if (innerWidth >= 1150 && innerWidth <= 1520) { return 4 } 
  else if (innerWidth > 1520) { return 5 } 
  else if (innerWidth >= 850 && innerWidth <= 1149) { return 3 } 
  else if (innerWidth < 850) { return 2 }
}

// Get the amount of texttone buttons per row based on screen size
function getTexttoneCount() {
  if (innerWidth >= 2000) { return 3 } 
  else if (innerWidth >= 1070 && innerWidth < 2000) { return 2 } 
  else {  return 1 }
}

// Sets size and margin for ringtone buttons
function setValues(object) {
  object.style.borderRadius = "6px"; // Setting button curvature
  object.style.margin = "15px"; // Setting Margin
  object.style.border = "2px solid black";
}

/* * * * * * * * * * * * * * * * 
            Other
* * * * * * * * * * * * * * * */

// Rounds Number Up to Nearest 10
function roundUpTo10(num) {
  return Math.ceil(num / 10) * 10;
}