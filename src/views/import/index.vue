<template>
  <!-- 公共导入组件  -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from "@/api/employees"; //导入员工excel的接口
export default {
  methods: {
    async success({ header, results }) {
      console.log(header);
      console.log(results);
      //上传时excel里面的数据
      // header, results  都是中文  我们要转化成英文
      // 姓名 username
      //  手机号 mobile
      // 入职日期 timeOfEntry
      // 聘用形式 formOfEmployment
      // 转正日期 correctionTime
      //  工号 workNumber
      // 部门 departmentName

      // 如果是导入员工
      const userRelations = {
        入职日期: "timeOfEntry",
        手机号: "mobile",
        姓名: "username",
        转正日期: "correctionTime",
        工号: "workNumber",
      };
      var arr = [];
      results.forEach((item) => {
        var userInfo = {};
        Object.keys(item).forEach((key) => {
          // 现在的key  是中文
          // console.log(key);//'手机号', '姓名', '入职日期', '转正日期', '工号'
          //userRelations[key] //对应的是值   英文
          if(userRelations[key] == "timeOfEntry" || userRelations[key] =="correctionTime"){
              userInfo[userRelations[key]] = new Date(this.formatDate(item[key]),'/') 
          }else {
              userInfo[userRelations[key]] = item[key]; //将原来中文对应的值  给到了英文对应 
          }
         
        });
        arr.push(userInfo);
      });

      await importEmployee(arr); //把上传的文件数据  添加到数据库
      this.$message.success('导入excel成功')
      this.$router.back()//回到上一个页面
    },
    // 转化excel的日期格式
      formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }
  },
};
</script>

<style></style>
