import{r as d,W as M,y as _,j as e,Y as E,a as l}from"./app-f39f5256.js";import{A as O}from"./AuthenticatedLayout-e2125e6a.js";import{H as A}from"./Header-39ce6dc8.js";import{I as m,a as h,k as z,b as H,c as R}from"./index.esm-1a465fb0.js";import{k as K,Q as x}from"./react-toastify.esm-1385f02c.js";import{A as L}from"./AddButtonMobile-16c6f711.js";import{T as Q,a as V,P as W,C as Y}from"./ContentDesktop-7009db33.js";import{a as $,u as q}from"./index.module-3b0b3f9b.js";import{M as y}from"./Modal-dec688cc.js";import{S as N}from"./SecondaryButton-12c497fc.js";import{P as v}from"./PrimaryButton-e7612656.js";import{C as G}from"./ContentMobile-196cbb25.js";import{C as J}from"./ContainerDesktop-a3bc2847.js";import{D as U}from"./DangerButton-b607a54f.js";import X from"./ProjectDesktop-3fb6096e.js";import Z from"./ProjectMobile-123dc45f.js";import"./ApplicationLogo-dae171ed.js";import"./iconBase-62f121b1.js";import"./transition-4036d903.js";/* empty css                      */import"./dayjs.min-2681d619.js";import"./formatNumber-b542c689.js";import"./portal-ca4f363a.js";import"./close-provider-e51f726a.js";function ee({role:t,organization:i,projects:s,searchFilter:b}){const[r,j]=d.useState(b||""),[k]=$(r,500),[u,S]=d.useState({status:""}),[D,n]=d.useState(!1),[P,o]=d.useState(!1),{data:p,setData:w,processing:C,delete:F}=M({id:null,code:"",name:""}),I=q(r);d.useEffect(()=>{I!==void 0&&f()},[k]);const f=()=>{_.reload({only:["projects"],data:{search:r,status:u.status},preserveState:!0})},g=a=>{n(!0),w({id:a.id,code:a.code,name:a.name})},B=a=>{a.preventDefault(),F(route("data-master.project.destroy",{organization:i.id,project:p.id}),{onSuccess:()=>{x.success("Proyek Berhasil Dihapus",{position:x.POSITION.TOP_CENTER}),n(!1)},onError:c=>{x.error(c.delete,{position:x.POSITION.TOP_CENTER}),n(!1)}})},T=a=>{a.preventDefault(),f(),o(!1)};return e.jsxs(e.Fragment,{children:[e.jsx(E,{title:"Data Proyek"}),e.jsx(K,{}),t!=="viewer"&&e.jsx(l,{href:route("data-master.project.create",i.id),children:e.jsx(L,{label:"Tambah"})}),e.jsx(Q,{zIndex:"z-50",search:r,setSearch:a=>j(a.target.value),pageBefore:s.links[0].url?e.jsx(l,{href:route("data-master.project",{organization:i.id,page:s.current_page-1,search:r}),preserveState:!0,only:["projects"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})}),pageAfter:s.links[s.links.length-1].url?e.jsx(l,{href:route("data-master.project",{organization:i.id,page:s.current_page+1,search:r}),only:["projects"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})}),page:e.jsxs(e.Fragment,{children:[s.current_page,"/",s.last_page]}),data:s,hasFilter:!0,showFilter:()=>o(!0)}),e.jsx(G,{children:s.data.map(a=>e.jsx(Z,{project:a,handleDelete:()=>g(a),role:t},a.id))}),e.jsxs(J,{children:[e.jsxs(V,{children:[e.jsx("div",{className:"my-auto w-5/12",children:t!=="viewer"&&e.jsx(l,{href:route("data-master.project.create",i.id),children:e.jsx(v,{className:"py-3",children:"Tambah Data"})})}),e.jsx("div",{className:"my-auto w-4/12 gap-5 justify-end",children:e.jsx("div",{className:"text-end",children:e.jsx("button",{className:"py-3 px-3 border rounded-lg",onClick:()=>o(!0),children:e.jsx(z,{})})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(H,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Proyek",className:"w-full border-none focus:outline-none focus:ring-0",value:r||"",onChange:a=>j(a.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(W,{data:s})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:s.links[0].url?e.jsx(l,{href:route("data-master.project",{organization:i.id,page:s.current_page-1,search:r}),preserveState:!0,only:["projects"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})})}),e.jsxs("div",{className:"my-auto",children:[s.current_page,"/",s.last_page]}),e.jsx("div",{className:"my-auto",children:s.links[s.links.length-1].url?e.jsx(l,{href:route("data-master.project",{organization:i.id,page:s.current_page+1,search:r}),only:["projects"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(Y,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Kode"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Proyek"}),e.jsx("th",{className:"bg-gray-200",children:"Deksripsi"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Estimasi Nilai"}),e.jsx("th",{className:"bg-gray-200 text-center",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:s.data.map((a,c)=>e.jsx(X,{project:a,className:`${c%2==0&&"bg-gray-100"}`,handleDelete:()=>g(a),role:t},c))})]})})})})]}),e.jsx(y,{show:P,onClose:()=>o(!1),children:e.jsxs("form",{onSubmit:T,className:"p-6",id:"filter",name:"filter",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Proyek"}),e.jsx("div",{className:"mt-6 ",children:e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-1/4 my-auto",children:"Status"}),e.jsx("div",{className:"w-3/4 flex",children:e.jsxs("select",{className:"select select-bordered w-full",id:"status",value:u.status,onChange:a=>S({...u,status:a.target.value}),children:[e.jsx("option",{disabled:!0,value:"",children:"--Pilih Status--"}),e.jsx("option",{value:"not started",children:"Belum Dimulai"}),e.jsx("option",{value:"pending",children:"Menunggu"}),e.jsx("option",{value:"in progress",children:"Dalam Pengerjaan"}),e.jsx("option",{value:"finished",children:"Selesai"})]})})]})}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(N,{onClick:()=>o(!1),children:"Batal"}),e.jsx(v,{className:"ms-3",children:"Filter"})]})]})}),e.jsx(y,{show:D,onClose:()=>n(!1),children:e.jsxs("form",{onSubmit:B,className:"p-6",id:"deleteForm",name:"deleteForm",children:[e.jsxs("h2",{className:"text-lg font-medium text-gray-900 text-center",children:["Hapus Proyek ",p.name]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(N,{onClick:()=>n(!1),children:"Batal"}),e.jsx(U,{className:"ms-3",disabled:C,children:"Hapus"})]})]})})]})}ee.layout=t=>e.jsx(O,{header:e.jsx(A,{children:"Data Proyek"}),children:t,user:t.props.auth.user,organization:t.props.organization,title:"Data Proyek",backLink:e.jsx(l,{href:route("data-master",t.props.organization.id),children:e.jsx(R,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(l,{href:route("data-master",t.props.organization.id),children:"Data Master"})}),e.jsx("li",{children:"Data Proyek"})]})}),role:t.props.role});export{ee as default};