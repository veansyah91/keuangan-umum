import{j as e,a as i}from"./app-09a58158.js";import{B as d}from"./BadgeSecondary-a858022e.js";import{B as o}from"./BadgeSuccess-5c3a6853.js";import{f as n}from"./formatNumber-b542c689.js";import{d as l}from"./dayjs.min-62ab8c49.js";import{d as c,e as x,h,f as j}from"./index.esm-99f8d854.js";import"./iconBase-0a2c1025.js";function N({cashIn:r,className:s,handleDelete:a,handleEdit:m,role:t}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:s,children:[e.jsx("td",{children:l(r.date).locale("id").format("MMM DD, YYYY")}),e.jsx("td",{children:r.no_ref}),e.jsx("td",{children:r.contact.name}),e.jsx("td",{children:r.description}),e.jsxs("td",{className:"text-end",children:["IDR ",n(r.value)]}),e.jsx("td",{className:"text-center",children:r.journal.is_approved?e.jsx(o,{children:"Diterima"}):e.jsx(d,{children:"Draft"})}),e.jsx("td",{className:"text-end",children:t!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(c,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(i,{href:route("cashflow.cash-in.edit",{organization:r.organization_id,cashIn:r.id}),children:[e.jsx(x,{})," Edit"]})}),e.jsx("li",{children:e.jsxs(i,{href:route("cashflow.cash-in.show",{organization:r.organization_id,cashIn:r.id}),children:[e.jsx(h,{})," Detail / Tanda Terima"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:a,children:[e.jsx(j,{}),"Hapus"]})})]})]})})]})})}export{N as default};