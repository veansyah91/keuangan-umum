import{r as c,j as e}from"./app-71a08f08.js";import{f as i}from"./formatNumber-b542c689.js";function w({title:a,ledgers:d,showCode:n,type:l,amount:x}){const[r,t]=c.useState({start:"",end:""});c.useEffect(()=>{p(l)},[]);const p=s=>{switch(s){case"revenue":t({start:"400000000",end:"499999999"});break;case"variable-cost":t({start:"500000000",end:"599999999"});break;case"fixed-cost":t({start:"600000000",end:"699999999"});break;case"depreciated-cost":t({start:"700000000",end:"799999999"});break;case"other-cost":t({start:"800000000",end:"899999999"});break}};return e.jsxs("div",{className:"mt-3",children:[e.jsx("div",{className:"uppercase font-bold w-full text-lg",children:a}),d.map((s,o)=>s.code>=r.start&&s.code<=r.end&&e.jsxs("div",{className:"flex w-full justify-between my-2",children:[e.jsxs("div",{className:`w-6/12 print:w-8/12 uppercase flex gap-2 ${n?"pl-0":"pl-2"}`,children:[e.jsx("div",{className:`w-1/3 text-end ${n?"block":"hidden"}`,children:s.code}),e.jsx("div",{className:"w-2/3",children:s.name})]}),e.jsxs("div",{className:"w-2/12 print:w-4/12 text-center flex justify-end gap-3",children:[e.jsx("div",{className:"w-1/4 print:w-2/4 text-end",children:"Rp. "}),e.jsx("div",{className:"w-3/4 print:w-2/4 text-end",children:i(s.code<"500000000"?parseInt(s.total)*-1:parseInt(s.total))})]})]},o)),e.jsxs("div",{className:"flex border-t w-full justify-between py-2 font-bold",children:[e.jsxs("div",{className:"w-5/12 print:w-8/12 uppercase flex gap-2",children:["Total ",a]}),e.jsxs("div",{className:"w-2/12 print:w-4/12 text-center flex justify-end gap-3",children:[e.jsx("div",{className:"w-1/4 print:w-2/4 text-end",children:"Rp. "}),e.jsx("div",{className:"w-3/4 print:w-2/4 text-end",children:i(x)})]})]})]})}export{w as default};