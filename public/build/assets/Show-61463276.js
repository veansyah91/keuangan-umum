import{r as h,y as g,j as e,Y as b,a as t}from"./app-18d344c6.js";import{A as N}from"./AuthenticatedLayout-f72ab3d2.js";import{H as v}from"./Header-d3a5ebd0.js";import{Q as x,k as w}from"./react-toastify.esm-14a132f8.js";/* empty css                      */import{I as m,a as d,b as S,c as P}from"./index.esm-11facade.js";import{C as k}from"./ContainerDesktop-a963213b.js";import{T as _,a as T,P as C,C as I}from"./ContentDesktop-2363a64a.js";import{C as z}from"./ContentMobile-c28a7f05.js";import B from"./StaffSalaryPaymentDetailMobile-41c955fd.js";import F from"./StaffSalaryPaymentDetailDesktop-8e51d8d6.js";import{e as D}from"./index.esm-976e4b01.js";import{f as E}from"./formatNumber-b542c689.js";import{u as R,a as A}from"./index.module-26577e4e.js";import"./ApplicationLogo-782d5a75.js";import"./iconBase-4b51c5f1.js";import"./transition-27a0ae6f.js";import"./dayjs.min-3c5969fb.js";import"./formatMonth-e96174de.js";import"./index.esm-f7f6a4c0.js";function G({role:s,organization:o,details:a,payment:n,searchFilter:p,flash:i}){const[r,u]=h.useState(p||""),j=R(r),[y]=A(r,500);h.useEffect(()=>{j!==void 0&&f()},[y]),h.useEffect(()=>{i!=null&&i.success&&x.success(i.success,{position:x.POSITION.TOP_CENTER})},[]);const f=()=>{g.reload({only:["details"],data:{search:r},preserveState:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(b,{title:`Pembayaran Gaji Bulan: ${n.month}, Tahun: ${n.study_year}`}),e.jsx(w,{}),e.jsx(_,{zIndex:"z-50",search:r,setSearch:l=>u(l.target.value),pageBefore:a.links[0].url?e.jsx(t,{href:route("cashflow.student-monthly-payment",{organization:o.id,page:a.current_page-1,search:r}),preserveState:!0,only:["details"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(t,{href:route("cashflow.student-monthly-payment",{organization:o.id,page:a.current_page+1,search:r}),only:["details"],preserveState:!0,children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a,hasFilter:!0,showFilter:()=>setShowModalFilter(!0)}),e.jsx(z,{children:a.data.map((l,c)=>e.jsx(B,{payment:n,detail:l,role:s},c))}),e.jsxs(k,{children:[e.jsxs(T,{children:[e.jsx("div",{className:"my-auto w-7/12",children:e.jsx("div",{className:"space-x-2",children:e.jsxs("div",{className:"text-2xl font-bold",children:["Total: IDR. ",E(n.value)]})})}),e.jsx("div",{className:"my-auto w-4/12 flex gap-5 justify-end",children:e.jsx(t,{className:"py-3 px-3 border rounded-lg h-full",href:route("cashflow.staff-salary-payment.staff.print",{organization:o.id,payment:n.id}),children:e.jsx(D,{})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(S,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari",className:"w-full border-none focus:outline-none focus:ring-0",value:r||"",onChange:l=>u(l.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(C,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(t,{href:route("cashflow.student-monthly-payment",{organization:o.id,page:a.current_page-1,search:r}),preserveState:!0,only:["details"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(t,{href:route("cashflow.student-monthly-payment",{organization:o.id,page:a.current_page+1,search:r}),only:["details"],preserveState:!0,children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(I,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"No Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Nama"}),e.jsx("th",{className:"bg-gray-200",children:"Jabatan"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Nilai"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((l,c)=>e.jsx(F,{payment:n,detail:l,role:s,className:`${c%2==0&&"bg-gray-100"} text-sm`},c))})]})})})})]})]})}G.layout=s=>e.jsx(N,{header:e.jsxs(v,{children:["Pembayaran Gaji Bulan: ",s.props.payment.month,", Tahun: ",s.props.payment.study_year]}),children:s,user:s.props.auth.user,organization:s.props.organization,title:`Pembayaran Gaji Bulan: ${s.props.payment.month}, Tahun: ${s.props.payment.study_year}`,backLink:e.jsx(t,{href:route("cashflow.staff-salary-payment",s.props.organization.id),children:e.jsx(P,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(t,{href:route("cashflow.staff-salary-payment",s.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(t,{href:route("cashflow.staff-salary-payment",s.props.organization.id),children:"Pembayaran Gaji Bulanan"})}),e.jsx("li",{children:"Rincian Pembayaran Gaji Bulanan"})]})}),role:s.props.role});export{G as default};