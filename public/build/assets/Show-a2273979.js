import{K as B,r as o,m as _,S as E,j as e,L as M,$ as r}from"./app-c3de5fa6.js";import{A as O}from"./AuthenticatedLayout-2f82e08a.js";import{H as R}from"./Header-ee160182.js";import{Q as c,k as z}from"./react-toastify.esm-94b2ee7c.js";/* empty css                      */import{I as u,a as x,b as A,c as F}from"./index.esm-234976fb.js";import{c as H}from"./index.esm-3803e3d4.js";import{A as $}from"./AddButtonMobile-0d121cb0.js";import{M as L}from"./Modal-5f8d8618.js";import{S as K}from"./SecondaryButton-fcf7be1a.js";import{P as J}from"./PrimaryButton-02cc0a94.js";import{u as Q,a as V}from"./index.module-1bc829eb.js";import{C as q}from"./ContainerDesktop-744bb52e.js";import{T as G,a as U,P as W,C as X}from"./ContentDesktop-8217dec4.js";import{C as Y}from"./ContentMobile-168e507c.js";import{D as Z}from"./DangerButton-9faf9837.js";import ee from"./StudentMonthlyReceivableDetailMobile-bbdbf932.js";import ae from"./StudentMonthlyReceivableDetailDesktop-e2f0832c.js";import"./ApplicationLogo-33e039c9.js";import"./iconBase-23c1fa9a.js";import"./transition-294d1a88.js";import"./dayjs.min-c211a108.js";import"./portal-97852d2d.js";import"./close-provider-c2a46ce3.js";import"./formatNumber-b542c689.js";import"./BadgeDanger-1384f98a.js";import"./BadgeSuccess-83002f6d.js";function se({role:t,organization:n,receivables:a,searchFilter:y,receivable:d,contact:m}){const{errors:p}=B().props;o.useState(!1);const[N,h]=o.useState(!1),[l,j]=o.useState(y||""),[b,w]=o.useState(""),{data:f,setData:v,delete:S,processing:P,reset:D}=_({id:null,receivable_id:null}),I=Q(l),[C]=V(l,500);o.useEffect(()=>{I!==void 0&&T()},[C]),o.useEffect(()=>{p&&c.error(p.message,{position:c.POSITION.TOP_CENTER})},[]);const T=()=>{E.reload({only:["receivables"],data:{search:l}})},g=s=>{w(`Hapus Piutang ${s.no_ref}`),h(!0),v({id:s.id,receivable:s.receivable_id})},k=s=>{s.preventDefault(),S(route("cashflow.student-monthly-receivable.delete",{organization:n.id,receivable:f.receivable,ledger:f.id}),{onSuccess:()=>{h(!1),c.success("Piutang Berhasil Dihapus",{position:c.POSITION.TOP_CENTER}),D()},onError:i=>{h(!1),c.error(i.message,{position:c.POSITION.TOP_CENTER})}})};return e.jsxs(e.Fragment,{children:[e.jsx(M,{title:"Piutang Iuran Siswa"}),e.jsx(z,{}),t!=="viewer"&&e.jsx(r,{href:route("cashflow.student-monthly-receivable.create",{organization:n.id,contact:m.name,selectedContact:m.id}),children:e.jsx($,{label:"Tambah"})}),e.jsx(G,{zIndex:"z-50",search:l,setSearch:s=>j(s.target.value),pageBefore:a.links[0].url?e.jsx(r,{href:route("cashflow.student-monthly-receivable.show",{organization:n.id,receivable:d.id,page:a.current_page-1,search:l}),preserveState:!0,only:["receivables"],children:e.jsx(u,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(u,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(r,{href:route("cashflow.student-monthly-receivable.show",{organization:n.id,receivable:d.id,page:a.current_page+1,search:l}),only:["receivables"],preserveState:!0,children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a}),e.jsx(Y,{children:a.data.map((s,i)=>e.jsx(ee,{receivable:s,handleDelete:()=>g(s),role:t},i))}),e.jsxs(q,{children:[e.jsxs(U,{children:[e.jsx("div",{className:"my-auto w-7/12",children:t!=="viewer"&&e.jsx("div",{className:"space-x-2",children:e.jsx(r,{href:route("cashflow.student-monthly-receivable.create",{organization:n.id,contact:m.name,selectedContact:m.id}),children:e.jsx(J,{className:"py-3",children:"Tambah Data"})})})}),e.jsx("div",{className:"my-auto w-4/12 flex gap-5 justify-end",children:e.jsx(r,{className:"py-3 px-3 border rounded-lg h-full",href:route("cashflow.student-monthly-receivable.print",{organization:n.id,receivable:d.id}),children:e.jsx(H,{})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(A,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari No Ref",className:"w-full border-none focus:outline-none focus:ring-0",value:l||"",onChange:s=>j(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(W,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(r,{href:route("cashflow.student-monthly-receivable.show",{organization:n.id,receivable:d.id,page:a.current_page-1,search:l}),preserveState:!0,only:["receivables"],children:e.jsx(u,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(u,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(r,{href:route("cashflow.student-monthly-receivable.show",{organization:n.id,receivable:d.id,page:a.current_page+1,search:l}),only:["receivables"],preserveState:!0,children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(X,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"No Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Tanggal Input"}),e.jsx("th",{className:"bg-gray-200",children:"Bulan"}),e.jsx("th",{className:"bg-gray-200",children:"Tahun Ajaran"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Jumlah"}),e.jsx("th",{className:"bg-gray-200",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,i)=>e.jsx(ae,{receivable:s,className:`${i%2==0&&"bg-gray-100"}`,handleDelete:()=>g(s),role:t},i))})]})})})})]}),e.jsx(L,{show:N,onClose:()=>h(!1),children:e.jsxs("form",{onSubmit:k,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 text-center",children:b}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(K,{onClick:()=>h(!1),children:"Batal"}),e.jsx(Z,{className:"ms-3",disabled:P,children:"Hapus"})]})]})})]})}se.layout=t=>e.jsx(O,{header:e.jsxs(R,{children:["Piutang Iuran Bulanan Siswa ",t.props.contact.name]}),children:t,user:t.props.auth.user,organization:t.props.organization,title:"Piutang Iuran Bulanan",backLink:e.jsx(r,{href:route("cashflow.student-monthly-receivable",t.props.organization.id),children:e.jsx(F,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(r,{href:route("cashflow",t.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{className:"font-bold",children:e.jsx(r,{href:route("cashflow.student-monthly-receivable",t.props.organization.id),children:"Piutang Iuran Bulanan Siswa"})}),e.jsx("li",{children:"Detail Piutang Iuran Bulanan Siswa"})]})}),role:t.props.role});export{se as default};
