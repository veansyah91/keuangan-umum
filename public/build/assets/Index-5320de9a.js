import{j as r,Y as s,a}from"./app-25f64d54.js";import{A as o}from"./AuthenticatedLayout-818dbd4f.js";import{H as n}from"./Header-e7d93afa.js";import{C as m}from"./ContainerDesktop-01ed0b57.js";import{C as e}from"./CardMenu-ba6cbfcd.js";import{g as i}from"./index.esm-84724444.js";import"./ApplicationLogo-75f1eeb0.js";import"./iconBase-87fce0ec.js";import"./transition-6cf3d9d9.js";/* empty css                      */import"./dayjs.min-e4fd89be.js";function p(){return r.jsxs(r.Fragment,{children:[r.jsx(s,{title:"Data Master"}),r.jsx(m,{children:r.jsx("div",{className:"flex justify-center pt-5 pb-10 gap-2",children:r.jsx(a,{href:route("admin.data-master.province"),children:r.jsx(e,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Wilayah"})})})}),r.jsx("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:r.jsx(a,{href:route("admin.data-master.province"),children:r.jsx(e,{bgColor:"bg-orange-500",icon:r.jsx(i,{}),title:"Data Wilayah"})})})]})}p.layout=t=>r.jsx(o,{header:r.jsx(n,{children:"Data Master"}),children:t,user:t.props.auth.user,title:"Data Master"});export{p as default};