const {JSDOM}=require('jsdom');
const fs=require('fs');
const path=require('path');
const assert=require('node:assert/strict');
const root=path.resolve(process.argv[2] || process.cwd());
const dom=new JSDOM(`<!doctype html><html><body>
<a class="btn-btt" href="#top">Top</a>
<form id="search-block-form"><input name="keys" value=""></form>
<form id="contact-message-feedback-form"><input placeholder="Name" value=""></form>
<div class="carousel-responsive"><div>One</div><div>Two</div><div>Three</div><div>Four</div><div>Five</div></div>
<div id="slideshow_container"><div u="loading"></div><div u="slides"><div><div class="views-field-field-slideshow"><img width="600" height="300" src="one.jpg"></div><div class="views-field-title"><a href="/one">One</a></div></div><div><div class="views-field-field-slideshow"><img width="600" height="300" src="two.jpg"></div><div class="views-field-title"><a href="/two">Two</a></div></div></div></div>
</body></html>`,{url:'https://buriton10.ddev.site/',runScripts:'outside-only',pretendToBeVisual:true});
const w=dom.window;
w.matchMedia=query=>({matches:query.includes('prefers-reduced-motion'),addListener(){},removeListener(){}});
w.Drupal={behaviors:{},t:s=>s};
const load=p=>w.eval(fs.readFileSync(path.join(root,p),'utf8'));
w.eval(fs.readFileSync(require.resolve('jquery/dist/jquery.js'),'utf8'));
load('core/assets/vendor/once/once.min.js');
for(const p of ['includes/js/jquery.smooth-scroll.js','includes/bootstrap/js/bootstrap.js','includes/slick/slick/slick.js','includes/flexslider/jquery.flexslider.js','js/zircon.js','js/carousel.js','js/slideshow.js'])load('themes/custom/zircon/'+p);
const $=w.jQuery;
const form=w.document.querySelector('#contact-message-feedback-form');
const attach=context=>Object.values(w.Drupal.behaviors).forEach(b=>b.attach(context,{}));
attach(w.document);attach(w.document);
assert.equal($('.carousel-responsive.slick-initialized').length,1);
assert.equal($('.carousel-responsive > .slick-list').length,1,'carousel initialises once');
assert.ok($('#slideshow_container').data('flexslider'),'slideshow initialises');
assert.equal($('#slideshow_container ul.slides > li:not(.clone)').length,2,'slideshow preserves both slides');
assert.equal($('#search-block-form input').val(),'','placeholder is not submitted as a search value');
assert.equal($('#search-block-form input').attr('placeholder'),'Keywords');
assert.equal(w.document.querySelector('#contact-message-feedback-form'),form,'form DOM and attached handlers remain intact');
assert.equal($._data(w,'events').scroll.filter(x=>x.namespace==='zircon').length,1,'window handler is not duplicated');
const ajax=w.document.createElement('div');ajax.innerHTML='<div class="carousel-responsive"><div>Ajax one</div><div>Ajax two</div></div>';
w.document.body.appendChild(ajax);attach(ajax);attach(ajax);
assert.equal($(ajax).find('.slick-list').length,1,'AJAX content initialises exactly once');
console.log('PASS: Drupal 10 jQuery compatibility, repeated attachment, AJAX carousel, slideshow content, search placeholder and contact-form preservation.');
w.close();
