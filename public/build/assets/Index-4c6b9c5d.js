import{j as r,Y as n,a as e}from"./app-d483d98c.js";import{A as d}from"./AuthenticatedLayout-a772dc4c.js";import{H as u}from"./Header-0d522618.js";import{C as c}from"./ContainerDesktop-039f417c.js";import{C as a}from"./CardMenu-249e5ea7.js";import{G as s}from"./iconBase-d5747956.js";import{a as o}from"./index.esm-14868ce0.js";import"./ApplicationLogo-0888e530.js";import"./transition-e9de926c.js";/* empty css                      */import"./dayjs.min-1195a0c5.js";function i(t){return s({tag:"svg",attr:{viewBox:"0 0 256 256",fill:"currentColor"},child:[{tag:"path",attr:{d:"M184,112a8,8,0,0,1-8,8H112a8,8,0,0,1,0-16h64A8,8,0,0,1,184,112Zm-8,24H112a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16Zm48-88V208a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V48A16,16,0,0,1,48,32H208A16,16,0,0,1,224,48ZM48,208H72V48H48Zm160,0V48H88V208H208Z"}}]})(t)}function l(t){return s({tag:"svg",attr:{viewBox:"0 0 24 24"},child:[{tag:"path",attr:{d:"M20.0049 2C21.1068 2 22 2.89821 22 3.9908V20.0092C22 21.1087 21.1074 22 20.0049 22H4V18H2V16H4V13H2V11H4V8H2V6H4V2H20.0049ZM8 4H6V20H8V4ZM20 4H10V20H20V4Z"}}]})(t)}function x({organization:t}){return r.jsxs(r.Fragment,{children:[r.jsx(n,{title:"Data Akun"}),r.jsx(c,{children:r.jsxs("div",{className:"flex justify-center pt-5 pb-10 gap-5",children:[r.jsx(e,{href:route("data-ledger.account-category",t.id),children:r.jsx(a,{bgColor:"bg-cyan-500",icon:r.jsx(o,{}),title:"Data Kategori Akun"})}),r.jsx(e,{href:route("data-ledger.account",t.id),children:r.jsx(a,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Akun"})}),r.jsx(e,{href:route("data-ledger.journal",t.id),children:r.jsx(a,{bgColor:"bg-emerald-500",icon:r.jsx(l,{}),title:"Jurnal Umum"})})]})}),r.jsxs("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:[r.jsx(e,{href:route("data-ledger.account-category",t.id),children:r.jsx(a,{bgColor:"bg-cyan-500",icon:r.jsx(o,{}),title:"Data Kategori Akun"})}),r.jsx(e,{href:route("data-ledger.account",t.id),children:r.jsx(a,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Akun"})}),r.jsx(e,{href:route("data-ledger.journal",t.id),children:r.jsx(a,{bgColor:"bg-emerald-500",icon:r.jsx(l,{}),title:"Jurnal Umum"})})]})]})}x.layout=t=>r.jsx(d,{header:r.jsx(u,{}),children:t,user:t.props.auth.user,role:t.props.role,organization:t.props.organization,title:"Buku Besar"});export{x as default};