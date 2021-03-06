<template>
  <div class="ew-editor">
    <el-container>
      <nav-bar pageName="编辑微页面">
        <template slot="btnGroup">
          <el-button @click="saveEditor">保存草稿</el-button>
          <el-button @click="reviewEditor">预览</el-button>
          <el-button type="primary" class="ew-publish-btn" @click="publishEditor">发布</el-button>
        </template>
      </nav-bar>
      <layout-left />
      <el-main >
      <div class="ew-editor_bg"></div>
        <div class="ew-editor-main" :style="{height: (page.phoneHeight + 50+37)+'px'}">
          <div class="ew-editor-main_phone" :style="{height: (page.phoneHeight)+'px'}">
            <div class="phone-container" ref="phoneContainer" :style="{width: page.phoneWidth+'px',
            height: (page.phoneHeight)+'px'}">
              <phone-banner :title="page.title" :topBannerClick="topBannerClick"/>
              <div class="screen-line" v-show="page.phoneHeight > 603"></div>
              <layout-main />
            </div>
            <div class="phone-hidden" :style="{width: page.phoneWidth + 20 +'px',
            top: (page.phoneHeight + 64)+'px',
            height: page.clientHeight - page.phoneHeight + 'px'}"></div>
          </div>
          <layout-setting />
        </div>
        <div class="ew-editor-main_right">
          <layer />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import merge from 'webpack-merge';
import { isEqual } from 'lodash';
import layoutMain from '@/components/editor/layout/layoutMain';
import layer from '@/components/editor/layout/layer';
import layoutLeft from '@/components/editor/layout/layoutLeft';
import layoutSetting from '@/components/editor/layout/layoutSetting';
import phoneBanner from '@/components/editor/layout/phoneBanner';
import NavBar from '@/components/NavBar';
import { postPageInfo, getPageInfo, patchPageInfo, publishPage } from '@/service';
import { dragCom } from '@/util/dragMxi';
import dragJson from '@/util/jsonDoc/drag.json';
import stateJson from '@/util/jsonDoc/state.json';

export default {
  mixins: [dragCom()],
  name: 'editor',
  components: {
    layoutMain,
    layer,
    layoutLeft,
    layoutSetting,
    NavBar,
    phoneBanner,
  },
  data() {
    return {
      isFirst: true, // 空白编辑页
      dataInit: '',
      beforeState: null, // 上一次操作的state值，用来对比是否发生了修改
      gobalState: null, // 存储当前网页的发布数据与草稿数据
      isPublish: false, // 是否发布页面
      curState: null, // 当前state
      initState: null, // 操作前的初始state
      saving: false, // 当前是否是保存草稿操作
    };
  },

  methods: {
    topBannerClick() { // 点击页面顶部，显示页面设置
      const { pageSet } = this.page;
      if (!pageSet) {
        this.$store.dispatch('setting_tap', { pageSet: true });
      }
      if (this.$store.state.editor.layerActive !== -1) {
        this.dragClick(-2);
      }
    },
    async saveEditor(isTrigger, isPublish) { // 保存草稿
      try {
        const { isOk, msg } = this.checkSources();
        if (!isOk) {
          this.$message.error(msg);
          return false;
        }
        let { state, draft } = this.getEditorJson(isPublish);
        state = JSON.stringify(state);
        draft = JSON.stringify(draft);
        const { title, name } = this.$store.state.page;
        const stitle = isPublish ? 'public_title' : 'draft_title';
        const sname = isPublish ? 'public_name' : 'draft_name';
        const updateInfo = isPublish ? 'public' : 'draft';
        const params = {
          state,
          [updateInfo]: draft,
          [stitle]: title,
          [sname]: name,
        };
        let data;
        if (this.isFirst) {
          data = await postPageInfo(params);
        } else {
          data = await patchPageInfo(this.$route.query.page_id, params);
        }
        this.beforeState = JSON.stringify(this.$store.state);
        if (data && data.status === 'ok' && data.data) {
          if (isTrigger) {
            this.optSucsess('保存草稿');
          }
          if (this.isFirst) {
            this.$router.push({
              query: merge(this.$route.query, { page_id: data.data.id }),
            });
            this.isFirst = false;
          }
          return true;
        } else if (isTrigger) { this.optError('保存草稿'); }
        return false;
      } catch (err) {
        this.optError('保存草稿');
      }
    },
    async reviewEditor() { // 预览
      const ele = this;
      const isOk = await this.saveEditor(false);
      if (isOk) {
        this.saving = true;
        ele.$router.push({
          path: '/preview',
          query: merge(ele.$route.query, { page_id: this.$route.query.page_id }),
        });
        this.saving = false;
      }
    },
    async publishEditor() { // 发布
      try {
        const ele = this;
        const isOk = await this.saveEditor(false, true);
        if (isOk) {
          const { data } = await publishPage(this.$route.query.page_id);
          if (data) {
            ele.optSucsess('发布页面');
            this.saving = true;
            ele.$router.push({
              path: '/publish',
              query: merge(ele.$route.query, { page_id: this.$route.query.page_id }),
            });
            this.saving = false;
          } else {
            ele.optError('发布页面');
          }
        }
      } catch (err) {
        this.optError('发布页面');
      }
    },
    optError(msg) {
      this.$message({
        message: `${msg}失败，请重试～`,
        type: 'error',
        duration: 2000,
      });
    },
    optSucsess(msg) {
      this.$message({
        message: `${msg}成功～`,
        type: 'success',
        duration: 2000,
      });
    },
    // 获取定位信息
    getPositionInfo({ position, location, size }) {
      const { page } = this.$store.state;
      if (position === 'relative') {
        return {
          position,
        };
      }
      if (position === 'fixedBottom') {
        const bottom = page.screenHeight - location.y - size.h;
        return {
          position,
          bottom,
        };
      }
      if (position === 'fixedTop') {
        const top = location.y;
        return {
          position,
          top,
        };
      }
    },
    getEditorJson(isPublish) { // 生成预览与发布的json
      const eJson = { editor: {} };
      const { editor, page } = this.$store.state;
      const {
        title, phoneWidth, phoneHeight, clientHeight, shareTitle, shareDec, backgroundColor, name,
        code, isShare, phonexFit,
      } = page;
      eJson.editor.page = {
        title,
        phoneWidth,
        phoneHeight,
        clientHeight,
        shareTitle,
        shareDec,
        backgroundColor,
        name,
        code,
        isShare: !!(isShare === undefined || isShare === '1'),
        phonexFit: !(phonexFit === undefined || phonexFit === '2'),
      };
      eJson.editor.page.shareImg = page.img.url || 'http://static.seeyouyima.com/nodejs-common/meiyou-bf23e296a9058a8dd5581eda3ea59674.png';
      const dragArr = [];
      const { typeCat } = dragJson;
      for (const k in typeCat) {
        if (editor[typeCat[k][0]].length) {
          const items = editor[typeCat[k][0]];
          items.map((item, key) => {
            const {
              id, type, size, location, position,
            } = item;
            const positionInfo = this.getPositionInfo({ position, location, size });
            let saveItem = {
              id, type, size, location, positionInfo,
            };
            // eslint-disable-next-line no-param-reassign
            item.key = key;
            saveItem = this.completeSaveItem(item, saveItem);
            dragArr.push(saveItem);
            return true;
          });
        }
      }
      this.topBannerClick();
      eJson.editor.components = dragArr;
      const ele = this;
      function setPageData(m, n) {
        ele.gobalState[m] = ele.$store.state;
        ele.gobalState[m].page.pageSet = true;
        ele.gobalState[m].editor.layerActive = -1;
        ele.gobalState[n] = JSON.parse(ele.initState);
      }
      if (isPublish) {
        setPageData('publish', 'draft');
      } else {
        setPageData('draft', 'publish');
      }
      const saveState = this.gobalState;
      return { state: saveState, draft: eJson.editor };
    },
    getRadioSet(item, type) { // radio组件设置信息
      const {
        location, size, label, bgColor, textColor, list, radioType, isRequired, id,
      } = item;
      return {
        id,
        isForm: true,
        type,
        isRequired,
        location,
        size,
        label,
        positionInfo: {
          position: 'relative',
        },
        style: {
          'z-index': item.dragIndex,
        },
        attr: {
          label,
          size,
          classList: [],
          bgColor,
          textColor,
          list,
          radioType,
          isRequired,
        },
      };
    },
    completeSaveItem(item, arr) {
      const arrAfter = arr;
      switch (item.type) {
        case 1:
        {
          return Object.assign(arrAfter, {
            content: item.content,
            style: {
              'font-size': item.fontSize,
              'text-align': item.textAlign,
              'line-height': item.lineHeight,
              color: item.textColor,
              'z-index': item.dragIndex,
            },
          });
        }
        case 2:
        {
          return Object.assign(arrAfter, {
            url: item.img.url,
            style: {
              'z-index': item.dragIndex,
            },
          });
        }
        case 3:
        {
          const {
            appLink, outLink, dragIndex, key,
            sourceType, awakeLink, iosLink, andLink, yybLink,
          } = item;
          return Object.assign(arrAfter, {
            key,
            appLink,
            outLink,
            sourceType,
            awakeLink,
            iosLink,
            andLink,
            yybLink,
            name: this.getLinkName(3, key, this.$store.state.editor.layerLists),
            style: {
              'z-index': dragIndex,
            },
          });
        }
        case 4:
        {
          return Object.assign(arrAfter, {
            style: {
              'z-index': item.dragIndex,
            },
            positionInfo: {
              position: 'relative',
            },
            imgList: item.imgList,
          });
        }
        case 5:
        {
          const curVideo = item.sourceType === '1' ? item.video : item.lineVideo;
          const {
            loop, poster, location, size, position,
          } = curVideo;
          const positionInfo = this.getPositionInfo({ position, location, size });
          return Object.assign(arrAfter, {
            source: curVideo.url,
            title: curVideo.title,
            loop,
            poster,
            location,
            size,
            positionInfo,
            style: {
              'z-index': item.dragIndex,
            },
          });
        }
        case 6: {
          const curPlay = item.sourceType === '1' ? item.play : item.linePlay;
          const { position, location, size } = curPlay;
          const positionInfo = this.getPositionInfo({ position, location, size });
          return Object.assign(arrAfter, {
            isBorder: item.isBorder,
            play: curPlay,
            location,
            size,
            positionInfo,
            style: {
              'z-index': item.dragIndex,
            },
          });
        }
        case 7:
        case 8:
        case 11:
        case 12:
        case 13: {
          // eslint-disable-next-line object-curly-newline
          const { isRequired, label, dragIndex, size } = item;
          const add = {
            isForm: true,
            isRequired,
            label,
            dragIndex,
            positionInfo: {
              position: 'relative',
            },
            style: {
              'z-index': item.dragIndex,
            },
            attr: {
              label,
              isRequired,
              classList: [],
              size,
            },
          };
          const attr = {
            label,
            isRequired,
            classList: [],
            size,
          };
          if (item.type === 11) {
            const { bgColor, textColor, verify } = item;
            Object.assign(attr, {
              bgColor,
              textColor,
              verify,
            });
          }
          if (item.type === 12 || item.type === 13) {
            Object.assign(attr, {
              bgColor: item.bgColor,
              textColor: item.textColor,
            });
          }
          return Object.assign(arrAfter, add, { attr });
        }
        case 9: {
          return this.getRadioSet(item, 9);
        }
        case 10: {
          return this.getRadioSet(item, 9);
        }
        default: {
          break;
        }
      }
    },
    getLinkName(type, num, layerLists) { // 热区名列表，主要是用在统计中
      let linkName = '热区';
      for (let i = 0; i < layerLists.length; i++) {
        if (layerLists[i].type === type && layerLists[i].num === num && layerLists[i].name) {
          linkName = layerLists[i].name;
          break;
        }
      }
      return linkName;
    },
    checkSources() { // 检测是否所有资源都上传
      const { page, editor } = this.$store.state;
      const { typeCat } = editor;
      const msgObj = {
        isOk: true,
        msg: '请添加页面名称～',
      };
      const ele = this;
      const layItemCheck = (msg, item) => {
        msgObj.isOk = false;
        msgObj.msg = msg;
        ele.dragClick(item.num, item.type);
      };
      if (!page.name) {
        msgObj.isOk = false;
        this.topBannerClick();
      } else if (!page.title) {
        msgObj.isOk = false;
        msgObj.msg = '请添加页面标题～';
        this.topBannerClick();
      } else {
        const { layerLists } = editor;
        if (layerLists.length) {
          for (let i = 0; i < layerLists.length; i++) {
            const item = layerLists[i];
            const drag = editor[typeCat[item.type][0]][item.num];
            // Todo if the interatcion isunified,just one logic
            if (item.type === 2 && (JSON.stringify(drag.img) === '{}' || !drag.img.url)) {
              layItemCheck('请添加图片～', item);
              break;
            }
            if (item.type === 6) {
              const curPlay = drag.sourceType === '1' ? drag.play : drag.linePlay;
              if ((!curPlay || !curPlay.url)) {
                layItemCheck('请添加音频～', item);
                break;
              }
            }
            if (item.type === 5) {
              const curVideo = drag.sourceType === '1' ? drag.video : drag.lineVideo;
              if ((!curVideo || !curVideo.url)) {
                layItemCheck('请添加视频～', item);
                break;
              }
            }
            if (item.type === 4 && (!drag.imgList || (JSON.stringify(drag.imgList) === '[]' || !this.imgListFilter(drag.imgList)))) {
              layItemCheck('请添加多图组件的图片资源～', item);
              break;
            }
          }
        }
      }
      return msgObj;
    },
    imgListFilter(list) {
      let isOk = true;
      list.map((el) => {
        if (!el.url) {
          isOk = false;
        }
        return true;
      });
      return isOk;
    },
    editorInit(data) { // state初始化，vuex不会自动恢复初始值，需要手动赋值
      this.gobalState = {
        draft: JSON.parse(this.dataInit),
        publish: JSON.parse(this.dataInit),
      };
      if (data) {
        this.gobalState = JSON.parse(data.state);
      }
      this.isPublish = Number(this.$route.query.public);
      let curState = this.isPublish ? this.gobalState.publish : this.gobalState.draft;
      curState = this.complateEditorJson(curState);
      this.initState = JSON.stringify(curState);
      this.beforeState = JSON.stringify(curState);
      this.$store.commit('editor_update', curState.editor);
      this.$store.commit('page_update', curState.page);
      if (!curState.page.name && data) {
        const name = this.isPublish ? data.publish_title : data.draft_title;
        this.$store.commit('page_update', { name });
      }
      if (curState.page.phonexFit === undefined) {
        this.$store.commit('page_update', { phonexFit: '2' });
      }
    },
    complateEditorJson(state) {
      const curState = state;
      const { typeCat } = dragJson;
      curState.editor.typeCat = typeCat;
      if (curState.editor.isSubmit === undefined) {
        curState.editor.isSubmit = true;
      }
      if (curState.editor.isPhone === undefined) {
        curState.editor.isPhone = true;
      }
      for (const k in typeCat) {
        if (curState.editor[typeCat[k][0]] === undefined) {
          curState.editor[typeCat[k][0]] = [];
        }
      }
      return curState;
    },
    delCheck() {
      const { className } = document.activeElement;
      const classList = ['drag-text', 'el-textarea__inner', 'el-input__inner', 'name-editor'];
      let isContain = false;
      if (className.indexOf(' ') >= 0) {
        const list = className.split(' ');
        const fList = list.filter(item => classList.includes(item));
        isContain = !!fList.length;
      } else if (classList.includes(className)) {
        isContain = true;
      }
      return isContain;
    },
    goCheck() { // 离开页面，检测是否操作都保存
      if (this.saving) return true;
      const { page, editor } = JSON.parse(this.beforeState);
      page.pageSet = this.$store.state.page.pageSet;
      const isOk = isEqual(page, this.$store.state.page);
      let isEditorOk = true;
      const { typeCat } = editor;
      for (const k in typeCat) {
        const beforeItems = editor[typeCat[k][0]];
        const afterItems = this.$store.state.editor[typeCat[k][0]];
        if (!isEqual(beforeItems, afterItems)) {
          isEditorOk = this.setSamPro(beforeItems, afterItems);
          if (isEditorOk) {
            // eslint-disable-next-line no-continue
            continue;
          } else {
            break;
          }
        }
      }
      return isOk && isEditorOk;
    },
    setSamPro(bItems, aItems) {
      const bI = Object.assign([], bItems);
      const aI = Object.assign([], aItems);
      if (bI.length !== aI.length) {
        return false;
      }
      for (let i = 0; i < bI.length; i++) {
        bI[i].isActive = aI[i].isActive;
        bI[i].isShow = aI[i].isShow;
        bI[i].zIndex = aI[i].zIndex;
      }
      if (isEqual(bI, aI)) return true;
      return false;
    },
  },
  async mounted() {
    this.dataInit = JSON.stringify(stateJson);
    if (this.$route.query.page_id) {
      try {
        this.isFirst = false;
        const { data } = await getPageInfo(this.$route.query.page_id);
        this.editorInit(data);
      } catch (err) {
        this.optError('获取编辑器数据');
        this.editorInit();
      }
    } else {
      this.editorInit();
    }
  },
  created() {
    const ele = this;
    window.onbeforeunload = (e) => { // 离开验证1: 点击浏览器刷新、前进、后退
      const event = window.event || e;
      if (!ele.goCheck()) {
        event.returnValue = ('确定离开当前页面吗？');
      }
    };
    document.onkeydown = (e) => { // 键盘点击就del键删除组件
      if (e.keyCode && parseInt(e.keyCode, 10) === 8) {
        if (!ele.delCheck()) {
          const { layerActive, layerLists } = ele.$store.state.editor;
          if (layerLists.length && layerActive !== -1) {
            ele.dragDel();
          }
        }
      }
    };
  },
  beforeRouteLeave(to, from, next) {
    if (!this.goCheck()) { // 离开验证2: 路由跳转
      this.$confirm('检测到有未保存的内容，如果离开将丢失内容，是否继续？', '确认信息', {
        distinguishCancelAndClose: true,
        confirmButtonText: '狠心离开',
        cancelButtonText: '取消',
        callback: (action) => {
          if (action === 'confirm') {
            next(true);
          } else {
            next(false);
          }
        },
      });
    } else {
      next(true);
    }
  },
};
</script>

<style>
html,
body {
  height: 100%;
  width: 100%;
}
input,button,select,textarea{outline:none;}
.el-aside {
  position: fixed;
  top: 57px;
  left: 0;
  bottom: 0;
  width: 100px;
  background-color: #fff;
  border-right: 1px solid #ccd5db;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 98;
}
.ew-help-icon {
  color: #323232;
}
.ed-com i,
.ed-com span {
  display: block;
  font-size: 16px;
}
.ed-com i {
  font-size: 22px;
}
.el-card__body {
  padding: 0 !important;
}
.el-card {
  border-top: 0;
}
.el-card.is-always-shadow {
  box-shadow: none;
  border-radius: 0;
  margin-top: 10px;
  border-right: 0;
}
.el-card__body {
  padding: 10px 0;
}
.ew-editor-main_right {
  position: fixed;
  float: right;
  right: 20px;
  bottom: 0;
  top: 20px;
  width: 260px;
  z-index: 98;
  margin-top: 40px;
  margin-right: -19px;
  background-color: #fafafa;
  border-left: 1px solid #ccd5db;
  box-sizing: content-box;
}
.el-card__header {
  padding: 5px 10px;
  line-height: 34px;
  margin-top: 3px;
}
.ew-editor-main_right .el-card__header {
  padding: 0;
}
.ew-editor-main {
  position: absolute;
  top: 56px;
  height: auto;
  padding-bottom: 60px;
  left: 200px;
  right: 260px;
  display: flex;
  align-content: center;
  justify-content: center;
  overflow: hidden;
}
.ew-editor_bg {
 background-color: #eee;
 position: absolute;
 top: 0;
 bottom: 0;
 left: 0;
 right: 0;
}
.phone-container {
  position: relative;
  width: 375px;
  height: 667px;
  top: 0;
  border: 1px solid #e5e5d5;
}
.phone-container.active {
  border: 1px solid #59c7f9;
}

.ew-editor .el-button.el-button--text {
  color: #606266;
  padding: 5px;
}

.ew-publish-btn {
  margin-left: 10px !important;
}
body {
  font-family: "微软雅黑";
}
[v-cloak] {
  display: none;
}
#example {
  width: 1000px;
  margin: 0 auto;
}
.list-complete-item {
  transition: all 1s;
  height: 50px;
  line-height: 50px;
  background: #000;
  color: #fff;
  text-align: center;
  font-size: 24px;
  margin-top: 10px;
}
.styleclass {
  width: 100px;
  float: left;
}
.list-complete-enter,
.list-complete-leave-active {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}
.list-complete-sortable-chosen,
.list-complete-sortable-ghost {
  opacity: 0;
  height: 0px;
  margin-top: 0px;
  padding: 0px;
  border: solid 0px;
}

.el-card.is-always-shadow {
  margin-top: 0;
}
.ew-editor-main_phone {
  position: relative;
  margin-top: 20px;
  margin-bottom: 30px;
  background-color: #fff;
}

.phone-hidden {
  background: #eee;
  position: absolute;
  bottom: -1px;
  left: -5px;
  right: -5px;
  z-index: 1002;
}
.screen-line {
  position: absolute;
  width: 110%;
  left:-5%;
  top: 667px;
  border: 0.5px dashed #eb5648;
  z-index: 1001;
}
.is-require .el-form-item__label:before {
  content: '*';
  color: #eb5648;
}
.el-breadcrumb__inner.is-link {
  color: #409EFFf9;
}
.el-color-picker__panel .el-color-dropdown__link-btn {
  display: none
}
</style>
