import{n as fe,s as ft,C as ut,y as dt}from"./scheduler.BK3YpVWn.js";new URL("sveltekit-internal://");function ht(e,n){return e==="/"||n==="ignore"?e:n==="never"?e.endsWith("/")?e.slice(0,-1):e:n==="always"&&!e.endsWith("/")?e+"/":e}function pt(e){return e.split("%25").map(decodeURI).join("%25")}function gt(e){for(const n in e)e[n]=decodeURIComponent(e[n]);return e}function ue({href:e}){return e.split("#")[0]}const mt=["href","pathname","search","toString","toJSON"];function _t(e,n,t){const r=new URL(e);Object.defineProperty(r,"searchParams",{value:new Proxy(r.searchParams,{get(a,o){if(o==="get"||o==="getAll"||o==="has")return s=>(t(s),a[o](s));n();const i=Reflect.get(a,o);return typeof i=="function"?i.bind(a):i}}),enumerable:!0,configurable:!0});for(const a of mt)Object.defineProperty(r,a,{get(){return n(),e[a]},enumerable:!0,configurable:!0});return r}const yt="/__data.json",wt=".html__data.json";function vt(e){return e.endsWith(".html")?e.replace(/\.html$/,wt):e.replace(/\/$/,"")+yt}function bt(...e){let n=5381;for(const t of e)if(typeof t=="string"){let r=t.length;for(;r;)n=n*33^t.charCodeAt(--r)}else if(ArrayBuffer.isView(t)){const r=new Uint8Array(t.buffer,t.byteOffset,t.byteLength);let a=r.length;for(;a;)n=n*33^r[--a]}else throw new TypeError("value must be a string or TypedArray");return(n>>>0).toString(36)}function kt(e){const n=atob(e),t=new Uint8Array(n.length);for(let r=0;r<n.length;r++)t[r]=n.charCodeAt(r);return t.buffer}const Fe=window.fetch;window.fetch=(e,n)=>((e instanceof Request?e.method:(n==null?void 0:n.method)||"GET")!=="GET"&&M.delete(_e(e)),Fe(e,n));const M=new Map;function Et(e,n){const t=_e(e,n),r=document.querySelector(t);if(r!=null&&r.textContent){let{body:a,...o}=JSON.parse(r.textContent);const i=r.getAttribute("data-ttl");return i&&M.set(t,{body:a,init:o,ttl:1e3*Number(i)}),r.getAttribute("data-b64")!==null&&(a=kt(a)),Promise.resolve(new Response(a,o))}return window.fetch(e,n)}function St(e,n,t){if(M.size>0){const r=_e(e,t),a=M.get(r);if(a){if(performance.now()<a.ttl&&["default","force-cache","only-if-cached",void 0].includes(t==null?void 0:t.cache))return new Response(a.body,a.init);M.delete(r)}}return window.fetch(n,t)}function _e(e,n){let r=`script[data-sveltekit-fetched][data-url=${JSON.stringify(e instanceof Request?e.url:e)}]`;if(n!=null&&n.headers||n!=null&&n.body){const a=[];n.headers&&a.push([...new Headers(n.headers)].join(",")),n.body&&(typeof n.body=="string"||ArrayBuffer.isView(n.body))&&a.push(n.body),r+=`[data-hash="${bt(...a)}"]`}return r}const At=/^(\[)?(\.\.\.)?(\w+)(?:=(\w+))?(\])?$/;function Rt(e){const n=[];return{pattern:e==="/"?/^\/$/:new RegExp(`^${Lt(e).map(r=>{const a=/^\[\.\.\.(\w+)(?:=(\w+))?\]$/.exec(r);if(a)return n.push({name:a[1],matcher:a[2],optional:!1,rest:!0,chained:!0}),"(?:/(.*))?";const o=/^\[\[(\w+)(?:=(\w+))?\]\]$/.exec(r);if(o)return n.push({name:o[1],matcher:o[2],optional:!0,rest:!1,chained:!0}),"(?:/([^/]+))?";if(!r)return;const i=r.split(/\[(.+?)\](?!\])/);return"/"+i.map((c,l)=>{if(l%2){if(c.startsWith("x+"))return de(String.fromCharCode(parseInt(c.slice(2),16)));if(c.startsWith("u+"))return de(String.fromCharCode(...c.slice(2).split("-").map(f=>parseInt(f,16))));const u=At.exec(c),[,h,g,d,_]=u;return n.push({name:d,matcher:_,optional:!!h,rest:!!g,chained:g?l===1&&i[0]==="":!1}),g?"(.*?)":h?"([^/]*)?":"([^/]+?)"}return de(c)}).join("")}).join("")}/?$`),params:n}}function It(e){return!/^\([^)]+\)$/.test(e)}function Lt(e){return e.slice(1).split("/").filter(It)}function Pt(e,n,t){const r={},a=e.slice(1),o=a.filter(s=>s!==void 0);let i=0;for(let s=0;s<n.length;s+=1){const c=n[s];let l=a[s-i];if(c.chained&&c.rest&&i&&(l=a.slice(s-i,s+1).filter(u=>u).join("/"),i=0),l===void 0){c.rest&&(r[c.name]="");continue}if(!c.matcher||t[c.matcher](l)){r[c.name]=l;const u=n[s+1],h=a[s+1];u&&!u.rest&&u.optional&&h&&c.chained&&(i=0),!u&&!h&&Object.keys(r).length===o.length&&(i=0);continue}if(c.optional&&c.chained){i++;continue}return}if(!i)return r}function de(e){return e.normalize().replace(/[[\]]/g,"\\$&").replace(/%/g,"%25").replace(/\//g,"%2[Ff]").replace(/\?/g,"%3[Ff]").replace(/#/g,"%23").replace(/[.*+?^${}()|\\]/g,"\\$&")}function xt({nodes:e,server_loads:n,dictionary:t,matchers:r}){const a=new Set(n);return Object.entries(t).map(([s,[c,l,u]])=>{const{pattern:h,params:g}=Rt(s),d={id:s,exec:_=>{const f=h.exec(_);if(f)return Pt(f,g,r)},errors:[1,...u||[]].map(_=>e[_]),layouts:[0,...l||[]].map(i),leaf:o(c)};return d.errors.length=d.layouts.length=Math.max(d.errors.length,d.layouts.length),d});function o(s){const c=s<0;return c&&(s=~s),[c,e[s]]}function i(s){return s===void 0?s:[a.has(s),e[s]]}}function qe(e,n=JSON.parse){try{return n(sessionStorage[e])}catch{}}function xe(e,n,t=JSON.stringify){const r=t(n);try{sessionStorage[e]=r}catch{}}const j=[];function on(e,n){return{subscribe:re(e,n).subscribe}}function re(e,n=fe){let t;const r=new Set;function a(s){if(ft(e,s)&&(e=s,t)){const c=!j.length;for(const l of r)l[1](),j.push(l,e);if(c){for(let l=0;l<j.length;l+=2)j[l][0](j[l+1]);j.length=0}}}function o(s){a(s(e))}function i(s,c=fe){const l=[s,c];return r.add(l),r.size===1&&(t=n(a,o)||fe),s(e),()=>{r.delete(l),r.size===0&&t&&(t(),t=null)}}return{set:a,update:o,subscribe:i}}var Ce;const P=((Ce=globalThis.__sveltekit_1ghxo7k)==null?void 0:Ce.base)??"/mark-static";var Ve;const Tt=((Ve=globalThis.__sveltekit_1ghxo7k)==null?void 0:Ve.assets)??P,Ut="1722727152326",Me="sveltekit:snapshot",Ge="sveltekit:scroll",He="sveltekit:states",Nt="sveltekit:pageurl",D="sveltekit:history",H="sveltekit:navigation",J={tap:1,hover:2,viewport:3,eager:4,off:-1,false:-1},z=location.origin;function Be(e){if(e instanceof URL)return e;let n=document.baseURI;if(!n){const t=document.getElementsByTagName("base");n=t.length?t[0].href:document.URL}return new URL(e,n)}function ye(){return{x:pageXOffset,y:pageYOffset}}function $(e,n){return e.getAttribute(`data-sveltekit-${n}`)}const Te={...J,"":J.hover};function Ke(e){let n=e.assignedSlot??e.parentNode;return(n==null?void 0:n.nodeType)===11&&(n=n.host),n}function ze(e,n){for(;e&&e!==n;){if(e.nodeName.toUpperCase()==="A"&&e.hasAttribute("href"))return e;e=Ke(e)}}function pe(e,n){let t;try{t=new URL(e instanceof SVGAElement?e.href.baseVal:e.href,document.baseURI)}catch{}const r=e instanceof SVGAElement?e.target.baseVal:e.target,a=!t||!!r||ae(t,n)||(e.getAttribute("rel")||"").split(/\s+/).includes("external"),o=(t==null?void 0:t.origin)===z&&e.hasAttribute("download");return{url:t,external:a,target:r,download:o}}function W(e){let n=null,t=null,r=null,a=null,o=null,i=null,s=e;for(;s&&s!==document.documentElement;)r===null&&(r=$(s,"preload-code")),a===null&&(a=$(s,"preload-data")),n===null&&(n=$(s,"keepfocus")),t===null&&(t=$(s,"noscroll")),o===null&&(o=$(s,"reload")),i===null&&(i=$(s,"replacestate")),s=Ke(s);function c(l){switch(l){case"":case"true":return!0;case"off":case"false":return!1;default:return}}return{preload_code:Te[r??"off"],preload_data:Te[a??"off"],keepfocus:c(n),noscroll:c(t),reload:c(o),replace_state:c(i)}}function Ue(e){const n=re(e);let t=!0;function r(){t=!0,n.update(i=>i)}function a(i){t=!1,n.set(i)}function o(i){let s;return n.subscribe(c=>{(s===void 0||t&&c!==s)&&i(s=c)})}return{notify:r,set:a,subscribe:o}}function Ot(){const{set:e,subscribe:n}=re(!1);let t;async function r(){clearTimeout(t);try{const a=await fetch(`${Tt}/_app/version.json`,{headers:{pragma:"no-cache","cache-control":"no-cache"}});if(!a.ok)return!1;const i=(await a.json()).version!==Ut;return i&&(e(!0),clearTimeout(t)),i}catch{return!1}}return{subscribe:n,check:r}}function ae(e,n){return e.origin!==z||!e.pathname.startsWith(n)}const jt=-1,$t=-2,Dt=-3,Ct=-4,Vt=-5,Ft=-6;function qt(e,n){if(typeof e=="number")return a(e,!0);if(!Array.isArray(e)||e.length===0)throw new Error("Invalid input");const t=e,r=Array(t.length);function a(o,i=!1){if(o===jt)return;if(o===Dt)return NaN;if(o===Ct)return 1/0;if(o===Vt)return-1/0;if(o===Ft)return-0;if(i)throw new Error("Invalid input");if(o in r)return r[o];const s=t[o];if(!s||typeof s!="object")r[o]=s;else if(Array.isArray(s))if(typeof s[0]=="string"){const c=s[0],l=n==null?void 0:n[c];if(l)return r[o]=l(a(s[1]));switch(c){case"Date":r[o]=new Date(s[1]);break;case"Set":const u=new Set;r[o]=u;for(let d=1;d<s.length;d+=1)u.add(a(s[d]));break;case"Map":const h=new Map;r[o]=h;for(let d=1;d<s.length;d+=2)h.set(a(s[d]),a(s[d+1]));break;case"RegExp":r[o]=new RegExp(s[1],s[2]);break;case"Object":r[o]=Object(s[1]);break;case"BigInt":r[o]=BigInt(s[1]);break;case"null":const g=Object.create(null);r[o]=g;for(let d=1;d<s.length;d+=2)g[s[d]]=a(s[d+1]);break;default:throw new Error(`Unknown type ${c}`)}}else{const c=new Array(s.length);r[o]=c;for(let l=0;l<s.length;l+=1){const u=s[l];u!==$t&&(c[l]=a(u))}}else{const c={};r[o]=c;for(const l in s){const u=s[l];c[l]=a(u)}}return r[o]}return a(0)}const Ye=new Set(["load","prerender","csr","ssr","trailingSlash","config"]);[...Ye];const Mt=new Set([...Ye]);[...Mt];function Gt(e){return e.filter(n=>n!=null)}class oe{constructor(n,t){this.status=n,typeof t=="string"?this.body={message:t}:t?this.body=t:this.body={message:`Error: ${n}`}}toString(){return JSON.stringify(this.body)}}class Je{constructor(n,t){this.status=n,this.location=t}}class we extends Error{constructor(n,t,r){super(r),this.status=n,this.text=t}}const Ht="x-sveltekit-invalidated",Bt="x-sveltekit-trailing-slash";function X(e){return e instanceof oe||e instanceof we?e.status:500}function Kt(e){return e instanceof we?e.text:"Internal Error"}const O=qe(Ge)??{},B=qe(Me)??{},T={url:Ue({}),page:Ue({}),navigating:re(null),updated:Ot()};function ve(e){O[e]=ye()}function zt(e,n){let t=e+1;for(;O[t];)delete O[t],t+=1;for(t=n+1;B[t];)delete B[t],t+=1}function V(e){return location.href=e.href,new Promise(()=>{})}function Ne(){}let se,ge,Z,x,me,F;const We=[],Q=[];let R=null;const be=[],Yt=[];let N=[],y={branch:[],error:null,url:null},ke=!1,ee=!1,Oe=!0,K=!1,q=!1,Xe=!1,Ee=!1,Se,S,L,I,te;const G=new Set;async function sn(e,n,t){var a,o;document.URL!==location.href&&(location.href=location.href),F=e,se=xt(e),x=document.documentElement,me=n,ge=e.nodes[0],Z=e.nodes[1],ge(),Z(),S=(a=history.state)==null?void 0:a[D],L=(o=history.state)==null?void 0:o[H],S||(S=L=Date.now(),history.replaceState({...history.state,[D]:S,[H]:L},""));const r=O[S];r&&(history.scrollRestoration="manual",scrollTo(r.x,r.y)),t?await nn(me,t):en(location.href,{replaceState:!0}),tn()}function Jt(){We.length=0,Ee=!1}function Ze(e){Q.some(n=>n==null?void 0:n.snapshot)&&(B[e]=Q.map(n=>{var t;return(t=n==null?void 0:n.snapshot)==null?void 0:t.capture()}))}function Qe(e){var n;(n=B[e])==null||n.forEach((t,r)=>{var a,o;(o=(a=Q[r])==null?void 0:a.snapshot)==null||o.restore(t)})}function je(){ve(S),xe(Ge,O),Ze(L),xe(Me,B)}async function et(e,n,t,r){return Y({type:"goto",url:Be(e),keepfocus:n.keepFocus,noscroll:n.noScroll,replace_state:n.replaceState,state:n.state,redirect_count:t,nav_token:r,accept:()=>{n.invalidateAll&&(Ee=!0)}})}async function Wt(e){if(e.id!==(R==null?void 0:R.id)){const n={};G.add(n),R={id:e.id,token:n,promise:nt({...e,preload:n}).then(t=>(G.delete(n),t.type==="loaded"&&t.state.error&&(R=null),t))}}return R.promise}async function he(e){const n=se.find(t=>t.exec(rt(e)));n&&await Promise.all([...n.layouts,n.leaf].map(t=>t==null?void 0:t[1]()))}function tt(e,n,t){var o;y=e.state;const r=document.querySelector("style[data-sveltekit]");r&&r.remove(),I=e.props.page,Se=new F.root({target:n,props:{...e.props,stores:T,components:Q},hydrate:t}),Qe(L);const a={from:null,to:{params:y.params,route:{id:((o=y.route)==null?void 0:o.id)??null},url:new URL(location.href)},willUnload:!1,type:"enter",complete:Promise.resolve()};N.forEach(i=>i(a)),ee=!0}function ne({url:e,params:n,branch:t,status:r,error:a,route:o,form:i}){let s="never";if(P&&(e.pathname===P||e.pathname===P+"/"))s="always";else for(const d of t)(d==null?void 0:d.slash)!==void 0&&(s=d.slash);e.pathname=ht(e.pathname,s),e.search=e.search;const c={type:"loaded",state:{url:e,params:n,branch:t,error:a,route:o},props:{constructors:Gt(t).map(d=>d.node.component),page:I}};i!==void 0&&(c.props.form=i);let l={},u=!I,h=0;for(let d=0;d<Math.max(t.length,y.branch.length);d+=1){const _=t[d],f=y.branch[d];(_==null?void 0:_.data)!==(f==null?void 0:f.data)&&(u=!0),_&&(l={...l,..._.data},u&&(c.props[`data_${h}`]=l),h+=1)}return(!y.url||e.href!==y.url.href||y.error!==a||i!==void 0&&i!==I.form||u)&&(c.props.page={error:a,params:n,route:{id:(o==null?void 0:o.id)??null},state:{},status:r,url:new URL(e),form:i??null,data:u?l:I.data}),c}async function Ae({loader:e,parent:n,url:t,params:r,route:a,server_data_node:o}){var u,h,g;let i=null,s=!0;const c={dependencies:new Set,params:new Set,parent:!1,route:!1,url:!1,search_params:new Set},l=await e();if((u=l.universal)!=null&&u.load){let d=function(...f){for(const m of f){const{href:b}=new URL(m,t);c.dependencies.add(b)}};const _={route:new Proxy(a,{get:(f,m)=>(s&&(c.route=!0),f[m])}),params:new Proxy(r,{get:(f,m)=>(s&&c.params.add(m),f[m])}),data:(o==null?void 0:o.data)??null,url:_t(t,()=>{s&&(c.url=!0)},f=>{s&&c.search_params.add(f)}),async fetch(f,m){let b;f instanceof Request?(b=f.url,m={body:f.method==="GET"||f.method==="HEAD"?void 0:await f.blob(),cache:f.cache,credentials:f.credentials,headers:f.headers,integrity:f.integrity,keepalive:f.keepalive,method:f.method,mode:f.mode,redirect:f.redirect,referrer:f.referrer,referrerPolicy:f.referrerPolicy,signal:f.signal,...m}):b=f;const A=new URL(b,t);return s&&d(A.href),A.origin===t.origin&&(b=A.href.slice(t.origin.length)),ee?St(b,A.href,m):Et(b,m)},setHeaders:()=>{},depends:d,parent(){return s&&(c.parent=!0),n()},untrack(f){s=!1;try{return f()}finally{s=!0}}};i=await l.universal.load.call(null,_)??null}return{node:l,loader:e,server:o,universal:(h=l.universal)!=null&&h.load?{type:"data",data:i,uses:c}:null,data:i??(o==null?void 0:o.data)??null,slash:((g=l.universal)==null?void 0:g.trailingSlash)??(o==null?void 0:o.slash)}}function $e(e,n,t,r,a,o){if(Ee)return!0;if(!a)return!1;if(a.parent&&e||a.route&&n||a.url&&t)return!0;for(const i of a.search_params)if(r.has(i))return!0;for(const i of a.params)if(o[i]!==y.params[i])return!0;for(const i of a.dependencies)if(We.some(s=>s(new URL(i))))return!0;return!1}function Re(e,n){return(e==null?void 0:e.type)==="data"?e:(e==null?void 0:e.type)==="skip"?n??null:null}function Xt(e,n){if(!e)return new Set(n.searchParams.keys());const t=new Set([...e.searchParams.keys(),...n.searchParams.keys()]);for(const r of t){const a=e.searchParams.getAll(r),o=n.searchParams.getAll(r);a.every(i=>o.includes(i))&&o.every(i=>a.includes(i))&&t.delete(r)}return t}function De({error:e,url:n,route:t,params:r}){return{type:"loaded",state:{error:e,url:n,route:t,params:r,branch:[]},props:{page:I,constructors:[]}}}async function nt({id:e,invalidating:n,url:t,params:r,route:a,preload:o}){if((R==null?void 0:R.id)===e)return G.delete(R.token),R.promise;const{errors:i,layouts:s,leaf:c}=a,l=[...s,c];i.forEach(p=>p==null?void 0:p().catch(()=>{})),l.forEach(p=>p==null?void 0:p[1]().catch(()=>{}));let u=null;const h=y.url?e!==y.url.pathname+y.url.search:!1,g=y.route?a.id!==y.route.id:!1,d=Xt(y.url,t);let _=!1;const f=l.map((p,v)=>{var U;const k=y.branch[v],E=!!(p!=null&&p[0])&&((k==null?void 0:k.loader)!==p[1]||$e(_,g,h,d,(U=k.server)==null?void 0:U.uses,r));return E&&(_=!0),E});if(f.some(Boolean)){try{u=await it(t,f)}catch(p){const v=await C(p,{url:t,params:r,route:{id:e}});return G.has(o)?De({error:v,url:t,params:r,route:a}):ie({status:X(p),error:v,url:t,route:a})}if(u.type==="redirect")return u}const m=u==null?void 0:u.nodes;let b=!1;const A=l.map(async(p,v)=>{var ce;if(!p)return;const k=y.branch[v],E=m==null?void 0:m[v];if((!E||E.type==="skip")&&p[1]===(k==null?void 0:k.loader)&&!$e(b,g,h,d,(ce=k.universal)==null?void 0:ce.uses,r))return k;if(b=!0,(E==null?void 0:E.type)==="error")throw E;return Ae({loader:p[1],url:t,params:r,route:a,parent:async()=>{var Pe;const Le={};for(let le=0;le<v;le+=1)Object.assign(Le,(Pe=await A[le])==null?void 0:Pe.data);return Le},server_data_node:Re(E===void 0&&p[0]?{type:"skip"}:E??null,p[0]?k==null?void 0:k.server:void 0)})});for(const p of A)p.catch(()=>{});const w=[];for(let p=0;p<l.length;p+=1)if(l[p])try{w.push(await A[p])}catch(v){if(v instanceof Je)return{type:"redirect",location:v.location};if(G.has(o))return De({error:await C(v,{params:r,url:t,route:{id:a.id}}),url:t,params:r,route:a});let k=X(v),E;if(m!=null&&m.includes(v))k=v.status??k,E=v.error;else if(v instanceof oe)E=v.body;else{if(await T.updated.check())return await V(t);E=await C(v,{params:r,url:t,route:{id:a.id}})}const U=await Zt(p,w,i);return U?ne({url:t,params:r,branch:w.slice(0,U.idx).concat(U.node),status:k,error:E,route:a}):await ot(t,{id:a.id},E,k)}else w.push(void 0);return ne({url:t,params:r,branch:w,status:200,error:null,route:a,form:n?void 0:null})}async function Zt(e,n,t){for(;e--;)if(t[e]){let r=e;for(;!n[r];)r-=1;try{return{idx:r+1,node:{node:await t[e](),loader:t[e],data:{},server:null,universal:null}}}catch{continue}}}async function ie({status:e,error:n,url:t,route:r}){const a={};let o=null;if(F.server_loads[0]===0)try{const l=await it(t,[!0]);if(l.type!=="data"||l.nodes[0]&&l.nodes[0].type!=="data")throw 0;o=l.nodes[0]??null}catch{(t.origin!==z||t.pathname!==location.pathname||ke)&&await V(t)}const s=await Ae({loader:ge,url:t,params:a,route:r,parent:()=>Promise.resolve({}),server_data_node:Re(o)}),c={node:await Z(),loader:Z,universal:null,server:null,data:null};return ne({url:t,params:a,branch:[s,c],status:e,error:n,route:null})}function Ie(e,n){if(!e||ae(e,P))return;let t;try{t=F.hooks.reroute({url:new URL(e)})??e.pathname}catch{return}const r=rt(t);for(const a of se){const o=a.exec(r);if(o)return{id:e.pathname+e.search,invalidating:n,route:a,params:gt(o),url:e}}}function rt(e){return pt(e.slice(P.length)||"/")}function at({url:e,type:n,intent:t,delta:r}){let a=!1;const o=lt(y,t,e,n);r!==void 0&&(o.navigation.delta=r);const i={...o.navigation,cancel:()=>{a=!0,o.reject(new Error("navigation cancelled"))}};return K||be.forEach(s=>s(i)),a?null:o}async function Y({type:e,url:n,popped:t,keepfocus:r,noscroll:a,replace_state:o,state:i={},redirect_count:s=0,nav_token:c={},accept:l=Ne,block:u=Ne}){const h=Ie(n,!1),g=at({url:n,type:e,delta:t==null?void 0:t.delta,intent:h});if(!g){u();return}const d=S,_=L;l(),K=!0,ee&&T.navigating.set(g.navigation),te=c;let f=h&&await nt(h);if(!f){if(ae(n,P))return await V(n);f=await ot(n,{id:null},await C(new we(404,"Not Found",`Not found: ${n.pathname}`),{url:n,params:{},route:{id:null}}),404)}if(n=(h==null?void 0:h.url)||n,te!==c)return g.reject(new Error("navigation aborted")),!1;if(f.type==="redirect")if(s>=20)f=await ie({status:500,error:await C(new Error("Redirect loop"),{url:n,params:{},route:{id:null}}),url:n,route:{id:null}});else return et(new URL(f.location,n).href,{},s+1,c),!1;else f.props.page.status>=400&&await T.updated.check()&&await V(n);if(Jt(),ve(d),Ze(_),f.props.page.url.pathname!==n.pathname&&(n.pathname=f.props.page.url.pathname),i=t?t.state:i,!t){const w=o?0:1,p={[D]:S+=w,[H]:L+=w,[He]:i};(o?history.replaceState:history.pushState).call(history,p,"",n),o||zt(S,L)}if(R=null,f.props.page.state=i,ee){y=f.state,f.props.page&&(f.props.page.url=n);const w=(await Promise.all(Yt.map(p=>p(g.navigation)))).filter(p=>typeof p=="function");if(w.length>0){let p=function(){N=N.filter(v=>!w.includes(v))};w.push(p),N.push(...w)}Se.$set(f.props),Xe=!0}else tt(f,me,!1);const{activeElement:m}=document;await ut();const b=t?t.scroll:a?ye():null;if(Oe){const w=n.hash&&document.getElementById(decodeURIComponent(n.hash.slice(1)));b?scrollTo(b.x,b.y):w?w.scrollIntoView():scrollTo(0,0)}const A=document.activeElement!==m&&document.activeElement!==document.body;!r&&!A&&rn(),Oe=!0,f.props.page&&(I=f.props.page),K=!1,e==="popstate"&&Qe(L),g.fulfil(void 0),N.forEach(w=>w(g.navigation)),T.navigating.set(null)}async function ot(e,n,t,r){return e.origin===z&&e.pathname===location.pathname&&!ke?await ie({status:r,error:t,url:e,route:n}):await V(e)}function Qt(){let e;x.addEventListener("mousemove",o=>{const i=o.target;clearTimeout(e),e=setTimeout(()=>{r(i,2)},20)});function n(o){r(o.composedPath()[0],1)}x.addEventListener("mousedown",n),x.addEventListener("touchstart",n,{passive:!0});const t=new IntersectionObserver(o=>{for(const i of o)i.isIntersecting&&(he(i.target.href),t.unobserve(i.target))},{threshold:0});function r(o,i){const s=ze(o,x);if(!s)return;const{url:c,external:l,download:u}=pe(s,P);if(l||u)return;const h=W(s);if(!h.reload)if(i<=h.preload_data){const g=Ie(c,!1);g&&Wt(g)}else i<=h.preload_code&&he(c.pathname)}function a(){t.disconnect();for(const o of x.querySelectorAll("a")){const{url:i,external:s,download:c}=pe(o,P);if(s||c)continue;const l=W(o);l.reload||(l.preload_code===J.viewport&&t.observe(o),l.preload_code===J.eager&&he(i.pathname))}}N.push(a),a()}function C(e,n){if(e instanceof oe)return e.body;const t=X(e),r=Kt(e);return F.hooks.handleError({error:e,event:n,status:t,message:r})??{message:r}}function st(e,n){dt(()=>(e.push(n),()=>{const t=e.indexOf(n);e.splice(t,1)}))}function cn(e){st(N,e)}function ln(e){st(be,e)}function en(e,n={}){return e=Be(e),e.origin!==z?Promise.reject(new Error("goto: invalid URL")):et(e,n,0)}function tn(){var n;history.scrollRestoration="manual",addEventListener("beforeunload",t=>{let r=!1;if(je(),!K){const a=lt(y,void 0,null,"leave"),o={...a.navigation,cancel:()=>{r=!0,a.reject(new Error("navigation cancelled"))}};be.forEach(i=>i(o))}r?(t.preventDefault(),t.returnValue=""):history.scrollRestoration="auto"}),addEventListener("visibilitychange",()=>{document.visibilityState==="hidden"&&je()}),(n=navigator.connection)!=null&&n.saveData||Qt(),x.addEventListener("click",async t=>{var g;if(t.button||t.which!==1||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey||t.defaultPrevented)return;const r=ze(t.composedPath()[0],x);if(!r)return;const{url:a,external:o,target:i,download:s}=pe(r,P);if(!a)return;if(i==="_parent"||i==="_top"){if(window.parent!==window)return}else if(i&&i!=="_self")return;const c=W(r);if(!(r instanceof SVGAElement)&&a.protocol!==location.protocol&&!(a.protocol==="https:"||a.protocol==="http:")||s)return;if(o||c.reload){at({url:a,type:"link"})?K=!0:t.preventDefault();return}const[u,h]=a.href.split("#");if(h!==void 0&&u===ue(location)){const[,d]=y.url.href.split("#");if(d===h){t.preventDefault(),h===""||h==="top"&&r.ownerDocument.getElementById("top")===null?window.scrollTo({top:0}):(g=r.ownerDocument.getElementById(h))==null||g.scrollIntoView();return}if(q=!0,ve(S),e(a),!c.replace_state)return;q=!1}t.preventDefault(),await new Promise(d=>{requestAnimationFrame(()=>{setTimeout(d,0)}),setTimeout(d,100)}),Y({type:"link",url:a,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??a.href===location.href})}),x.addEventListener("submit",t=>{if(t.defaultPrevented)return;const r=HTMLFormElement.prototype.cloneNode.call(t.target),a=t.submitter;if(((a==null?void 0:a.formMethod)||r.method)!=="get")return;const i=new URL((a==null?void 0:a.hasAttribute("formaction"))&&(a==null?void 0:a.formAction)||r.action);if(ae(i,P))return;const s=t.target,c=W(s);if(c.reload)return;t.preventDefault(),t.stopPropagation();const l=new FormData(s),u=a==null?void 0:a.getAttribute("name");u&&l.append(u,(a==null?void 0:a.getAttribute("value"))??""),i.search=new URLSearchParams(l).toString(),Y({type:"form",url:i,keepfocus:c.keepfocus,noscroll:c.noscroll,replace_state:c.replace_state??i.href===location.href})}),addEventListener("popstate",async t=>{var r;if((r=t.state)!=null&&r[D]){const a=t.state[D];if(te={},a===S)return;const o=O[a],i=t.state[He]??{},s=new URL(t.state[Nt]??location.href),c=t.state[H],l=ue(location)===ue(y.url);if(c===L&&(Xe||l)){e(s),O[S]=ye(),o&&scrollTo(o.x,o.y),i!==I.state&&(I={...I,state:i},Se.$set({page:I})),S=a;return}const h=a-S;await Y({type:"popstate",url:s,popped:{state:i,scroll:o,delta:h},accept:()=>{S=a,L=c},block:()=>{history.go(-h)},nav_token:te})}else if(!q){const a=new URL(location.href);e(a)}}),addEventListener("hashchange",()=>{q&&(q=!1,history.replaceState({...history.state,[D]:++S,[H]:L},"",location.href))});for(const t of document.querySelectorAll("link"))t.rel==="icon"&&(t.href=t.href);addEventListener("pageshow",t=>{t.persisted&&T.navigating.set(null)});function e(t){y.url=t,T.page.set({...I,url:t}),T.page.notify()}}async function nn(e,{status:n=200,error:t,node_ids:r,params:a,route:o,data:i,form:s}){ke=!0;const c=new URL(location.href);({params:a={},route:o={id:null}}=Ie(c,!1)||{});let l;try{const u=r.map(async(d,_)=>{const f=i[_];return f!=null&&f.uses&&(f.uses=ct(f.uses)),Ae({loader:F.nodes[d],url:c,params:a,route:o,parent:async()=>{const m={};for(let b=0;b<_;b+=1)Object.assign(m,(await u[b]).data);return m},server_data_node:Re(f)})}),h=await Promise.all(u),g=se.find(({id:d})=>d===o.id);if(g){const d=g.layouts;for(let _=0;_<d.length;_++)d[_]||h.splice(_,0,void 0)}l=ne({url:c,params:a,branch:h,status:n,error:t,form:s,route:g??null})}catch(u){if(u instanceof Je){await V(new URL(u.location,location.href));return}l=await ie({status:X(u),error:await C(u,{url:c,params:a,route:o}),url:c,route:o})}l.props.page&&(l.props.page.state={}),tt(l,e,!0)}async function it(e,n){var a;const t=new URL(e);t.pathname=vt(e.pathname),e.pathname.endsWith("/")&&t.searchParams.append(Bt,"1"),t.searchParams.append(Ht,n.map(o=>o?"1":"0").join(""));const r=await Fe(t.href);if(!r.ok){let o;throw(a=r.headers.get("content-type"))!=null&&a.includes("application/json")?o=await r.json():r.status===404?o="Not Found":r.status===500&&(o="Internal Error"),new oe(r.status,o)}return new Promise(async o=>{var h;const i=new Map,s=r.body.getReader(),c=new TextDecoder;function l(g){return qt(g,{Promise:d=>new Promise((_,f)=>{i.set(d,{fulfil:_,reject:f})})})}let u="";for(;;){const{done:g,value:d}=await s.read();if(g&&!u)break;for(u+=!d&&u?`
`:c.decode(d,{stream:!0});;){const _=u.indexOf(`
`);if(_===-1)break;const f=JSON.parse(u.slice(0,_));if(u=u.slice(_+1),f.type==="redirect")return o(f);if(f.type==="data")(h=f.nodes)==null||h.forEach(m=>{(m==null?void 0:m.type)==="data"&&(m.uses=ct(m.uses),m.data=l(m.data))}),o(f);else if(f.type==="chunk"){const{id:m,data:b,error:A}=f,w=i.get(m);i.delete(m),A?w.reject(l(A)):w.fulfil(l(b))}}}})}function ct(e){return{dependencies:new Set((e==null?void 0:e.dependencies)??[]),params:new Set((e==null?void 0:e.params)??[]),parent:!!(e!=null&&e.parent),route:!!(e!=null&&e.route),url:!!(e!=null&&e.url),search_params:new Set((e==null?void 0:e.search_params)??[])}}function rn(){const e=document.querySelector("[autofocus]");if(e)e.focus();else{const n=document.body,t=n.getAttribute("tabindex");n.tabIndex=-1,n.focus({preventScroll:!0,focusVisible:!1}),t!==null?n.setAttribute("tabindex",t):n.removeAttribute("tabindex");const r=getSelection();if(r&&r.type!=="None"){const a=[];for(let o=0;o<r.rangeCount;o+=1)a.push(r.getRangeAt(o));setTimeout(()=>{if(r.rangeCount===a.length){for(let o=0;o<r.rangeCount;o+=1){const i=a[o],s=r.getRangeAt(o);if(i.commonAncestorContainer!==s.commonAncestorContainer||i.startContainer!==s.startContainer||i.endContainer!==s.endContainer||i.startOffset!==s.startOffset||i.endOffset!==s.endOffset)return}r.removeAllRanges()}})}}}function lt(e,n,t,r){var c,l;let a,o;const i=new Promise((u,h)=>{a=u,o=h});return i.catch(()=>{}),{navigation:{from:{params:e.params,route:{id:((c=e.route)==null?void 0:c.id)??null},url:e.url},to:t&&{params:(n==null?void 0:n.params)??null,route:{id:((l=n==null?void 0:n.route)==null?void 0:l.id)??null},url:t},willUnload:!n,type:r,complete:i},fulfil:a,reject:o}}export{cn as a,ln as b,P as c,sn as d,on as r,T as s,re as w};
