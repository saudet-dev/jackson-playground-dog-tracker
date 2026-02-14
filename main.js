const PARKS = [
  { name: "Jackson Playground Park", slug: "jacksonplayground",
    svg: `<svg viewBox="0 0 200 160"><path d="M30 20 L170 15 L175 140 L25 145 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="60" cy="60" r="8" fill="#16a34a" opacity="0.3"/><circle cx="140" cy="50" r="12" fill="#16a34a" opacity="0.25"/><circle cx="100" cy="110" r="10" fill="#16a34a" opacity="0.3"/><rect x="80" y="40" width="40" height="25" rx="2" fill="#16a34a" opacity="0.15"/></svg>` },
  { name: "Jefferson Square Park", slug: "jeffersonsquare",
    svg: `<svg viewBox="0 0 200 160"><rect x="30" y="15" width="140" height="130" rx="4" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="70" cy="55" r="15" fill="#16a34a" opacity="0.2"/><circle cx="130" cy="100" r="12" fill="#16a34a" opacity="0.25"/><ellipse cx="100" cy="75" rx="20" ry="10" fill="#16a34a" opacity="0.15"/></svg>` },
  { name: "Alamo Square Park", slug: "alamosquare",
    svg: `<svg viewBox="0 0 200 160"><path d="M25 140 L25 35 Q100 5 175 35 L175 140 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="70" cy="90" r="10" fill="#16a34a" opacity="0.25"/><circle cx="130" cy="70" r="14" fill="#16a34a" opacity="0.2"/><circle cx="100" cy="120" r="8" fill="#16a34a" opacity="0.3"/><path d="M60 50 Q100 35 140 50" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.3"/></svg>` },
  { name: "Dolores Park", slug: "dolorespark",
    svg: `<svg viewBox="0 0 200 160"><path d="M55 10 L145 10 L145 150 L55 150 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="80" cy="45" r="10" fill="#16a34a" opacity="0.25"/><circle cx="120" cy="90" r="14" fill="#16a34a" opacity="0.2"/><circle cx="85" cy="130" r="8" fill="#16a34a" opacity="0.3"/><rect x="95" y="30" width="30" height="20" rx="3" fill="#16a34a" opacity="0.15"/><ellipse cx="100" cy="75" rx="25" ry="8" fill="#16a34a" opacity="0.1"/></svg>` },
  { name: "Buena Vista Park", slug: "buenavista",
    svg: `<svg viewBox="0 0 200 160"><path d="M100 10 Q155 15 175 50 Q185 90 160 120 Q130 150 90 145 Q50 140 25 110 Q15 75 35 45 Q60 12 100 10 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="90" cy="60" r="12" fill="#16a34a" opacity="0.25"/><circle cx="120" cy="100" r="10" fill="#16a34a" opacity="0.2"/><circle cx="70" cy="105" r="8" fill="#16a34a" opacity="0.3"/><path d="M60 70 Q100 55 140 75" stroke="#16a34a" stroke-width="1" fill="none" opacity="0.3"/></svg>` },
  { name: "Lafayette Park", slug: "lafayettepark",
    svg: `<svg viewBox="0 0 200 160"><path d="M25 20 L175 20 L175 140 L25 140 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="100" cy="65" r="25" fill="#16a34a" opacity="0.15"/><circle cx="60" cy="110" r="10" fill="#16a34a" opacity="0.25"/><circle cx="145" cy="50" r="8" fill="#16a34a" opacity="0.3"/><path d="M40 80 Q100 50 160 80" stroke="#16a34a" stroke-width="1.5" fill="none" opacity="0.25"/></svg>` },
  { name: "Duboce Park", slug: "dubocepark",
    svg: `<svg viewBox="0 0 200 160"><path d="M20 25 L180 20 L175 90 L120 95 L115 145 L25 140 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="90" cy="55" r="12" fill="#16a34a" opacity="0.25"/><circle cx="50" cy="100" r="9" fill="#16a34a" opacity="0.2"/><circle cx="145" cy="55" r="10" fill="#16a34a" opacity="0.2"/><rect x="60" y="105" width="30" height="20" rx="3" fill="#16a34a" opacity="0.15"/></svg>` },
  { name: "Bayfront Park", slug: "bayfrontpark",
    svg: `<svg viewBox="0 0 200 160"><path d="M15 60 Q50 15 100 20 Q150 25 185 55 Q190 80 180 110 Q140 140 100 135 Q55 130 20 105 Q10 85 15 60 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><path d="M30 75 Q100 50 170 75" stroke="#16a34a" stroke-width="1" fill="none" opacity="0.3"/><circle cx="80" cy="80" r="10" fill="#16a34a" opacity="0.25"/><circle cx="135" cy="90" r="8" fill="#16a34a" opacity="0.2"/></svg>` },
  { name: "Yerba Buena Gardens", slug: "yerbabuena",
    svg: `<svg viewBox="0 0 200 160"><rect x="15" y="25" width="75" height="115" rx="4" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><rect x="110" y="25" width="75" height="115" rx="4" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="52" cy="65" r="10" fill="#16a34a" opacity="0.25"/><circle cx="148" cy="90" r="12" fill="#16a34a" opacity="0.2"/><rect x="30" y="100" width="40" height="15" rx="2" fill="#16a34a" opacity="0.15"/><rect x="125" y="45" width="35" height="20" rx="2" fill="#16a34a" opacity="0.15"/></svg>` },
  { name: "The Panhandle", slug: "panhandle",
    svg: `<svg viewBox="0 0 200 160"><path d="M5 55 Q10 45 30 42 L170 38 Q190 40 195 55 L195 105 Q190 118 170 120 L30 118 Q10 115 5 105 Z" fill="#4ade80" stroke="#16a34a" stroke-width="2"/><circle cx="40" cy="75" r="8" fill="#16a34a" opacity="0.25"/><circle cx="90" cy="85" r="10" fill="#16a34a" opacity="0.2"/><circle cx="145" cy="70" r="9" fill="#16a34a" opacity="0.25"/><path d="M20 80 L180 80" stroke="#16a34a" stroke-width="1" opacity="0.2" stroke-dasharray="4 4"/></svg>` },
];

function createParkCard(park) {
  const card = document.createElement("a");
  card.href = `${park.slug}-tally/`;
  card.className = "park-card";
  card.innerHTML = `
    <div class="park-label">${park.name}</div>
    <div class="park-shape">
      ${park.svg}
    </div>
  `;
  return card;
}

function renderParks() {
  const grid = document.getElementById("parkGrid");
  PARKS.forEach((park) => grid.appendChild(createParkCard(park)));
}

renderParks();