import{r as n,y as F,j as e,Y as A,a as r}from"./app-18d344c6.js";import{D as L,A as _}from"./AuthenticatedLayout-f72ab3d2.js";import{H as I}from"./Header-d3a5ebd0.js";import{I as d,a as c,k as M,b as B,c as z}from"./index.esm-11facade.js";import{P}from"./PrimaryButton-74e4339d.js";import{M as T}from"./Modal-fb9ed9d2.js";import{S as V}from"./SecondaryButton-8f498461.js";import{T as H,a as E,P as W,C as R}from"./ContentDesktop-2363a64a.js";import{C as Y}from"./ContentMobile-c28a7f05.js";import $ from"./WhatsappLogComponentMobile-c2aae058.js";import{C as G}from"./ContainerDesktop-a963213b.js";import K from"./WhatsappLogComponentDesktop-6d49c083.js";import{a as j,u as O}from"./index.module-26577e4e.js";import"./ApplicationLogo-782d5a75.js";import"./iconBase-4b51c5f1.js";import"./transition-27a0ae6f.js";/* empty css                      */import"./dayjs.min-3c5969fb.js";import"./portal-3e1f6179.js";import"./close-provider-98abf862.js";import"./formatNumber-b542c689.js";function q({logs:a,startDate:f,endDate:g,searchFilter:y,statusFilter:v,organization:o}){const[t,u]=n.useState(y||""),[N,l]=n.useState(!1),[i,b]=n.useState({startDate:f||"",endDate:g||""}),[h,w]=n.useState({status:v||"all"}),[k]=j(t,500),[S]=j(i,500),D=O(t);n.useEffect(()=>{D!==void 0&&x()},[k,S]);const C=s=>{s.preventDefault(),x(),l(!1)},m=s=>{b(s)},x=()=>{F.reload({only:["logs"],data:{search:t,start_date:i.startDate,end_date:i.endDate,status:h.status},preserveState:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(A,{title:"Log Aktifitas"}),e.jsx(H,{zIndex:"z-50",search:t,setSearch:s=>u(s.target.value),pageBefore:a.links[0].url?e.jsx(r,{href:route("add-ons.whatsapp-log",{organization:o.id,page:a.current_page-1,search:t}),preserveState:!0,only:["logs"],children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(r,{href:route("add-ons.whatsapp-log",{organization:o.id,page:a.current_page+1,search:t}),only:["logs"],preserveState:!0,children:e.jsx(c,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(c,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a,hasFilter:!0,showFilter:()=>l(!0),hasDate:!0,dateValue:i,onChangeDate:m}),e.jsx(Y,{children:a.data.map(s=>e.jsx($,{log:s},s.id))}),e.jsxs(G,{children:[e.jsxs(E,{children:[e.jsx("div",{className:"my-auto w-5/12"}),e.jsxs("div",{className:"my-auto w-4/12 flex gap-5",children:[e.jsx("button",{className:"py-2 px-3 border rounded-lg",onClick:()=>l(!0),children:e.jsx(M,{})}),e.jsx(L,{value:i,onChange:m,showShortcuts:!0,configs:{shortcuts:{today:"Hari Ini",yesterday:"Kemarin",past:s=>`${s} Hari Terakhir`,currentMonth:"Bulan Ini",pastMonth:"Bulan Lalu",currentYear:"Tahun Ini"}},separator:"s.d"})]}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(B,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Log Aktivitas",className:"w-full border-none focus:outline-none focus:ring-0",value:t||"",onChange:s=>u(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(W,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(r,{href:route("add-ons.whatsapp-log",{organization:o.id,page:a.current_page-1,search:t}),preserveState:!0,only:["logs"],children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(r,{href:route("add-ons.whatsapp-log",{organization:o.id,page:a.current_page+1,search:t}),only:["logs"],preserveState:!0,children:e.jsx(c,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(c,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(R,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Tanggal"}),e.jsx("th",{className:"bg-gray-200",children:"Siswa"}),e.jsx("th",{className:"bg-gray-200",children:"Deksripsi"}),e.jsx("th",{className:"bg-gray-200",children:"Status"})]})}),e.jsx("tbody",{children:a.data.map((s,p)=>e.jsx(K,{log:s,className:`${p%2==0&&"bg-gray-100"}`},p))})]})})})})]}),e.jsx(T,{show:N,onClose:()=>l(!1),children:e.jsxs("form",{onSubmit:C,className:"p-6",id:"filter",name:"filter",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Log Aktifitas"}),e.jsx("div",{className:"mt-6 ",children:e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"sm:w-1/4 w-full my-auto font-bold",children:"Status"}),e.jsx("div",{className:"sm:w-3/4 w-full flex",children:e.jsxs("select",{className:"select select-bordered w-full",value:h.status,onChange:s=>w({...h,status:s.target.value}),id:"study_year",children:[e.jsx("option",{value:"all",children:"Semua"}),e.jsx("option",{value:"sent",children:"Terkirim"}),e.jsx("option",{value:"waiting",children:"Menunggu"}),e.jsx("option",{value:"failed",children:"Gagal"})]})})]})}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(V,{onClick:()=>l(!1),children:"Batal"}),e.jsx(P,{className:"ms-3",children:"Filter"})]})]})})]})}q.layout=a=>e.jsx(_,{header:e.jsx(I,{children:"Log Aktifitas"}),children:a,user:a.props.auth.user,organization:a.props.organization,title:"Log Aktifitas",backLink:e.jsx(r,{href:route("add-ons.whatsapp",a.props.organization.id),children:e.jsx(z,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(r,{href:route("add-ons",a.props.organization.id),children:"Add-ons"})}),e.jsx("li",{className:"font-bold",children:e.jsx(r,{href:route("add-ons.whatsapp",a.props.organization.id),children:"WhatsApp Broadcast"})}),e.jsx("li",{children:"Log Aktifitas"})]})}),role:a.props.role});export{q as default};