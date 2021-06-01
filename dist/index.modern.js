// TypeIt by Alex MacArthur - https://typeitjs.com
const e={breakLines:!0,cursor:!0,cursorChar:"|",cursorSpeed:1e3,deleteSpeed:null,html:!0,lifeLike:!0,loop:!1,loopDelay:750,nextStringDelay:750,speed:100,startDelay:250,startDelete:!1,strings:[],waitUntilVisible:!1,beforeString:()=>{},afterString:()=>{},beforeStep:()=>{},afterStep:()=>{},afterComplete:()=>{}},t=[null,null,{}];var n=(e,t)=>Object.assign({},e,t),r=e=>Array.from(e),i=e=>(new DOMParser).parseFromString(e,"text/html").body;const l=(e,t=null,n=!1)=>{let i=r(e.childNodes).flatMap(e=>{return 3===(t=e).nodeType||"BR"===t.tagName?e:l(e);var t});return t&&(i=i.filter(e=>!t.contains(e))),n?i.reverse():i},a=(e,t=null)=>({node:t,content:e});function o(e){let t=i(e);return l(t).flatMap(e=>e.nodeValue?r(e.nodeValue).map(t=>a(t,e)):a(e))}function s(e,t=!0){return t?o(e):r(e).map(e=>a(e))}var u=e=>document.createElement(e),c=(e,t="")=>{let n=u("style");n.id=t,n.appendChild(document.createTextNode(e)),document.head.appendChild(n)},d=e=>Array.isArray(e),f=e=>(d(e)||(e=[e/2,e/2]),e),h=(e,t)=>Math.abs(Math.random()*(e+t-(e-t))+(e-t));function p(e,t,n){let r=(t=null!==t?t:e/3)/2;return n?[h(e,e/2),h(t,r)]:[e,t]}var y=e=>"value"in e,m=e=>"BODY"===e.tagName;const g=(e,t)=>{let n=t.querySelectorAll("*");return[t].concat(r(n).reverse()).find(t=>t.cloneNode().outerHTML===e.outerHTML)},b=(e,t,n=null,r)=>{let i=t.content instanceof HTMLElement,a=t.node,o=null==a?void 0:a.parentNode,s=i?t.content:document.createTextNode(t.content);if(y(e))return void(e.value=`${e.value}${t.content}`);if(!i&&o&&!m(o)){let r=g(o,e);if(r&&((e,t)=>{let n=e.nextSibling;return!n||n.isEqualNode(t)})(r,n))return r;s=o.cloneNode(),s.innerText=t.content;let i=o.parentNode,l=i.cloneNode();if(!m(i)){let t=g(l,e);for(;!t&&!m(i);){let n=l;n.innerHTML=s.outerHTML,s=n,i=i.parentNode,l=i.cloneNode(),t=g(l,e)}e=t||e}}let u=l(e,n,!0)[r-1],c=u?u.parentNode:e;c.insertBefore(s,c.contains(n)?n:null)};var v=(e,t)=>(e[2]=n(e[2],t)||t,e),S=(e,t,n={},r=!1)=>e.map((i,l)=>{let a=[t,i,n];return r&&(0===l&&(a=v(a,{isFirst:!0})),l+1===e.length&&(a=v(a,{isLast:!0}))),a}),w=e=>e&&e.remove(),M=(e,t,n)=>{let r="string"==typeof e,i=!1,l=-1*e;if(r){let r="END"===e.toUpperCase();l=r?-1:1,i=r?t+l>0:t+l<n.length}return{isString:r,numberOfSteps:l,canKeepMoving:i}};function T(h,m={}){const g=(e,t)=>(j.add(e),((e={})=>{let t=e.delay;t&&j.add([[E,t]])})(t),this),v=(e={})=>[[$,e,{force:!0}],[$,F,{force:!0}]],T=e=>{let t=F.nextStringDelay;j.add([[E,t[0]],...e,[E,t[1]]])},N=()=>O?r(A.value):l(A,K,!0),L=e=>{K&&(K.classList.toggle("disabled",e),K.classList.toggle("with-delay",!e))},x=async(e,t)=>{R.push(setTimeout(e,t))},D=async()=>{V.started=!0;let e,t=j.getItems();try{for(let r=0;r<t.length;r++){var n;if(V.frozen||V.destroyed)throw"";let i=t[r],l=i[2];e=[i,this],l.freezeCursor&&L(!0),I=p(F.speed,F.deleteSpeed,F.lifeLike),null!=l&&l.isFirst&&await F.beforeString(...e),await F.beforeStep(...e),await i[0].call(this,i[1],l),null!=(n=i[2])&&n.isLast&&await F.afterString(...e),await F.afterStep(...e),j.setMeta(r,{executed:!0}),L(!1)}if(V.completed=!0,await F.afterComplete(...e),!F.loop)throw"";let r=F.loopDelay;x(async()=>{await(async e=>{P&&await H(P),j.reset(),j.set(0,[E,e,{}]),await z(!0)})(r[0]),D()},r[1])}catch(e){}return this},E=(e=0)=>new Promise(t=>{x(()=>t(),e)}),H=e=>{let t=N(),{numberOfSteps:n,isString:r,canKeepMoving:i}=M(e,P,t);return P+=n,new Promise(e=>{x(async()=>(((e,t,n,r)=>{if(!n)return;let i=t[(r>t.length?t.length:r)-1];(e=(null==i?void 0:i.parentNode)||e).insertBefore(n,i||null)})(A,N(),K,P),r&&i&&await H(n>0?"START":"END"),e()),I[0])})},C=e=>new Promise(t=>{x(()=>(b(A,e,K,P),t()),I[0])}),$=async e=>{F=n(F,e)},k=async()=>{O?A.value="":N().forEach(e=>{w(e)})},z=e=>(e=!0===e,new Promise(t=>{x(async()=>{let n=N();return n.length&&(O?A.value=A.value.slice(0,-1):w(n[P])),A.querySelectorAll("*").forEach(e=>{if(!e.innerHTML&&"BR"!==e.tagName){let t=e;for(;1===t.parentElement.childNodes.length;)t=t.parentElement;w(t)}}),e&&n.length-1>0?(await z(!0),t()):t()},I[1])}));this.break=function(e){return g([[C,a(u("BR"))]],e)},this.delete=function(e,t){let n=v(t);return g([n[0],...[...Array(Math.abs(e)||1)].fill(null).map(()=>[z,!e,q]),n[1]],t)},this.empty=function(e={}){return g([[k]],e)},this.exec=function(e,t){let n=v(t);return g([n[0],[e,null],n[1]],t)},this.move=function(e,t){let n=M(e,P,N()),r=v(t),i=n.isString?e:Math.sign(e);return g([r[0],...[...Array(Math.abs(e)||1)].fill(null).map(()=>[H,i,q]),r[1]],t)},this.options=function(e){return g([[$,e]],e)},this.pause=function(e,t){return g([[E,e]],t)},this.type=function(e,t){let n=v(t),r=s(e,F.html),i=[n[0],...S(r,C,q,!0),n[1]];return g(i,t)},this.is=function(e){return V[e]},this.destroy=function(e=!0){R.forEach(e=>clearTimeout(e)),R=[],e&&w(K),V.destroyed=!0},this.freeze=function(){V.frozen=!0},this.unfreeze=function(){V.frozen=!1,D()},this.reset=function(){!this.is("destroyed")&&this.destroy(),j.reset(),P=0;for(let e in V)V[e]=!1;return O?A.value="":A.innerHTML="",this},this.go=function(){return V.started?this:((async()=>{if(!K)return;let e=`[data-typeit-id='${U}'] .ti-cursor`;c(`@keyframes blink-${U} { 0% {opacity: 0} 49% {opacity: 0} 50% {opacity: 1} } ${e} { animation: blink-${U} ${F.cursorSpeed/1e3}s infinite; } ${e}.with-delay { animation-delay: 500ms; } ${e}.disabled { animation: none; }`,U),A.appendChild(K),"loaded"===document.fonts.status||await document.fonts.ready;let t=K.getBoundingClientRect().width/2;K.style.margin=`0 -${t+2}px 0 -${t-2}px`})(),F.waitUntilVisible?(((e,t)=>{new IntersectionObserver((n,r)=>{n.forEach(n=>{n.isIntersecting&&(t(),r.unobserve(e))})},{threshold:1}).observe(e)})(A,D.bind(this)),this):(D(),this))},this.getQueue=function(){return j},this.getOptions=function(){return F},this.getElement=function(){return A};let A="string"==typeof(B=h)?document.querySelector(B):B;var B;let O=y(A),I=[],R=[],P=0,q={freezeCursor:!0},V={started:!1,completed:!1,frozen:!1,destroyed:!1},F=n(e,m);F=n(F,{html:!O&&F.html,nextStringDelay:f(F.nextStringDelay),loopDelay:f(F.loopDelay)});let U=Math.random().toString().substring(2,9),j=function(e){const r=function(e){return i=i.concat(e.map(e=>t.map((t,n)=>e[n]?e[n]:t))),this};let i=[];return r(e),{add:r,set:function(e,t){i[e]=t},reset:function(){i=i.map(e=>(e[2].executed=!1,e))},getItems:function(){return i.filter(e=>!e[2].executed)},setMeta:function(e,t){i[e][2]=n(i[e][2],t)}}}([[E,F.startDelay]]);A.dataset.typeitId=U,c("[data-typeit-id]:before {content: '.'; display: inline-block; width: 0; visibility: hidden;}");let K=(()=>{if(O||!F.cursor)return;let e=u("span");return e.innerHTML=i(F.cursorChar).innerHTML,e.className="ti-cursor",e.style.cssText=`display:inline;${(e=>{let{font:t,lineHeight:n,color:r}=window.getComputedStyle(e,null),i=u("I");return Object.assign(i.style,{color:r,font:t,lineHeight:n}),i.style.cssText})(A)}`,e})();var Q;F.strings=(e=>{let t=A.innerHTML;return t?(A.innerHTML="",F.startDelete?(o(t).forEach(e=>{b(A,e,K,P)}),T([[z,!0]]),e):[t.trim()].concat(e)):e})(d(Q=F.strings)?Q:[Q]),F.strings.length&&(()=>{let e=F.strings.filter(e=>!!e);e.forEach((t,n)=>{let r=s(t,F.html);j.add(S(r,C,q,!0)),n+1!==e.length&&T(F.breakLines?[[C,a(u("BR")),q]]:S(r,z,q))})})()}export default T;
