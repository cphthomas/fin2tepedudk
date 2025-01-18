// JavaScript (script.js)

let currentQuestion = 0;
let score = 0;
var userAnswers = [];

var questions = Array.from(document.querySelectorAll('.question')).map(questionElement => {
    var question = questionElement.getAttribute('data-question');
    var answer = parseInt(questionElement.getAttribute('data-answer'), 10);
    var explanation = questionElement.getAttribute('data-explanation');
    var imagesquestion = questionElement.getAttribute('data-imagesquestion');
    var imagesanswer = questionElement.getAttribute('data-imagesanswer');
    var options = Array.from(questionElement.querySelectorAll('.option')).map(optionElement => optionElement.getAttribute('data-option'));

    return {
        question, options, answer, explanation, imagesquestion, imagesanswer
    };
});


function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            icon: 'success',
            title: 'Kopieret!',
            text: 'Er nu kopieret til udklipsholderen',
            showConfirmButton: false,
            timer: 1500
        });
    }).catch(err => {
        console.error('Fejl ved kopiering:', err);
    });
}

function initializeProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    progressBar.innerHTML = ''; // Clear existing bullets if any

    questions.forEach(() => {
        const bullet = document.createElement('div');
        bullet.className = 'progress-bullet'; // All bullets start as inactive (grey)
        progressBar.appendChild(bullet);
    });
}

function updateProgressBar() {
    const bullets = document.querySelectorAll('.progress-bullet');
    bullets.forEach((bullet, index) => {
        if (index <= currentQuestion) {
            bullet.classList.add('active');
        } else {
            bullet.classList.remove('active');
        }
    });
}

function showStartCard() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // Clear previous options
    optionsContainer.innerHTML = '';

    // Get the title from the HTML document
    const title = document.title;

    // Create the container for the tooltip in the question element
    questionElement.innerHTML = `<h5>Der er ${questions.length} spørgsmål i denne quiz.
                                   </h5><br>`;
   

    questionElement.innerHTML +=   `
                                   <div class='card3' style="background-color:rgb(73, 103, 170); padding: 15px; color: white; border-radius: 0px;">
                                        <span><i class="fas fa-lightbulb"></i>
 Der er ingen tidsbegrænsning på denne quiz. <br>Du kan tage quizzen igen og igen. <br>Dine data registreres ikke, din besvarelse er således anonym. <br>Husk at læse forklaringen, når du har svaret på spørgsmålene.  </span>
                                   </div><br>`;

    const button = document.createElement('button');
    button.innerHTML = 'Start Quiz';
    button.classList.add('btn', 'btn-primary', 'd-block', 'my-3');

    button.addEventListener('click', function() {
        currentQuestion = 0;
        showQuestion();
    });

    optionsContainer.appendChild(button);
    
     // Attach the event listeners for tooltips
      const infoIcons = document.querySelectorAll('.info-icon');

      infoIcons.forEach(function (icon) {
        const tooltip = icon.querySelector('.tooltip');

        icon.addEventListener('mouseenter', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'block';
            tooltip.style.zIndex = '9999';
        });

        icon.addEventListener('mouseleave', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
        });
    });

    initializeProgressBar();
}

function showQuestion() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');

    // Clear previous options
    optionsContainer.innerHTML = '';

    let questionText = questions[currentQuestion].question;

    questionElement.innerHTML = `Spørgsmål ${currentQuestion + 1} af ${questions.length}<div class='custom-separator'></div>${questionText}<div class='custom-separator'></div>`;

    for (let i = 0; i < questions[currentQuestion].options.length; i++) {
        const button = document.createElement('button');
        button.innerHTML = questions[currentQuestion].options[i];
        button.classList.add('btn', 'btn-primary', 'd-block', 'my-3');

        button.addEventListener('click', function() {
            checkAnswer(i);
        });
        optionsContainer.appendChild(button);
    }
    updateProgressBar();
    MathJax.typesetPromise().then(() => {
        console.log('MathJax has finished typesetting new question.');
    });
}

function checkAnswer(answer) {
    userAnswers[currentQuestion] = questions[currentQuestion].options[answer];
    let message;

    if (answer === questions[currentQuestion].answer) {
        score++;
        message = `<div class="custom-separator2"></div>Spørgsmålet var: ${questions[currentQuestion].question} <div class="custom-separator2"></div>Du har helt korrekt svaret:<br>${questions[currentQuestion].options[questions[currentQuestion].answer]}. <br><br>${questions[currentQuestion].explanation}<br>`;
    } else {
        message = `Spørgsmålet var: ${questions[currentQuestion].question}
        <div class="custom-separator2"></div>Du skulle have svaret:<br>${questions[currentQuestion].options[questions[currentQuestion].answer]}
        . <br><br>${questions[currentQuestion].explanation}
        <br>`;
    }

    let swalIcon = answer === questions[currentQuestion].answer ? 'success' : 'error';

    Swal.fire({
    icon: swalIcon,
    html: `<p style="font-size: 16px;"><b><i><br><div class="custom-separator2"></div><h5> Spørgsmål ${currentQuestion + 1} af ${questions.length}</h5> ${message}</i></b></p>`,
    confirmButtonText: 'Videre',
    allowOutsideClick: false,
    customClass: {
        container: 'final-results-container',
        popup: 'final-results-popup',
        htmlContainer: 'custom-swal-html-container'
    }
    }).then((result) => {
        if (result.isConfirmed) {
            currentQuestion++;
            if (currentQuestion < questions.length) {
                showQuestion();
            } else {
                var questionsAndAnswers = questions.map((question, index) => {
                    return `
                    <div class="question-summary">
                        <p class="question-text"><font size="+1">Spørgsmål ${index + 1}</font><br><br>${question.question}</p>
                        <div class="custom-separator2"></div>
                        <div class="answer-container">
                            <div class="correct-answer" style="background-color: rgb(52, 199, 89); color: white;">
                                <p class="answer-heading"><font size="+1">Korrekt svar:</font></p>
                                <p>${question.options[question.answer]}</p>
                            </div>
                            <div class="explanation">
                                ${question.explanation}
                            </div>
                            <div class="user-answer" style="${userAnswers[index] === question.options[question.answer] ? 'background-color: rgb(52, 199, 89); color: white;' : 'background-color: rgb(255, 59, 48); color: white;'}">
                                <p class="answer-heading"><font size="+1">Dit svar:</font></p>
                                <p>${userAnswers[index]}</p>
                            </div>
                        </div>
                        <div class="custom-separator"></div>
                    </div>`;
                });

                let title;
                const percentage = score / questions.length;

                if (percentage < 0.25) {
                    title = "<h2>Uha uha, det var ikke så godt</h2>";
                } else if (percentage >= 0.25 && percentage < 0.4) {
                    title = "<h2>Æv altså, prøv igen!</h2>";                } else if (percentage >= 0.4 && percentage < 0.5) {
                    title = "<h2>Joooeeeee, måske skulle man forsøge en gang mere?</h2>";
                } else if (percentage >= 0.5 && percentage < 0.6) {
                    title = "<h2>Jooooee, kan det mon blive endnu bedre?</h2>";
                } else if (percentage >= 0.6 && percentage < 0.7) {
                    title = "<h2>Det var vel nogenlunde!</h2>";
                } else if (percentage >= 0.7 && percentage < 0.8) {
                    title = "<h2>Det var da meget godt!</h2>";
                } else if (percentage >= 0.8 && percentage < 0.9) {
                    title = "<h2>Meget overbevisende!</h2>";
                } else if (percentage >= 0.9 && percentage < 0.98) {
                    title = "<h2>Fantastisk</h2>";
                } else {
                    title = "<h2>Superduper !!! du er hjernen, det er worldclass !!!</h2>";
                }

                Swal.fire({
                    title: title,
                    html: `
                        <div class="final-results">
                            <p class="score-summary">
                                <font size="+1">Du havde ${score} korrekte svar ud af ${questions.length} spørgsmål.<br>
                                ${(100 * score / questions.length).toFixed(2)} % af dine svar var korrekte.</font>
                            </p>
                            <div class="custom-separator"></div>
                            ${questionsAndAnswers.join('')}
                           
                        </div>
                    `,
                    confirmButtonText: 'Prøv igen',
                    allowOutsideClick: false,
                    customClass: {
                        container: 'final-results-container',
                        popup: 'final-results-popup',
                        content: 'final-results-content'
                    },
                    didOpen: () => {
                        MathJax.typesetPromise().then(() => {
                            console.log('MathJax has finished typesetting answer explanation.');
                        });
                    }
                    
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            }
        }
    });

    MathJax.typesetPromise().then(() => {
        console.log('MathJax has finished typesetting answer explanation.');
    });
}

// Add event listeners for tooltips and handle preStartContent
document.addEventListener('DOMContentLoaded', function () {
    // Existing tooltip code
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(function (icon) {
        const tooltip = icon.querySelector('.tooltip');

        icon.addEventListener('mouseenter', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'block';
            tooltip.style.zIndex = '9999';
        });

        icon.addEventListener('mouseleave', function (e) {
            e.stopPropagation();
            tooltip.style.display = 'none';
        });
    });

    // Handle both preStartContent and postProgressContent
    const preStartContent = document.getElementById('preStartContent');
    const postProgressContent = document.getElementById('postProgressContent');
    
    if (preStartContent || postProgressContent) {
        document.querySelector('.btn.btn-primary').addEventListener('click', function() {
            if (preStartContent) preStartContent.style.display = 'none';
            if (postProgressContent) postProgressContent.style.display = 'none';
        });
    }
});

showStartCard();