import{W as K,r as n,y as z,j as e,Y as L,a as f}from"./app-2c82fe5b.js";import{D as U,A as $}from"./AuthenticatedLayout-e8572a4e.js";import{H as Q}from"./Header-e49f525e.js";import{k as W,Q as u}from"./react-toastify.esm-0437b8bc.js";/* empty css                      */import{c as q}from"./index.esm-45acd85f.js";import{F as G}from"./FormInput-e8882267.js";import{I as d}from"./InputLabel-979850bf.js";import{T as m}from"./TextInput-9f3b22a1.js";import{S as J}from"./SecondaryButton-70b62587.js";import{P as X}from"./PrimaryButton-63193b6a.js";import{N as j}from"./react-number-format.es-85e79c4d.js";import{C as _}from"./ClientSelectInput-e81d2650.js";import{o as Z,u as ee}from"./index.module-1a6f157a.js";import{d as b}from"./dayjs.min-40eeaf43.js";import"./ApplicationLogo-5e29cd5b.js";import"./iconBase-e7dc96e4.js";import"./transition-a44a8b97.js";import"./combobox-35d4467a.js";import"./portal-7194087c.js";const x=(l,h,p)=>h>0?Math.ceil((l-p)/h):0;function ae({organization:l,role:h,newRef:p,date:r,accounts:D,fixedAssetCategories:S}){var y,g;const{data:t,setData:c,processing:C,post:T,errors:a,setError:se,reset:F}=K({lifetime:0,name:"",code:p,residue:0,value:0,date:r,fixed_asset_category:null,credit_account:{id:null,is_cash:!1,code:""},depreciation_value:0,depreciation_accumulated:0}),[o,v]=n.useState({startDate:r,endDate:r}),[I]=Z(o,500),Y=ee(o),[H,w]=n.useState({id:null,name:"",lifetime:0}),[A,N]=n.useState({id:null,name:"",code:"",is_cash:!0});n.useEffect(()=>{Y!==void 0&&o.startDate&&E()},[I]);const E=()=>{z.reload({only:["newRef"],data:{date:b(o.startDate).format("YYYY-MM-DD")},onSuccess:s=>{c("code",s.props.newRef)}})},R=s=>{v(s),c("date",b(s.startDate).format("YYYY-MM-DD"))},V=s=>{const{floatValue:i}=s;c({...t,value:i,depreciation_value:x(i,t.lifetime,t.residue)})},M=s=>{const{floatValue:i}=s;c({...t,residue:i,depreciation_value:x(t.value,t.lifetime,i)})},P=s=>{const{floatValue:i}=s;c({...t,lifetime:i,depreciation_value:x(t.value,i,t.residue)})},k=s=>{w(s),c({...t,lifetime:s.lifetime,fixed_asset_category:s.id,depreciation_value:x(t.value,s.lifetime,t.residue)})},O=s=>{N(s),c({...t,credit_account:{id:s.id,is_cash:s.is_cash,code:s.code}})},B=s=>{s.preventDefault(),T(route("data-master.fixed-asset.post",l.id),{onSuccess:()=>{u.success("Harta Tetap Berhasil Ditambahkan",{position:u.POSITION.TOP_CENTER}),F(),w({id:null,name:"",lifetime:0}),N({id:null,name:"",code:"",is_cash:!0}),v({startDate:r,endDate:r})},onError:i=>{u.error(i.date,{position:u.POSITION.TOP_CENTER})},preserveScroll:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(L,{title:"Tambah Harta Tetap"}),e.jsx(W,{}),e.jsx(G,{onSubmit:B,children:e.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:e.jsxs("div",{className:"sm:w-1/2 sm:mx-auto px-3 sm:px-0 space-y-3",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Tanggal Perolehan",htmlFor:"name",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(U,{value:o,onChange:R,useRange:!1,asSingle:!0,placeholder:"Tanggal",id:"date",displayFormat:"MMMM DD, YYYY"}),(a==null?void 0:a.date)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.date})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Kode",htmlFor:"name",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(m,{id:"code",name:"code",className:`w-full ${(a==null?void 0:a.code)&&"border-red-500"}`,placeholder:"Kode",value:t.code,onChange:s=>c("code",s.target.value.toUpperCase())}),(a==null?void 0:a.code)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.code})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Kategori Harta Tetap",htmlFor:"category",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(_,{resources:S,selected:H,setSelected:s=>k(s),maxHeight:"max-h-40",placeholder:"Cari Kategori Harta Tetap",id:"category",isError:!!(a!=null&&a.fixed_asset_category),isFocused:!0}),(a==null?void 0:a.fixed_asset_category)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.fixed_asset_category})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Usia Pakai (Bulan)",htmlFor:"lifetime",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(j,{value:t.lifetime,customInput:m,onValueChange:s=>P(s),thousandSeparator:!0,className:"text-end w-full border",id:"lifetime"}),(a==null?void 0:a.lifetime)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.lifetime})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Nama",htmlFor:"name",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(m,{id:"name",name:"name",className:`w-full ${(a==null?void 0:a.name)&&"border-red-500"}`,placeholder:"Nama",value:t.name,onChange:s=>c("name",s.target.value.toUpperCase())}),(a==null?void 0:a.name)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.name})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Nilai Perolehan",htmlFor:"value",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(j,{value:t.value,customInput:m,onValueChange:s=>V(s),thousandSeparator:!0,className:"text-end w-full border",prefix:"IDR ",id:"value"}),(a==null?void 0:a.value)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.value})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Residu",htmlFor:"residue",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(j,{value:t.residue,customInput:m,onValueChange:s=>M(s),thousandSeparator:!0,className:"text-end w-full border",prefix:"IDR ",id:"residue"}),(a==null?void 0:a.residue)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.residue})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(d,{value:"Akun Kredit",htmlFor:"credit_account_id",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(_,{resources:D,selected:A,setSelected:s=>O(s),maxHeight:"max-h-40",placeholder:"Cari Akun",id:"credit_account_id",isError:!!((y=a==null?void 0:a.credit_account)!=null&&y.id)}),((g=a==null?void 0:a.credit_account)==null?void 0:g.id)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.credit_account.id})]})]}),e.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/6 my-auto text-center",children:e.jsx(f,{href:route("data-master.fixed-asset",l.id),children:e.jsx(J,{className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Batal"})})})}),e.jsx("div",{className:"w-full sm:w-1/6 text-center",children:e.jsx(X,{className:"w-full",disabled:C,children:e.jsx("div",{className:"text-center w-full",children:"Simpan"})})})]})]})})})]})}ae.layout=l=>e.jsx($,{header:e.jsx(Q,{children:"Tambah Harta Tetap"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Tambah Harta Tetap",backLink:e.jsx(f,{href:route("data-master.fixed-asset",l.props.organization.id),children:e.jsx(q,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(f,{href:route("data-master",l.props.organization.id),children:"Data Master"})}),e.jsx("li",{className:"font-bold",children:e.jsx(f,{href:route("data-master.fixed-asset",l.props.organization.id),children:"Harta Tetap"})}),e.jsx("li",{children:"Tambah Harta Tetap"})]})}),role:l.props.role});export{ae as default};