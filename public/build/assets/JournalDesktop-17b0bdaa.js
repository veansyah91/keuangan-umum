import{j as e,a as s}from"./app-f39f5256.js";import{B as t}from"./BadgeSecondary-d4c7b848.js";import{B as n}from"./BadgeSuccess-34fd9e1e.js";import{f as o}from"./formatNumber-b542c689.js";import{d as l}from"./dayjs.min-2681d619.js";import{d as c,e as x,h,f as m}from"./index.esm-1a465fb0.js";import"./iconBase-62f121b1.js";function D({journal:r,className:d,handleDelete:i,handleEdit:j,role:a}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:d,children:[e.jsx("td",{children:l(r.date).locale("id").format("MMM DD, YYYY")}),e.jsx("td",{children:r.no_ref}),e.jsx("td",{children:r.description}),e.jsxs("td",{className:"text-end",children:["IDR ",o(r.value)]}),e.jsx("td",{className:"text-center",children:r.is_approved?e.jsx(n,{children:"Diterima"}):e.jsx(t,{children:"Draft"})}),e.jsx("td",{className:"text-end",children:a!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(c,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(s,{href:route("data-ledger.journal.edit",{organization:r.organization_id,journal:r.id}),preserveScroll:!0,children:[e.jsx(x,{})," Edit"]})}),e.jsx("li",{children:e.jsxs(s,{href:route("data-ledger.journal.show",{organization:r.organization_id,journal:r.id}),children:[e.jsx(h,{})," Detail / Tanda Terima"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:i,children:[e.jsx(m,{}),"Hapus"]})})]})]})})]})})}export{D as default};