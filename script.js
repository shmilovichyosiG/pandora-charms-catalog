const ALL_LABEL = "-- הכל --";

let allCharms = []; // [{ index, name, topic, subTopic, available, note, imageUrl }]

const els = {
  topicFilter: document.getElementById("topicFilter"),
  subTopicFilter: document.getElementById("subTopicFilter"),
  availabilityFilter: document.getElementById("availabilityFilter"),
  searchInput: document.getElementById("searchInput"),
  charmNamesList: document.getElementById("charmNamesList"),
  clearFiltersBtn: document.getElementById("clearFiltersBtn"),
  charmsGrid: document.getElementById("charmsGrid"),
  emptyMessage: document.getElementById("emptyMessage"),
  resultsCount: document.getElementById("resultsCount"),
};

/* ---------- אתחול ---------- */

function init() {
  if (typeof CHARMS_DATA === "undefined") {
    els.resultsCount.textContent = "לא נמצא charms-data.js - יש להריץ build.bat קודם";
    return;
  }

  allCharms = CHARMS_DATA;

  populateFilterOptions();
  populateCharmNamesList();
  render();
}

/* ---------- מילוי תיבות הסינון ---------- */

function distinctSorted(values) {
  return [...new Set(values.filter((v) => v))].sort((a, b) => a.localeCompare(b, "he"));
}

function fillSelect(selectEl, values) {
  selectEl.innerHTML = "";
  const allOption = document.createElement("option");
  allOption.value = ALL_LABEL;
  allOption.textContent = ALL_LABEL;
  selectEl.appendChild(allOption);

  values.forEach((v) => {
    const opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    selectEl.appendChild(opt);
  });
}

function populateFilterOptions() {
  fillSelect(els.topicFilter, distinctSorted(allCharms.map((c) => c.topic)));
  fillSelect(els.subTopicFilter, distinctSorted(allCharms.map((c) => c.subTopic)));
}

function populateCharmNamesList() {
  els.charmNamesList.innerHTML = "";
  distinctSorted(allCharms.map((c) => c.name)).forEach((name) => {
    const opt = document.createElement("option");
    opt.value = name;
    els.charmNamesList.appendChild(opt);
  });
}

/* ---------- סינון ותצוגה ---------- */

function getFilteredCharms() {
  const topic = els.topicFilter.value;
  const subTopic = els.subTopicFilter.value;
  const availability = els.availabilityFilter.value;
  const search = els.searchInput.value.trim().toLowerCase();

  return allCharms.filter((c) => {
    if (topic !== ALL_LABEL && c.topic !== topic) return false;
    if (subTopic !== ALL_LABEL && c.subTopic !== subTopic) return false;
    if (availability !== ALL_LABEL && c.available !== availability) return false;
    if (search && !c.name.toLowerCase().includes(search)) return false;
    return true;
  });
}

function render() {
  const filtered = getFilteredCharms();

  els.resultsCount.textContent = `${filtered.length} מתוך ${allCharms.length} חרוזים`;
  els.charmsGrid.innerHTML = "";

  if (filtered.length === 0) {
    els.emptyMessage.classList.remove("hidden");
    return;
  }
  els.emptyMessage.classList.add("hidden");

  filtered.forEach((charm) => {
    const card = document.createElement("article");
    card.className = "charm-card";

    let badgeHtml = "";
    if (charm.available === "יש") {
      badgeHtml = `<span class="availability-badge available" title="יש במלאי">★</span>`;
    } else if (charm.available === "אין") {
      badgeHtml = `<span class="availability-badge unavailable" title="אין במלאי">★</span>`;
    }

    const topicsLine = [charm.topic, charm.subTopic].filter(Boolean).join(" · ");

    card.innerHTML = `
      <div class="charm-media">
        <img src="${charm.imageUrl}" alt="${escapeHtml(charm.name)}" loading="lazy" />
        ${badgeHtml}
      </div>
      <div class="charm-info">
        <span class="charm-topics">${escapeHtml(topicsLine)}</span>
        <div class="charm-name">${escapeHtml(charm.name)}</div>
        ${charm.note ? `<div class="charm-note">${escapeHtml(charm.note)}</div>` : ""}
      </div>
    `;
    els.charmsGrid.appendChild(card);
  });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- אירועים ---------- */

els.topicFilter.addEventListener("change", render);
els.subTopicFilter.addEventListener("change", render);
els.availabilityFilter.addEventListener("change", render);
els.searchInput.addEventListener("input", render);

els.clearFiltersBtn.addEventListener("click", () => {
  els.topicFilter.value = ALL_LABEL;
  els.subTopicFilter.value = ALL_LABEL;
  els.availabilityFilter.value = ALL_LABEL;
  els.searchInput.value = "";
  render();
});

init();
