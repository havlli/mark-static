import{v as x,w as l}from"./scheduler.BTPGlIUF.js";function S(t){return t*t*t}function $(t){const n=t-1;return n*n*n+1}function b(t,{delay:n=0,duration:s=400,easing:c=x}={}){const a=+getComputedStyle(t).opacity;return{delay:n,duration:s,easing:c,css:r=>`opacity: ${r*a}`}}function U(t,{delay:n=0,duration:s=400,easing:c=$,x:a=0,y:r=0,opacity:e=0}={}){const o=getComputedStyle(t),i=+o.opacity,u=o.transform==="none"?"":o.transform,y=i*(1-e),[p,f]=l(a),[d,g]=l(r);return{delay:n,duration:s,easing:c,css:(m,_)=>`
			transform: ${u} translate(${(1-m)*p}${f}, ${(1-m)*d}${g});
			opacity: ${i-y*_}`}}function V(t,{delay:n=0,duration:s=400,easing:c=$,start:a=0,opacity:r=0}={}){const e=getComputedStyle(t),o=+e.opacity,i=e.transform==="none"?"":e.transform,u=1-a,y=o*(1-r);return{delay:n,duration:s,easing:c,css:(p,f)=>`
			transform: ${i} scale(${1-u*f});
			opacity: ${o-y*f}
		`}}export{U as a,S as c,b as f,V as s};
