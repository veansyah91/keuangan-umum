import{q as v,r as l,W as S,y as k,j as e,Y as D,a as n}from"./app-532d12ca.js";import{A as P}from"./AuthenticatedLayout-bfe89847.js";import{H as T}from"./Header-63a5e63c.js";import{Q as m,k as I}from"./react-toastify.esm-c2b42425.js";/* empty css                      */import{I as c,a as h,c as _}from"./index.esm-57c76efb.js";import{F as E}from"./index.esm-e0cbf802.js";import{u as z,o as C}from"./index.module-0ac73302.js";import{C as R}from"./ContainerDesktop-0c99a8c6.js";import{T as A,C as F,a as M,P as O,b as B}from"./ContentDesktop-98a189b1.js";import H from"./StudentEntryReceivableDetailMobile-faa61677.js";import $ from"./StudentEntryReceivableDetailDesktop-152785cd.js";import{f as q}from"./formatNumber-b542c689.js";import"./ApplicationLogo-e3517187.js";import"./iconBase-2649accd.js";import"./transition-5e25d0de.js";import"./dayjs.min-13054d55.js";import"./BadgeDanger-004daf8b.js";import"./BadgeSuccess-c4c0f234.js";import"./index.esm-c8814848.js";import"./index.esm-44550714.js";function J({role:s,organization:o,receivables:a,searchFilter:x,receivable:i}){const{errors:u}=v().props;l.useState(!1);const[K,p]=l.useState(!1),[r,j]=l.useState(x||""),[L,f]=l.useState(""),{data:Q,setData:g,delete:V,processing:W,reset:Y}=S({id:null,receivable_id:null}),y=z(r),[N]=C(r,500);l.useEffect(()=>{y!==void 0&&b()},[N]),l.useEffect(()=>{u&&m.error(u.message,{position:m.POSITION.TOP_CENTER})},[]);const b=()=>{k.reload({only:["receivables"],data:{search:r}})},w=t=>{f(`Hapus Piutang ${t.no_ref}`),p(!0),g({id:t.id,receivable:t.receivable_id})};return e.jsxs(e.Fragment,{children:[e.jsx(D,{title:"Piutang Iuran Siswa"}),e.jsx(I,{}),e.jsx(A,{zIndex:"z-50",search:r,setSearch:t=>j(t.target.value),pageBefore:a.links[0].url?e.jsx(n,{href:route("cashflow.student-entry-receivable.show",{organization:o.id,receivable:i.id,page:a.current_page-1,search:r}),preserveState:!0,only:["receivables"],children:e.jsx(c,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(c,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(n,{href:route("cashflow.student-entry-receivable.show",{organization:o.id,receivable:i.id,page:a.current_page+1,search:r}),only:["receivables"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a}),e.jsx(F,{children:a.data.map((t,d)=>e.jsx(H,{receivable:t,handleDelete:()=>w(t),role:s},d))}),e.jsxs(R,{children:[e.jsxs(M,{children:[e.jsxs("div",{className:"my-auto w-7/12 text-2xl",children:["Total: ",e.jsxs("span",{className:"font-bold",children:["IDR. ",q(i.value)]})]}),e.jsx("div",{className:"my-auto w-4/12 flex gap-5 justify-end",children:e.jsx(n,{className:"py-3 px-3 border rounded-lg h-full",href:route("cashflow.student-entry-receivable.print",{organization:o.id,studentEntryReceivable:i.id}),children:e.jsx(E,{})})}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(O,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(n,{href:route("cashflow.student-entry-receivable.show",{organization:o.id,receivable:i.id,page:a.current_page-1,search:r}),preserveState:!0,only:["receivables"],children:e.jsx(c,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(c,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(n,{href:route("cashflow.student-entry-receivable.show",{organization:o.id,receivable:i.id,page:a.current_page+1,search:r}),only:["receivables"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(B,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Tanggal Transaksi"}),e.jsx("th",{className:"bg-gray-200",children:"No Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Tahun Ajaran"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Jumlah"}),e.jsx("th",{className:"bg-gray-200",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((t,d)=>e.jsx($,{receivable:t,className:`${d%2==0&&"bg-gray-100"}`,role:s},d))})]})})})})]})]})}J.layout=s=>e.jsx(P,{header:e.jsxs(T,{children:["Piutang Iuran Tahunan Siswa ",s.props.contact.name]}),children:s,user:s.props.auth.user,organization:s.props.organization,title:"Piutang Iuran Tahunan",backLink:e.jsx(n,{href:route("cashflow.student-entry-receivable",s.props.organization.id),children:e.jsx(_,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("cashflow",s.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("cashflow.student-entry-receivable",s.props.organization.id),children:"Piutang Iuran Tahunan Siswa"})}),e.jsx("li",{children:"Detail Piutang Iuran Tahunan Siswa"})]})}),role:s.props.role});export{J as default};