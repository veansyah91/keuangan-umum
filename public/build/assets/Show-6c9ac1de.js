import{j as s,Y as a,a as l}from"./app-b1bae4cf.js";import{B as d}from"./BadgeDanger-6e528e4b.js";import{B as x}from"./BadgeSuccess-ed4748cc.js";import{B as m}from"./BadgeWarning-f30cb1f1.js";import{C as i}from"./Container-b7005526.js";import{H as r}from"./Header-c0cfe33d.js";import{S as c}from"./SecondaryButton-d8ddebe6.js";function u({auth:t,organization:e}){return s.jsxs(s.Fragment,{children:[s.jsx(a,{title:"Organization"}),s.jsx("div",{className:"min-h-screen bg-gray-100",children:s.jsxs("div",{className:"max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white rounded-lg",children:[s.jsxs(r,{children:[s.jsx("div",{className:"pt-4 text-center",children:"Detail Organisasi"}),s.jsxs("div",{className:"text-center",children:[e.status=="trial"&&s.jsx(m,{children:"Trial"}),e.status=="active"&&s.jsx(x,{children:"Aktif"}),e.status=="deactive"&&s.jsx(d,{children:"Tidak Aktif"})]})]}),s.jsxs(i,{maxHeight:"max-h-full",children:[s.jsx("div",{className:" px-8 sm:px-4",children:"Nama Organisasi:"}),s.jsx("div",{className:"font-bold px-8 sm:px-4 mt-2",children:e.name}),s.jsx("div",{className:"mt-9 px-8 sm:px-4",children:"Alamat Organisasi:"}),s.jsxs("div",{className:"font-bold px-8 sm:px-4",children:[e.address??"Belum Ada Data",s.jsxs("div",{children:[e.village??"",e.district&&`, ${e.district}`,e.regency&&`, ${e.regency}`,e.province&&`, ${e.province}`]})]}),s.jsx("div",{className:"mt-9 px-8 sm:px-4",children:"No Legalitas Organisasi:"}),s.jsx("div",{className:`${e.legality&&"font-bold"} px-8 sm:px-4 ${e.legality??"italic"}`,children:e.legality??"Belum Ada Data"}),s.jsx("div",{className:"mt-9 px-8 sm:px-4",children:"Tanggal Pendaftaran:"}),s.jsx("div",{className:"font-bold px-8 sm:px-4",children:e.date}),s.jsx("div",{className:"mt-9 px-8 sm:px-4",children:"Tanggal Kadaluarsa:"}),s.jsxs("div",{className:"font-bold px-8 sm:px-4",children:[e.expiredId," (sisa ",e.diffExpired,")"]}),s.jsx("div",{className:"mt-9 px-8 sm:px-4",children:s.jsx(l,{href:"/organizations",children:s.jsx(c,{children:"Kembali"})})})]})]})})]})}export{u as default};