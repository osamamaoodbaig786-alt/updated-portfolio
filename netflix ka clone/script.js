// MODAL VIDEO PLAYBACK LOGIC
const modal = document.getElementById("videoModal");
const trailerFrame = document.getElementById("trailerFrame");

// Stranger Things YouTube Trailer Link
const trailerUrl = "https://www.youtube.com/embed/b9EkMc79ZSU?autoplay=1";

function playTrailer() {
  modal.style.display = "block";
  trailerFrame.src = trailerUrl;
}

function closeTrailer() {
  modal.style.display = "none";
  trailerFrame.src = ""; // Stop audio playback
}

window.onclick = function(event) {
  if (event.target == modal) {
    closeTrailer();
  }
};

// FAQ ACCORDION TOGGLE LOGIC
const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach(header => {
  header.addEventListener("click", () => {
    const accordionItem = header.parentElement;
    
    // Active class toggle karne ke liye
    accordionItem.classList.toggle("active");
  });
});