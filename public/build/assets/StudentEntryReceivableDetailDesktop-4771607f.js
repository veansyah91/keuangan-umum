import{j as t,a}from"./app-f39f5256.js";import{B as n}from"./BadgeDanger-64cca050.js";import{B as o}from"./BadgeSuccess-34fd9e1e.js";import{f as d}from"./formatNumber-b542c689.js";import{d as i}from"./dayjs.min-2681d619.js";import{B as l}from"./index.esm-554f78b7.js";import{a as c}from"./index.esm-65fbf8e4.js";import{d as m}from"./index.esm-1a465fb0.js";import"./iconBase-62f121b1.js";function w({receivable:e,className:s,role:r}){return t.jsxs("tr",{className:s,children:[t.jsx("td",{children:i(e.date).locale("id").format("MMMM DD, YYYY")}),t.jsx("td",{className:"text-start",children:e.no_ref}),t.jsx("td",{className:"text-start",children:e.study_year}),t.jsxs("td",{className:"text-end",children:["IDR. ",d(e.receivable_value)]}),t.jsx("td",{className:"text-start",children:e.receivable_value>0?t.jsx(n,{children:"Belum Lunas"}):t.jsx(o,{children:"Lunas"})}),t.jsx("td",{className:"text-end",children:r!=="viewer"&&t.jsxs("div",{className:"dropdown dropdown-left",children:[t.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:t.jsx(m,{})}),t.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.receivable_value>0&&t.jsx("li",{children:t.jsxs(a,{href:route("cashflow.student-entry-receivable-payment.create",{organization:e.organization_id,contact:e.contact.name,selectedContact:e.contact.id}),children:[t.jsx(c,{}),"Bayar"]})}),t.jsx("li",{children:t.jsxs(a,{href:route("cashflow.student-entry-receivable.print-per-payment",{organization:e.organization_id,payment:e.id}),children:[t.jsx(l,{}),"Detail"]})})]})]})})]})}export{w as default};