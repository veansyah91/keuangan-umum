import{j as i,Y as s,a as r}from"./app-5a32895a.js";import{A as t}from"./AuthenticatedLayout-aaefbd4c.js";import{H as l}from"./Header-e7fc7cfb.js";import{C as x}from"./ContainerDesktop-b31995c5.js";import{q as n}from"./index.esm-bd4bd7ee.js";import{L as o}from"./index.esm-a4b8cda0.js";import{C as e}from"./CardMenu-cee2dfbb.js";import"./ApplicationLogo-129360f1.js";import"./iconBase-6b1d4fe3.js";import"./transition-7d2eb4c9.js";/* empty css                      */import"./dayjs.min-75afdc15.js";function d(){return i.jsxs(i.Fragment,{children:[i.jsx(s,{title:"Organisasi"}),i.jsx(x,{children:i.jsxs("div",{className:"flex justify-center pt-5 pb-10 gap-2",children:[i.jsx(r,{href:route("admin.organization.index"),children:i.jsx(e,{bgColor:"bg-orange-500",icon:i.jsx(n,{}),title:"Daftar Organisasi"})}),i.jsx(r,{href:route("admin.organization.invoice.index"),children:i.jsx(e,{bgColor:"bg-cyan-500",icon:i.jsx(o,{}),title:"Invoice Organisasi"})})]})}),i.jsxs("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:[i.jsx(r,{href:route("admin.organization.index"),children:i.jsx(e,{bgColor:"bg-orange-500",icon:i.jsx(n,{}),title:"Daftar Organisasi"})}),i.jsx(r,{href:route("admin.organization.invoice.index"),children:i.jsx(e,{bgColor:"bg-cyan-500",icon:i.jsx(o,{}),title:"Invoice Organisasi"})})]})]})}d.layout=a=>i.jsx(t,{header:i.jsx(l,{children:"Organisasi"}),children:a,user:a.props.auth.user,title:"Organisasi"});export{d as default};