import{j as e}from"./app-8a73958f.js";import{B as o}from"./BadgeDanger-003e09b9.js";import{B as l}from"./BadgeSuccess-d1af9c0c.js";import{d as a,e as c,h as x,f as h}from"./index.esm-72e46d09.js";import"./iconBase-0306a48d.js";function f({department:s,className:i,handleDelete:r,handleEdit:n,handleShow:t,role:d}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:i,children:[e.jsx("td",{children:s.code}),e.jsx("td",{children:s.name}),e.jsx("td",{children:s.description}),e.jsx("td",{className:"text-center",children:s.is_active?e.jsx(l,{children:"Aktif"}):e.jsx(o,{children:"Tidak Aktif"})}),e.jsx("td",{className:"text-end",children:d!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(a,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs("button",{onClick:n,children:[e.jsx(c,{}),"Edit"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:t,children:[e.jsx(x,{}),"Detail"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:r,children:[e.jsx(h,{}),"Hapus"]})})]})]})})]})})}export{f as default};
