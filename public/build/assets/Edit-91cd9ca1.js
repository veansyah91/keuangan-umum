import{r as n,W as q,y as G,j as e,Y as Z,a as u}from"./app-5a32895a.js";import{D as M,A as ee}from"./AuthenticatedLayout-aaefbd4c.js";import{H as se}from"./Header-e7fc7cfb.js";import{s as N,t as ae,c as te}from"./index.esm-bd4bd7ee.js";import{S as re}from"./SecondaryButton-1ef4fc88.js";import{P as le}from"./PrimaryButton-a204c97e.js";import{F as de}from"./FormInput-90e077d3.js";import{k as ie,Q as K}from"./react-toastify.esm-40084ac1.js";import{I as o}from"./InputLabel-5e88107a.js";import{T as w}from"./TextInput-2bae8aaa.js";import{o as oe,u as ne}from"./index.module-6d904af2.js";import{N as ce}from"./react-number-format.es-722cdfc4.js";import{C as x}from"./ClientSelectInput-a825b7df.js";import{d as f}from"./dayjs.min-75afdc15.js";import{$ as _}from"./disclosure-a575b881.js";import{X as me}from"./transition-7d2eb4c9.js";import"./ApplicationLogo-129360f1.js";import"./iconBase-6b1d4fe3.js";/* empty css                      */import"./combobox-433940bf.js";import"./portal-519ccc5e.js";import"./close-provider-4c5c72d3.js";function ue({organization:l,newRef:xe,date:pe,cashAccounts:y,projects:v,programs:g,departments:b,cashMutation:a}){const[i,P]=n.useState(a.accountDebit),[T,E]=n.useState(a.accountCredit),[p,D]=n.useState({id:a.journal.project_id,name:a.journal.project_id?a.journal.project.name:"",code:a.journal.project_id?a.journal.project.codes:""}),[j,S]=n.useState({id:a.journal.program_id,name:a.journal.program_id?a.journal.program.name:"",code:a.journal.program_id?a.journal.program.codes:""}),[h,C]=n.useState({id:a.journal.department_id,name:a.journal.department_id?a.journal.department.name:"",code:a.journal.department_id?a.journal.department.codes:""}),[c,I]=n.useState({startDate:a.date,endDate:a.date}),{data:d,setData:t,patch:Y,reset:je,errors:m,setError:he,processing:B}=q({date:a.date,no_ref:a.no_ref,description:a.description,program_id:a.program_id,project_id:a.project_id,department_id:a.department_id,is_approved:a.journal.is_approved>0,value:a.value,accountDebit:a.accountDebit.id,accountCredit:a.accountCredit.id}),[A]=oe(c,500),R=ne(c);n.useEffect(()=>{if(R!==void 0&&c.startDate){let s=f(c.startDate),r=`${s.month()+1}-${s.year()}`,F=f(a.date),W=`${F.month()+1}-${F.year()}`;r!==W?H():t("no_ref",a.no_ref)}},[A]);const $=s=>{s.preventDefault(),Y(route("cashflow.cash-mutation.update",{organization:l.id,cashMutation:a.id}),{onSuccess:r=>{K.success("Mutasi Kas Berhasil Diubah",{position:K.POSITION.TOP_CENTER})},onError:r=>{},preserveScroll:!0})},H=()=>{G.reload({only:["newRef"],data:{date:f(c.startDate).format("YYYY-MM-DD")},onSuccess:s=>{t("no_ref",s.props.newRef)}})},k=(s,r)=>{r=="debit"?(P({id:s.id,name:s.name,code:s.code,is_cash:!0}),t("accountDebit",s.id)):(E({id:s.id,name:s.name,code:s.code,is_cash:!0}),t("accountCredit",s.id))},O=s=>{I(s),t("date",f(s.startDate).format("YYYY-MM-DD"))},V=s=>{S(s),t("program_id",s.id)},z=()=>{S({id:null,name:"",code:""}),t("program_id",null)},U=s=>{D(s),t("project_id",s.id)},L=()=>{D({id:null,name:"",code:""}),t("project_id",null)},X=s=>{C(s),t("department_id",s.id)},J=()=>{C({id:null,name:"",code:""}),t("department_id",null)},Q=s=>{const{floatValue:r}=s;t("value",r)};return e.jsxs(e.Fragment,{children:[e.jsx(Z,{title:"Ubah Mutasi Kas"}),e.jsx(ie,{}),e.jsx(de,{onSubmit:$,children:e.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:e.jsxs("div",{className:"sm:mx-auto px-3 sm:px-5",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-3",children:[e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Tanggal"})}),e.jsx("div",{children:e.jsx(M,{value:c,onChange:O,inputClassName:(m==null?void 0:m.date)&&"border-red-500 rounded-lg",useRange:!1,asSingle:!0,placeholder:"Tanggal",id:"date",displayFormat:"MMMM DD, YYYY"})})]}),e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"No. Ref",htmlFor:"no_ref"})}),e.jsx("div",{children:e.jsx(w,{id:"no_ref",className:`w-full ${m.no_ref&&"border-red-500"}`,value:d.no_ref,onChange:s=>t("no_ref",s.target.value)})})]}),e.jsxs("div",{className:"sm:w-1/2 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Deskripsi",htmlFor:"description"})}),e.jsx("div",{children:e.jsx(w,{id:"description",className:"w-full",value:d.description,onChange:s=>t("description",s.target.value)})})]})]}),(v.length>0||g.length>0||b.length>0)&&e.jsx("div",{className:"mt-3",children:e.jsx(_,{children:({open:s})=>e.jsxs(e.Fragment,{children:[e.jsx(me,{enter:"transition duration-100 ease-out",enterFrom:"transform scale-95 opacity-0",enterTo:"transform scale-100 opacity-100",leave:"transition duration-75 ease-out",leaveFrom:"transform scale-100 opacity-100",leaveTo:"transform scale-95 opacity-0",children:e.jsx(_.Panel,{children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-start gap-3 sm:py-5 mb-3",children:[g.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Program Kegiatan",htmlFor:"program"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(x,{resources:g,selected:j,setSelected:r=>V(r),maxHeight:"max-h-40",placeholder:"Cari Program Kegiatan",id:"program",isError:!1}),j.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",j.code]})]}),j.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:z,children:e.jsx(N,{})})})]})]}),v.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Proyek",htmlFor:"project"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(x,{resources:v,selected:p,setSelected:r=>U(r),maxHeight:"max-h-40",placeholder:"Cari Proyek",id:"project",isError:!1}),p.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",p.code]})]}),p.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:L,children:e.jsx(N,{})})})]})]}),b.length>0&&e.jsxs("div",{className:"sm:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Departemen",htmlFor:"department"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(x,{resources:b,selected:h,setSelected:r=>X(r),maxHeight:"max-h-40",placeholder:"Cari Departemen",id:"department",isError:!1}),h.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",h.code]})]}),h.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:J,children:e.jsx(N,{})})})]})]})]})})}),e.jsx(_.Button,{className:"flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75",children:e.jsxs("div",{className:"flex justify-center w-full gap-3",children:[e.jsxs("span",{children:["Tampilkan Lebih ",s?"Sedikit":"Banyak"]}),e.jsx(ae,{className:`${s?"":"rotate-180 transform"} h-5 w-5 text-slate-500`})]})})]})})}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-3 mt-7",children:[e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Dari Akun Kas",htmlFor:"credit_account"})}),e.jsxs("div",{children:[e.jsx(x,{resources:y,selected:T,setSelected:s=>k(s,"credit"),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!m.accountCredit,id:"credit_account",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(u,{className:"font-bold text-blue-600",href:route("data-ledger.account",{organization:l.id}),children:"Buat Baru ?"})]})}),(i==null?void 0:i.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",i.code]})]})]}),e.jsxs("div",{className:"sm:w-1/4 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Ke Akun Kas",htmlFor:"debit_account"})}),e.jsxs("div",{children:[e.jsx(x,{resources:y,selected:i,setSelected:s=>k(s,"debit"),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!m.accountCredit,id:"debit_account",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(u,{className:"font-bold text-blue-600",href:route("data-ledger.account",{organization:l.id}),children:"Buat Baru ?"})]})}),(i==null?void 0:i.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",i.code]})]})]}),e.jsxs("div",{className:"sm:w-1/2 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(o,{value:"Jumlah",htmlFor:"value"})}),e.jsx("div",{children:e.jsx(ce,{value:d.value,customInput:w,onValueChange:s=>Q(s),thousandSeparator:!0,className:"text-end w-full",prefix:"IDR ",id:"value"})})]})]}),e.jsxs("div",{className:"md:flex font-bold gap-3",children:[e.jsx("div",{className:"sm:w-6/12 hidden sm:block"}),e.jsx("div",{className:"md:w-6/12 flex border-t py-3 gap-2 px-3",children:e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"checkbox",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"checkbox",value:!d.is_approved,onChange:()=>t("is_approved",!d.is_approved),checked:!d.is_approved}),e.jsx("span",{className:"label-text",children:"Simpan Ke Dalam Draft"})]})})})]}),e.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/12 my-auto text-center",children:e.jsx(u,{href:route("cashflow.cash-mutation",l.id),children:e.jsx(re,{className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Batal"})})})}),d.value>0&&d.accountDebit&&d.accountCredit&&d.date&&d.no_ref&&e.jsx("div",{className:"w-full sm:w-1/12 text-center",children:e.jsx(le,{className:"w-full",disabled:B,children:e.jsx("div",{className:"text-center w-full",children:"Tambah"})})})]})]})})})]})}ue.layout=l=>e.jsx(ee,{header:e.jsx(se,{children:"Ubah Mutasi Kas"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Ubah Mutasi Kas",backLink:e.jsx(u,{href:route("cashflow.cash-mutation",l.props.organization.id),children:e.jsx(te,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(u,{href:route("cashflow",l.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(u,{href:route("cashflow.cash-mutation",l.props.organization.id),children:"Mutasi Kas"})}),e.jsx("li",{children:"Ubah Mutasi Kas"})]})}),role:l.props.role});export{ue as default};