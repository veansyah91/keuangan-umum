import{j as r,Y as s,a}from"./app-60093d8b.js";import{A as o}from"./AuthenticatedLayout-f4603aa5.js";import{H as n}from"./Header-fccd1917.js";import{C as m}from"./ContainerDesktop-99c6f4c3.js";import{C as e}from"./CardMenu-45d2e9f2.js";import{g as i}from"./index.esm-53cbca2f.js";import"./ApplicationLogo-07518b23.js";import"./iconBase-bb6eae91.js";import"./transition-69a0c110.js";/* empty css                      */import"./dayjs.min-af66fe14.js";function p(){return r.jsxs(r.Fragment,{children:[r.jsx(s,{title:"Data Master"}),r.jsx(m,{children:r.jsx("div",{className:"flex justify-center pt-5 pb-10 gap-2",children:r.jsx(a,{href:route("admin.data-master.province"),children:r.jsx(e,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Wilayah"})})})}),r.jsx("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:r.jsx(a,{href:route("admin.data-master.province"),children:r.jsx(e,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Wilayah"})})})]})}p.layout=t=>r.jsx(o,{header:r.jsx(n,{children:"Data Master"}),children:t,user:t.props.auth.user,title:"Data Master"});export{p as default};