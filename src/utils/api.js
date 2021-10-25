import axios from "axios";

import {Message} from 'element-ui'

import {getAccessToken, removeAccessToken} from './accessToken'

import 'element-ui/lib/theme-chalk/index.css'

import env from '../../env';
import router from "@/router";

const baseUrl = env.URL;

const wsUrl = env.WEB_SOCKET;

const baseApiUrl = baseUrl + '/backend/';

const uploadUrl = baseUrl + "/upload/index";


// 配置 携带cookie信息
// axios.defaults.withCredentials = true;
/**
 * 基础请求方法
 * @param url 请求地址
 * @param data 提交的数据，格式为json
 * @param method 请求方法
 * @param header 请求头
 * @param showMsg 是否显示返回信息
 * @returns {Promise}
 */
const request = function (url, data, method = "GET", header = false, showMsg = false) {
  if (!header) header = {'Content-Type': 'application/json'};

  return new Promise((resolve, reject) => {
    let _conf = {
      url: url,
      method: method,
      headers: header,
    };

    if (method === 'GET') _conf.params = data;
    if (method === 'POST' || method === 'DELETE') _conf.data = data;
    axios(_conf).then(res => {
      let _res = res.data;
      if (showMsg) {
        if (_res.code === 200) Message.success(_res.msg)
        else if (_res.code === 400) Message.error(_res.msg);
      }
      //成功
      res.data.code = Number.parseInt(res.data.code);
      resolve(res.data)
    }).catch(res => {
      console.log(res);
      reject({
        code: 500,
        msg: '请求错误！！' + res.message,
        data: res
      })

    })
  })
};

/**
 * get方法
 * @param action
 * @param data
 * @param showMsg
 * @returns {Promise<JSON>|{msg: string, code: number, data}}
 */
export const get = async function (action, data, showMsg = false) {
  let token = getAccessToken();
  let header = {
    'Content-Type': 'application/json',
    "TOKEN": token
  };
  let url = baseApiUrl + action;
  return new Promise((resolve, reject) => {
    request(url, data, "GET", header, showMsg).then(async res => {

      if (res.code === 100) {
        await reLogin();
      }
      resolve(res);
    }).catch(err => {
      reject(err)
    });
  })

};

/**
 * post请求方法
 * @param action
 * @param data
 * @param showMsg
 * @returns {Promise<JSON>|{msg: string, code: number, data}}
 */
const post = async function (action, data, showMsg = false) {
  let token = getAccessToken();
  let header = {
    'Content-Type': 'application/json',
    "TOKEN": token
  };
  let url = baseApiUrl + action;

  return new Promise((resolve, reject) => {
    request(url, data, "POST", header, showMsg).then(async res => {
      // TODO 这里全局请求进行校验
      // TODO 登录信息失效
      if (res.code === 100) {
        await reLogin();
      }
      resolve(res);

    }).catch(err => {
      // console.log(err);
      reject(err)
    });
  })

};
/**
 * delete请求方法
 * @param action
 * @param data
 * @param showMsg
 * @returns {Promise<JSON>|{msg: string, code: number, data}}
 */
const del = async function (action, data, showMsg = false) {
  let token = getAccessToken();
  let header = {
    'Content-Type': 'application/json',
    "TOKEN": token
  };
  let url = baseApiUrl + action;

  return new Promise((resolve, reject) => {
    request(url, data, "DELETE", header, showMsg).then(async res => {
      // TODO 这里全局请求进行校验
      // TODO 登录信息失效
      if (res.code === 100) {
        await reLogin();
      }
      resolve(res);

    }).catch(err => {
      // console.log(err);
      reject(err)
    });
  })

};


const upload = function () {
  this.$message('这是一条消息提示');
};

/**
 * 重新登录
 * @returns {Promise<void>}
 */
const reLogin = async function () {
  console.log('登录失效 %c调用位置： %c api.reLogin', 'color: blue', 'color: red');
  removeAccessToken();
    Message.warning("登录失效或过期");
  setTimeout(()=>{
      window.location.reload();
  },1200)
};

/**
 * 获取头部
 * @returns {{TOKEN: *}}
 */
const header = function () {
  let token = getAccessToken();
  return {
    "TOKEN": token
  };
};
export default {
  request,
  baseApiUrl,
  baseUrl,
  uploadUrl,
  get,
  post,
  del,
  upload,
  reLogin,
  header,
  wsUrl,
  install: Vue =>{
    Vue.prototype.$request = request;
    Vue.prototype.$get = get;
    Vue.prototype.$post = post;
    Vue.prototype.$baseUrl = baseUrl;
  }
};
