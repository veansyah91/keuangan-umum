import{j as e,a as r}from"./app-60093d8b.js";import{f as d,B as t}from"./formatMonth-5d54415f.js";import{B as o}from"./BadgeSecondary-c7aebf45.js";import{B as l}from"./BadgeSuccess-a4da988e.js";import{d as n,e as c,f as x}from"./index.esm-53cbca2f.js";import{f as h}from"./formatNumber-b542c689.js";import{d as j}from"./dayjs.min-af66fe14.js";import{L as m}from"./index.esm-7586c4a7.js";import"./iconBase-bb6eae91.js";function I({payment:s,role:i,handleDelete:a,handleEdit:u}){return e.jsx(e.Fragment,{children:e.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[e.jsxs("div",{className:"text-start my-auto w-6/12",children:[e.jsx("div",{className:"text-xs",children:j(s.date).format("MMMM DD, YYYY")}),e.jsx("div",{className:"text-xs",children:s.no_ref}),e.jsx("div",{children:s.contact.name}),e.jsxs("div",{className:"text-xs",children:[e.jsxs("div",{children:["Bulan: ",d(s.month)," (",s.month,")"]}),e.jsxs("div",{children:["Tahun Ajaran: ",s.study_year]})]})]}),e.jsxs("div",{className:"text-end my-auto w-5/12",children:[e.jsxs("div",{children:["IDR ",h(s.value)]}),e.jsxs("div",{children:[s.type=="now"&&e.jsx(l,{children:"Lunas"}),s.type=="prepaid"&&e.jsx(t,{children:"Bayar Dimuka"}),s.type=="receivable"&&e.jsx(o,{children:"Belum Bayar"})]})]}),e.jsx("div",{className:"text-start w-1/12",children:i!=="viewer"&&s.type!=="receivable"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(n,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(r,{href:route("cashflow.student-monthly-payment.show",{organization:s.organization_id,id:s.id}),children:[e.jsx(m,{}),"Detail / Cetak"]})}),!s.receivable_ledger&&e.jsx("li",{children:e.jsxs(r,{href:route("cashflow.student-monthly-payment.edit",{organization:s.organization_id,payment:s.id}),children:[e.jsx(c,{}),"Ubah"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:a,children:[e.jsx(x,{}),"Hapus"]})})]})]})})]})})}export{I as default};