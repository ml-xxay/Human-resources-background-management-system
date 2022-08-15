<template>
  <!-- 新增部门的弹层 -->
  <el-dialog :title="showTitle" :visible="showDialog" @close="btnCancel">
    <!-- 表单组件  el-form   label-width设置label的宽度   -->
    <!-- 匿名插槽 -->
    <el-form
      ref="deptForm"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="部门名称" prop="name">
        <el-input
          clearable
          v-model="formData.name"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门编码" prop="code">
        <el-input
          v-model="formData.code"
          style="width: 80%"
          placeholder="1-50个字符"
        />
      </el-form-item>
      <el-form-item label="部门负责人" prop="manager">
        <el-select
          @focus="getfuzeren"
          v-model="formData.manager"
          style="width: 80%"
          placeholder="请选择"
        >
          <el-option
            v-for="item in peoples"
            :key="item.id"
            :label="item.username"
            :value="item.username"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="部门介绍" prop="introduce">
        <el-input
          v-model="formData.introduce"
          style="width: 80%"
          placeholder="1-300个字符"
          type="textarea"
          :rows="3"
        />
      </el-form-item>
    </el-form>
    <!-- el-dialog有专门放置底部操作栏的 插槽  具名插槽 -->
    <el-row slot="footer" type="flex" justify="center">
      <!-- 列被分为24 -->
      <el-col :span="6">
        <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>
</template>
<script>
import {
  getDepartments,
  getEmployeeSimple,
  addDepartments,
  getDepartDetail,
  updateDepartments,
} from "@/api/departments"; //获取树形数据 员工负责人  新增  获取详情  编辑
export default {
  name: "AddDept", //新增部门的弹窗组件
  components: {},
  // 需要传入一个props变量来控制弹层 显示或者隐藏
  props: {
    // 是否显示弹层
    showDialog: {
      type: Boolean,
      default: false,
    },
    // 当前操作的节点
    treeNode: {
      type: Object,
      default: null,
    },
  },
  data() {
    // 自定义效验函数  检查部门名称是否重复
    const checkNameRepeat = async (rule, value, callback) => {
      // value 是要效验的部门名称  要去添加位置所在部门的同级部门下的部门去比较  有没有相同的  有相同的不能过 / 不相同就通过
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 有id就是编辑模式
        // 编辑的数据  在数据库本来就有  所以我们要判断  在同级部门下 我的名字不能和其他名字重复
        //首先找到我的同级部门  this.formData.id 就是我当前的id   我的pid是 this.formData.pid
        isRepeat = depts
          .filter(
            (item) =>
              item.pid == this.treeNode.pid && item.id !== this.treeNode.id
          )
          .some((item) => item.name == value);
      } else {
        // 没有id就是新增模式
        // 去找同级部门下  有没有和value相同的名称数据
        isRepeat = depts
          .filter((item) => item.pid == this.treeNode.id)
          .some((item) => item.name == value);
        // 如果isRepeat 为true 表示找到了  就不让通过
      }

      isRepeat
        ? callback(new Error(`同级部门下已经存在${value}部门了`))
        : callback();
    };
    // 自定义效验函数  部门编码名称是否重复
    const checkCodeRepeat = async (rule, value, callback) => {
      const { depts } = await getDepartments();
      let isRepeat = false;
      if (this.formData.id) {
        // 有id 就是编辑模式
        // 要求不能有一样的code
        isRepeat = depts
          .filter((item) => item.id !== this.treeNode.id)
          .some((item) => item.code == value && value);
      } else {
        // 新增模式
        //  要求编码 和所有部门的编码都不能重复  由于历史数据有可能没有code  加一个强制条件 就是value不为空
        isRepeat = depts.some((item) => item.code == value && value != "");
      }

      isRepeat
        ? callback(new Error(`组织架构中已经有部门使用${value}编码`))
        : callback();
    };
    return {
      // 定义表单数据
      formData: {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      },
      // 效验规则
      // 定义校验规则
      rules: {
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门名称要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkNameRepeat },
        ],
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "部门编码要求1-50个字符",
            trigger: "blur",
          },
          { trigger: "blur", validator: checkCodeRepeat },
        ],
        manager: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
        ],
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            trigger: "blur",
            min: 1,
            max: 300,
            message: "部门介绍要求1-50个字符",
          },
        ],
      },
      peoples: [], // 接收获取的员工简单列表的数据
    };
  },
  computed: {
    showTitle() {
      return this.formData.id ? "编辑部门" : "新增部门";
    },
  },
  watch: {},
  created() {},
  methods: {
    // 获取员工负责人数据   添加时的操作
    async getfuzeren() {
      const data = await getEmployeeSimple();
      this.peoples = data;
    },
    // 获取详情数据方法              修改时的操作
    async getDepartDetail(id) {
      this.formData = await getDepartDetail(id);
    },
    // 确定添加
    btnOK() {
      this.$refs.deptForm.validate(async (isOK) => {
        if (isOK) {
          if (this.formData.id) {
            // 有id 是编辑
            await updateDepartments(this.formData);
          } else {
            // 表示可以提交了  新增
            await addDepartments({ ...this.formData, pid: this.treeNode.id }); // 调用新增接口 添加父部门的id
          }

          // 告诉父组件新增成功  并把前台数据更新
          this.$emit("addDepts");
          this.$emit("update:showDialog", false); //关闭弹窗
        }
      });
    },
    // 取消添加
    btnCancel() {
      this.formData = {
        name: "", // 部门名称
        code: "", // 部门编码
        manager: "", // 部门管理者
        introduce: "", // 部门介绍
      };
      // 清除之前的校验
      this.$refs.deptForm.resetFields(); // 重置校验字段
      // 关闭弹窗
      this.$emit("update:showDialog", false);
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less"></style>
