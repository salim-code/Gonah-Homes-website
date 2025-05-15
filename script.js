// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyABTVp797tNu353FBVLzsOp90aIX2mNF74",
  authDomain: "my-website-project2797.firebaseapp.com",
  projectId: "my-website-project2797",
  storageBucket: "my-website-project2797.firebasestorage.app",
  messagingSenderId: "406226552922",
  appId: "1:406226552922:web:ffdf2ccf6f77a57964b063"
};

// Variables for Firebase
let db;

// Variable to track if Firebase is already initialized
let firebaseInitialized = false;

// Initialize Firebase App
document.addEventListener("DOMContentLoaded", function() {
  // Always initialize menu toggle first for better responsiveness
  initMenuToggle();

  // Only initialize Firebase if it's needed on this page
  if (document.getElementById("review-form") || document.getElementById("reviews-list")) {
    // Lazy load Firebase only when needed
    const loadFirebase = async () => {
      try {
        // Check if Firebase is already initialized
        if (!firebaseInitialized && typeof firebase !== 'undefined') {
          firebase.initializeApp(firebaseConfig);
          db = firebase.firestore();
          firebaseInitialized = true;
          console.log("Firebase initialized successfully");

          // Initialize the review form handler after Firebase is loaded
          initReviewForm();
        }
      } catch (error) {
        console.error("Firebase initialization error:", error);
      }
    };

    loadFirebase();
  }
});

// Toggle the sidebar menu
function toggleMenu() {
    var menu = document.getElementById("sideMenu");
    if (!menu) return; // Exit if menu doesn't exist

    var content = document.querySelector(".content");

    // Toggle menu
    if (menu.style.width === "250px") {
        menu.style.width = "0";
        if (content) content.style.marginLeft = "0";  // Reset content margin when menu is closed
    } else {
        menu.style.width = "250px";  // Open menu
        if (content) content.style.marginLeft = "250px";  // Push content to the right
    }
}

// For backward compatibility with pages using toggleNav
function toggleNav() {
    toggleMenu();
}

// Function to add review to Firestore
function addReview(reviewText, rating) {
    if (!db) {
        console.error("Firebase not initialized");
        return;
    }

    db.collection("reviews").add({
        review: reviewText,
        rating: rating || 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
        console.log("Review added!");
        alert("Your review has been submitted successfully.");
    })
    .catch((error) => {
        console.error("Error adding review: ", error);
    });
}

// Function to initialize the review form handler
function initReviewForm() {
    const reviewForm = document.getElementById("review-form");
    if (reviewForm) {
        reviewForm.addEventListener("submit", function(e) {
            e.preventDefault();

            const reviewText = document.getElementById("review-text").value;
            const rating = document.querySelector('input[name="rating"]:checked')?.value || 0;

            if (reviewText) {
                addReview(reviewText, rating);
                document.getElementById("review-text").value = ''; // Clear the input

                // Uncheck all rating stars
                const ratingInputs = document.querySelectorAll('input[name="rating"]');
                ratingInputs.forEach(input => input.checked = false);
            } else {
                alert("Please write a review before submitting.");
            }
        });
    }
}

// Function to initialize menu toggle and scroll behavior
function initMenuToggle() {
    const menuToggle = document.getElementById("menuToggle");
    const menuBtn = document.querySelector(".menu-btn");

    if (menuToggle) {
        menuToggle.addEventListener("click", toggleMenu);
    }

    let lastScrollTop = 0;
    window.addEventListener("scroll", function() {
        let currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        if (menuBtn) {
            if (currentScroll > lastScrollTop && currentScroll > 50) {
                // Scrolling down
                menuBtn.style.opacity = "0";
            } else {
                // Scrolling up
                menuBtn.style.opacity = "1";
            }
        }
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
}

// Function to toggle blog content
function toggleContent(button) {
    const article = button.closest('.blog-post');
    const preview = article.querySelector('.preview');
    const fullContent = article.querySelector('.full-content');

    if (fullContent.style.display === 'none') {
        preview.style.display = 'none';
        fullContent.style.display = 'block';
        button.textContent = 'Read Less';
    } else {
        preview.style.display = 'block';
        fullContent.style.display = 'none';
        button.textContent = 'Read More';
    }
}