import{r as t,j as e,Y as je,y as pe,a as T}from"./app-60093d8b.js";import{D as H,A as fe}from"./AuthenticatedLayout-f4603aa5.js";import{H as ve}from"./Header-fccd1917.js";import{o as k,r as Ne,c as be}from"./index.esm-53cbca2f.js";import{S as ge}from"./SecondaryButton-a2ff8619.js";import{F as K}from"./index.esm-5a3712cd.js";import{P as R}from"./PrimaryButton-bffcd700.js";import{f as O}from"./formatNumber-b542c689.js";import{d as f}from"./dayjs.min-af66fe14.js";import ye from"./LedgerContent-73bed3dc.js";import{I as M}from"./InputLabel-fb90ae77.js";import{C as v}from"./ClientSelectInput-3a8311ae.js";import{A as P}from"./disclosure-84c5cc71.js";import{q as we}from"./transition-69a0c110.js";import"./ApplicationLogo-07518b23.js";import"./iconBase-bb6eae91.js";/* empty css                      */import"./combobox-b8c83591.js";import"./keyboard-8f7a194a.js";function Se({ledgers:r,accounts:$,startedValue:q,organization:i,startDateFilter:N,endDateFilter:b,departments:g,projects:y,programs:w,department:c,project:o,program:m,account:x}){const[U,_]=t.useState([]),[d,z]=t.useState(N||""),[n,G]=t.useState(b||""),[Y,p]=t.useState(!1),[C,J]=t.useState({startValue:0,endValue:0}),[Q,W]=t.useState({startDate:N||"",endDate:N||""}),[X,Z]=t.useState({startDate:b||"",endDate:b||""}),[a,ee]=t.useState({id:x?x.id:null,name:x?x.name:"",code:x?x.code:""}),[se,De]=t.useState(""),[u,E]=t.useState({id:o?o.id:null,name:o?o.name:"",code:o?o.code:""}),[te,ke]=t.useState(""),[h,L]=t.useState({id:m?m.id:null,name:m?m.name:"",code:m?m.code:""}),[ae,Me]=t.useState(""),[j,A]=t.useState({id:c?c.id:null,name:c?c.name:"",code:c?c.code:""}),[le,Pe]=t.useState("");t.useEffect(()=>{V(r,q)},[]);const re=s=>{ee(s)},de=s=>{L(s)},ne=()=>{L({id:null,name:"",code:""})},ie=s=>{E(s)},ce=()=>{E({id:null,name:"",code:""})},oe=s=>{A(s)},me=()=>{A({id:null,name:"",code:""})},xe=s=>{W(s),z(s.startDate)},ue=s=>{Z(s),G(s.endDate)},B=()=>{pe.reload({only:["ledgers","startedValue"],data:{startDate:d,endDate:n,program:h.id,project:u.id,department:j.id,account:a.id},onBefore:s=>{s.completed?p(!1):p(!0)},onSuccess:s=>{V(s.props.ledgers,s.props.startedValue)},onError:s=>{console.log(s)},onFinish:s=>{s.completed?p(!1):p(!0)},preserveState:!0})},V=(s,l)=>{let S=l,I=[];s.map((D,he)=>{S+=D.debit-D.credit,I[he]={...D,total:S}}),_(I),J({startValue:l,endValue:S})},F=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx(je,{title:`Laporan Buku Besar Periode : ${f(d).format("MMMM DD, YYYY")} - ${f(n).format("MMMM DD, YYYY")}`}),e.jsx("div",{className:"md:pt-0 pb-16 pt-12",children:e.jsxs("div",{className:"bg-white py-2 md:pt-0 px-5 space-y-2",children:[e.jsxs("div",{className:"flex md:flex-row justify-between gap-2 print:hidden",children:[e.jsxs("div",{className:"px-3 my-auto flex flex-col md:flex-row gap-3 w-full md:w-2/3",children:[e.jsxs("div",{className:"my-auto w-full",children:[e.jsx(v,{resources:$,selected:a,setSelected:s=>re(s),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!se,id:"account"}),(a==null?void 0:a.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",a.code]})]}),e.jsx("div",{className:"my-auto w-full",children:e.jsx(H,{value:Q,onChange:xe,useRange:!1,asSingle:!0,placeholder:"Tanggal Awal",id:"date",displayFormat:"MMMM DD, YYYY"})}),e.jsx("div",{className:"my-auto w-full",children:e.jsx(H,{value:X,onChange:ue,useRange:!1,asSingle:!0,placeholder:"Tanggal Akhir",id:"date",displayFormat:"MMMM DD, YYYY"})}),e.jsx("div",{className:"my-auto hidden md:block",children:e.jsx(R,{disabled:!a.id||!d||!n||d>n||Y,onClick:B,children:"Filter"})})]}),e.jsx("div",{className:"text-end px-3 hidden md:block print:flex print:justify-between",children:e.jsx(ge,{onClick:F,children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"my-auto",children:e.jsx(K,{})}),e.jsx("div",{className:"my-auto",children:"Print"})]})})}),e.jsx("div",{className:"fixed md:hidden bottom-2 right-2",children:e.jsx("button",{onClick:F,className:"bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14",children:e.jsx("div",{className:"flex gap-2",children:e.jsx("div",{className:"my-auto mx-auto",children:e.jsx(K,{})})})})})]}),w.length>0||y.length>0||g.length?e.jsx(P,{as:"div",className:"mt-3 print:hidden",children:({open:s})=>e.jsxs(e.Fragment,{children:[e.jsx(we,{enter:"transition duration-100 ease-out",enterFrom:"transform scale-95 opacity-0",enterTo:"transform scale-100 opacity-100",leave:"transition duration-75 ease-out",leaveFrom:"transform scale-100 opacity-100",leaveTo:"transform scale-95 opacity-0",children:e.jsx(P.Panel,{children:e.jsxs("div",{className:"flex flex-col md:flex-row justify-start gap-3 md:py-5 mb-3",children:[w.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(M,{value:"Program Kegiatan",htmlFor:"program"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:w,selected:h,setSelected:l=>de(l),maxHeight:"max-h-40",placeholder:"Cari Program Kegiatan",isError:!!ae,id:"program"}),h.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",h.code]})]}),h.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:ne,children:e.jsx(k,{})})})]})]}),y.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(M,{value:"Proyek",htmlFor:"project"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:y,selected:u,setSelected:l=>ie(l),maxHeight:"max-h-40",placeholder:"Cari Proyek",isError:!!te,id:"project"}),u.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",u.code]})]}),u.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:ce,children:e.jsx(k,{})})})]})]}),g.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(M,{value:"Departemen",htmlFor:"department"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:g,selected:j,setSelected:l=>oe(l),maxHeight:"max-h-40",placeholder:"Cari Departemen",isError:!!le,id:"department"}),j.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",j.code]})]}),j.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:me,children:e.jsx(k,{})})})]})]})]})})}),e.jsx(P.Button,{className:"flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75",children:e.jsxs("div",{className:"flex justify-center w-full gap-3",children:[e.jsxs("span",{children:["Tampilkan Lebih ",s?"Sedikit":"Banyak"]}),e.jsx(Ne,{className:`${s?"":"rotate-180 transform"} h-5 w-5 text-slate-500`})]})})]})}):"",e.jsx("div",{className:"md:hidden w-full print:hidden",children:e.jsx(R,{disabled:!a.id||!d||!n||d>n||Y,onClick:B,className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Filter"})})}),e.jsxs("div",{className:"uppercase pb-3 border-b hidden print:flex print:justify-between",children:[e.jsx("div",{className:"w-1/2 text-2xl my-auto",children:"Laporan Buku Besar"}),e.jsxs("div",{className:"w-1/2 text-end mt-auto",children:[e.jsx("div",{children:i.name}),e.jsx("div",{className:"text-xs",children:i.address}),e.jsxs("div",{className:"text-xs",children:[i.village,", ",i.district,", ",i.regency,","," ",i.province]})]})]}),e.jsxs("div",{className:"w-full mt-3 hidden print:flex print:justify-between",children:[e.jsxs("div",{className:"uppercase",children:["Akun : ",a.code," - ",a.name]}),e.jsxs("div",{className:"text-end italic",children:["Periode : ",f(d).format("MMMM DD, YYYY")," -"," ",f(n).format("MMMM DD, YYYY")]})]}),e.jsx("div",{className:"my-2 -mx-5 space-y-3 print:font-['Open_Sans'] overflow-auto",children:e.jsx("div",{className:"md:w-full w-[550px] print:w-full",children:e.jsxs("table",{className:"table uppercase table-zebra table-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"text-slate-900 font-bold border-b-2 border-slate-900",children:[e.jsx("th",{className:"w-1/12",children:"tanggal"}),e.jsx("th",{children:"ref"}),e.jsx("th",{children:"Dekripsi"}),e.jsx("th",{className:"text-end",children:"debit"}),e.jsx("th",{className:"text-end",children:"kredit"}),e.jsx("th",{className:"text-end",children:"total"}),e.jsx("th",{children:"Note"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"font-bold",children:[e.jsx("td",{colSpan:5,children:"Nilai Awal"}),e.jsxs("td",{className:"text-end",children:["IDR. ",O(C.startValue)]})]}),U.map((s,l)=>e.jsx(ye,{ledger:s},l)),e.jsxs("tr",{className:"font-bold",children:[e.jsx("td",{colSpan:5,children:"Nilai Akhir"}),e.jsxs("td",{className:"text-end",children:["IDR. ",O(C.endValue)]}),e.jsx("td",{})]})]})]})})})]})})]})}Se.layout=r=>e.jsx(fe,{header:e.jsx(ve,{children:"Laporan Buku Besar Per Akun"}),children:r,user:r.props.auth.user,organization:r.props.organization,title:"Laporan Buku Besar Per Akun",backLink:e.jsx(T,{href:route("report",r.props.organization.id),children:e.jsx(be,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(T,{href:route("report",r.props.organization.id),children:"Laporan"})}),e.jsx("li",{children:"Laporan Buku Besar Per Akun"})]})}),role:r.props.role});export{Se as default};