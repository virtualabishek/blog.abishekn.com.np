"use strict";(self.webpackChunkblog_site=self.webpackChunkblog_site||[]).push([[643],{1865:(e,a,t)=>{t.d(a,{A:()=>r});t(6540);var i=t(4164),n=t(6289),s=t(4848);function r(e){const{permalink:a,title:t,subLabel:r,isNext:l}=e;return(0,s.jsxs)(n.A,{className:(0,i.A)("pagination-nav__link",l?"pagination-nav__link--next":"pagination-nav__link--prev"),to:a,children:[r&&(0,s.jsx)("div",{className:"pagination-nav__sublabel",children:r}),(0,s.jsx)("div",{className:"pagination-nav__label",children:t})]})}},4135:(e,a,t)=>{t.r(a),t.d(a,{default:()=>_});t(6540);var i=t(4164),n=t(6289),s=t(797),r=t(1082),l=t(204),c=t(569),o=t(7448),d=t(7220),g=t(7143),p=t(9315),m=t(4848);function b(e){const a=(0,p.kJ)(e);return(0,m.jsx)(g.A,{children:(0,m.jsx)("script",{type:"application/ld+json",children:JSON.stringify(a)})})}const x={blogList:"blogList_RlbS",blogGrid:"blogGrid_ARw5",blogCard:"blogCard_Ofqz",cardLink:"cardLink_Y8kg",cardImage:"cardImage_SbFy",cardContent:"cardContent_Ur6P",cardTitle:"cardTitle_WXfy",cardDescription:"cardDescription_qDrD",cardMeta:"cardMeta_PD49",cardDate:"cardDate_ktIo"};function h(e){const{metadata:a}=e,{siteConfig:{title:t}}=(0,s.A)(),{blogDescription:i,blogTitle:n,permalink:l}=a,c="/"===l?t:n;return(0,m.jsxs)(m.Fragment,{children:[(0,m.jsx)(r.be,{title:c,description:i}),(0,m.jsx)(d.A,{tag:"blog_posts_list"})]})}function j(e){let{item:a}=e;if(!a?.content)return null;const{content:t,content:{metadata:i,frontMatter:s}}=a,{title:r,description:l,date:c,formattedDate:o,permalink:d}=i,g=s.image||"/img/default-blog-image.jpg";return(0,m.jsx)("article",{className:x.blogCard,children:(0,m.jsxs)(n.A,{to:d,className:x.cardLink,children:[(0,m.jsx)("div",{className:x.cardImage,children:(0,m.jsx)("img",{src:g,alt:r,loading:"lazy"})}),(0,m.jsxs)("div",{className:x.cardContent,children:[(0,m.jsx)("h2",{className:x.cardTitle,children:r}),l&&(0,m.jsx)("p",{className:x.cardDescription,children:l}),(0,m.jsx)("div",{className:x.cardMeta,children:o&&(0,m.jsx)("span",{className:x.cardDate,children:o})})]})]})})}function u(e){const{metadata:a,items:t,sidebar:i}=e;return(0,m.jsx)(c.A,{sidebar:i,children:(0,m.jsxs)("section",{className:x.blogList,children:[(0,m.jsx)("div",{className:x.blogGrid,children:t.map(((e,a)=>(0,m.jsx)(j,{item:e},e.content.metadata.permalink)))}),(0,m.jsx)(o.A,{metadata:a})]})})}function _(e){return(0,m.jsxs)(r.e3,{className:(0,i.A)(l.G.wrapper.blogPages,l.G.page.blogListPage),children:[(0,m.jsx)(h,{...e}),(0,m.jsx)(b,{...e}),(0,m.jsx)(u,{...e})]})}},7448:(e,a,t)=>{t.d(a,{A:()=>r});t(6540);var i=t(539),n=t(1865),s=t(4848);function r(e){const{metadata:a}=e,{previousPage:t,nextPage:r}=a;return(0,s.jsxs)("nav",{className:"pagination-nav","aria-label":(0,i.T)({id:"theme.blog.paginator.navAriaLabel",message:"Blog list page navigation",description:"The ARIA label for the blog pagination"}),children:[t&&(0,s.jsx)(n.A,{permalink:t,title:(0,s.jsx)(i.A,{id:"theme.blog.paginator.newerEntries",description:"The label used to navigate to the newer blog posts page (previous page)",children:"Newer entries"})}),r&&(0,s.jsx)(n.A,{permalink:r,title:(0,s.jsx)(i.A,{id:"theme.blog.paginator.olderEntries",description:"The label used to navigate to the older blog posts page (next page)",children:"Older entries"}),isNext:!0})]})}}}]);