(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-70d4"],{"0627":function(t,e,a){"use strict";var i=a("8456"),s=a.n(i);s.a},"7c73":function(t,e,a){"use strict";var i=a("e357"),s=a.n(i);s.a},8456:function(t,e,a){},9442:function(t,e,a){},d89d:function(t,e,a){"use strict";a.r(e);var i=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"wrap"},[a("el-container",[a("el-header",[a("el-row",{staticClass:"header-flex"},[a("el-col",{attrs:{span:10,type:"flex"}},[a("el-breadcrumb",{attrs:{separator:"/",type:"flex"}},[a("el-breadcrumb-item",[t._v("\n            微页面\n          ")]),a("el-breadcrumb-item",[t._v("\n            预览微页面\n          ")])],1)],1),a("el-col",{attrs:{span:14}},[a("el-button",{on:{click:t.goEditor}},[t._v("继续编辑")]),a("el-button",{staticClass:"publish-btn",attrs:{type:"primary"}},[t._v("发布")]),a("el-button",{staticClass:"help-icon",attrs:{type:"text",icon:"el-icon-question"}},[t._v("使用帮助")])],1)],1)],1),a("el-main",[a("div",{staticClass:"main-container"},[a("el-row",[a("el-col",{attrs:{span:12}},[a("div",{staticClass:"phone"},[t.pageJson?a("div",{staticClass:"phone-view-container",style:{width:t.pageJson.page.phoneWidth+"px",height:t.pageJson.page.phoneHeight+t.HeadHeight+"px"}},[a("phone-view",{attrs:{pageJson:t.pageJson,HeadHeight:t.HeadHeight}})],1):t._e()])]),a("el-col",{attrs:{span:12}},[a("qr-code")],1)],1)],1)])],1)],1)},s=[],n=(a("cadf"),a("551c"),a("097d"),a("f953")),o=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[a("div",{staticClass:"header",style:{height:t.HeadHeight+"px"}},[a("div",{staticClass:"title"},[t._v(t._s(t.pageJson.page.title))])]),a("div",{staticClass:"content-container",style:{height:t.pageJson.page.phoneHeight+"px"}},[a("iframe",{staticClass:"frame",attrs:{src:"http://localhost:8080/#/real",frameborder:"no"}})])])},r=[],c={props:["pageJson","HeadHeight"]},l=c,p=(a("dca8"),a("2877")),d=Object(p["a"])(l,o,r,!1,null,"7ee04ef0",null);d.options.__file="PhoneView.vue";var h=d.exports,u=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",[t._v("\n    预览页面：\n    "),a("div",{staticClass:"qr-code-container"},[a("div",{staticClass:"url"},[a("div",{staticClass:"text"},[t._v("\n          "+t._s(t.url)+"\n        ")]),a("div",[a("el-button",{staticClass:"copy-btn",attrs:{size:"mini",type:"primary","data-clipboard-text":t.url}},[t._v("复制")])],1)]),a("div",{ref:"qrCode",staticClass:"qrcode"}),a("div",{staticClass:"tip"},[t._v("扫码预览")])])])},f=[],g=a("d044"),v=a.n(g),m=a("b311"),y=a.n(m),b={data:function(){return{url:"http://192.168.45.37:8080/#/real"}},mounted:function(){var t=this;this.createQrCode();var e=new y.a(".copy-btn");e.on("success",function(){t.$message({showClose:!0,message:"复制成功",type:"success"})})},methods:{createQrCode:function(){var t=new v.a(this.$refs.qrCode,{text:this.url,width:180,height:180,colorDark:"#000000",colorLight:"#ffffff",correctLevel:v.a.CorrectLevel.H});return t}}},x=b,_=(a("7c73"),Object(p["a"])(x,u,f,!1,null,"57d3880a",null));_.options.__file="QrCode.vue";var C=_.exports,w={data:function(){return{pageJson:null,HeadHeight:64}},components:{PhoneView:h,QrCode:C},mounted:function(){this.pageJson=n.editor},methods:{goEditor:function(){this.$router.push("/")}}},z=w,F=(a("0627"),Object(p["a"])(z,i,s,!1,null,"370045a2",null));F.options.__file="Index.vue";e["default"]=F.exports},dca8:function(t,e,a){"use strict";var i=a("9442"),s=a.n(i);s.a},e357:function(t,e,a){},f953:function(t){t.exports={editor:{page:{title:"活动页",phoneWidth:375,phoneHeight:407,shareTitle:"分享标题",shareDec:"分享描述",shareImg:"","background-color":"#fff"},components:[{type:2,url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535441924585&di=5a4452229f1e5fa67ad0a6fb9c37692e&imgtype=0&src=http%3A%2F%2Fattach.zhiyoo.com%2Fforum%2F201303%2F30%2F16392363kvt13er39xk1k3.jpg",location:{x:0,y:90},size:{w:375,h:220},style:{"z-index":2}},{type:2,url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535441924585&di=5a4452229f1e5fa67ad0a6fb9c37692e&imgtype=0&src=http%3A%2F%2Fattach.zhiyoo.com%2Fforum%2F201303%2F30%2F16392363kvt13er39xk1k3.jpg",location:{x:0,y:320},size:{w:375,h:220},style:{"z-index":2}},{type:2,url:"https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1535441924585&di=5a4452229f1e5fa67ad0a6fb9c37692e&imgtype=0&src=http%3A%2F%2Fattach.zhiyoo.com%2Fforum%2F201303%2F30%2F16392363kvt13er39xk1k3.jpg",location:{x:0,y:700},size:{w:375,h:220},style:{"z-index":2}},{type:1,content:"哈哈哈哈啧啧啧啧啧啧做做做做做做做做做做做做做做做做做做做做做",location:{x:100,y:0},size:{w:60,h:90},fontSize:12,style:{"text-align":"left","text-color":"rgba(19, 206, 102, 0.8)","z-index":2}},{type:1,content:"哈哈哈哈",location:{x:0,y:310},size:{w:375,h:90},style:{"font-size":"12px","text-align":"left","text-color":"rgba(19, 206, 102, 0.8)","z-index":2}}]}}}}]);