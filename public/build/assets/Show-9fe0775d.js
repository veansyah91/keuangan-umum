import{j as s,Y as f,a as i}from"./app-e9563627.js";import{A as h}from"./AuthenticatedLayout-7672ecfe.js";import{H as j}from"./Header-0a8198e9.js";import{c as o}from"./index.esm-9ad57f03.js";import{S as t}from"./SecondaryButton-961c8d7d.js";import{f as m}from"./formatNumber-b542c689.js";import{d as n}from"./dayjs.min-a6718771.js";import"./ApplicationLogo-46f56534.js";import"./iconBase-cf74823f.js";import"./transition-3412008e.js";/* empty css                      */function w({organization:l,user:N,journal:x,fixedAsset:e,createdBy:c,assetAccount:r,depreciationAccumulationAccount:a,depreciationCostAccount:d}){return console.log(e),s.jsxs(s.Fragment,{children:[s.jsx(f,{title:"Detail Harta Tetap"}),s.jsx("div",{className:"sm:pt-0 pb-16 pt-12",children:s.jsx("div",{className:"bg-white py-5 px-2 sm:pt-0",children:s.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:s.jsxs("div",{className:"sm:w-2/3 sm:mx-auto px-3 sm:px-0 space-y-5",children:[s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Nama"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),e.name]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 w-full font-bold",children:"Kode"}),s.jsxs("div",{className:"sm:w-2/3 w-full flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),e.code]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Tanggal Pengadaan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),n(e.date).format("MMM DD, YYYY")]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Usia Pakai"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),e.lifetime," bulan"]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Nilai Perolehan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),"IDR. ",m(e.value)]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Penyusutan Perbulan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),"IDR. ",m(e.depreciation_value)]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Akumulasi Penyusutan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),"IDR. ",m(e.depreciation_accumulated)]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Nilai Buku"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),"IDR. ",m(e.value-e.depreciation_accumulated)]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Dibuat Oleh"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),c.name]})]}),s.jsx("div",{className:"flex flex-col sm:flex-row justify-between gap-1 uppercase pt-5 font-bold underline",children:"Buku Besar"}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Tanggal Jurnal"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),n(x.date).format("MMM DD, YYYY")]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Akun Aset"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),r.code," - ",r.name]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Akun Akumulasi Penyusutan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),a==null?void 0:a.code," - ",a==null?void 0:a.name]})]}),s.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[s.jsx("div",{className:"sm:w-1/3 font-bold",children:"Akun Beban Penyusutan"}),s.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[s.jsx("span",{className:"hidden sm:block",children:":"}),d==null?void 0:d.code," - ",d==null?void 0:d.name]})]}),s.jsx("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:s.jsx("div",{className:"sm:w-1/3 w-full font-bold",children:s.jsx(i,{href:route("data-master.fixed-asset",l.id),children:s.jsx(t,{className:"w-full sm:w-1/3",children:s.jsx("div",{className:"w-full",children:"Kembali"})})})})})]})})})})]})}w.layout=l=>s.jsx(h,{header:s.jsx(j,{children:"Detail Harta Tetap"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Detail Harta Tetap",backLink:s.jsx(i,{href:route("data-master.fixed-asset",l.props.organization.id),children:s.jsx(o,{})}),breadcrumbs:s.jsx("div",{className:"text-sm breadcrumbs",children:s.jsxs("ul",{children:[s.jsx("li",{className:"font-bold",children:s.jsx(i,{href:route("data-master",l.props.organization.id),children:"Data Master"})}),s.jsx("li",{className:"font-bold",children:s.jsx(i,{href:route("data-master.fixed-asset",l.props.organization.id),children:"Harta Tetap"})}),s.jsx("li",{children:"Detail Harta Tetap"})]})}),role:l.props.role});export{w as default};