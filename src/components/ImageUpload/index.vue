<template>
  <!-- 上传图片组件 -->
  <!-- file-list 是上传文件时的数据列表  可以绑定到上传组件上,让上传组件来显示 -->
  <div>
    <el-upload
      list-type="picture-card"
      :file-list="fileList"
      :on-remove="handleRemove"
      :on-change="changeFile"
      :before-upload="beforeUpload"
      :http-request="upload"
      :limit="1"
      action="#"
      :on-preview="preview"
      :class="{ disabled: fileComputed }"
    >
      <i class="el-icon-plus" />
    </el-upload>

    <!-- 进度条 -->
    <el-progress
      v-if="showPercent"
      style="width: 180px"
      :percentage="percent"
    />

    <!-- 预览图片时的弹层 -->
    <el-dialog title="图片预览" :visible.sync="showDialog">
      <img :src="imgUrl" style="width: 100%" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import COS from "cos-js-sdk-v5"; //引入腾讯云cos包
// 实例化 COS
var cos = new COS({
  SecretId: "AKIDpTs1uWtzoMeeNp0vZw3tMZVAYfV4NPAf", // 身份识别 ID
  SecretKey: "GEvLVP3QWLtBCxReaFdka9SVIo43qPjm", // 身份密钥
});
export default {
  name: "ImageUpload",
  components: {},
  props: {},
  data() {
    return {
      fileList: [], //上传文件时的数据列表
      showDialog: false,
      imgUrl: "",
      currentFileUid: null, //记录当前正在上传的uid
      percent: 0, //进度条
      showPercent: false, //进度条显示与隐藏
    };
  },
  computed: {
    // 设定一个计算属性 判断是否已经上传完了一张  **控制上传显示**
    fileComputed() {
      return this.fileList.length == 1;
    },
  },
  watch: {},
  created() {},
  methods: {
    // 文件上传时 点击预览 执行的钩子
    preview(file) {
      console.log(file);
      this.imgUrl = file.url; //将上传图片的地址保存导data中
      this.showDialog = true;
    },
    //删除图片执行的钩子函数
    handleRemove(file) {
      // file是点击删除的文件
      //   将原来的文件给排除掉了 剩下的就是最新的数组了
      this.fileList = this.fileList.filter((item) => item.uid !== file.uid);
    },
    // 文件改变时的钩子
    changeFile(file, fileList) {
      // file 是当前上传的文件   fileList是当前的最新数组
      // console.log(file);
      // console.log(fileList);
      // 如果当前fileList中没有该文件的话  就往里追加
      this.fileList = fileList.map((item) => item);
    },
    // 文件上传之前所执行的钩子
    beforeUpload(file) {
      // console.log(file);
      // 先检查文件类型// 要开始做文件上传的检查了
      // 文件类型 文件大小
      const types = ["image/jpeg", "image/gif", "image/bmp", "image/png"];
      if (!types.includes(file.type)) {
        this.$message.error("上传图片只能是 JPG、GIF、BMP、PNG 格式!");
        return false;
      }
      //  检查大小
      const maxSize = 5 * 1024 * 1024;
      if (maxSize < file.size) {
        this.$message.error("图片大小最大不能超过5M");
        return false;
      }
      this.currentFileUid = file.uid;
      this.showPercent = true;
      return true;
    },
    // 进行上传操作
    upload(params) {
      if (params.file) {
        // 执行上传操作
        cos.putObject(
          {
            Bucket: "lei-1313196072", // 存储桶名
            Region: "ap-nanjing", // 地域
            Key: params.file.name, // 文件名作为key
            Body: params.file, // 要上传的文件对象
            StorageClass: "STANDARD", // 上传的模式类型 直接默认 标准模式即可
            // 上传到腾讯云 =》 哪个存储桶 哪个地域的存储桶 文件  格式  名称 回调
            // 进度条
            onProgress: (params) => {
              this.percent = params.percent * 100;
            },
          },
          (err, data) => {
            // data返回数据之后 应该如何处理
            // data返回数据之后 应该如何处理
            console.log(err || data);
            // data中有一个statusCode === 200 的时候说明上传成功
            if (!err && data.statusCode === 200) {
              //   此时说明文件上传成功  要获取成功的返回地址
              // fileList才能显示到上传组件上 此时我们要将fileList中的数据的url地址变成 现在上传成功的地址
              // 目前虽然是一张图片 但是请注意 我们的fileList是一个数组
              // 需要知道当前上传成功的是哪一张图片
              this.fileList = this.fileList.map((item) => {
                // 去找谁的uid等于刚刚记录下来的id
                if (item.uid === this.currentFileUid) {
                  return { url: "http://" + data.Location, upload: true }; // 将本地的地址换成腾讯云地址
                  // upload 为true 表示这张图片已经上传完毕 这个属性要为我们后期应用的时候做标记
                  // 保存  => 图片有大有小 => 上传速度有快又慢 =>要根据有没有upload这个标记来决定是否去保存
                }
                return item;
              });
              setTimeout(() => {
                this.showPercent = false; // 隐藏进度条
                this.percent = 0; // 进度归0
              }, 2000);

              // 将上传成功的地址 回写到了fileList中 fileList变化  =》 upload组件 就会根据fileList的变化而去渲染视图
            }
          }
        );
      }
    },
  },
  mounted() {},
};
</script>
<style>
.disabled .el-upload--picture-card {
  display: none;
}
</style>
