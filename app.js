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
const elToday = document.getElementById("todayCount");
const elWeek = document.getElementById("weekCount");
const elAlready = document.getElementById("alreadyNote");

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
}

// 1) Verify Supabase library is actually loaded
if (!window.supabase || typeof window.supabase.createClient !== "function") {
  fatal("Supabase failed to load. Check index.html script tag for the UMD build.");
} else if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes("PASTE_")) {
  fatal("Supabase keys are missing in app.js. Paste the sb_publishable key.");
} else {
  setStatus("JS loaded.");

  const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function fetchCounts() {
    const todayLocal = todayKeyLocal();

    const { data: todayRows, error: todayErr } = await supabase
      .from("v_counts_today")
      .select("local_date, total_count")
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
      .from("v_counts_week")
      .select("week_start_local, total_count")
      .eq("park_id", PARK_ID)
      .eq("week_start_local", weekStartLocal)
      .limit(1);

    if (weekErr) throw weekErr;

    elToday.textContent = String(todayRows?.[0]?.total_count ?? 0);
    elWeek.textContent = String(weekRows?.[0]?.total_count ?? 0);
  }

  async function submit(sawDog) {
    setStatus("Submitting...");
    elYes.disabled = true;
    elNo.disabled = true;

    try {
      const key = `submitted:${PARK_ID}:${todayKeyLocal()}`;
      const alreadySubmitted = localStorage.getItem(key) === "1";

      if (!alreadySubmitted) {
        const { error } = await supabase.from("sightings").insert([
          { park_id: PARK_ID, saw_dog: sawDog },
        ]);
        if (error) throw error;
        localStorage.setItem(key, "1");
      }

      await fetchCounts();
      showResult(sawDog ? MSG_YES : MSG_NO, alreadySubmitted);
      setStatus("");
    } catch (e) {
      console.error(e);
      fatal(`Error: ${e?.message || e}`);
    } finally {
      elYes.disabled = false;
      elNo.disabled = false;
    }
  }

  // 2) Verify click handlers attach
  elYes.addEventListener("click", () => submit(true));
  elNo.addEventListener("click", () => submit(false));
  elBack.addEventListener("click", showHome);

  // 3) Load counts immediately
  fetchCounts().then(() => setStatus("Ready.")).catch((e) => fatal(`Error: ${e?.message || e}`));
}
