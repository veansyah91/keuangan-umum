import{r,W as R,y as V,j as e,Y as W,a as l}from"./app-09a58158.js";import{D as K,A as L}from"./AuthenticatedLayout-95496b06.js";import{H as U}from"./Header-bfa9803f.js";import{I as h,a as m,k as Y,b as $,c as q}from"./index.esm-99f8d854.js";import{k as G}from"./react-toastify.esm-47138706.js";import{T as J,a as Q,P as X,C as Z}from"./ContentDesktop-806e67b1.js";import{C as ee}from"./ContainerDesktop-796b0bb2.js";import ae from"./WhatsappInvoiceDesktop-8a36eea9.js";import{P as p}from"./PrimaryButton-77adf617.js";import{M as N}from"./Modal-56e74306.js";import{f as se}from"./formatNumber-b542c689.js";import{S as y}from"./SecondaryButton-d5976287.js";import{o as w,u as te}from"./index.module-3deb1f17.js";import"./ApplicationLogo-71780ae1.js";import"./iconBase-0a2c1025.js";import"./transition-834a9f2b.js";/* empty css                      */import"./dayjs.min-62ab8c49.js";import"./index.esm-fbda6ebc.js";import"./portal-1b1e2576.js";import"./close-provider-12aa8b6e.js";function re({organizations:u,invoices:s,searchFilter:b,searchOrganization:S,productFilter:k,statusFilter:I}){const[D,n]=r.useState(!1),[t,j]=r.useState(b||""),[P,x]=r.useState(!1),{data:i,setData:_,processing:g,patch:C,errors:le}=R({id:null,no_ref:"",organization_name:"",product:"",price:0}),[d,f]=r.useState({status:I||"",product:k||""}),[c,B]=r.useState({startDate:"",endDate:""}),[F]=w(t,500),[z]=w(c,500),M=te(t),[T,ne]=r.useState("");r.useState(S||""),r.useEffect(()=>{M!==void 0&&v()},[F,z]);const O=a=>{B(a)},v=()=>{V.reload({only:["invoices"],data:{search:t,start_date:c.startDate,end_date:c.endDate,status:d.status,product:d.product,organization_id:T.id}})},A=a=>{a.preventDefault(),n(!1),v()},H=a=>{x(!0),_({id:a.id,no_ref:a.no_ref,organization:a.organization.name,product:a.product,price:a.price})},E=a=>{a.preventDefault(),C(route("admin.add-ons.whatsapp.invoice.confirmation",{invoice:i.id}),{onSuccess:({props:o})=>{console.log(o)}})};return e.jsxs(e.Fragment,{children:[e.jsx(W,{title:"Invoice Whatsapp Plugins"}),e.jsx(G,{}),e.jsx(J,{data:s,zIndex:"z-50",search:t,setSearch:a=>j(a.target.value),pageBefore:s.links[0].url?e.jsx(l,{href:route("admin.add-ons.whatsapp.invoice",{page:s.current_page-1,search:t}),preserveState:!0,only:["invoices"],children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})}),pageAfter:s.links[s.links.length-1].url?e.jsx(l,{href:route("admin.add-ons.whatsapp.invoice",{page:s.current_page+1,search:t}),only:["invoices"],preserveState:!0,children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})}),page:e.jsxs(e.Fragment,{children:[s.current_page,"/",s.last_page]}),invoice:s,hasFilter:!0,showFilter:()=>n(!0),hasDate:!1}),e.jsxs(ee,{children:[e.jsxs(Q,{children:[e.jsx("div",{className:"my-auto w-5/12"}),e.jsxs("div",{className:"my-auto w-4/12 flex gap-5 justify-end",children:[e.jsx("button",{className:"py-2 px-3 border rounded-lg",onClick:()=>n(!0),children:e.jsx(Y,{})}),e.jsx(K,{value:c,onChange:O,showShortcuts:!0,configs:{shortcuts:{today:"Hari Ini",yesterday:"Kemarin",past:a=>`${a} Hari Terakhir`,currentMonth:"Bulan Ini",pastMonth:"Bulan Lalu",currentYear:"Tahun Ini"}},separator:"s.d"})]}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx($,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Invoice",className:"w-full border-none focus:outline-none focus:ring-0",value:t||"",onChange:a=>j(a.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(X,{data:s})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:s.links[0].url?e.jsx(l,{href:route("admin.add-ons.whatsapp.invoice",{page:s.current_page-1,search:t}),preserveState:!0,only:["invoices"],children:e.jsx(h,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(h,{})})}),e.jsxs("div",{className:"my-auto",children:[s.current_page,"/",s.last_page]}),e.jsx("div",{className:"my-auto",children:s.links[s.links.length-1].url?e.jsx(l,{href:route("admin.add-ons.whatsapp.invoice",{page:s.current_page+1,search:t}),only:["invoices"],preserveState:!0,children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(Z,{children:e.jsxs("table",{className:"table table-sm table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Organisasi"}),e.jsx("th",{className:"bg-gray-200",children:"Tanggal Pembuatan"}),e.jsx("th",{className:"bg-gray-200",children:"No. Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Produk"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Harga"}),e.jsx("th",{className:"bg-gray-200 text-center",children:"Status"}),e.jsx("th",{className:"bg-gray-200 text-end"})]})}),e.jsx("tbody",{children:s.data.map((a,o)=>e.jsx(ae,{invoice:a,className:`${o%2!==0&&"bg-gray-100"}`,handleEdit:()=>H(a)},o))})]})})})})]}),e.jsx(N,{show:P,onClose:()=>x(!1),children:e.jsxs("form",{onSubmit:E,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Konfirmasi Pembayaran Invoice Whatsapp Broadcasting"}),e.jsxs("div",{className:"mt-6 ",children:[e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("div",{className:"w-1/4 flex justify-between",children:[e.jsx("div",{children:"No Ref"}),e.jsx("div",{children:":"})]}),e.jsx("div",{className:"w-3/4",children:i.no_ref})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("div",{className:"w-1/4 flex justify-between",children:[e.jsx("div",{children:"Organisasi"}),e.jsx("div",{children:":"})]}),e.jsx("div",{className:"w-3/4",children:i.organization})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("div",{className:"w-1/4 flex justify-between",children:[e.jsx("div",{children:"Produk"}),e.jsx("div",{children:":"})]}),e.jsx("div",{className:"w-3/4",children:i.product})]}),e.jsxs("div",{className:"flex gap-2",children:[e.jsxs("div",{className:"w-1/4 flex justify-between",children:[e.jsx("div",{children:"Harga"}),e.jsx("div",{children:":"})]}),e.jsxs("div",{className:"w-3/4",children:["IDR. ",se(i.price)]})]})]}),e.jsxs("div",{className:"mt-6 flex sm:flex-row flex-col-reverse gap-2 sm:gap-0 sm:justify-end",children:[e.jsx(y,{onClick:()=>x(!1),children:e.jsx("div",{className:"w-full",children:"Batal"})}),e.jsx(p,{className:"sm:hidden",disabled:g,children:e.jsx("div",{className:"w-full",children:"Konfirmasi Pembayaran"})}),e.jsx(p,{className:"ms-3 hidden sm:block",disabled:g,children:"Konfirmasi Pembayaran"})]})]})}),e.jsx(N,{show:D,onClose:()=>n(!1),children:e.jsxs("form",{onSubmit:A,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Organisasi"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Status"}),e.jsx("div",{className:"w-8/12",children:e.jsxs("select",{className:"w-full rounded-lg border-gray-300",onChange:a=>f({status:a.target.value}),value:d.status,children:[e.jsx("option",{value:"",children:"Semua"}),e.jsx("option",{value:"pending",children:"Menunggu"}),e.jsx("option",{value:"paid",children:"Lunas"}),e.jsx("option",{value:"canceled",children:"Batal"})]})}),e.jsx("div",{className:"w-1/12 my-auto"})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Produk"}),e.jsx("div",{className:"w-8/12",children:e.jsxs("select",{className:"w-full rounded-lg border-gray-300",onChange:a=>f({product:a.target.value}),value:d.product,children:[e.jsx("option",{value:"",children:"Semua"}),e.jsx("option",{value:"Bulanan",children:"Bulanan"}),e.jsx("option",{value:"Tahunan",children:"Tahunan"})]})}),e.jsx("div",{className:"w-1/12 my-auto"})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(y,{onClick:()=>n(!1),children:"Batal"}),e.jsx(p,{className:"ms-3",children:"Filter"})]})]})})]})}re.layout=u=>e.jsx(L,{header:e.jsx(U,{children:"Invoice"}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(l,{href:route("admin.add-ons"),children:"Addons"})}),e.jsx("li",{className:"font-bold",children:e.jsx(l,{href:route("admin.add-ons.whatsapp"),children:"Whatsapp Broadcasting Addons"})}),e.jsx("li",{children:"Invoice"})]})}),backLink:e.jsx(l,{href:route("admin.add-ons.whatsapp"),children:e.jsx(q,{})}),children:u,user:u.props.auth.user,title:"Invoice"});export{re as default};