import { startMusic, stopMusic } from "./utils.js";
import { createButton } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let userAnswers = []; // Récupérer les réponses de l'utilisateur
  let answerButtons = [];
  let timer;
  let seconds = 0;
  let score = 0;
  let userName;
  let userNameContainer;
  let userNameInput;
  let questionsLength; //rend la longueur du tableau des questions en global
  let selectionedAnswer = false; //le boolean qui permet d'avoir le popup quand aucune reponse n'est selectioné

// création du bouton démarrer
const startGameBtn = document.createElement("button");
startGameBtn.id = ("start-game");
let startGameBtnDiv = document.createElement("div");
startGameBtnDiv.id = ("startGameBtnDiv");
document.body.appendChild(startGameBtnDiv);
startGameBtnDiv.appendChild(startGameBtn);
startGameBtn.innerText = ("Démarrer le jeu");
startGameBtnDiv.classList.add(
  "bg-black/40",
  "p-1.5",
  "rounded-2xl"
);
startGameBtn.classList.add(
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
);


  const nextQuestionBtn = createButton("Question suivante", () => {
    if (currentQuestionIndex === 8) {
      nextQuestionBtn.innerHTML = "Valider Quiz"; // à optimiser????
    }
    if (currentQuestionIndex === 9 && selectionedAnswer === true) {
      // permet d'aller sur le scoreBoard à la fin des questions
      musicAudio.pause();
      stopTimer();
      validateQuiz();
    } else {
      nextQuestion();
    }
    console.log(currentQuestionIndex);
  });

  const previousQuestionBtn = createButton("Question précedent", () => {
    if (currentQuestionIndex > 0) {
      //permet de desactiver la fonctionalité du bouton précédent sur la premiere page
      previousQuestion();
    }
  });
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


//bouton musique
const musicBorder = document.createElement("div");
musicBorder.classList.add(
  "absolute",
  "top-4",
  "left-4",
  "bg-black/40",
  "p-1.5",
  "rounded-2xl"
);
document.body.appendChild(musicBorder);

const musicBtn = document.createElement("button");
musicBtn.classList.add(
    "bg-yellow-400",
    "px-4",
    "py-3",
    "rounded-xl",
    "text-xl",
    "shadow-inner",
    "shadow-white",
    "border-b-4",
    "border-yellow-600"
);
musicBorder.appendChild(musicBtn);

let musicAudio = document.createElement("audio");
musicAudio.src = "assets/mp3/countdown.mp3";
musicAudio.loop = true;
musicBtn.appendChild(musicAudio);
const musicImg = document.createElement("img");
musicImg.src = "assets/images/volume-on.svg";
musicBtn.appendChild(musicImg);

//Bouton pour arreter ou play la musique
let startStopMusic = true;
musicBtn.addEventListener("click", function() {
  if (startStopMusic) {
    musicAudio.pause();
    startStopMusic = false
  }else {
    musicAudio.play();
    startStopMusic = true
  }
});


  //Chronometre
  const timerBorder = document.createElement("div");
  timerBorder.style.display = "none";
  timerBorder.classList.add(
    "absolute",
    "top-4",
    "right-4",
    "bg-black/40",
    "p-1.5",
    "rounded-2xl"
  );
  document.body.appendChild(timerBorder);

  const timerContainer = document.createElement("div");
  timerContainer.style.display = "none";
  timerContainer.classList.add(
    "bg-yellow-400",
    "px-4",
    "py-3",
    "rounded-xl",
    "text-xl",
    "shadow-inner",
    "shadow-white",
    "border-b-4",
    "border-yellow-600"
  );
  timerBorder.appendChild(timerContainer);

  const timerText = document.createElement("p");
  timerText.classList.add("font-bold", "text-xl");
  timerContainer.appendChild(timerText);

  let currentQuestionIndex = 0;

  function startGame() {
    const logo = document.getElementById("logo");
    logo.classList.add(
      "w-40",
      "h-20",
    );
    userName = userNameInput.value;

    if (userName !== "") {
      musicAudio.play();
      userNameContainer.style.display = "none";
      startGameBtn.style.display = "none";
      board.style.display = "flex";
      timerBorder.style.display = "block";
      timerContainer.style.display = "block";
      showQuestion();
      startTimer(); //lance le chrono
    } else {
      popUpFunction("Veuillez saisir votre Prénom");
    }
  }

  function showQuestion() {
    // Récupérer les données du JSON
    fetch("assets/data/trivia.json")
      .then(response => {
        return response.json();
      })
      .then(data => {
        // Data
        const question = data.questions[currentQuestionIndex];
        questionsLength = data.questions.length; //Sert à rendre la longueur de tableau en variable global

        const questionContainer = document.createElement("div");
        questionContainer.setAttribute("id", "question-container");
        questionContainer.classList.add(
          "flex",
          "flex-col",
          "gap-4",
          "justify-center",
          "items-center"
        );

        //les numeros des questions
        const questionNumber = document.createElement("h1");
        questionNumber.innerHTML = `Question ${
          currentQuestionIndex + 1
        } / ${questionsLength}`;
        questionNumber.classList.add("text-lg", "font-bold");

        //les images
        const ketchupImgs = document.createElement("div");
        ketchupImgs.style.backgroundImage = `url(assets/images/ketchup-quiz-img-${
          currentQuestionIndex + 1
        }.jpg)`;
        ketchupImgs.classList.add(
          "w-80",
          "h-40",
          "bg-cover",
          "bg-center",
          "rounded-lg",
          "border-t-2",
          "border-x-2",
          "border-b-4",
          "border-black"
        );

        const questionTitle = document.createElement("h2");
        questionTitle.innerHTML = question.question;
        questionTitle.classList.add("text-lg", "font-bold");

        const answerContainer = document.createElement("div");
        answerContainer.setAttribute("id", "answer-container");
        answerContainer.classList.add("grid", "grid-cols-2", "gap-4", "w-full");

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
            "size-12",
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
              score++;
              answerBtn.classList.add("bg-green-500");
              startMusic("assets/mp3/correct.mp3");
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
        questionContainer.appendChild(ketchupImgs);
        questionContainer.appendChild(questionTitle);
        questionContainer.appendChild(answerContainer);

        board.appendChild(questionContainer);
        board.appendChild(nextQuestionBtn);
        board.appendChild(previousQuestionBtn);
        document.body.appendChild(board);
      })
      .catch(error => {
        console.error(error);
      });
  }

  function nextQuestion() {
    if (!selectionedAnswer) {
      popUpFunction("Sélectionnez une réponse");
      return;
    }
    currentQuestionIndex++;
    board.innerHTML = "";
    if (currentQuestionIndex < questionsLength) {
      showQuestion();
    }
    selectionedAnswer = false;
  }

  function previousQuestion() {
    selectionedAnswer = true;
    currentQuestionIndex--;
    board.innerHTML = "";
    nextQuestionBtn.innerHTML = "Question suivante"; // à optimiser????
    if (currentQuestionIndex >= 0) {
      showQuestion();
    }
  }

  //function pour afficher le message quand aucune question n'a été selectioné
  function popUpFunction(message) {
    const popUpBg = document.createElement("div");
    popUpBg.classList.add(
      "h-screen",
      "w-full",
      "absolute",
      "bg-black/40",
      "flex",
      "justify-center",
      "items-center"
    );
    document.body.appendChild(popUpBg);

    const popUp = document.createElement("div");
    popUp.innerText = message;
    popUp.classList.add(
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
    popUpBtn.innerText = "OK";
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
    );

    popUp.appendChild(popUpBtn);

    popUpBtn.addEventListener("click", function () {
      popUpBg.style.display = "none";
    });
    return;
  }

  //la function ou il y aura le score board
  function validateQuiz() {
    // On supprime le board
    board.remove();

    // Container qui va stocker l'ensemble des stats de la partie
    const statsContainer = document.createElement("div");
    statsContainer.classList.add(
      "bg-white",
      "flex",
      "flex-col",
      "gap-4",
      "justify-center",
      "items-center",
      "p-8",
      "rounded-xl",
      "border-t-4",
      "border-x-4",
      "border-b-8",
      "border-black"
    );
    document.body.appendChild(statsContainer);

    // Partie génération du sous-titre et titre avec phrase personnalisé Gagné ou Perdu avec le prénom du joueur
    const statsCustomSentence = document.createElement("div");
    statsCustomSentence.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "gap-2"
    );

    const statsSubTitle = document.createElement("h5");
    statsSubTitle.classList.add("text-gray-900", "text-lg");

    const statsSubTitleUserName = document.createElement("span");
    statsSubTitleUserName.classList.add("font-bold");
    statsSubTitleUserName.innerText = userName;

    const statsTitle = document.createElement("h4");
    statsTitle.classList.add("font-bold", "text-3xl");

    const statsTrophy = document.createElement("img");

    statsTrophy.classList.add("w-20", "mt-5");

    statsCustomSentence.appendChild(statsSubTitle);
    statsCustomSentence.appendChild(statsTitle);
    statsCustomSentence.appendChild(statsTrophy);

    if (score == 0) {
      statsSubTitle.innerText = "Essaie encore! La victoire est à portée, ";
      statsTitle.innerText = "Hélas, pas cette fois...";
      statsTrophy.src = "./assets/images/bronze-trophy.svg";
      statsTrophy.alt = "icone-trophé-bronze";
    } else if (score <= 3) {
      statsSubTitle.innerText = "Bien joué! Sur la bonne voie, ";
      statsTitle.innerText = "Bronze remporté !";
      statsTrophy.src = "./assets/images/bronze-trophy.svg";
      statsTrophy.alt = "icone-trophé-bronze";
    } else if (score <= 6) {
      statsSubTitle.innerText = "Félicitations! Performance remarquable, ";
      statsTitle.innerText = "Argent mérité !";
      statsTrophy.src = "./assets/images/silver-trophy.svg";
      statsTrophy.alt = "icone-trophé-argent";
    } else {
      statsSubTitle.innerText = "Bravo! Maître du quiz, ";
      statsTitle.innerText = "Or décroché !";
      statsTrophy.src = "./assets/images/gold-trophy.svg";
      statsTrophy.alt = "icone-trophé-or";
    }

    statsSubTitle.appendChild(statsSubTitleUserName);

    // Partie génération du score du joueur

    const statsScoreContainer = document.createElement("div");
    statsScoreContainer.classList.add("flex", "flex-col", "items-center");

    const statsScore = document.createElement("p");
    statsScore.classList.add("font-bold", "text-4xl");
    statsScore.innerText = score * 100;

    const statsScoreText = document.createElement("p");
    statsScoreText.classList.add("text-lg");
    statsScoreText.innerText = "Points";

    statsScoreContainer.appendChild(statsScore);
    statsScoreContainer.appendChild(statsScoreText);

    // Partie génération des Stats Questions

    const statsQuestionContainer = document.createElement("div");
    statsQuestionContainer.classList.add("flex", "items-center", "gap-10");

    //  Le nombre de bonne réponse trouvée

    const statsQuestionGood = document.createElement("div");
    statsQuestionGood.classList.add(
      "flex",
      "flex-col",
      "items-center",
      "gap-2"
    );

    const statsQuestionGoodImg = document.createElement("img");
    statsQuestionGoodImg.src = "./assets/images/check-circle.svg";
    statsQuestionGoodImg.classList.add("w-10");

    const statsQuestionGoodRatio = document.createElement("p");
    statsQuestionGoodRatio.classList.add("font-bold", "text-lg");
    statsQuestionGoodRatio.innerText = `${score}/${questionsLength}`;

    const statsQuestionGoodRatioTxt = document.createElement("p");
    statsQuestionGoodRatioTxt.classList.add("font-bold", "text-lg");
    statsQuestionGoodRatioTxt.innerText = "Bonne Réponse";

    statsQuestionContainer.appendChild(statsQuestionGood);
    statsQuestionGood.appendChild(statsQuestionGoodImg);
    statsQuestionGood.appendChild(statsQuestionGoodRatio);
    statsQuestionGood.appendChild(statsQuestionGoodRatioTxt);

    //  Le divider

    const statsQuestionDivider = document.createElement("hr");
    statsQuestionDivider.classList.add("w-0.5", "h-20", "bg-black");
    statsQuestionContainer.appendChild(statsQuestionDivider);

    //  Le nombre de mauvaise réponse trouvée

    const statsQuestionBad = document.createElement("div");
    statsQuestionBad.classList.add("flex", "flex-col", "items-center", "gap-2");

    const statsQuestionBadImg = document.createElement("img");
    statsQuestionBadImg.src = "./assets/images/x-circle.svg";
    statsQuestionBadImg.classList.add("w-10");

    const statsQuestionBadRatio = document.createElement("p");
    statsQuestionBadRatio.classList.add("font-bold", "text-lg");
    statsQuestionBadRatio.innerText = `${
      questionsLength - score
    }/${questionsLength}`;

    const statsQuestionBadRatioTxt = document.createElement("p");
    statsQuestionBadRatioTxt.classList.add("font-bold", "text-lg");
    statsQuestionBadRatioTxt.innerText = "Mauvaise Réponse";

    statsQuestionContainer.appendChild(statsQuestionBad);
    statsQuestionBad.appendChild(statsQuestionBadImg);
    statsQuestionBad.appendChild(statsQuestionBadRatio);
    statsQuestionBad.appendChild(statsQuestionBadRatioTxt);

    //  Génération du Bouton pour lancer une nouvelle partie

    const newGameBtn = document.createElement("button");
    newGameBtn.classList.add(
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
    );
    newGameBtn.innerText = "Nouvelle Partie";
    newGameBtn.addEventListener("click", function () {
      newGame(statsContainer);
    });

    // On attache tout les élement au container stats
    statsContainer.appendChild(statsCustomSentence);
    statsContainer.appendChild(statsScoreContainer);
    statsContainer.appendChild(statsQuestionContainer);
    statsContainer.appendChild(newGameBtn);
  }

  function gameUI() {
    const logo = document.createElement("img");
    logo.id ="logo";
    logo.src = "assets/images/logo.png";
    logo.alt = "Logo";
    logo.classList.add(
      // "size-"
    )
    document.body.appendChild(logo);
    document.body.insertBefore(logo, document.body.firstChild);

    // On génére le container qui va contenir l'input Prénom du joueur
    userNameContainer = document.createElement("div");
    userNameContainer.classList.add("my-8", "relative");
    document.body.appendChild(userNameContainer);
    logo.after(userNameContainer);

    const userNameIcon = document.createElement("img");
    userNameIcon.src = "assets/images/user-circle.svg";
    userNameIcon.alt = "icone-utilisateur";
    userNameIcon.classList.add("w-8", "absolute", "top-2.5", "left-2");

    userNameInput = document.createElement("input");
    userNameInput.setAttribute("type", "text");
    userNameInput.setAttribute("placeholder", "Prénom");
    userNameInput.classList.add(
      "font-bold",
      "text-lg",
      "pl-10",
      "pr-3",
      "py-2",
      "border-t-4",
      "border-x-4",
      "border-b-8",
      "border-black",
      "rounded-lg"
    );

    // On ajoute l'icone de l'input et l'input à son container
    userNameContainer.appendChild(userNameIcon);
    userNameContainer.appendChild(userNameInput);

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

  //fonction pour le chronometre
  function startTimer() {
    timer = setInterval(() => {
      // Démarre une intervalle qui s'éxécute toutes les secondes
      seconds++; // Incrémente le compteur de seconde
      const minutes = Math.floor(seconds / 60); // Calcule les minute
      const remainingSeconds = seconds % 60; // Calcule les secondes qui restent
      if (minutes < 10 && remainingSeconds < 10) {
        timerText.textContent = `0${minutes}:0${remainingSeconds}`;
      } else if (minutes < 10) {
        timerText.textContent = `0${minutes}:${remainingSeconds}`;
      } else if (remainingSeconds < 10) {
        timerText.textContent = `${minutes}:0${remainingSeconds}`;
      } else {
        timerText.textContent = `${minutes}:${remainingSeconds}`;
      }
    }, 1000);
  }

  function stopTimer() {
    clearInterval(timer);
  }

  function newGame(statsContainer) {
    timerText.innerHTML = "00:00";
    seconds = 0;
    timerBorder.style.display = "none";
    timerContainer.style.display = "none";
    score = 0;
    selectionedAnswer = false;
    currentQuestionIndex = 0;
    statsContainer.remove();
    answerButtons = [];
    userAnswers = [];
    board.innerHTML = ""; // Récupérer les réponses de l'utilisateur
    nextQuestionBtn.innerHTML = "Question suivante"; // à optimiser??
    userNameContainer.style.display = "block";
    userNameInput.value = "";
    startGameBtn.style.display = "block";
  }



  gameUI();
  console.log(selectionedAnswer);
  startGameBtn.addEventListener("click", startGame);
});