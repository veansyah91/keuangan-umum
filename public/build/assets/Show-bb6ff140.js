import{j as e,Y as o,a as c}from"./app-25f64d54.js";import{A as j}from"./AuthenticatedLayout-818dbd4f.js";import{H as p}from"./Header-e7d93afa.js";import{c as N}from"./index.esm-84724444.js";import{F as u}from"./index.esm-643f1113.js";import{S as v}from"./SecondaryButton-d0536d1d.js";import{d as b}from"./dayjs.min-e4fd89be.js";import{f as t}from"./formatNumber-b542c689.js";import"./ApplicationLogo-75f1eeb0.js";import"./iconBase-87fce0ec.js";import"./transition-6cf3d9d9.js";/* empty css                      */function f({organization:s,program:a,department:l,project:r,journal:i,ledgers:n,journalUser:x}){const m=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Detail Jurnal Umum"}),e.jsx("div",{className:'sm:pt-0 pb-16 pt-12 print:font-["Open_Sans"]',children:e.jsxs("div",{className:"bg-white py-2 sm:pt-0 px-5",children:[e.jsx("div",{className:"text-end px-3 print:hidden",children:e.jsx(v,{onClick:m,children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"my-auto",children:e.jsx(u,{})}),e.jsx("div",{className:"my-auto",children:"Print"})]})})}),e.jsxs("div",{className:"uppercase pt-10 pb-5 border-b hidden print:flex print:justify-between",children:[e.jsx("div",{className:"w-1/2 text-2xl my-auto",children:"voucher jurnal"}),e.jsxs("div",{className:"w-1/2 text-end mt-auto",children:[e.jsx("div",{children:s.name}),e.jsx("div",{className:"text-xs",children:s.address}),e.jsxs("div",{className:"text-xs",children:[s.village,", ",s.district,", ",s.regency,","," ",s.province]})]})]}),e.jsxs("div",{className:"w-full flex print:pt-5 gap-2",children:[e.jsxs("div",{className:`${a&&r&&l?"w-5/12":"w-full"} space-y-3`,children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:`${a&&r&&l?"w-4/12":"w-2/12"}`,children:"No. Ref"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:i.no_ref})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:`${a&&r&&l?"w-4/12":"w-2/12"}`,children:"Tanggal"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:b(i.date).format("MMM DD, YYYY")})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:`${a&&r&&l?"w-4/12":"w-2/12"}`,children:"Deskripsi"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:i.description})]})]}),a&&r&&l&&e.jsxs("div",{className:"w-7/12 space-y-3",children:[a&&e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"w-4/12",children:"Program Kegiatan"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:a.name})]}),r&&e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"w-4/12",children:"Proyek"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:r.name})]}),l&&e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"w-4/12",children:"Departemen"}),e.jsx("div",{className:"w-1/12 text-end",children:":"}),e.jsx("div",{className:"w-7/12",children:l.name})]})]})]}),e.jsx("div",{className:"w-full flex pt-5",children:e.jsxs("table",{className:"w-full border border-slate-800 text-sm",children:[e.jsx("thead",{className:"border border-slate-800 bg-slate-800 text-white print:text-slate-800 ",children:e.jsxs("tr",{children:[e.jsx("th",{className:"text-start px-3 py-2 border border-slate-800",children:"Kode Akun"}),e.jsx("th",{className:"text-start px-3 py-2 border border-slate-800",children:"Nama Akun"}),e.jsx("th",{className:"text-end px-3 py-2 border border-slate-800",children:"Debit"}),e.jsx("th",{className:"text-end px-3 py-2 border border-slate-800",children:"Kredit"})]})}),e.jsx("tbody",{children:n.sort((d,h)=>d.account.code-h.account.code).map(d=>e.jsxs("tr",{className:"border border-slate-800",children:[e.jsx("td",{className:"px-3 py-2 border border-slate-800",children:d.account.code}),e.jsx("td",{className:"px-3 py-2 border border-slate-800",children:d.account.name.toUpperCase()}),e.jsxs("td",{className:"text-end px-3 py-2 border border-slate-800",children:["IDR ",t(d.debit)]}),e.jsxs("td",{className:"text-end px-3 py-2 border border-slate-800",children:["IDR ",t(d.credit)]})]},d.id))}),e.jsx("tfoot",{className:"border border-slate-800 bg-slate-800 text-white print:text-slate-800",children:e.jsxs("tr",{children:[e.jsx("th",{colSpan:2,className:"text-start px-3 py-2",children:"Total"}),e.jsxs("th",{className:"text-end px-3 py-2 border border-slate-800",children:["IDR ",t(i.value)]}),e.jsxs("th",{className:"text-end px-3 py-2 border border-slate-800",children:["IDR ",t(i.value)]})]})})]})}),e.jsxs("div",{className:"w-full py-5 flex print:flex-row-reverse",children:[e.jsx("div",{}),e.jsxs("div",{className:"w-1/3 flex flex-col gap-28 mx-12",children:[e.jsx("div",{className:"w-full text-center",children:"Dibuat Oleh"}),e.jsx("div",{className:"w-full text-center border-t border-slate-900",children:x[0].name})]})]})]})})]})}f.layout=s=>e.jsx(j,{header:e.jsx(p,{children:"Detail Jurnal Umum"}),children:s,user:s.props.auth.user,organization:s.props.organization,title:"Detail Jurnal Umum",backLink:e.jsx(c,{href:route("data-ledger.journal",s.props.organization.id),children:e.jsx(N,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(c,{href:route("data-ledger",s.props.organization.id),children:"Buku Besar"})}),e.jsx("li",{className:"font-bold",children:e.jsx(c,{href:route("data-ledger.journal",s.props.organization.id),children:"Jurnal Umum"})}),e.jsx("li",{children:"Detail Jurnal Umum"})]})}),role:s.props.role});export{f as default};