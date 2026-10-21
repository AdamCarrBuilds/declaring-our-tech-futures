(function () {
  'use strict';

  // Google Apps Script web app that appends each submission to the tracking sheet
  // (script source: google-apps-script/Code.gs). Paste the deployment's /exec URL here.
  var FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycby0rrG9s206Mnwvh37Q34bl84pzGO6wFriaHGUlQg7FvmJ7x0AgEwQeZG1NMqE_kBbm/exec';

  // Pointer-following glow on .r-glow surfaces
  document.querySelectorAll('.r-glow').forEach(function (el) {
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ev.clientX - r.left + 'px');
      el.style.setProperty('--my', ev.clientY - r.top + 'px');
    });
  });

  // Form validation, then send to the Google Sheet and show the success state
  var form = document.getElementById('voice-form');
  var success = document.getElementById('voice-success');
  var nameIn = document.getElementById('f-name');
  var emailIn = document.getElementById('f-email');
  var nameField = document.getElementById('field-name');
  var emailField = document.getElementById('field-email');
  var nameErr = document.getElementById('f-name-err');
  var emailErr = document.getElementById('f-email-err');
  var sendErr = document.getElementById('f-send-err');
  var submitBtn = form.querySelector('button[type="submit"]');

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

    var data = new URLSearchParams();
    data.append('name', nameIn.value.trim());
    data.append('email', email);
    data.append('org', form.elements.org.value.trim());
    data.append('message', form.elements.message.value.trim());
    data.append('updates', form.elements.updates.checked ? 'yes' : 'no');
    data.append('website', form.elements.website.value);
    data.append('page', location.href);

    sendErr.hidden = true;
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending…';

    // Apps Script doesn't send CORS headers, so the request goes out as a simple "no-cors" POST:
    // the response can't be read, but a network failure still rejects and shows the error.
    var send = FORM_ENDPOINT
      ? fetch(FORM_ENDPOINT, { method: 'POST', mode: 'no-cors', body: data })
      : Promise.reject(new Error('FORM_ENDPOINT is not set'));

    send.then(function () {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }).catch(function (err) {
      if (window.console) console.error('Form send failed:', err);
      sendErr.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send';
    });
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
