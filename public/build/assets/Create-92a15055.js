import{r as n,W as q,y as G,j as e,Y as X,a as o}from"./app-18d344c6.js";import{D as Z,A as ee}from"./AuthenticatedLayout-f72ab3d2.js";import{H as se}from"./Header-d3a5ebd0.js";import{t as y,u as ae,c as te}from"./index.esm-11facade.js";import{S as le}from"./SecondaryButton-8f498461.js";import{P as re}from"./PrimaryButton-74e4339d.js";import{F as ie}from"./FormInput-a434b94e.js";import{k as de,Q as P}from"./react-toastify.esm-14a132f8.js";import{I as d}from"./InputLabel-2c4eb927.js";import{T as D}from"./TextInput-d4d9cbeb.js";import{a as ne,u as ce}from"./index.module-26577e4e.js";import{N as oe}from"./react-number-format.es-fa3bf91f.js";import{C as m}from"./ClientSelectInput-b1029be2.js";import{d as T}from"./dayjs.min-3c5969fb.js";import{j as _}from"./disclosure-354982b4.js";import{z as ue}from"./transition-27a0ae6f.js";import"./ApplicationLogo-782d5a75.js";import"./iconBase-4b51c5f1.js";/* empty css                      */import"./combobox-36f8eaff.js";import"./portal-3e1f6179.js";import"./close-provider-98abf862.js";function me({organization:l,newRef:M,date:j,cashAccounts:S,projects:f,programs:v,departments:N}){const[i,C]=n.useState({id:null,name:"",code:"",is_cash:!0}),[Y,k]=n.useState({id:null,name:"",code:"",is_cash:!0}),[x,b]=n.useState({id:null,name:"",code:""}),[h,g]=n.useState({id:null,name:"",code:""}),[p,w]=n.useState({id:null,name:"",code:""}),[u,K]=n.useState({startDate:j,endDate:j}),{data:r,setData:t,post:E,reset:xe,errors:c,setError:he,processing:I}=q({date:j,no_ref:M,description:"Mutasi Kas",program_id:null,project_id:null,department_id:null,is_approved:!0,value:0,accountDebit:null,accountCredit:null}),[B]=ne(u,500),A=ce(u);n.useEffect(()=>{A!==void 0&&u.startDate&&z()},[B]);const R=s=>{s.preventDefault(),E(route("cashflow.cash-mutation.post",l.id),{onSuccess:a=>{H(a.props),P.success("Mutasi Kas Berhasil Ditambahkan",{position:P.POSITION.TOP_CENTER})},onError:a=>{},preserveScroll:!0})},H=({newRef:s,date:a})=>{t({date:a,no_ref:s,description:"Mutasi Kas",program_id:null,project_id:null,department_id:null,is_approved:!0,value:0,accountDebit:null,accountCredit:null}),K({startDate:a,endDate:a}),C({id:null,name:"",code:"",is_cash:!0}),k({id:null,name:"",code:"",is_cash:!0}),b({id:null,name:"",code:""}),g({id:null,name:"",code:""}),w({id:null,name:"",code:""})},z=()=>{G.reload({only:["newRef"],data:{date:T(u.startDate).format("YYYY-MM-DD")},onSuccess:s=>{t("no_ref",s.props.newRef)}})},F=(s,a)=>{a=="debit"?(C({id:s.id,name:s.name,code:s.code,is_cash:!0}),t("accountDebit",s.id)):(k({id:s.id,name:s.name,code:s.code,is_cash:!0}),t("accountCredit",s.id))},O=s=>{K(s),t("date",T(s.startDate).format("YYYY-MM-DD"))},V=s=>{g(s),t("program_id",s.id)},L=()=>{g({id:null,name:"",code:""}),t("program_id",null)},$=s=>{b(s),t("project_id",s.id)},J=()=>{b({id:null,name:"",code:""}),t("project_id",null)},Q=s=>{w(s),t("department_id",s.id)},U=()=>{w({id:null,name:"",code:""}),t("department_id",null)},W=s=>{const{floatValue:a}=s;t("value",a)};return e.jsxs(e.Fragment,{children:[e.jsx(X,{title:"Tambah Mutasi Kas"}),e.jsx(de,{}),e.jsx(ie,{onSubmit:R,children:e.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:e.jsxs("div",{className:"sm:mx-auto px-3 sm:px-5",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-3",children:[e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Tanggal"})}),e.jsx("div",{children:e.jsx(Z,{value:u,onChange:O,inputClassName:(c==null?void 0:c.date)&&"border-red-500 rounded-lg",useRange:!1,asSingle:!0,placeholder:"Tanggal",id:"date",displayFormat:"MMMM DD, YYYY"})})]}),e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"No. Ref",htmlFor:"no_ref"})}),e.jsx("div",{children:e.jsx(D,{id:"no_ref",className:`w-full ${c.no_ref&&"border-red-500"}`,value:r.no_ref,onChange:s=>t("no_ref",s.target.value)})})]}),e.jsxs("div",{className:"sm:w-1/2 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Deskripsi",htmlFor:"description"})}),e.jsx("div",{children:e.jsx(D,{id:"description",className:"w-full",value:r.description,onChange:s=>t("description",s.target.value)})})]})]}),(f.length>0||v.length>0||N.length>0)&&e.jsx("div",{className:"mt-3",children:e.jsx(_,{children:({open:s})=>e.jsxs(e.Fragment,{children:[e.jsx(ue,{enter:"transition duration-100 ease-out",enterFrom:"transform scale-95 opacity-0",enterTo:"transform scale-100 opacity-100",leave:"transition duration-75 ease-out",leaveFrom:"transform scale-100 opacity-100",leaveTo:"transform scale-95 opacity-0",children:e.jsx(_.Panel,{children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3",children:[v.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Program Kegiatan",htmlFor:"program"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(m,{resources:v,selected:h,setSelected:a=>V(a),maxHeight:"max-h-40",placeholder:"Cari Program Kegiatan",id:"program",isError:!1}),h.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",h.code]})]}),h.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:L,children:e.jsx(y,{})})})]})]}),f.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Proyek",htmlFor:"project"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(m,{resources:f,selected:x,setSelected:a=>$(a),maxHeight:"max-h-40",placeholder:"Cari Proyek",id:"project",isError:!1}),x.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",x.code]})]}),x.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:J,children:e.jsx(y,{})})})]})]}),N.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Departemen",htmlFor:"department"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(m,{resources:N,selected:p,setSelected:a=>Q(a),maxHeight:"max-h-40",placeholder:"Cari Departemen",id:"department",isError:!1}),p.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",p.code]})]}),p.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:U,children:e.jsx(y,{})})})]})]})]})})}),e.jsx(_.Button,{className:"flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75",children:e.jsxs("div",{className:"flex justify-center w-full gap-3",children:[e.jsxs("span",{children:["Tampilkan Lebih ",s?"Sedikit":"Banyak"]}),e.jsx(ae,{className:`${s?"":"rotate-180 transform"} h-5 w-5 text-slate-500`})]})})]})})}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-3 mt-7",children:[e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Dari Akun Kas",htmlFor:"credit_account"})}),e.jsxs("div",{children:[e.jsx(m,{resources:S,selected:Y,setSelected:s=>F(s,"credit"),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!c.accountCredit,id:"credit_account",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(o,{className:"font-bold text-blue-600",href:route("data-ledger.account",{organization:l.id}),children:"Buat Baru ?"})]})}),(i==null?void 0:i.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",i.code]})]})]}),e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Ke Akun Kas",htmlFor:"debit_account"})}),e.jsxs("div",{children:[e.jsx(m,{resources:S,selected:i,setSelected:s=>F(s,"debit"),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!c.accountCredit,id:"debit_account",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(o,{className:"font-bold text-blue-600",href:route("data-ledger.account",{organization:l.id}),children:"Buat Baru ?"})]})}),(i==null?void 0:i.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",i.code]})]})]}),e.jsxs("div",{className:"sm:w-1/2 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(d,{value:"Jumlah",htmlFor:"value"})}),e.jsx("div",{children:e.jsx(oe,{value:r.value,customInput:D,onValueChange:s=>W(s),thousandSeparator:!0,className:"text-end w-full",prefix:"IDR ",id:"value"})})]})]}),e.jsxs("div",{className:"md:flex font-bold gap-3",children:[e.jsx("div",{className:"sm:w-6/12 hidden sm:block"}),e.jsx("div",{className:"md:w-6/12 flex border-t py-3 gap-2 px-3",children:e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"checkbox",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"checkbox",value:!r.is_approved,onChange:()=>t("is_approved",!r.is_approved),checked:!r.is_approved}),e.jsx("span",{className:"label-text",children:"Simpan Ke Dalam Draft"})]})})})]}),e.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/12 my-auto text-center",children:e.jsx(o,{href:route("data-ledger.journal",l.id),children:e.jsx(le,{className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Batal"})})})}),r.value>0&&r.accountDebit&&r.accountCredit&&r.date&&r.no_ref&&e.jsx("div",{className:"w-full sm:w-1/12 text-center",children:e.jsx(re,{className:"w-full",disabled:I,children:e.jsx("div",{className:"text-center w-full",children:"Tambah"})})})]})]})})})]})}me.layout=l=>e.jsx(ee,{header:e.jsx(se,{children:"Tambah Mutasi Kas"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Tambah Mutasi Kas",backLink:e.jsx(o,{href:route("cashflow.cash-mutation",l.props.organization.id),children:e.jsx(te,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(o,{href:route("cashflow",l.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(o,{href:route("cashflow.cash-mutation",l.props.organization.id),children:"Mutasi Kas"})}),e.jsx("li",{children:"Tambah Mutasi Kas"})]})}),role:l.props.role});export{me as default};