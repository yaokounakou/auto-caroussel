let files;
const dataPath = "../data/files.json";

// DOM elements
const selectOptionsDiv = document.getElementById("index-select-options");
const selectOptions = document.getElementById("select-options");

const carouselSlidesDiv = document.getElementById("carousel-wrapper");
// carouselSlidesDiv.style.display = "none";

const timeDiv = document.getElementById("time-container");
timeDiv.style.display = "none";
const time = document.getElementById("time");

// Generate the select options
const generateSelectOptions = (files) => {
  files.map((_, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.text = `Index ${index + 1}`;
    selectOptions.appendChild(option);
  });
};

// Reoder the array from the selected index
const reorderArrayFromIndex = (array, index) => {
  if (index >= array.length) {
    return array;
  }
  const elementsToMove = array.splice(index); // Remove elements from index onwards
  array.unshift(...elementsToMove); // Insert elements at the beginning
  return array;
};

// Get current time
const getCurrentTime = () => {
  const date = new Date();
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hours < 10) hours = `0${hours}`;
  if (minutes < 10) minutes = `0${minutes}`;
  if (seconds < 10) seconds = `0${seconds}`;

  // Display the time
  time.innerText = `${hours}:${minutes}:${seconds}`;

  // Return the seconds if it's 0 or 30
  if (parseInt(seconds) === 0 || parseInt(seconds) === 30) {
    return parseInt(seconds);
  }
};

// Generate the slideshow
const generateSlides = async (files) => {
  files.map((file, index) => {
    if (file.type === "image") {
      const image = document.createElement("img");
      image.src = `../${file.url}`;
      image.classList.add("hide");
      carouselSlidesDiv.appendChild(image);
    } else if (file.type === "video") {
      const video = document.createElement("video");
      video.src = `../${file.url}`;
      video.autoplay = true;
      video.classList.add("hide");
      carouselSlidesDiv.appendChild(video);
    }
  });

  setInterval(() => {
    const value = getCurrentTime();
    timeDiv.style.display = "flex";

    if (value === 0 || value === 30) {
      // timeDiv.style.display = "none";
      let slideIndex = 0;

      const showSlides = () => {
        // Get all the elements in the carousel
        const divClassName = "carousel-wrapper";
        const files = document.querySelectorAll(
          `.${divClassName} img, .${divClassName} video`
        );

        // Display the current file
        files[slideIndex].classList.replace("hide", "show");
        files[slideIndex].style.zIndex = 1;

        slideIndex++;

        console.log("slideIndex", slideIndex);

        if (slideIndex >= files.length) {
          slideIndex = 0;

          // Hide all the files except the two last ones
          files.forEach((element, index) => {
            if (index < files.length - 1) {
              element.classList.replace("show", "hide");
            }
          });

          // Display the last file before looping
          files[files.length - 1].classList.replace("hide", "show");
          files[files.length - 1].style.zIndex = 0;
        }

        setTimeout(showSlides, 30000);
      };

      showSlides();
    }
  }, 1000);
};

fetch(dataPath)
  .then((response) => response.json())
  .then((data) => {
    files = data;

    generateSelectOptions(files);

    // Get the selected option
    selectOptions.addEventListener("change", async (e) => {
      const beginAt = e.target.value;

      if (!beginAt) return;
      selectOptionsDiv.style.display = "none";
      carouselSlidesDiv.style.display = "flex";

      const slides = reorderArrayFromIndex(files, beginAt);
      console.log(slides);

      // Generate the slides
      generateSlides(slides);
    });
  })
  .catch((error) => {
    console.error("Error reading JSON file:", error);
  });
