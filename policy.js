(function () {
  "use strict";

  var screenIntro = document.getElementById("screen-intro");
  var screenBuilder = document.getElementById("screen-builder");
  var screenResults = document.getElementById("screen-results");

  var btnStart = document.getElementById("btn-start");
  var btnSeePolicy = document.getElementById("btn-see-policy");
  var btnBackToBuilder = document.getElementById("btn-back-to-builder");
  var statusNote = document.getElementById("policy-status-note");

  var helpNumberInput = document.getElementById("help-number");

  var protectedOptions = document.querySelectorAll("#protected-options .option-card");
  var savingsGoalField = document.getElementById("savings-goal-field");
  var savingsGoalText = document.getElementById("savings-goal-text");
  var selectedProtected = [];

  var waitingOptions = document.querySelectorAll("#waiting-options .option-card");
  var selectedWaiting = null;

  var responseOptions = document.querySelectorAll("#response-options .option-card");
  var customResponseField = document.getElementById("custom-response-field");
  var customResponseText = document.getElementById("custom-response-text");
  var selectedResponse = null;

  var policyPreview = document.getElementById("policy-preview");
  var policyReadyLabel = document.getElementById("policy-ready-label");
  var policyLine1 = document.getElementById("policy-line-1");
  var policyLine2 = document.getElementById("policy-line-2");
  var policyLine3 = document.getElementById("policy-line-3");
  var policyLine4 = document.getElementById("policy-line-4");

  var resultDate = document.getElementById("policy-result-date");
  var resultSentence1 = document.getElementById("result-sentence-1");
  var resultSentence2 = document.getElementById("result-sentence-2");
  var resultSentence3 = document.getElementById("result-sentence-3");
  var resultSentence4 = document.getElementById("result-sentence-4");

  var emailForm = document.getElementById("email-form");
  var emailSuccess = document.getElementById("email-success");
  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var btnSkipEmail = document.getElementById("btn-skip-email");

  var PROTECTED_PHRASES = {
    "emergency-fund": "my emergency fund",
    "retirement": "my retirement contributions",
    "floor-costs": "my monthly floor costs",
    "transition-fund": "my transition fund"
  };

  function formatCurrency(n) {
    return "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  }

  function joinList(items) {
    if (items.length === 0) return "";
    if (items.length === 1) return items[0];
    if (items.length === 2) return items[0] + " and " + items[1];
    return items.slice(0, -1).join(", ") + ", and " + items[items.length - 1];
  }

  function showScreen(el) {
    [screenIntro, screenBuilder, screenResults].forEach(function (s) {
      s.hidden = s !== el;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function helpNumberValue() {
    if (helpNumberInput.value === "") return null;
    var n = parseFloat(helpNumberInput.value);
    if (isNaN(n)) return null;
    return Math.max(0, n);
  }

  function protectedPhrases() {
    return selectedProtected.map(function (id) {
      if (id === "savings-goal") {
        var goal = savingsGoalText.value.trim();
        return goal ? "my savings for " + goal : null;
      }
      return PROTECTED_PHRASES[id];
    }).filter(Boolean);
  }

  function protectedIsValid() {
    if (selectedProtected.length === 0) return false;
    if (selectedProtected.indexOf("savings-goal") !== -1 && savingsGoalText.value.trim() === "") return false;
    return true;
  }

  function responseIsValid() {
    if (!selectedResponse) return false;
    if (selectedResponse.item === "custom" && customResponseText.value.trim() === "") return false;
    return true;
  }

  function stripTrailingPeriod(s) {
    return s.replace(/\.+\s*$/, "");
  }

  function responsePhrase() {
    if (!selectedResponse) return null;
    var text = selectedResponse.item === "custom"
      ? customResponseText.value.trim()
      : selectedResponse.phrase;
    return text ? stripTrailingPeriod(text) : null;
  }

  function setLine(el, text, complete) {
    el.textContent = text;
    el.classList.toggle("policy-line--complete", complete);
  }

  function updatePreview() {
    var help = helpNumberValue();
    setLine(
      policyLine1,
      help === null ? "My annual help limit is $___." : "My annual help limit is " + formatCurrency(help) + ".",
      help !== null
    );

    var phrases = protectedPhrases();
    setLine(
      policyLine2,
      phrases.length === 0
        ? "I will not touch ___ for anyone else's request."
        : "I will not touch " + joinList(phrases) + " for anyone else's request.",
      phrases.length > 0
    );

    setLine(
      policyLine3,
      selectedWaiting ? "Before agreeing to any financial ask, I wait " + selectedWaiting.phrase + "." : "Before agreeing to any financial ask, I wait ___.",
      !!selectedWaiting
    );

    var respPhrase = responsePhrase();
    setLine(
      policyLine4,
      respPhrase ? "When I need to say no, I say: '" + respPhrase + ".'" : "When I need to say no, I say: '___.'",
      !!respPhrase
    );

    var help1 = help !== null;
    var protected2 = protectedIsValid();
    var waiting3 = !!selectedWaiting;
    var response4 = responseIsValid();
    var allComplete = help1 && protected2 && waiting3 && response4;

    policyPreview.classList.toggle("policy-preview--ready", allComplete);
    policyReadyLabel.hidden = !allComplete;

    btnSeePolicy.disabled = !allComplete;

    if (allComplete) {
      statusNote.textContent = "";
    } else if (selectedProtected.indexOf("savings-goal") !== -1 && savingsGoalText.value.trim() === "") {
      statusNote.textContent = "Add your savings goal above to continue.";
    } else if (selectedResponse && selectedResponse.item === "custom" && customResponseText.value.trim() === "") {
      statusNote.textContent = "Write your sentence above to continue.";
    } else {
      statusNote.textContent = "Complete all four decisions above to see your policy.";
    }
  }

  helpNumberInput.addEventListener("input", updatePreview);

  protectedOptions.forEach(function (card) {
    card.addEventListener("click", function () {
      var item = card.dataset.item;
      var idx = selectedProtected.indexOf(item);
      if (idx === -1) {
        selectedProtected.push(item);
        card.classList.add("selected");
      } else {
        selectedProtected.splice(idx, 1);
        card.classList.remove("selected");
      }
      savingsGoalField.hidden = selectedProtected.indexOf("savings-goal") === -1;
      updatePreview();
    });
  });

  savingsGoalText.addEventListener("input", updatePreview);

  waitingOptions.forEach(function (card) {
    card.addEventListener("click", function () {
      waitingOptions.forEach(function (c) { c.classList.remove("selected"); });
      card.classList.add("selected");
      selectedWaiting = { item: card.dataset.item, phrase: card.dataset.phrase };
      updatePreview();
    });
  });

  responseOptions.forEach(function (card) {
    card.addEventListener("click", function () {
      responseOptions.forEach(function (c) { c.classList.remove("selected"); });
      card.classList.add("selected");
      selectedResponse = { item: card.dataset.item, phrase: card.dataset.phrase || null };
      customResponseField.hidden = card.dataset.item !== "custom";
      updatePreview();
    });
  });

  customResponseText.addEventListener("input", updatePreview);

  function renderResults() {
    var help = helpNumberValue();
    var phrases = protectedPhrases();
    var respPhrase = responsePhrase();

    var today = new Date();
    resultDate.textContent = today.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

    resultSentence1.textContent = "My annual help limit is " + formatCurrency(help) +
      " per year — across all requests combined.";
    resultSentence2.textContent = "I will not use " + joinList(phrases) +
      " for anyone else's emergency, regardless of how the ask is framed.";
    resultSentence3.textContent = "Before agreeing to any financial request, I give myself " +
      selectedWaiting.phrase + " before responding.";
    resultSentence4.textContent = "When I need to say no, I say: '" + respPhrase + ".'";

    emailForm.hidden = false;
    emailSuccess.hidden = true;
    if (flodeskContainer) flodeskContainer.hidden = false;
    if (btnSkipEmail) btnSkipEmail.hidden = false;
    emailForm.reset();

    showScreen(screenResults);
  }

  btnStart.addEventListener("click", function () {
    showScreen(screenBuilder);
  });

  btnSeePolicy.addEventListener("click", function () {
    if (btnSeePolicy.disabled) return;
    renderResults();
  });

  btnBackToBuilder.addEventListener("click", function () {
    showScreen(screenBuilder);
  });

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

  updatePreview();
})();
