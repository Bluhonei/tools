(function () {
  "use strict";

  var QUESTIONS = [
    {
      dimension: "Cash Stability",
      text: "If your income stopped tomorrow, how long could you cover your life without touching retirement accounts or selling assets?",
      options: [
        "Three months or more",
        "One to two months",
        "A few weeks",
        "I honestly don't know"
      ]
    },
    {
      dimension: "Debt Clarity",
      text: "Do you know the interest rate and payoff timeline on every debt you currently carry?",
      options: [
        "Yes — I track all of it actively",
        "I know the balances but not the rates or timelines",
        "I have a rough idea but haven't looked closely",
        "I avoid looking at the details"
      ]
    },
    {
      dimension: "Lifestyle Resilience",
      text: "If your income dropped by 30%, could your essential monthly costs still be covered?",
      options: [
        "Yes — my fixed costs are well within my income",
        "Probably — it would be tight but manageable",
        "Not really — my fixed costs are close to my income",
        "No — I'd be in trouble immediately"
      ]
    },
    {
      dimension: "Financial Protection",
      text: "How current are your financial protections — insurance, beneficiaries, will or estate documents?",
      options: [
        "All updated and reflect my life today",
        "Some are updated but others are overdue",
        "Most haven't been reviewed in years",
        "I don't have these in place"
      ]
    },
    {
      dimension: "Future Building",
      text: "How consistently do you invest or contribute to retirement?",
      options: [
        "Every month automatically — regardless of how the month goes",
        "Most months — but I skip when money feels tight",
        "Occasionally — when I have something left over",
        "Not currently — I keep meaning to start"
      ]
    },
    {
      dimension: "Peace vs. Performance",
      text: "When you think about your financial life, what's the most accurate description?",
      options: [
        "It supports peace — I have options and room to breathe",
        "It's stable but I'm aware of what's missing",
        "It looks better than it feels",
        "It mostly supports performance — I spend to maintain the image"
      ]
    }
  ];

  var MAX_SCORE = QUESTIONS.length * 4;

  var PROFILES = [
    {
      min: 18,
      name: "The Quietly Protected",
      description:
        "This is what the other kind of rich actually looks like. Your financial life is built on a foundation that holds — not just one that impresses. Keep building. The goal now is to close any remaining gaps and deepen what's already working.",
      nextStep: "Review your protection documents annually. The foundation is strong — don't let it go stale."
    },
    {
      min: 10,
      name: "The Foundation Builder",
      description:
        "The structure is starting. You have some of the right pieces in place, but there are gaps that need closing before life tests them. The good news: you're aware enough to be here. That's already further than most.",
      nextStep: "Identify your lowest-scoring dimension and address that one gap first — not all of them at once."
    },
    {
      min: 0,
      name: "The High Performer",
      description:
        "Your financial life may look more secure than it is. Strong income and a composed exterior can mask a thin foundation — and the gap only shows up when something breaks. This isn't a verdict. It's a starting point.",
      nextStep: "Start with liquidity. Three months of accessible cash changes every other financial decision you make."
    }
  ];

  var state = {
    index: 0,
    answers: new Array(QUESTIONS.length).fill(null)
  };

  var screenIntro = document.getElementById("screen-intro");
  var screenQuiz = document.getElementById("screen-quiz");
  var screenResults = document.getElementById("screen-results");

  var progressFill = document.getElementById("progress-fill");
  var progressLabel = document.getElementById("progress-label");
  var questionText = document.getElementById("question-text");
  var optionsList = document.getElementById("options-list");
  var btnBack = document.getElementById("btn-back");
  var btnStart = document.getElementById("btn-start");
  var btnRetake = document.getElementById("btn-retake");

  var profileName = document.getElementById("profile-name");
  var scoreTotal = document.getElementById("score-total");
  var profileDescription = document.getElementById("profile-description");
  var dimensionList = document.getElementById("dimension-list");
  var nextStepText = document.getElementById("next-step-text");

  var emailForm = document.getElementById("email-form");
  var emailSuccess = document.getElementById("email-success");
  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var btnSkipEmail = document.getElementById("btn-skip-email");

  function showScreen(el) {
    [screenIntro, screenQuiz, screenResults].forEach(function (s) {
      s.hidden = s !== el;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function renderQuestion() {
    var qIndex = state.index;
    var question = QUESTIONS[qIndex];

    var percent = ((qIndex + 1) / QUESTIONS.length) * 100;
    progressFill.style.width = percent + "%";
    progressLabel.textContent = "Question " + (qIndex + 1) + " of " + QUESTIONS.length;

    questionText.textContent = question.text;

    optionsList.innerHTML = "";
    question.options.forEach(function (optionText, optIndex) {
      var card = document.createElement("button");
      card.type = "button";
      card.className = "option-card";
      if (state.answers[qIndex] === optIndex) {
        card.classList.add("selected");
      }

      var marker = document.createElement("span");
      marker.className = "option-marker";
      marker.setAttribute("aria-hidden", "true");

      var label = document.createElement("span");
      label.textContent = optionText;

      card.appendChild(marker);
      card.appendChild(label);

      card.addEventListener("click", function () {
        selectOption(qIndex, optIndex);
      });

      optionsList.appendChild(card);
    });

    btnBack.disabled = qIndex === 0;
  }

  function selectOption(qIndex, optIndex) {
    state.answers[qIndex] = optIndex;

    var cards = optionsList.querySelectorAll(".option-card");
    cards.forEach(function (c, i) {
      c.classList.toggle("selected", i === optIndex);
    });

    window.setTimeout(function () {
      if (qIndex < QUESTIONS.length - 1) {
        state.index = qIndex + 1;
        renderQuestion();
      } else {
        showResults();
      }
    }, 280);
  }

  function goBack() {
    if (state.index > 0) {
      state.index -= 1;
      renderQuestion();
    }
  }

  function scoreForAnswer(optIndex) {
    return 4 - optIndex;
  }

  function computeResults() {
    var dimensionScores = QUESTIONS.map(function (question, qIndex) {
      return {
        dimension: question.dimension,
        score: scoreForAnswer(state.answers[qIndex])
      };
    });

    var total = dimensionScores.reduce(function (sum, d) {
      return sum + d.score;
    }, 0);

    var profile = PROFILES[PROFILES.length - 1];
    for (var i = 0; i < PROFILES.length; i++) {
      if (total >= PROFILES[i].min) {
        profile = PROFILES[i];
        break;
      }
    }

    return { total: total, profile: profile, dimensionScores: dimensionScores };
  }

  function renderDimensionBreakdown(dimensionScores) {
    dimensionList.innerHTML = "";

    dimensionScores.forEach(function (d) {
      var row = document.createElement("div");
      row.className = "dimension-row";

      var name = document.createElement("span");
      name.className = "dimension-name";
      name.textContent = d.dimension;

      var meter = document.createElement("span");
      meter.className = "dimension-meter";

      var dots = document.createElement("span");
      dots.className = "dimension-dots";
      dots.setAttribute("aria-hidden", "true");
      for (var i = 1; i <= 4; i++) {
        var dot = document.createElement("span");
        dot.className = "dimension-dot" + (i <= d.score ? " filled" : "");
        dots.appendChild(dot);
      }

      var scoreLabel = document.createElement("span");
      scoreLabel.className = "dimension-score";
      scoreLabel.textContent = d.score + "/4";

      var srLabel = document.createElement("span");
      srLabel.className = "sr-only";
      srLabel.textContent = d.dimension + ": " + d.score + " out of 4";

      meter.appendChild(dots);
      meter.appendChild(scoreLabel);
      meter.appendChild(srLabel);

      row.appendChild(name);
      row.appendChild(meter);
      dimensionList.appendChild(row);
    });
  }

  function showResults() {
    var results = computeResults();

    profileName.textContent = results.profile.name;
    scoreTotal.textContent = results.total + " / " + MAX_SCORE;
    profileDescription.textContent = results.profile.description;
    nextStepText.textContent = results.profile.nextStep;
    renderDimensionBreakdown(results.dimensionScores);

    emailForm.hidden = false;
    emailSuccess.hidden = true;
    if (flodeskContainer) flodeskContainer.hidden = false;
    emailForm.reset();

    showScreen(screenResults);
  }

  function resetQuiz() {
    state.index = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    showScreen(screenQuiz);
  }

  btnStart.addEventListener("click", function () {
    state.index = 0;
    state.answers = new Array(QUESTIONS.length).fill(null);
    renderQuestion();
    showScreen(screenQuiz);
  });

  btnBack.addEventListener("click", goBack);
  btnRetake.addEventListener("click", resetQuiz);

  emailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    // TODO: Replace this handler with Flodesk's native form submission
    // once the real embed code is dropped into #flodesk-embed-container.
    emailForm.hidden = true;
    emailSuccess.hidden = false;
  });

  btnSkipEmail.addEventListener("click", function () {
    if (flodeskContainer) flodeskContainer.hidden = true;
    emailForm.hidden = true;
    emailSuccess.hidden = true;
    btnSkipEmail.hidden = true;
  });

  renderQuestion();
})();
