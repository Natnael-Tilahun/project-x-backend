import{_ as j}from"./Button.vue.80a47160.js";import{_ as N,a as P,b as U,c as k}from"./Tabs.vue.bac7a738.js";import{M as E,c as y,I as T,A as V,D as I,l as O,O as D}from"./index.5e16e95e.js";import{C as M}from"./chevron-down.a229a8d5.js";import{f as d,o as p,g as m,w as t,b as s,u as l,m as g,r as f,a as e,n as S,h as F,i as R,c as z,d as a,j as G}from"./entry.75c470a4.js";import{_ as H}from"./Icon.07c0a2dc.js";import{_ as K}from"./Badge.vue.9469c879.js";import"./createLucideIcon.ef9e6436.js";import"./index.df58e121.js";const L=d({__name:"AccordionTrigger",props:{asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(c){const o=c;return(n,i)=>(p(),m(l(T),{class:"flex",as:"div"},{default:t(()=>[s(l(E),g(o,{class:l(y)("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",o.class)}),{default:t(()=>[f(n.$slots,"default"),s(l(M),{class:"h-4 w-4 shrink-0 transition-transform duration-200"})]),_:3},16,["class"])]),_:3}))}}),q={class:"pb-4 pt-0"},J=d({__name:"AccordionContent",props:{asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(c){const o=c;return(n,i)=>(p(),m(l(V),g(o,{class:l(y)("overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down",o.class)}),{default:t(()=>[e("div",q,[f(n.$slots,"default")])]),_:3},16,["class"]))}}),Q=d({__name:"AccordionItem",props:{disabled:{type:Boolean},value:{},asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(c){const o=c;return(n,i)=>(p(),m(l(I),g(o,{class:l(y)("border-b",o.class??"")}),{default:t(()=>[f(n.$slots,"default")]),_:3},16,["class"]))}}),W=d({__name:"Accordion",props:{type:{},modelValue:{},defaultValue:{},collapsible:{type:Boolean},disabled:{type:Boolean},dir:{},orientation:{},asChild:{type:Boolean},as:{type:[String,Object,Function]}},emits:["update:modelValue"],setup(c,{emit:o}){const n=c,i=o;return(r,_)=>(p(),m(l(D),S(F({...n,...l(O)(i)})),{default:t(()=>[f(r.$slots,"default")]),_:3},16))}}),X={class:"flex flex-col gap-5 items-center h-screen p-0 bg-secondary"},Y={class:"w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[0.5px] rounded-md"},Z={class:"flex justify-between"},ee=e("h1",{class:"text-xl items-center text-gray-500"},"Abebe Kebede",-1),se={class:"flex flex-col space-y-4"},te=e("div",{class:"grid grid-cols-3 gap-10 w-full"},[e("div",{class:"space-y-0"},[e("label",{for:"phoneNumber",class:"text-muted-foreground uppercase"},"Phone Number"),e("p",null,"0911223344")]),e("div",{class:"space-y-0"},[e("label",{for:"phoneNumber",class:"text-muted-foreground uppercase"},"Date of Birth"),e("p",null,"01/04/1990")]),e("div",{class:"space-y-0"},[e("label",{for:"phoneNumber",class:"text-muted-foreground uppercase"},"Customer ID"),e("p",null,"342323")]),e("div",{class:"space-y-0"},[e("label",{for:"phoneNumber",class:"text-muted-foreground uppercase"},"Mobile / Online Banking Access"),e("p",null,"342323")])],-1),ae=e("div",{class:"flex flex-col space-y-4"},[e("h1",null,"Deposits")],-1),oe={class:"w-full flex flex-col gap-5 p-6 bg-card shadow-none border-[1px] rounded-md"},le={class:"flex flex-col gap-4 w-full"},ce={class:"space-y-0 border-b-2 py-4"},ne={class:"flex justify-between"},ie=e("h1",{class:"text-lg"},"Communication",-1),re=e("div",{class:"grid grid-cols-2"},[e("div",{class:"space-y-0"},[e("label",{class:"text-muted-foreground uppercase"},"Preferred Contact Method"),e("p",null,"N/A")]),e("div",{class:"space-y-0"},[e("label",{for:"phoneNumber",class:"text-muted-foreground uppercase"},"Preferred Contact Time"),e("p",null,"N/A")])],-1),de={class:"space-y-0 border-b-2 py-4"},pe={class:"flex justify-between"},_e=e("h1",{class:"text-lg"},"Address",-1),ue={class:"grid grid-cols-2"},me={class:"space-y-1"},fe={class:"text-muted-foreground uppercase"},be=e("p",null,"Piassa,Addis Abeba,Ethiopia",-1),he={class:"space-y-0 border-b-2 py-4"},ye={class:"flex justify-between"},ge=e("h1",{class:"text-lg"},"Contact Numbers",-1),ve={class:"grid grid-cols-2"},xe={class:"space-y-1"},we={class:"text-muted-foreground uppercase"},Ce=e("p",null,"0911332233",-1),Ae={class:"space-y-0 border-b-2 py-4"},Be={class:"flex justify-between"},$e=e("h1",{class:"text-lg"},"Email",-1),je={class:"grid grid-cols-2"},Ne={class:"space-y-1"},Pe={class:"text-muted-foreground uppercase"},Ue=e("p",null,"abebekebede@gmail.com",-1),Fe=d({__name:"[id]",setup(c){const o=R(["item-1"]);return(n,i)=>{const r=j,_=N,v=P,w=L,C=J,A=Q,B=W,b=U,x=k,u=H,h=K;return p(),z("div",X,[e("div",Y,[e("div",Z,[ee,s(r,{class:"p-6 rounded-lg"},{default:t(()=>[a("Enroll Now")]),_:1})]),s(x,{"default-value":"profile",class:"space-y-0 w-full"},{default:t(()=>[s(v,{class:"w-full bg-white flex justify-start py-7 px-0 border-[1px]"},{default:t(()=>[s(_,{value:"profile",class:"text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted"},{default:t(()=>[a(" Profile ")]),_:1}),s(_,{value:"deposits",class:"text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary data-[state=inactive]:bg-muted",disabled:""},{default:t(()=>[a(" Deposits ")]),_:1})]),_:1}),s(b,{value:"profile",class:"space-y-4 py-4 text-base border-[0px]"},{default:t(()=>[e("div",se,[s(B,{type:"single","default-value":"item-1",collapsible:""},{default:t(()=>[s(A,{value:"item-1"},{default:t(()=>[s(w,{class:"text-lg"},{default:t(()=>[a("General Informations")]),_:1}),s(C,{class:"w-full",modelValue:l(o),"onUpdate:modelValue":i[0]||(i[0]=$=>G(o)?o.value=$:null)},{default:t(()=>[te]),_:1},8,["modelValue"])]),_:1})]),_:1})])]),_:1}),s(b,{value:"deposits",class:"space-y-4 p-4"},{default:t(()=>[ae]),_:1})]),_:1})]),e("div",oe,[s(x,{"default-value":"contact",class:"space-y-4 w-full"},{default:t(()=>[s(v,{class:"flex bg-white justify-start py-7 px-0 border-[1px]"},{default:t(()=>[s(_,{value:"contact",class:"text-xl py-3 data-[state=active]:border-b-4 data-[state=active]:border-b-primary"},{default:t(()=>[a(" Contact ")]),_:1})]),_:1}),s(b,{value:"contact",class:"space-y-4 text-base"},{default:t(()=>[e("div",le,[e("div",ce,[e("div",ne,[ie,s(r,{class:"pr-5",variant:"outline"},{default:t(()=>[s(u,{name:"material-symbols:edit-outline",class:"w-5 h-5 mr-2 fill-black"}),a(" Edit")]),_:1})]),re]),e("div",de,[e("div",pe,[_e,s(r,{class:"pr-5",variant:"outline"},{default:t(()=>[s(u,{name:"material-symbols:edit-outline",class:"w-5 h-5 mr-2 fill-black"}),a(" Edit")]),_:1})]),e("div",ue,[e("div",me,[e("p",fe,[a(" Home "),s(h,{class:"bg-green-700 ml-4"},{default:t(()=>[a("Primary Communication Address")]),_:1})]),be])])]),e("div",he,[e("div",ye,[ge,s(r,{class:"pr-5",variant:"outline"},{default:t(()=>[s(u,{name:"material-symbols:edit-outline",class:"w-5 h-5 mr-2 fill-black"}),a(" Edit")]),_:1})]),e("div",ve,[e("div",xe,[e("p",we,[a(" Mobile "),s(h,{class:"bg-green-700 ml-4"},{default:t(()=>[a("Primary Communication Contact")]),_:1})]),Ce])])]),e("div",Ae,[e("div",Be,[$e,s(r,{class:"pr-5",variant:"outline"},{default:t(()=>[s(u,{name:"material-symbols:edit-outline",class:"w-5 h-5 mr-2 fill-black"}),a(" Edit")]),_:1})]),e("div",je,[e("div",Ne,[e("p",Pe,[a(" Other "),s(h,{class:"bg-green-700 ml-4"},{default:t(()=>[a("Primary Communication Email")]),_:1})]),Ue])])])])]),_:1})]),_:1})])])}}});export{Fe as default};
