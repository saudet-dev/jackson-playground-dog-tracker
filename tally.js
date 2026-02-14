const SUPABASE_URL = "https://dlhlauphqwsnchdrfbia.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_PDHGD4lP_shj-5L5mjUALg_dAzQjaLz";

const todayOdoEl = document.getElementById("todayOdo");
const weekOdoEl = document.getElementById("weekOdo");

function padNumber(n, width) {
  const s = String(Math.max(0, n));
  return s.length >= width ? s : "0".repeat(width - s.length) + s;
}

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
    front.textContent = current;
    back.textContent = next;
    const oldHandler = card._animHandler;
    if (oldHandler) card.removeEventListener("animationend", oldHandler);
    const handler = () => {
      front.textContent = next;
      card.classList.remove("odo-flip");
    };
    card._animHandler = handler;
    card.addEventListener("animationend", handler, { once: true });
    card.classList.remove("odo-flip");
    void card.offsetWidth;
    card.classList.add("odo-flip");
    d.dataset.value = next;
  }
}

function todayKeyLocal() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

if (window.supabase && typeof window.supabase.createClient === "function") {
  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function fetchCounts() {
    const todayLocal = todayKeyLocal();
    const { data: todayRows, error: todayErr } = await supabase
      .from("v_yes_counts_today")
      .select("local_date, total_yes")
      .eq("park_id", PARK_ID)
      .eq("local_date", todayLocal)
      .limit(1);
    if (todayErr) { console.error(todayErr); return; }

    const now = new Date();
    const day = now.getDay();
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
    if (weekErr) { console.error(weekErr); return; }

    const todayVal = Number(todayRows?.[0]?.total_yes ?? 0);
    const weekVal = Number(weekRows?.[0]?.total_yes ?? 0);

    setTimeout(() => {
      setOdometer(todayOdoEl, todayVal, 4);
      setOdometer(weekOdoEl, weekVal, 4);
    }, 300);
  }

  fetchCounts();
}