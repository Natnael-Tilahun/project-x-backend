import{c as u,b as m,d as b,e as g,u as _,n as v}from"./index.5e16e95e.js";import{f as n,o,g as i,w as r,r as c,m as p,u as s,n as y,h}from"./entry.75c470a4.js";const $=n({__name:"TabsTrigger",props:{value:{},disabled:{type:Boolean},asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(t){const e=t;return(a,l)=>(o(),i(s(m),p(e,{class:s(u)("inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm ",e.class)}),{default:r(()=>[c(a.$slots,"default")]),_:3},16,["class"]))}}),j=n({__name:"TabsList",props:{loop:{type:Boolean},asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(t){const e=t;return(a,l)=>(o(),i(s(b),p(e,{class:s(u)("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",e.class)}),{default:r(()=>[c(a.$slots,"default")]),_:3},16,["class"]))}}),w=n({__name:"TabsContent",props:{value:{},forceMount:{type:Boolean},asChild:{type:Boolean},as:{type:[String,Object,Function]},class:{}},setup(t){const e=t;return(a,l)=>(o(),i(s(g),p({class:s(u)("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",e.class)},e),{default:r(()=>[c(a.$slots,"default")]),_:3},16,["class"]))}}),k=n({__name:"Tabs",props:{defaultValue:{},orientation:{},dir:{},activationMode:{},modelValue:{},asChild:{type:Boolean},as:{type:[String,Object,Function]}},emits:["update:modelValue"],setup(t,{emit:e}){const d=_(t,e);return(f,B)=>(o(),i(s(v),y(h(s(d))),{default:r(()=>[c(f.$slots,"default")]),_:3},16))}});export{$ as _,j as a,w as b,k as c};