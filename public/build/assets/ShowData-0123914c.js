import{r as d,j as e}from"./app-b1bae4cf.js";import n from"./EditLevelStudent-92011b03.js";import{d as l,e as c}from"./index.esm-cc030e73.js";import"./TextInput-03bbc330.js";import"./dayjs.min-b8e970d9.js";import"./index.esm-d0faee50.js";import"./iconBase-d2085e51.js";import"./index.esm-b12a38df.js";function w({level:s,organizationId:r}){const[t,i]=d.useState(!1),a=()=>{i(!t)},o=()=>{i(!1)};return t?e.jsx(n,{level:s,cancelEdit:o,organizationId:r}):e.jsxs("div",{className:"flex flex-col sm:flex-row justify-between gap-1",children:[e.jsx("div",{className:"w-2/5",children:s.year}),e.jsx("div",{className:"w-2/5",children:s.level}),e.jsx("div",{className:"w-1/5",children:e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"bg-inherit border-none hover:bg-gray-100 -z-50 text-gray-300'",children:e.jsx(l,{})}),e.jsx("ul",{tabIndex:0,className:"dropdown-content z-[50] menu p-2 shadow bg-base-100 rounded-box w-56",children:e.jsx("li",{children:e.jsxs("button",{onClick:a,children:[e.jsx(c,{})," Edit"]})})})]})})]})}export{w as default};