<template>
  <!-- 员工详情页 -->
  <div class="dashboard-container">
    <div class="app-container">
      <el-card>
        <el-tabs>
          <el-tab-pane label="登录账户设置">
            <!-- 放置表单 -->
            <el-form
              :rules="rules"
              :model="userInfo"
              ref="userFrom"
              label-width="120px"
              style="margin-left: 120px; margin-top: 30px"
            >
              <el-form-item label="姓名:" prop="username">
                <el-input v-model="userInfo.username" style="width: 300px" />
              </el-form-item>
              <el-form-item label="密码:" prop="password2">
                <el-input
                  v-model="userInfo.password2"
                  style="width: 300px"
                  type="password"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="saveUser">保存</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="个人详情">
            <el-row type="flex" justify="end">
              <el-tooltip content="打印个人基本信息">
                <router-link :to="`/employees/print/${userId}?type=personal`">
                  <i class="el-icon-printer" />
                </router-link>
              </el-tooltip>
            </el-row>
            <!-- <user-info /> -->
            <!-- 使用另一种引用组件的方式   vuejs中  内置了一个组件 component   可以使用任何组件-->
            <component :is="userComponent" />
          </el-tab-pane>
          <el-tab-pane label="岗位信息">
              <el-row type="flex" justify="end">
              <el-tooltip content="打印岗位信息">
                <router-link :to="`/employees/print/${userId}?type=job`">
                  <i class="el-icon-printer"  />
                </router-link>
              </el-tooltip>
    </el-row>
            <component :is="JobInfo" />
          </el-tab-pane>
        </el-tabs>
      </el-card>
    </div>
  </div>
</template>
<script>
import { getUserDetailById } from "@/api/user"; //获取用户基本信息
import { saveUserDetailById } from "@/api/employees"; //保存用户基本信息
import UserInfo from "./components/user-info.vue"; //个人信息组件
import JobInfo from "./components/job-info"; //岗位组件
export default {
  name: "Detail",
  components: { UserInfo, JobInfo },
  props: {},
  data() {
    return {
      userComponent: "UserInfo", //引用组件
      JobInfo: "JobInfo", //引用组件
      userId: this.$route.params.id, // 这样可以后面直接通过 this.userId进行获取数据
      userInfo: {
        //   专门存放基本信息
        username: "",
        password2: "", //为什么叫password2  因为我们读取的密码是密文
      },
      rules: {
        username: [
          { required: true, message: "姓名不能为空", trigger: "blur" },
        ],
        password2: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          { min: 6, max: 9, message: "密码长度6-9位", trigger: "blur" },
        ],
      },
    };
  },
  computed: {},
  watch: {},
  created() {
    this.getUserDetailById();
  },
  methods: {
    // 获取信息
    async getUserDetailById() {
      this.userInfo = await getUserDetailById(this.userId);
    },
    // 保存
    async saveUser() {
      try {
        // 校验
        await this.$refs.userForm.validate();
        await saveUserDetailById({
          ...this.userInfo,
          password: this.userInfo.password2,
        }); // 将新密码的值替换原密码的值
        this.$message.success("保存成功");
      } catch (error) {
        console.log(error);
      }
    },
  },
  mounted() {},
};
</script>
<style scoped lang="less"></style>
