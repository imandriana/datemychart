(function () {
  var form = document.getElementById('dmc-form');
  if (!form) return;
  var steps = [].slice.call(form.querySelectorAll('.step'));
  var fill = document.getElementById('barFill');
  var label = document.getElementById('stepLabel');
  var title = document.getElementById('stepTitle');
  var back = document.getElementById('backBtn');
  var next = document.getElementById('nextBtn');
  var submit = document.getElementById('submitBtn');
  var err = document.getElementById('formError');
  var success = document.getElementById('success');
  var card = document.querySelector('.form-card');
  var i = 0;
  form.classList.add('js');

  function show(n, scroll) {
    i = n;
    steps.forEach(function (s, k) { s.hidden = k !== i; });
    back.hidden = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    fill.style.width = ((i + 1) / steps.length * 100) + '%';
    label.textContent = 'Step ' + (i + 1) + ' of ' + steps.length;
    title.textContent = steps[i].getAttribute('data-title');
    err.hidden = true;
    if (scroll) card.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  function valid() {
    var els = steps[i].querySelectorAll('input, select, textarea');
    for (var k = 0; k < els.length; k++) {
      if (!els[k].checkValidity()) { els[k].reportValidity(); return false; }
    }
    return true;
  }
  next.addEventListener('click', function () { if (valid()) show(i + 1, true); });
  back.addEventListener('click', function () { show(i - 1, true); });

  // show "What did they tell you?" only if charts were read before
  var told = document.getElementById('q-told');
  form.addEventListener('change', function (e) {
    if (e.target.name === 'Charts read together before') {
      told.hidden = e.target.value === 'No';
    }
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (i < steps.length - 1) { next.click(); return; }
    if (!valid()) return;
    submit.disabled = true;
    submit.textContent = 'Sending...';
    err.hidden = true;
    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    }).then(function (r) {
      if (!r.ok) throw new Error('bad status');
      form.hidden = true;
      document.getElementById('progress').hidden = true;
      success.hidden = false;
      success.focus();
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }).catch(function () {
      err.hidden = false;
      submit.disabled = false;
      submit.textContent = 'Submit My Charts →';
    });
  });

  show(0, false);
})();
