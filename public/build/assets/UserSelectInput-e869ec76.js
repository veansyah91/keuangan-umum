import{r as l,j as e}from"./app-53c76e57.js";import{o as p,p as g}from"./index.esm-8edc8eb6.js";import{q as i}from"./combobox-254c5f65.js";import{q as v}from"./transition-f3304be6.js";function N({resources:n,selected:r,setSelected:u,maxHeight:m="max-h-60",placeholder:x,className:d="border-gray-300 border"}){const[a,o]=l.useState(""),[c,f]=l.useState(n);return l.useEffect(()=>{const t=a===""?n:n.filter(s=>s.name.toLowerCase().replace(/\s+/g,"").includes(a==null?void 0:a.toLowerCase().replace(/\s+/g,"")));f(t)},[a]),l.useEffect(()=>{o(r==null?void 0:r.name)},[r]),e.jsx(i,{value:r,onChange:u,children:e.jsxs("div",{className:"relative mt-1",children:[e.jsxs("div",{className:`relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left border-gray-300 border focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm ${d}`,children:[e.jsx(i.Input,{className:"w-full py-3 pl-3 pr-10 leading-5 text-gray-800 focus:ring-0 border-none",displayValue:t=>t.email,onChange:t=>o(t.target.value),placeholder:x,type:"search"}),e.jsx(i.Button,{className:"absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 text-lg",children:e.jsx(p,{})})]}),e.jsx(v,{as:l.Fragment,leave:"transition ease-in duration-100",leaveFrom:"opacity-100",leaveTo:"opacity-0",children:e.jsx(i.Options,{className:`absolute mt-1 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm ${m} z-10`,children:c.length===0&&a!==""?e.jsx("div",{className:"relative cursor-default select-none px-4 py-2 text-gray-700",children:"Nothing found."}):c.map(t=>e.jsx(i.Option,{className:({active:s})=>`relative flex cursor-default select-none py-2 pl-10 pr-4 ${s?"bg-teal-600 text-white":"text-gray-900"}`,value:t,children:({selected:s,active:h})=>e.jsxs(e.Fragment,{children:[e.jsxs("div",{className:`block truncate ${s?"font-medium":"font-normal"}`,children:[e.jsx("div",{children:t.email}),e.jsx("div",{className:"text-xs",children:t.name})]}),s?e.jsx("div",{className:`absolute inset-y-0 left-0 flex items-center pl-3 ${h?"text-white":"text-teal-600"}`,children:e.jsx(g,{className:"h-5 w-5","aria-hidden":"true"})}):null]})},t.id))})})]})})}export{N as U};