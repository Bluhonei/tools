(function () {
  "use strict";

  var screenIntro = document.getElementById("screen-intro");
  var screenWorksheet = document.getElementById("screen-worksheet");
  var screenResults = document.getElementById("screen-results");

  var btnStart = document.getElementById("btn-start");
  var btnSeePlan = document.getElementById("btn-see-plan");
  var btnBackToWorksheet = document.getElementById("btn-back-to-worksheet");

  var inputSummerNumber = document.getElementById("summer-number");
  var inputBucketCalendar = document.getElementById("bucket-calendar");
  var inputBucketMotion = document.getElementById("bucket-motion");
  var inputBucketHeat = document.getElementById("bucket-heat");
  var bucketTotalAmountEl = document.getElementById("bucket-total-amount");
  var bucketCompareMessageEl = document.getElementById("bucket-compare-message");

  var inputAdvanceNo = document.getElementById("advance-no");

  var inputMonthlyIncome = document.getElementById("monthly-income");
  var inputMonthlyFixed = document.getElementById("monthly-fixed");
  var realityAmountEl = document.getElementById("reality-amount");
  var realityCompareMessageEl = document.getElementById("reality-compare-message");

  var cardSummerNumber = document.getElementById("card-summer-number");
  var cardBucketCalendar = document.getElementById("card-bucket-calendar");
  var cardBucketMotion = document.getElementById("card-bucket-motion");
  var cardBucketHeat = document.getElementById("card-bucket-heat");
  var cardBucketTotal = document.getElementById("card-bucket-total");
  var cardAdvanceNo = document.getElementById("card-advance-no");
  var cardRealityCheck = document.getElementById("card-reality-check");
  var editorialLine = document.getElementById("editorial-line");

  var emailForm = document.getElementById("email-form");
  var emailSuccess = document.getElementById("email-success");
  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var btnSkipEmail = document.getElementById("btn-skip-email");

  function parseDollar(el) {
    if (el.value === "") return null;
    var n = parseFloat(el.value);
    if (isNaN(n)) return null;
    return Math.max(0, n);
  }

  function formatCurrency(n) {
    var sign = n < 0 ? "-" : "";
    return sign + "$" + Math.round(Math.abs(n)).toLocaleString("en-US");
  }

  function showScreen(el) {
    [screenIntro, screenWorksheet, screenResults].forEach(function (s) {
      s.hidden = s !== el;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateBucketCalc() {
    var summerNumber = parseDollar(inputSummerNumber);
    var b1 = parseDollar(inputBucketCalendar) || 0;
    var b2 = parseDollar(inputBucketMotion) || 0;
    var b3 = parseDollar(inputBucketHeat) || 0;
    var bucketTotal = b1 + b2 + b3;

    bucketTotalAmountEl.textContent = formatCurrency(bucketTotal);

    if (summerNumber === null) {
      bucketCompareMessageEl.hidden = true;
      return;
    }

    bucketCompareMessageEl.hidden = false;
    var diff = summerNumber - bucketTotal;

    if (diff < 0) {
      bucketCompareMessageEl.textContent = "Your buckets exceed your summer number by " +
        formatCurrency(Math.abs(diff)) + ". Adjust before continuing.";
      bucketCompareMessageEl.className = "live-calc-message live-calc-message--red";
    } else if (diff > 0) {
      bucketCompareMessageEl.textContent = "You have " + formatCurrency(diff) + " of unallocated room.";
      bucketCompareMessageEl.className = "live-calc-message live-calc-message--green";
    } else {
      bucketCompareMessageEl.textContent = "Your buckets match your summer number exactly.";
      bucketCompareMessageEl.className = "live-calc-message live-calc-message--gold";
    }
  }

  function updateRealityCalc() {
    var income = parseDollar(inputMonthlyIncome);
    var fixed = parseDollar(inputMonthlyFixed);
    var summerNumber = parseDollar(inputSummerNumber);

    if (income === null || fixed === null) {
      realityAmountEl.textContent = "$0";
      realityCompareMessageEl.hidden = true;
      return;
    }

    var summerDiscretionary = (income - fixed) * 3;
    realityAmountEl.textContent = formatCurrency(summerDiscretionary);

    if (summerNumber === null) {
      realityCompareMessageEl.hidden = true;
      return;
    }

    realityCompareMessageEl.hidden = false;
    var diff = summerDiscretionary - summerNumber;

    if (diff >= 0) {
      realityCompareMessageEl.textContent = "Your summer number is within what your budget can absorb.";
      realityCompareMessageEl.className = "live-calc-message live-calc-message--green";
    } else {
      realityCompareMessageEl.textContent = "Your summer number exceeds your available discretionary by " +
        formatCurrency(Math.abs(diff)) + ". Consider adjusting your summer number or one of your buckets.";
      realityCompareMessageEl.className = "live-calc-message live-calc-message--amber";
    }
  }

  function updateButtonState() {
    var ready = parseDollar(inputSummerNumber) !== null &&
      parseDollar(inputBucketCalendar) !== null &&
      parseDollar(inputBucketMotion) !== null &&
      parseDollar(inputBucketHeat) !== null;
    btnSeePlan.disabled = !ready;
  }

  function handleInput() {
    updateBucketCalc();
    updateRealityCalc();
    updateButtonState();
  }

  [inputSummerNumber, inputBucketCalendar, inputBucketMotion, inputBucketHeat, inputMonthlyIncome, inputMonthlyFixed]
    .forEach(function (el) {
      el.addEventListener("input", handleInput);
    });

  function renderResults() {
    var summerNumber = parseDollar(inputSummerNumber) || 0;
    var b1 = parseDollar(inputBucketCalendar) || 0;
    var b2 = parseDollar(inputBucketMotion) || 0;
    var b3 = parseDollar(inputBucketHeat) || 0;
    var bucketTotal = b1 + b2 + b3;
    var advanceNo = inputAdvanceNo.value.trim();
    var income = parseDollar(inputMonthlyIncome);
    var fixed = parseDollar(inputMonthlyFixed);

    cardSummerNumber.textContent = formatCurrency(summerNumber);
    cardBucketCalendar.textContent = formatCurrency(b1);
    cardBucketMotion.textContent = formatCurrency(b2);
    cardBucketHeat.textContent = formatCurrency(b3);
    cardBucketTotal.textContent = formatCurrency(bucketTotal);

    cardAdvanceNo.textContent = advanceNo ||
      "You haven't named one yet — you can still add it before sending your plan.";

    var fits = true;

    if (income !== null && fixed !== null) {
      var summerDiscretionary = (income - fixed) * 3;
      var diff = summerDiscretionary - summerNumber;
      fits = diff >= 0;

      cardRealityCheck.textContent = fits
        ? "Your summer plan fits within your available discretionary income."
        : "Your summer plan exceeds your available discretionary income by " + formatCurrency(Math.abs(diff)) + ".";
      cardRealityCheck.className = "summer-card-text " +
        (fits ? "summer-card-text--green" : "summer-card-text--amber");
    } else {
      cardRealityCheck.textContent =
        "Add your income and fixed costs above to see whether this plan fits your budget.";
      cardRealityCheck.className = "summer-card-text";
    }

    editorialLine.textContent = fits
      ? "The number is named. The season has a shape. That's the grown woman IQ move — anticipating before the pressure arrives, not auditing after it's already gone."
      : "The gap between what summer costs and what your budget can absorb is now visible. That's the point. Adjust one bucket or raise your advance no — and the season becomes something you planned for instead of recovered from.";

    emailForm.hidden = false;
    emailSuccess.hidden = true;
    if (flodeskContainer) flodeskContainer.hidden = false;
    if (btnSkipEmail) btnSkipEmail.hidden = false;
    emailForm.reset();

    showScreen(screenResults);
  }

  btnStart.addEventListener("click", function () {
    showScreen(screenWorksheet);
  });

  btnSeePlan.addEventListener("click", function () {
    if (btnSeePlan.disabled) return;
    renderResults();
  });

  btnBackToWorksheet.addEventListener("click", function () {
    showScreen(screenWorksheet);
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

  updateBucketCalc();
  updateRealityCalc();
  updateButtonState();
})();
