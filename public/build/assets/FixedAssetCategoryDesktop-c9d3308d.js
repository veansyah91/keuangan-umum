import{j as e}from"./app-68378a75.js";import{B as d}from"./BadgeDanger-9116da4e.js";import{B as o}from"./BadgeSuccess-40175e0c.js";import{d as l,e as a,f as c}from"./index.esm-023a1d14.js";import"./iconBase-f8c3c84d.js";function u({role:r,data:s,handleDelete:t,handleEdit:i,className:n}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:n,children:[e.jsx("td",{children:s.name.toUpperCase()}),e.jsx("td",{children:s.lifetime}),e.jsx("td",{children:Math.round(s.lifetime/12)}),e.jsx("td",{className:"text-center",children:s.status?e.jsx(o,{children:"Aktif"}):e.jsx(d,{children:"Tidak Aktif"})}),e.jsx("td",{className:"text-end",children:e.jsx("div",{className:"",children:r!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(l,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs("button",{onClick:i,children:[e.jsx(a,{}),"Ubah"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:t,children:[e.jsx(c,{}),"Hapus"]})})]})]})})})]})})}export{u as default};