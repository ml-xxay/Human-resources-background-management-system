<template>
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <!--角色管理  -->
          <el-tab-pane label="角色管理">
            <!-- 角色管理内容 -->
            <el-row style="height: 60px"
              ><el-button
                icon="el-icon-plus"
                size="small"
                type="primary"
                @click="showDialog = true"
                >新增角色</el-button
              >
            </el-row>
            <!-- 表格 -->
            <el-table border="" :data="list">
              <el-table-column type="index" label="序号" width="120" />
              <el-table-column prop="name" label="名称" width="240" />
              <el-table-column label="描述" />
              <el-table-column label="操作">
                <template slot-scope="{ row }">
                  <el-button
                    size="small"
                    type="success"
                    @click="assignPerm(row.id)"
                    >分配权限</el-button
                  >
                  <el-button
                    size="small"
                    type="primary"
                    @click="editRole(row.id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="small"
                    type="danger"
                    @click="deleteRole(row.id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <!-- 分页 -->
            <el-row
              type="flex"
              justify="center"
              align="middle"
              style="height: 60px"
            >
              <!-- 分页组件 -->
              <el-pagination
                :current-page="page.page"
                :page-size="page.pagesize"
                :total="page.total"
                layout="prev,pager,next"
                @current-change="handleCurrentChange"
              />
            </el-row>
          </el-tab-pane>
          <!--公司信息  -->
          <el-tab-pane label="公司信息">
            <el-alert
              title="对公司名称、公司地址、营业执照、公司地区的更新，将使得公司资料被重新审核，请谨慎修改"
              type="info"
              show-icon
              :closable="false"
            />
            <el-form label-width="120px" style="margin-top: 50px">
              <el-form-item label="公司名称">
                <el-input
                  v-model="formData.name"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="公司地址">
                <el-input
                  v-model="formData.companyAddress"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="邮箱">
                <el-input
                  v-model="formData.mailbox"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
              <el-form-item label="备注">
                <el-input
                  v-model="formData.remarks"
                  type="textarea"
                  :rows="3"
                  disabled
                  style="width: 400px"
                />
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
    <!-- 弹层弹层 -->
    <el-dialog title="编辑弹层" :visible="showDialog" @close="btnCancel">
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" />
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="roleForm.description" />
        </el-form-item>
      </el-form>
      <!-- 底部 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="small" @click="btnCancel">取消</el-button>
          <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 分配权限弹层 -->
    <el-dialog
      title="分配权限"
      :visible="showPermDialog"
      @close="btnPermCancel"
    >
      <!-- 权限是一颗树 -->
      <!-- 将数据绑定到组件上 -->
      <!-- check-strictly 如果为true 那表示父子勾选时  不互相关联 如果为false就互相关联 -->
      <!-- id作为唯一标识 -->
      <el-tree
        ref="permTree"
        :data="permData"
        :props="defaultProps"
        :show-checkbox="true"
        :check-strictly="true"
        :default-expand-all="true"
        :default-checked-keys="selectCheck"
        node-key="id"
      />
      <!-- 确定 取消 -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button type="primary" size="small" @click="btnPermOK"
            >确定</el-button
          >
          <el-button size="small" @click="btnPermCancel">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  getRoleList,
  getCompanyInfo,
  deleteRole,
  getRoleDetail,
  updateRole,
  addRole,
  assignPerm,
} from "@/api/setting"; //角色列表  公司信息  删除  获取角色详情  修改角色  新增
import { tranListToTreeData } from "@/utils";
import { getPermissionList } from "@/api/permisson";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      showPermDialog: false, //分配权限弹层
      permData: [], //权限数据  树形得数据
      defaultProps: {
        label: "name",
      },
      roleId: null,
      selectCheck: [], //角色所拥有的权限点数据
      list: [], //角色信息数据
      page: {
        page: 1, //当前页码
        pagesize: 2, //每页条数
        total: 0, //总数
      },
      formData: {
        //公司信息数据
      },
      showDialog: false, //控制弹层显示与隐藏
      roleForm: {
        //修改的表单数据
        name: "",
        description: "",
      },
      rules: {
        name: [
          { required: true, message: "角色名称不能为空", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["companyId"]),
  },
  created() {
    this.getRoleList(); //获取角色列表
    this.getCompanyInfo(); //获取公司信息
  },
  methods: {
    // 获取角色
    async getRoleList() {
      const { total, rows } = await getRoleList(this.page);
      this.page.total = total;
      this.list = rows;
    },
    //监听当前页
    handleCurrentChange(newPage) {
      this.page.page = newPage;
      this.getRoleList();
    },
    //获取公司数据
    async getCompanyInfo() {
      this.formData = await getCompanyInfo(this.companyId);
    },
    // 删除
    async deleteRole(id) {
      try {
        await this.$confirm("确认删除角色嘛");
        await deleteRole(id); //调用删除接口
        this.getRoleList(); //重新加载数据
        this.$message.success("删除成功");
      } catch (error) {
        console.log(error);
      }
    },
    // 编辑
    async editRole(id) {
      this.roleForm = await getRoleDetail(id); //获取数据
      this.showDialog = true; //显示弹层
    },
    // 取消
    btnCancel() {
      this.roleForm = {
        name: "",
        description: "",
      };
      this.showDialog = false;
      // 移除效验
      this.$refs.roleForm.resetFields();
    },
    // 确定
    async btnOK() {
      try {
        await this.$refs.roleForm.validate();
        //  只有检验通过才会执行 await下方的语句

        // roleForm这个对象有id就是编辑  没有就是新增
        if (this.roleForm.id) {
          await updateRole(this.roleForm);
        } else {
          await addRole(this.roleForm);
        }
        this.getRoleList(); //重新拉取数据
        this.$message.success("操作成功");
        this.showDialog = false;
      } catch (error) {
        console.log(error);
      }
    },

    // 分配权限
    async assignPerm(id) {
      this.permData = tranListToTreeData(await getPermissionList(), "0"); // 转化list到树形数据
      // 有id 就可以 id应该先记录下来
      this.roleId = id;
      // 应该去获取 这个id所存在的权限点
      const { permIds } = await getRoleDetail(id); // permIds是当前角色所拥有的权限点数据
      this.selectCheck = permIds; // 将当前角色所拥有的权限id赋值
      this.showPermDialog = true;
    },

    // 分配权限取消
    btnPermCancel() {
      this.selectCheck = []; // 重置数据  防止下次进来的时候     数据没变
      this.showPermDialog = false;
    },
    // 分配权限确定

    async btnPermOK() {
      // 调用el-tree的方法
      // console.log(this.$refs.permTree.getCheckedKeys())
      await assignPerm({
        permIds: this.$refs.permTree.getCheckedKeys(),
        id: this.roleId,
      });
      this.$message.success("分配权限成功");
      this.showPermDialog = false;
    },
  },
};
</script>

<style></style>
