// TypeIt by Alex MacArthur - https://typeitjs.com
var n={breakLines:!0,cursor:!0,cursorChar:"|",cursorSpeed:1e3,deleteSpeed:null,html:!0,lifeLike:!0,loop:!1,loopDelay:750,nextStringDelay:750,speed:100,startDelay:250,startDelete:!1,strings:[],waitUntilVisible:!1,beforeString:function(){},afterString:function(){},beforeStep:function(){},afterStep:function(){},afterComplete:function(){}},e=[null,null,{}],t=function(n,e){return Object.assign({},n,e)},r=function(n){return Array.from(n)},i=function(n){return(new DOMParser).parseFromString(n,"text/html").body},o=function n(e,t,i){void 0===t&&(t=null),void 0===i&&(i=!1);var o=r(e.childNodes).flatMap(function(e){return 3===(t=e).nodeType||"BR"===t.tagName?e:n(e);var t});return t&&(o=o.filter(function(n){return!t.contains(n)})),i?o.reverse():o},u=function(n,e){return void 0===e&&(e=null),{node:e,content:n}};function c(n){var e=i(n);return o(e).flatMap(function(n){return n.nodeValue?r(n.nodeValue).map(function(e){return u(e,n)}):u(n)})}function a(n,e){return void 0===e&&(e=!0),e?c(n):r(n).map(function(n){return u(n)})}var s=function(n){return document.createElement(n)},f=function(n,e){void 0===e&&(e="");var t=s("style");t.id=e,t.appendChild(document.createTextNode(n)),document.head.appendChild(t)},l=function(n){return Array.isArray(n)},d=function(n){return l(n)||(n=[n/2,n/2]),n},v=function(n,e){return Math.abs(Math.random()*(n+e-(n-e))+(n-e))},h=function(n){return"value"in n},m=function(n){return"BODY"===n.tagName},p=function(n,e){var t=e.querySelectorAll("*");return[e].concat(r(t).reverse()).find(function(e){return e.cloneNode().outerHTML===n.outerHTML})},y=function(n,e,t,r){void 0===t&&(t=null);var i=e.content instanceof HTMLElement,u=e.node,c=null==u?void 0:u.parentNode,a=i?e.content:document.createTextNode(e.content);if(h(n))n.value=""+n.value+e.content;else{if(!i&&c&&!m(c)){var s=p(c,n);if(s&&(!(y=s.nextSibling)||y.isEqualNode(t)))return s;(a=c.cloneNode()).innerText=e.content;var f=c.parentNode,l=f.cloneNode();if(!m(f)){for(var d=p(l,n);!d&&!m(f);){var v=l;v.innerHTML=a.outerHTML,a=v,l=(f=f.parentNode).cloneNode(),d=p(l,n)}n=d||n}}var y,g=o(n,t,!0)[r-1],P=g?g.parentNode:n;P.insertBefore(a,P.contains(t)?t:null)}},g=function(n,e){return n[2]=t(n[2],e)||e,n},P=function(n,e,t,r){return void 0===t&&(t={}),void 0===r&&(r=!1),n.map(function(i,o){var u=[e,i,t];return r&&(0===o&&(u=g(u,{isFirst:!0})),o+1===n.length&&(u=g(u,{isLast:!0}))),u})},b=function(n){return n&&n.remove()},S=function(n,e,t){var r="string"==typeof n,i=!1,o=-1*n;if(r){var u="END"===n.toUpperCase();o=u?-1:1,i=u?e+o>0:e+o<t.length}return{isString:r,numberOfSteps:o,canKeepMoving:i}};function M(n,e,t){if(!n.s){if(t instanceof T){if(!t.s)return void(t.o=M.bind(null,n,e));1&e&&(e=t.s),t=t.v}if(t&&t.then)return void t.then(M.bind(null,n,e),M.bind(null,n,2));n.s=e,n.v=t;var r=n.o;r&&r(n)}}var T=function(){function n(){}return n.prototype.then=function(e,t){var r=new n,i=this.s;if(i){var o=1&i?e:t;if(o){try{M(r,1,o(this.v))}catch(n){M(r,2,n)}return r}return this}return this.o=function(n){try{var i=n.v;1&n.s?M(r,1,e?e(i):i):t?M(r,1,t(i)):M(r,2,i)}catch(n){M(r,2,n)}},r},n}();function N(m,p){var g=this,N=this;void 0===p&&(p={});var w=function(n,e){return J.add(n),function(n){void 0===n&&(n={});var e=n.delay;e&&J.add([[j,e]])}(e),N},L=function(n){return void 0===n&&(n={}),[[A,n,{force:!0}],[A,Y,{force:!0}]]},x=function(n){var e=Y.nextStringDelay;J.add([[j,e[0]]].concat(n,[[j,e[1]]]))},D=function(){return q?r(R.value):o(R,$,!0)},E=function(n){$&&($.classList.toggle("disabled",n),$.classList.toggle("with-delay",!n))},H=function(n,e){try{return F.push(setTimeout(n,e)),Promise.resolve()}catch(n){return Promise.reject(n)}},C=function n(){try{Q.started=!0;var e,t=J.getItems(),r=function(r,i){try{var o=function(){function r(t){var r;return Q.completed=!0,Promise.resolve((r=Y).afterComplete.apply(r,e)).then(function(){if(!Y.loop)throw"";var e=Y.loopDelay;H(function(){try{return Promise.resolve(function(n){try{var e=function(e){return J.reset(),J.set(0,[j,n,{}]),Promise.resolve(O(!0)).then(function(){})};return Promise.resolve(U?Promise.resolve(k(U)).then(e):e())}catch(n){return Promise.reject(n)}}(e[0])).then(function(){n()})}catch(n){return Promise.reject(n)}},e[1])})}var i,o,u,c,a,s=(i=t,o=function(n){function r(){var t;return Promise.resolve((t=Y).beforeStep.apply(t,e)).then(function(){return Promise.resolve(c[0].call(g,c[1],a)).then(function(){function t(){var t;return Promise.resolve((t=Y).afterStep.apply(t,e)).then(function(){J.setMeta(n,{executed:!0}),E(!1)})}var r=function(){var n,t;if(null!=(n=c[2])&&n.isLast)return Promise.resolve((t=Y).afterString.apply(t,e)).then(function(){})}();return r&&r.then?r.then(t):t()})})}if(Q.frozen||Q.destroyed)throw"";var i,o,u,c=t[n],a=c[2];e=[c,g],a.freezeCursor&&E(!0),i=Y.speed,u=(o=null!==(o=Y.deleteSpeed)?o:i/3)/2,V=Y.lifeLike?[v(i,i/2),v(o,u)]:[i,o];var s=function(){var n;if(null!=a&&a.isFirst)return Promise.resolve((n=Y).beforeString.apply(n,e)).then(function(){})}();return s&&s.then?s.then(r):r()},a=-1,function n(e){try{for(;++a<i.length;)if((e=o(a))&&e.then){if(!((t=e)instanceof T&&1&t.s))return void e.then(n,c||(c=M.bind(null,u=new T,2)));e=e.v}u?M(u,1,e):u=e}catch(n){M(u||(u=new T),2,n)}var t}(),u);return s&&s.then?s.then(r):r()}()}catch(n){return}return o&&o.then?o.then(void 0,function(){}):o}();return Promise.resolve(r&&r.then?r.then(function(n){return g}):g)}catch(n){return Promise.reject(n)}},j=function(n){return void 0===n&&(n=0),new Promise(function(e){H(function(){return e()},n)})},k=function n(e){var t=D(),r=S(e,U,t),i=r.numberOfSteps,o=r.isString,u=r.canKeepMoving;return U+=i,new Promise(function(e){H(function(){try{!function(n,e,t,r){if(t){var i=e[(r>e.length?e.length:r)-1];(n=(null==i?void 0:i.parentNode)||n).insertBefore(t,i||null)}}(R,D(),$,U);var t=function(){if(o&&u)return Promise.resolve(n(i>0?"START":"END")).then(function(){})}();return Promise.resolve(t&&t.then?t.then(function(){return e()}):e())}catch(n){return Promise.reject(n)}},V[0])})},z=function(n){return new Promise(function(e){H(function(){return y(R,n,$,U),e()},V[0])})},A=function(n){try{return Y=t(Y,n),Promise.resolve()}catch(n){return Promise.reject(n)}},B=function(){try{return q?(R.value="",Promise.resolve()):(D().forEach(function(n){b(n)}),Promise.resolve())}catch(n){return Promise.reject(n)}},O=function n(e){return e=!0===e,new Promise(function(t){H(function(){try{var r,i=function(n){return r?n:t()},o=D();o.length&&(q?R.value=R.value.slice(0,-1):b(o[U])),R.querySelectorAll("*").forEach(function(n){if(!n.innerHTML&&"BR"!==n.tagName){for(var e=n;1===e.parentElement.childNodes.length;)e=e.parentElement;b(e)}});var u=function(){if(e&&o.length-1>0)return Promise.resolve(n(!0)).then(function(){return r=1,t()})}();return Promise.resolve(u&&u.then?u.then(i):i(u))}catch(n){return Promise.reject(n)}},V[1])})};this.break=function(n){return w([[z,u(s("BR"))]],n)},this.delete=function(n,e){var t=L(e);return w([t[0]].concat([].concat(Array(Math.abs(n)||1)).fill(null).map(function(){return[O,!n,K]}),[t[1]]),e)},this.empty=function(n){return void 0===n&&(n={}),w([[B]],n)},this.exec=function(n,e){var t=L(e);return w([t[0],[n,null],t[1]],e)},this.move=function(n,e){var t=S(n,U,D()),r=L(e),i=t.isString?n:Math.sign(n);return w([r[0]].concat([].concat(Array(Math.abs(n)||1)).fill(null).map(function(){return[k,i,K]}),[r[1]]),e)},this.options=function(n){return w([[A,n]],n)},this.pause=function(n,e){return w([[j,n]],e)},this.type=function(n,e){var t=L(e),r=a(n,Y.html),i=[t[0]].concat(P(r,z,K,!0),[t[1]]);return w(i,e)},this.is=function(n){return Q[n]},this.destroy=function(n){void 0===n&&(n=!0),F.forEach(function(n){return clearTimeout(n)}),F=[],n&&b($),Q.destroyed=!0},this.freeze=function(){Q.frozen=!0},this.unfreeze=function(){Q.frozen=!1,C()},this.reset=function(){for(var n in!this.is("destroyed")&&this.destroy(),J.reset(),U=0,Q)Q[n]=!1;return q?R.value="":R.innerHTML="",this},this.go=function(){return Q.started?this:(function(){try{var n=function(n){var e=$.getBoundingClientRect().width/2;$.style.margin="0 -"+(e+2)+"px 0 -"+(e-2)+"px"};if(!$)return Promise.resolve();var e="[data-typeit-id='"+G+"'] .ti-cursor";f("@keyframes blink-"+G+" { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} } "+e+" { animation: blink-"+G+" "+Y.cursorSpeed/1e3+"s infinite; } "+e+".with-delay { animation-delay: 500ms; } "+e+".disabled { animation: none; }",G),R.appendChild($);var t="loaded"===document.fonts.status;Promise.resolve(t?n():Promise.resolve(document.fonts.ready).then(n))}catch(n){return Promise.reject(n)}}(),Y.waitUntilVisible?(function(n,e){new IntersectionObserver(function(t,r){t.forEach(function(t){t.isIntersecting&&(e(),r.unobserve(n))})},{threshold:1}).observe(n)}(R,C.bind(this)),this):(C(),this))},this.getQueue=function(){return J},this.getOptions=function(){return Y},this.getElement=function(){return R};var I,R="string"==typeof(I=m)?document.querySelector(I):I,q=h(R),V=[],F=[],U=0,K={freezeCursor:!0},Q={started:!1,completed:!1,frozen:!1,destroyed:!1},Y=t(n,p);Y=t(Y,{html:!q&&Y.html,nextStringDelay:d(Y.nextStringDelay),loopDelay:d(Y.loopDelay)});var G=Math.random().toString().substring(2,9),J=function(n){var r=function(n){return i=i.concat(n.map(function(n){return e.map(function(e,t){return n[t]?n[t]:e})})),this},i=[];return r(n),{add:r,set:function(n,e){i[n]=e},reset:function(){i=i.map(function(n){return n[2].executed=!1,n})},getItems:function(){return i.filter(function(n){return!n[2].executed})},setMeta:function(n,e){i[n][2]=t(i[n][2],e)}}}([[j,Y.startDelay]]);R.dataset.typeitId=G,f("[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}");var W,X,Z,$=function(){if(!q&&Y.cursor){var n=s("span");return n.innerHTML=i(Y.cursorChar).innerHTML,n.className="ti-cursor",n.style.cssText="display:inline;"+(t=(e=window.getComputedStyle(R,null)).font,r=e.lineHeight,o=e.color,u=s("I"),Object.assign(u.style,{color:o,font:t,lineHeight:r}),u.style.cssText),n}var e,t,r,o,u}();Y.strings=(W=l(Z=Y.strings)?Z:[Z],(X=R.innerHTML)?(R.innerHTML="",Y.startDelete?(c(X).forEach(function(n){y(R,n,$,U)}),x([[O,!0]]),W):[X.trim()].concat(W)):W),Y.strings.length&&function(){var n=Y.strings.filter(function(n){return!!n});n.forEach(function(e,t){var r=a(e,Y.html);J.add(P(r,z,K,!0)),t+1!==n.length&&x(Y.breakLines?[[z,u(s("BR")),K]]:P(r,O,K))})}()}export default N;
