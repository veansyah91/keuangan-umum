import{r as t,W as ne,y as u,j as e,Y as oe,a as n}from"./app-71a08f08.js";import{A as de}from"./AuthenticatedLayout-d23faefd.js";import{H as me}from"./Header-1bd6e118.js";import{I as x,a as p,h as he,b as ue,f as v,c as xe}from"./index.esm-e93d8aec.js";import{k as pe,Q as F}from"./react-toastify.esm-a15464d8.js";import{N as je,a as fe}from"./NavgroupRegional-babf9b1d.js";import{T as ge,C as ye,a as Ne,P as ve,b as be}from"./ContentDesktop-55227f24.js";import{o as j,u as Se}from"./usePrevious-05b7ccb4.js";import we from"./VillageMobile-9a2d93b8.js";import{M as R}from"./Modal-09130d5c.js";import{S as M}from"./SecondaryButton-c90a4984.js";import{P as b}from"./PrimaryButton-efd14abd.js";import{C as De}from"./ContainerDesktop-1f551737.js";import Pe from"./VillageDesktop-6f293066.js";import{G as S}from"./GeneralSelectInput-27bd2437.js";import"./index.esm-02f248dd.js";import"./iconBase-0837d2ad.js";import"./transition-105fbe16.js";/* empty css                      */import"./dayjs.min-b64be250.js";import"./formatNumber-b542c689.js";import"./active-element-history-83f33841.js";import"./keyboard-3c0f8685.js";import"./combobox-a4302679.js";import"./use-resolve-button-type-9101f3a8.js";function ke({villages:a,provinces:Q,regencies:E,districts:T,searchFilter:_,provinceFilter:B,regencyFilter:O,districtFilter:q}){t.useState(!1);const[H,o]=t.useState(!1),[A,d]=t.useState(!1),[i,w]=t.useState(_||""),[V]=j(i,500),m=Se(i),{data:z,setData:G,post:L,progress:f,reset:W,processing:Y}=ne({village:""}),[r,D]=t.useState(""),[g,P]=t.useState(B||""),[J]=j(g,500),[l,k]=t.useState(""),[y,C]=t.useState(O||""),[U]=j(y,500),[c,$]=t.useState(""),[N,K]=t.useState(q||""),[X]=j(N,500);t.useEffect(()=>{m!==void 0&&I()},[V]),t.useEffect(()=>{m!==void 0&&se()},[J,r]),t.useEffect(()=>{m!==void 0&&te()},[U,l,r]),t.useEffect(()=>{m!==void 0&&re()},[X,c,l]);const Z=s=>{s.currentTarget.files&&G("village",s.currentTarget.files[0])},ee=s=>{s.preventDefault(),console.log(z),L(route("admin.data-master.village.post"),{onSuccess:()=>{W(),o(!1),F.success("Desa / Kelurahan Berhasil Diimport",{position:F.POSITION.TOP_CENTER})},onError:h=>{console.log(h)}})},ae=s=>{s.preventDefault(),d(!1),I()},I=()=>{u.reload({only:["villages"],data:{search:i,province:r.id,regency:l.id,district:c.id}})},se=()=>{u.reload({only:["provinces"],data:{searchProvince:g},preserveState:!0})},te=()=>{u.reload({only:["regencies"],data:{searchRegency:y,province:r.id},preserveState:!0})},re=()=>{u.reload({only:["districts"],data:{searchDistrict:N,regency:l.id},preserveState:!0})},le=()=>{D(""),P("")},ie=()=>{k(""),C("")},ce=()=>{$(""),K("")};return e.jsxs(e.Fragment,{children:[e.jsx(oe,{title:"Data Kecamatan"}),e.jsx(pe,{}),e.jsx("div",{className:"btm-nav sm:hidden",children:e.jsx(je,{onClick:()=>o(!0)})}),e.jsx(ge,{zIndex:"z-50",search:i,setSearch:s=>w(s.target.value),pageBefore:a.links[0].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page-1}&search=${i}`,preserveState:!0,children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page+1}&search=${i}`,only:["villages"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a,hasFilter:!0,showFilter:()=>d(!0)}),e.jsx(ye,{children:a.data.map(s=>e.jsx(we,{village:s},s.id))}),e.jsxs(De,{children:[e.jsxs(Ne,{children:[e.jsx("div",{className:"my-auto w-6/12",children:e.jsx(b,{className:"py-3",onClick:()=>o(!0),children:"Import Kelurahan / Desa"})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx("button",{className:"p-3 border rounded-lg",onClick:()=>d(!0),children:e.jsx(he,{})})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(ue,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Kecamatan",className:"w-full border-none focus:outline-none focus:ring-0",value:i||"",onChange:s=>w(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(ve,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page-1}&search=${i}${r&&`&province=${r.id}`}${l&&`&regency=${l.id}`}${c&&`&district=${c.id}`}
                                                `,preserveState:!0,only:["villages"],children:e.jsx(x,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(x,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(n,{href:`/admin/data-master/villages?page=${a.current_page+1}&search=${i}${r&&`&province=${r.id}`}${l&&`&regency=${l.id}`}${c&&`&district=${c.id}`}`,only:["villages"],preserveState:!0,children:e.jsx(p,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(p,{})})})]})]}),e.jsxs("div",{className:"sm:flex hidden gap-5",children:[e.jsx("div",{className:"w-11/12",children:e.jsx(be,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Kode"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Desa / Kelurahan"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kecamatan"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Kabupaten / Kota"}),e.jsx("th",{className:"bg-gray-200",children:"Nama Provinsi"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,h)=>e.jsx(Pe,{village:s,className:`${h%2==0&&"bg-gray-100"}`},h))})]})})}),e.jsx("div",{className:"w-1/12 text-end",children:e.jsx(fe,{})})]})]}),e.jsx(R,{show:H,onClose:()=>o(!1),children:e.jsxs("form",{onSubmit:ee,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Import Desa / Kelurahan"}),e.jsx("div",{className:"mt-6 ",children:e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1",children:[e.jsx("div",{className:"sm:w-1/4 w-full my-auto",children:"File Desa / Kelurahan"}),e.jsxs("div",{className:"sm:w-3/4 w-full",children:[e.jsx("input",{type:"file",className:"file-input file-input-bordered file-input-sm w-full",value:void 0,onChange:Z}),f&&e.jsxs("progress",{value:f.percentage,max:"100",children:[f.percentage,"%"]})]})]})}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(M,{onClick:()=>o(!1),children:"Batal"}),e.jsx(b,{className:"ms-3",disabled:Y,children:"Import"})]})]})}),e.jsx(R,{show:A,onClose:()=>d(!1),children:e.jsxs("form",{onSubmit:ae,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Filter Desa"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Provinsi"}),e.jsx("div",{className:"w-8/12",children:e.jsx(S,{data:Q,selected:r,setSelected:D,query:g,setQuery:P,maxHeight:"max-h-40",placeholder:"Cari Provinsi"})}),e.jsx("div",{className:"w-1/12 my-auto",children:r&&e.jsx("button",{className:"p-2",onClick:le,children:e.jsx(v,{})})})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Kabupaten / Kota"}),e.jsx("div",{className:"w-8/12",children:e.jsx(S,{data:E,selected:l,setSelected:k,query:y,setQuery:C,maxHeight:"max-h-40",placeholder:"Cari Kabupaten / Kota"})}),e.jsx("div",{className:"w-1/12 my-auto",children:l&&e.jsx("button",{className:"p-2",onClick:ie,children:e.jsx(v,{})})})]}),e.jsxs("div",{className:"flex w-full gap-1",children:[e.jsx("div",{className:"w-3/12 my-auto",children:"Kecamatan"}),e.jsx("div",{className:"w-8/12",children:e.jsx(S,{data:T,selected:c,setSelected:$,query:N,setQuery:K,maxHeight:"max-h-40",placeholder:"Cari Kecamatan"})}),e.jsx("div",{className:"w-1/12 my-auto",children:c&&e.jsx("button",{className:"p-2",onClick:ce,children:e.jsx(v,{})})})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(M,{onClick:()=>d(!1),children:"Batal"}),e.jsx(b,{className:"ms-3",children:"Filter"})]})]})})]})}ke.layout=a=>e.jsx(de,{header:e.jsx(me,{children:"Data Desa / Kelurahan"}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(n,{href:route("admin.data-master"),children:"Data Master"})}),e.jsx("li",{children:"Data Desa / Kelurahan"})]})}),children:a,user:a.props.auth.user,title:"Data Desa / Kelurahan",backLink:e.jsx(n,{href:route("admin.data-master"),children:e.jsx(xe,{})})});export{ke as default};