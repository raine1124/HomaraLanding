// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {

        document.body.style.fontFamily = 'Procino, sans-serif';
    // Create and start loading animation
    const loadingAnimation = new LoadingAnimation();
    loadingAnimation.init();
    
    // Set callback for when loading animation completes
    loadingAnimation.setOnComplete(function() {
        // Show main content
        document.getElementById('main-content').style.display = 'block';
        
        // Initialize background stars
        createBackgroundStars();
        
        // Set up form submission handler
        initializeFormHandler();
    });
    
    // Simulate loading progress (in a real app, this would be based on actual loading progress)
    simulateLoading(loadingAnimation);
});

// Simulate loading process
function simulateLoading(loadingAnimation) {
    // Simulate a loading process over 3 seconds
    let progress = 0;
    const interval = setInterval(function() {
        progress += 1;
        if (progress <= 100) {
            loadingAnimation.updateProgress(progress);
        } else {
            clearInterval(interval);
        }
    }, 30); // Approximately 3 seconds total
}

// Create background stars effect
function createBackgroundStars() {
    const starsContainer = document.body;
    const starCount = 200;
    
    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        
        // Random size
        const size = Math.random() * 2;
        
        // Apply styles
        star.style.left = `${x}px`;
        star.style.top = `${y}px`;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.7;
        
        starsContainer.appendChild(star);
    }
}

// Initialize form submission handling
function initializeFormHandler() {
    const form = document.getElementById('email-form');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const submissionMessage = document.getElementById('submission-message');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get the email value
        const email = emailInput.value.trim();
        
        if (!email) {
            return;
        }
        
        // Disable the button during submission
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            // Submit to Formspree
            await submitToFormspree(email, form);
            
            // Clear the input
            emailInput.value = '';
            
            // Show success message
            submissionMessage.textContent = 'Submitted! Thanks!';
            submissionMessage.className = 'show';
            
            // Reset the message after 3 seconds
            setTimeout(function() {
                submissionMessage.className = '';
            }, 3000);
        } catch (error) {
            // Show error message
            submissionMessage.textContent = 'Error submitting. Please try again.';
            submissionMessage.className = 'show';
            submissionMessage.style.color = '#FF5252';
            
            // Reset the message after 3 seconds
            setTimeout(function() {
                submissionMessage.className = '';
            }, 3000);
            
            console.error('Error submitting email:', error);
        } finally {
            // Re-enable the button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    });
}

// Function to submit email to Formspree
async function submitToFormspree(email, form) {
    // Replace with your Formspree form ID
    const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xgvavkwq'; // Replace with your form ID
    
    const formData = new FormData();
    formData.append('email', email);
    formData.append('submitDate', new Date().toISOString());
    
    const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Failed to submit to Formspree');
    }
    
    return await response.json();
}