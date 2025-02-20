let gameMode = null;
let score = 0;
let timeLeft = 30;
let timer = null;
let flippedCards = [];
let matchedPairs = [];
let cards = [];

const FRUITS = ["🍎", "🍌", "🍇", "🍊", "🍓", "🥝", "🍍", "🥭"];
// const CARD_BACK = "🔒";
const COLORS = [
  "#FF0000",
  "#00FF00",
  "#0000FF",
  "#FFFF00",
  "#FF00FF",
  "#00FFFF",
  "#FFA500",
  "#800080",
];

const SYNTAX = [
  "for()",
  "while()",
  "if{}",
  "else{}",
  "def()",
  "class{}",
  "try{}",
  "catch{}",
];

const modeSelector = document.getElementById("mode-selector");
const gameBoard = document.getElementById("game-board");
const timeLeftElement = document.getElementById("time-left");
const scoreElement = document.getElementById("score");
const gameOverScreen = document.getElementById("game-over");
const gameOverTitle = document.getElementById("game-over-title");
const gameOverMessage = document.getElementById("game-over-message");

function startGame(mode) {
  gameMode = mode;
  score = 0;
  timeLeft = 30;
  flippedCards = [];
  matchedPairs = [];
  updateScore();
  updateTimer();

  cards = generateCards();
  modeSelector.classList.add("hidden");
  gameBoard.classList.remove("hidden");
  gameOverScreen.classList.add("hidden");

  gameBoard.innerHTML = "";
  cards.forEach((card, index) => {
    const cardElement = createCardElement(card, index);
    gameBoard.appendChild(cardElement);
  });

  if (timer) clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    updateTimer();
    if (timeLeft <= 0) {
      endGame();
    }
  }, 1000);
}

function generateCards() {
  let values = [];
  switch (gameMode) {
    case "numbers":
      values = Array.from({ length: 8 }, (_, i) => (i + 1).toString());
      break;
    case "fruits":
      values = FRUITS;
      break;
    case "syntax":
      values = SYNTAX;
      break;
    case "colors":
      values = COLORS;
      break;
  }
  let pairs = [...values, ...values];
  return pairs.sort(() => Math.random() - 0.5);
}

function createCardElement(value, index) {
  const card = document.createElement("div");
  card.className = "card";
  card.dataset.index = index;
  card.setAttribute("onclick", `handleCardClick(this, ${index})`);

  const cardInner = document.createElement("div");
  cardInner.className = "card-inner";
  const cardFront = document.createElement("div");
  cardFront.className = "card-front";
  const cardBack = document.createElement("div");
  cardBack.className = "card-back";

  if (gameMode === "colors") {
    cardBack.style.backgroundColor = value;
  } else {
    cardBack.textContent = value;
  }
  cardInner.appendChild(cardFront);
  cardInner.appendChild(cardBack);
  card.appendChild(cardInner);
  return card;
}

function handleCardClick(card, index) {
  if (
    flippedCards.length >= 2 ||
    flippedCards.includes(index) ||
    matchedPairs.includes(cards[index])
  ) {
    return;
  }
  card.classList.add("flipped");
  flippedCards.push(index);

  if (flippedCards.length === 2) {
    const [firstIndex, secondIndex] = flippedCards;
    if (cards[firstIndex] === cards[secondIndex]) {
      matchedPairs.push(cards[firstIndex]);
      flippedCards = [];
      score += 10;
      updateScore();
      if (matchedPairs.length === cards.length / 2) {
        endGame(true);
      }
    } else {
      setTimeout(() => {
        document.querySelectorAll(".card").forEach((card) => {
          if (!matchedPairs.includes(cards[card.dataset.index])) {
            card.classList.remove("flipped");
          }
        });
        flippedCards = [];
      }, 1000);
    }
  }
}

function updateScore() {
  scoreElement.textContent = score;
}

function updateTimer() {
  timeLeftElement.textContent = timeLeft;
}

function endGame(won = false) {
  clearInterval(timer);
  gameOverScreen.classList.remove("hidden");
  gameOverTitle.textContent = won ? "Congratulations! 🎉" : "Game Over!";
  gameOverMessage.textContent = `You scored ${score} points`;
}

function resetGame() {
  clearInterval(timer);
  gameBoard.classList.add("hidden");
  gameOverScreen.classList.add("hidden");
  modeSelector.classList.remove("hidden");
  gameMode = null;
}
