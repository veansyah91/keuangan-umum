import{r as t,W as F,y as J,j as e,Y as V,a as g}from"./app-e9563627.js";import{C as W}from"./Container-3612becb.js";import{H as X}from"./Header-0a8198e9.js";import{M as k}from"./Modal-7fd7ebf9.js";import{P}from"./PrimaryButton-c99381a3.js";import{S as N}from"./SecondaryButton-961c8d7d.js";import{G as Z}from"./GeneralSelectInput-edc1d081.js";import{U as ee}from"./UserSelectInput-9f3681d5.js";import{k as se,d as te,e as ae,o as ie}from"./index.esm-9ad57f03.js";import{a as le,u as ne}from"./index.module-862d5319.js";import{k as re,Q as c}from"./react-toastify.esm-d14c0da9.js";/* empty css                      */import{D as oe}from"./DangerButton-104c8b85.js";import"./portal-67fe3a42.js";import"./transition-3412008e.js";import"./close-provider-bcf29e6f.js";import"./combobox-702c868f.js";import"./iconBase-cf74823f.js";const i=[{id:0,name:"PELIHAT",value:"viewer"},{id:1,name:"EDITOR",value:"editor"}];function Pe({organization:a,users:r,userFilter:x,userOrganization:o}){const[E,d]=t.useState(!1),[I,h]=t.useState(!1),[D]=t.useState(x||""),[u,w]=t.useState(!1),[R,U]=t.useState(""),[p,O]=t.useState(x?r[0]:{}),[b,de]=t.useState(x||""),[B]=le(b,500),[f,j]=t.useState(i[0]),[m,_]=t.useState(""),[H,y]=t.useState([]),{data:S,setData:l,post:A,patch:K,processing:T,errors:n,reset:ce,delete:M,setError:Q}=F({user_id:r.length>0?r[0].id:"",user_name:r.length>0?r[0].name:"",organization_id:a.id,role:i[0].name}),L=ne(D);t.useEffect(()=>{y(i)},[]),t.useEffect(()=>{L!==void 0&&(l("user_id",p.id),$())},[p,B]),t.useEffect(()=>{y(i.filter(s=>s.name.toLowerCase().replace(/\s+/g,"").includes(m==null?void 0:m.toLowerCase().replace(/\s+/g,""))))},[m]),t.useEffect(()=>{l("role",f.value)},[f]);const G=s=>{l({...S,user_id:s.id,user_name:s.name,role:s.pivot.role}),j(i.find(({value:v})=>v===s.pivot.role)),_(s.pivot.role),d(!0),w(!0)},Y=s=>{U(s.name),l({user_id:s.id,user_name:s.name,organization_id:a.id,role:s.pivot.role}),h(!0)},C=()=>{d(!0),w(!1),j(i[0]),Q({})},$=()=>{J.reload({only:["users"],data:{user:b}})},q=s=>{s.preventDefault(),u?K(route("organization.share-to-other.patch",a.id),{onSuccess:()=>{c.success("Kontak Berhasil Diperbarui",{position:c.POSITION.TOP_CENTER}),d(!1),l({user_id:"",user_name:"",organization_id:a.id,role:i[0].name})}}):A(route("organization.share-to-other.post",a.id),{onSuccess:()=>{c.success("Kontak Berhasil Ditautkan, Mohon Menunggu Konfirmasi Dari Pengguna",{position:c.POSITION.TOP_CENTER}),d(!1),l({user_id:"",user_name:"",organization_id:a.id,role:i[0].name})}})},z=s=>{s.preventDefault(),M(route("organization.share-to-other.delete",a.id),{onSuccess:()=>{c.success("Tautan Kontak dan Organisasi Berhasil Dihapus",{position:c.POSITION.TOP_CENTER}),h(!1),l({user_id:"",user_name:"",organization_id:a.id,role:i[0].name})}})};return e.jsxs(e.Fragment,{children:[e.jsx(re,{}),e.jsx("div",{className:"min-h-screen bg-gray-100",children:e.jsxs("div",{className:"max-w-2xl mx-auto sm:px-6 lg:px-8 bg-white rounded-lg pb-10",children:[e.jsx(V,{title:"Organization"}),e.jsx(X,{children:e.jsx("div",{className:"pt-4 text-center",children:"Bagikan Organisasi"})}),e.jsxs(W,{className:"sm:mt-5",children:[e.jsxs("div",{className:"flex justify-between gap-2 sm:my-2",children:[e.jsx("div",{className:"",children:e.jsx(P,{className:"hidden sm:block",onClick:C,children:"Tambah Pengguna"})}),e.jsx("div",{className:"md:hidden block fixed left-2 bottom-2",children:e.jsx("div",{children:e.jsx("button",{className:"btn btn-circle bg-gray-800 text-white",onClick:C,children:e.jsx("div",{className:"text-xl font-bold",children:e.jsx(se,{height:20,width:20})})})})}),e.jsxs("div",{className:"mt-auto text-xs mr-2 sm:mr-0",children:["Jumlah Pengguna Tertaut: ",a.users.length," pengguna"]})]}),a.users.map((s,v)=>e.jsxs("div",{className:`hover:bg-slate-100 ${s.pivot.is_waiting?"border-orange-400 border":""} hover:rounded-sm px-2 py-3`,children:[s.pivot.is_waiting?e.jsx("div",{className:"w-full text-center text-xs my-auto bg-orange-400 text-white",children:"Menunggu Konfirmasi"}):"",e.jsxs("div",{className:"flex justify-between sm:px-4 grid-2 w-full",children:[e.jsxs("div",{className:"w-2/4",children:[e.jsx("div",{children:s.name}),e.jsx("div",{className:"text-xs",children:s.email})]}),e.jsxs("div",{className:"sm:w-1/4 w-5/12 my-auto italic text-center",children:[s.pivot.role=="admin"&&"Admin",s.pivot.role=="viewer"&&"Hanya Lihat",s.pivot.role=="editor"&&"Editor"]}),e.jsx("div",{className:"sm:w-1/4 w-1/12 my-auto text-end",children:s.pivot.role!=="admin"&&e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none ",children:e.jsx(te,{})}),e.jsxs("ul",{tabIndex:0,className:"dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52",children:[o.pivot.role=="admin"&&e.jsxs(e.Fragment,{children:[e.jsx("li",{children:e.jsxs("button",{onClick:()=>G(s),children:[e.jsx(ae,{}),"Ubah Role"]})}),e.jsx("li",{children:e.jsxs("button",{onClick:()=>Y(s),children:[e.jsx(ie,{}),"Hapus Tautan"]})})]}),o.pivot.is_waiting?e.jsxs("li",{className:"flex justify-between flex-row",children:[e.jsx("div",{className:"bg-green-600 hover:bg-green-400 text-white",children:e.jsx(g,{href:route("organization.share-to-other.patch.confirmation",a.id),as:"button",method:"patch",data:{confirm:!0,user_id:o.pivot.user_id,organization_id:o.pivot.organization_id,is_waiting:!1},children:"Terima"})}),e.jsx("div",{className:"bg-red-600 hover:bg-red-400 text-white",children:e.jsx(g,{href:route("organization.share-to-other.patch.confirmation",a.id),as:"button",method:"patch",data:{confirm:!1,user_id:o.pivot.user_id,organization_id:o.pivot.organization_id,is_waiting:!1},children:"Tolak"})})]}):""]})]})})]})]},v)),e.jsx("div",{className:"mt-9 px-8 sm:px-4",children:e.jsx(g,{href:"/organizations",children:e.jsx(N,{children:"Kembali"})})})]})]})}),e.jsx(k,{show:E,onClose:()=>d(!1),children:e.jsxs("form",{onSubmit:q,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:u?`Ubah Role Pengguna ${S.user_name}`:"Tambah Tautan Pengguna"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[!u&&e.jsxs("div",{className:"sm:flex w-full gap-1",children:[e.jsx("div",{className:"sm:w-3/12 my-auto",children:"Pengguna"}),e.jsxs("div",{className:"sm:w-8/12",children:[e.jsx(ee,{resources:r,selected:p,setSelected:O,maxHeight:"max-h-40",placeholder:"Cari Pengguna",className:(n==null?void 0:n.user_id)&&"border-red-500 border"}),(n==null?void 0:n.user_id)&&e.jsx("div",{className:"text-xs text-red-500",children:n.user_id})]})]}),e.jsxs("div",{className:"sm:flex w-full gap-1",children:[e.jsx("div",{className:"sm:w-3/12 my-auto",children:"Role"}),e.jsx("div",{className:"sm:w-8/12",children:e.jsx(Z,{data:H,selected:f,setSelected:j,query:m,setQuery:_,maxHeight:"max-h-40",placeholder:"Cari Role"})})]}),e.jsxs("div",{className:"mt-10 py-10 flex flex-col-reverse justify-center sm:flex-row sm:justify-end",children:[e.jsx("div",{className:"text-center",children:e.jsx(N,{className:"w-full mt-2 sm:mt-0",onClick:()=>d(!1),children:e.jsx("div",{className:"text-center w-full",children:"Batal"})})}),e.jsx("div",{className:"text-center",children:e.jsx(P,{className:"sm:ms-3 w-full",disabled:T,children:e.jsx("div",{className:"text-center w-full",children:"Tautkan Pengguna"})})})]})]})]})}),e.jsx(k,{show:I,onClose:()=>h(!1),children:e.jsxs("form",{onSubmit:z,className:"p-6",children:[e.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Konfirmasi Hapus Penautan"}),e.jsxs("div",{className:"mt-6 space-y-2",children:[e.jsxs("div",{className:"text-center",children:["Apakah Anda Yakin Menghapus Tautan Dengan"," ",e.jsx("span",{className:"font-bold",children:R.toUpperCase()})," ?"]}),e.jsxs("div",{className:"mt-10 py-10 sm:mx-3 flex flex-col-reverse justify-center sm:flex-row sm:justify-end",children:[e.jsx("div",{className:"text-center",children:e.jsx(N,{className:"w-full mt-2 sm:mt-0",onClick:()=>h(!1),children:e.jsx("div",{className:"text-center w-full",children:"Batal"})})}),e.jsx("div",{className:"text-center",children:e.jsx(oe,{className:"sm:ms-3 w-full",disabled:T,type:"submit",children:e.jsx("div",{className:"text-center w-full",children:"Hapus Tautan"})})})]})]})]})})]})}export{Pe as default};