function createI() {
    const AddBox = document.getElementById('addI');
    const fild = document.getElementById('fild');
    AddBox.classList.remove('addIno'); // Remove the 'addIno' class
    AddBox.classList.add('addI'); // Add the 'addI' class
    fild.classList.remove('addIno'); // Remove the 'addIno' class
    fild.classList.add('add');
    // Add click event listener to call destroyI function
    AddBox.addEventListener('click', destroyI);
}

// Define the destroyI function
function destroyI() {
    const AddBox = document.getElementById('addI');
    const fild = document.getElementById('fild');
    AddBox.classList.remove('addI'); // Remove the 'addI' class
    AddBox.classList.add('addIno'); // Add the 'addIno' class
    fild.classList.remove('add');
    fild.classList.add('addIno'); // Add the 'addIno' class
}

function createSet(){
  const SetBox = document.getElementById('SetContiner');
  const fild = document.getElementById('SetSelfPlace');
  SetBox.classList.remove('addIno'); // Remove the 'addIno' class
  SetBox.classList.add('addI'); // Add the 'addI' class
  fild.classList.remove('addIno'); // Remove the 'addIno' class
  fild.classList.add('add');
  // Add click event listener to call destroyI function
  SetBox.addEventListener('click', destroySet);
}
function destroySet(){
  const AddBox = document.getElementById('SetContiner');
  const fild = document.getElementById('SetSelfPlace');
  AddBox.classList.remove('addI'); // Remove the 'addI' class
  AddBox.classList.add('addIno'); // Add the 'addIno' class
  fild.classList.remove('add');
  fild.classList.add('addIno'); // Add the 'addIno' class
}

////
/////
/////
/////
document.addEventListener('DOMContentLoaded', async () => {
  const settings = await window.electronAPI.loadUserSettings();
  const city = settings.UserLocation?.city || 'Unknown City';
  const userSetLocationBySelf = settings.UserSetLocationBySelf || false;
  const cityElement = document.getElementById('city');
  const MainSetSelfLocationBtn = document.getElementById('Mplace');

  MainSetSelfLocationBtn.addEventListener('click', createSet);
  async function loadIntresPoints() {
    try {
      const intresPoints = await window.electronAPI.loadIntresPoints();
      console.log(intresPoints);
  
      if (intresPoints && Array.isArray(intresPoints)) {
        for (const place of intresPoints) {
          addI(place); // Assuming addI is a function that processes each interest point
          console.log(place);
          console.log('Added interest point');
        }
      } else {
        console.log('No interest points');
      }
    } catch (error) {
      console.log('Problem with loading interest points', error);
    }
  }
  loadIntresPoints()
  if (settings.UserSetLocationBySelf = true){

    if (cityElement) {
        cityElement.textContent = `מיקומך הנוכחי הוא ${city}.`;
        cityElement.style.direction = 'ltr'; // Align text to left for city names
    }
  
  } else{
    console.log('fhgargalfg')
  }

  if (!userSetLocationBySelf) {
      // Auto-update code (if needed)
  }

  const setSelfPlaceBtn = document.getElementById('set');
  const inputField = document.getElementById('SetText');
  const setContainer = document.getElementById('SetContiner');
  const innerContainer = document.getElementById('SetSelfPlace');

  if (setSelfPlaceBtn && settings.UserSetLocationBySelf !== false) {
      setSelfPlaceBtn.addEventListener('click', async () => {
          const userCity = inputField.value.trim();

          if (userCity !== '') {
              settings.UserLocation = { city: userCity };
              settings.UserSetLocationBySelf = true;

              await window.electronAPI.saveUserSettings(settings);

              cityElement.textContent = `מיקומך הנוכחי הוא ${userCity}.`;
              console.log('User location updated to:', userCity);
              setContainer.classList.remove('addI'); // Remove the 'addI' class
              setContainer.classList.add('addIno'); // Add the 'addIno' class
              innerContainer.classList.remove('add');
              innerContainer.classList.add('addIno'); // Add the 'addIno' class
          } else {
              inputField.style.borderColor = 'red';
              alert('נא להכניס מיקום חוקי.');
          }
      });
  }

  function createSet() {
      const SetBox = document.getElementById('SetContiner');
      const fild = document.getElementById('SetSelfPlace');
      SetBox.classList.remove('addIno');
      SetBox.classList.add('addI');
      fild.classList.remove('addIno');
      fild.classList.add('add');
      console.log(SetBox);
      SetBox.addEventListener('click',destroySet);
  }

  function destroySet() {
      const AddBox = document.getElementById('SetContiner');
      const fild = document.getElementById('SetSelfPlace');
      AddBox.classList.remove('addI');
      AddBox.classList.add('addIno');
      fild.classList.remove('add');
      fild.classList.add('addIno');
  }
  async function fetchUserLocation() {
    const text = document.getElementById('city');
    if (text){
      try {
        const userLocation = await window.electronAPI.getUserLocation();
        console.log('User location:', userLocation);
        text.textContent = `מיקומך הנוכחי הוא ${userLocation.city}`
        settings.UserSetLocationBySelf = false;
        await window.electronAPI.saveUserSettings(settings)
        console.log('settings' , settings)
        // Do something with the location
      } catch (error) {
        console.error('Failed to retrieve location', error);
        try {
          const userLocation = await window.electronAPI.loadAutoLocation()
          console.log('get data auto location from json ', userLocation)
          text.textContent = `מיקומך הנוכחי הוא ${userLocation.city}`
          settings.UserSetLocationBySelf = false;
          await window.electronAPI.saveUserSettings(settings)
          console.log('settings' , settings)
        } catch (error) {
          console.log('faild to load location from json ' , error)
        }
      }
    } else {
      console.log('didnt faind text' , text)
    }

  }
  
  // Call this function when needed

  
  const AutoLocationBtn = document.getElementById('Aplace');
  AutoLocationBtn.addEventListener('click' , fetchUserLocation);

  const addIBtnMain = document.getElementById('addIbtn')
  addIBtnMain.addEventListener('click' , createI) 
  function createI() {
      const AddBox = document.getElementById('addI');
      const fild = document.getElementById('fild');
      AddBox.classList.remove('addIno'); 
      AddBox.classList.add('addI'); 
      fild.classList.remove('addIno');
      fild.classList.add('add');
      AddBox.addEventListener('click', destroyI);
  }

  function destroyI() {
      const AddBox = document.getElementById('addI');
      const fild = document.getElementById('fild');
      AddBox.classList.remove('addI');
      AddBox.classList.add('addIno');
      fild.classList.remove('add');
      fild.classList.add('addIno');
  }
  const text = document.getElementById('text'); // Ensure this is the correct ID
  const addIBtn = document.getElementById('add'); // Correct the ID for the button

  if (addIBtn) {
    addIBtn.addEventListener('click', () => {
      add(); // Call the add function when the button is clicked
    });
  }
  function add() {
    if (text && text.value.trim() !== '') {
      const place = { name: text.value.trim() };
      window.electronAPI.addInterestPoint(place)
        .then(() => {
          console.log('Added interest point:', place);
          text.value = ''; // Clear the input field after adding
          addI(place);
        })
        .catch(error => console.error('Failed to add interest point:', error));
    } else {
      console.log('Text input is empty.');
    }
  }

  function addI(place) {
    const container = document.getElementById('placeContiner');
    if (!container) {
      console.error('Container element with ID "placeContiner" not found.');
      return;
    }

    // Create the outer div with the class 'Iplace'
    const div = document.createElement('div');
    div.classList.add('Iplace');
    div.dataset.name = place.name;

    // Create the tuchImg div
    const tuchImgDiv = document.createElement('div');
    tuchImgDiv.classList.add('tuchImg');

    // Create the delete image element
    const deleteImg = document.createElement('img');
    deleteImg.src = 'Photo/x.png';
    deleteImg.alt = 'delete place';
    deleteImg.classList.add('delete-img');

    // Append the delete image to the tuchImg div
    tuchImgDiv.appendChild(deleteImg);

    // Create the heading element for the place name
    const placeHeading = document.createElement('h1');
    placeHeading.textContent = place.name;

    // Append the tuchImg div and the heading to the main div
    div.appendChild(tuchImgDiv);
    div.appendChild(placeHeading);

    // Append the new div to the container
    container.appendChild(div);

    // Add click event listener to the delete image
    deleteImg.addEventListener('click', async () => {
      container.removeChild(div); // Remove the item from the container

      // Notify the main process to remove the place from the JSON file
      const placeName = div.dataset.name;
      try {
        await window.electronAPI.removeInterestPoint(placeName);
        console.log('Removed interest point:', placeName);
      } catch (error) {
        console.error('Failed to remove interest point:', error);
      }
    });
  }
});
