import{j as s,W as v,Y as f,a as t}from"./app-5a32895a.js";import{A as b}from"./AuthenticatedLayout-aaefbd4c.js";import{H as m}from"./Header-e7fc7cfb.js";import{k as N}from"./react-toastify.esm-40084ac1.js";import{c as g}from"./index.esm-bd4bd7ee.js";import{P as l}from"./PrimaryButton-a204c97e.js";import B from"./Container-8bcf7c4c.js";import a from"./Card-7a6b84bc.js";import{B as w}from"./BadgeSuccess-94bdd5a6.js";import{S as y}from"./SuccessButton-97ce5553.js";import{d as o}from"./dayjs.min-75afdc15.js";import"./ApplicationLogo-129360f1.js";import"./iconBase-6b1d4fe3.js";import"./transition-7d2eb4c9.js";/* empty css                      */function c({children:e,width:r=""}){return s.jsx("span",{className:`text-center inline-flex items-center rounded-md bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 ring-1 ring-inset ring-slate-600/10 ${r}`,children:e})}function C({organization:e,expiredDate:r}){const{data:n,setData:h,post:x,processing:p,errors:k,reset:P}=v({product:"Tahunan"});console.log(r);const d=i=>{h("product",i)},j=i=>{i.preventDefault(),x(route("add-ons.whatsapp-invoice.store",e.id),{onSuccess:({props:u})=>{console.log(u)}})};return s.jsxs(s.Fragment,{children:[s.jsx(f,{title:"Buat Invoice WhatsApp"}),s.jsx(N,{}),s.jsx("div",{className:"w-full sm:mt-2",children:s.jsx("div",{className:"sm:mx-auto px-3 sm:px-5 py-2 sm:pt-0 space-y-5 md:space-y-0",children:s.jsx("div",{className:"sm:pt-0 pb-16 pt-12",children:s.jsx("div",{className:"py-2 px-2 sm:pt-0",children:s.jsx(B,{children:s.jsxs("form",{onSubmit:j,children:[s.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-t-lg",children:s.jsx("div",{className:"sm:p-6 px-6 py-6 text-gray-800 text-center",children:s.jsx(m,{children:"Pilih Paket Berlangganan"})})}),s.jsxs("div",{className:"bg-white overflow-hidden shadow-sm sm:flex pb-4 px-2 max-w-4xl",children:[s.jsxs(a,{className:`mt-2 sm:mt-0 ${n.product=="Bulanan"&&"border-[#57987f] border-2"}`,children:[s.jsx(a.CardHeader,{children:"Bulanan"}),s.jsxs(a.CardContent,{children:[s.jsxs("div",{className:"text-2xl line-through mb-5",children:[s.jsx("div",{children:"Rp. 250.000 "}),s.jsx("div",{children:s.jsx(c,{children:"Disc 54%"})})]}),s.jsx("div",{className:"text-4xl",children:"Rp. 115.000"}),s.jsx("div",{className:"italic text-sm",children:"Rp. 3.833 / hari"}),s.jsxs("div",{className:"mt-3 text-gray-500",children:["Berakhir Pada ",o(r.bulanan).locale("id").format("DD MMMM YYYY")]})]}),s.jsx("div",{className:"mt-5",children:s.jsx(l,{onClick:i=>d("Bulanan"),type:"button",children:"Pilih"})})]}),s.jsxs(a,{className:`mt-2 sm:mt-0 ${n.product=="Tahunan"&&"border-[#57987f] border-2"}`,children:[s.jsxs(a.CardHeader,{children:["Tahunan ",s.jsx(w,{children:"Rekomendasi"})]}),s.jsxs(a.CardContent,{children:[s.jsxs("div",{className:"text-2xl line-through mb-5",children:[s.jsx("div",{children:"Rp. 2.500.000 "}),s.jsx("div",{children:s.jsx(c,{children:"Disc 60%"})})]}),s.jsx("div",{className:"text-4xl",children:"Rp. 1.000.000"}),s.jsx("div",{className:"italic text-sm",children:"Rp. 2.778 / hari"}),s.jsx("div",{className:"mt-3 text-gray-500",children:s.jsxs("div",{children:["Berakhir Pada ",o(r.tahunan).locale("id").format("DD MMMM YYYY")]})})]}),s.jsx("div",{className:"mt-5",children:s.jsx(l,{onClick:()=>d("Tahunan"),type:"button",children:"Pilih"})})]})]}),s.jsxs("div",{className:"bg-white rounded-b-lg p-4 flex",children:[s.jsx("div",{className:"w-1/2"}),s.jsx("div",{className:"w-1/2 text-end",children:s.jsx(y,{type:"submit",disabled:p,children:"Buat Pesanan"})})]})]})})})})})})]})}C.layout=e=>s.jsx(b,{header:s.jsx(m,{children:"Buat Invoice WhatsApp"}),children:e,user:e.props.auth.user,role:e.props.role,organization:e.props.organization,title:"WhatsApp",backLink:s.jsx(t,{href:route("add-ons.whatsapp-invoice",e.props.organization.id),children:s.jsx(g,{})}),breadcrumbs:s.jsx("div",{className:"text-sm breadcrumbs",children:s.jsxs("ul",{children:[s.jsx("li",{className:"font-bold",children:s.jsx(t,{href:route("add-ons",e.props.organization.id),children:"Add-ons"})}),s.jsx("li",{className:"font-bold",children:s.jsx(t,{href:route("add-ons.whatsapp",e.props.organization.id),children:"WhatsApp Broadcast"})}),s.jsx("li",{className:"font-bold",children:s.jsx(t,{href:route("add-ons.whatsapp-invoice",e.props.organization.id),children:"Data Invoice"})}),s.jsx("li",{children:"Buat"})]})})});export{C as default};