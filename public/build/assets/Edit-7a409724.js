import{W as J,r as i,y as M,j as e,Y as X,a as P}from"./app-60093d8b.js";import{H as Z}from"./Header-fccd1917.js";import{I as l}from"./InputLabel-fb90ae77.js";import{T as x}from"./TextInput-e2aade7c.js";import{P as z}from"./PrimaryButton-bffcd700.js";import{S as H}from"./SecondaryButton-a2ff8619.js";import{o as V,u as ee}from"./index.module-dbb0b5e9.js";import{A as se}from"./AddressSelectInput-ffae1de6.js";import{f as ae}from"./index.esm-53cbca2f.js";import"./combobox-b8c83591.js";import"./transition-69a0c110.js";import"./keyboard-8f7a194a.js";import"./iconBase-bb6eae91.js";function je({organization:t,villages:o,villageFilter:m}){var u,v,j,y,g,N;const{data:c,setData:d,processing:O,errors:a,reset:Q,patch:T}=J({name:"",address:"",expired:"",legality:"",addressDetail:{}}),[q,te]=i.useState(m||""),[s,h]=i.useState(m?o[0]:{}),[n,p]=i.useState(m||""),[B]=V(n,500),R=ee(q);i.useEffect(()=>{d({name:t.name,address:t.address,expired:t.expired,legality:t.legality,addressDetail:{village:t.village,village_id:t.village_id,district:t.district,district_id:t.district_id,regency:t.regency,regency_id:t.regency_id,province:t.province,province_id:t.province_id}})},[]),i.useEffect(()=>{R!==void 0&&(U(),G())},[B,s]);const U=()=>{var r,f,b,w,S,_,D,K,A,C,E,F,I,L,$,k;d("addressDetail",{province:s?(b=(f=(r=s==null?void 0:s.district)==null?void 0:r.regency)==null?void 0:f.province)==null?void 0:b.name:"",province_id:s?(D=(_=(S=(w=s==null?void 0:s.district)==null?void 0:w.regency)==null?void 0:S.province)==null?void 0:_.id)==null?void 0:D.toString():"",regency:s?(A=(K=s==null?void 0:s.district)==null?void 0:K.regency)==null?void 0:A.name:"",regency_id:s?(F=(E=(C=s==null?void 0:s.district)==null?void 0:C.regency)==null?void 0:E.id)==null?void 0:F.toString():"",district:s?(I=s==null?void 0:s.district)==null?void 0:I.name:"",district_id:s?($=(L=s==null?void 0:s.district)==null?void 0:L.id)==null?void 0:$.toString():"",village:s?s==null?void 0:s.name:"",village_id:s?(k=s==null?void 0:s.id)==null?void 0:k.toString():""})},W=r=>{r.preventDefault(),T(route("organization.update",t.id),{onSuccess:()=>Q()})},Y=()=>{h(""),p("")},G=()=>{M.reload({only:["villages"],data:{village:n},preserveState:!0})};return e.jsxs(e.Fragment,{children:[e.jsx(X,{title:"Organization"}),e.jsx("div",{className:"min-h-screen bg-gray-100",children:e.jsxs("div",{className:"max-w-xl mx-auto sm:px-6 lg:px-8",children:[e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-t-lg",children:e.jsx("div",{className:"sm:p-6 px-6 py-6 text-gray-800 text-center",children:e.jsx(Z,{children:"Ubah Organisasi"})})}),e.jsx("form",{onSubmit:W,children:e.jsxs("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-b-lg pb-6",children:[e.jsxs("div",{className:"px-6 py-3 text-gray-800",children:[e.jsx(l,{htmlFor:"name",value:"Nama",className:"mx-auto"}),e.jsx(x,{id:"name",type:"text",name:"name",value:c.name,className:`mt-1 w-full ${a&&a.name&&"border-red-500"}`,isFocused:!0,onChange:r=>d("name",r.target.value),placeholder:"Nama Organisasi"}),a&&a.name&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:a.name})})]}),e.jsxs("div",{className:"px-6 py-3 text-gray-800",children:[e.jsx(l,{htmlFor:"address",value:"Alamat",className:"mx-auto"}),e.jsx(x,{id:"address",type:"text",name:"address",value:c.address,className:`mt-1 w-full ${a&&a.address&&"border-red-500"}`,onChange:r=>d("address",r.target.value),placeholder:"Alamat Lengkap"}),a&&a.address&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:a.address})})]}),e.jsxs("div",{className:"px-6 py-3 text-gray-800",children:[e.jsx(l,{htmlFor:"address",value:"Alamat Lengkap",className:"mx-auto"}),e.jsxs("div",{className:"flex",children:[e.jsx("div",{className:`${s?"w-11/12":"w-full"}`,children:e.jsx(se,{data:o,selected:s,setSelected:h,query:n,setQuery:p,maxHeight:"max-h-40",placeholder:"Cari Desa / Kelurahan"})}),e.jsx("div",{className:`mx-auto my-auto ${s&&"w-1/12"}`,children:s&&e.jsx("button",{className:"p-2",onClick:Y,children:e.jsx(ae,{})})})]}),s&&e.jsxs("div",{className:"text-xs",children:[e.jsxs("div",{children:["Kecamatan: ",(u=s.district)==null?void 0:u.name]}),e.jsxs("div",{children:["Kabupaten/Kota: ",(j=(v=s.district)==null?void 0:v.regency)==null?void 0:j.name]}),e.jsxs("div",{children:["Provinsi: ",(N=(g=(y=s.district)==null?void 0:y.regency)==null?void 0:g.province)==null?void 0:N.name]})]})]}),e.jsxs("div",{className:"px-6 py-3 text-gray-800",children:[e.jsx(l,{htmlFor:"legality",value:"No Legalitas (opsional)",className:"mx-auto"}),e.jsx(x,{id:"legality",type:"text",name:"legality",value:c.legality??"",className:`mt-1 w-full ${a&&a.legality&&"border-red-500"}`,onChange:r=>d("legality",r.target.value),placeholder:"No Legalitas"}),a&&a.legality&&e.jsx("div",{className:"-mb-3",children:e.jsx("div",{className:"text-xs text-red-500",children:a.legality})})]}),e.jsxs("div",{className:"px-6 py-3 text-gray-800 text-center md:flex sm:rouded-b-lg",children:[e.jsx("div",{className:"mt-1 text-center md:mt-0 md:w-1/4 md:flex-1 md:mx-10 hidden md:block",children:e.jsx(P,{href:"/organizations",children:e.jsx(H,{className:"w-full md:min-w-max",children:e.jsx("div",{className:"w-full text-center",children:"Kembali"})})})}),e.jsx("div",{className:"md:w-1/4 md:flex-1 md:mx-10",children:e.jsx(z,{className:"w-full md:min-w-max",disabled:O,children:e.jsx("div",{className:"w-full text-center",children:"Ubah"})})}),e.jsx("div",{className:"mt-1 text-center md:hidden",children:e.jsx(P,{href:"/organizations",children:e.jsx(H,{className:"w-full md:min-w-max",children:e.jsx("div",{className:"w-full text-center",children:"Kembali"})})})})]})]})})]})})]})}export{je as default};