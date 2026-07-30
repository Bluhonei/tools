(function () {
  "use strict";

  var CATEGORIES = [
    {
      name: "Cash & Liquidity",
      items: [
        {
          text: "I know my current checking/savings balance right now",
          action: "Open your banking app right now and write the number down. That's the only starting point that's real."
        },
        {
          text: "I have an emergency fund separate from my everyday checking",
          action: "Open a separate savings account today — most banks allow this online in under five minutes. Name it Emergency Fund."
        },
        {
          text: "I know how many months of expenses that fund covers",
          action: "Divide your emergency fund balance by your monthly fixed costs. That's your number."
        }
      ]
    },
    {
      name: "Debt",
      items: [
        {
          text: "I know every debt I carry and the current balance",
          action: "Pull your free credit report at annualcreditreport.com — it lists every debt in one place. Takes ten minutes."
        },
        {
          text: "I know the interest rate on each debt",
          action: "Log into each account or call the number on the back of the card. Write the rate next to each balance."
        },
        {
          text: "I know the payoff timeline at my current payment pace",
          action: "Use a free debt payoff calculator — search \"debt payoff calculator\" and enter your balance, rate, and monthly payment."
        }
      ]
    },
    {
      name: "Income",
      items: [
        {
          text: "I know my current salary or income to the dollar",
          action: "Write your exact take-home and gross income on paper right now. If you have to estimate, that is the problem."
        },
        {
          text: "I have negotiated my salary or rate within the last two years",
          action: "Search your title on LinkedIn Salary or Glassdoor today. Know the number before the next conversation."
        },
        {
          text: "My income has kept pace with how my lifestyle and costs have grown",
          action: "Add up your fixed monthly costs and compare to what you earned three years ago. The gap tells you what the number needs to be."
        }
      ]
    },
    {
      name: "Retirement",
      items: [
        {
          text: "I know the current balance of my retirement account(s)",
          action: "Log into your retirement account today — just to see it. You do not have to do anything else yet."
        },
        {
          text: "I know my current contribution rate",
          action: "Find the contribution percentage in your benefits portal. If it is below 10%, that is the gap to close first."
        },
        {
          text: "I have reviewed my retirement account in the last 12 months",
          action: "Set a calendar reminder for 30 minutes this week to review your allocation. That is all it takes."
        }
      ]
    },
    {
      name: "Caregiving & Hidden Costs",
      items: [
        {
          text: "I have estimated the monthly cost of any caregiving I provide",
          action: "Write down every caregiving task you do in a week and estimate the hours. Multiply by your hourly rate. That is what it costs."
        },
        {
          text: "That cost has a real line in my financial plan",
          action: "Add a line called Caregiving to your monthly budget — even if the number is an estimate. Named costs get managed."
        },
        {
          text: "I have had the money conversation with anyone it financially involves",
          action: "Choose one person this involves and send a message this week asking to talk. You do not need a plan to start the conversation."
        }
      ]
    },
    {
      name: "Protection & Documents",
      items: [
        {
          text: "I have a will or estate documents in place",
          action: "Search Trust and Will or Tomorrow online — both have options under $200 and take about 20 minutes to complete."
        },
        {
          text: "My beneficiary designations are current and reflect my life today",
          action: "Log into every retirement account and insurance policy today and check the beneficiary field. This takes fifteen minutes."
        },
        {
          text: "My insurance coverage fits my current life — not a prior version of it",
          action: "Pull out your current policy and check the coverage date and amounts. If it is more than two years old, call your provider."
        }
      ]
    },
    {
      name: "The Unfinished Conversation",
      items: [
        {
          text: "I know the one financial conversation I have been avoiding",
          action: "Write the conversation topic on paper and identify the one person it involves. Name the date you will have it — even if that date is two weeks away."
        },
        {
          text: "I know the one number I have not looked at recently",
          action: "Open it today. Just look. You do not have to act on it yet — but looking changes everything."
        },
        {
          text: "I know the one thing I keep meaning to do but have not done",
          action: "Put it on your calendar for this week with a 30-minute block. That is the entire next step."
        }
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
    category.items.forEach(function (itemData, itemIndex) {
      ITEMS.push({
        id: "c" + categoryIndex + "i" + itemIndex,
        categoryName: category.name,
        text: itemData.text,
        action: itemData.action,
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
  var nextStepAction = document.getElementById("next-step-action");
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

      category.items.forEach(function (itemData, itemIndex) {
        var item = ITEMS[categoryIndex * 3 + itemIndex];

        var row = document.createElement("div");
        row.className = "audit-item";
        row.dataset.state = "";

        var label = document.createElement("span");
        label.className = "audit-item-text";
        label.textContent = item.text;
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
      li.textContent = item.text;
      listEl.appendChild(li);
    });
  }

  function computeNextStep() {
    var priorityItem = ITEMS.find(function (item) { return item.state === "avoided"; });
    if (!priorityItem) {
      priorityItem = ITEMS.find(function (item) { return item.state === "attention"; });
    }

    if (priorityItem) {
      return { text: priorityItem.text + ".", action: priorityItem.action };
    }

    return {
      text: "Your foundation is solid. The next move is to schedule an annual review date so it stays that way.",
      action: null
    };
  }

  function renderResults() {
    renderColumn(colCurrent, "current");
    renderColumn(colAttention, "attention");
    renderColumn(colAvoided, "avoided");

    var next = computeNextStep();
    nextStepText.textContent = next.text;
    if (next.action) {
      nextStepAction.textContent = next.action;
      nextStepAction.hidden = false;
    } else {
      nextStepAction.textContent = "";
      nextStepAction.hidden = true;
    }

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
