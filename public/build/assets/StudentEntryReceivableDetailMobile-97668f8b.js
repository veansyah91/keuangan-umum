import{j as t,a}from"./app-25f64d54.js";import{B as r}from"./BadgeDanger-6dabd75d.js";import{B as n}from"./BadgeSuccess-56e9f9bd.js";import{f as i}from"./formatNumber-b542c689.js";import{d as o}from"./dayjs.min-e4fd89be.js";import{B as d}from"./index.esm-53142a97.js";import{a as c}from"./index.esm-2780325c.js";import{d as l}from"./index.esm-84724444.js";import"./iconBase-87fce0ec.js";function N({receivable:e,className:m,role:s,handleEdit:x}){return t.jsx(t.Fragment,{children:t.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[t.jsxs("div",{className:"text-start my-auto",children:[t.jsx("div",{className:"text-xs",children:t.jsxs("div",{children:["Tanggal: ",o(e.date).locale("id").format("MMMM DD, YYYY")]})}),t.jsx("div",{children:e.no_ref}),t.jsx("div",{children:e.receivable_value>0?t.jsx(r,{children:"Belum Lunas"}):t.jsx(n,{children:"Lunas"})})]}),t.jsx("div",{className:"text-end my-auto w-5/12",children:t.jsxs("div",{children:["IDR ",i(e.receivable_value)]})}),t.jsx("div",{className:"text-start",children:s!=="viewer"&&t.jsxs("div",{className:"dropdown dropdown-left",children:[t.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:t.jsx(l,{})}),t.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[t.jsx("li",{children:t.jsxs(a,{href:route("cashflow.student-entry-receivable-payment.create",{organization:e.organization_id,contact:e.contact.name,selectedContact:e.contact.id}),children:[t.jsx(c,{}),"Bayar"]})}),t.jsx("li",{children:t.jsxs(a,{href:route("cashflow.student-entry-receivable-payment.create",{organization:e.organization_id,contact:e.contact.name,selectedContact:e.contact.id}),children:[t.jsx(d,{}),"Detail"]})})]})]})})]})})}export{N as default};