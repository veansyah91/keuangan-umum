import{c as j,g as B}from"./app-60093d8b.js";var b={exports:{}};(function(w,N){(function(a,f){w.exports=f()})(j,function(){return function(a,f,u){a=a||{};var e=f.prototype,y={future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"};function x(r,t,i,m){return e.fromToBase(r,t,i,m)}u.en.relativeTime=y,e.fromToBase=function(r,t,i,m,g){for(var l,d,h,c=i.$locale().relativeTime||y,v=a.thresholds||[{l:"s",r:44,d:"second"},{l:"m",r:89},{l:"mm",r:44,d:"minute"},{l:"h",r:89},{l:"hh",r:21,d:"hour"},{l:"d",r:35},{l:"dd",r:25,d:"day"},{l:"M",r:45},{l:"MM",r:10,d:"month"},{l:"y",r:17},{l:"yy",d:"year"}],$=v.length,s=0;s<$;s+=1){var o=v[s];o.d&&(l=m?u(r).diff(i,o.d,!0):i.diff(r,o.d,!0));var n=(a.rounding||Math.round)(Math.abs(l));if(h=l>0,n<=o.r||!o.r){n<=1&&s>0&&(o=v[s-1]);var p=c[o.l];g&&(n=g(""+n)),d=typeof p=="string"?p.replace("%d",n):p(n,t,o.l,h);break}}if(t)return d;var M=h?c.future:c.past;return typeof M=="function"?M(d):M.replace("%s",d)},e.to=function(r,t){return x(r,t,this,!0)},e.from=function(r,t){return x(r,t,this)};var T=function(r){return r.$u?u.utc():u()};e.toNow=function(r){return this.to(T(this),r)},e.fromNow=function(r){return this.from(T(this),r)}}})})(b);var E=b.exports;const C=B(E);export{C as r};