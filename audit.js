(function () {
  "use strict";

  var CATEGORIES = [
    {
      name: "Cash & Liquidity",
      items: [
        "I know my current checking/savings balance right now",
        "I have an emergency fund separate from my everyday checking",
        "I know how many months of expenses that fund covers"
      ]
    },
    {
      name: "Debt",
      items: [
        "I know every debt I carry and the current balance",
        "I know the interest rate on each debt",
        "I know the payoff timeline at my current payment pace"
      ]
    },
    {
      name: "Income",
      items: [
        "I know my current salary or income to the dollar",
        "I have negotiated my salary or rate within the last two years",
        "My income has kept pace with how my lifestyle and costs have grown"
      ]
    },
    {
      name: "Retirement",
      items: [
        "I know the current balance of my retirement account(s)",
        "I know my current contribution rate",
        "I have reviewed my retirement account in the last 12 months"
      ]
    },
    {
      name: "Caregiving & Hidden Costs",
      items: [
        "I have estimated the monthly cost of any caregiving I provide",
        "That cost has a real line in my financial plan",
        "I have had the money conversation with anyone it financially involves"
      ]
    },
    {
      name: "Protection & Documents",
      items: [
        "I have a will or estate documents in place",
        "My beneficiary designations are current and reflect my life today",
        "My insurance coverage fits my current life — not a prior version of it"
      ]
    },
    {
      name: "The Unfinished Conversation",
      items: [
        "I know the one financial conversation I have been avoiding",
        "I know the one number I have not looked at recently",
        "I know the one thing I keep meaning to do but have not done"
      ]
    }
  ];

  var STATES = [
    { key: "current", label: "Current", modifier: "current" },
    { key: "attention", label: "Needs Attention", modifier: "attention" },
    { key: "avoided", label: "Avoided", modifier: "avoided" }
  ];

  // Flatten once, in category order, since that order is also the
  // "next step" priority order.
  var ITEMS = [];
  CATEGORIES.forEach(function (category, categoryIndex) {
    category.items.forEach(function (text, itemIndex) {
      ITEMS.push({
        id: "c" + categoryIndex + "i" + itemIndex,
        categoryName: category.name,
        text: text,
        state: null
      });
    });
  });

  var TOTAL_ITEMS = ITEMS.length;

  var screenIntro = document.getElementById("screen-intro");
  var screenAudit = document.getElementById("screen-audit");
  var screenResults = document.getElementById("screen-results");

  var btnStart = document.getElementById("btn-start");
  var categoriesContainer = document.getElementById("audit-categories");
  var btnSeeAudit = document.getElementById("btn-see-audit");
  var progressNote = document.getElementById("audit-progress-note");

  var modalOverlay = document.getElementById("audit-modal-overlay");
  var modalText = document.getElementById("audit-modal-text");
  var btnModalGoBack = document.getElementById("btn-modal-goback");
  var btnModalContinue = document.getElementById("btn-modal-continue");

  var colCurrent = document.getElementById("col-current");
  var colAttention = document.getElementById("col-attention");
  var colAvoided = document.getElementById("col-avoided");
  var nextStepText = document.getElementById("next-step-text");
  var btnBackToChecklist = document.getElementById("btn-back-to-checklist");

  var emailForm = document.getElementById("email-form");
  var emailSuccess = document.getElementById("email-success");
  var flodeskContainer = document.getElementById("flodesk-embed-container");
  var btnSkipEmail = document.getElementById("btn-skip-email");

  function showScreen(el) {
    [screenIntro, screenAudit, screenResults].forEach(function (s) {
      s.hidden = s !== el;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateProgressNote() {
    var marked = ITEMS.filter(function (item) { return item.state !== null; }).length;
    progressNote.textContent = marked + " of " + TOTAL_ITEMS + " items marked";
  }

  function setItemState(item, row, newState) {
    item.state = item.state === newState ? null : newState;
    row.dataset.state = item.state || "";

    STATES.forEach(function (s) {
      var btn = row.querySelector('[data-toggle="' + s.key + '"]');
      btn.classList.toggle("active", item.state === s.key);
      btn.setAttribute("aria-pressed", item.state === s.key ? "true" : "false");
    });

    updateProgressNote();
  }

  function renderCategories() {
    categoriesContainer.innerHTML = "";

    CATEGORIES.forEach(function (category, categoryIndex) {
      var card = document.createElement("div");
      card.className = "audit-category";

      var title = document.createElement("p");
      title.className = "audit-category-title";
      title.textContent = (categoryIndex + 1) + ". " + category.name;
      card.appendChild(title);

      category.items.forEach(function (text, itemIndex) {
        var item = ITEMS[categoryIndex * 3 + itemIndex];

        var row = document.createElement("div");
        row.className = "audit-item";
        row.dataset.state = "";

        var label = document.createElement("span");
        label.className = "audit-item-text";
        label.textContent = text;
        row.appendChild(label);

        var toggles = document.createElement("span");
        toggles.className = "audit-toggles";

        STATES.forEach(function (s) {
          var btn = document.createElement("button");
          btn.type = "button";
          btn.className = "audit-toggle audit-toggle--" + s.modifier;
          btn.dataset.toggle = s.key;
          btn.setAttribute("aria-pressed", "false");
          btn.textContent = s.label;
          btn.addEventListener("click", function () {
            setItemState(item, row, s.key);
          });
          toggles.appendChild(btn);
        });

        row.appendChild(toggles);
        card.appendChild(row);
      });

      categoriesContainer.appendChild(card);
    });

    updateProgressNote();
  }

  function renderColumn(listEl, stateKey) {
    listEl.innerHTML = "";
    var matches = ITEMS.filter(function (item) { return item.state === stateKey; });

    if (matches.length === 0) {
      var empty = document.createElement("li");
      empty.className = "audit-column-empty";
      empty.textContent = "Nothing marked here.";
      listEl.appendChild(empty);
      return;
    }

    matches.forEach(function (item) {
      var li = document.createElement("li");
      li.className = "audit-column-item";

      var tag = document.createElement("span");
      tag.className = "audit-item-category-tag";
      tag.textContent = item.categoryName;

      li.appendChild(tag);
      li.appendChild(document.createTextNode(item.text));
      listEl.appendChild(li);
    });
  }

  function computeNextStep() {
    var priorityItem = ITEMS.find(function (item) { return item.state === "avoided"; });
    if (!priorityItem) {
      priorityItem = ITEMS.find(function (item) { return item.state === "attention"; });
    }

    if (priorityItem) {
      return '“' + priorityItem.text + '.” That’s the one to start with.';
    }

    return "Your foundation is solid. The next move is to schedule an annual review date so it stays that way.";
  }

  function renderResults() {
    renderColumn(colCurrent, "current");
    renderColumn(colAttention, "attention");
    renderColumn(colAvoided, "avoided");
    nextStepText.textContent = computeNextStep();

    emailForm.hidden = false;
    emailSuccess.hidden = true;
    if (flodeskContainer) flodeskContainer.hidden = false;
    emailForm.reset();

    showScreen(screenResults);
  }

  function openModal(unmarkedCount) {
    modalText.textContent = "You have " + unmarkedCount + " item" +
      (unmarkedCount === 1 ? "" : "s") +
      " unmarked. Want to mark them before viewing your results?";
    modalOverlay.hidden = false;
  }

  function closeModal() {
    modalOverlay.hidden = true;
  }

  btnStart.addEventListener("click", function () {
    showScreen(screenAudit);
  });

  btnSeeAudit.addEventListener("click", function () {
    var unmarkedCount = ITEMS.filter(function (item) { return item.state === null; }).length;
    if (unmarkedCount > 0) {
      openModal(unmarkedCount);
    } else {
      renderResults();
    }
  });

  btnModalGoBack.addEventListener("click", function () {
    closeModal();
  });

  btnModalContinue.addEventListener("click", function () {
    closeModal();
    renderResults();
  });

  btnBackToChecklist.addEventListener("click", function () {
    showScreen(screenAudit);
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

  renderCategories();
})();
