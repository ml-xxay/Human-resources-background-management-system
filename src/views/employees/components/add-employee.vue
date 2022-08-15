<template>
  <el-dialog title="新增员工" :visible="showDialog" @close="btnCannel">
    <!-- 表单 -->
    <el-form
      ref="addEmployee"
      :model="formData"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="姓名" prop="username">
        <el-input
          v-model="formData.username"
          style="width: 50%"
          placeholder="请输入姓名"
        />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input
          v-model="formData.mobile"
          style="width: 50%"
          placeholder="请输入手机号"
        />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker
          v-model="formData.timeOfEntry"
          style="width: 50%"
          placeholder="请选择入职时间"
        />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select
          v-model="formData.formOfEmployment"
          style="width: 50%"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in EmployeeEnum.hireType"
            :key="item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input
          v-model="formData.workNumber"
          style="width: 50%"
          placeholder="请输入工号"
        />
      </el-form-item>
      <!-- 部门 -->
      <el-form-item label="部门" prop="departmentName">
        <el-input
          v-model="formData.departmentName"
          @focus="getDepartments"
          style="width: 50%"
          placeholder="请选择部门"
        />
        <!-- 放置一个树形组件 -->
        <el-tree
          v-loading="loading"
          v-if="showTree"
          :data="treeData"
          :props="{ label: 'name' }"
          @node-click="selectNode"
          default-expand-all
        ></el-tree>
      </el-form-item>
      <el-form-item label="转正时间">
        <el-date-picker
          v-model="formData.correctionTime"
          style="width: 50%"
          placeholder="请选择转正时间"
        />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-row type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCannel">取消</el-button>
          <el-button type="primary" size="small" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </template>
  </el-dialog>
</template>

<script>
import { getDepartments } from "@/api/departments"; //获取组织架构树形
import { tranListToTreeData } from "@/utils"; //转换树形方法
import EmployeeEnum from "@/api/constant/employees"; //引入聘用形式的枚举对象
import { addEmployee } from "@/api/employees"; //新增员工
export default {
  name: "AddDemployee",
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // 表单数据
      formData: {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      },
      // 效验规则对象
      rules: {
        username: [
          { required: true, message: "用户姓名不能为空", trigger: "blur" },
          {
            min: 1,
            max: 4,
            message: "用户姓名为1-4位",
          },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          {
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "聘用形式不能为空", trigger: "blur" },
        ],
        workNumber: [
          { required: true, message: "工号不能为空", trigger: "blur" },
        ],
        departmentName: [
          { required: true, message: "部门不能为空", trigger: "change" },
        ],
        timeOfEntry: [{ required: true, message: "入职时间", trigger: "blur" }],
        // correctionTime:[
        //   { required: true, message: "转正时间", trigger: "blur" },
        // ]
      },
      treeData: [], //部门树形数据
      showTree: false, //默认不显示树形组件
      loading: false, //进度条
      EmployeeEnum, //聘用形式枚举对象
    };
  },
  methods: {
    // 获取树形数据
    async getDepartments() {
      this.showTree = true;
      this.loading = true;
      const { depts } = await getDepartments();
      //depts 是一个数组 他需要转化成树形结构  才可以被el-tree使用
      this.treeData = tranListToTreeData(depts, "");
      this.loading = false;
    },
    // 点击部门时触发
    selectNode(node) {
      console.log(node);
      this.formData.departmentName = node.name; //把点击时的name值 给表单数据
      this.showTree = false;
    },
    // 确定
    async btnOK() {
      try {
        await this.$refs.addEmployee.validate();
        // 执行到这里  表示表单验证成功
        await addEmployee(this.formData); //调用系新增接口
        //  通知父组件  重新获取数据  更新页面   this.$parent是父组件的实例
        this.$parent.getEmployeeList(); //调用父组件的 getEmployeeList() 这个方法  重新获取数据
        this.$parent.showDialog = false; //关闭弹层
      } catch (error) {
        console.log(error);
      }
    },
    // 取消
    btnCannel() {
      // 取消的时候清空数据  防止下次添加时数据还在
      this.formData = {
        username: "",
        mobile: "",
        formOfEmployment: "",
        workNumber: "",
        departmentName: "",
        timeOfEntry: "",
        correctionTime: "",
      };
      this.$refs.addEmployee.resetFields(); // 重置校验结果
      this.$emit("update:showDialog", false); //取消时关闭弹层
    },
  },
};
</script>

<style></style>
