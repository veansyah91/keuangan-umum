import{r as t,W as X,y as j,j as e,Y as Z,a as n}from"./app-e9563627.js";import{A as ee}from"./AuthenticatedLayout-7672ecfe.js";import{H as ae}from"./Header-0a8198e9.js";import{I as d,a as m,h as se,b as te,f as k,c as re}from"./index.esm-9ad57f03.js";import{k as le,Q as C}from"./react-toastify.esm-d14c0da9.js";/* empty css                      */import{N as ne,a as ce}from"./NavgroupRegional-eba91054.js";import{T as ie,C as oe,a as de,P as me,b as he}from"./ContentDesktop-03f83212.js";import{M as I}from"./Modal-7fd7ebf9.js";import{S as D}from"./SecondaryButton-961c8d7d.js";import{P as f}from"./PrimaryButton-c99381a3.js";import xe from"./DistrictMobile-de94a0d6.js";import{a as g,u as ue}from"./index.module-862d5319.js";import{C as pe}from"./ContainerDesktop-e7daefaa.js";import je from"./DistrictDesktop-5b6788de.js";import{G as K}from"./GeneralSelectInput-edc1d081.js";import"./ApplicationLogo-46f56534.js";import"./iconBase-cf74823f.js";import"./transition-3412008e.js";import"./dayjs.min-a6718771.js";import"./formatNumber-b542c689.js";import"./portal-67fe3a42.js";import"./close-provider-bcf29e6f.js";import"./combobox-702c868f.js";function fe({districts:a,provinces:F,regencies:R,searchFilter:$,provinceFilter:M,regencyFilter:T}){t.useState(!1);const[_,c]=t.useState(!1),[B,i]=t.useState(!1),[l,v]=t.useState($||""),[E]=g(l,500),h=ue(l),[r,y]=t.useState(""),[x,N]=t.useState(M||""),[Q]=g(x,500),[o,b]=t.useState(""),[u,w]=t.useState(T||""),[O]=g(u,500),{data:ge,setData:q,post:A,progress:p,reset:H,processing:z}=X({district:""});t.useEffect(()=>{h!==void 0&&S()},[E]),t.useEffect(()=>{h!==void 0&&W()},[Q,r]),t.useEffect(()=>{h!==void 0&&Y()},[O,o,r]);const G=s=>{s.currentTarget.files&&q("district",s.currentTarget.files[0])},L=s=>{s.preventDefault(),A(route("admin.data-master.district.post"),{onSuccess:()=>{H(),c(!1),C.success("Kecamatan Berhasil Diimport",{position:C.POSITION.TOP_CENTER})}})},V=s=>{s.preventDefault(),i(!1),S()},S=()=>{j.reload({only:["districts"],data:{search:l,province:r.id,regency:o.id}})},W=()=>{j.reload({only:["provinces"],data:{searchProvince:x},preserveState:!0})},Y=()=>{j.reload({only:["regencies"],data:{searchRegency:u,province:r.id},preserveState:!0})},J=()=>{y(""),N("")},U=()=>{b(""),w("")};return e.jsxs(e.Fragment,{children:[e.jsx(Z,{title:"Data Kecamatan"}),e.jsx(le,{}),e.jsx("div",{className:"btm-nav sm:hidden",children:e.jsx(ne,{onClick:()=>c(!0)})}),e.jsx(ie,{zIndex:"z-50",search:l,setSearch:s=>v(s.target.value),pageBefore:a.links[0].url?e.jsx(n,{href:`/admin/data-master/districts?page=${a.current_page-1}&search=${l}`,preserveState:!0,children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/districts?page=${a.current_page+1}&search=${l}`,only:["districts"],preserveState:!0,children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a,hasFilter:!0,showFilter:()=>i(!0)}),e.jsx(oe,{children:a.data.map(s=>e.jsx(xe,{district:s},s.id))}),e.jsxs(pe,{children:[e.jsxs(de,{children:[e.jsx("div",{className:"my-auto w-6/12",children:e.jsx(f,{className:"py-3",onClick:()=>c(!0),children:"Import Kecamatan"})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx("button",{className:"p-3 border rounded-lg",onClick:()=>i(!0),children:e.jsx(se,{})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(te,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Kecamatan",className:"w-full border-none focus:outline-none focus:ring-0",value:l||"",onChange:s=>v(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(me,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(n,{href:`/admin/data-master/districts?page=${a.current_page-1}&search=${l}${r&&`&province=${r.id}`}`,only:["districts"],preserveState:!0,children:e.jsx(d,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(d,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/districts?page=${a.current_page+1}&search=${l}${r&&`&province=${r.id}`}
                                                            `,only:["districts"],preserveState:!0,children:e.jsx(m,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(m,{})})})]})]}),e.jsxs("div",{className:"sm:flex hidden gap-5",children:[e.jsx("div",{className:"w-11/12",children:e.jsx(he,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Kode"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kecamatan"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kabupaten"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Provinsi"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,P)=>e.jsx(je,{district:s,className:`${P%2==0&&"bg-gray-100"}`},P))})]})})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx(ce,{})})]})]}),e.jsx(I,{show:_,onClose:()=>c(!1),children:e.jsxs("form",{onSubmit:L,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Import Kecamatan"}),e.jsx("div",{className:"mt-6 ",children:e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"sm:w-1/4 w-full my-auto",children:"File Kecamatan"}),e.jsxs("div",{className:"sm:w-3/4 w-full",children:[e.jsx("input",{type:"file",className:"file-input file-input-bordered file-input-sm w-full",value:void 0,onChange:G}),p&&e.jsxs("progress",{value:p.percentage,max:"100",children:[p.percentage,"%"]})]})]})}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(D,{onClick:()=>c(!1),children:"Batal"}),e.jsx(f,{className:"ms-3",disabled:z,children:"Import"})]})]})}),e.jsx(I,{show:B,onClose:()=>i(!1),children:e.jsxs("form",{onSubmit:V,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Kecamatan"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Provinsi"}),e.jsx("div",{className:"w-8/12",children:e.jsx(K,{data:F,selected:r,setSelected:y,query:x,setQuery:N,maxHeight:"max-h-40",placeholder:"Cari Provinsi"})}),e.jsx("div",{className:"w-1/12 my-auto",children:r&&e.jsx("button",{className:"p-2",onClick:J,children:e.jsx(k,{})})})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Kabupaten / Kota"}),e.jsx("div",{className:"w-8/12",children:e.jsx(K,{data:R,selected:o,setSelected:b,query:u,setQuery:w,maxHeight:"max-h-40",placeholder:"Cari Kabupaten / Kota"})}),e.jsx("div",{className:"w-1/12 my-auto",children:o&&e.jsx("button",{className:"p-2",onClick:U,children:e.jsx(k,{})})})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(D,{onClick:()=>i(!1),children:"Batal"}),e.jsx(f,{className:"ms-3",children:"Filter"})]})]})})]})}fe.layout=a=>e.jsx(ee,{header:e.jsx(ae,{children:"Data Kecamatan"}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("admin.data-master"),children:"Data Master"})}),e.jsx("li",{children:"Data Kecamatan"})]})}),children:a,user:a.props.auth.user,title:"Data Kecamatan",backLink:e.jsx(n,{href:route("admin.data-master"),children:e.jsx(re,{})})});export{fe as default};