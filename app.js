import { startMusic } from "./utils.js";
import { createButton } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let score = 0;
  let selectionedAnswer = false;
  let textValideBtn = "Valider Quiz";
  const startGameBtn = document.getElementById("start-game");
  const nextQuestionBtn = createButton("Question suivante", () => {
    if (currentQuestionIndex === 9 && selectionedAnswer === true) {
        validateQuiz();
    } else {
      nextQuestion();
    }
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
        y: Math.random() - 0.2,
      },
    });
    console.log(currentQuestionIndex);
  });
  const previousQuestionBtn = createButton(
    "Question précédente",
    previousQuestion
  );
  const board = document.createElement("div");
  board.classList.add(
    "bg-white",
    "flex-col",
    "gap-4",
    "justify-center",
    "items-center",
    "p-4",
    "rounded-xl",
    "border-t-4",
    "border-x-4",
    "border-b-8",
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
    // startMusic("assets/mp3/countdown.mp3");
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

        const questionNumber = document.createElement("h1");
        questionNumber.innerHTML = `Question ${currentQuestionIndex + 1} / ${data.questions.length}`
        questionNumber.classList.add("text-lg", "font-bold")

        const questionTitle = document.createElement("h2");

        questionTitle.innerHTML = question.question;
        questionTitle.classList.add("text-lg", "font-bold");

        const answerContainer = document.createElement("div");
        answerContainer.setAttribute("id", "answer-container");
        answerContainer.classList.add("grid", "grid-cols-2", "gap-4", "w-full");

        const answerButtons = [];

        question.answers.forEach((answer, index) => {
          const answerBtn = document.createElement("button");
          answerBtn.classList.add(
            "bg-gray-200",
            "border-t-2",
            "border-x-2",
            "border-b-4",
            "border-black",
            "text-black",
            "text-lg",
            "size-24",
            "rounded-lg",
            "w-full",
            "font-medium"
          );
          answerBtn.innerHTML = answer;

          answerButtons.push(answerBtn);

          answerBtn.addEventListener("click", () => {
            selectionedAnswer = true;
            answerButtons.forEach((btn, idx) => {
              if (idx !== index) {
                btn.disabled = true;
              }
            });

            if (index + 1 === question.correct_answer) {
              score ++;
              answerBtn.classList.add("bg-green-500");
              startMusic("assets/mp3/correct.mp3");
            } else {
              answerBtn.classList.add("bg-red-500");
              startMusic("assets/mp3/wrong.mp3");
            }
            userAnswers[currentQuestionIndex] = index + 1;
          });

          if (userAnswers[currentQuestionIndex] !== undefined) {
            if (userAnswers[currentQuestionIndex] === index + 1) {
              if (index + 1 === question.correct_answer) {
                answerBtn.classList.add("bg-green-500");
              } else {
                answerBtn.classList.add("bg-red-500");
              }
            } else {
              answerBtn.disabled = true;
            }
            selectionedAnswer = true;
          }

          answerContainer.appendChild(answerBtn);
        });

        questionContainer.appendChild(questionNumber);
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
    if (!selectionedAnswer) {
      popUpFunction();
      return;
    }
    currentQuestionIndex++;
    board.innerHTML = "";
    if (currentQuestionIndex < 10) {
      showQuestion();
    } else {
      currentQuestionIndex = 0;
      showQuestion();
    }
    selectionedAnswer = false;
  }


  function previousQuestion() {
    selectionedAnswer = true;
    currentQuestionIndex--;
    board.innerHTML = "";
    if (currentQuestionIndex >= 0) {
      showQuestion();
    } else {
      currentQuestionIndex = 0;
      showQuestion();
    }
  }

  function popUpFunction() {
    const popUpBg = document.createElement("div");
      // popUpBg.style.display = "flex";
      popUpBg.classList.add (
        "h-full",
        "w-full",
        "absolute",
        "bg-black/40",
        "flex",
        "justify-center",
        "items-center"
      )
    // popUp.style.postion = "absolute"
    document.body.appendChild(popUpBg)

        const popUp = document.createElement("div");
        popUp.innerText = "Sélectionnez une réponse"
        popUp.classList.add (
          "px-16",
          "py-12",
          "bg-white",
          "border-t-2",
            "border-x-2",
            "border-b-4",
            "border-black",
            "text-black",
            "text-lg",
            "rounded-lg",
            "absolute",
            "flex",
            "flex-col",
            "items-center",
            "justify-center",
            "gap-4",
            "font-bold"
        );
        popUpBg.appendChild(popUp);
      
        const popUpBtn = document.createElement("button");
        popUpBtn.innerText = "Ok";
        popUpBtn.classList.add(
          "bg-yellow-400",
          "hover:bg-yellow-500",
          "px-12",
          "py-3",
          "rounded-xl",
          "font-medium",
          "text-xl",
          "shadow-inner",
          "shadow-white",
          "border-t-2",
          "border-x-2",
          "border-b-4",
          "border-yellow-600",
          "w-full"
        )

        popUp.appendChild(popUpBtn);
        
        popUpBtn.addEventListener("click", function() {
          popUpBg.style.display = "none";
        })
      return; 
  }


  function validateQuiz() {
      alert(`Vous avez ${score} reponses`)
  }


  function gameUI() {
    const logo = document.createElement("img");
    logo.src = "assets/images/logo.png";
    logo.alt = "Logo";
    document.body.appendChild(logo);
    document.body.insertBefore(logo, document.body.firstChild);
    const svgPattern = document.createElement("img");
    svgPattern.classList.add(
      "absolute",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "-z-10"
    );
    svgPattern.src = "assets/images/pattern.svg";
    document.body.appendChild(svgPattern);
  }

  gameUI();
  console.log(selectionedAnswer)
  startGameBtn.addEventListener("click", startGame);
});
