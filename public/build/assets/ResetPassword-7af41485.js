import{W as j,r as n,j as s,Y as h}from"./app-b1bae4cf.js";import{G as v}from"./GuestLayout-23d9b693.js";import{I as m}from"./InputError-da3d553e.js";import{I as l}from"./InputLabel-7f7b4adc.js";import{P as N}from"./PrimaryButton-8fd5a5e1.js";import{T as i}from"./TextInput-03bbc330.js";import{C as g}from"./Checkbox-ef13ec9d.js";function I({token:d,email:c}){const{data:t,setData:o,post:p,processing:u,errors:r,reset:w}=j({token:d,email:c,password:"",password_confirmation:""}),[e,x]=n.useState(!1);n.useEffect(()=>()=>{w("password","password_confirmation")},[]);const f=a=>{a.preventDefault(),p(route("password.store"))};return s.jsxs(v,{children:[s.jsx(h,{title:"Reset Password"}),s.jsxs("form",{onSubmit:f,children:[s.jsxs("div",{children:[s.jsx(l,{htmlFor:"email",value:"Email"}),s.jsx(i,{id:"email",type:"email",name:"email",value:t.email,className:"mt-1 block w-full",autoComplete:"username",onChange:a=>o("email",a.target.value)}),s.jsx(m,{message:r.email,className:"mt-2"})]}),s.jsxs("div",{className:"mt-4",children:[s.jsx(l,{htmlFor:"password",value:"Password"}),s.jsx(i,{id:"password",type:e?"text":"password",name:"password",value:t.password,className:"mt-1 block w-full",autoComplete:"new-password",isFocused:!0,onChange:a=>o("password",a.target.value)}),s.jsx(m,{message:r.password,className:"mt-2"})]}),s.jsx("div",{className:"block mt-4",children:s.jsxs("label",{className:"flex items-center",children:[s.jsx(g,{name:"show",checked:e,onChange:a=>x(!e)}),s.jsx("span",{className:"ms-2 text-sm text-gray-600",children:"Tampilkan Sandi"})]})}),s.jsxs("div",{className:"mt-4",children:[s.jsx(l,{htmlFor:"password_confirmation",value:"Confirm Password"}),s.jsx(i,{type:e?"text":"password",name:"password_confirmation",value:t.password_confirmation,className:"mt-1 block w-full",autoComplete:"new-password",onChange:a=>o("password_confirmation",a.target.value)}),s.jsx(m,{message:r.password_confirmation,className:"mt-2"})]}),s.jsx("div",{className:"flex items-center justify-end mt-4",children:s.jsx(N,{className:"ms-4",disabled:u,children:"Reset Password"})})]})]})}export{I as default};