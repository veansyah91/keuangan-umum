import{j as s,a}from"./app-53c76e57.js";import{f as l}from"./formatNumber-b542c689.js";import{d as o}from"./dayjs.min-f7628081.js";import{d as n,e as c,l as x,f as h}from"./index.esm-8edc8eb6.js";import{a as m}from"./index.esm-ef917d72.js";import"./iconBase-be1fbd1f.js";function N({fixedAsset:e,role:i,handleDelete:r,handleDisposal:d,disposalStatus:t}){return s.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[s.jsxs("div",{className:"text-start my-auto w-6/12 space-y-2",children:[s.jsxs("div",{className:"text-xs",children:[s.jsx("div",{children:"Nama: "}),s.jsx("div",{className:"font-bold",children:e.name.toUpperCase()})]}),s.jsxs("div",{className:"text-xs",children:[s.jsx("div",{children:"Kode: "}),s.jsx("div",{className:"font-bold",children:e.code.toUpperCase()})]}),s.jsxs("div",{className:"text-xs",children:[s.jsx("div",{children:"Tanggal Perolehan: "}),s.jsx("div",{className:"font-bold",children:o(e.date).format("MMM DD, YYYY")})]})]}),s.jsx("div",{className:"text-start w-5/12 space-y-2",children:s.jsxs("div",{className:"text-sm",children:[s.jsx("div",{children:"Nilai Perolehan: "}),s.jsxs("div",{className:"font-bold",children:["IDR. ",l(e.value)]})]})}),!t&&s.jsx("div",{className:"text-start w-1/12 space-y-2",children:i!=="viewer"&&s.jsxs("div",{className:"dropdown dropdown-left",children:[s.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:s.jsx(n,{})}),s.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[s.jsx("li",{children:s.jsxs(a,{href:route("data-master.fixed-asset.edit",{organization:e.organization_id,fixedAsset:e.id}),children:[s.jsx(c,{})," Edit"]})}),s.jsx("li",{children:s.jsxs(a,{href:route("data-master.fixed-asset.show",{organization:e.organization_id,fixedAsset:e.id}),children:[s.jsx(x,{})," Detail"]})}),s.jsx("li",{children:s.jsxs("button",{onClick:r,children:[s.jsx(h,{}),"Hapus"]})}),s.jsx("li",{children:s.jsxs("button",{onClick:d,children:[s.jsx(m,{}),"Disposal"]})})]})]})})]})}export{N as default};