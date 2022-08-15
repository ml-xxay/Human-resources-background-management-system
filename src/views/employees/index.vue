<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部通栏 -->
      <page-tools :show-before="true">
        <!-- 左侧插槽显示总记录数 -->
        <span slot="before">{{ page.total }}条记录</span>
        <!-- 右侧插槽显示  导入  导出  新增员工-->
        <template slot="after">
          <el-button
            size="small"
            type="warning"
            @click="$router.push('/import')"
            >excel导入</el-button
          >
          <el-button size="small" type="danger" @click="exportData"
            >excel导出</el-button
          >
          <el-button size="small" type="primary" @click="showDialog = true"
            >新增员工</el-button
          >
        </template>
      </page-tools>
      <!--下方显示内容表格 -->
      <el-card>
        <el-table border v-loading="loading" :data="list">
          <el-table-column type="index" label="序号" sortable="" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" align="center" sortable="">
            <template slot-scope="{ row }">
              <img
                @click="showQrCode(row.staffPhoto)"
                slot="reference"
                v-imgerror="require('@/assets/common/bigUserHeader.png')"
                :src="row.staffPhoto"
                style="
                  border-radius: 50%;
                  width: 100px;
                  height: 100px;
                  padding: 10px;
                "
                alt=""
              />
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column
            label="聘用形式"
            sortable=""
            prop="formOfEmployment"
            :formatter="formatEmployment"
          />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <!-- 使用作用于插槽  + 过滤器 -->
            <!-- <template slot-scope="obj"></template> 这种方式也行  不过已经废弃了 -->
            <template v-slot="{ row }">
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>
          <el-table-column label="账户状态" sortable="" prop="enableState">
            <template v-slot="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState == 1" />
            </template>
          </el-table-column>
          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button
                type="text"
                size="small"
                @click="$router.push(`/employees/detail/${row.id}`)"
                >查看</el-button
              >
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)"
                >角色</el-button
              >
              <el-button
                type="text"
                size="small"
                @click="deleteEmployee(row.id)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-card>

      <!-- 分页组件 -->
      <el-row type="flex" justify="center" align="middle" style="height: 60px">
        <el-pagination
          layout="prev, pager, next"
          :page-size="page.size"
          :current-page="page.page"
          :total="page.total"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 放置弹窗组件 -->
    <add-employee :showDialog.sync="showDialog" />

    <!-- //图片弹层 -->
    <el-dialog
      title="二维码"
      :visible.sync="showCodeDialog"
      @opened="showQrCode"
      @close="imgUrl = ''"
    >
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>

    <!-- 放置角色分配组件 -->
    <assign-role
      ref="assignRole"
      :showRoleDialog.sync="showRoleDialog"
      :user-id="userId"
    />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from "@/api/employees"; //获取员工数据  删除员工
import EmployeeEnum from "@/api/constant/employees"; //引入员工的枚举对象
import AddEmployee from "./components/add-employee.vue"; //弹窗组件
import { formatDate } from "@/filters"; //引入时间处理方法
import QrCode from "qrcode"; //引入二维码插件
import AssignRole from "./components/assign-role.vue";
export default {
  components: {
    AddEmployee,
    AssignRole,
  },
  data() {
    return {
      list: [], //员工数据
      page: {
        page: 1, //页码
        size: 10, //条数
        total: 0, //总数
      },
      loading: false, //显示遮罩层
      showDialog: false, //控制弹窗显示与隐藏
      showCodeDialog: false, //二维码弹层
      showRoleDialog: false,
      userId: "",
    };
  },
  created() {
    this.getEmployeeList();
  },
  methods: {
    // 获取员工数据
    async getEmployeeList() {
      this.loading = true;
      const { total, rows } = await getEmployeeList(this.page);
      this.page.total = total;
      this.list = rows;
      console.log(rows);
      this.loading = false;
    },
    // 分页   newPage 是最新的页码
    changePage(newPage) {
      this.page.page = newPage;
      this.getEmployeeList(this.page); //重新拉去数据
    },
    // 格式化聘用形式
    formatEmployment(row, column, cellValue, index) {
      //row是当前行数据  column是列属性  cellValue单元格的值
      // 要去找 1所对应的值
      const obj = EmployeeEnum.hireType.find((item) => item.id === cellValue); //返还枚举数据里面的满足条件的那一项的对象// {id: 1,value: '正式'},

      return obj ? obj.value : "未知";
    },
    // 删除
    async deleteEmployee(id) {
      try {
        await this.$confirm("您确定删除该员工吗");
        await delEmployee(id); //删除
        // 当前所在页数的数据只有一条  并且不是在第一页
        if (this.list.length == 1 && this.page.page !== 1) {
          this.page.page--; //页码减一 在重新获取数据  就不会有bug
        }
        this.getEmployeeList(); //重新获取数据
        this.$message.success("删除员工成功");
      } catch (error) {
        console.log(error);
      }
    },

    // 导出excel
    exportData() {
      const headers = {
        姓名: "username",
        手机号: "mobile",
        入职日期: "timeOfEntry",
        聘用形式: "formOfEmployment",
        转正日期: "correctionTime",
        工号: "workNumber",
        部门: "departmentName",
      };
      //点击导出时  调用包 懒加载导出包
      import("@/vendor/Export2Excel").then(async (excel) => {
        // 获取员工所有数据
        const { rows } = await getEmployeeList({
          page: 1,
          size: this.page.total,
        });

        const data = this.formatJson(headers, rows); // 返回的data 就是要导出去的数据结构
        console.log(data);
        const multiHeader = [["姓名", "主要信息", "", "", "", "", "部门"]];
        const merges = ["A1:A2", "B1:F1", "G1:G2"];
        // excel是引入文件的到处对象
        excel.export_json_to_excel({
          header: Object.keys(headers), //表头
          data: data, //要导出的数据
          filename: "员工资料表", //导出表名字
          multiHeader, // 复杂表头
          merges, // 合并选项
        });
        // excel.export_json_to_excel({
        //   header: ['姓名', '薪资'],
        //   data: [['张三', 12000], ['李四', 5000]],
        //   filename: '员工薪资表',
        //   autoWidth: true,
        //   bookType: 'csv'
        // })
        // [{username:'张三',mobile:13112345678}] 转化成 [['张三',13112345678]]
      });
    },
    // 图片二维码弹层
    showQrCode(url) {
      // url存在的情况下 才弹出层
      if (url) {
        this.showCodeDialog = true; // 数据更新了 但是我的弹层会立刻出现吗 ？页面的渲染是异步的！！！！
        // 数据更新完毕，页面渲染完毕之后执行  $nextTick
        this.$nextTick(() => {
          // 此时可以确认已经有ref对象了
          QrCode.toCanvas(this.$refs.myCanvas, url); // 将地址转化成二维码
          // 如果转化的二维码后面信息 是一个地址的话 就会跳转到该地址 如果不是地址就会显示内容
        });
      } else {
        this.$message.warning("该用户还未上传头像");
      }
    },
    // 该方法负责将数组转化成二维数组
    formatJson(headers, rows) {
      return rows.map((item) => {
        // item 是每一项
        return Object.keys(headers).map((key) => {
          // 因为导出时间不行  所以我们要处理一下时间  和 聘用形式
          if (
            headers[key] == "timeOfEntry" ||
            headers[key] == "correctionTime"
          ) {
            // 格式化日期
            return formatDate(item[headers[key]]);
          } else if (headers[key] == "formOfEmployment") {
            var en = EmployeeEnum.hireType.find(
              (obj) => obj.id === item[headers[key]]
            );
            return en ? en.value : "未知";
          }
          return item[headers[key]];
        });
      });
    },
    // 点击角色
    // 编辑角色
    async editRole(id) {
      console.log(1111);
      this.userId = id; // props传值 是异步的
      await this.$refs.assignRole.getUserDetailById(id); // 父组件调用子组件方法
      this.showRoleDialog = true;
    },
  },
};
</script>

<style></style>
