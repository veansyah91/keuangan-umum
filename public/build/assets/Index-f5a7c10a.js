import{r as o,W as P,y as T,j as e,Y as I,a as l}from"./app-2c82fe5b.js";import{A as _}from"./AuthenticatedLayout-e8572a4e.js";import{H as B}from"./Header-e49f525e.js";import{k as M,Q as c}from"./react-toastify.esm-0437b8bc.js";/* empty css                      */import{I as m,a as h,b as E,c as A}from"./index.esm-45acd85f.js";import{A as K}from"./AddButtonMobile-e8acad84.js";import{M as O}from"./Modal-2b723672.js";import{S as z}from"./SecondaryButton-70b62587.js";import{P as H}from"./PrimaryButton-63193b6a.js";import{u as F,o as R}from"./index.module-1a6f157a.js";import{C as $}from"./ContainerDesktop-a926406a.js";import{T as L,C as Q,a as V,P as W,b as Y}from"./ContentDesktop-0a1a7c5e.js";import q from"./ContactMobile-5d20862a.js";import G from"./ContactDesktop-02fba2d6.js";import{D as J}from"./DangerButton-7f2463d9.js";import"./ApplicationLogo-5e29cd5b.js";import"./iconBase-e7dc96e4.js";import"./transition-a44a8b97.js";import"./dayjs.min-40eeaf43.js";import"./portal-7194087c.js";import"./close-provider-2bd5f7ad.js";import"./formatNumber-b542c689.js";function U({role:t,organization:i,contacts:a,searchFilter:p}){o.useState(!1);const[j,n]=o.useState(!1),[r,x]=o.useState(p||""),[f,g]=o.useState(""),{data:N,setData:y,delete:b,processing:v,reset:k}=P({id:0}),D=F(r),[S]=R(r,500);o.useEffect(()=>{D!==void 0&&C()},[S]);const C=()=>{T.reload({only:["contacts"],data:{search:r}})},u=s=>{g(`Hapus Kontak ${s.name}`),n(!0),y("id",s.id)},w=s=>{s.preventDefault(),b(route("data-master.contact.destroy",{organization:i.id,contact:N.id}),{onSuccess:()=>{n(!1),c.success("Kontak Berhasil Dihapus",{position:c.POSITION.TOP_CENTER}),k()},onError:d=>{c.error(d.message,{position:c.POSITION.TOP_CENTER})}})};return e.jsxs(e.Fragment,{children:[e.jsx(I,{title:"Data Kontak"}),e.jsx(M,{}),t!=="viewer"&&e.jsx(l,{href:route("data-master.contact.create",i.id),children:e.jsx(K,{label:"Tambah"})}),e.jsx(L,{zIndex:"z-50",search:r,setSearch:s=>x(s.target.value),pageBefore:a.links[0].url?e.jsx(l,{href:route("data-master.contact",{organization:i.id,page:a.current_page-1,search:r}),preserveState:!0,only:["contacts"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(l,{href:route("data-master.contact",{organization:i.id,page:a.current_page+1,search:r}),only:["contacts"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a}),e.jsx(Q,{children:a.data.map(s=>e.jsx(q,{contact:s,handleDelete:()=>u(s),role:t},s.id))}),e.jsxs($,{children:[e.jsxs(V,{children:[e.jsx("div",{className:"my-auto w-7/12",children:t!=="viewer"&&e.jsx(l,{href:route("data-master.contact.create",i.id),children:e.jsx(H,{className:"py-3",children:"Tambah Data"})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(E,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Kontak",className:"w-full border-none focus:outline-none focus:ring-0",value:r||"",onChange:s=>x(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(W,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(l,{href:route("data-master.contact",{organization:i.id,page:a.current_page-1,search:r}),preserveState:!0,only:["contacts"],children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(l,{href:route("data-master.contact",{organization:i.id,page:a.current_page+1,search:r}),only:["contacts"],preserveState:!0,children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(Y,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Nama"}),e.jsx("th",{className:"bg-gray-200",children:"No. HP"}),e.jsx("th",{className:"bg-gray-200",children:"Alamat"}),e.jsx("th",{className:"bg-gray-200"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,d)=>e.jsx(G,{contact:s,className:`${d%2==0&&"bg-gray-100"}`,handleDelete:()=>u(s),role:t},d))})]})})})})]}),e.jsx(O,{show:j,onClose:()=>n(!1),children:e.jsxs("form",{onSubmit:w,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 text-center",children:f}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(z,{onClick:()=>n(!1),children:"Batal"}),e.jsx(J,{className:"ms-3",disabled:v,children:"Hapus"})]})]})})]})}U.layout=t=>e.jsx(_,{header:e.jsx(B,{children:"Data Kontak"}),children:t,user:t.props.auth.user,organization:t.props.organization,title:"Data Kontak",backLink:e.jsx(l,{href:route("data-master",t.props.organization.id),children:e.jsx(A,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(l,{href:route("data-master",t.props.organization.id),children:"Data Master"})}),e.jsx("li",{children:"Data Kontak"})]})}),role:t.props.role});export{U as default};