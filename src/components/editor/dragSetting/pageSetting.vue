<template>
  <div :class="['setting-content', $store.state.page.pageSet ?
   'setting-show' : '', 'page-setting']" :style="{width: setForm.width+'px'}">
    <div class="setting-box">
      <div class="setting-title">
        <span>组件设置</span>
        <span class="header-btn">
          <i class="el-icon-close" @click="settingClose"></i>
        </span>
      </div>
      <div class="setting" :style="{ maxHeight: setForm.maxHeight + 'px'}">
        <el-form ref="form" label-width="100px">
          <el-form-item label="页面名称：" size="mini" class="is-require" >
            <el-input type="text" v-model="dragForm.name" placeholder="页面名称，最多输入10个字"></el-input>
          </el-form-item>
          <el-form-item label="页面标题：" size="mini" class="is-require" >
            <el-input type="text" v-model="dragForm.title" placeholder="H5标题，最多输入10个字"></el-input>
          </el-form-item>
          <el-form-item label="右上角分享：" size="mini">
            <el-radio v-model="dragForm.isShare" label="1">显示</el-radio>
            <el-radio v-model="dragForm.isShare" label="2">不显示</el-radio>
          </el-form-item>
          <div v-if="dragForm.isShare === '1'">
            <el-form-item label="分享标题：" size="mini">
              <el-input type="text" v-model="dragForm.shareTitle" maxlength=15
              placeholder="微信分享标题，最多输入15个字"></el-input>
            </el-form-item>
            <el-form-item label="分享描述：" size="mini">
              <el-input :rows="2" maxlength=40 v-model="dragForm.shareDec" type="textarea"
              placeholder="微信分享描述，最多输入40个字" resize="none"></el-input>
            </el-form-item>
            <el-form-item label="分享缩略图：" size="mini" class="share-img">
              <img-uplaod :imgObj="dragForm.img" @upload-done="uploadDone"
              @file-remove="fileRemove" :dec="String('图片尺寸200X200')"/>
            </el-form-item>
          </div>
          <el-form-item label="iphonex适配：" size="mini">
            <el-radio v-model="dragForm.phonexFit" label="1">适配</el-radio>
            <el-radio v-model="dragForm.phonexFit" label="2">不适配</el-radio>
            <div class="label-dec">适配iphonex将在h5底部显示白色安全区</div>
          </el-form-item>
          <el-form-item label="背景颜色：" size="mini">
            <el-color-picker v-model="dragForm.backgroundColor"
             :show-alpha="true" class="color-item"
             @change="bgColorChange"></el-color-picker>
            <el-button type="text" class="bg-reset" @click="pageBgReset">重置</el-button>
          </el-form-item>
          <div class="form-item-code">
            <div>自定义代码区:</div>
            <el-tooltip class="item iconFont" effect="dark" content="脚本写法说明" placement="top">
              <i class="el-icon-question icon-font" @click="codeTips"></i>
            </el-tooltip>
            <!-- <el-button icon="el-icon-question">写法说明</el-button> -->
            <el-input v-model="dragForm.code" class="color-item"
             type="textarea" rows="8" resize="none"></el-input>
          </div>
          <div class="form-item-code">
            <div>组件id:</div>
            <div class="form-code-ids">
              <div v-for="(item, index) in $store.state.page.componentIds" :key="index">
               {{index+1}}.<span class="code-name">&nbsp;&nbsp;{{item.name}}</span>:&nbsp;&nbsp;
               <span class="code-id">{{item.id}}</span>
              </div>
            </div>
            <!-- <el-input v-model="dragForm.componentIds"
             class="color-item" type="textarea" rows="8" resize="none">
             {{$store.state.page.componentIds}}
            </el-input> -->
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import imgUplaod from '@/components/editor/dragSetting/upload/imgUpload';

export default {
  name: 'pageSetting',
  props: {
    dragForm: Object,
    setForm: Object,
  },
  components: {
    imgUplaod,
  },
  data() {
    return {
      location: {
        xmin: 0,
        ymin: 0,
      },
      size: {
        wmin: 0,
        hmin: 0,
      },
      fileModify: false,
    };
  },
  methods: {
    settingClose() { // 关闭设置
      this.$store.commit('page_update', { pageSet: false });
    },
    bgColorChange(val) {
      this.$store.commit('page_update', { backgroundColor: val });
    },
    pageBgReset() {
      this.$store.commit('page_update', { backgroundColor: '#fff' });
    },
    uploadDone(img) {
      this.$store.commit('page_update', {
        img: {
          url: img.url,
        },
      });
    },
    fileRemove() {
      this.$store.commit('page_update', {
        img: {},
      });
    },
    codeTips() {
      window.open('https://www.yuque.com/evan/vvgcu9/sul6hd');
    },
  },
};
</script>

<style >
.bg-reset.el-button.el-button--text {
  position: absolute;
  height: 28px;
  margin-top: 0;
  width: 40px;
  margin-left: 5px;
}
.bg-reset.el-button.el-button--text:hover,
.page-setting .el-button.el-button--text:hover {
  border: 0;
}

.page-setting .el-form-item--mini .el-form-item__content {
  display: inline-block;
  width: 260px;
  margin-left: 0 !important;
}
.page-setting .el-form-item__label {
  padding-right: 5px;
}
.page-setting .el-input--mini .el-input__inner{
  padding: 0 8px;
}
.page-setting .share-img.el-form-item--mini .el-form-item__content {
  width: 200px;
}
.page-setting .el-textarea__inner {
  padding: 3px 8px;
}
.label-dec {
  font-size: 10px;
  color: #999;
  display: inline-block;
  margin-left: 5px;
}
.form-item-code {
  position: relative;
  font-size: 14px;
  color: #606266;
  padding: 10px 20px;
}
.form-item-code .iconFont {
  position: absolute;
  right: 20px;
  top: 12px;
  cursor: pointer;
}
.form-code-ids {
  width: 330px;
  padding: 5px 10px;
  margin:  0 auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  box-sizing: border-box;
  min-height: 30px;
  line-height: 20px;
}
.code-name {
  display: inline-block;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}
.icon-font {
  outline: none;
}
.icon-font:hover {
  color: #409EFF
}
</style>
