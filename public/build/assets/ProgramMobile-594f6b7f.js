import{j as s}from"./app-f39f5256.js";import{B as d}from"./BadgeDanger-64cca050.js";import{B as l}from"./BadgeSuccess-34fd9e1e.js";import{d as n,e as o,h as c,f as x}from"./index.esm-1a465fb0.js";import"./iconBase-62f121b1.js";function p({program:e,role:i,handleDelete:t,handleEdit:a,handleShow:r}){return s.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[s.jsxs("div",{className:"text-start my-auto w-11/12",children:[s.jsx("div",{className:"text-xs",children:e.code}),s.jsx("div",{children:e.name}),s.jsxs("div",{className:"text-xs flex gap-2",children:[s.jsx("div",{className:"my-auto",children:"Status"}),s.jsx("div",{className:"font-bold",children:e.is_active?s.jsx(l,{children:"Aktif"}):s.jsx(d,{children:"Tidak Aktif"})})]})]}),s.jsx("div",{className:"text-start my-auto w-1/12",children:i!=="viewer"&&s.jsxs("div",{className:"dropdown dropdown-left",children:[s.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:s.jsx(n,{})}),s.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[s.jsx("li",{children:s.jsxs("button",{onClick:a,children:[s.jsx(o,{}),"Edit"]})}),s.jsx("li",{children:s.jsxs("button",{onClick:r,children:[s.jsx(c,{}),"Detail"]})}),s.jsx("li",{children:s.jsxs("button",{onClick:t,children:[s.jsx(x,{}),"Hapus"]})})]})]})})]})}export{p as default};