document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Simple carousel for success stories
    const stories = document.querySelectorAll('.story');
    let currentStory = 0;

    function showNextStory() {
        stories[currentStory].style.display = 'none';
        currentStory = (currentStory + 1) % stories.length;
        stories[currentStory].style.display = 'block';
    }

    setInterval(showNextStory, 5000); // Change story every 5 seconds

    // Form submission (you can add this when you implement the backend)
    const signupForm = document.querySelector('#signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', function (e) {
            e.preventDefault();
            // Add form submission logic here
            console.log('Form submitted');
        });
    }
});