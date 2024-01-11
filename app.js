import { startMusic } from "./utils.js";

document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  const startGameBtn = document.getElementById("start-game");
  const nextQuestionBtn = document.createElement("button");
  nextQuestionBtn.textContent = "Question suivante";
  nextQuestionBtn.classList.add(
    "bg-yellow-400",
    "hover:bg-yellow-500",
    "px-12",
    "py-3",
    "rounded-xl",
    "font-medium",
    "text-xl",
    "shadow-inner",
    "shadow-white",
    "border-b-4",
    "border-yellow-600",
    "w-full"
  );
  nextQuestionBtn.style.display = "none";
  nextQuestionBtn.addEventListener("click", () => {
    nextQuestion();
    const myConfetti = confetti.create(conffetiCanvas, {
      resize: true,
      useWorker: true,
    });
    myConfetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: Math.random(),
        // since they fall down, start a bit higher than random
        y: Math.random() - 0.2,
      },
    });
  });
  const previousQuestionBtn = document.createElement("button");
  previousQuestionBtn.textContent = "Question précédente";
  previousQuestionBtn.classList.add(
    "bg-yellow-400",
    "hover:bg-yellow-500",
    "px-12",
    "py-3",
    "rounded-xl",
    "font-medium",
    "text-xl",
    "shadow-inner",
    "shadow-white",
    "border-b-4",
    "border-yellow-600",
    "w-full"
  );
  previousQuestionBtn.style.display = "none";
  previousQuestionBtn.addEventListener("click", previousQuestion);
  const board = document.createElement("div");
  board.classList.add(
    "bg-white",
    "flex-col",
    "gap-4",
    "justify-center",
    "items-center",
    "p-4",
    "rounded-xl",
    "border-4",
    "border-black"
  );
  const conffetiCanvas = document.createElement("canvas");
  conffetiCanvas.classList.add(
    "absolute",
    "top-0",
    "left-0",
    "w-full",
    "h-full",
    "-z-10"
  );
  document.body.appendChild(conffetiCanvas);

  let currentQuestionIndex = 0;

  function startGame() {
    startMusic("assets/mp3/countdown.mp3");
    startGameBtn.style.display = "none";
    nextQuestionBtn.style.display = "block";
    previousQuestionBtn.style.display = "block";
    board.style.display = "flex";
    showQuestion();
  }

  const userAnswers = []; // Récupérer les réponses de l'utilisateur

  function showQuestion() {
    // Récupérer les données du JSON
    fetch("assets/data/trivia.json")
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        // Data
        const question = data.questions[currentQuestionIndex];

        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("id", "question-container");
        questionContainer.classList.add(
          "flex",
          "flex-col",
          "gap-4",
          "justify-center",
          "items-center"
        );

        const questionTitle = document.createElement("h1");

        questionTitle.innerHTML = question.question;
        questionTitle.classList.add("text-lg", "font-bold");

        const answerContainer = document.createElement("div");
        answerContainer.setAttribute("id", "answer-container");
        answerContainer.classList.add("flex", "items-center", "gap-4");

        const answerButtons = [];

        question.answers.forEach((answer, index) => {
          const answerBtn = document.createElement("button");
          answerBtn.classList.add(
            "bg-black",
            "text-white",
            "py-2",
            "px-4",
            "rounded-lg"
          );
          answerBtn.innerHTML = answer;
          answerBtn.addEventListener("click", () => {
            if (index + 1 === question.correct_answer) {
              answerBtn.classList.add("bg-green-500");
              startMusic("assets/mp3/correct.mp3");
            } else {
              answerBtn.classList.add("bg-red-500");
              startMusic("assets/mp3/wrong.mp3");
            }
            answerButtons.push(answerBtn);
            userAnswers[currentQuestionIndex] = index + 1;
          });

          if (userAnswers[currentQuestionIndex] === index + 1) {
            answerBtn.classList.add("bg-yellow-500");
            answerBtn.disabled = true;
          }

          answerContainer.appendChild(answerBtn);
        });

        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(answerContainer);

        board.appendChild(questionContainer);
        board.appendChild(nextQuestionBtn);
        board.appendChild(previousQuestionBtn);
        document.body.appendChild(board);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  function nextQuestion() {
    currentQuestionIndex++;
    board.innerHTML = "";
    if (currentQuestionIndex < 5) {
      showQuestion();
    } else {
      board.innerHTML = "Vous avez fini les questions";
    }
  }

  function previousQuestion() {
    currentQuestionIndex--;
    board.innerHTML = "";
    if (currentQuestionIndex >= 0) {
      showQuestion();
    } else {
      currentQuestionIndex = 0;
      showQuestion();
    }
  }

  startGameBtn.addEventListener("click", startGame);
});
