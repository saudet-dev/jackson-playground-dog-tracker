const SUPABASE_URL = "https://dlhlauphqwsnchdrfbia.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PDHGD4lP_shj-5L5mjUALg_dAzQjaLz";

const PARK_ID = "jackson_playground_park";

const MSG_YES =
  "I am sorry that entitled dog owners are once again illegally utilizing this park. It is unclear why they cannot go to the two nearby dog parks, but it is certainly not fair to the people who want to enjoy the park free of dog pee and feces.";
const MSG_NO =
  "What a surprise! Looks like you got lucky not seeing a dog there today, but if you stick around for a bit you certainly will.";

const elHome = document.getElementById("home");
const elResult = document.getElementById("result");
const elYes = document.getElementById("yesBtn");
const elNo = document.getElementById("noBtn");
const elBack = document.getElementById("backBtn");
const elMsg = document.getElementById("message");
const elStatus = document.getElementById("status");
const todayOdoEl = document.getElementById("todayOdo");
const weekOdoEl = document.getElementById("weekOdo");
const elAlready = document.getElementById("alreadyNote");

function padNumber(n, width) {
  const s = String(Math.max(0, n));
  return s.length >= width ? s : "0".repeat(width - s.length) + s;
}

// Track timeouts so we can clear them when needed
let odometerTimeouts = [];

function buildOdometer(el, digits) {
  if (!el) return;
  el.innerHTML = "";
  for (let i = 0; i < digits; i++) {
    const digit = document.createElement("div");
    digit.className = "odo-digit";
    digit.dataset.value = "0";

    const card = document.createElement("div");
    card.className = "odo-card";

    const front = document.createElement("div");
    front.className = "odo-face odo-front";
    front.textContent = "0";

    const back = document.createElement("div");
    back.className = "odo-face odo-back";
    back.textContent = "0";

    card.appendChild(front);
    card.appendChild(back);
    digit.appendChild(card);
    el.appendChild(digit);
  }
}

buildOdometer(todayOdoEl, 4);
buildOdometer(weekOdoEl, 4);

function setOdometer(el, value, digits = 4) {
  if (!el) return;
  const str = padNumber(value, digits);

  let children = Array.from(el.querySelectorAll(".odo-digit"));
  if (children.length !== digits) buildOdometer(el, digits);

  children = Array.from(el.querySelectorAll(".odo-digit"));
  for (let i = 0; i < digits; i++) {
    const d = children[i];
    const card = d.querySelector(".odo-card");
    const front = d.querySelector(".odo-front");
    const back = d.querySelector(".odo-back");

    const next = str[i];
    const current = d.dataset.value;

    // Always animate, even if value hasn't changed (for satisfying effect)
    front.textContent = current;
    back.textContent = next;

    // Remove any existing event listener to prevent duplicates
    const oldHandler = card._animHandler;
    if (oldHandler) {
      card.removeEventListener('animationend', oldHandler);
    }

    // Create new handler for this animation
    const handler = () => {
      front.textContent = next;
      card.classList.remove("odo-flip");
    };
    card._animHandler = handler;
    card.addEventListener('animationend', handler, { once: true });

    card.classList.remove("odo-flip");
    void card.offsetWidth; // Force reflow
    card.classList.add("odo-flip");

    // Update the dataset immediately
    d.dataset.value = next;
  }
}

function setStatus(text) {
  if (elStatus) elStatus.textContent = text || "";
}

function fatal(text) {
  setStatus(text);
  console.error(text);
}

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function showResult(message, alreadySubmitted) {
  elMsg.textContent = message;
  elAlready.classList.toggle("hidden", !alreadySubmitted);
  elHome.classList.add("hidden");
  elResult.classList.remove("hidden");
}

function showHome() {
  elResult.classList.add("hidden");
  elHome.classList.remove("hidden");
  elAlready.classList.add("hidden");
  setStatus("");
  
  // Rebuild odometers from scratch at 0 so they're ready to animate fresh
  buildOdometer(todayOdoEl, 4);
  buildOdometer(weekOdoEl, 4);
}

// Verify Supabase library is loaded
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  fatal("Supabase failed to load. Check index.html script tag for the UMD build.");
} else if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("YOUR_")) {
  fatal("Supabase keys are missing in app.js. Add your keys at the top of the file.");
} else {
  setStatus("");

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  let isFetching = false;

  async function fetchCounts() {
    if (isFetching) return; // Skip if already fetching
    
    isFetching = true;
    try {
      const todayLocal = todayKeyLocal();

      const { data: todayRows, error: todayErr } = await supabase
        .from("v_yes_counts_today")
        .select("local_date, total_yes")
        .eq("park_id", PARK_ID)
        .eq("local_date", todayLocal)
        .limit(1);

      if (todayErr) throw todayErr;

      const now = new Date();
      const day = now.getDay(); // Sun=0, Mon=1...
      const diffToMon = (day + 6) % 7;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMon);

      const y = monday.getFullYear();
      const m = String(monday.getMonth() + 1).padStart(2, "0");
      const d = String(monday.getDate()).padStart(2, "0");
      const weekStartLocal = `${y}-${m}-${d}`;

      const { data: weekRows, error: weekErr } = await supabase
        .from("v_yes_counts_week")
        .select("week_start_local, total_yes")
        .eq("park_id", PARK_ID)
        .eq("week_start_local", weekStartLocal)
        .limit(1);

      if (weekErr) throw weekErr;

      const todayVal = Number(todayRows?.[0]?.total_yes ?? 0);
      const weekVal = Number(weekRows?.[0]?.total_yes ?? 0);

      setOdometer(todayOdoEl, todayVal, 4);
      setOdometer(weekOdoEl, weekVal, 4);

      return { todayVal, weekVal };
    } finally {
      isFetching = false;
    }
  }

  async function submit(sawDog) {
    setStatus("Submitting...");
    elYes.disabled = true;
    elNo.disabled = true;

    try {
      // Only track "already submitted" for YES reports
      const key = `submitted_yes:${PARK_ID}:${todayKeyLocal()}`;
      const alreadySubmittedYes = localStorage.getItem(key) === "1";

      // YES inserts once per device per day. NO does not insert.
      if (sawDog && !alreadySubmittedYes) {
        const { error } = await supabase.from("sightings").insert([
          { park_id: PARK_ID, saw_dog: true },
        ]);
        if (error) throw error;
        localStorage.setItem(key, "1");
      }

      // Show the result screen immediately
      showResult(sawDog ? MSG_YES : MSG_NO, sawDog ? alreadySubmittedYes : false);
      setStatus("");

      // Fetch counts AFTER showing result page so odometer is visible during animation
      if (sawDog && !alreadySubmittedYes) {
        // Give database a moment to process the insert, then animate
        setTimeout(() => {
          fetchCounts().catch((e) => fatal(`Error: ${e?.message || e}`));
        }, 800);
      } else {
        // For NO clicks or repeat YES clicks, fetch immediately
        // Use a tiny delay to ensure the result page is rendered first
        setTimeout(() => {
          fetchCounts().catch((e) => fatal(`Error: ${e?.message || e}`));
        }, 50);
      }
    } catch (e) {
      console.error(e);
      fatal(`Error: ${e?.message || e}`);
    } finally {
      elYes.disabled = false;
      elNo.disabled = false;
    }
  }

  // Attach click handlers
  elYes.addEventListener("click", () => submit(true));
  elNo.addEventListener("click", () => submit(false));
  elBack.addEventListener("click", showHome);

  // Don't fetch counts on page load - odometers start at 0 
  // and will be updated when user clicks YES/NO
}
