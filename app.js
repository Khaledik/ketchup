import { startMusic } from "./utils.js";
import { createButton } from "./ui.js";

document.addEventListener("DOMContentLoaded", () => {
  // Variables globales
  let chrono = 0;
  let score = 0;
  let selectionedAnswer = false; //le boolean qui permet d'avoir le popup quand aucune reponse n'est selectioné
  const startGameBtn = document.getElementById("start-game");
  const nextQuestionBtn = createButton("Question suivante", () => {
    if (currentQuestionIndex === 9 && selectionedAnswer === true) { // permet d'aller sur le scoreBoard à la fin des questions
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
  
  const previousQuestionBtn = createButton("Question précedent", () => {
    if (currentQuestionIndex > 0) { //permet de desactiver la fonctionalité du bouton précédent sur la premiere page
      previousQuestion()
    }
  }
    
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


  //Chronometre
  const chronoBorder = document.createElement("div");
  chronoBorder.style.display = "none";
  chronoBorder.classList.add(
    "absolute",
    "top-4",
    "right-4",
    "bg-black/40",
    "p-1.5",
    "rounded-2xl"
  );
  document.body.appendChild(chronoBorder);

  const chronoContainer = document.createElement("div");
  chronoContainer.style.display = "none";
  chronoContainer.classList.add(
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
  chronoBorder.appendChild(chronoContainer);

  const chronoText = document.createElement("p");
  chronoText.classList.add(
    "font-bold",
    "text-xl"
  );
  chronoContainer.appendChild(chronoText);



  let currentQuestionIndex = 0;

  function startGame() {

    // startMusic("assets/mp3/countdown.mp3");
    startGameBtn.style.display = "none";
    // nextQuestionBtn.style.display = "block";
    //   previousQuestionBtn.style.display = "block";
    board.style.display = "flex";
    chronoBorder.style.display = "block";
    chronoContainer.style.display = "block";
    showQuestion();
    setInterval(temps, 1000); //lance le chrono
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


        //les numeros des questions
        const questionNumber = document.createElement("h1");
        questionNumber.innerHTML = `Question ${currentQuestionIndex + 1} / ${data.questions.length}`
        questionNumber.classList.add("text-lg", "font-bold")

        //les images
        const ketchupImgs = document.createElement("div");
        ketchupImgs.style.backgroundImage = `url(assets/images/ketchup-quiz-img-${currentQuestionIndex + 1}.jpg)`;
        ketchupImgs.classList.add(
          "w-80",
          "h-48",
          "bg-cover",
          "bg-center",
          "rounded-lg",
          "border-t-2",
          "border-x-2",
          "border-b-4",
          "border-black"
        )

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
              score++;
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
        questionContainer.appendChild(ketchupImgs);
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
    } 
    selectionedAnswer = false;
  }


  function previousQuestion() {
    selectionedAnswer = true;
    currentQuestionIndex--;
    board.innerHTML = "";
    if (currentQuestionIndex >= 0) {
      showQuestion();
    } 
  }


  //function pour afficher le message quand aucune question n'a été selectioné
  function popUpFunction() {
    const popUpBg = document.createElement("div");
    popUpBg.classList.add(
      "h-screen",
      "w-full",
      "absolute",
      "bg-black/40",
      "flex",
      "justify-center",
      "items-center"
    )
    document.body.appendChild(popUpBg)

    const popUp = document.createElement("div");
    popUp.innerText = "Sélectionnez une réponse"
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

    popUpBtn.addEventListener("click", function () {
      popUpBg.style.display = "none";
    })
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
    statsSubTitleUserName.classList.add("font-bold", "text-black");
    statsSubTitleUserName.innerText = "Khaled !";
    statsSubTitle.appendChild(statsSubTitleUserName);

    const statsTitle = document.createElement("h4");
    statsTitle.classList.add("font-bold", "text-3xl");

    const statsTrophy = document.createElement("img");

    statsTrophy.classList.add("w-20", "mt-5");

    statsCustomSentence.appendChild(statsSubTitle);
    statsCustomSentence.appendChild(statsTitle);
    statsCustomSentence.appendChild(statsTrophy);

    if (score <= 3) {
      statsSubTitle.innerText =
        "Essaie encore " + statsSubTitleUserName.innerText;
      statsTitle.innerText = "Vous avez Perdu...";
      statsTrophy.src = "./assets/images/bronze-trophy.svg";
    } else if (score <= 6) {
      statsSubTitle.innerText =
        "Félicitation " + statsSubTitleUserName.innerText;
      statsTitle.innerText = "Vous avez gagné !";
      statsTrophy.src = "./assets/images/silver-trophy.svg";
    } else {
      statsSubTitle.innerText =
        "Félicitation " + statsSubTitleUserName.innerText;
      statsTitle.innerText = "Vous avez gagné !";
      statsTrophy.src = "./assets/images/gold-trophy.svg";
    }

    // Partie génération du score du joueur

    const statsScoreContainer = document.createElement("div");
    statsScoreContainer.classList.add("flex", "flex-col", "items-center");

    const statsScore = document.createElement("p");
    statsScore.classList.add("font-bold", "text-4xl");
    statsScore.innerText = score * 10;

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
    statsQuestionGoodRatio.innerText = "3/5";

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
    statsQuestionBadRatio.innerText = "2/5";

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

    // On attache tout les élement au container stats
    statsContainer.appendChild(statsCustomSentence);
    statsContainer.appendChild(statsScoreContainer);
    statsContainer.appendChild(statsQuestionContainer);
    statsContainer.appendChild(newGameBtn);
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


  //fonction pour le chronometre
  function temps() {
    let minuteDecompte = parseInt(chrono / 60, 10)
    let secondeDecompte = parseInt(chrono % 60, 10);
    minuteDecompte = minuteDecompte < 10 ? "0" + minuteDecompte : minuteDecompte
    secondeDecompte = secondeDecompte < 10 ? "0" + secondeDecompte : secondeDecompte;
    chronoText.innerText = minuteDecompte + ":" + secondeDecompte;
    //temp = temp <= 0 ? 0 : temp - 1;
    chrono = chrono + 1;
  }
 


  gameUI();
  console.log(selectionedAnswer)
  startGameBtn.addEventListener("click", startGame);
});
