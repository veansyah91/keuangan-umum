import{W as T,r as $,j as s,Y as I,a as x}from"./app-09a58158.js";import{A as D}from"./AuthenticatedLayout-95496b06.js";import{H as S}from"./Header-bfa9803f.js";import{c as k}from"./index.esm-99f8d854.js";import{d as h}from"./dayjs.min-62ab8c49.js";import{F as u,d as v}from"./index.esm-69c84114.js";import{S as N}from"./SecondaryButton-d5976287.js";import{f as d}from"./formatNumber-b542c689.js";import{k as f,Q as c}from"./react-toastify.esm-47138706.js";import"./ApplicationLogo-71780ae1.js";import"./iconBase-0a2c1025.js";import"./transition-834a9f2b.js";/* empty css                      */function R({contact:a,organization:r,role:M,payment:e,user:p,whatsappPlugin:o}){const{data:g,post:w,processing:b}=T({contact_id:e.contact_id,date:e.date,no_ref:e.no_ref,value:e.value,receivable_value:e.receivable_value,paidValue:e.value-e.receivable_value,study_year:e.study_year,details:e.details,send_wa:o}),[A]=$.useState("https://web.whatsapp.com/send"),m=()=>{window.print()},j=()=>{if(o){w(route("cashflow.student-entry-payment.send-whatsapp",{organization:r.id,payment:e.id}),{onSuccess:({props:t})=>{const{flash:n}=t;c.success(n.success,{position:c.POSITION.TOP_CENTER})}});return}let l=a.phone;if(!l){c.error(`No Handphone ${a.name} tidak ditemukan`,{position:c.POSITION.TOP_CENTER});return}l[0]!=="6"&&l[1]!=="2"&&(l="62"+l.slice(1));let i="";e.details.forEach((t,n)=>{i+=`%0A${n+1}. ${t.name} : IDR ${d(t.pivot.value)}`}),i+=`%0A*Total: IDR. ${d(e.value)}*%0A*Jumlah Bayar: IDR. ${d(e.value-e.receivable_value)}*%0A*Sisa: IDR. ${d(e.receivable_value)}*`;let _=`*PEMBAYARAN IURAN TAHUNAN*%0A-------------------------------------------------------%0A*Nama*: ${a.name}%0A*No. Siswa*: ${a.student.no_ref??"-"}%0A*Tahun Masuk*: ${a.student.entry_year}%0A*Kelas Sekarang*: ${a.last_level.level}%0A-------------------------------------------------------%0A*No Ref*: ${e.no_ref}%0A*Tanggal*: ${h(e.date).locale("id").format("DD MMMM YYYY")}%0A*Tahun Ajaran*: ${e.study_year}%0A%0A*DETAIL:*${i}%0A%0A%0ATtd,%0A%0A%0A*${r.name}*`,y=`${A}?phone=${l}&text=${_}`;window.open(y,"_blank")};return s.jsxs(s.Fragment,{children:[s.jsx(I,{title:`Pembayaran Iuran Tahunan ${a.name} (${a.student.no_ref})`}),s.jsx(f,{}),s.jsx("div",{className:"sm:pt-0 pb-16 pt-12",children:s.jsxs("div",{className:"bg-white py-2 sm:pt-0 px-5",children:[s.jsxs("div",{className:"flex sm:flex-row justify-between gap-2 print:hidden",children:[s.jsx("div",{className:"px-3 my-auto flex gap-3"}),s.jsxs("div",{className:"text-end px-3 hidden sm:block space-x-5",children:[a.phone&&s.jsx(N,{onClick:j,disabled:b,children:s.jsxs("div",{className:"flex gap-2",children:[s.jsx("div",{className:"my-auto",children:s.jsx(u,{})}),s.jsx("div",{className:"my-auto",children:"Kirim WA"})]})}),s.jsx(N,{onClick:m,children:s.jsxs("div",{className:"flex gap-2",children:[s.jsx("div",{className:"my-auto",children:s.jsx(v,{})}),s.jsx("div",{className:"my-auto",children:"Print"})]})})]}),s.jsxs("div",{className:"fixed sm:hidden bottom-2 right-2 space-x-1",children:[s.jsx("button",{onClick:j,className:"bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14",children:s.jsx("div",{className:"flex gap-2",children:s.jsx("div",{className:"my-auto mx-auto",children:s.jsx(u,{})})})}),s.jsx("button",{onClick:m,className:"bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14",children:s.jsx("div",{className:"flex gap-2",children:s.jsx("div",{className:"my-auto mx-auto",children:s.jsx(v,{})})})})]})]}),s.jsxs("div",{className:"uppercase pt-9 pb-3 border-b hidden print:flex print:justify-between",children:[s.jsx("div",{className:"w-1/2 text-2xl my-auto",children:"Pembayaran Iuran Tahunan"}),s.jsxs("div",{className:"w-1/2 text-end mt-auto",children:[s.jsx("div",{children:r.name}),s.jsx("div",{className:"text-xs",children:r.address}),s.jsxs("div",{className:"text-xs",children:[r.village,", ",r.district,", ",r.regency,","," ",r.province]})]})]}),s.jsx("div",{className:"my-2 space-y-3 mx-3 print:font-['Open_Sans'] overflow-auto",children:s.jsxs("div",{className:"sm:w-3/4 w-[550px] print:w-full",children:[s.jsxs("div",{className:"w-full space-y-2",children:[s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Nama"}),s.jsxs("div",{className:"w-3/4",children:[": ",a.name]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"No. Siswa"}),s.jsxs("div",{className:"w-3/4",children:[": ",a.student.no_ref??"-"]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Tahun Masuk"}),s.jsxs("div",{className:"w-3/4",children:[": ",a.student.entry_year]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Kelas Sekarang"}),s.jsxs("div",{className:"w-3/4",children:[": ",a.last_level.level]})]})]}),s.jsxs("div",{className:"w-full space-y-2 mt-2 pt-3 border-t border-slate-900",children:[s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"No Ref"}),s.jsxs("div",{className:"w-3/4",children:[": ",e.no_ref]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Tanggal"}),s.jsxs("div",{className:"w-3/4",children:[": ",h(e.date).locale("id").format("DD MMMM YYYY")]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Tahun Ajaran"}),s.jsxs("div",{className:"w-3/4",children:[": ",e.study_year]})]}),s.jsxs("div",{className:"flex",children:[s.jsx("div",{className:"w-1/4",children:"Total"}),s.jsxs("div",{className:"w-3/4",children:[": IDR. ",d(e.value)]})]})]}),s.jsxs("table",{className:"mt-5 w-full table text-base",children:[s.jsx("thead",{className:"text-base text-gray-900",children:s.jsxs("tr",{children:[s.jsx("th",{className:"text-start",children:"No"}),s.jsx("th",{className:"text-start",children:"Keterangan"}),s.jsx("th",{className:"text-end",children:"Jumlah"})]})}),s.jsx("tbody",{children:e.details.map((l,i)=>s.jsxs("tr",{children:[s.jsx("td",{children:i+1}),s.jsx("td",{children:l.name}),s.jsxs("td",{className:"text-end",children:["IDR. ",d(l.pivot.value)]})]},l.id))}),s.jsxs("tfoot",{className:"text-base text-gray-900",children:[s.jsxs("tr",{children:[s.jsx("th",{className:"text-start",colSpan:2,children:"Total"}),s.jsxs("th",{className:"text-end",children:["IDR. ",d(e.value)]})]}),s.jsxs("tr",{children:[s.jsx("th",{className:"text-start",colSpan:2,children:"Jumlah Bayar"}),s.jsxs("th",{className:"text-end",children:["IDR. ",d(e.value-e.receivable_value)]})]}),s.jsxs("tr",{children:[s.jsx("th",{className:"text-start",colSpan:2,children:"Sisa"}),s.jsxs("th",{className:"text-end",children:["IDR. ",d(e.receivable_value)]})]})]})]}),s.jsx("div",{className:"mt-20 w-full hidden justify-end print:flex",children:s.jsxs("div",{className:"",children:[s.jsxs("div",{children:[r.address,", ",h().locale("id").format("DD MMMM YYYY")," "]}),s.jsx("div",{className:"uppercase font-bold mt-20",children:p.name})]})})]})})]})}),s.jsx(f,{})]})}R.layout=a=>s.jsx(D,{header:s.jsxs(S,{children:["Detail Pembayaran ",a.props.contact.name]}),children:a,user:a.props.auth.user,organization:a.props.organization,title:"Detail Pembayaran",backLink:s.jsx(x,{href:route("cashflow.student-entry-payment",a.props.organization.id),children:s.jsx(k,{})}),breadcrumbs:s.jsx("div",{className:"text-sm breadcrumbs",children:s.jsxs("ul",{children:[s.jsx("li",{className:"font-bold",children:s.jsx(x,{href:route("cashflow",a.props.organization.id),children:"Arus Kas"})}),s.jsx("li",{className:"font-bold",children:s.jsx(x,{href:route("cashflow.student-entry-payment",a.props.organization.id),children:"Pembayaran Iuran Tahunan Siswa"})}),s.jsx("li",{children:"Detail Pembayaran Iuran Tahunan"})]})}),role:a.props.role});export{R as default};