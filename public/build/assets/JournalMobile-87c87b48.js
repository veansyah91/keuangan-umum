import{j as e,a}from"./app-71a08f08.js";import{f as t}from"./formatNumber-b542c689.js";import{d}from"./dayjs.min-b64be250.js";import{d as o,e as n,n as l,f as x}from"./index.esm-e93d8aec.js";import"./iconBase-0837d2ad.js";function p({journal:s,role:i,handleDelete:r}){return e.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[e.jsxs("div",{className:"text-start my-auto w-1/2",children:[e.jsx("div",{className:"text-xs",children:d(s.date).format("MMM DD, YYYY")}),e.jsx("div",{children:s.no_ref}),e.jsx("div",{className:"text-xs",children:s.description})]}),e.jsx("div",{className:"text-end my-auto w-5/12",children:e.jsxs("div",{children:["IDR ",t(s.value)]})}),e.jsx("div",{className:"text-start my-auto w-1/12",children:i!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(o,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(a,{href:route("data-ledger.journal.edit",{organization:s.organization_id,journal:s.id}),children:[e.jsx(n,{})," Edit"]})}),e.jsx("li",{children:e.jsxs(a,{href:route("data-ledger.journal.show",{organization:s.organization_id,journal:s.id}),children:[e.jsx(l,{})," Detail / Tanda Terima"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:r,children:[e.jsx(x,{}),"Hapus"]})})]})]})})]})}export{p as default};