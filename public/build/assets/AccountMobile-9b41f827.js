import{j as e}from"./app-f3916a1a.js";import{B as i}from"./BadgeDanger-fe23f138.js";import{B as d}from"./BadgeSuccess-10a8e10a.js";import{d as n,e as o,f as l}from"./index.esm-e9d04fa1.js";import"./iconBase-dd13dc9c.js";function p({account:s,handleEdit:r,handleDelete:t,role:a}){return e.jsx(e.Fragment,{children:e.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[e.jsxs("div",{className:"text-start my-auto w-1/2",children:[e.jsx("div",{className:"text-xs",children:s.code.toUpperCase()}),e.jsx("div",{children:s.name.toUpperCase()})]}),e.jsx("div",{className:"text-center my-auto w-5/12",children:s.is_active?e.jsx(d,{children:"Aktif"}):e.jsx(i,{children:"Tidak Aktif"})}),e.jsx("div",{className:"text-start w-1/12",children:a!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(n,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs("button",{onClick:r,children:[e.jsx(o,{}),"Ubah"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:t,children:[e.jsx(l,{}),"Hapus"]})})]})]})})]})})}export{p as default};