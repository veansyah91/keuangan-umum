import{r as m,W as h,j as e,Y as x}from"./app-71a08f08.js";import{B as j}from"./BadgeSuccess-3c2218e9.js";import{H as p}from"./Header-1bd6e118.js";import s from"./Card-862ec3b2.js";import{P as d}from"./PrimaryButton-efd14abd.js";import{S as u}from"./SecondaryButton-c90a4984.js";import{S as f}from"./SuccessButton-f5cd91c2.js";import v from"./Container-d6af48f0.js";function R({organization:a}){m.useRef("");const{data:r,setData:n,post:l,processing:N,errors:C,reset:c}=h({product:"Tahunan"}),t=i=>{n("product",i)},o=()=>{l(route("organization.invoice.post",a.id),{onSuccess:()=>c()})};return e.jsxs(e.Fragment,{children:[e.jsx(x,{title:"Organization"}),e.jsxs(v,{children:[e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-t-lg",children:e.jsx("div",{className:"sm:p-6 px-6 py-6 text-gray-800 text-center",children:e.jsx(p,{children:"Pilih Paket Berlangganan"})})}),e.jsxs("div",{className:"bg-white overflow-hidden shadow-sm sm:flex pb-4 px-2",children:[e.jsxs(s,{className:`mt-2 sm:mt-0 ${r.product=="Bulanan"&&"border-[#57987f] border-2"}`,children:[e.jsx(s.CardHeader,{children:"Bulanan"}),e.jsxs(s.CardContent,{children:[e.jsx("div",{className:"text-4xl",children:"Rp. 70.000"}),e.jsx("div",{className:"italic text-sm",children:"Rp. 2.333 / hari"}),e.jsxs("div",{className:"mt-3 text-gray-500",children:["Berakhir Pada ",a.expiredAddAMonth]})]}),e.jsx("div",{className:"mt-5",children:e.jsx(d,{onClick:i=>t("Bulanan"),children:"Pilih"})})]}),e.jsxs(s,{className:`mt-2 sm:mt-0 ${r.product=="Tahunan"&&"border-[#57987f] border-2"}`,children:[e.jsxs(s.CardHeader,{children:["Tahunan ",e.jsx(j,{children:"Rekomendasi"})]}),e.jsxs(s.CardContent,{children:[e.jsx("div",{className:"text-4xl",children:"Rp. 600.000"}),e.jsx("div",{className:"italic text-sm",children:"Rp. 1.643 / hari"}),e.jsxs("div",{className:"mt-3 text-gray-500",children:["Berakhir Pada ",a.expiredAdd12Month]})]}),e.jsx("div",{className:"mt-5",children:e.jsx(d,{onClick:()=>t("Tahunan"),type:"button",children:"Pilih"})})]})]}),e.jsxs("div",{className:"bg-white rounded-b-lg p-4 flex",children:[e.jsx("div",{className:"w-1/2",children:e.jsx(u,{onClick:()=>history.back(),children:"Halaman Sebelumnya"})}),e.jsx("div",{className:"w-1/2 text-end",children:e.jsx(f,{onClick:o,children:"Buat Pesanan"})})]})]})]})}export{R as default};