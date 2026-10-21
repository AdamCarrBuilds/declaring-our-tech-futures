(function () {
  'use strict';

  // Pointer-following glow on .r-glow surfaces
  document.querySelectorAll('.r-glow').forEach(function (el) {
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ev.clientX - r.left + 'px');
      el.style.setProperty('--my', ev.clientY - r.top + 'px');
    });
  });

  // Form validation + success state (no backend yet: swap in a real submit handler)
  var form = document.getElementById('voice-form');
  var success = document.getElementById('voice-success');
  var nameIn = document.getElementById('f-name');
  var emailIn = document.getElementById('f-email');
  var nameField = document.getElementById('field-name');
  var emailField = document.getElementById('field-email');
  var nameErr = document.getElementById('f-name-err');
  var emailErr = document.getElementById('f-email-err');

  function setError(field, input, err, msg) {
    var on = !!msg;
    field.classList.toggle('dotf-field--error', on);
    input.setAttribute('aria-invalid', on ? 'true' : 'false');
    if (on) { input.setAttribute('aria-describedby', err.id); err.textContent = msg; }
    else { input.removeAttribute('aria-describedby'); }
    err.hidden = !on;
  }

  nameIn.addEventListener('input', function () { setError(nameField, nameIn, nameErr, ''); });
  emailIn.addEventListener('input', function () { setError(emailField, emailIn, emailErr, ''); });

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var email = emailIn.value.trim();
    var nameMsg = nameIn.value.trim() ? '' : 'Enter your name.';
    var emailMsg = !email ? 'Enter your email address.'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Enter an email address in the format name@example.com.' : '';
    setError(nameField, nameIn, nameErr, nameMsg);
    setError(emailField, emailIn, emailErr, emailMsg);
    if (nameMsg || emailMsg) { (nameMsg ? nameIn : emailIn).focus(); return; }
    form.hidden = true;
    success.hidden = false;
    success.focus();
  });

  // Advisor "Read bio" toggles: the short bio fades out and the full bio folds open in its place
  document.querySelectorAll('.r-row__toggle').forEach(function (btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    var label = btn.querySelector('.r-row__toggle-label');
    var row = btn.closest('.r-row');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      panel.classList.toggle('is-open', open);
      row.classList.toggle('is-open', open);
      label.textContent = open ? 'Close bio' : 'Read bio';
    });
  });
})();
