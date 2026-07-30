(function () {
  "use strict";

  var screenIntro = document.getElementById("screen-intro");
  var screenCalculator = document.getElementById("screen-calculator");
  var screenResults = document.getElementById("screen-results");

  var btnStart = document.getElementById("btn-start");
  var btnSeeFloor = document.getElementById("btn-see-floor");
  var btnBackToCalculator = document.getElementById("btn-back-to-calculator");

  var costInputs = [
    document.getElementById("cost-housing"),
    document.getElementById("cost-utilities"),
    document.getElementById("cost-insurance"),
    document.getElementById("cost-debt"),
    document.getElementById("cost-subscriptions"),
    document.getElementById("cost-groceries"),
    document.getElementById("cost-transportation")
  ];
  var floorTotalAmountEl = document.getElementById("floor-total-amount");

  var cashInputs = [
    document.getElementById("cash-checking"),
    document.getElementById("cash-savings"),
    document.getElementById("cash-other")
  ];
  var cashTotalAmountEl = document.getElementById("cash-total-amount");

  var coverageResultEl = document.getElementById("coverage-result");

  var transitionOptions = document.querySelectorAll("#transition-options .option-card");
  var transitionMessageEl = document.getElementById("transition-message");
  var transitionSubtextEl = document.getElementById("transition-subtext");

  var cardMonthlyFloor = document.getElementById("card-monthly-floor");
  var cardAccessibleCash = document.getElementById("card-accessible-cash");
  var cardFloorCoverage = document.getElementById("card-floor-coverage");
  var cardTransitionGap = document.getElementById("card-transition-gap");
  var editorialLine = document.getElementById("editorial-line");

  var emailForm = document.getElementById("email-form");
  var emailSuccess = document.getElementById("email-success");
  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var btnSkipEmail = document.getElementById("btn-skip-email");

  var selectedMonths = 3;
  var selectedLabel = "3";

  function parseDollar(el) {
    if (el.value === "") return 0;
    var n = parseFloat(el.value);
    if (isNaN(n)) return 0;
    return Math.max(0, n);
  }

  function formatCurrency(n) {
    var sign = n < 0 ? "-" : "";
    return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  }

  function sumInputs(inputs) {
    return inputs.reduce(function (total, el) { return total + parseDollar(el); }, 0);
  }

  function showScreen(el) {
    [screenIntro, screenCalculator, screenResults].forEach(function (s) {
      s.hidden = s !== el;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function getCoverageBucket(months) {
    if (months >= 3) return "plum";
    if (months >= 1) return "amber";
    return "red";
  }

  function updateCalculations() {
    var monthlyFloor = sumInputs(costInputs);
    var accessibleCash = sumInputs(cashInputs);

    floorTotalAmountEl.textContent = formatCurrency(monthlyFloor);
    cashTotalAmountEl.textContent = formatCurrency(accessibleCash);

    if (monthlyFloor > 0) {
      var months = Math.round((accessibleCash / monthlyFloor) * 10) / 10;
      var bucket = getCoverageBucket(months);
      coverageResultEl.textContent = "Your floor holds for approximately " + months + " months";
      coverageResultEl.className = "live-calc-total live-calc-total--large live-calc-total--" + bucket;
    } else {
      coverageResultEl.textContent = "Add your monthly floor and accessible cash above to see your coverage.";
      coverageResultEl.className = "live-calc-total live-calc-total--large";
    }

    var target = selectedMonths * monthlyFloor;
    var gap = target - accessibleCash;

    if (monthlyFloor === 0 && accessibleCash === 0) {
      transitionMessageEl.textContent = "";
      transitionMessageEl.className = "live-calc-message";
      transitionSubtextEl.hidden = true;
    } else if (gap <= 0) {
      transitionMessageEl.textContent = "Your transition fund target is covered. Your floor is solid.";
      transitionMessageEl.className = "live-calc-message live-calc-message--green";
      transitionSubtextEl.hidden = true;
    } else {
      transitionMessageEl.textContent = "Your transition fund gap is approximately " + formatCurrency(gap);
      transitionMessageEl.className = "live-calc-message live-calc-message--amber";
      transitionSubtextEl.hidden = false;
    }

    btnSeeFloor.disabled = !(monthlyFloor > 0 && accessibleCash > 0);
  }

  costInputs.concat(cashInputs).forEach(function (el) {
    el.addEventListener("input", updateCalculations);
  });

  transitionOptions.forEach(function (card) {
    card.addEventListener("click", function () {
      transitionOptions.forEach(function (c) { c.classList.remove("selected"); });
      card.classList.add("selected");
      selectedMonths = parseFloat(card.dataset.months);
      selectedLabel = card.dataset.label;
      updateCalculations();
    });
  });

  function renderResults() {
    var monthlyFloor = sumInputs(costInputs);
    var accessibleCash = sumInputs(cashInputs);
    var months = Math.round((accessibleCash / monthlyFloor) * 10) / 10;
    var bucket = getCoverageBucket(months);
    var target = selectedMonths * monthlyFloor;
    var gap = target - accessibleCash;
    var covered = gap <= 0;

    cardMonthlyFloor.textContent = formatCurrency(monthlyFloor);
    cardAccessibleCash.textContent = formatCurrency(accessibleCash);

    cardFloorCoverage.textContent = "Approximately " + months + " months";
    cardFloorCoverage.className = "summer-card-amount summer-card-amount--" + bucket;

    cardTransitionGap.textContent = covered
      ? "Covered"
      : "Approximately " + formatCurrency(gap) + " to reach your " + selectedLabel + "-month target";

    if (months >= 3 && covered) {
      editorialLine.textContent = "The floor is solid. What you've built here is the thing that turns a disruption into a decision instead of a crisis.";
    } else if (months >= 3) {
      editorialLine.textContent = "The floor holds. The transition runway needs work — but that's a different problem than not having a floor at all. Build toward the gap one month at a time.";
    } else if (months >= 1) {
      editorialLine.textContent = "Three months is the number that changes everything. It's the difference between reacting and choosing. These are estimates — and that's fine. The point isn't precision. It's proximity. A rough floor number you can see is more useful than an exact number you've never calculated.";
    } else {
      editorialLine.textContent = "The gap is visible now — which means it can be closed. One month of floor coverage, built deliberately, is the first move. Everything else follows from there. These are estimates — use them as a starting point, not a verdict.";
    }

    emailForm.hidden = false;
    emailSuccess.hidden = true;
    if (flodeskContainer) flodeskContainer.hidden = false;
    if (btnSkipEmail) btnSkipEmail.hidden = false;
    emailForm.reset();

    showScreen(screenResults);
  }

  btnStart.addEventListener("click", function () {
    showScreen(screenCalculator);
  });

  btnSeeFloor.addEventListener("click", function () {
    if (btnSeeFloor.disabled) return;
    renderResults();
  });

  btnBackToCalculator.addEventListener("click", function () {
    showScreen(screenCalculator);
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

  updateCalculations();
})();
