import{j as e,a as t}from"./app-b1bae4cf.js";import{f as i}from"./formatNumber-b542c689.js";import{d as n}from"./dayjs.min-b8e970d9.js";import{d,e as o,f as l}from"./index.esm-cc030e73.js";import{L as c}from"./index.esm-6de4c18b.js";import"./iconBase-d2085e51.js";function v({payment:s,role:a,handleDelete:r}){return e.jsx(e.Fragment,{children:e.jsxs("div",{className:" text-gray-900 py-2 px-3 border flex gap-5 justify-between",children:[e.jsxs("div",{className:"text-start my-auto w-6/12",children:[e.jsx("div",{className:"text-xs",children:n(s.date).format("MMMM DD, YYYY")}),e.jsx("div",{className:"text-xs",children:s.no_ref}),e.jsx("div",{children:s.payment.contact.name}),e.jsx("div",{className:"text-xs",children:e.jsxs("div",{children:["Tahun Ajaran: ",s.study_year]})})]}),e.jsx("div",{className:"text-end my-auto w-5/12",children:e.jsxs("div",{children:["IDR ",i(s.credit)]})}),e.jsx("div",{className:"text-start w-1/12",children:a!=="viewer"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(d,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:[e.jsx("li",{children:e.jsxs(t,{href:route("cashflow.student-entry-receivable-payment.show",{organization:s.payment.organization_id,receivablePayment:s.id}),children:[e.jsx(c,{}),"Detail / Cetak"]})}),!s.receivable_ledger&&e.jsx("li",{children:e.jsxs(t,{href:route("cashflow.student-entry-receivable-payment.edit",{organization:s.payment.organization_id,receivablePayment:s.id,contact:s.payment.contact.name,selectedContact:s.payment.contact.id}),children:[e.jsx(o,{}),"Ubah"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:r,children:[e.jsx(l,{}),"Hapus"]})})]})]})})]})})}export{v as default};