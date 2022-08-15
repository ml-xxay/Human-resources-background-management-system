<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 组织架构内容 -->
      <el-card class="tree-card">
        <!-- 头部 -->
        <tree-tools :tree-node="company" :isRoot="true" @addDepts="addDepts" />

        <!-- 树形结构内容 -->
        <el-tree :data="departs" :props="defaultProps">
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @delDepts="delDepts"
            @addDepts="addDepts"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>

    <!--添加时的弹层  -->
    <add-dept
      ref="addDept"
      :showDialog.sync="showDialog"
      :treeNode="node"
      @addDepts="add"
    />
  </div>
</template>

<script>
import TreeTools from "./components/tree-tools.vue"; //树形组件
import AddDept from "./components/add-dept.vue"; //添加的弹框组件
import { getDepartments } from "@/api/departments"; //获取树形数据
import { tranListToTreeData } from "@/utils/index"; //转换树形方法
export default {
  components: {
    TreeTools,
    AddDept,
  },
  data() {
    return {
      company: { name: "江苏传智播客教育科技股份有限公司", manager: "负责人" }, //头部的数据结果结构
      departs: [],
      defaultProps: {
        label: "name",
      },
      showDialog: false, // 是否显示弹层
      node: null, //记录当前点击添加时的当前行数据
    };
  },
  created() {
    this.getDepartments();
  },
  methods: {
    // 获取树形数据
    async getDepartments() {
      const result = await getDepartments();
      this.company = { name: result.companyName, manager: "负责人", id: "" };
      this.departs = tranListToTreeData(result.depts, ""); // 需要将其转化成树形结构
      console.log(result);
      console.log(this.departs);
    },
    // 子组件删除数据成功  重新获取一下数据
    delDepts() {
      this.getDepartments();
    },
    // 添加成功 重新获取一下数据 让页面更新
    add() {
      this.getDepartments();
    },

    // 监听tree-tools 树形组件种点击添加部门的事件
    //node 当前带年纪部门的当前行的数据
    addDepts(node) {
      this.showDialog = true; //先显示弹层
      this.node = node;
      console.log(node);
    },
    //监听tree-tools 树形组件种点击编辑的事件
    editDepts(node) {
      this.showDialog = true; //先显示弹层
      this.node = node;
      // console.log(this.$refs.addDept);
      this.$refs.addDept.getDepartDetail(node.id)
    },
  },
};
</script>

<style scoped>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}
</style>
