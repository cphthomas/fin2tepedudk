// index.js - For the main quiz selection page

document.addEventListener('DOMContentLoaded', function() {
    // Add click event listeners to all "Start Quiz" buttons
    document.querySelectorAll('.btn-primary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const quizName = this.closest('.card-body').querySelector('.card-title').textContent;
            const quizUrl = this.getAttribute('href');
            if (quizUrl) {
                window.location.href = quizUrl;
            } else {
                console.error('Quiz URL not found');
            }
        });
    });
});