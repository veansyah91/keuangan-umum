import{j as e,a as r}from"./app-532d12ca.js";import{f as n}from"./formatNumber-b542c689.js";import{d as i,p as d}from"./index.esm-57c76efb.js";import"./iconBase-2649accd.js";function h({receivable:s,role:a}){var t;return e.jsx(e.Fragment,{children:e.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[e.jsxs("div",{className:"text-start my-auto",children:[e.jsx("div",{children:s.contact.name}),e.jsxs("div",{className:"text-xs",children:[e.jsxs("div",{children:["No Siswa: ",s.contact.student.no_ref]}),e.jsxs("div",{children:["Kelas Terakhir: ",(t=s.contact.last_level)==null?void 0:t.level]})]})]}),e.jsx("div",{className:"text-end my-auto w-5/12",children:e.jsxs("div",{children:["IDR ",n(s.value)]})}),e.jsx("div",{className:"text-start",children:a!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(i,{})}),e.jsx("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:e.jsx("li",{children:e.jsxs(r,{href:route("cashflow.student-monthly-receivable.show",{organization:s.organization_id,receivable:s.id}),children:[e.jsx(d,{}),"Detail"]})})})]})})]})})}export{h as default};