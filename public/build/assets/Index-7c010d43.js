import{r as t,W as ce,y as u,j as e,Y as ne,a as n}from"./app-b1bae4cf.js";import{A as oe}from"./AuthenticatedLayout-5344e0b9.js";import{H as de}from"./Header-c0cfe33d.js";import{I as x,a as p,h as me,b as he,f as b,c as ue}from"./index.esm-cc030e73.js";import{k as xe,Q as j}from"./react-toastify.esm-f0fa79de.js";import{N as pe,a as je}from"./NavgroupRegional-caf0e700.js";import{T as fe,C as ge,a as ye,P as Ne,b as ve}from"./ContentDesktop-1bd7315c.js";import{o as f,u as be}from"./index.module-5597c952.js";import Se from"./VillageMobile-6a39d946.js";import{M as R}from"./Modal-cfda514a.js";import{S as T}from"./SecondaryButton-d8ddebe6.js";import{P as S}from"./PrimaryButton-8fd5a5e1.js";import{C as we}from"./ContainerDesktop-83bffb38.js";import De from"./VillageDesktop-a137d395.js";import{G as w}from"./GeneralSelectInput-7d03b9bc.js";import"./ApplicationLogo-4245bc52.js";import"./iconBase-d2085e51.js";import"./transition-26553514.js";/* empty css                      */import"./dayjs.min-b8e970d9.js";import"./formatNumber-b542c689.js";import"./portal-962230a7.js";import"./close-provider-708b8203.js";import"./combobox-c84417da.js";function Pe({villages:a,provinces:E,regencies:M,districts:O,searchFilter:Q,provinceFilter:_,regencyFilter:B,districtFilter:q}){t.useState(!1);const[H,o]=t.useState(!1),[A,d]=t.useState(!1),[i,D]=t.useState(Q||""),[V]=f(i,500),h=be(i),{data:ke,setData:z,post:G,progress:g,reset:L,processing:W}=ce({village:""}),[r,P]=t.useState(""),[y,k]=t.useState(_||""),[Y]=f(y,500),[l,C]=t.useState(""),[N,I]=t.useState(B||""),[J]=f(N,500),[c,$]=t.useState(""),[v,K]=t.useState(q||""),[U]=f(v,500);t.useEffect(()=>{h!==void 0&&F()},[V]),t.useEffect(()=>{h!==void 0&&ae()},[Y,r]),t.useEffect(()=>{h!==void 0&&se()},[J,l,r]),t.useEffect(()=>{h!==void 0&&te()},[U,c,l]);const X=s=>{s.currentTarget.files&&z("village",s.currentTarget.files[0])},Z=s=>{s.preventDefault(),G(route("admin.data-master.village.post"),{onSuccess:()=>{L(),o(!1),j.success("Desa / Kelurahan Berhasil Diimport",{position:j.POSITION.TOP_CENTER})},onError:m=>{console.log(m),j.error(m,{position:j.POSITION.TOP_CENTER})}})},ee=s=>{s.preventDefault(),d(!1),F()},F=()=>{u.reload({only:["villages"],data:{search:i,province:r.id,regency:l.id,district:c.id}})},ae=()=>{u.reload({only:["provinces"],data:{searchProvince:y},preserveState:!0})},se=()=>{u.reload({only:["regencies"],data:{searchRegency:N,province:r.id},preserveState:!0})},te=()=>{u.reload({only:["districts"],data:{searchDistrict:v,regency:l.id},preserveState:!0})},re=()=>{P(""),k("")},le=()=>{C(""),I("")},ie=()=>{$(""),K("")};return e.jsxs(e.Fragment,{children:[e.jsx(ne,{title:"Data Desa / Kelurahan"}),e.jsx(xe,{}),e.jsx("div",{className:"btm-nav sm:hidden",children:e.jsx(pe,{onClick:()=>o(!0)})}),e.jsx(fe,{zIndex:"z-50",search:i,setSearch:s=>D(s.target.value),pageBefore:a.links[0].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page-1}&search=${i}`,preserveState:!0,children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page+1}&search=${i}`,only:["villages"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a,hasFilter:!0,showFilter:()=>d(!0)}),e.jsx(ge,{children:a.data.map(s=>e.jsx(Se,{village:s},s.id))}),e.jsxs(we,{children:[e.jsxs(ye,{children:[e.jsx("div",{className:"my-auto w-6/12",children:e.jsx(S,{className:"py-3",onClick:()=>o(!0),children:"Import Kelurahan / Desa"})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx("button",{className:"p-3 border rounded-lg",onClick:()=>d(!0),children:e.jsx(me,{})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(he,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Kecamatan",className:"w-full border-none focus:outline-none focus:ring-0",value:i||"",onChange:s=>D(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(Ne,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page-1}&search=${i}${r&&`&province=${r.id}`}${l&&`&regency=${l.id}`}${c&&`&district=${c.id}`}
                                                `,preserveState:!0,only:["villages"],children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page+1}&search=${i}${r&&`&province=${r.id}`}${l&&`&regency=${l.id}`}${c&&`&district=${c.id}`}`,only:["villages"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})})})]})]}),e.jsxs("div",{className:"sm:flex hidden gap-5",children:[e.jsx("div",{className:"w-11/12",children:e.jsx(ve,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Kode"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Desa / Kelurahan"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kecamatan"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kabupaten / Kota"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Provinsi"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,m)=>e.jsx(De,{village:s,className:`${m%2==0&&"bg-gray-100"}`},m))})]})})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx(je,{})})]})]}),e.jsx(R,{show:H,onClose:()=>o(!1),children:e.jsxs("form",{onSubmit:Z,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Import Desa / Kelurahan"}),e.jsx("div",{className:"mt-6 ",children:e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"sm:w-1/4 w-full my-auto",children:"File Desa / Kelurahan"}),e.jsxs("div",{className:"sm:w-3/4 w-full",children:[e.jsx("input",{type:"file",className:"file-input file-input-bordered file-input-sm w-full",value:void 0,onChange:X}),g&&e.jsxs("progress",{value:g.percentage,max:"100",children:[g.percentage,"%"]})]})]})}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(T,{onClick:()=>o(!1),children:"Batal"}),e.jsx(S,{className:"ms-3",disabled:W,children:"Import"})]})]})}),e.jsx(R,{show:A,onClose:()=>d(!1),children:e.jsxs("form",{onSubmit:ee,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Desa"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Provinsi"}),e.jsx("div",{className:"w-8/12",children:e.jsx(w,{data:E,selected:r,setSelected:P,query:y,setQuery:k,maxHeight:"max-h-40",placeholder:"Cari Provinsi"})}),e.jsx("div",{className:"w-1/12 my-auto",children:r&&e.jsx("button",{className:"p-2",onClick:re,children:e.jsx(b,{})})})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Kabupaten / Kota"}),e.jsx("div",{className:"w-8/12",children:e.jsx(w,{data:M,selected:l,setSelected:C,query:N,setQuery:I,maxHeight:"max-h-40",placeholder:"Cari Kabupaten / Kota"})}),e.jsx("div",{className:"w-1/12 my-auto",children:l&&e.jsx("button",{className:"p-2",onClick:le,children:e.jsx(b,{})})})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Kecamatan"}),e.jsx("div",{className:"w-8/12",children:e.jsx(w,{data:O,selected:c,setSelected:$,query:v,setQuery:K,maxHeight:"max-h-40",placeholder:"Cari Kecamatan"})}),e.jsx("div",{className:"w-1/12 my-auto",children:c&&e.jsx("button",{className:"p-2",onClick:ie,children:e.jsx(b,{})})})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(T,{onClick:()=>d(!1),children:"Batal"}),e.jsx(S,{className:"ms-3",children:"Filter"})]})]})})]})}Pe.layout=a=>e.jsx(oe,{header:e.jsx(de,{children:"Data Desa / Kelurahan"}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("admin.data-master"),children:"Data Master"})}),e.jsx("li",{children:"Data Desa / Kelurahan"})]})}),children:a,user:a.props.auth.user,title:"Data Desa / Kelurahan",backLink:e.jsx(n,{href:route("admin.data-master"),children:e.jsx(ue,{})})});export{Pe as default};