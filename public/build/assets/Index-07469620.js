import{r as n,y as N,j as e,Y as f,a}from"./app-71a08f08.js";import w from"./Container-d6af48f0.js";import{H as i}from"./Header-1bd6e118.js";import{c as b,d as x,n as h,u as v}from"./index.esm-e93d8aec.js";import{T as y}from"./TextInput-d3c17b84.js";import{r as m}from"./rupiah-b8d6b255.js";import{o as g,u as $}from"./usePrevious-05b7ccb4.js";import{P as S}from"./PrimaryButton-efd14abd.js";import"./iconBase-0837d2ad.js";function _({organization:d,organizationInvoices:r,searchFilter:j}){const[t,c]=n.useState(j||""),[u]=g(t,500),o=$(t);n.useEffect(()=>{o!==void 0&&p()},[u]);const p=s=>{N.reload({only:["organizationInvoices"],data:{search:t}})};return e.jsxs(e.Fragment,{children:[e.jsx(f,{title:"Organization"}),e.jsxs(w,{children:[e.jsxs("div",{className:"sm:hidden",children:[e.jsxs("div",{className:"px-6 py-6 fixed w-full bg-white z-20",children:[e.jsxs("div",{className:"flex ",children:[e.jsx(a,{href:"/organizations",className:"w-2/12 my-auto text-lg",children:e.jsx(b,{})}),e.jsx(i,{children:"Invoice Perpanjangan Layanan"})]}),e.jsx("div",{className:"mt-5",children:e.jsx("div",{className:"flex w-full border px-3 rounded-lg",children:e.jsx("input",{type:"search",className:"border-0 w-full focus:border-0 focus:border-white focus:ring-0",placeholder:"Cari Invoice",onChange:s=>c(s.target.value)})})})]}),e.jsx("div",{className:"pt-32 text-gray-800",children:r.map((s,l)=>e.jsxs("div",{className:"bg-white shadow-sm px-6 py-3 flex border",children:[e.jsxs("div",{className:"w-6/12",children:[e.jsx("div",{children:s.no_ref}),e.jsx("div",{className:"uppercase",children:s.product}),e.jsxs("div",{children:["Status:",e.jsxs("span",{className:`italic
                                                    ${s.status=="paid"&&"text-green-600"}
                                                    ${s.status=="pending"&&"text-yellow-600"}
                                                    ${s.status=="canceled"&&"text-red-600"}
                                                `,children:[s.status=="paid"&&"Telah Bayar",s.status=="pending"&&"Menunggu",s.status=="canceled"&&"Dibatalkan"]})]})]}),e.jsx("div",{className:"w-5/12 text-end text-xl my-auto",children:m(s.price)}),e.jsx("div",{className:"w-1/12 my-auto text-end",children:e.jsxs("div",{className:"dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100",children:e.jsx(x,{})}),e.jsx("ul",{tabIndex:0,className:"dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 z-10",children:e.jsx("li",{children:e.jsxs(a,{href:`/organizations/${d.id}/invoices/${s.id}`,children:[e.jsx(h,{})," Detail"]})})})]})})]},l))})]}),e.jsxs("div",{className:"hidden sm:block",children:[e.jsxs("div",{className:"pb-4",children:[e.jsxs("div",{className:"flex py-6",children:[e.jsx("div",{className:"w-1/2 text-end text-sm breadcrumbs my-auto",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(a,{href:"/organizations",children:"Daftar Organisasi"})}),e.jsx("li",{children:"Invoice Perpanjangan Layanan "})]})}),e.jsx("div",{className:"w-1/2 my-auto text-end",children:e.jsx(i,{children:"Invoice Perpanjangan Layanan"})})]}),e.jsxs("div",{className:"flex justify-between",children:[e.jsx(y,{className:"w-1/2",type:"search",placeholder:"Cari Invoice",onChange:s=>c(s.target.value)}),e.jsx(a,{href:`/organizations/${d.id}/invoices/create`,children:e.jsxs(S,{className:"space-x-2",children:[e.jsx(v,{className:"text-xl"}),e.jsx("span",{children:"Berlangganan"})]})})]})]}),e.jsxs("section",{className:"py-3",children:[e.jsxs("div",{className:"flex font-bold border-b-2 pb-2 border-gray-500",children:[e.jsx("div",{className:"w-3/12 text-center",children:"Tanggal"}),e.jsx("div",{className:"w-2/12 text-center",children:"No Ref"}),e.jsx("div",{className:"w-2/12 text-center",children:"Layanan"}),e.jsx("div",{className:"w-2/12 text-center",children:"Status"}),e.jsx("div",{className:"w-2/12 text-end",children:"Total"}),e.jsx("div",{className:"w-1/12 text-center"})]}),e.jsx("div",{className:"max-h-[24rem] overflow-auto z-20",children:r.map((s,l)=>e.jsxs("div",{className:"flex my-3",children:[e.jsx("div",{className:"w-3/12 text-center my-auto",children:s.date}),e.jsx("div",{className:"w-2/12 text-center my-auto",children:s.no_ref}),e.jsx("div",{className:"w-2/12 text-center my-auto",children:s.product}),e.jsxs("div",{className:`w-2/12 text-center my-auto
                                            ${s.status=="paid"&&"text-green-600"}
                                            ${s.status=="pending"&&"text-yellow-600"}
                                            ${s.status=="canceled"&&"text-red-600"}
                                        `,children:[s.status=="paid"&&"Telah Bayar",s.status=="pending"&&"Menunggu",s.status=="canceled"&&"Dibatalkan"]}),e.jsxs("div",{className:"w-2/12 text-end my-auto",children:[m(s.price),"  "]}),e.jsxs("div",{className:"w-1/12 text-end dropdown dropdown-left",children:[e.jsx("div",{tabIndex:0,role:"button",className:"btn bg-white border-none hover:bg-gray-100",children:e.jsx(x,{})}),e.jsx("ul",{tabIndex:0,className:"dropdown-content menu p-2 bg-base-100 rounded-box w-52 z-10",children:e.jsx("li",{children:e.jsxs(a,{href:`/organizations/${d.id}/invoices/${s.id}`,children:[e.jsx(h,{})," Detail"]})})})]})]},l))})]})]})]})]})}export{_ as default};