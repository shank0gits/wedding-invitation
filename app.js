(function () {
  const data = window.WEDDING_DATA || {};
  const $ = (selector) => document.querySelector(selector);
  const setText = (selector, value) => { const element = $(selector); if (element && value) element.textContent = value; };

  document.title = `${data.bride || "Srashti"} & ${data.groom || "Priyank"} — A wedding celebration`;
  setText("#hero-title", `${data.bride || "Srashti"} &\n${data.groom || "Priyank"}`);
  setText("#hindi-blessing", data.blessing);
  setText("#hero-date", data.dateShort);
  setText("#card-bride", data.bride);
  setText("#card-groom", data.groom);
  setText("#card-date", data.ceremonyDate);
  setText("#card-time", `Baraat prasthan · ${data.time || "Time to be announced"}`);
  setText("#card-location", data.location);

  const cardToggle = $("#card-toggle");
  const gate = $("#invitation-gate");
  const openCard = () => {
    if (document.body.classList.contains("invitation-open")) return;
    cardToggle.classList.add("is-open");
    cardToggle.disabled = true;
    document.body.classList.add("invitation-open");
    gate?.classList.add("gate-opened");
    cardToggle.setAttribute("aria-expanded", "true");
    cardToggle.setAttribute("aria-label", "Wedding invitation card opened");
  };
  cardToggle.addEventListener("click", openCard);
  gate?.addEventListener("click", openCard);

  const events = $("#events");
  (data.events || []).forEach((event, index) => {
    const card = document.createElement("article");
    card.className = "event-card";
    card.innerHTML = `<span class="event-num">${String(index + 1).padStart(2, "0")}</span><h3></h3><time></time><p></p>`;
    card.querySelector("h3").textContent = event.title;
    card.querySelector("time").textContent = `${event.date} · ${event.time}`;
    card.querySelector("p").textContent = event.note;
    events.append(card);
  });

  const places = $("#places");
  (data.places || []).forEach((place) => {
    const card = document.createElement("article");
    card.className = "place-card";
    const art = document.createElement("div");
    art.className = "place-art";
    art.setAttribute("aria-hidden", "true");
    art.textContent = place.icon || "✧";
    const content = document.createElement("div");
    content.className = "place-content";
    const type = document.createElement("p");
    type.className = "eyebrow";
    type.textContent = place.type;
    const name = document.createElement("h3");
    name.textContent = place.name;
    const address = document.createElement("p");
    address.textContent = place.address;
    content.append(type, name, address);
    if (place.map) {
      const link = document.createElement("a");
      link.className = "map-link";
      link.href = /^https?:\/\//i.test(place.map) ? place.map : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.map)}`;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.textContent = `${place.button || "Open in Maps"} ↗`;
      content.append(link);
    }
    card.append(art, content);
    places.append(card);
  });

  const normalize = (value) => String(value || "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase();
  $("#lookup-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const query = $("#guest-name").value.trim();
    const result = $("#guest-result");
    result.replaceChildren();
    const button = $("#lookup-form button");
    button.disabled = true;
    button.firstChild.textContent = "Searching… ";
    let guest;
    try {
      if (!data.guestApiUrl) throw new Error("not-configured");
      const response = await fetch(data.guestApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: query })
      });
      if (!response.ok) throw new Error("lookup-failed");
      const payload = await response.json();
      guest = payload.guest || null;
    } catch (error) {
      const message = document.createElement("p");
      message.className = "result-message";
      message.textContent = error.message === "not-configured"
        ? "Room lookup will be available once the private guest service is connected."
        : "We couldn’t check that name right now. Please contact the family for your room details.";
      result.append(message);
      button.disabled = false;
      button.firstChild.textContent = "Find my room ";
      return;
    }
    if (!guest) {
      const message = document.createElement("p");
      message.className = "result-message";
      message.textContent = "We couldn’t find that name just yet. Try the name exactly as it appears on your invitation, or contact the family for help.";
      result.append(message);
      button.disabled = false;
      button.firstChild.textContent = "Find my room ";
      return;
    }
    const card = document.createElement("article");
    card.className = "result-card";
    const heading = document.createElement("h3");
    heading.textContent = `Welcome, ${guest.name}`;
    const detail = document.createElement("p");
    detail.innerHTML = `<strong>Room</strong> · ${escapeHtml(guest.room || "Please contact the family")}`;
    card.append(heading, detail);
    if (guest.hotel) {
      const hotel = document.createElement("p");
      hotel.innerHTML = `<strong>Hotel</strong> · ${escapeHtml(guest.hotel)}`;
      card.append(hotel);
    }
    if (guest.note) {
      const note = document.createElement("p");
      note.textContent = guest.note;
      card.append(note);
    }
    result.append(card);
    button.disabled = false;
    button.firstChild.textContent = "Find my room ";
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((items) => items.forEach((item) => {
      if (item.isIntersecting) { item.target.classList.add("visible"); observer.unobserve(item.target); }
    }), { threshold: 0.12 });
    document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
  } else document.querySelectorAll(".reveal").forEach((element) => element.classList.add("visible"));
})();
