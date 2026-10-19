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

  // Bio dialog with focus trap, Esc to close, focus restore
  var scrim = document.getElementById('bio-scrim');
  var dialog = document.getElementById('bio-dialog');
  var opener = null;

  function openBio(trigger) {
    opener = trigger;
    scrim.hidden = false;
    document.body.style.overflow = 'hidden';
    dialog.querySelector('[data-close-bio]').focus();
  }
  function closeBio() {
    scrim.hidden = true;
    document.body.style.overflow = '';
    if (opener) opener.focus();
  }
  document.querySelectorAll('[data-open-bio]').forEach(function (b) {
    b.addEventListener('click', function () { openBio(b); });
  });
  dialog.querySelector('[data-close-bio]').addEventListener('click', closeBio);
  scrim.addEventListener('click', function (ev) { if (ev.target === scrim) closeBio(); });
  dialog.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { ev.stopPropagation(); closeBio(); return; }
    if (ev.key !== 'Tab') return;
    var items = dialog.querySelectorAll('button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])');
    var first = items[0], last = items[items.length - 1], active = document.activeElement;
    if (ev.shiftKey && (active === first || active === dialog)) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && active === last) { ev.preventDefault(); first.focus(); }
  });
})();
