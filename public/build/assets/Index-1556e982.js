import{r as n,W as Y,y as q,j as e,Y as G,a as u}from"./app-60093d8b.js";import{A as J}from"./AuthenticatedLayout-f4603aa5.js";import{H as X}from"./Header-fccd1917.js";import{k as Z,Q as c}from"./react-toastify.esm-43511348.js";/* empty css                      */import{I as j,a as f,b as ee,c as ae}from"./index.esm-53cbca2f.js";import{A as se}from"./AddButtonMobile-285c64a9.js";import{M as _}from"./Modal-0ea8f24a.js";import{S as E}from"./SecondaryButton-a2ff8619.js";import{P as M}from"./PrimaryButton-bffcd700.js";import{u as te,o as le}from"./index.module-dbb0b5e9.js";import{C as re}from"./ContainerDesktop-99c6f4c3.js";import{C as ie,T as ne,a as ce}from"./ContentDesktop-48089c34.js";import{T as oe,P as de}from"./TitleMobile-471fc2f0.js";import{D as me}from"./DangerButton-179850f6.js";import ue from"./StudentEntryPaymentCategoryMobile-f60fd2a9.js";import he from"./StudentEntryPaymentCategoryDesktop-f6eff142.js";import{I as B}from"./InputLabel-fb90ae77.js";import{T as $}from"./TextInput-e2aade7c.js";import{N as xe}from"./react-number-format.es-01a5d405.js";import"./ApplicationLogo-07518b23.js";import"./iconBase-bb6eae91.js";import"./transition-69a0c110.js";import"./dayjs.min-af66fe14.js";import"./keyboard-8f7a194a.js";import"./formatNumber-b542c689.js";import"./BadgeDanger-411ae170.js";import"./BadgeSuccess-a4da988e.js";function pe({role:l,organization:o,studentPaymentCategories:s,searchFilter:R}){n.useState(!1);const[C,h]=n.useState(!1),[O,m]=n.useState(!1),[v,b]=n.useState({title:"",submit:""}),[y,g]=n.useState(!1),[r,S]=n.useState(R||""),[F,A]=n.useState(""),{data:d,setData:x,post:P,patch:K,processing:w,errors:i,reset:p,delete:U,setError:k}=Y({id:null,name:"",value:0,is_active:!0}),H=te(r),[L]=le(r,500);n.useEffect(()=>{H!==void 0&&V()},[L]);const V=()=>{q.reload({only:["studentPaymentCategories"],data:{search:r}})},D=a=>{A(`Hapus Rincian Biaya Masuk ${a.name} ?`),h(!0),x("id",a.id)},z=a=>{a.preventDefault(),y?K(route("data-master.student-entry-payment-category.update",{organization:o.id,studentEntryPaymentCategory:d.id}),{onSuccess:({props:t})=>{const{flash:N}=t;c.success(N.success,{position:c.POSITION.TOP_CENTER}),m(!1),p()},onError:t=>{console.log(t)}}):P(route("data-master.student-entry-payment-category.store",o.id),{onSuccess:({props:t})=>{const{flash:N}=t;c.success(N.success,{position:c.POSITION.TOP_CENTER}),m(!1),p()},onError:t=>{console.log(t)}})},Q=a=>{const{value:t}=a;x("value",t)},W=a=>{a.preventDefault(),U(route("data-master.student-entry-payment-category.destroy",{organization:o.id,studentEntryPaymentCategory:d.id}),{onSuccess:()=>{h(!1),c.success("Rincian Biaya Masuk Berhasil Dihapus",{position:c.POSITION.TOP_CENTER}),p()},onError:t=>{h(!1),c.error(t.message,{position:c.POSITION.TOP_CENTER})}})},I=()=>{p(),g(!1),b({title:"Tambah Kategori",submit:"Tambah"}),k("name",""),m(!0)},T=a=>{g(!0),k("name",""),m(!0),b({title:"Ubah Kategori",submit:"Ubah"}),x({id:a.id,name:a.name,is_active:a.is_active,value:a.value})};return e.jsxs(e.Fragment,{children:[e.jsx(G,{title:"Data Rincian Biaya Masuk"}),e.jsx(Z,{}),l!=="viewer"&&e.jsx(se,{label:"Tambah",handleShowInputModal:I}),e.jsx(oe,{zIndex:"z-50",search:r,setSearch:a=>S(a.target.value),pageBefore:s.links[0].url?e.jsx(u,{href:`/data-master/${o.id}/student-entry-payment-category?page=${s.current_page-1}&search=${r}`,preserveState:!0,only:["studentPaymentCategories"],children:e.jsx(j,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(j,{})}),pageAfter:s.links[s.links.length-1].url?e.jsx(u,{href:`/data-master/${o.id}/student-entry-payment-category?page=${s.current_page+1}&search=${r}`,only:["studentPaymentCategories"],preserveState:!0,children:e.jsx(f,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(f,{})}),page:e.jsxs(e.Fragment,{children:[s.current_page,"/",s.last_page]}),data:s}),e.jsx(ie,{children:s.data.map(a=>e.jsx(ue,{category:a,handleDelete:()=>D(a),handleEdit:()=>T(a),role:l},a.id))}),e.jsxs(re,{children:[e.jsxs(ne,{children:[e.jsx("div",{className:"my-auto w-7/12",children:l!=="viewer"&&e.jsx("div",{className:"space-x-2",children:e.jsx(M,{className:"py-3",onClick:I,children:"Tambah Data"})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(ee,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Rincian Biaya Masuk",className:"w-full border-none focus:outline-none focus:ring-0",value:r||"",onChange:a=>S(a.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(de,{data:s})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:s.links[0].url?e.jsx(u,{href:`/admin/data-master/${o.id}/student-entry-payment-category?page=${s.current_page-1}&search=${r}`,preserveState:!0,only:["studentPaymentCategories"],children:e.jsx(j,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(j,{})})}),e.jsxs("div",{className:"my-auto",children:[s.current_page,"/",s.last_page]}),e.jsx("div",{className:"my-auto",children:s.links[s.links.length-1].url?e.jsx(u,{href:`/admin/data-master/${o.id}/student-entry-payment-category?page=${s.current_page+1}&search=${r}`,only:["studentPaymentCategories"],preserveState:!0,children:e.jsx(f,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(f,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(ce,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Nama Kategori"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Nilai (Default)"}),e.jsx("th",{className:"bg-gray-200 text-center",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:s.data.map((a,t)=>e.jsx(he,{category:a,className:`${t%2==0&&"bg-gray-100"}`,handleDelete:()=>D(a),handleEdit:()=>T(a),role:l},t))})]})})})})]}),e.jsx(_,{show:O,onClose:()=>m(!1),children:e.jsxs("form",{onSubmit:z,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 border-b-2 py-1",children:v.title}),e.jsxs("div",{className:"mt-5 space-y-5",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(B,{htmlFor:"name",value:"Nama Kategori",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx($,{id:"name",type:"text",name:"name",value:d.name,className:`mt-1 w-full ${i&&i.name&&"border-red-500"}`,isFocused:!0,onChange:a=>x("name",a.target.value.toUpperCase()),placeholder:"Nama Kategori"}),i&&i.name&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:i.name})})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(B,{htmlFor:"name",value:"Nilai (Default)",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx(xe,{value:d.value,customInput:$,onValueChange:a=>Q(a),thousandSeparator:!0,className:"text-end w-full border",prefix:"IDR "}),i&&i.name&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:i.name})})]})]}),y&&e.jsx("div",{className:"w-1/6 mt-5",children:e.jsx("div",{className:"form-control ",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"is_active",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"is_active",value:d.is_active,onChange:()=>x("is_active",!d.is_active),checked:d.is_active}),e.jsx("span",{className:"label-text font-bold",children:"Aktif"})]})})})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(E,{onClick:a=>m(!1),children:"Batal"}),e.jsx(M,{className:"ms-3",disabled:w,children:v.submit})]})]})}),e.jsx(_,{show:C,onClose:()=>h(!1),children:e.jsxs("form",{onSubmit:W,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 text-center",children:F}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(E,{onClick:()=>h(!1),children:"Batal"}),e.jsx(me,{className:"ms-3",disabled:w,children:"Hapus"})]})]})})]})}pe.layout=l=>e.jsx(J,{header:e.jsx(X,{children:"Data Rincian Biaya Masuk"}),children:l,user:l.props.auth.user,organization:l.props.organization,title:"Data Rincian Biaya Masuk",backLink:e.jsx(u,{href:route("data-master",l.props.organization.id),children:e.jsx(ae,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(u,{href:route("data-master",l.props.organization.id),children:"Data Master"})}),e.jsx("li",{children:"Data Rincian Biaya Masuk"})]})}),role:l.props.role});export{pe as default};