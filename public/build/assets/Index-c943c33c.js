import{r as l,W as ie,y as ne,j as e,Y as de,a as i}from"./app-18d344c6.js";import{D as ce,A as me}from"./AuthenticatedLayout-f72ab3d2.js";import{H as he}from"./Header-d3a5ebd0.js";import{C as xe}from"./ContainerDesktop-a963213b.js";import{I as u,a as p,k as ue,b as pe,t as f,c as je}from"./index.esm-11facade.js";import{k as fe,Q as j}from"./react-toastify.esm-14a132f8.js";import{A as ge}from"./AddButtonMobile-7d02fc0e.js";import{T as Ne,a as ve,P as be,C as ye}from"./ContentDesktop-2363a64a.js";import{a as T,u as we}from"./index.module-26577e4e.js";import{C as Se}from"./ContentMobile-c28a7f05.js";import{P as B}from"./PrimaryButton-74e4339d.js";import De from"./CashOutMobile-7a097fc3.js";import Ce from"./CashOutDesktop-97574813.js";import{M as E}from"./Modal-fb9ed9d2.js";import{S as M}from"./SecondaryButton-8f498461.js";import{D as ke}from"./DangerButton-25cd26be.js";import{C as g}from"./ClientSelectInput-b1029be2.js";import"./ApplicationLogo-782d5a75.js";import"./iconBase-4b51c5f1.js";import"./transition-27a0ae6f.js";/* empty css                      */import"./dayjs.min-3c5969fb.js";import"./formatNumber-b542c689.js";import"./BadgeSecondary-2a71d624.js";import"./BadgeSuccess-9c950b8a.js";import"./portal-3e1f6179.js";import"./close-provider-98abf862.js";import"./combobox-36f8eaff.js";function _e({cashOuts:s,startDate:H,endDate:A,role:h,organization:n,searchFilter:R,isApproved:z,projects:N,programs:v,departments:b,flash:Pe}){const[V,d]=l.useState(!1),[$,c]=l.useState(!1),[t,y]=l.useState(R||""),[L]=T(t,500),[r,o]=l.useState({is_approved:z||void 0,project:null,program:null,department:null}),[w,S]=l.useState({id:null,name:"",code:""}),[D,C]=l.useState({id:null,name:"",code:""}),[k,_]=l.useState({id:null,name:"",code:""}),[Y,Q]=l.useState({title:""}),{data:W,setData:q,delete:G,errors:Fe,setError:Ke,processing:J,reset:P}=ie({id:null,no_ref:""}),[m,U]=l.useState({startDate:H||"",endDate:A||""}),[X]=T(m,500),Z=we(t);l.useEffect(()=>{Z!==void 0&&F()},[L,X]);const F=()=>{ne.reload({only:["cashOuts"],data:{search:t,start_date:m.startDate,end_date:m.endDate,is_approved:r.is_approved,program:r.program,project:r.project,department:r.department},preserveState:!0})},O=a=>{S(a),o({...r,program:a.id})},ee=()=>{S({id:null,name:"",code:""}),o({...r,program:null})},ae=a=>{C(a),o({...r,project:a.id})},se=()=>{C({id:null,name:"",code:""}),o({...r,project:null})},re=a=>{_(a),o({...r,department:a.id})},le=()=>{_({id:null,name:"",code:""}),o({...r,department:null})},K=a=>{U(a)},I=a=>{Q({title:`Hapus Data Kas Keluar No Ref ${a.no_ref}`}),q({id:a.id,no_ref:a.no_ref}),c(!0)},te=a=>{a.preventDefault(),F(),d(!1)},oe=a=>{a.preventDefault(),G(route("cashflow.cash-out.delete",{organization:n.id,cashOut:W.id}),{onSuccess:()=>{P(),j.success("Kas Keluar Berhasil Dihapus",{position:j.POSITION.TOP_CENTER}),c(!1)},onError:x=>{P(),j.error(x.error,{position:j.POSITION.TOP_CENTER}),c(!1)}})};return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:"Kas Keluar"}),e.jsx(fe,{}),h!=="viewer"&&e.jsx(i,{href:route("cashflow.cash-out.create",n.id),children:e.jsx(ge,{label:"Tambah"})}),e.jsx(Ne,{zIndex:"z-50",search:t,setSearch:a=>y(a.target.value),pageBefore:s.links[0].url?e.jsx(i,{href:route("cashflow.cash-out",{organization:n.id,page:s.current_page-1,search:t}),preserveState:!0,only:["cashOuts"],children:e.jsx(u,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(u,{})}),pageAfter:s.links[s.links.length-1].url?e.jsx(i,{href:route("cashflow.cash-out",{organization:n.id,page:s.current_page+1,search:t}),only:["cashOuts"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})}),page:e.jsxs(e.Fragment,{children:[s.current_page,"/",s.last_page]}),data:s,hasFilter:!0,showFilter:()=>d(!0),hasDate:!0,dateValue:m,onChangeDate:K}),e.jsx(Se,{children:s.data.map(a=>e.jsx(De,{cashOut:a,handleDelete:()=>I(a),role:h},a.id))}),e.jsxs(xe,{children:[e.jsxs(ve,{children:[e.jsx("div",{className:"my-auto w-5/12",children:h!=="viewer"&&e.jsx(i,{href:route("cashflow.cash-out.create",n.id),children:e.jsx(B,{className:"py-3",children:"Tambah Data"})})}),e.jsxs("div",{className:"my-auto w-4/12 flex gap-5",children:[e.jsx("button",{className:"py-2 px-3 border rounded-lg",onClick:()=>d(!0),children:e.jsx(ue,{})}),e.jsx(ce,{value:m,onChange:K,showShortcuts:!0,configs:{shortcuts:{today:"Hari Ini",yesterday:"Kemarin",past:a=>`${a} Hari Terakhir`,currentMonth:"Bulan Ini",pastMonth:"Bulan Lalu",currentYear:"Tahun Ini"}},separator:"s.d"})]}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(pe,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Kas Keluar",className:"w-full border-none focus:outline-none focus:ring-0",value:t||"",onChange:a=>y(a.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(be,{data:s})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:s.links[0].url?e.jsx(i,{href:route("cashflow.cash-out",{organization:n.id,page:s.current_page-1,search:t}),preserveState:!0,only:["cashOuts"],children:e.jsx(u,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(u,{})})}),e.jsxs("div",{className:"my-auto",children:[s.current_page,"/",s.last_page]}),e.jsx("div",{className:"my-auto",children:s.links[s.links.length-1].url?e.jsx(i,{href:route("cashflow.cash-out",{organization:n.id,page:s.current_page+1,search:t}),only:["cashOuts"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(ye,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Tanggal"}),e.jsx("th",{className:"bg-gray-200",children:"No. Ref"}),e.jsx("th",{className:"bg-gray-200",children:"Nama"}),e.jsx("th",{className:"bg-gray-200",children:"Deskripsi"}),e.jsx("th",{className:"bg-gray-200 text-end",children:"Nilai"}),e.jsx("th",{className:"bg-gray-200 text-center",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:s.data.map((a,x)=>e.jsx(Ce,{cashOut:a,className:`${x%2==0&&"bg-gray-100"}`,handleDelete:()=>I(a),role:h},x))})]})})})})]}),e.jsx(E,{show:V,onClose:()=>d(!1),children:e.jsxs("form",{onSubmit:te,className:"p-6",id:"filter",name:"filter",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Kas Keluar"}),e.jsxs("div",{className:"mt-6 ",children:[e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-1/4 my-auto font-bold",children:"Status"}),e.jsxs("div",{className:"w-3/4 flex",children:[e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer space-x-2",htmlFor:"all",children:[e.jsx("input",{type:"radio",name:"all",className:"radio radio-rimary",onChange:()=>o({...r,is_approved:void 0}),id:"all",checked:r.is_approved==null}),e.jsx("span",{className:"label-text",children:"Semua"})]})}),e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer space-x-2",htmlFor:"approved",children:[e.jsx("input",{type:"radio",name:"approved",className:"radio radio-rimary",onChange:()=>o({...r,is_approved:!0}),id:"approved",checked:r.is_approved===!0}),e.jsx("span",{className:"label-text",children:"Diterima"})]})}),e.jsx("div",{className:"form-control",children:e.jsxs("label",{className:"label cursor-pointer space-x-2",htmlFor:"draft",children:[e.jsx("input",{type:"radio",name:"draft",className:"radio radio-rimary",onChange:()=>o({...r,is_approved:!1}),id:"draft",checked:r.is_approved===!1}),e.jsx("span",{className:"label-text",children:"Draft"})]})})]})]}),v.length>0&&e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-3/12 my-auto font-bold",children:"Program"}),e.jsxs("div",{className:"w-full sm:w-9/12 flex",children:[e.jsx("div",{className:"w-10/12",children:e.jsx(g,{resources:v,selected:w,setSelected:a=>O(a),maxHeight:"max-h-40",placeholder:"Cari Program",isError:!1,id:"program"})}),e.jsx("div",{className:"w-2/12 my-auto",children:w.id&&e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:ee,children:e.jsx(f,{})})})]})]}),N.length>0&&e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-3/12 my-auto font-bold",children:"Proyek"}),e.jsxs("div",{className:"w-full sm:w-9/12 flex",children:[e.jsx("div",{className:"w-10/12",children:e.jsx(g,{resources:N,selected:D,setSelected:a=>ae(a),maxHeight:"max-h-40",placeholder:"Cari Project",isError:!1,id:"project"})}),e.jsx("div",{className:"w-2/12 my-auto",children:D.id&&e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:se,children:e.jsx(f,{})})})]})]}),b.length>0&&e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"w-full sm:w-3/12 my-auto font-bold",children:"Departemen"}),e.jsxs("div",{className:"w-full sm:w-9/12 flex",children:[e.jsx("div",{className:"w-10/12",children:e.jsx(g,{resources:b,selected:k,setSelected:a=>re(a),maxHeight:"max-h-40",placeholder:"Cari Departemen",isError:!1,id:"department"})}),e.jsx("div",{className:"w-2/12 my-auto",children:k.id&&e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:le,children:e.jsx(f,{})})})]})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(M,{onClick:()=>d(!1),children:"Batal"}),e.jsx(B,{className:"ms-3",children:"Filter"})]})]})}),e.jsx(E,{show:$,onClose:()=>c(!1),children:e.jsxs("form",{onSubmit:oe,className:"p-6",id:"deleteForm",name:"deleteForm",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 text-center",children:Y.title}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(M,{onClick:()=>c(!1),children:"Batal"}),e.jsx(ke,{className:"ms-3",disabled:J,children:"Hapus"})]})]})})]})}_e.layout=s=>e.jsx(me,{header:e.jsx(he,{children:"Kas Keluar"}),children:s,user:s.props.auth.user,organization:s.props.organization,title:"Kas Keluar",backLink:e.jsx(i,{href:route("cashflow",s.props.organization.id),children:e.jsx(je,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(i,{href:route("cashflow",s.props.organization.id),children:"Arus Kas"})}),e.jsx("li",{children:"Kas Keluar"})]})}),role:s.props.role});export{_e as default};