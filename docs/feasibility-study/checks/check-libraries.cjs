const {JSDOM} = require('jsdom');
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const root = path.resolve(process.argv[2] || process.cwd());
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'https://buriton10.ddev.site/', runScripts: 'outside-only', pretendToBeVisual: true
});
const w = dom.window;
const load = file => w.eval(fs.readFileSync(path.join(root, file), 'utf8'));
try {
  load('core/assets/vendor/jquery/jquery.min.js');
  const $ = w.jQuery;
  for (const file of [
    'jquery.inputmask/dist/jquery.inputmask.min.js',
    'jquery.select2/dist/js/select2.min.js',
    'jquery.intl-tel-input/build/js/intlTelInput.min.js',
    'jquery.timepicker/jquery.timepicker.min.js',
    'jquery.textcounter/textcounter.min.js',
    'choices/public/assets/scripts/choices.min.js',
    'codemirror/lib/codemirror.js',
    'signature_pad/example/js/signature_pad.js'
  ]) load('libraries/' + file);

  const input = $('<input>').appendTo('body');
  input.inputmask({mask: '99-99'}).val('1234');
  assert.equal(input.val(), '12-34', 'Inputmask formats values using the installed jQuery');
  const select = $('<select><option value="one">One</option></select>').appendTo('body');
  select.select2();
  assert.equal($('.select2-container').length, 1);
  select.select2('destroy');
  const phone = $('<input type="tel">').appendTo('body')[0];
  const intl = w.intlTelInput(phone, {initialCountry: 'gb'});
  assert.equal(intl.getSelectedCountryData().iso2, 'gb');
  intl.destroy();
  $('<input>').appendTo('body').timepicker().timepicker('remove');
  const choice = new w.Choices(select[0], {allowHTML: false});
  assert.equal(choice.getValue(true), 'one');
  choice.destroy();
  assert.equal(typeof $.fn.textcounter, 'function');
  assert.equal(typeof w.CodeMirror, 'function');
  assert.equal(typeof w.SignaturePad, 'function');
  console.log('PASS: installed library APIs, Inputmask formatting, Select2, telephone input, timepicker and Choices initialization.');
}
finally {
  dom.window.close();
}
