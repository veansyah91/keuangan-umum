import{r as f,W as q,j as e,Y as G,a as j,y as J}from"./app-60093d8b.js";import{D as X,A as Z}from"./AuthenticatedLayout-f4603aa5.js";import{H as ee}from"./Header-fccd1917.js";import{k as ae,Q as w}from"./react-toastify.esm-43511348.js";/* empty css                      */import{c as te}from"./index.esm-53cbca2f.js";import{F as se}from"./FormInput-ea4efe62.js";import{I as u}from"./InputLabel-fb90ae77.js";import{T as y}from"./TextInput-e2aade7c.js";import{S as le}from"./SecondaryButton-a2ff8619.js";import{P as ne}from"./PrimaryButton-bffcd700.js";import{d as g}from"./dayjs.min-af66fe14.js";import{s as D}from"./studyYear-a53b5211.js";import{C as me}from"./StudentSelectInput-e4a5feb5.js";import{N as re}from"./react-number-format.es-01a5d405.js";import{f as oe}from"./formatNumber-b542c689.js";import{C as de}from"./ClientSelectInput-3a8311ae.js";import"./ApplicationLogo-07518b23.js";import"./iconBase-bb6eae91.js";import"./transition-69a0c110.js";import"./index.module-dbb0b5e9.js";import"./combobox-b8c83591.js";import"./keyboard-8f7a194a.js";const ie=()=>{let n=[];for(let c=7;c<13;c++)n=[...n,c];for(let c=1;c<7;c++)n=[...n,c];return n},N=()=>g().format("MM");function ce({organization:n,newRef:c,contacts:F,date:v,categories:I,studyYears:B,cashAccounts:$,historyCategories:_}){const[A,S]=f.useState(0),{data:l,setData:x,processing:k,post:M,errors:t,setError:E,reset:ue}=q({contact_id:null,date:v,level:"",student_id:"",no_ref:c,value:A,type:"now",month:parseInt(N()),study_year:D(),description:"",details:[],cash_account_id:null}),[h,C]=f.useState({id:null,name:"",phone:""}),[p,T]=f.useState({id:null,name:"",code:"",is_cash:!0}),[K,O]=f.useState({startDate:v,endDate:v});f.useEffect(()=>{Y()},[]);const b=(a,s=null)=>{J.reload({only:["historyCategories","historyPayment"],data:{selectedContact:s??h.id,month:a.month,studyYear:a.study_year},onSuccess:({props:r})=>{const{historyCategories:m,historyPayment:o}=r;let d=[];I.filter((i,xe)=>{let P=m.filter(W=>W.student_payment_category_id==i.id);d=[...d,{id:i.id,name:i.name,value:P.length>0?P[0].value:i.value}]}),a={...a,no_ref:o?o.no_ref:c,details:d},x(a)}})},Y=()=>{let a=l,s=I.map(m=>({id:m.id,name:m.name,value:m.value})),r=s.reduce((m,o)=>m+o.value,0);S(r),a={...a,value:r,details:s,contact_id:null,date:v,level:"",student_id:"",no_ref:c,type:"now",month:parseInt(N()),study_year:D(),description:"",account_id:null},x(a)},R=a=>{a.preventDefault(),M(route("cashflow.student-monthly-payment.post",n.id),{onSuccess:({props:s})=>{const{flash:r}=s;w.success(r.success,{position:w.POSITION.TOP_CENTER}),T({id:null,name:"",code:"",is_cash:!0}),C({id:null,name:"",phone:""}),Y()},onError:s=>{w.error(s.error,{position:w.POSITION.TOP_CENTER})},preserveScroll:!1})},U=a=>{C({id:a.id,name:a.name,phone:a.phone});let s=l;s={...s,contact_id:a.id,description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${a.name.toUpperCase()} Bulan ${l.month}, Tahun Ajaran ${l.study_year}`,student_id:a.student.no_ref,level:a.levels[a.levels.length-1].level},b(s,a.id)},H=a=>{O(a),x("date",a.startDate)},L=(a,s)=>{const{value:r}=a;let m=[...l.details];m[s]={...m[s],value:parseInt(r)};let o=m.reduce((d,i)=>d+i.value,0);S(o),x({...l,details:m,value:o})},z=a=>{var i;let s="now",r=parseInt(g().format("YYYY"))*100+parseInt(N()),m=a.target.value.split("/"),o=parseInt(l.month)<7?parseInt(m[1])*100+parseInt(l.month):m[0]*100+parseInt(l.month);o>r?s="prepaid":o<r&&(s="receivable");let d=l;d={...d,study_year:a.target.value,description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${(i=h==null?void 0:h.name)==null?void 0:i.toUpperCase()} Bulan ${l.month}, Tahun Ajaran ${a.target.value}`,type:s},b(d)},V=a=>{var i;let s="now",r=parseInt(g().format("YYYY"))*100+parseInt(N()),m=l.study_year.split("/"),o=parseInt(a.target.value)<7?parseInt(m[1])*100+parseInt(a.target.value):m[0]*100+parseInt(a.target.value);o>r?s="prepaid":o<r&&(s="receivable");let d=l;d={...d,month:parseInt(a.target.value),description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${(i=h==null?void 0:h.name)==null?void 0:i.toUpperCase()} Bulan ${parseInt(a.target.value)}, Tahun Ajaran ${l.study_year}`,type:s},b(d)},Q=a=>{T({id:a.id,name:a.name,code:a.code,is_cash:!0}),x("cash_account_id",a.id),E("cash_account_id","")};return e.jsxs(e.Fragment,{children:[e.jsx(G,{title:"Piutang Iuran Bulanan Siswa"}),e.jsx(ae,{}),e.jsx(se,{onSubmit:R,children:e.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:e.jsxs("div",{className:"sm:w-1/2 sm:mx-auto px-3 sm:px-0",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"No. Ref",htmlFor:"no_ref",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(y,{id:"no_ref",name:"no_ref",className:`w-full ${(t==null?void 0:t.no_ref)&&"border-red-500"}`,placeholder:"No. Ref",value:l.no_ref||"",onChange:a=>x("no_ref",a.target.value.toUpperCase()),disabled:!0}),(t==null?void 0:t.no_ref)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.no_ref})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Tanggal",htmlFor:"date",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("div",{children:e.jsx(X,{value:K,onChange:H,inputClassName:(t==null?void 0:t.date)&&"border-red-500 rounded-lg",useRange:!1,asSingle:!0,placeholder:"Tanggal",inputId:"date",displayFormat:"MMMM DD, YYYY"})}),(t==null?void 0:t.date)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.date})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Nama Siswa",htmlFor:"name",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(me,{resources:F,selected:h,setSelected:a=>U(a),maxHeight:"max-h-40",placeholder:"Cari Kontak",isError:!!t.contact_id,id:"name",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(j,{className:"font-bold text-blue-600",href:route("data-master.students.create",{organization:n.id}),children:"Buat Baru ?"})]})}),(t==null?void 0:t.name)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.name})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"No. Siswa",htmlFor:"student_id",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(y,{id:"student_id",name:"student_id",className:`w-full ${(t==null?void 0:t.student_id)&&"border-red-500"}`,placeholder:"No. Siswa",value:l.student_id||"",onChange:a=>x("student_id",a.target.value.toUpperCase()),disabled:!0}),(t==null?void 0:t.student_id)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.student_id})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Kelas",htmlFor:"level",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(y,{id:"level",name:"level",className:`w-full ${(t==null?void 0:t.level)&&"border-red-500"}`,placeholder:"Kelas",value:l.level||"",onChange:a=>x("level",a.target.value.toUpperCase()),disabled:!0}),(t==null?void 0:t.level)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.level})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Tahun Ajaran",htmlFor:"study_year",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:l.study_year,onChange:z,id:"study_year",children:B.map((a,s)=>e.jsx("option",{children:a.year},s))}),(t==null?void 0:t.study_year)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.study_year})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Bulan",htmlFor:"month",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:l.month,onChange:V,id:"month",children:ie().map((a,s)=>e.jsx("option",{children:a},s))}),(t==null?void 0:t.month)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.month})]})]}),e.jsx("div",{className:"text-center mt-5 font-bold",children:"Rincian Pembayaran"}),l.details.map((a,s)=>e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:a.name,htmlFor:`category-${s}`,className:" mx-auto my-auto"})}),e.jsx("div",{className:"w-full sm:w-2/3",children:e.jsx(re,{value:a.value,customInput:y,onValueChange:r=>L(r,s),thousandSeparator:!0,className:"text-end w-full border",prefix:"IDR ",id:`category-${s}`,disabled:(_==null?void 0:_.length)>0})})]},s)),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 pt-5 sm:mt-2 font-bold text-xl",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:"TOTAL"}),e.jsxs("div",{className:"w-full sm:w-2/3 text-end",children:["Rp. ",oe(l.value)]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(u,{value:"Akun Kas",htmlFor:"account",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(de,{resources:$,selected:p,setSelected:a=>Q(a),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!t.cash_account_id,id:"account",contactFilter:""}),(p==null?void 0:p.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",p.code]}),(t==null?void 0:t.cash_account_id)&&e.jsx("span",{className:"text-red-500 text-xs",children:t.cash_account_id})]})]}),e.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/6 my-auto text-center",children:e.jsx(j,{href:route("cashflow.student-monthly-payment",n.id),children:e.jsx(le,{className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Kembali"})})})}),e.jsx("div",{className:"w-full sm:w-1/6 text-center",children:e.jsx(ne,{className:"w-full",disabled:k,children:e.jsx("div",{className:"text-center w-full",children:"Simpan"})})})]})]})})})]})}ce.layout=n=>e.jsx(Z,{header:e.jsx(ee,{children:"Tambah Pembayaran"}),children:n,user:n.props.auth.user,organization:n.props.organization,title:"Tambah Pembayaran",backLink:e.jsx(j,{href:route("cashflow.student-monthly-payment",n.props.organization.id),children:e.jsx(te,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(j,{href:route("cashflow",n.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(j,{href:route("cashflow.student-monthly-payment",n.props.organization.id),children:"Pembayaran Iuran Bulanan Siswa"})}),e.jsx("li",{children:"Tambah Pembayaran"})]})}),role:n.props.role});export{ce as default};