import{r as f,W as ee,y as F,j as e,Y as ae,a as w}from"./app-5a32895a.js";import{D as se,A as te}from"./AuthenticatedLayout-aaefbd4c.js";import{H as le}from"./Header-e7fc7cfb.js";import{o as ne,u as re}from"./index.module-6d904af2.js";import{k as me,Q as N}from"./react-toastify.esm-40084ac1.js";/* empty css                      */import{c as de}from"./index.esm-bd4bd7ee.js";import{F as oe}from"./FormInput-90e077d3.js";import{I as h}from"./InputLabel-5e88107a.js";import{T as _}from"./TextInput-2bae8aaa.js";import{S as ie}from"./SecondaryButton-1ef4fc88.js";import{P as ce}from"./PrimaryButton-a204c97e.js";import{d as v}from"./dayjs.min-75afdc15.js";import{s as M}from"./studyYear-4b2c7591.js";import{C as ue}from"./StudentSelectInput-2e0ffb6f.js";import{N as xe}from"./react-number-format.es-722cdfc4.js";import{f as he}from"./formatNumber-b542c689.js";import{C as fe}from"./ClientSelectInput-a825b7df.js";import"./ApplicationLogo-129360f1.js";import"./iconBase-6b1d4fe3.js";import"./transition-7d2eb4c9.js";import"./combobox-433940bf.js";import"./portal-519ccc5e.js";const pe=()=>{let n=[];for(let c=7;c<13;c++)n=[...n,c];for(let c=1;c<7;c++)n=[...n,c];return n},b=()=>v().format("MM");function je({organization:n,newRef:c,contacts:B,date:y,categories:S,studyYears:A,cashAccounts:$,historyCategories:g,whatsappPlugin:C}){const[E,Y]=f.useState(0),{data:l,setData:u,processing:K,post:R,errors:s,setError:O,reset:ve}=ee({contact_id:null,date:y,level:"",student_id:"",no_ref:c,value:E,type:"now",month:parseInt(b()),study_year:M(),description:"",whatsappPlugin:!0,details:[],cash_account_id:null}),[x,D]=f.useState({id:null,name:"",phone:""}),[p,T]=f.useState({id:null,name:"",code:"",is_cash:!0}),[j,U]=f.useState({startDate:y,endDate:y}),[V]=ne(j,500),H=re(j);f.useEffect(()=>{P()},[]),f.useEffect(()=>{H!==void 0&&j.startDate&&X()},[V]);const I=(a,t=null)=>{F.reload({only:["historyCategories","historyPayment"],data:{selectedContact:t??x.id,month:a.month,studyYear:a.study_year},onSuccess:({props:m})=>{const{historyCategories:r,historyPayment:d}=m;let o=[];S.filter((i,we)=>{let k=r.filter(Z=>Z.student_payment_category_id==i.id);o=[...o,{id:i.id,name:i.name,value:k.length>0?k[0].value:i.value}]}),a={...a,no_ref:d?d.no_ref:c,details:o},u(a)}})},P=()=>{let a=l,t=S.map(r=>({id:r.id,name:r.name,value:r.value})),m=t.reduce((r,d)=>r+d.value,0);Y(m),a={...a,value:m,details:t,contact_id:null,date:y,level:"",student_id:"",no_ref:c,type:"now",month:parseInt(b()),study_year:M(),description:"",account_id:null,send_wa:!0},u(a)},L=a=>{a.preventDefault(),R(route("cashflow.student-monthly-payment.post",n.id),{onSuccess:({props:t})=>{const{flash:m}=t;N.success(m.success,{position:N.POSITION.TOP_CENTER}),T({id:null,name:"",code:"",is_cash:!0}),D({id:null,name:"",phone:""}),P()},onError:t=>{N.error(t.error,{position:N.POSITION.TOP_CENTER})},preserveScroll:!1})},z=a=>{if(a){D({id:a.id,name:a.name,phone:a.phone});let t=l;t={...t,contact_id:a.id,description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${a.name.toUpperCase()} Bulan ${l.month}, Tahun Ajaran ${l.study_year}`,student_id:a.student.no_ref,level:a.last_level.level,send_wa:!!(C&&a.phone)},I(t,a.id)}},W=a=>{U(a),u("date",v(a.startDate).format("YYYY-MM-DD"))},Q=(a,t)=>{const{value:m}=a;let r=[...l.details];r[t]={...r[t],value:parseInt(m)};let d=r.reduce((o,i)=>o+i.value,0);Y(d),u({...l,details:r,value:d})},q=a=>{var i;let t="now",m=parseInt(v().format("YYYY"))*100+parseInt(b()),r=a.target.value.split("/"),d=parseInt(l.month)<7?parseInt(r[1])*100+parseInt(l.month):r[0]*100+parseInt(l.month);d>m?t="prepaid":d<m&&(t="receivable");let o=l;o={...o,study_year:a.target.value,description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${(i=x==null?void 0:x.name)==null?void 0:i.toUpperCase()} Bulan ${l.month}, Tahun Ajaran ${a.target.value}`,type:t},I(o)},G=a=>{var i;let t="now",m=parseInt(v().format("YYYY"))*100+parseInt(b()),r=l.study_year.split("/"),d=parseInt(a.target.value)<7?parseInt(r[1])*100+parseInt(a.target.value):r[0]*100+parseInt(a.target.value);d>m?t="prepaid":d<m&&(t="receivable");let o=l;o={...o,month:parseInt(a.target.value),description:`Kas Masuk / Pembayaran Iuran Bulanan dari ${(i=x==null?void 0:x.name)==null?void 0:i.toUpperCase()} Bulan ${parseInt(a.target.value)}, Tahun Ajaran ${l.study_year}`,type:t},I(o)},J=a=>{a&&(T({id:a.id,name:a.name,code:a.code,is_cash:!0}),u("cash_account_id",a.id),O("cash_account_id",""))},X=()=>{F.reload({only:["newRef"],data:{date:v(j.startDate).format("YYYY-MM-DD")},onSuccess:a=>{u("no_ref",a.props.newRef)}})};return e.jsxs(e.Fragment,{children:[e.jsx(ae,{title:"Ubah Pembayaran Iuran Bulanan Siswa"}),e.jsx(me,{}),e.jsx(oe,{onSubmit:L,children:e.jsx("div",{className:"w-full sm:mt-2 sm:py-5",children:e.jsxs("div",{className:"sm:w-1/2 sm:mx-auto px-3 sm:px-0",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"No. Ref",htmlFor:"no_ref",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(_,{id:"no_ref",name:"no_ref",className:`w-full ${(s==null?void 0:s.no_ref)&&"border-red-500"}`,placeholder:"No. Ref",value:l.no_ref||"",onChange:a=>u("no_ref",a.target.value.toUpperCase()),disabled:!0}),(s==null?void 0:s.no_ref)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.no_ref})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Tanggal",htmlFor:"date",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("div",{children:e.jsx(se,{value:j,onChange:W,inputClassName:(s==null?void 0:s.date)&&"border-red-500 rounded-lg",useRange:!1,asSingle:!0,placeholder:"Tanggal",inputId:"date",displayFormat:"MMMM DD, YYYY"})}),(s==null?void 0:s.date)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.date})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Nama Siswa",htmlFor:"name",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(ue,{resources:B,selected:x,setSelected:a=>z(a),maxHeight:"max-h-40",placeholder:"Cari Kontak",isError:!!s.contact_id,id:"name",notFound:e.jsxs("span",{children:["Tidak Ada Data. ",e.jsx(w,{className:"font-bold text-blue-600",href:route("data-master.students.create",{organization:n.id}),children:"Buat Baru ?"})]})}),(s==null?void 0:s.name)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.name})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"No. Siswa",htmlFor:"student_id",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(_,{id:"student_id",name:"student_id",className:`w-full ${(s==null?void 0:s.student_id)&&"border-red-500"}`,placeholder:"No. Siswa",value:l.student_id||"",onChange:a=>u("student_id",a.target.value.toUpperCase()),disabled:!0}),(s==null?void 0:s.student_id)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.student_id})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Kelas",htmlFor:"level",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(_,{id:"level",name:"level",className:`w-full ${(s==null?void 0:s.level)&&"border-red-500"}`,placeholder:"Kelas",value:l.level||"",onChange:a=>u("level",a.target.value.toUpperCase()),disabled:!0}),(s==null?void 0:s.level)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.level})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Tahun Ajaran",htmlFor:"study_year",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:l.study_year,onChange:q,id:"study_year",children:A.map((a,t)=>e.jsx("option",{children:a.year},t))}),(s==null?void 0:s.study_year)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.study_year})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Bulan",htmlFor:"month",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",value:l.month,onChange:G,id:"month",children:pe().map((a,t)=>e.jsx("option",{children:a},t))}),(s==null?void 0:s.month)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.month})]})]}),e.jsx("div",{className:"text-center mt-5 font-bold",children:"Rincian Pembayaran"}),l.details.map((a,t)=>e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:a.name,htmlFor:`category-${t}`,className:" mx-auto my-auto"})}),e.jsx("div",{className:"w-full sm:w-2/3",children:e.jsx(xe,{value:a.value,customInput:_,onValueChange:m=>Q(m,t),thousandSeparator:!0,className:"text-end w-full border",prefix:"IDR ",id:`category-${t}`,disabled:(g==null?void 0:g.length)>0})})]},t)),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 pt-5 sm:mt-2 font-bold text-xl",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:"TOTAL"}),e.jsxs("div",{className:"w-full sm:w-2/3 text-end",children:["Rp. ",he(l.value)]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(h,{value:"Akun Kas",htmlFor:"account",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(fe,{resources:$,selected:p,setSelected:a=>J(a),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!s.cash_account_id,id:"account"}),(p==null?void 0:p.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",p.code]}),(s==null?void 0:s.cash_account_id)&&e.jsx("span",{className:"text-red-500 text-xs",children:s.cash_account_id})]})]}),C&&x.phone&&e.jsxs("div",{className:"md:w-1/3 w-2/3 mt-5",children:[e.jsx("div",{className:"form-control ",children:e.jsxs("label",{className:"label cursor-pointer",htmlFor:"send_wa",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"send_wa",value:l.send_wa,onChange:()=>u("send_wa",!l.send_wa),checked:l.send_wa}),e.jsx("span",{className:"label-text",children:"Kirim Bukti Via WhatsApp"})]})}),s&&s.send_wa&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:s.send_wa})})]}),e.jsxs("div",{className:"flex justify-end flex-col-reverse sm:flex-row gap-2 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/6 my-auto text-center",children:e.jsx(w,{href:route("cashflow.student-monthly-payment",n.id),children:e.jsx(ie,{className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Kembali"})})})}),e.jsx("div",{className:"w-full sm:w-1/6 text-center",children:e.jsx(ce,{className:"w-full",disabled:K,children:e.jsx("div",{className:"text-center w-full",children:"Simpan"})})})]})]})})})]})}je.layout=n=>e.jsx(te,{header:e.jsx(le,{children:"Tambah Pembayaran"}),children:n,user:n.props.auth.user,organization:n.props.organization,title:"Tambah Pembayaran",backLink:e.jsx(w,{href:route("cashflow.student-monthly-payment",n.props.organization.id),children:e.jsx(de,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(w,{href:route("cashflow",n.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(w,{href:route("cashflow.student-monthly-payment",n.props.organization.id),children:"Pembayaran Iuran Bulanan Siswa"})}),e.jsx("li",{children:"Tambah Pembayaran"})]})}),role:n.props.role});export{je as default};