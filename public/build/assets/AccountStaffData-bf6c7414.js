import{r as i,W as k,j as s,Y as E,a as p}from"./app-18d344c6.js";import{P as u}from"./PrimaryButton-74e4339d.js";import{A as I}from"./AuthenticatedLayout-f72ab3d2.js";import{H as w}from"./Header-d3a5ebd0.js";import{c as O}from"./index.esm-11facade.js";import{Q as c,k as P}from"./react-toastify.esm-14a132f8.js";import{S as C}from"./SecondaryButton-8f498461.js";import{I as z}from"./InputLabel-2c4eb927.js";import{C as D}from"./ClientSelectInput-b1029be2.js";import{F as S}from"./FormInput-a434b94e.js";function h({organization:a,accountStaff:e,accounts:n}){const{setIsEdit:l}=i.useContext(o),{data:x,setData:_,patch:y,processing:b,errors:d}=k({id:e?e.id:null,staff_salary_expense:e?e.staff_salary_expense.id:null}),[t,v]=i.useState({id:e?e.staff_salary_expense.id:null,name:e?e.staff_salary_expense.name:"",code:e?e.staff_salary_expense.code:"",is_cash:e?e.staff_salary_expense.is_cash:!1}),N=r=>{d.staff_salary_expense=null,r&&(v({id:r?r.id:null,name:r?r.name:"",code:r?r.code:"",is_cash:r?r.is_cash:!1}),_("staff_salary_expense",r?r.id:null))},A=r=>{r.preventDefault(),y(route("data-ledger.account-staff.update",{organization:a.id}),{onSuccess:({props:m})=>{const{flash:g}=m;c.success(g.success,{position:c.POSITION.TOP_CENTER})},onError:m=>{console.log(m)}})};return s.jsx(S,{onSubmit:A,children:s.jsxs("div",{className:"w-full space-y-5",children:[s.jsxs("div",{className:"md:flex gap-2",children:[s.jsx("div",{className:"w-full md:w-3/12 font-bold md:font-normal my-auto",children:s.jsx(z,{value:"Akun Pembayaran Gaji Staff",htmlFor:"staff_salary_expense"})}),s.jsxs("div",{className:"w-full md:w-7/12 my-auto",children:[s.jsx(D,{resources:n,selected:t,setSelected:r=>N(r),maxHeight:"max-h-40",placeholder:"Cari Akun",id:"staff_salary_expense",isError:!!(d!=null&&d.staff_salary_expense)}),(t==null?void 0:t.code)&&s.jsxs("div",{className:"absolute text-xs",children:["Kode: ",t.code]})]})]}),s.jsxs("div",{className:"pt-10 space-x-2",children:[s.jsx(C,{onClick:()=>l(!1),children:"Batal"}),s.jsx(u,{disabled:b,children:e?"Ubah":"Tambah"})]})]})})}const K=Object.freeze(Object.defineProperty({__proto__:null,default:h},Symbol.toStringTag,{value:"Module"})),o=i.createContext();function f({organization:a,accountStaff:e,accounts:n}){const[l,x]=i.useState(!1);return s.jsxs(o.Provider,{value:{isEdit:l,setIsEdit:x},children:[s.jsx(E,{title:"Data Akun"}),s.jsx(P,{}),s.jsx("div",{className:'sm:pt-0 pb-16 pt-12 print:font-["Open_Sans"]',children:s.jsx("div",{className:"bg-white py-2 sm:pt-0 md:px-10 px-2 space-4",children:l?s.jsx(h,{accountStaff:e,accounts:n,organization:a}):s.jsx(j,{accountStaff:e})})})]})}f.layout=a=>s.jsx(I,{header:s.jsx(w,{children:"Daftar Akun Staf"}),children:a,user:a.props.auth.user,organization:a.props.organization,title:"Data Akun",backLink:s.jsx(p,{href:route("data-ledger",a.props.organization.id),children:s.jsx(O,{})}),breadcrumbs:s.jsx("div",{className:"text-sm breadcrumbs",children:s.jsxs("ul",{children:[s.jsx("li",{className:"font-bold",children:s.jsx(p,{href:route("data-ledger",a.props.organization.id),children:"Buku Besar"})}),s.jsx("li",{children:"Daftar Akun Staf"})]})}),role:a.props.role});const Q=Object.freeze(Object.defineProperty({__proto__:null,AccountStaffState:o,default:f},Symbol.toStringTag,{value:"Module"}));function j({accountStaff:a}){var n,l;const{setIsEdit:e}=i.useContext(o);return s.jsxs("div",{className:"w-full space-y-3",children:[s.jsxs("div",{className:"md:flex gap-2",children:[s.jsxs("div",{className:"w-full md:w-3/12 font-bold md:font-normal",children:["Akun Pembayaran Gaji Staff ",s.jsx("span",{className:"md:hidden",children:":"})]}),s.jsxs("div",{className:"w-full md:w-7/12 my-auto",children:[s.jsx("span",{className:"hidden md:inline",children:": "}),(n=a==null?void 0:a.staff_salary_expense)==null?void 0:n.code," - ",(l=a==null?void 0:a.staff_salary_expense)==null?void 0:l.name]})]}),s.jsx("div",{className:"pt-10",children:s.jsx(u,{onClick:()=>e(!0),children:"Ubah"})})]})}const W=Object.freeze(Object.defineProperty({__proto__:null,default:j},Symbol.toStringTag,{value:"Module"}));export{K as A,Q as I,W as a};