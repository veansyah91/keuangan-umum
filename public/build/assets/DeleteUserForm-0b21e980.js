import{r as o,W as k,j as s}from"./app-e9563627.js";import{D as i}from"./DangerButton-104c8b85.js";import{I as j}from"./InputError-400f2e5d.js";import{I as g}from"./InputLabel-af074bd9.js";import{M as w}from"./Modal-7fd7ebf9.js";import{S as y}from"./SecondaryButton-961c8d7d.js";import{T as N}from"./TextInput-cc0be9b5.js";import"./portal-67fe3a42.js";import"./transition-3412008e.js";import"./close-provider-bcf29e6f.js";function B({className:m=""}){const[l,r]=o.useState(!1),t=o.useRef(),{data:d,setData:u,delete:c,processing:p,reset:n,errors:h}=k({password:""}),x=()=>{r(!0)},f=e=>{e.preventDefault(),c(route("profile.destroy"),{preserveScroll:!0,onSuccess:()=>a(),onError:()=>t.current.focus(),onFinish:()=>n()})},a=()=>{r(!1),n()};return s.jsxs("section",{className:`space-y-6 ${m}`,children:[s.jsxs("header",{children:[s.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Hapus Akun"}),s.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Ketika akun anda dihapus, semua data akan dihapus secara permanen. Sebelum menghapus akun, silakan unduh data dan informasi yang dibutuhkan."})]}),s.jsx(i,{onClick:x,children:"Hapus Akun"}),s.jsx(w,{show:l,onClose:a,children:s.jsxs("form",{onSubmit:f,className:"p-6",children:[s.jsx("h2",{className:"text-lg font-medium text-gray-900",children:"Apakah anda yakin menghapus akun?"}),s.jsx("p",{className:"mt-1 text-sm text-gray-600",children:"Ketika akun dihapus, semua data akan dihapus secara permanen. Silakan masukkan password untuk mengkonfirmasi."}),s.jsxs("div",{className:"mt-6",children:[s.jsx(g,{htmlFor:"password",value:"Password",className:"sr-only"}),s.jsx(N,{id:"password",type:"password",name:"password",ref:t,value:d.password,onChange:e=>u("password",e.target.value),className:"mt-1 block w-3/4",isFocused:!0,placeholder:"Password"}),s.jsx(j,{message:h.password,className:"mt-2"})]}),s.jsxs("div",{className:"mt-6 flex justify-end",children:[s.jsx(y,{onClick:a,children:"Batal"}),s.jsx(i,{className:"ms-3",disabled:p,children:"Hapus Akun"})]})]})})]})}export{B as default};