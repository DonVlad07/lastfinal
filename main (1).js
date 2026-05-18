// ═══════════════════════════════════════════
// PURE POWER GYM – main.js
// Unified script for all pages
// Covers: payment toggle, form validation,
//         events calendar, image carousel
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function () {

  // ─── Payment Method Toggle (Reservation page) ───────────────────────────

  const paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
  if (paymentRadios.length) {
    paymentRadios.forEach(r => r.addEventListener("change", togglePayment));
    const checked = document.querySelector('input[name="paymentMethod"]:checked');
    if (checked) togglePayment();
  }

  function togglePayment() {
    const method        = document.querySelector('input[name="paymentMethod"]:checked').value;
    const creditFields  = document.getElementById("credit-fields");
    const routingFields = document.getElementById("routing-fields");
    if (!creditFields || !routingFields) return;

    if (method === "credit") {
      creditFields.classList.remove("hidden");
      routingFields.classList.add("hidden");
    } else if (method === "routing") {
      routingFields.classList.remove("hidden");
      creditFields.classList.add("hidden");
    }
  }

  // ─── Form Validation (Reservation page) ─────────────────────────────────

  const membershipForm = document.querySelector("#form form");
  if (membershipForm) {
    membershipForm.addEventListener("submit", handleFormSubmit);

    // Live validation on blur (when user leaves each field)
    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const ageInput   = document.getElementById("age");

    if (emailInput) emailInput.addEventListener("blur",  () => validateEmail(emailInput));
    if (phoneInput) phoneInput.addEventListener("blur",  () => validatePhone(phoneInput));
    if (ageInput)   ageInput.addEventListener("blur",    () => validateAge(ageInput));

    // Clear errors as user starts retyping
    if (emailInput) emailInput.addEventListener("input", () => clearError(emailInput));
    if (phoneInput) phoneInput.addEventListener("input", () => clearError(phoneInput));
    if (ageInput)   ageInput.addEventListener("input",   () => clearError(ageInput));
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    const emailInput = document.getElementById("email");
    const phoneInput = document.getElementById("phone");
    const ageInput   = document.getElementById("age");

    const emailOk = validateEmail(emailInput);
    const phoneOk = validatePhone(phoneInput);
    const ageOk   = validateAge(ageInput);

    if (emailOk && phoneOk && ageOk) {
      // All fields valid — replace form with a success message
      const formDiv = document.getElementById("form");
      formDiv.innerHTML = `
        <div class="form-success">
          <div class="success-icon">💪</div>
          <h2>Welcome to Pure Power Gym!</h2>
          <p>Your membership application has been received. We'll reach out to
          <strong>${emailInput ? emailInput.value : "you"}</strong> within 24 hours
          to confirm your plan and get you started.</p>
        </div>`;
    } else {
      // Scroll smoothly to the first error
      const firstError = document.querySelector(".field-error");
      if (firstError) firstError.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // ── Validators ──────────────────────────────────────────────────────────

  function validateEmail(input) {
    if (!input) return true;
    const val = input.value.trim();
    const re  = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!val)        return setError(input, "Email address is required.");
    if (!re.test(val)) return setError(input, "Please enter a valid email — e.g. name@example.com");
    return setValid(input);
  }

  function validatePhone(input) {
    if (!input) return true;
    // Accept any format; strip non-digits and require exactly 10 (US)
    const digits = input.value.replace(/\D/g, "");
    if (!digits)          return setError(input, "Phone number is required.");
    if (digits.length !== 10) return setError(input, "Please enter a 10-digit US phone number — e.g. (347) 743-4470");
    return setValid(input);
  }

  function validateAge(input) {
    if (!input) return true;
    const val = parseInt(input.value, 10);
    if (!input.value.trim())   return setError(input, "Age is required.");
    if (isNaN(val) || val < 16) return setError(input, "You must be at least 16 years old to join.");
    if (val > 99)               return setError(input, "Please enter a valid age.");
    return setValid(input);
  }

  // ── Error / valid state helpers ──────────────────────────────────────────

  function setError(input, message) {
    input.classList.add("field-error");
    input.classList.remove("field-valid");
    let msg = input.parentElement.querySelector(".validation-msg");
    if (!msg) {
      msg = document.createElement("span");
      msg.className = "validation-msg error-msg";
      input.insertAdjacentElement("afterend", msg);
    }
    msg.className   = "validation-msg error-msg";
    msg.textContent = "⚠ " + message;
    return false;
  }

  function setValid(input) {
    input.classList.remove("field-error");
    input.classList.add("field-valid");
    const msg = input.parentElement.querySelector(".validation-msg");
    if (msg) {
      msg.className   = "validation-msg success-msg";
      msg.textContent = "✓ Looks good!";
    }
    return true;
  }

  function clearError(input) {
    input.classList.remove("field-error", "field-valid");
    const msg = input.parentElement.querySelector(".validation-msg");
    if (msg) msg.remove();
  }

  // ─── Events Calendar (Contact page) ─────────────────────────────────────

  if (document.getElementById("cal-grid")) {
    initCalendar();
  }

  // ─── Image Carousel (About page) ────────────────────────────────────────

  const slides = document.querySelectorAll(".carousel-slide");
  const dots   = document.querySelectorAll(".dot");

  if (slides.length) {
    let currentSlide = 0;
    let autoTimer = setInterval(() => changeSlide(1), 4500);

    function showSlide(n) {
      slides[currentSlide].classList.remove("active");
      if (dots.length) dots[currentSlide].classList.remove("active");
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add("active");
      if (dots.length) dots[currentSlide].classList.add("active");
    }

    function changeSlide(dir) {
      clearInterval(autoTimer);
      showSlide(currentSlide + dir);
      autoTimer = setInterval(() => changeSlide(1), 4500);
    }

    function goToSlide(n) {
      clearInterval(autoTimer);
      showSlide(n);
      autoTimer = setInterval(() => changeSlide(1), 4500);
    }

    window.changeSlide = changeSlide;
    window.goToSlide   = goToSlide;
  }

});

// ─── Calendar Implementation ─────────────────────────────────────────────

const EVENTS = {
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-05`]: [
    { title: "New Member Orientation", time: "9:00 AM", desc: "Free tour & fitness assessment for new members." }
  ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-10`]: [
    { title: "Powerlifting Competition", time: "11:00 AM", desc: "Open to all members – sign up at the front desk." }
  ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-15`]: [
    { title: "HIIT Bootcamp Class",    time: "6:30 AM",  desc: "High intensity interval training – bring a towel!" },
    { title: "Personal Trainer Q&A",  time: "7:00 PM",  desc: "Ask our certified trainers anything. Free session." }
  ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-20`]: [
    { title: "Recovery & Stretch Workshop", time: "10:00 AM", desc: "Learn foam rolling, stretching, and sauna tips." }
  ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-25`]: [
    { title: "Basketball 3v3 Tournament", time: "3:00 PM", desc: "Court battles open to all Platinum & Gold members." }
  ],
  [`${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,"0")}-28`]: [
    { title: "Nutrition Seminar", time: "5:30 PM", desc: "Our in-house chef covers meal prep & macros." }
  ],
};

let currentYear, currentMonth;

function initCalendar() {
  const today  = new Date();
  currentYear  = today.getFullYear();
  currentMonth = today.getMonth();
  renderCalendar();
}

function renderCalendar() {
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];

  document.getElementById("cal-month-label").textContent =
    `${monthNames[currentMonth]} ${currentYear}`;

  const grid = document.getElementById("cal-grid");
  grid.innerHTML = "";

  ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].forEach(d => {
    const hdr = document.createElement("div");
    hdr.className = "cal-dow";
    hdr.textContent = d;
    grid.appendChild(hdr);
  });

  const firstDay    = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today       = new Date();

  for (let i = 0; i < firstDay; i++) {
    const blank = document.createElement("div");
    blank.className = "cal-cell cal-blank";
    grid.appendChild(blank);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const cell     = document.createElement("div");
    cell.className = "cal-cell";

    const key      = `${currentYear}-${String(currentMonth+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const hasEvent = !!EVENTS[key];

    if (hasEvent) cell.classList.add("has-event");

    if (
      d === today.getDate() &&
      currentMonth === today.getMonth() &&
      currentYear  === today.getFullYear()
    ) {
      cell.classList.add("cal-today");
    }

    cell.innerHTML = `<span class="cal-day-num">${d}</span>${hasEvent ? '<span class="event-dot"></span>' : ""}`;
    cell.addEventListener("click", () => showEvents(key, d));
    grid.appendChild(cell);
  }

  document.getElementById("cal-event-panel").innerHTML =
    `<p class="cal-hint">💪 Click a highlighted date to see gym events.</p>`;
}

function showEvents(key, day) {
  const panel      = document.getElementById("cal-event-panel");
  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const label = `${monthNames[currentMonth]} ${day}, ${currentYear}`;

  if (!EVENTS[key]) {
    panel.innerHTML = `<p class="cal-no-event"><strong>${label}</strong><br>No events scheduled. Great day to grind! 🏋️</p>`;
    return;
  }

  let html = `<h3 class="panel-date">🗓 ${label}</h3>`;
  EVENTS[key].forEach(ev => {
    html += `
      <div class="event-card">
        <div class="event-title">${ev.title}</div>
        <div class="event-time">⏰ ${ev.time}</div>
        <div class="event-desc">${ev.desc}</div>
      </div>`;
  });
  panel.innerHTML = html;
}

window.prevMonth = function () {
  currentMonth--;
  if (currentMonth < 0) { currentMonth = 11; currentYear--; }
  renderCalendar();
};

window.nextMonth = function () {
  currentMonth++;
  if (currentMonth > 11) { currentMonth = 0; currentYear++; }
  renderCalendar();
};
