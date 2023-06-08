<template>
  <editor
    v-model="myValue"
    ref="editor"
    :init="init"
    :disabled="disabled"
    @onClick="onClick"
  >
  </editor>
</template>

<script>
import tinymce from "tinymce/tinymce";
import Editor from "@tinymce/tinymce-vue";
import "tinymce/themes/silver";
import "tinymce/plugins/code";
import "tinymce/plugins/lists"; // 列表插件
import "tinymce/plugins/wordcount"; // 字数统计插件
import "tinymce/plugins/image"; //引入图片插件
import "tinymce/plugins/link"; //引入超链接插件
import "tinymce/plugins/code"; //引入代码插件
import "tinymce/plugins/table"; //引入表格插件
import "tinymce/plugins/lists";
import "tinymce/plugins/wordcount";
export default {
  // name: "editorIndex",
  components: {
    Editor,
  },
  data() {
    return {
      Id: "date" + Date.now(),
      init: {
        language_url: "/zh_CN.js", // 语言包位置，因为放在public下所以可以省略public
        selector: "#tinymce", //tinymce的id
        language: "zh_CN", //语言类型,汉化
        skin_url: "/tinymce/skins/ui/oxide",
        height: 500, //编辑器高度
        branding: false, // 隐藏品牌，隐藏状态栏中显示的“ Powered by Tiny ”链接,
        plugins: "link image lists table wordcount code paste ", // 需要用到的功能插件，如链接，列表等等
        // 工具栏 toolbar，根据需要写对应的工具名称，顺序及分割线等等
        toolbar:
          "undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
        // images_upload_url: '/demo/upimg.php',
        // images_upload_base_path: '/demo',
      },
      // 此处为图片上传处理函数，这个直接用了base64的图片形式上传图片，
      // 如需ajax上传可参考https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_handler
      /* images_upload_handler: (blobInfo, success, failure) => {
         const img = 'data:image/jpeg;base64,' + blobInfo.base64()
         success(img)
       }*/
      myValue: this.value,
    };
  },
  props: {
    value: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    height: {
      type: Number,
      default: 300,
    },
    /* plugins: {
       type: [String, Array],
       default: 'lists image media table wordcount'
     },*/
    toolbar: {
      type: [String, Array],
      //default: 'undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | lists image media table | removeformat'
      default:
        "undo redo |  formatselect | bold italic forecolor backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat",
    },
  },
  mounted() {
    tinymce.init({});
  },

  methods: {
    // 添加相关的事件，可用的事件参照文档=> https://github.com/tinymce/tinymce-vue => All available events
    // 需要什么事件可以自己增加
    onClick(e) {
      this.$emit("onClick", e, tinymce);
    },
    // 可以添加一些自己的自定义事件，如清空内容
    clear() {
      this.myValue = "";
    },
  },
  watch: {
    value(newValue) {
      this.myValue = newValue;
      tinymce.init({});
    },
    myValue(newValue) {
      this.$emit("input", newValue);
    },
  },
};
</script>

<style>
</style>