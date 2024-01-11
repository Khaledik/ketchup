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
  nextQuestionBtn.addEventListener("click", nextQuestion);
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

  let currentQuestionIndex = 0;

  function startGame() {
    startMusic("assets/mp3/countdown.mp3");
    startGameBtn.style.display = "none";
    nextQuestionBtn.style.display = "block";
    previousQuestionBtn.style.display = "block";
    board.style.display = "flex";
    showQuestion();
  }

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

        question.answers.forEach((answer) => {
          const answerBtn = document.createElement("button");
          answerBtn.classList.add(
            "bg-black",
            "text-white",
            "py-2",
            "px-4",
            "rounded-lg"
          );
          answerBtn.innerHTML = answer;
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
    }
  }

  startGameBtn.addEventListener("click", startGame);
});
