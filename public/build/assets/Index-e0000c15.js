import{r as m,W as X,y as Z,j as e,Y as ee,a as h}from"./app-68378a75.js";import{A as se}from"./AuthenticatedLayout-aa84864c.js";import{H as ae}from"./Header-d9b20899.js";import{k as le,Q as c}from"./react-toastify.esm-f59b1f4b.js";/* empty css                      */import{I as y,a as w,b as te,c as ie}from"./index.esm-023a1d14.js";import{A as re}from"./AddButtonMobile-d4caccd9.js";import{M as g}from"./Modal-99749734.js";import{S}from"./SecondaryButton-40901484.js";import{P as A}from"./PrimaryButton-98341e8c.js";import{u as de,o as ne}from"./index.module-29cbd6cc.js";import{C as oe}from"./ContainerDesktop-555453f0.js";import{T as me,C as ce,a as xe,P as he,b as fe}from"./ContentDesktop-c479b297.js";import{D as pe}from"./DangerButton-ce97104c.js";import ue from"./StaffMobile-b7fcf188.js";import je from"./StaffDesktop-8ba9fac3.js";import{I as x}from"./InputLabel-8493eb3f.js";import{T as p}from"./TextInput-3adfab26.js";import{d as Ne}from"./dayjs.min-c779e003.js";import{B as ve}from"./BadgeSuccess-40175e0c.js";import{B as ye}from"./BadgeDanger-9116da4e.js";import{S as we}from"./SuccessButton-ab59517a.js";import"./ApplicationLogo-10150e9c.js";import"./iconBase-f8c3c84d.js";import"./transition-a4e373a4.js";import"./portal-ab6e9e20.js";import"./close-provider-c8aabbb8.js";import"./formatNumber-b542c689.js";const _=()=>{const i=Ne().year(),n=i-20;let l=[];for(let u=n;u<i+1;u++)l=[...l,u];return l};function be({role:i,organization:n,contacts:l,category:u,searchFilter:U}){m.useState(!1);const[$,j]=m.useState(!1),[H,b]=m.useState(!1),[L,f]=m.useState(!1),[k,C]=m.useState({title:"",submit:""}),[D,I]=m.useState(!1),[o,T]=m.useState(U||""),[R,z]=m.useState(""),{data:t,setData:d,post:V,patch:Y,processing:P,errors:a,reset:v,delete:J,setError:E}=X({id:null,name:"",phone:"",address:"",description:"",no_ref:"",position:"",entry_year:_()[20],category:u.id}),Q=de(o),[W]=ne(o,500);m.useEffect(()=>{Q!==void 0&&q()},[W]);const q=()=>{Z.reload({only:["contacts"],data:{search:o}})},M=s=>{z(`Hapus Data Staff ${s.name} ?`),j(!0),d("id",s.id)},G=s=>{s.preventDefault(),D?Y(route("data-master.staff.update",{organization:n.id,contact:t.id}),{onSuccess:({props:r})=>{const{flash:N}=r;c.success(N.success,{position:c.POSITION.TOP_CENTER}),f(!1),v()},onError:r=>{console.log(r)}}):V(route("data-master.staff.store",n.id),{onSuccess:({props:r})=>{const{flash:N}=r;c.success(N.success,{position:c.POSITION.TOP_CENTER}),f(!1),v()},onError:r=>{console.log(r)}})},K=s=>{s.preventDefault(),J(route("data-master.staff.destroy",{organization:n.id,contact:t.id}),{onSuccess:({props:r})=>{const{flash:N}=r;c.success(N.success,{position:c.POSITION.TOP_CENTER}),j(!1),v()},onError:r=>{j(!1),c.error(r.message,{position:c.POSITION.TOP_CENTER})}})},B=()=>{v(),I(!1),C({title:"Tambah Staf",submit:"Tambah"}),E("name",""),f(!0)},F=s=>{console.log(s),b(!0),d({id:s.id,name:s.name,is_active:s.is_active>0,phone:s.phone||"",address:s.address||"",description:s.description||"",no_ref:s.staff.no_ref||"",position:s.staff.position||"",entry_year:s.staff.entry_year||""})},O=s=>{I(!0),E("name",""),f(!0),C({title:"Ubah Staf",submit:"Ubah"}),d({id:s.id,name:s.name,is_active:s.is_active>0,phone:s.phone||"",address:s.address||"",description:s.description||"",no_ref:s.staff.no_ref||"",position:s.staff.position||"",entry_year:s.staff.entry_year||_()[20]})};return e.jsxs(e.Fragment,{children:[e.jsx(ee,{title:"Data Staf"}),e.jsx(le,{}),i!=="viewer"&&e.jsx(re,{label:"Tambah",handleShowInputModal:B}),e.jsx(me,{zIndex:"z-50",search:o,setSearch:s=>T(s.target.value),pageBefore:l.links[0].url?e.jsx(h,{href:route("data-master.staff",{organization:n.id,page:l.current_page-1,search:o}),preserveState:!0,only:["contacts"],children:e.jsx(y,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(y,{})}),pageAfter:l.links[l.links.length-1].url?e.jsx(h,{href:route("data-master.staff",{organization:n.id,page:l.current_page+1,search:o}),only:["contacts"],preserveState:!0,children:e.jsx(w,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(w,{})}),page:e.jsxs(e.Fragment,{children:[l.current_page,"/",l.last_page]}),data:l}),e.jsx(ce,{children:l.data.map(s=>e.jsx(ue,{contact:s,handleDelete:()=>M(s),handleEdit:()=>O(s),handleShow:()=>F(s),role:i},s.id))}),e.jsxs(oe,{children:[e.jsxs(xe,{children:[e.jsx("div",{className:"my-auto w-7/12",children:i!=="viewer"&&e.jsxs("div",{className:"space-x-2",children:[e.jsx(A,{className:"py-3",onClick:B,children:"Tambah Data"}),e.jsx(h,{href:route("data-master.staff.import",n.id),children:e.jsx(we,{className:"py-3",children:"Import Data (.csv)"})})]})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(te,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Staf",className:"w-full border-none focus:outline-none focus:ring-0",value:o||"",onChange:s=>T(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(he,{data:l})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:l.links[0].url?e.jsx(h,{href:route("data-master.staff",{organization:n.id,page:l.current_page-1,search:o}),preserveState:!0,only:["contacts"],children:e.jsx(y,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(y,{})})}),e.jsxs("div",{className:"my-auto",children:[l.current_page,"/",l.last_page]}),e.jsx("div",{className:"my-auto",children:l.links[l.links.length-1].url?e.jsx(h,{href:route("data-master.staff",{organization:n.id,page:l.current_page+1,search:o}),only:["contacts"],preserveState:!0,children:e.jsx(w,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(w,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(fe,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Nama Staf"}),e.jsx("th",{className:"bg-gray-200",children:"Posisi"}),e.jsx("th",{className:"bg-gray-200",children:"Tahun Masuk"}),e.jsx("th",{className:"bg-gray-200",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:l.data.map((s,r)=>e.jsx(je,{contact:s,className:`${r%2==0&&"bg-gray-100"}`,handleDelete:()=>M(s),handleEdit:()=>O(s),handleShow:()=>F(s),role:i},r))})]})})})})]}),e.jsx(g,{show:L,onClose:()=>f(!1),children:e.jsxs("form",{onSubmit:G,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 border-b-2 py-1",children:k.title}),e.jsxs("div",{className:"mt-5 space-y-5 overflow-y-auto h-[400px]",id:"body-input",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{htmlFor:"name",value:"Nama Staf",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx(p,{id:"name",type:"text",name:"name",value:t.name,className:`mt-1 w-full ${a&&a.name&&"border-red-500"}`,isFocused:!0,onChange:s=>d("name",s.target.value.toUpperCase()),placeholder:"Nama Staf"}),a&&a.name&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:a.name})})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"No. Handphone (opsional)",htmlFor:"phone",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(p,{id:"phone",name:"phone",className:`w-full ${(a==null?void 0:a.phone)&&"border-red-500"}`,placeholder:"08xxxxx / 62xxxxx",value:t.phone,onChange:s=>d("phone",s.target.value.toUpperCase())}),(a==null?void 0:a.phone)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.phone})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"Alamat (opsional)",htmlFor:"address",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(p,{id:"address",name:"address",className:`w-full ${(a==null?void 0:a.address)&&"border-red-500"}`,placeholder:"Alamat",value:t.address,onChange:s=>d("address",s.target.value.toUpperCase())}),(a==null?void 0:a.address)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.address})]})]}),e.jsx("div",{className:"text-center font-bold",children:"Detail Staf"}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"Tahun Masuk",htmlFor:"entry_year",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx("select",{className:"select select-bordered w-full",defaultValue:t.entry_year,onChange:s=>d("entry_year",parseInt(s.target.value)),id:"entry_year",children:_().map(s=>e.jsx("option",{children:s},s))}),(a==null?void 0:a.entry_year)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.entry_year})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"No Staf (opsional)",htmlFor:"no_ref",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(p,{id:"no_ref",name:"no_ref",className:`w-full ${(a==null?void 0:a.no_ref)&&"border-red-500"}`,placeholder:"No Staf",value:t.no_ref,onChange:s=>d("no_ref",s.target.value.toUpperCase())}),(a==null?void 0:a.no_ref)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.no_ref})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"Posisi (opsional)",htmlFor:"position",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(p,{id:"position",name:"position",className:`w-full ${(a==null?void 0:a.position)&&"border-red-500"}`,placeholder:"Posisi",value:t.position,onChange:s=>d("position",s.target.value.toUpperCase())}),(a==null?void 0:a.position)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.position})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1 mt-5 sm:mt-2",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(x,{value:"Informasi Tambahan (opsional)",htmlFor:"description",className:" mx-auto my-auto"})}),e.jsxs("div",{className:"w-full sm:w-2/3",children:[e.jsx(p,{id:"description",name:"description",className:`w-full ${(a==null?void 0:a.description)&&"border-red-500"}`,placeholder:"Informasi Tambahan",value:t.description,onChange:s=>d("description",s.target.value.toUpperCase())}),(a==null?void 0:a.description)&&e.jsx("span",{className:"text-red-500 text-xs",children:a.description})]})]}),D&&e.jsx("div",{className:"w-1/6 mt-5",children:e.jsx("div",{className:"form-control ",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"is_active",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"is_active",value:t.is_active,onChange:()=>d("is_active",!t.is_active),checked:t.is_active}),e.jsx("span",{className:"label-text font-bold",children:"Aktif"})]})})})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(S,{onClick:s=>f(!1),children:"Batal"}),e.jsx(A,{className:"ms-3",disabled:P,children:k.submit})]})]})}),e.jsx(g,{show:H,onClose:()=>b(!1),children:e.jsxs("div",{className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 border-b-2 py-1",children:"Detail Staff"}),e.jsxs("div",{className:"mt-5 space-y-5 overflow-y-auto h-[400px]",children:[e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Nama"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.name]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"No Staf"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.no_ref??"-"]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Jabatan"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.position]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Tahun Masuk"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.entry_year]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"No. Handphone"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.phone]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Alamat"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.address]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Informasi Lain"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.description]})]})}),e.jsx("div",{className:"sm:mx-auto px-3 sm:px-0 space-y-5",children:e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"sm:w-1/3 font-bold",children:"Status"}),e.jsxs("div",{className:"sm:w-2/3 flex gap-1",children:[e.jsx("span",{className:"hidden sm:block",children:":"}),t.is_active?e.jsx(ve,{children:"Aktif"}):e.jsx(ye,{children:"Tidak Aktif"})]})]})})]}),e.jsx("div",{className:"mt-6 flex justify-end",children:e.jsx(S,{onClick:s=>b(!1),children:"Batal"})})]})}),e.jsx(g,{show:$,onClose:()=>j(!1),children:e.jsxs("form",{onSubmit:K,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 text-center",children:R}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(S,{onClick:()=>j(!1),children:"Batal"}),e.jsx(pe,{className:"ms-3",disabled:P,children:"Hapus"})]})]})})]})}be.layout=i=>e.jsx(se,{header:e.jsx(ae,{children:"Data Staf"}),children:i,user:i.props.auth.user,organization:i.props.organization,title:"Data Staf",backLink:e.jsx(h,{href:route("data-master",i.props.organization.id),children:e.jsx(ie,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(h,{href:route("data-master",i.props.organization.id),children:"Data Master"})}),e.jsx("li",{children:"Data Staf"})]})}),role:i.props.role});export{be as default};