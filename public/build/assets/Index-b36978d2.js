import{r as c,W as K,y as Q,j as e,Y as W,a as n}from"./app-f39f5256.js";import{D as $,A as q}from"./AuthenticatedLayout-e2125e6a.js";import{H as E}from"./Header-39ce6dc8.js";import{Q as j,k as J}from"./react-toastify.esm-1385f02c.js";/* empty css                      */import{I as p,a as y,b as X,c as Z}from"./index.esm-1a465fb0.js";import{A as ee}from"./AddButtonMobile-16c6f711.js";import{P as C}from"./PrimaryButton-e7612656.js";import{C as ae}from"./ContainerDesktop-a3bc2847.js";import{T as se,a as te,P as le,C as re}from"./ContentDesktop-7009db33.js";import{C as ne}from"./ContentMobile-196cbb25.js";import oe from"./StaffSalaryPaymentMobile-e69c1c0d.js";import ce from"./StaffSalaryPaymentDesktop-be174cc6.js";import{M as ie}from"./Modal-dec688cc.js";import{S as de}from"./SecondaryButton-12c497fc.js";import{I as m}from"./InputLabel-4d406470.js";import{T}from"./TextInput-f56f3093.js";import{a as me,u as ue}from"./index.module-3b0b3f9b.js";import{d as x}from"./dayjs.min-2681d619.js";import{N as he}from"./react-number-format.es-8467cc92.js";import{C as xe}from"./ClientSelectInput-47bc114d.js";import"./ApplicationLogo-dae171ed.js";import"./iconBase-62f121b1.js";import"./transition-4036d903.js";import"./formatNumber-b542c689.js";import"./formatMonth-e96174de.js";import"./index.esm-9383f473.js";import"./portal-ca4f363a.js";import"./close-provider-e51f726a.js";import"./combobox-761de6bb.js";const fe=()=>{let r=[];for(let l=7;l<13;l++)r=[...r,l];for(let l=1;l<7;l++)r=[...r,l];return r},je=()=>{const r=x().format("YYYY");let l=[];for(let t=0;t<15;t++)l=[...l,(r-t).toString()];return l};function pe({role:r,organization:l,payments:t,searchFilter:k,flash:f,cashAccounts:M}){const[d,w]=c.useState(k||""),[P,N]=c.useState(!1),{data:u,setData:i,reset:v,processing:Y,errors:s,patch:I,setError:F}=K({id:null,date:"",no_ref:"",bulan:"",tahun:"",value:0,cash_account_id:""});c.useState({month:"",study_year:""});const[b,B]=c.useState({id:null,date:"",no_ref:"",bulan:"",tahun:"",value:0}),[h,_]=c.useState({startDate:"",endDate:""}),[A,g]=c.useState({id:null,name:"",code:"",is_cash:!0}),[R]=me(h,500),O=ue(h);c.useEffect(()=>{f!=null&&f.success&&j.success(f.success,{position:j.POSITION.TOP_CENTER})},[]),c.useEffect(()=>{O!==void 0&&(x(h.startDate).format("MM")!==x(b.date).format("MM")?L():i("no_ref",b.no_ref))},[R]);const L=()=>{Q.reload({only:["newRef"],data:{date:x(h.startDate).format("YYYY-MM-DD")},onSuccess:a=>{i("no_ref",a.props.newRef)}})},z=a=>{_({startDate:a.date,endDate:a.date}),i({id:a.id,date:a.date,no_ref:a.no_ref,month:a.month,study_year:a.study_year.toString(),value:a.value,cash_account_id:a.journal.ledger.account.id}),B({id:a.id,date:a.date,no_ref:a.no_ref,month:a.month,study_year:a.study_year.toString(),value:a.value,cash_account_id:a.journal.ledger.account.id}),N(!0),g({id:a.journal.ledger.account.id,name:a.journal.ledger.account.name,code:a.journal.ledger.account.code,is_cash:!0})},G=a=>{_(a),i("date",x(a.startDate).format("YYYY-MM-DD"))},S=()=>{N(!1),g({id:null,name:"",code:"",is_cash:!0}),v(),F("cash_account_id","")},H=a=>{g({id:a.id,name:a.name,code:a.code,is_cash:!0}),i("cash_account_id",a.id)},U=a=>{a.preventDefault(),I(route("cashflow.staff-salary-payment.update",{organization:l.id,payment:u.id}),{onSuccess:({props:o})=>{const{flash:V}=o;j.success(V.success,{position:j.POSITION.TOP_CENTER});const D=new URL(window.location);D.searchParams.delete("date"),window.history.replaceState(null,"",D),N(!1),v()},onError:o=>{console.log(o)}})};return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Pembayaran Gaji Bulanan"}),e.jsx(J,{}),r!=="viewer"&&e.jsx(n,{href:route("cashflow.staff-salary-payment.create",l.id),children:e.jsx(ee,{label:"Tambah"})}),e.jsx(se,{zIndex:"z-50",search:d,setSearch:a=>w(a.target.value),pageBefore:t.links[0].url?e.jsx(n,{href:route("cashflow.student-monthly-payment",{organization:l.id,page:t.current_page-1,search:d}),preserveState:!0,only:["payments"],children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})}),pageAfter:t.links[t.links.length-1].url?e.jsx(n,{href:route("cashflow.student-monthly-payment",{organization:l.id,page:t.current_page+1,search:d}),only:["payments"],preserveState:!0,children:e.jsx(y,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(y,{})}),page:e.jsxs(e.Fragment,{children:[t.current_page,"/",t.last_page]}),data:t,hasFilter:!1,showFilter:()=>setShowModalFilter(!0)}),e.jsx(ne,{children:t.data.map(a=>e.jsx(oe,{payment:a,role:r},a.id))}),e.jsxs(ae,{children:[e.jsxs(te,{children:[e.jsx("div",{className:"my-auto w-7/12",children:r!=="viewer"&&e.jsx("div",{className:"space-x-2",children:e.jsx(n,{href:route("cashflow.staff-salary-payment.create",l.id),children:e.jsx(C,{className:"py-3",children:"Tambah Data"})})})}),e.jsx("div",{className:"my-auto w-4/12 flex gap-5 justify-end"}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(X,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari No Ref",className:"w-full border-none focus:outline-none focus:ring-0",value:d||"",onChange:a=>w(a.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(le,{data:t})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:t.links[0].url?e.jsx(n,{href:route("cashflow.student-monthly-payment",{organization:l.id,page:t.current_page-1,search:d}),preserveState:!0,only:["payments"],children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})})}),e.jsxs("div",{className:"my-auto",children:[t.current_page,"/",t.last_page]}),e.jsx("div",{className:"my-auto",children:t.links[t.links.length-1].url?e.jsx(n,{href:route("cashflow.student-monthly-payment",{organization:l.id,page:t.current_page+1,search:d}),only:["payments"],preserveState:!0,children:e.jsx(y,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(y,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(re,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Tanggal"}),e.jsx("th",{className:"bg-gray-200",children:"No Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Bulan"}),e.jsx("th",{className:"bg-gray-200",children:"Tahun"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Nilai"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:t.data.map((a,o)=>e.jsx(ce,{payment:a,className:`${o%2==0&&"bg-gray-100"} text-sm`,role:r,handelEdit:z},o))})]})})})})]}),e.jsx(ie,{show:P,onClose:S,children:e.jsxs("form",{onSubmit:U,className:"p-6",id:"filter",name:"filter",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Ubah Pembayaran"}),e.jsxs("div",{className:"mt-6 ",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"No. Ref",htmlFor:"no_ref",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(T,{id:"no_ref",name:"no_ref",className:"w-full",placeholder:"No Ref",value:u.no_ref||"",disabled:!0}),(s==null?void 0:s.no_ref)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.no_ref})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"Tanggal",htmlFor:"date",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx($,{value:h,onChange:G,inputClassName:(s==null?void 0:s.date)&&"border-red-500 rounded-lg",useRange:!1,asSingle:!0,placeholder:"Tanggal",id:"date",displayFormat:"MMMM DD, YYYY"}),(s==null?void 0:s.date)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.date})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"Tahun Ajaran",htmlFor:"study_year",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:u.study_year,onChange:a=>i("study_year",a.target.value),id:"study_year",children:je().map(a=>e.jsx("option",{children:a},a))}),(s==null?void 0:s.study_year)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.study_year})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"Bulan",htmlFor:"month",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:u.month,onChange:a=>i("month",a.target.value),id:"month",children:fe().map((a,o)=>e.jsx("option",{children:a},o))}),(s==null?void 0:s.month)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.month})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"Total",htmlFor:"total",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(he,{value:u.value,customInput:T,thousandSeparator:!0,className:"text-end w-full",prefix:"IDR. ",disabled:"disabled",id:"total"}),(s==null?void 0:s.value)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.value})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(m,{value:"Akun Kas",htmlFor:"cash_account",className:" mx-auto my-auto"})}),e.jsx("div",{className:"w-full sm:w-2/3",children:e.jsx(xe,{resources:M,selected:A,setSelected:a=>H(a),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!s.cash_account_id,id:"cash_account",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(n,{className:"font-bold text-blue-600",href:route("data-ledger.account",{organization:l.id}),children:"Buat Baru ?"})]})})})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(de,{onClick:S,children:"Batal"}),e.jsx(C,{className:"ms-3",disabled:Y,children:"Ubah"})]})]})})]})}pe.layout=r=>e.jsx(q,{header:e.jsx(E,{children:"Pembayaran Gaji Bulanan"}),children:r,user:r.props.auth.user,organization:r.props.organization,title:"Pembayaran Gaji Bulanan",backLink:e.jsx(n,{href:route("cashflow",r.props.organization.id),children:e.jsx(Z,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("cashflow",r.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{children:"Pembayaran Gaji Bulanan"})]})}),role:r.props.role});export{pe as default};