import{j as e,a as s}from"./app-f39f5256.js";import{B as o}from"./BadgeSecondary-d4c7b848.js";import{B as n}from"./BadgeSuccess-34fd9e1e.js";import{f as t}from"./formatNumber-b542c689.js";import{d as l}from"./dayjs.min-2681d619.js";import{d as c,e as x,h,f as j}from"./index.esm-1a465fb0.js";import"./iconBase-62f121b1.js";function I({cashOut:r,className:i,handleDelete:a,handleEdit:m,role:d}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:i,children:[e.jsx("td",{children:l(r.date).locale("id").format("MMM DD, YYYY")}),e.jsx("td",{children:r.no_ref}),e.jsx("td",{children:r.contact.name}),e.jsx("td",{children:r.description}),e.jsxs("td",{className:"text-end",children:["IDR ",t(r.value)]}),e.jsx("td",{className:"text-center",children:r.journal.is_approved?e.jsx(n,{children:"Diterima"}):e.jsx(o,{children:"Draft"})}),e.jsx("td",{className:"text-end",children:d!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(c,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(s,{href:route("cashflow.cash-out.edit",{organization:r.organization_id,cashOut:r.id}),children:[e.jsx(x,{})," Edit"]})}),e.jsx("li",{children:e.jsxs(s,{href:route("cashflow.cash-out.show",{organization:r.organization_id,cashOut:r.id}),children:[e.jsx(h,{})," Detail / Tanda Terima"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:a,children:[e.jsx(j,{}),"Hapus"]})})]})]})})]})})}export{I as default};