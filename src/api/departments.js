/* 
  组织架构页面的请求
*/
import request from '@/utils/request'
/** *
 *
 * 获取组织架构数据
 * **/
export function getDepartments() {
  return request({
    url: '/company/department'
  })
}

/** *
 * 
 *  根据id删除组织架构部门  接口是根据restful的规则设计的   删除 delete  新增 post  修改put 获取 get
 * **/
export function delDepartments(id) {
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}

/**
 *  新增部门接口
 *
 * ****/
export function addDepartments(data) {
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}

/**
 *  获取员工负责人下拉数据
 * **/
export function getEmployeeSimple() {
  return request({
    url: '/sys/user/simple'
  })
}

/** *
 * 获取部门详情数据
 * ***/
export function getDepartDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}


/**
 * 保存修改的数据
 *
 * ***/
export function updateDepartments(data) {
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}