<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 靠右的按钮 -->
      <page-tools>
        <template v-slot:after>
          <el-button type="primary" size="small" @click="addPermission(1, '0')"
            >添加权限</el-button
          >
        </template>
      </page-tools>
      <!-- 表格 -->
      <el-table border :data="list" row-key="id">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column align="center" label="操作">
          <template v-slot="{ row }">
            <el-button
              v-if="row.type == 1"
              type="text"
              @click="addPermission(2, row.id)"
              >添加</el-button
            >
            <el-button type="text" @click="editPermission(row.id)"
              >编辑</el-button
            >
            <el-button type="text" @click="delPermission(row.id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 新增 编辑 弹层 -->
    <!-- 放置一个弹层 用来编辑新增节点 -->
    <el-dialog
      :title="`${showText}权限点`"
      :visible="showDialog"
      @close="btnCancel"
    >
      <!-- 表单 -->
      <el-form
        ref="perForm"
        :model="formData"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="权限名称" prop="name">
          <el-input v-model="formData.name" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限标识" prop="code">
          <el-input v-model="formData.code" style="width: 90%" />
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input v-model="formData.description" style="width: 90%" />
        </el-form-item>
        <el-form-item label="开启">
          <el-switch
            v-model="formData.enVisible"
            active-value="1"
            inactive-value="0"
          />
        </el-form-item>
      </el-form>
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
          <el-button size="small" @click="btnCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  updatePermission,
  addPermission,
  getPermissionDetail,
  delPermission,
  getPermissionList,
} from "@/api/permisson";
import { tranListToTreeData } from "@/utils";
export default {
  data() {
    return {
      list: [],
      showDialog: false, //控制弹层显示与隐藏
      formData: {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      },
      rules: {
        name: [
          { required: true, message: "权限名称不能为空", trigger: "blur" },
        ],
        code: [
          { required: true, message: "权限标识不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    showText() {
      // 有id显示编辑  无id显示新增
      return this.formData.id ? "编辑" : "新增";
    },
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    //获取权限数据
    async getPermissionList() {
      this.list = tranListToTreeData(await getPermissionList(), "0");
    },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm("确定要删除该数据吗");
        await delPermission(id);
        this.getPermissionList(); //重新获取数据
        this.$message.success("删除成功");
      } catch (error) {
        // console.log(error);
      }
    },
    // 确定
    btnOK() {
      this.$refs.perForm
        .validate()
        .then(() => {
          // 有id是编辑
          if (this.formData.id) {
            return updatePermission(this.formData);
          }
          // 无id 添加
          return addPermission(this.formData);
        })
        .then(() => {
          //  提示消息
          this.$message.success("新增成功");
          this.getPermissionList();
          this.showDialog = false;
        });
    },
    // 取消
    btnCancel() {
      this.formData = {
        name: "", // 名称
        code: "", // 标识
        description: "", // 描述
        type: "", // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: "", // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: "0", // 开启
      };
      this.$refs.perForm.resetFields();
      this.showDialog = false;
    },

    //添加访问权  和 按钮操作权   控制弹层
    addPermission(type, pid) {
      // 访问权的type=1  按钮操作权的type=2
      // pid表示当前数据父节点的标识
      this.formData.pid = pid;
      this.formData.type = type;
      this.showDialog = true;
    },
    async editPermission(id) {
      // 根据获取id获取详情
      this.formData = await getPermissionDetail(id);
      this.showDialog = true;
    },
  },
};
</script>

<style></style>
