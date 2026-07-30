(function () {
  "use strict";

  var QUESTIONS = [
    {
      text: "When you feel financially stressed, what do you tend to blame first?",
      options: [
        { text: "My daily spending (coffee, Uber/DoorDash, small purchases)", weights: { VS: 3 } },
        { text: "My social life (dinners, trips, events)", weights: { VS: 2 } },
        { text: "Impulse purchases", weights: { VS: 3 } },
        { text: "I'm not sure — I avoid looking", weights: { VS: 1, UE: 1, IC: 1 } }
      ]
    },
    {
      text: "When did you last negotiate your salary, raise your rates, or actively pursue more income?",
      options: [
        { text: "Within the last year", weights: { UE: 0 } },
        { text: "1–3 years ago", weights: { UE: 1 } },
        { text: "More than 3 years ago", weights: { UE: 2 } },
        { text: "Never — I don't feel comfortable doing that", weights: { UE: 3 } }
      ]
    },
    {
      text: "Do you know, to the dollar, what your monthly fixed costs are right now?",
      options: [
        { text: "Yes — I have a clear number", weights: { VS: 0 } },
        { text: "Roughly — but I haven't calculated it recently", weights: { VS: 1 } },
        { text: "Not really — it changes and I don't track it closely", weights: { VS: 2 } },
        { text: "No idea", weights: { VS: 3 } }
      ]
    },
    {
      text: "If you have debt, do you know the interest rate and how long it will take to pay off at your current pace?",
      options: [
        { text: "Yes — I track this actively", weights: { UE: 0 } },
        { text: "I know what I owe but not the rate or timeline", weights: { UE: 1 } },
        { text: "I know it's there but I avoid looking at the details", weights: { UE: 2 } },
        { text: "I don't have debt / this doesn't apply", weights: {} }
      ]
    },
    {
      text: "In the last 12 months, how often did money leave your account for someone else's emergency, request, or need — without being part of your plan?",
      options: [
        { text: "Rarely or never", weights: { IC: 0 } },
        { text: "Once or twice", weights: { IC: 1 } },
        { text: "Several times — it adds up", weights: { IC: 2 } },
        { text: "Regularly — I'm often the person people come to", weights: { IC: 3 } }
      ]
    },
    {
      text: "Do you have an automatic savings or debt payment set up that runs without you having to decide each month?",
      options: [
        { text: "Yes — multiple automations in place", weights: {} },
        { text: "One thing is automated, but not much else", weights: { VS: 1, UE: 1 } },
        { text: "I've thought about it but haven't set it up", weights: { VS: 2, UE: 1 } },
        { text: "No — I manage everything manually", weights: { VS: 2, UE: 2 } }
      ]
    }
  ];

  var PROFILES = {
    VS: {
      name: "The Visible Spender",
      description:
        "You've been taught to blame the visible stuff — the coffee, the takeout — because it's easier to see than what's underneath it. But the small purchases were never really the leak. The real leak is a financial setup you haven't looked at closely: fixed costs you can't state to the dollar, and a structure that's been running on autopilot.",
      nextStep:
        "This week, pull up your last bank statement and write down your actual fixed costs — rent, subscriptions, minimums — to the dollar. You can't fix a leak you haven't located."
    },
    UE: {
      name: "The Under-Earner",
      description:
        "Your spending isn't the real problem — your income has been standing still while your responsibilities keep growing. It's been a while since you asked for more, whether that's a raise or a rate increase, and no amount of budget-tightening will close a gap that's about what's coming in.",
      nextStep:
        "Before your next pay cycle, research your market rate and draft the sentence you'll use to ask for more — even if you don't send it this week. The conversation starts on paper."
    },
    IC: {
      name: "The Invisible Carrier",
      description:
        "You're the person people call when they're short or in a bind — and you almost always come through. That reliability is real, but it's quietly costing you your own financial floor. Money keeps leaving your account for other people's emergencies before it ever gets the chance to build your own security.",
      nextStep:
        "Set a monthly \"giving cap\" — a specific number you're comfortable spending on others — and let that number, not the request, decide your answer next time."
    }
  };

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
  var profileDescription = document.getElementById("profile-description");
  var nextStepText = document.getElementById("next-step-text");

  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var emailDisclaimer = document.getElementById("email-disclaimer");
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
    question.options.forEach(function (option, optIndex) {
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
      label.textContent = option.text;

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

  function computeProfile() {
    var totals = { VS: 0, UE: 0, IC: 0 };

    QUESTIONS.forEach(function (question, qIndex) {
      var answerIndex = state.answers[qIndex];
      if (answerIndex === null) return;
      var weights = question.options[answerIndex].weights || {};
      Object.keys(weights).forEach(function (key) {
        totals[key] += weights[key];
      });
    });

    var order = ["VS", "UE", "IC"];
    var winner = order[0];
    order.forEach(function (key) {
      if (totals[key] > totals[winner]) {
        winner = key;
      }
    });

    return winner;
  }

  function showResults() {
    var winnerKey = computeProfile();
    var profile = PROFILES[winnerKey];

    profileName.textContent = profile.name;
    profileDescription.textContent = profile.description;
    nextStepText.textContent = profile.nextStep;

    if (flodeskContainer) flodeskContainer.hidden = false;
    if (emailDisclaimer) emailDisclaimer.hidden = false;
    if (btnSkipEmail) btnSkipEmail.hidden = false;

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

  btnSkipEmail.addEventListener("click", function () {
    if (flodeskContainer) flodeskContainer.hidden = true;
    if (emailDisclaimer) emailDisclaimer.hidden = true;
    btnSkipEmail.hidden = true;
  });

  renderQuestion();
})();
