import{r as l,j as e}from"./app-18d344c6.js";import{o as b,p as j}from"./index.esm-11facade.js";import{f as y}from"./formatNumber-b542c689.js";import{H as a}from"./combobox-36f8eaff.js";import{z as N}from"./transition-27a0ae6f.js";import"./iconBase-4b51c5f1.js";import"./portal-3e1f6179.js";function R({payments:i,selected:s,setSelected:u,maxHeight:c="max-h-60",placeholder:x,onCLick:m,isError:f=!0,id:d="",notFound:p=null}){const[h,o]=l.useState(""),[n,v]=l.useState(i);return l.useEffect(()=>{v(i),o(s==null?void 0:s.no_ref)},[i]),e.jsx(a,{value:s,onChange:u,children:e.jsxs("div",{className:"relative mt-1 w-full",children:[e.jsxs("div",{className:`relative w-full cursor-default rounded-md bg-white text-left border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ${f?"border-red-500":"border-gray-300"}`,children:[e.jsx(a.Input,{className:"w-full border-none py-3 pl-3 pr-10 leading-5 text-gray-800 focus:ring-0",displayValue:t=>t.noRef,onChange:t=>o(t.target.value.toUpperCase()),placeholder:x,type:"search",id:d}),e.jsx(a.Button,{className:"absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 text-lg",onClick:m,children:e.jsx(b,{})})]}),e.jsx(N,{as:l.Fragment,leave:"transition ease-in duration-100",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx(a.Options,{className:`absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${c} z-10`,children:n.length===0&&h!==""?e.jsx("div",{className:"relative cursor-default select-none px-4 py-2 text-gray-700",children:p??"Tidak Ada Data"}):n.map(t=>e.jsx(a.Option,{className:({active:r})=>`relative flex cursor-default select-none py-2 pl-10 pr-4 ${r?"bg-teal-600 text-white":"text-slate-900"}`,value:t,children:({selected:r,active:g})=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`block truncate ${r?"font-medium":"font-normal"}`,children:[e.jsxs("div",{className:"text-xs flex",children:["Sisa: IDR. ",y(t.receivable_value)]}),e.jsxs("div",{className:"text-xs flex",children:["Tahun Ajaran: ",t.study_year]}),e.jsx("div",{className:"text-base",children:t.no_ref.toUpperCase()})]}),r?e.jsx("div",{className:`absolute inset-y-0 left-0 flex items-center pl-3 ${g?"text-white":"text-teal-600"}`,children:e.jsx(j,{className:"h-5 w-5","aria-hidden":"true"})}):null]})},t.id))})})]})})}export{R as default};