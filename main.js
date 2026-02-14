const PARKS = [
  { name: "Jackson Playground Park", parkId: "jackson_playground_park", slug: "jacksonplayground", lat: 37.7644, lng: -122.3988 },
  { name: "Jefferson Square Park", parkId: "jefferson_square_park", slug: "jeffersonsquare", lat: 37.7838, lng: -122.4281 },
  { name: "Alamo Square Park", parkId: "alamo_square_park", slug: "alamosquare", lat: 37.7764, lng: -122.4346 },
  { name: "Dolores Park", parkId: "dolores_park", slug: "dolorespark", lat: 37.7596, lng: -122.4269 },
  { name: "Buena Vista Park", parkId: "buena_vista_park", slug: "buenavista", lat: 37.7682, lng: -122.4416 },
  { name: "Lafayette Park", parkId: "lafayette_park", slug: "lafayettepark", lat: 37.7916, lng: -122.4280 },
  { name: "Duboce Park", parkId: "duboce_park", slug: "dubocepark", lat: 37.7694, lng: -122.4337 },
  { name: "Bayfront Park", parkId: "bayfront_park", slug: "bayfrontpark", lat: 37.7849, lng: -122.3894 },
  { name: "Yerba Buena Gardens", parkId: "yerba_buena_gardens", slug: "yerbabuena", lat: 37.7855, lng: -122.4025 },
  { name: "The Panhandle", parkId: "the_panhandle", slug: "panhandle", lat: 37.7715, lng: -122.4441 },
];

function createParkCard(park) {
  const card = document.createElement("a");
  card.href = `${park.slug}-tally/`;
  card.className = "park-card";
  card.innerHTML = `
    <div class="park-map-container">
      <iframe
        class="park-map"
        src="https://www.openstreetmap.org/export/embed.html?bbox=${park.lng - 0.003},${park.lat - 0.002},${park.lng + 0.003},${park.lat + 0.002}&layer=mapnik&marker=${park.lat},${park.lng}"
        loading="lazy"
      ></iframe>
      <div class="park-map-overlay"></div>
    </div>
    <div class="park-info">
      <h2 class="park-name">${park.name}</h2>
      <span class="park-arrow">View reports &rarr;</span>
    </div>
  `;
  return card;
}

function renderParks() {
  const grid = document.getElementById("parkGrid");
  PARKS.forEach((park) => {
    grid.appendChild(createParkCard(park));
  });
}

renderParks();