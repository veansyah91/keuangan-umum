import{r as t,j as e,Y as je,y as pe,a as T}from"./app-f39f5256.js";import{D as H,A as fe}from"./AuthenticatedLayout-e2125e6a.js";import{H as ve}from"./Header-39ce6dc8.js";import{s as Y,t as Ne,c as be}from"./index.esm-1a465fb0.js";import{S as ge}from"./SecondaryButton-12c497fc.js";import{d as K}from"./index.esm-1a801f03.js";import{P as R}from"./PrimaryButton-e7612656.js";import{f as O}from"./formatNumber-b542c689.js";import{d as u}from"./dayjs.min-2681d619.js";import ye from"./LedgerContent-7f6d5981.js";import{I as k}from"./InputLabel-4d406470.js";import{C as v}from"./ClientSelectInput-47bc114d.js";import{j as M}from"./disclosure-f2ee139a.js";import{z as we}from"./transition-4036d903.js";import"./ApplicationLogo-dae171ed.js";import"./iconBase-62f121b1.js";/* empty css                      */import"./combobox-761de6bb.js";import"./portal-ca4f363a.js";import"./close-provider-e51f726a.js";function De({ledgers:r,accounts:$,startedValue:z,organization:i,startDateFilter:N,endDateFilter:b,departments:g,projects:y,programs:w,department:c,project:o,program:m,account:x}){const[U,_]=t.useState([]),[d,q]=t.useState(N||""),[n,G]=t.useState(b||""),[P,f]=t.useState(!1),[C,J]=t.useState({startValue:0,endValue:0}),[Q,W]=t.useState({startDate:N||"",endDate:N||""}),[X,Z]=t.useState({startDate:b||"",endDate:b||""}),[a,ee]=t.useState({id:x?x.id:null,name:x?x.name:"",code:x?x.code:""}),[se,Se]=t.useState(""),[h,E]=t.useState({id:o?o.id:null,name:o?o.name:"",code:o?o.code:""}),[te,Ye]=t.useState(""),[j,L]=t.useState({id:m?m.id:null,name:m?m.name:"",code:m?m.code:""}),[ae,ke]=t.useState(""),[p,B]=t.useState({id:c?c.id:null,name:c?c.name:"",code:c?c.code:""}),[le,Me]=t.useState("");t.useEffect(()=>{V(r,z)},[]);const re=s=>{ee(s)},de=s=>{L(s)},ne=()=>{L({id:null,name:"",code:""})},ie=s=>{E(s)},ce=()=>{E({id:null,name:"",code:""})},oe=s=>{B(s)},me=()=>{B({id:null,name:"",code:""})},xe=s=>{W(s),q(u(s.endDate).format("YYYY-MM-DD"))},ue=s=>{Z(s),G(u(s.endDate).format("YYYY-MM-DD"))},A=()=>{pe.reload({only:["ledgers","startedValue"],data:{startDate:d,endDate:n,program:j.id,project:h.id,department:p.id,account:a.id},onBefore:s=>{s.completed?f(!1):f(!0)},onSuccess:s=>{V(s.props.ledgers,s.props.startedValue)},onError:s=>{console.log(s)},onFinish:s=>{s.completed?f(!1):f(!0)},preserveState:!0})},V=(s,l)=>{let D=l,I=[];s.map((S,he)=>{D+=S.debit-S.credit,I[he]={...S,total:D}}),_(I),J({startValue:l,endValue:D})},F=()=>{window.print()};return e.jsxs(e.Fragment,{children:[e.jsx(je,{title:`Laporan Buku Besar Periode : ${u(d).format("MMMM DD, YYYY")} - ${u(n).format("MMMM DD, YYYY")}`}),e.jsx("div",{className:"md:pt-0 pb-16 pt-12",children:e.jsxs("div",{className:"bg-white py-2 md:pt-0 px-5 space-y-2",children:[e.jsxs("div",{className:"flex md:flex-row justify-between gap-2 print:hidden",children:[e.jsxs("div",{className:"px-3 my-auto flex flex-col md:flex-row gap-3 w-full md:w-2/3",children:[e.jsxs("div",{className:"my-auto w-full",children:[e.jsx(v,{resources:$,selected:a,setSelected:s=>re(s),maxHeight:"max-h-40",placeholder:"Cari Akun",isError:!!se,id:"account"}),(a==null?void 0:a.code)&&e.jsxs("div",{className:"absolute text-xs",children:["Kode: ",a.code]})]}),e.jsx("div",{className:"my-auto w-full",children:e.jsx(H,{value:Q,onChange:xe,useRange:!1,asSingle:!0,placeholder:"Tanggal Awal",id:"date",displayFormat:"MMMM DD, YYYY"})}),e.jsx("div",{className:"my-auto w-full",children:e.jsx(H,{value:X,onChange:ue,useRange:!1,asSingle:!0,placeholder:"Tanggal Akhir",id:"date",displayFormat:"MMMM DD, YYYY"})}),e.jsx("div",{className:"my-auto hidden md:block",children:e.jsx(R,{disabled:!a.id||!d||!n||d>n||P,onClick:A,children:"Filter"})})]}),e.jsx("div",{className:"text-end px-3 hidden md:block print:flex print:justify-between",children:e.jsx(ge,{onClick:F,children:e.jsxs("div",{className:"flex gap-2",children:[e.jsx("div",{className:"my-auto",children:e.jsx(K,{})}),e.jsx("div",{className:"my-auto",children:"Print"})]})})}),e.jsx("div",{className:"fixed md:hidden bottom-2 right-2",children:e.jsx("button",{onClick:F,className:"bg-white border-2 border-slate-900 p-2 rounded-full h-14 w-14",children:e.jsx("div",{className:"flex gap-2",children:e.jsx("div",{className:"my-auto mx-auto",children:e.jsx(K,{})})})})})]}),w.length>0||y.length>0||g.length?e.jsx(M,{as:"div",className:"mt-3 print:hidden",children:({open:s})=>e.jsxs(e.Fragment,{children:[e.jsx(we,{enter:"transition duration-100 ease-out",enterFrom:"transform scale-95 opacity-0",enterTo:"transform scale-100 opacity-100",leave:"transition duration-75 ease-out",leaveFrom:"transform scale-100 opacity-100",leaveTo:"transform scale-95 opacity-0",children:e.jsx(M.Panel,{children:e.jsxs("div",{className:"flex flex-col md:flex-row justify-start gap-3 md:py-5 mb-3",children:[w.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(k,{value:"Program Kegiatan",htmlFor:"program"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:w,selected:j,setSelected:l=>de(l),maxHeight:"max-h-40",placeholder:"Cari Program Kegiatan",isError:!!ae,id:"program"}),j.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",j.code]})]}),j.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:ne,children:e.jsx(Y,{})})})]})]}),y.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(k,{value:"Proyek",htmlFor:"project"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:y,selected:h,setSelected:l=>ie(l),maxHeight:"max-h-40",placeholder:"Cari Proyek",isError:!!te,id:"project"}),h.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",h.code]})]}),h.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:ce,children:e.jsx(Y,{})})})]})]}),g.length>0&&e.jsxs("div",{className:"md:w-1/3 w-full text-slate-900 space-y-2",children:[e.jsx("div",{children:e.jsx(k,{value:"Departemen",htmlFor:"department"})}),e.jsxs("div",{className:"flex w-full relative",children:[e.jsxs("div",{className:"w-5/6",children:[e.jsx(v,{resources:g,selected:p,setSelected:l=>oe(l),maxHeight:"max-h-40",placeholder:"Cari Departemen",isError:!!le,id:"department"}),p.id&&e.jsxs("span",{className:"text-xs absolute",children:["Kode: ",p.code]})]}),p.id&&e.jsx("div",{className:"w-1/6 my-auto",children:e.jsx("button",{type:"button",className:"text-red-500 text-xl hover:bg-slate-200 rounded-full p-2",onClick:me,children:e.jsx(Y,{})})})]})]})]})})}),e.jsx(M.Button,{className:"flex w-full justify-between rounded-lg bg-slate-100 px-4 py-2 text-left text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring focus-visible:ring-slate-500/75",children:e.jsxs("div",{className:"flex justify-center w-full gap-3",children:[e.jsxs("span",{children:["Tampilkan Lebih ",s?"Sedikit":"Banyak"]}),e.jsx(Ne,{className:`${s?"":"rotate-180 transform"} h-5 w-5 text-slate-500`})]})})]})}):"",e.jsx("div",{className:"md:hidden w-full print:hidden",children:e.jsx(R,{disabled:!a.id||!d||!n||d>n||P,onClick:A,className:"w-full",children:e.jsx("div",{className:"text-center w-full",children:"Filter"})})}),e.jsxs("div",{className:"uppercase pb-3 border-b hidden print:flex print:justify-between",children:[e.jsx("div",{className:"w-1/2 text-2xl my-auto",children:"Laporan Buku Besar"}),e.jsxs("div",{className:"w-1/2 text-end mt-auto",children:[e.jsx("div",{children:i.name}),e.jsx("div",{className:"text-xs",children:i.address}),e.jsxs("div",{className:"text-xs",children:[i.village,", ",i.district,", ",i.regency,","," ",i.province]})]})]}),e.jsxs("div",{className:"w-full mt-3 hidden print:flex print:justify-between",children:[e.jsxs("div",{className:"uppercase",children:["Akun : ",a.code," - ",a.name]}),e.jsxs("div",{className:"text-end italic",children:["Periode : ",u(d).format("MMMM DD, YYYY")," -"," ",u(n).format("MMMM DD, YYYY")]})]}),e.jsx("div",{className:"my-2 -mx-5 space-y-3 print:font-['Open_Sans'] overflow-auto",children:e.jsx("div",{className:"md:w-full w-[550px] print:w-full",children:e.jsxs("table",{className:"table uppercase table-zebra table-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"text-slate-900 font-bold border-b-2 border-slate-900",children:[e.jsx("th",{className:"w-1/12",children:"tanggal"}),e.jsx("th",{children:"ref"}),e.jsx("th",{children:"Dekripsi"}),e.jsx("th",{className:"text-end",children:"debit"}),e.jsx("th",{className:"text-end",children:"kredit"}),e.jsx("th",{className:"text-end",children:"total"}),e.jsx("th",{children:"Note"})]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{className:"font-bold",children:[e.jsx("td",{colSpan:5,children:"Nilai Awal"}),e.jsxs("td",{className:"text-end",children:["IDR. ",O(C.startValue)]})]}),U.map((s,l)=>e.jsx(ye,{ledger:s},l)),e.jsxs("tr",{className:"font-bold",children:[e.jsx("td",{colSpan:5,children:"Nilai Akhir"}),e.jsxs("td",{className:"text-end",children:["IDR. ",O(C.endValue)]}),e.jsx("td",{})]})]})]})})})]})})]})}De.layout=r=>e.jsx(fe,{header:e.jsx(ve,{children:"Laporan Buku Besar Per Akun"}),children:r,user:r.props.auth.user,organization:r.props.organization,title:"Laporan Buku Besar Per Akun",backLink:e.jsx(T,{href:route("report",r.props.organization.id),children:e.jsx(be,{})}),breadcrumbs:e.jsx("div",{className:"text-sm breadcrumbs",children:e.jsxs("ul",{children:[e.jsx("li",{className:"font-bold",children:e.jsx(T,{href:route("report",r.props.organization.id),children:"Laporan"})}),e.jsx("li",{children:"Laporan Buku Besar Per Akun"})]})}),role:r.props.role});export{De as default};