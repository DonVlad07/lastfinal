// ═══════════════════════════════════════════
// PURE POWER GYM – main.js
// Unified JavaScript for the entire project
// Covers: payment toggle, calendar, carousel
// ═══════════════════════════════════════════

document.addEventListener("DOMContentLoaded", function () {

  // ─────────────────────────────────────────
  // PAYMENT METHOD TOGGLE  (reservation page)
  // ─────────────────────────────────────────
  function togglePayment() {
    const selected      = document.querySelector('input[name="paymentMethod"]:checked');
    const creditFields  = document.getElementById('credit-fields');
    const routingFields = document.getElementById('routing-fields');
    if (!selected || !creditFields || !routingFields) return;

    if (selected.value === 'credit') {
      creditFields.classList.remove('hidden');
      routingFields.classList.add('hidden');
    } else {
      routingFields.classList.remove('hidden');
      creditFields.classList.add('hidden');
    }
  }

  // Bind change listeners and set initial state
  document.querySelectorAll('input[name="paymentMethod"]').forEach(function (radio) {
    radio.addEventListener('change', togglePayment);
  });
  togglePayment();


  // ─────────────────────────────────────────
  // GYM EVENTS CALENDAR  (contact page)
  // ─────────────────────────────────────────
  var calGrid = document.getElementById('cal-grid');
  if (calGrid) {
    var EVENTS = (function () {
      var y  = new Date().getFullYear();
      var mo = String(new Date().getMonth() + 1).padStart(2, '0');
      var obj = {};
      obj[y + '-' + mo + '-05'] = [{ title: "New Member Orientation",      time: "9:00 AM",  desc: "Free tour & fitness assessment for new members." }];
      obj[y + '-' + mo + '-10'] = [{ title: "Powerlifting Competition",     time: "11:00 AM", desc: "Open to all members – sign up at the front desk." }];
      obj[y + '-' + mo + '-15'] = [
        { title: "HIIT Bootcamp Class",      time: "6:30 AM",  desc: "High intensity interval training – bring a towel!" },
        { title: "Personal Trainer Q&A",     time: "7:00 PM",  desc: "Ask our certified trainers anything. Free session." }
      ];
      obj[y + '-' + mo + '-20'] = [{ title: "Recovery & Stretch Workshop", time: "10:00 AM", desc: "Learn foam rolling, stretching, and sauna tips." }];
      obj[y + '-' + mo + '-25'] = [{ title: "Basketball 3v3 Tournament",   time: "3:00 PM",  desc: "Court battles open to all Platinum & Gold members." }];
      obj[y + '-' + mo + '-28'] = [{ title: "Nutrition Seminar",            time: "5:30 PM",  desc: "Our in-house chef covers meal prep & macros." }];
      return obj;
    })();

    var MONTH_NAMES = ["January","February","March","April","May","June",
                       "July","August","September","October","November","December"];
    var currentYear, currentMonth;

    function renderCalendar() {
      document.getElementById('cal-month-label').textContent =
        MONTH_NAMES[currentMonth] + ' ' + currentYear;

      var grid = document.getElementById('cal-grid');
      grid.innerHTML = '';

      ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].forEach(function (d) {
        var hdr = document.createElement('div');
        hdr.className   = 'cal-dow';
        hdr.textContent = d;
        grid.appendChild(hdr);
      });

      var firstDay    = new Date(currentYear, currentMonth, 1).getDay();
      var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
      var today       = new Date();

      for (var i = 0; i < firstDay; i++) {
        var blank = document.createElement('div');
        blank.className = 'cal-cell cal-blank';
        grid.appendChild(blank);
      }

      for (var d = 1; d <= daysInMonth; d++) {
        (function (day) {
          var cell     = document.createElement('div');
          cell.className = 'cal-cell';
          var key      = currentYear + '-' + String(currentMonth + 1).padStart(2, '0') + '-' + String(day).padStart(2, '0');
          var hasEvent = !!EVENTS[key];

          if (hasEvent) cell.classList.add('has-event');
          if (day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear()) {
            cell.classList.add('cal-today');
          }

          cell.innerHTML = '<span class="cal-day-num">' + day + '</span>' +
            (hasEvent ? '<span class="event-dot"></span>' : '');
          cell.addEventListener('click', function () { showEvents(key, day); });
          grid.appendChild(cell);
        })(d);
      }

      document.getElementById('cal-event-panel').innerHTML =
        '<p class="cal-hint">💪 Click a highlighted date to see gym events.</p>';
    }

    function showEvents(key, day) {
      var panel = document.getElementById('cal-event-panel');
      var label = MONTH_NAMES[currentMonth] + ' ' + day + ', ' + currentYear;

      if (!EVENTS[key]) {
        panel.innerHTML = '<p class="cal-no-event"><strong>' + label + '</strong><br>No events scheduled. Great day to grind! 🏋️</p>';
        return;
      }

      var html = '<h3 class="panel-date">🗓 ' + label + '</h3>';
      EVENTS[key].forEach(function (ev) {
        html += '<div class="event-card">' +
          '<div class="event-title">'  + ev.title + '</div>' +
          '<div class="event-time">⏰ ' + ev.time  + '</div>' +
          '<div class="event-desc">'  + ev.desc  + '</div>' +
          '</div>';
      });
      panel.innerHTML = html;
    }

    // Expose nav functions for inline onclick attributes in Contact HTML
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

    // Init
    var now      = new Date();
    currentYear  = now.getFullYear();
    currentMonth = now.getMonth();
    renderCalendar();
  }


  // ─────────────────────────────────────────
  // IMAGE CAROUSEL  (about page)
  // ─────────────────────────────────────────
  var slides = document.querySelectorAll('.carousel-slide');
  var dots   = document.querySelectorAll('.dot');

  if (slides.length > 0) {
    var currentSlide = 0;
    var autoTimer    = setInterval(function () { changeSlide(1); }, 4500);

    function showSlide(n) {
      slides[currentSlide].classList.remove('active');
      if (dots[currentSlide]) dots[currentSlide].classList.remove('active');
      currentSlide = (n + slides.length) % slides.length;
      slides[currentSlide].classList.add('active');
      if (dots[currentSlide]) dots[currentSlide].classList.add('active');
    }

    // Expose for inline onclick in HTML
    window.changeSlide = function (dir) {
      clearInterval(autoTimer);
      showSlide(currentSlide + dir);
      autoTimer = setInterval(function () { changeSlide(1); }, 4500);
    };

    window.goToSlide = function (n) {
      clearInterval(autoTimer);
      showSlide(n);
      autoTimer = setInterval(function () { changeSlide(1); }, 4500);
    };
  }

});