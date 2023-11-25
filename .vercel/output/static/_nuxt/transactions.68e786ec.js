import{_ as g}from"./Icon.07c0a2dc.js";import{_ as w}from"./Button.vue.80a47160.js";import{_ as R,a as M,b as V,c as U,d as x,e as $,f as b,g as B,h as k,i as D,j as L}from"./DataTableRowActions.vue.9c3543db.js";import{_ as j}from"./DropdownMenuShortcut.vue.a6ac1ff2.js";import{_ as O}from"./SelectGroup.vue.8c95a5fa.js";import{f as I,i as N,o as y,c as f,a as d,b as e,u as v,w as n,d as u,D as P,k as l,l as H}from"./entry.75c470a4.js";import"./index.df58e121.js";import"./index.5e16e95e.js";import"./chevron-down.a229a8d5.js";import"./createLucideIcon.ef9e6436.js";import"./index.df05a566.js";const z={class:"flex pt-10 gap-10 w-full mb-10 h-full justify-between"},G={class:"space-y-4 w-full"},q={class:"flex items-center self-start gap-4"},J={key:0,class:"space-y-6 shadow-lg p-10 border-[1px]"},Q=d("h1",{class:"text-xl text-left font-semibold text-primary"}," Filter Data By ",-1),W={class:"grid grid-cols-3 items-center gap-7"},X={class:"space-y-2"},Y=d("label",{for:"activityType"},"Activity Type",-1),Z={class:"space-y-2"},ee=d("label",{for:"date"},"Date",-1),ae={class:"space-y-2"},te=d("label",{for:"amount"},"Amount",-1),oe=I({__name:"TransactionLogsDataTableFilterbar",props:{table:{}},setup(a){const t=N(!1);return(o,s)=>{var S,h,T,E;const m=j,p=g,_=M,A=V,r=U,C=O,K=x,F=$;return y(),f("div",z,[d("div",G,[d("div",q,[e(m,{placeholder:"Search by username, From/To account","model-value":((S=o.table.getColumn("userName"))==null?void 0:S.getFilterValue())??"",class:"h-10 w-[150px] lg:w-[350px]",onInput:s[0]||(s[0]=i=>{var c;return(c=o.table.getColumn("userName"))==null?void 0:c.setFilterValue(i.target.value)})},null,8,["model-value"]),e(p,{onClick:s[1]||(s[1]=i=>t.value=!v(t)),name:"material-symbols:filter-list",class:"h-8 w-8"})]),v(t)?(y(),f("div",J,[Q,d("div",W,[d("div",X,[Y,e(F,{id:"activityType","model-value":((h=o.table.getColumn("activityType"))==null?void 0:h.getFilterValue())??"",class:"h-10 w-[150px] lg:w-[250px]",onInput:s[2]||(s[2]=i=>{var c;return(c=o.table.getColumn("activityType"))==null?void 0:c.setFilterValue(i.target.value)})},{default:n(()=>[e(A,{class:"w-[180px]"},{default:n(()=>[e(_,{placeholder:"Activity Type"})]),_:1}),e(K,null,{default:n(()=>[e(C,null,{default:n(()=>[e(r,{value:"n/a"},{default:n(()=>[u("N/A ")]),_:1}),e(r,{value:"Activity1"},{default:n(()=>[u("Activity1 ")]),_:1}),e(r,{value:"Activity2"},{default:n(()=>[u("Activity2 ")]),_:1})]),_:1})]),_:1})]),_:1},8,["model-value"])]),d("div",Z,[ee,e(m,{id:"date",placeholder:"Date","model-value":((T=o.table.getColumn("dataAndTime"))==null?void 0:T.getFilterValue())??"",class:"h-10 w-[150px] lg:w-[250px]",onInput:s[3]||(s[3]=i=>{var c;return(c=o.table.getColumn("dataAndTime"))==null?void 0:c.setFilterValue(i.target.value)})},null,8,["model-value"])]),d("div",ae,[te,e(m,{id:"amount",placeholder:"Amount","model-value":((E=o.table.getColumn("amount"))==null?void 0:E.getFilterValue())??"",class:"h-10 w-[150px] lg:w-[250px]",onInput:s[4]||(s[4]=i=>{var c;return(c=o.table.getColumn("amount"))==null?void 0:c.setFilterValue(i.target.value)})},null,8,["model-value"])])])])):P("",!0)]),e(R,{table:o.table},null,8,["table"])])}}}),se=[{id:"select",header:({table:a})=>l(b,{checked:a.getIsAllPageRowsSelected(),"onUpdate:checked":t=>a.toggleAllPageRowsSelected(!!t),ariaLabel:"Select all"}),cell:({row:a})=>l(b,{checked:a.getIsSelected(),"onUpdate:checked":t=>a.toggleSelected(!!t),ariaLabel:"Select row"}),enableSorting:!1,enableHiding:!1},{accessorKey:"module",header:"Module"},{accessorKey:"activityType",header:"Activity Type"},{accessorKey:"customerId",header:"Customer Id"},{accessorKey:"userName",header:"UserName"},{accessorKey:"dataAndTime",header:({column:a})=>l(k,{column:a,title:"dataAndTime"})},{accessorKey:"fromAccount",header:"From Account"},{accessorKey:"toAccount",header:"To Account"},{accessorKey:"amount",header:"amount"},{accessorKey:"currency",header:"Currency"},{accessorKey:"mfaType",header:"MFA Type"},{accessorKey:"mfaSecurityKey",header:"MFA Security Key"},{accessorKey:"mfaState",header:"MFA State"},{accessorKey:"channel",header:"channel"},{accessorKey:"device",header:"Device"},{accessorKey:"os",header:"OS"},{accessorKey:"deviceId",header:"Device Id"},{accessorKey:"ipAddress",header:"IP Address"},{accessorKey:"otherInfo",header:"Other Info"},{header:"Actions",id:"actions",enableHiding:!1,cell:({row:a})=>l("div",{class:"relative"},l(B,{row:a}))}],ce={key:0,class:"py-5 flex flex-col space-y-5 mx-auto"},de={key:1,class:"py-10 flex justify-center w-full"},ve=I({__name:"transactions",setup(a){const t=N([]);async function o(){return[{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2023-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"10000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2020-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"1000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"Activity1",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2021-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"2000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"Activity2",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2022-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"3000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2019-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"4000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2018-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"5000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2023-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"6000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2023-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"7000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"},{module:"MAKE_TRANSFER",activityType:"N/A",customerId:"1002496540",userName:"dbpoluser",dataAndTime:"2023-09-20 08:33:43",fromAccount:0xe8e884deb0,toAccount:0xe8ee77869a,amount:"100000",currency:"ETB",mfaType:"SECURE_ACCESS",mfaSecurityKey:"7aa7as7a8-e8a8ad9a-afd8ad-ad",mfaState:"verify",channel:"mobile",device:"SM-N96F",os:"android",deviceId:"0d0514e2382d9s",ipAddress:"115.113.211.120",otherInfo:"View"}]}return H(async()=>{t.value=await o()}),(s,m)=>{const p=g,_=w,A=L;return t.value.length>0?(y(),f("div",ce,[e(_,{class:"w-fit self-end px-5"},{default:n(()=>[e(p,{name:"material-symbols:download",size:"24",class:"mr-2"}),u("Download List")]),_:1}),e(D,{columns:v(se),data:t.value},{toolbar:n(({table:r})=>[e(oe,{table:r},null,8,["table"])]),_:1},8,["columns","data"])])):(y(),f("div",de,[e(A)]))}}});export{ve as default};