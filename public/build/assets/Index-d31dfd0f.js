import{j as e,Y as u,a}from"./app-18d344c6.js";import{A as j}from"./AuthenticatedLayout-f72ab3d2.js";import{H as f}from"./Header-d3a5ebd0.js";import{C as m}from"./ContainerDesktop-a963213b.js";import{f as l,g as c}from"./index.esm-976e4b01.js";import{C as t}from"./CardMenu-0c91d745.js";import{F as o}from"./index.esm-fcebaf39.js";import{G as b}from"./iconBase-4b51c5f1.js";import{a as i}from"./index.esm-f7f6a4c0.js";import{P as h}from"./index.esm-0bed4385.js";import{C as d}from"./index.esm-2f359686.js";import"./ApplicationLogo-782d5a75.js";import"./transition-27a0ae6f.js";/* empty css                      */import"./dayjs.min-3c5969fb.js";function x(s){return b({tag:"svg",attr:{viewBox:"0 0 1024 1024"},child:[{tag:"path",attr:{d:"M849.152 0H211.153c-46 0-66.032 34-66.032 66v127.312h-34.928c-17.311 0-31.344 14.032-31.344 31.345 0 17.311 14.033 31.343 31.344 31.343h34.928v128.752h-31.936c-17.312 0-31.344 14.033-31.344 31.344 0 17.313 14.032 31.345 31.343 31.345h31.936v129.44h-32.624c-17.312 0-31.344 14.032-31.344 31.344s14.032 31.344 31.344 31.344h32.624v128.464h-32.624c-17.312 0-31.344 14.032-31.344 31.343s14.032 31.344 31.344 31.344h32.624V960c0 53.025 41.536 64 64.528 64h639.504c53.025 0 96-42.975 96-96V96c0-53.024-42.96-96-96-96zM209.121 960l-.001-129.279h33.344c17.311 0 31.344-14.032 31.344-31.344s-14.033-31.344-31.344-31.344H209.12V639.569h33.344c17.311 0 31.344-14.033 31.344-31.344s-14.033-31.344-31.344-31.344H209.12V447.44h34.032c17.313 0 31.345-14.032 31.345-31.345 0-17.311-14.032-31.344-31.344-31.344h-34.032V256h31.024c17.312 0 31.344-14.032 31.344-31.343 0-17.313-14.032-31.345-31.344-31.345h-31.024V66c0-.752.064-1.376.16-1.936a28.23 28.23 0 0 1 1.872-.064h510v896H209.121zm672.031-31.999c0 17.664-14.336 32-32 32h-64v-896h64c17.664 0 32 14.336 32 32v832z"}}]})(s)}function p({organization:s,menus:n}){return e.jsxs(e.Fragment,{children:[e.jsx(u,{title:"Arus Kas"}),e.jsxs(m,{children:[e.jsx("section",{className:"pt-5 pb-10",children:e.jsxs("div",{className:"flex justify-center gap-6",children:[e.jsx(a,{href:route("cashflow.cash-in",s.id),children:e.jsx(t,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Penerimaan"})}),e.jsx(a,{href:route("cashflow.cash-out",s.id),children:e.jsx(t,{bgColor:"bg-rose-500",icon:e.jsx("div",{className:"rotate-180",children:e.jsx(l,{})}),title:"Pengeluaran"})}),e.jsx(a,{href:route("cashflow.cash-mutation",s.id),children:e.jsx(t,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Mutasi Kas"})})]})}),n.find(r=>r.menu_name==="SISWA")&&e.jsx("section",{className:"text-center font-bold",children:e.jsxs("section",{className:"pt-2 pb-10 space-y-3",children:[e.jsx("div",{className:"text-center font-bold",children:"Siswa"}),e.jsxs("div",{className:"flex justify-center gap-6",children:[e.jsx(a,{href:route("cashflow.student-monthly-payment",s.id),children:e.jsx(t,{bgColor:"bg-orange-900",icon:e.jsx(i,{}),title:"Pembayaran Iuran Bulanan"})}),e.jsx(a,{href:route("cashflow.student-monthly-receivable",s.id),children:e.jsx(t,{bgColor:"bg-slate-600",icon:e.jsx(x,{}),title:"Piutang Iuran Bulanan"})}),e.jsx(a,{href:route("cashflow.student-entry-payment",s.id),children:e.jsx(t,{bgColor:"bg-blue-600",icon:e.jsx(h,{}),title:"Pembayaran Iuran Tahunan"})}),e.jsx(a,{href:route("cashflow.student-entry-receivable",s.id),children:e.jsx(t,{bgColor:"bg-red-600",icon:e.jsx(d,{}),title:"Piutang Iuran Tahunan"})}),e.jsx(a,{href:route("cashflow.student-entry-receivable-payment",s.id),children:e.jsx(t,{bgColor:"bg-green-600",icon:e.jsx(c,{}),title:"Pembayaran Piutang Iuran Tahunan"})})]})]})}),n.find(r=>r.menu_name==="STAFF")&&e.jsx("section",{className:"text-center font-bold",children:e.jsxs("section",{className:"pt-2 pb-10 space-y-3",children:[e.jsx("div",{className:"text-center font-bold",children:"Staff"}),e.jsx("div",{className:"flex justify-center gap-6",children:e.jsx(a,{href:route("cashflow.staff-salary-payment",s.id),children:e.jsx(t,{bgColor:"bg-green-500",icon:e.jsx(i,{}),title:"Pembayaran Gaji Bulanan"})})})]})})]}),e.jsxs("section",{children:[e.jsxs("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:[e.jsx(a,{href:route("cashflow.cash-in",s.id),children:e.jsx(t,{bgColor:"bg-cyan-500",icon:e.jsx(l,{}),title:"Penerimaan"})}),e.jsx(a,{href:route("cashflow.cash-out",s.id),children:e.jsx(t,{bgColor:"bg-rose-500",icon:e.jsx("div",{className:"rotate-180",children:e.jsx(l,{})}),title:"Pengeluaran"})}),e.jsx(a,{href:route("cashflow.cash-mutation",s.id),children:e.jsx(t,{bgColor:"bg-orange-500",icon:e.jsx(o,{}),title:"Mutasi Kas"})})]}),n.find(r=>r.menu_name==="SISWA")&&e.jsxs("div",{className:"sm:hidden pt-5 bg-white ",children:[e.jsx("div",{className:"text-center font-bold",children:"Siswa"}),e.jsxs("div",{className:"flex flex-wrap pt-2 px-2 mx-auto gap-2 w-full justify-center",children:[e.jsx(a,{href:route("cashflow.student-monthly-payment",s.id),children:e.jsx(t,{bgColor:"bg-orange-900",icon:e.jsx(i,{}),title:"Pembayaran Iuran Bulanan"})}),e.jsx(a,{href:route("cashflow.student-monthly-receivable",s.id),children:e.jsx(t,{bgColor:"bg-slate-600",icon:e.jsx(x,{}),title:"Piutang Iuran Bulanan"})}),e.jsx(a,{href:route("cashflow.student-entry-payment",s.id),children:e.jsx(t,{bgColor:"bg-blue-600",icon:e.jsx(h,{}),title:"Pembayaran Iuran Tahunan"})}),e.jsx(a,{href:route("cashflow.student-entry-receivable",s.id),children:e.jsx(t,{bgColor:"bg-red-600",icon:e.jsx(d,{}),title:"Piutang Iuran Tahunan"})}),e.jsx(a,{href:route("cashflow.student-entry-receivable-payment",s.id),children:e.jsx(t,{bgColor:"bg-green-600",icon:e.jsx(c,{}),title:"Pembayaran Piutang Iuran Tahunan"})})]})]}),n.find(r=>r.menu_name==="STAFF")&&e.jsxs("div",{className:"sm:hidden pt-5 bg-white ",children:[e.jsx("div",{className:"text-center font-bold",children:"Staf"}),e.jsx("div",{className:"flex flex-wrap pt-2 px-2 mx-auto gap-2 w-full justify-center",children:e.jsx(a,{href:route("cashflow.staff-salary-payment",s.id),children:e.jsx(t,{bgColor:"bg-green-500",icon:e.jsx(i,{}),title:"Pembayaran Gaji Bulanan"})})})]})]})]})}p.layout=s=>e.jsx(j,{header:e.jsx(f,{}),children:s,user:s.props.auth.user,role:s.props.role,organization:s.props.organization,title:"Arus Kas"});export{p as default};