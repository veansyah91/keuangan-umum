import{j as e,Y as i,a as t}from"./app-f39f5256.js";import{A as d}from"./AuthenticatedLayout-e2125e6a.js";import{H as n}from"./Header-39ce6dc8.js";import{C as c}from"./ContainerDesktop-a3bc2847.js";import{C as a}from"./CardMenu-26f0bf1b.js";import{a as o}from"./index.esm-d00ddb83.js";import{b as l}from"./index.esm-9383f473.js";import{a as s}from"./index.esm-aa7de6a1.js";import"./ApplicationLogo-dae171ed.js";import"./iconBase-62f121b1.js";import"./transition-4036d903.js";/* empty css                      */import"./dayjs.min-2681d619.js";function u({organization:r}){return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Data Akun"}),e.jsxs(c,{children:[e.jsx("div",{className:"mx-auto w-full text-center font-bold",children:"Akun-Akun"}),e.jsxs("div",{className:"flex justify-center pt-5 pb-10 gap-5",children:[e.jsx(t,{href:route("data-ledger.account-category",r.id),children:e.jsx(a,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Data Kategori Akun"})}),e.jsx(t,{href:route("data-ledger.account",r.id),children:e.jsx(a,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Daftar Akun"})}),e.jsx(t,{href:route("data-ledger.account-school",r.id),children:e.jsx(a,{bgColor:"bg-slate-500",icon:e.jsx(o,{}),title:"Daftar Akun Sekolah"})})]}),e.jsx("div",{className:"flex justify-center pt-5 pb-10 gap-5",children:e.jsx(t,{href:route("data-ledger.journal",r.id),children:e.jsx(a,{bgColor:"bg-emerald-500",icon:e.jsx(s,{}),title:"Jurnal Umum"})})})]}),e.jsxs("div",{className:"sm:hidden pt-14 pb-5 px-2 mx-auto bg-white ",children:[e.jsx("div",{className:"mx-auto w-full text-center font-bold",children:"Akun-Akun"}),e.jsxs("div",{className:"flex flex-wrap gap-2 w-full justify-center",children:[e.jsx(t,{href:route("data-ledger.account-category",r.id),children:e.jsx(a,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Data Kategori Akun"})}),e.jsx(t,{href:route("data-ledger.account",r.id),children:e.jsx(a,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Data Akun"})}),e.jsx(t,{href:route("data-ledger.account-school",r.id),children:e.jsx(a,{bgColor:"bg-slate-500",icon:e.jsx(o,{}),title:"Daftar Akun Sekolah"})})]}),e.jsx("div",{className:"flex flex-wrap gap-2 w-full justify-center mt-5",children:e.jsx(t,{href:route("data-ledger.journal",r.id),children:e.jsx(a,{bgColor:"bg-emerald-500",icon:e.jsx(s,{}),title:"Jurnal Umum"})})})]})]})}u.layout=r=>e.jsx(d,{header:e.jsx(n,{}),children:r,user:r.props.auth.user,role:r.props.role,organization:r.props.organization,title:"Buku Besar"});export{u as default};