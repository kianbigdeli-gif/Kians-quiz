// Quiz frågor
const questions = [
    {
        question: "Which Devil Fruit did Monkey D. Luffy eat as a child?",
        image: "luffy-devil-fruit.png",
        answers: [
            { text: "Mera Mera no Mi", correct: false },
            { text: "Gomu Gomu no Mi", correct: false },
            { text: "Ope Ope no Mi", correct: false },
            { text: "Hito Hito no mi: model nika", correct: true }
        ]
    },
    {
        question: "When did Luffy use Conqueror's Haki for the very first time?",
        image: "qonq-haki.png",
        answers: [
            { text: "Sabaody Archipelago", correct: true },
            { text: "Marineford", correct: false },
            { text: "Amazon Lily", correct: false },
            { text: "Fish-Man Island", correct: false }
        ]
    },
    {
        question: "Who is Luffy's father?",
        image: "luffy-father.png",
        answers: [
            { text: "Monkey D. Garp", correct: false },
            { text: "Gol D. Roger", correct: false },
            { text: "Monkey D. Dragon", correct: true },
            { text: "Shanks", correct: false }
        ]
    },
    {
        question: "What are the names of Luffy's brothers?",
        image: "Brothers.png",
        answers: [
            { text: "Zoro and Sanji", correct: false },
            { text: "Law and Kid", correct: false },
            { text: "Ace and Marco", correct: false },
            { text: "Ace and Sabo", correct: true }
        ]
    },
    {
        question: "What is the name of the island where Luffy grew up?",
        image: "map.png",
        answers: [
            { text: "Drum Island", correct: false },
            { text: "Dawn Island", correct: true },
            { text: "Water 7", correct: false },
            { text: "Sabaody Archipelago", correct: false }
        ]
    }
];

// Hämta HTML-elementen
const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const endScreen = document.getElementById("end-screen");

const playerNameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");
const clearMsg = document.getElementById("clear-msg");
const startBtn = document.getElementById("start-btn");
const clearLeaderboardBtn = document.getElementById("clear-leaderboard-btn");

const questionCounter = document.getElementById("question-counter");
const scoreDisplay = document.getElementById("score-display");
const questionImage = document.getElementById("question-image");
const questionText = document.getElementById("question-text");
const answerButtons = document.getElementById("answer-buttons");

const feedbackContainer = document.getElementById("feedback-container");
const feedbackText = document.getElementById("feedback-text");
const nextBtn = document.getElementById("next-btn");

const finalScoreText = document.getElementById("final-score-text");
const leaderboardList = document.getElementById("leaderboard-list");
const restartBtn = document.getElementById("restart-btn");

// Spelvariabler
let currentPlayer = "";
let currentQuestionIndex = 0;
let score = 0;

// Händelselyssnare
startBtn.addEventListener("click", startQuiz);

clearLeaderboardBtn.addEventListener("click", () => {
    localStorage.removeItem("onePieceLeaderboard");
    clearMsg.classList.remove("hidden");
    setTimeout(() => {
        clearMsg.classList.add("hidden");
    }, 3000);
});

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion();
    } else {
        endQuiz();
    }
});

restartBtn.addEventListener("click", resetToStart);

// Starta spelet
function startQuiz() {
    const name = playerNameInput.value.trim();
    if (name === "") {
        nameError.classList.remove("hidden");
        return;
    }
    
    nameError.classList.add("hidden");
    clearMsg.classList.add("hidden");
    currentPlayer = name;
    currentQuestionIndex = 0;
    score = 0;
    
    startScreen.classList.add("hidden");
    endScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    
    showQuestion();
}

// Visa en fråga
function showQuestion() {
    resetState();
    const currentQuestion = questions[currentQuestionIndex];
    
    // Uppdatera sidhuvudet
    questionCounter.innerText = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
    scoreDisplay.innerText = `Score: ${score}`;
    
    // Ställ in bild och text
    questionImage.src = currentQuestion.image;
    questionText.innerText = currentQuestion.question;
    
    // Skapa de 4 svarsknapparna
    currentQuestion.answers.forEach(answer => {
        const button = document.createElement("button");
        button.innerText = answer.text;
        button.classList.add("btn");
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener("click", selectAnswer);
        answerButtons.appendChild(button);
    });
}

// Återställ inför en ny fråga
function resetState() {
    feedbackContainer.classList.add("hidden");
    while (answerButtons.firstChild) {
        answerButtons.removeChild(answerButtons.firstChild);
    }
}

// När spelaren klickar på ett svar
function selectAnswer(e) {
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === "true";
    
    if (isCorrect) {
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
        feedbackText.innerText = "✅ Correct answer! Great job!";
        feedbackText.style.color = "#2a9d8f";
    } else {
        feedbackText.innerText = "❌ Wrong answer!";
        feedbackText.style.color = "#d62828";
    }
    
    // Markera rätt och fel knappar och inaktivera dem
    Array.from(answerButtons.children).forEach(button => {
        if (button.dataset.correct === "true") {
            button.classList.add("correct");
        } else if (button === selectedBtn && !isCorrect) {
            button.classList.add("wrong");
        }
        button.disabled = true;
    });
    
    feedbackContainer.classList.remove("hidden");
}

// Avsluta quizet och spara till topplistan
function endQuiz() {
    quizScreen.classList.add("hidden");
    endScreen.classList.remove("hidden");
    
    finalScoreText.innerText = `Well played, ${currentPlayer}! You scored ${score} out of ${questions.length} points.`;
    
    saveScore(currentPlayer, score);
    displayLeaderboard();
}

// Spara poäng i webbläsarens localStorage
function saveScore(name, playerScore) {
    const leaderboard = JSON.parse(localStorage.getItem("onePieceLeaderboard")) || [];
    leaderboard.push({ name: name, score: playerScore });
    leaderboard.sort((a, b) => b.score - a.score);
    localStorage.setItem("onePieceLeaderboard", JSON.stringify(leaderboard));
}

// Visa topplistan i HTML
function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("onePieceLeaderboard")) || [];
    leaderboardList.innerHTML = "";
    
    leaderboard.forEach(entry => {
        const li = document.createElement("li");
        li.innerText = `${entry.name} – ${entry.score} / ${questions.length} points`;
        leaderboardList.appendChild(li);
    });
}

// Börja om från början med ett nytt namn
function resetToStart() {
    playerNameInput.value = "";
    endScreen.classList.add("hidden");
    startScreen.classList.remove("hidden");
}