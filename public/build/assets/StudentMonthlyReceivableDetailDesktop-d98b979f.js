import{j as e,a as n}from"./app-68378a75.js";import{B as a}from"./BadgeDanger-9116da4e.js";import{B as o}from"./BadgeSuccess-40175e0c.js";import{f as i}from"./formatNumber-b542c689.js";import{d as l}from"./dayjs.min-c779e003.js";import{d as x,e as h,f as c}from"./index.esm-023a1d14.js";import"./iconBase-f8c3c84d.js";function y({receivable:s,className:d,role:t,handleEdit:m,handleDelete:r}){return e.jsx(e.Fragment,{children:e.jsxs("tr",{className:d,children:[e.jsx("td",{children:s.no_ref}),e.jsx("td",{children:l(s.date).locale("id").format("MMMM DD, YYYY")}),e.jsx("td",{children:s.month}),e.jsx("td",{children:s.study_year}),e.jsxs("td",{className:"text-end",children:["IDR. ",i(s.debit)]}),e.jsx("td",{children:s.paid_date?e.jsx(o,{children:"Lunas"}):e.jsx(a,{children:"Belum Lunas"})}),e.jsx("td",{className:"text-end",children:t!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(x,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(n,{href:route("cashflow.student-monthly-receivable.edit",{organization:s.receivable.organization_id,receivable:s.receivable_id,ledger:s.id}),children:[e.jsx(h,{}),"Ubah"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:r,children:[e.jsx(c,{}),"Hapus"]})})]})]})})]})})}export{y as default};