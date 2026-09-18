const gridContainer = document.getElementById('gridContainer');
const movesDisplay = document.getElementById('moves');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const restartBtn = document.getElementById('restartBtn');
const themeSelect = document.getElementById('themeSelect');
const gameModal = document.getElementById('gameModal');
const modalTitle = document.getElementById('modalTitle');
const modalText = document.getElementById('modalText');
const modalIcon = document.getElementById('modalIcon');
const modalBtn = document.getElementById('modalBtn');

const themes = {
    tech: ['🚀', '🚀', '💻', '💻', '⭐', '⭐', '🎧', '🎧', '⚡', '⚡', '🎨', '🎨', '🎮', '🎮', '💡', '💡'],
    animals: ['🐼', '🐼', '🦊', '🦊', '🦁', '🦁', '🐰', '🐰', '🐨', '🐨', '🐯', '🐯', '🐶', '🐶', '🐱', '🐱'],
    food: ['🍕', '🍕', '🍔', '🍔', '🍟', '🍟', '🍣', '🍣', '🍩', '🍩', '🍦', '🍦', '🍿', '🍿', '🌮', '🌮']
};

let flippedCards = [];
let matchedCards = [];
let moves = 0;
const maxMoves = 5;
let score = 0;
let timeLeft = 45;
let timer = null;
let isPlaying = false;
let isLocked = false;

function startGame() {
    gridContainer.innerHTML = '';
    flippedCards = [];
    matchedCards = [];
    moves = 0;
    score = 0;
    timeLeft = 45;
    movesDisplay.innerText = `${moves}`;
    scoreDisplay.innerText = score;
    timerDisplay.innerText = timeLeft;
    isLocked = false;
    isPlaying = false;
    gameModal.classList.remove('show');
    clearInterval(timer);

    let selectedTheme = themes[themeSelect.value];
    let shuffledEmojis = [...selectedTheme].sort(() => Math.random() - 0.5);

    shuffledEmojis.forEach((emoji) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;

        const span = document.createElement('span');
        span.innerText = emoji;
        card.appendChild(span);

        card.addEventListener('click', flipCard);
        gridContainer.appendChild(card);
    });
}

function startTimer() {
    if (isPlaying) return;
    isPlaying = true;
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.innerText = timeLeft;
        } else {
            clearInterval(timer);
            showModal(false);
        }
    }, 1000);
}

function flipCard() {
    if (isLocked) return;
    if (this.classList.contains('flipped') || this.classList.contains('matched')) return;

    if (!isPlaying) {
        startTimer();
    }

    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        moves++;
        movesDisplay.innerText = `${moves}`;
        checkForMatch();
    }
}

function checkForMatch() {
    const isMatch = flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji;

    if (isMatch) {
        matchedCards.push(...flippedCards);
        flippedCards = [];
        score += 10;
        scoreDisplay.innerText = score;

        if (matchedCards.length === themes[themeSelect.value].length) {
            clearInterval(timer);
            showModal(true);
        }
    } else {
        isLocked = true;
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            flippedCards = [];
            isLocked = false;

            if (moves >= maxMoves && matchedCards.length < themes[themeSelect.value].length) {
                clearInterval(timer);
                showModal(false);
            }
        }, 700);
    }
}

function showModal(isWin) {
    if (isWin) {
        modalIcon.className = "fa-solid fa-trophy";
        modalIcon.style.color = "#facc15";
        modalTitle.innerText = "Zabardast! 🎉";
        modalText.innerText = `Aap ne ${score} points hasil kiye aur ${moves} moves mein jeet liya!`;
    } else {
        modalIcon.className = "fa-solid fa-face-frown";
        modalIcon.style.color = "#ef4444";
        modalTitle.innerText = "Game Over! ❌";
        modalText.innerText = `Aap ke 5 moves poore ho gaye hain. Total Points: ${score}`;
    }
    gameModal.classList.add('show');
}

restartBtn.addEventListener('click', startGame);
modalBtn.addEventListener('click', startGame);
themeSelect.addEventListener('change', startGame);

startGame();