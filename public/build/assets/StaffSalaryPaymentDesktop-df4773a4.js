import{j as r,a as t}from"./app-25f64d54.js";import{f as d}from"./formatMonth-e96174de.js";import{f as a}from"./formatNumber-b542c689.js";import{d as n}from"./dayjs.min-e4fd89be.js";import{d as l,e as c}from"./index.esm-84724444.js";import{L as x}from"./index.esm-66b976ea.js";import"./iconBase-87fce0ec.js";function p({payment:s,className:e,role:o,handelEdit:i}){return r.jsx(r.Fragment,{children:r.jsxs("tr",{className:e,children:[r.jsx("td",{children:n(s.date).locale("id").format("MMMM DD, YYYY")}),r.jsx("td",{children:s.no_ref}),r.jsxs("td",{children:[d(s.month)," (",s.month,")"]}),r.jsx("td",{children:s.study_year}),r.jsxs("td",{className:"text-end",children:["IDR. ",a(s.value)]}),r.jsx("td",{className:"text-end",children:o!=="viewer"&&r.jsxs("div",{className:"dropdown dropdown-left",children:[r.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:r.jsx(l,{})}),r.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[r.jsx("li",{children:r.jsxs(t,{href:route("cashflow.staff-salary-payment.show",{organization:s.organization_id,id:s.id}),children:[r.jsx(x,{}),"Detail"]})}),r.jsx("li",{children:r.jsxs("button",{onClick:()=>i(s),children:[r.jsx(c,{}),"Ubah"]})})]})]})})]})})}export{p as default};