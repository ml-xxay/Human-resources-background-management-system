<template>
  <el-row
    type="flex"
    justify="space-between"
    align="middle"
    style="height: 40px; width: 100%"
  >
    <!-- 左侧内容 -->
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <!-- 右侧内容 -->
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <span slot=""> 操作<i class="el-icon-arrow-down" /> </span>
            <!-- 下拉内容  -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item command="edit" v-if="!isRoot"
                >编辑部门</el-dropdown-item
              >
              <el-dropdown-item command="del" v-if="!isRoot"
                >删除部门</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
// 树形组件封装
import { delDepartments } from "@/api/departments";
export default {
  name: "TreeTools",
  components: {},
  props: {
    // 接收的树形节点 当前行的数据
    treeNode: {
      type: Object, // 对象类型
      required: true, // 要求对方使用您的组件的时候 必须传treeNode属性 如果不传 就会报错
    },
    isRoot: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  created() {},
  methods: {
    // 操作节点调用的方法
    operateDepts(command) {
      if (command === "add") {
        // 添加子部门的操作
        this.$emit("addDepts", this.treeNode); // 告诉父组件 显示弹层
      } else if (command === "edit") {
        //  编辑部门的操作   //this.treeNode 当前的数据
        this.$emit("editDepts", this.treeNode);
      } else {
        //  删除操作
        this.$comfirm("您确定要删除该阻止部门嘛")
          .then(() => {
            // 如果点击了确定就会进入then
            return delDepartments(this.treeNode.id); // 返回promise对象
          })
          .then(() => {
            //  如果删除成功了  就会进入这里   后端的数据删掉了  但是前台数据还没变  应该重新获取一下数据
            this.$$emit("delDepts");
            this.$message.success("删除成功");
          });
      }
    },
  },

  mounted() {},
};
</script>
<style scoped lang="less"></style>
