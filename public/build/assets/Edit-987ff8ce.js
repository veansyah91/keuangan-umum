import{W as y,j as a,Y as I,a as n}from"./app-25f64d54.js";import{A as _}from"./AuthenticatedLayout-818dbd4f.js";import{H as z}from"./Header-e7d93afa.js";import{k as B}from"./react-toastify.esm-3f4a13c0.js";/* empty css                      */import{c as S}from"./index.esm-84724444.js";import{I as f}from"./InputLabel-30cff31d.js";import{f as D}from"./formatNumber-b542c689.js";import{P}from"./PrimaryButton-0083aeee.js";import{S as q}from"./SecondaryButton-d0536d1d.js";import{T as m}from"./TextInput-d57c7828.js";import{N as x}from"./react-number-format.es-ec1eabc5.js";import{F}from"./FormInput-a2179647.js";import"./ApplicationLogo-75f1eeb0.js";import"./iconBase-87fce0ec.js";import"./transition-6cf3d9d9.js";import"./dayjs.min-e4fd89be.js";const V=(l,h)=>l.map(r=>{let i=h.find(d=>d.category_id===r.id);return{id:r.id,name:r.name,value:i.qty>0?i.value/i.qty:r.value,unit:r.unit,is_cut:!!r.is_cut,has_hour:!!r.has_hour,qty:i.qty,total:i.value}});function G({organization:l,role:h,categories:r,payment:i,contact:d}){const{data:o,setData:p,processing:j,patch:w}=y({value:i.details.reduce((e,t)=>e+t.value,0),details:V(r,i.details)}),N=(e,t)=>{let s={...o};s.details[t]={...s.details[t],qty:e.floatValue||0,total:(e.floatValue||0)*s.details[t].value},s.value=s.details.reduce((u,c)=>u+c.total,0),p(s)},v=(e,t)=>{let s={...o};s.details[t]={...s.details[t],value:e.floatValue||0,total:(e.floatValue||0)*s.details[t].qty},s.value=s.details.reduce((u,c)=>u+c.total,0),p(s)},b=e=>{e.preventDefault(),w(route("cashflow.staff-salary-payment.staff.update",{organization:l.id,payment:i.id,staff:d.id}),{onError:t=>{console.log(t)}})};return a.jsxs(a.Fragment,{children:[a.jsx(I,{title:`Ubah Pembayaran Gaji Staf ${d.name}`}),a.jsx(B,{}),a.jsx(F,{onSubmit:b,children:a.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:a.jsx("div",{className:"sm:mx-auto px-3 sm:px-5",children:a.jsxs("section",{className:"w-full md:w-10/12 mx-auto mt-5",children:[a.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[a.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:a.jsx(f,{value:"Nama Staff",htmlFor:"name",className:" mx-auto my-auto"})}),a.jsx("div",{className:"w-full sm:w-2/3",children:a.jsx(m,{id:"name",name:"name",className:"w-full",placeholder:"Nama",value:d.name||"",disabled:!0})})]}),a.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[a.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:a.jsx(f,{value:"Jabatan",htmlFor:"position",className:" mx-auto my-auto"})}),a.jsx("div",{className:"w-full sm:w-2/3",children:a.jsx(m,{id:"position",name:"position",className:"w-full",placeholder:"Jabatan",value:d.staff.position||"",disabled:!0})})]}),a.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[a.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:a.jsx(f,{value:"No. Id",htmlFor:"id",className:" mx-auto my-auto"})}),a.jsx("div",{className:"w-full sm:w-2/3",children:a.jsx(m,{id:"id",name:"id",className:"w-full",placeholder:"No.Id",value:d.staff.no_ref||"",disabled:!0})})]}),a.jsx("div",{className:"mt-5 overflow-x-auto",children:a.jsxs("div",{className:"w-[750px] md:w-full",children:[a.jsxs("div",{className:"flex font-bold gap-3 border-b py-3",children:[a.jsx("div",{className:"w-4/12",children:"Kategori"}),a.jsx("div",{className:"w-2/12 text-end",children:"Jam/Hari"}),a.jsx("div",{className:"w-3/12 text-end",children:"Nilai"}),a.jsx("div",{className:"w-3/12 text-end",children:"Total"})]}),o.details.map((e,t)=>a.jsxs("div",{className:"flex gap-3 border-b py-3",children:[a.jsx("div",{className:`w-5/12 my-auto${e.is_cut?" text-red-500":""}`,children:e.name}),a.jsx("div",{className:"w-1/12 text-end",children:e.has_hour&&a.jsxs("div",{className:"gap-1",children:[a.jsx(x,{value:e.qty,customInput:m,onValueChange:s=>N(s,t),thousandSeparator:!0,className:`text-end w-full${e.is_cut?" text-red-500":""}`,prefix:""}),a.jsx("div",{className:"my-auto hidden md:block text-xs",children:e.unit})]})}),a.jsx("div",{className:"w-3/12 text-end",children:a.jsx(x,{value:e.value,customInput:m,onValueChange:s=>v(s,t),thousandSeparator:!0,className:`text-end w-full${e.is_cut?" text-red-500":""}`,prefix:"IDR. "})}),a.jsx("div",{className:"w-3/12 text-end",children:a.jsx(x,{value:e.total,customInput:m,thousandSeparator:!0,className:`text-end w-full${e.is_cut?" text-red-500":""}`,prefix:"IDR. ",disabled:"disabled"})})]},t)),a.jsxs("div",{className:"flex font-bold gap-3 border-b py-3",children:[a.jsx("div",{className:"w-5/12",children:"Total"}),a.jsxs("div",{className:"w-7/12 text-end",children:["IDR. ",D(o.value)]})]})]})}),a.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[a.jsx("div",{className:"w-full sm:w-1/12 my-auto text-center",children:a.jsx(n,{href:route("cashflow.staff-salary-payment.show",{organization:l.id,id:i.id}),children:a.jsx(q,{className:"w-full",children:a.jsx("div",{className:"text-center w-full",children:"Batal"})})})}),a.jsx("div",{className:"w-full sm:w-1/12 text-center",children:a.jsx(P,{className:"w-full",disabled:j,children:a.jsx("div",{className:"text-center w-full",children:"Ubah"})})})]})]})})})})]})}G.layout=l=>a.jsx(_,{header:a.jsx(z,{children:"Ubah Pembayaran Gaji Bulanan"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Ubah Pembayaran Gaji Bulanan",backLink:a.jsx(n,{href:route("cashflow.staff-salary-payment.show",{organization:l.props.organization.id,id:l.props.payment.id}),children:a.jsx(S,{})}),breadcrumbs:a.jsx("div",{className:"text-sm breadcrumbs",children:a.jsxs("ul",{children:[a.jsx("li",{className:"font-bold",children:a.jsx(n,{href:route("cashflow.staff-salary-payment",l.props.organization.id),children:"Arus Kas"})}),a.jsx("li",{className:"font-bold",children:a.jsx(n,{href:route("cashflow.staff-salary-payment",l.props.organization.id),children:"Pembayaran Gaji Bulanan"})}),a.jsx("li",{className:"font-bold",children:a.jsx(n,{href:route("cashflow.staff-salary-payment.show",{organization:l.props.organization.id,id:l.props.payment.id}),children:"Rincian Pembayaran Gaji Bulanan"})}),a.jsx("li",{children:"Ubah Pembayaran Gaji Bulanan"})]})}),role:l.props.role});export{G as default};