import{j as e,Y as a,a as s}from"./app-d483d98c.js";import{A as l}from"./AuthenticatedLayout-a772dc4c.js";import{H as d}from"./Header-0d522618.js";import{C as o}from"./ContainerDesktop-039f417c.js";import"./ApplicationLogo-0888e530.js";import"./iconBase-d5747956.js";import"./transition-e9de926c.js";/* empty css                      */import"./dayjs.min-1195a0c5.js";function t({organization:r}){return e.jsxs(e.Fragment,{children:[e.jsx(a,{title:"Laporan"}),e.jsx(o,{children:e.jsxs("div",{className:"flex justify-start pb-10 gap-2",children:[e.jsxs("div",{className:"w-1/4",children:[e.jsx("div",{className:"text-lg font-bold",children:"Laporan Keuangan"}),e.jsxs("div",{className:"space-y-2 mt-4",children:[e.jsx("div",{children:e.jsx(s,{href:route("report.cashflow",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Arus Kas"})}),e.jsx("div",{children:e.jsx(s,{href:route("report.balance",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Neraca"})}),e.jsx("div",{children:e.jsx(s,{href:route("report.lost-profit",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Laba Rugi"})}),e.jsx("div",{children:e.jsx(s,{href:route("report.trial-balance",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Neraca Lajur"})})]})]}),e.jsxs("div",{className:"w-1/4",children:[e.jsx("div",{className:"text-lg font-bold",children:"Laporan Buku Besar"}),e.jsxs("div",{className:"space-y-2 mt-4",children:[e.jsx("div",{children:e.jsx(s,{href:route("report.journal",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Jurnal"})}),e.jsx("div",{children:e.jsx(s,{href:route("report.ledger",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Buku Besar Per Akun"})}),e.jsx("div",{children:e.jsx(s,{href:route("report.ledgers",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Buku Besar"})})]})]})]})}),e.jsxs("div",{className:"sm:hidden flex flex-wrap pt-14 pb-5 px-2 mx-auto bg-white gap-2 w-full justify-center",children:[e.jsxs("div",{className:"w-full",children:[e.jsx("div",{className:"text-lg font-bold",children:"Laporan Keuangan"}),e.jsxs("div",{className:"mt-2",children:[e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.cashflow",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Arus Kas"})}),e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.balance",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Neraca"})}),e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.lost-profit",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Laba Rugi"})}),e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.trial-balance",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Neraca Lajur"})})]})]}),e.jsxs("div",{className:"w-full mt-4",children:[e.jsx("div",{className:"text-lg font-bold",children:"Laporan Buku Besar"}),e.jsxs("div",{className:"mt-2",children:[e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.journal",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Jurnal"})}),e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.ledger",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Buku Besar Per Akun"})}),e.jsx("div",{className:"border-b py-1",children:e.jsx(s,{href:route("report.ledgers",r.id),className:"hover:bg-slate-100 p-2 rounded-lg hover:font-bold",children:"Laporan Buku Besar"})})]})]})]})]})}t.layout=r=>e.jsx(l,{header:e.jsx(d,{}),children:r,user:r.props.auth.user,role:r.props.role,organization:r.props.organization,title:"Laporan"});export{t as default};