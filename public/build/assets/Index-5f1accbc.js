import{r as l,W as oe,y as K,j as e,Y as de,a as m}from"./app-53c76e57.js";import{A as ne}from"./AuthenticatedLayout-9b2ea21c.js";import{H as me}from"./Header-8598f05f.js";import{I as g,a as v,b as ue,c as he}from"./index.esm-8edc8eb6.js";import{k as xe,Q as o}from"./react-toastify.esm-53b0350f.js";import{A as pe}from"./AddButtonMobile-f33eabf0.js";import{T as je,C as fe,a as ge,P as ve,b as Ne}from"./ContentDesktop-4dc450b2.js";import{o as ye,u as be}from"./usePrevious-87c10592.js";import{M as L}from"./Modal-de5be3a4.js";import{I as _}from"./InputLabel-dc41d3c5.js";import{T as R}from"./TextInput-b4abbcb2.js";import{S as H}from"./SecondaryButton-f680fc0f.js";import{P as q}from"./PrimaryButton-b10fbfd4.js";import{G as _e}from"./GeneralSelectInput-6e55b2dd.js";import Se from"./AccountMobile-68afab01.js";import{C as we}from"./ContainerDesktop-c795889e.js";import ke from"./AccountDesktop-441d0eff.js";import{D as Ce}from"./DangerButton-3c727559.js";import"./ApplicationLogo-147182d5.js";import"./iconBase-be1fbd1f.js";import"./transition-f3304be6.js";/* empty css                      */import"./dayjs.min-f7628081.js";import"./formatNumber-b542c689.js";import"./keyboard-acd08265.js";import"./combobox-254c5f65.js";import"./BadgeDanger-02d70614.js";import"./BadgeSuccess-4a03942d.js";function Ae({organization:r,accounts:a,role:p,accountCategories:z,code:Ie,searchFilter:Q,accountCategoryFilter:De,selectedAccountCategoryFilter:U}){const N=z,[G,V]=l.useState(N);l.useState(!1);const[W,u]=l.useState(!1),[Y,h]=l.useState(!1),[i,S]=l.useState(Q||""),[J]=ye(i,500),[w,k]=l.useState(!1),[C,A]=l.useState(""),[X,I]=l.useState("Tambah Akun"),[Z,D]=l.useState("Tambah"),[x,y]=l.useState({id:null,name:"",code:""}),[j,b]=l.useState(""),[T,E]=l.useState({selectedAccountCategoryId:null,code:""}),P=be(i),{data:c,setData:d,reset:f,post:ee,patch:se,delete:ae,processing:B,errors:t,setError:te}=oe({account_category_id:U||"",name:"",code:"",is_cash:!1,is_active:!0});l.useEffect(()=>{const s=j===""?N:N.filter(n=>n.name.toLowerCase().replace(/\s+/g,"").includes(j.toLowerCase().replace(/\s+/g,"")));V(s)},[j]),l.useEffect(()=>{P!==void 0&&le()},[x]),l.useEffect(()=>{P!==void 0&&re()},[J]);const le=()=>{K.reload({only:["code"],data:{selectedAccountCategory:x.id},onSuccess:s=>{d({...c,code:T.selectedAccountCategoryId==x.id?T.code:s.props.code.toString(),account_category_id:x.id,is_cash:parseInt(s.props.code)<12e7})},preserveState:!0})},re=()=>{K.reload({only:["accounts"],data:{search:i}})},O=s=>{y({id:s.account_category_id,name:s.account_category.name,code:s.account_category.code}),b(s.account_category.name),I("Ubah Akun"),D("Ubah"),k(!0),A(s.id),E({selectedAccountCategoryId:s.account_category_id,code:s.code}),d({account_category_id:s.account_category_id,name:s.name,code:s.code,is_cash:s.is_cash,is_active:s.is_active}),u(!0)},F=()=>{I("Tambah Akun"),D("Tambah"),k(!1),f(),E({selectedAccountCategoryId:null,code:""}),b(""),y({id:"",name:"",code:""}),te({code:"",name:"",account_category_id:""}),u(!0)},ce=s=>{s.preventDefault(),w?se(route("data-ledger.account.update",{organization:r.id,account:C}),{onSuccess:()=>{u(!1),o.success("Akun Berhasil Diubah",{position:o.POSITION.TOP_CENTER}),f()},preserveScroll:!0}):ee(route("data-ledger.account.post",r.id),{onSuccess:()=>{u(!1),o.success("Akun Berhasil Ditambah",{position:o.POSITION.TOP_CENTER}),f()},preserveScroll:!0})},$=()=>{u(!1)},M=s=>{A(s.id),d({account_category_id:s.account_category_id,name:s.name,code:s.code,is_cash:s.is_cash,is_active:s.is_active}),h(!0)},ie=s=>{s.preventDefault(),ae(route("data-ledger.account.delete",{organization:r.id,account:C}),{onSuccess:()=>{h(!1),o.success("Akun Berhasil Dihapus",{position:o.POSITION.TOP_CENTER}),f()},onError:n=>{h(!1),o.error(n.used,{position:o.POSITION.TOP_CENTER})},preserveScroll:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(de,{title:"Data Akun"}),e.jsx(xe,{}),p!=="viewer"&&e.jsx(pe,{handleShowInputModal:F,label:"Tambah"}),e.jsx(je,{zIndex:"z-50",search:i,setSearch:s=>S(s.target.value),pageBefore:a.links[0].url?e.jsx(m,{href:route("data-ledger.account",{organization:r.id,page:a.current_page-1,search:i}),preserveState:!0,only:["accounts"],children:e.jsx(g,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(g,{})}),pageAfter:a.links[a.links.length-1].url?e.jsx(m,{href:`/data-ledger/${r.id}/accounts?page=${a.current_page+1}&search=${i}`,only:["accounts"],preserveState:!0,children:e.jsx(v,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(v,{})}),page:e.jsxs(e.Fragment,{children:[a.current_page,"/",a.last_page]}),data:a}),e.jsx(fe,{children:a.data.map(s=>e.jsx(Se,{account:s,handleEdit:()=>O(s),handleDelete:()=>M(s),role:p},s.id))}),e.jsxs(we,{children:[e.jsxs(ge,{children:[e.jsx("div",{className:"my-auto w-7/12",children:p!=="viewer"&&e.jsx(q,{className:"py-3",onClick:F,children:"Tambah Data"})}),e.jsxs("div",{className:"w-3/12 border flex rounded-lg",children:[e.jsx("label",{htmlFor:"search-input",className:"my-auto ml-2",children:e.jsx(ue,{})}),e.jsx("input",{id:"search-input",name:"search-input",type:"search",placeholder:"Cari Akun",className:"w-full border-none focus:outline-none focus:ring-0",value:i||"",onChange:s=>S(s.target.value)})]}),e.jsx("div",{className:"italic text-xs my-auto w-1/12 text-center",children:e.jsx(ve,{data:a})}),e.jsxs("div",{className:"my-auto flex space-x-2 w-1/12",children:[e.jsx("div",{className:"my-auto",children:a.links[0].url?e.jsx(m,{href:`/data-ledger/${r.id}/accounts?page=${a.current_page-1}&search=${i}`,preserveState:!0,only:["accounts"],children:e.jsx(g,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(g,{})})}),e.jsxs("div",{className:"my-auto",children:[a.current_page,"/",a.last_page]}),e.jsx("div",{className:"my-auto",children:a.links[a.links.length-1].url?e.jsx(m,{href:`/data-ledger/${r.id}/accounts?page=${a.current_page+1}&search=${i}`,only:["accounts"],preserveState:!0,children:e.jsx(v,{})}):e.jsx("div",{className:"text-gray-300",children:e.jsx(v,{})})})]})]}),e.jsx("div",{className:"sm:flex hidden gap-5",children:e.jsx("div",{className:"w-full",children:e.jsx(Ne,{children:e.jsxs("table",{className:"table table-pin-rows table-pin-cols text-base",children:[e.jsx("thead",{className:"text-base text-gray-900",children:e.jsxs("tr",{className:"",children:[e.jsx("th",{className:"bg-gray-200",children:"Kategori"}),e.jsx("th",{className:"bg-gray-200",children:"Kode"}),e.jsx("th",{className:"bg-gray-200",children:"Nama"}),e.jsx("th",{className:"bg-gray-200 text-center",children:"Status"}),e.jsx("th",{className:"bg-gray-200"})]})}),e.jsx("tbody",{children:a.data.map((s,n)=>e.jsx(ke,{account:s,className:`${n%2==0&&"bg-gray-100"}`,handleEdit:()=>O(s),handleDelete:()=>M(s),role:p},n))})]})})})})]}),e.jsx(L,{show:W,onClose:$,children:e.jsxs("form",{onSubmit:ce,className:"p-6",id:"form-input",name:"form-input",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900 border-b-2 py-1",children:X}),e.jsxs("div",{className:"mt-5 ",children:[e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(_,{htmlFor:"name",value:"Kategori Akun",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx(_e,{data:G,selected:x,setSelected:y,query:j,setQuery:b,maxHeight:"max-h-40",placeholder:"Cari Kategori Akun",isFocused:!0}),t&&t.account_category_id&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:"The account category field is requred"})})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(_,{htmlFor:"name",value:"Kode",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx(R,{id:"code",type:"text",name:"code",value:c.code!=="0"?c.code:"",className:`mt-1 w-full ${t&&t.code&&"border-red-500"}`,onChange:s=>d("code",s.target.value.toString()),placeholder:"Kode Akun"}),t&&t.code&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:t.code})})]})]}),e.jsxs("div",{className:"flex flex-col sm:flex-row w-full gap-1 mt-5",children:[e.jsx("div",{className:"w-full sm:w-1/3 my-auto",children:e.jsx(_,{htmlFor:"name",value:"Nama",className:"mx-auto my-auto"})}),e.jsxs("div",{className:"sm:w-2/3 w-full",children:[e.jsx(R,{id:"name",type:"text",name:"name",value:c.name,className:`mt-1 w-full ${t&&t.name&&"border-red-500"}`,onChange:s=>d("name",s.target.value.toUpperCase()),placeholder:"Nama Akun"}),t&&t.name&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:t.name})})]})]}),e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:"flex justify-start w-full gap-1 mt-5",children:e.jsxs("div",{className:"w-1/12",children:[e.jsx("div",{className:"form-control ",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"is_cash",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"is_cash",value:c.is_cash,onChange:()=>d("is_cash",!c.is_cash),checked:c.is_cash}),e.jsx("span",{className:"label-text font-bold",children:"Kas"})]})}),t&&t.is_cash&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:t.is_cash})})]})}),w&&e.jsx("div",{className:"flex justify-start w-full gap-1 mt-5",children:e.jsxs("div",{className:"w-1/12",children:[e.jsx("div",{className:"form-control ",children:e.jsxs("label",{className:"label cursor-pointer gap-2",htmlFor:"is_active",children:[e.jsx("input",{type:"checkbox",className:"checkbox",id:"is_active",value:c.is_active,onChange:()=>d("is_active",!c.is_active),checked:c.is_active}),e.jsx("span",{className:"label-text font-bold",children:"Aktif"})]})}),t&&t.is_active&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:t.is_active})})]})})]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(H,{onClick:$,children:"Batal"}),e.jsx(q,{className:"ms-3",disabled:B,children:Z})]})]})}),e.jsx(L,{show:Y,onClose:()=>h(!1),children:e.jsxs("form",{onSubmit:ie,className:"p-6",id:"delete-confirmation",name:"delete-confirmation",children:[e.jsxs("h2",{className:"text-lg font-medium text-gray-900 text-center",children:[e.jsx("div",{children:"Hapus Kategori Akun"}),c&&e.jsxs("div",{children:[c.name," (",c.code,")"]})]}),e.jsxs("div",{className:"mt-6 flex justify-end",children:[e.jsx(H,{onClick:()=>h(!1),children:"Batal"}),e.jsx(Ce,{className:"ms-3",disabled:B,children:"Hapus"})]})]})})]})}Ae.layout=r=>e.jsx(ne,{header:e.jsx(me,{children:"Daftar Akun"}),children:r,user:r.props.auth.user,organization:r.props.organization,title:"Data Akun",backLink:e.jsx(m,{href:route("data-ledger",r.props.organization.id),children:e.jsx(he,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(m,{href:route("data-ledger",r.props.organization.id),children:"Buku Besar"})}),e.jsx("li",{children:"Daftar Akun"})]})}),role:r.props.role});export{Ae as default};