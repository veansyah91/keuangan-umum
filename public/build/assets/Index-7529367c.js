import{j as e,Y as i,a as t}from"./app-09a58158.js";import{A as d}from"./AuthenticatedLayout-95496b06.js";import{H as n}from"./Header-bfa9803f.js";import{C as c}from"./ContainerDesktop-796b0bb2.js";import{C as a}from"./CardMenu-813ceed8.js";import{a as o}from"./index.esm-8d21f024.js";import{b as l}from"./index.esm-7c5506a4.js";import{a as s}from"./index.esm-f6cad1c4.js";import"./ApplicationLogo-71780ae1.js";import"./iconBase-0a2c1025.js";import"./transition-834a9f2b.js";/* empty css                      */import"./dayjs.min-62ab8c49.js";function u({organization:r}){return e.jsxs(e.Fragment,{children:[e.jsx(i,{title:"Data Akun"}),e.jsxs(c,{children:[e.jsx("div",{className:"mx-auto w-full text-center font-bold",children:"Akun-Akun"}),e.jsxs("div",{className:"flex justify-center pt-5 pb-10 gap-5",children:[e.jsx(t,{href:route("data-ledger.account-category",r.id),children:e.jsx(a,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Data Kategori Akun"})}),e.jsx(t,{href:route("data-ledger.account",r.id),children:e.jsx(a,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Daftar Akun"})}),e.jsx(t,{href:route("data-ledger.account-school",r.id),children:e.jsx(a,{bgColor:"bg-slate-500",icon:e.jsx(o,{}),title:"Daftar Akun Sekolah"})})]}),e.jsx("div",{className:"flex justify-center pt-5 pb-10 gap-5",children:e.jsx(t,{href:route("data-ledger.journal",r.id),children:e.jsx(a,{bgColor:"bg-emerald-500",icon:e.jsx(s,{}),title:"Jurnal Umum"})})})]}),e.jsxs("div",{className:"sm:hidden pt-14 pb-5 px-2 mx-auto bg-white ",children:[e.jsx("div",{className:"mx-auto w-full text-center font-bold",children:"Akun-Akun"}),e.jsxs("div",{className:"flex flex-wrap gap-2 w-full justify-center",children:[e.jsx(t,{href:route("data-ledger.account-category",r.id),children:e.jsx(a,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Data Kategori Akun"})}),e.jsx(t,{href:route("data-ledger.account",r.id),children:e.jsx(a,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Data Akun"})}),e.jsx(t,{href:route("data-ledger.account-school",r.id),children:e.jsx(a,{bgColor:"bg-slate-500",icon:e.jsx(o,{}),title:"Daftar Akun Sekolah"})})]}),e.jsx("div",{className:"flex flex-wrap gap-2 w-full justify-center mt-5",children:e.jsx(t,{href:route("data-ledger.journal",r.id),children:e.jsx(a,{bgColor:"bg-emerald-500",icon:e.jsx(s,{}),title:"Jurnal Umum"})})})]})]})}u.layout=r=>e.jsx(d,{header:e.jsx(n,{}),children:r,user:r.props.auth.user,role:r.props.role,organization:r.props.organization,title:"Buku Besar"});export{u as default};