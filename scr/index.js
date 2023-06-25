import { DIR, JSmethod, JS, AXML, JSON } from "./config/index";
const fs = require("fs")
const path = require('path');

export class Wx2Ant {
  constructor(options) {
    this.suffix = [];
    this.toSuffix = [];
    this.methods = [];
    this.toMethods = [];
    this.JSRegexp = [];
    this.JSToRegexp = [];
    this.AXMLRegexp = [];
    this.AXMLToRegexp = [];
    this.JSONRegexp = [];
    this.JSONToRegexp = [];
    this.order = null;
    this.dir = options.dir || DIR;
    /**
     * 将符合后缀的文件copy和修改后缀名为指定的后缀。e.g.
     * addUpdateSuffix(".wxml",".axml");将会copy指定目录下所有的.wxml后缀的文件为.axml后缀的文件
     */
    this.UPDATAANDCOPY = 1;
    /**
     * 删除指定后缀的文件 e.g. addUpdateSuffix("abc.xml")将会删除指定目录下所有的abc.xml
     */
    this.DELETEFILE = 2;
    /**
     * 将符合后缀的文件替换为指定的后缀 e.g.
     * addUpdateSuffix(".wxml",".axml");将会修改指定目录下所有的.wxml为.axml
     */
    this.UPDATESUFFIX = 3;
    /**
     * 微信小程序转阿里小程序 js文件主要是进行库名的修改，即'wx.'-->'my.'
     * 方法名替换使用addUpdateMethods()添加更换的方法 e.g.
     * addUpdateMethods("request","httpRequest") 将request转换成httpRequest
     * axml文件主要进行 属性名称的修改，即'wx:'-->'a:'
     */
    this.WX2ANT = 4;
    // 导入配置
    this.readConfig();
    this.addUpdateSuffix("wxml", "axml"); // 这边的order是UPDATESUFFIX 所以是修改后缀名
    this.addUpdateSuffix("wxss", "acss"); // wxss->acss
    this.setOrder(this.UPDATESUFFIX);
    this.HandleFile(this.dir);
    this.clearSuffix();
    this.addUpdateSuffix(".axml", '');
    this.addUpdateSuffix(".acss", '');
    this.addUpdateSuffix(".json", '');
    // 动作
    this.setOrder(this.WX2ANT);
    // this.HandleFile(this.dir);
  }

  clearSuffix() {
    this.suffix = [];
    this.toSuffix = [];
  }

  /**
   * 主要逻辑执行
   * @param {*} src 
   */
  HandleFile(src) {
    let _this = this,
        f = null
    if (typeof src == 'string') {
        if (fs.lstatSync(src).isDirectory()) { // 文件夹
            // 读取文件夹的下的文件
            fs.readdir(src, (err, files) => {
                files.forEach(filename => {
                    //获取当前文件的绝对路径
                    const filedir = path.join(src, filename);
                    // 继续遍历知道拿到文件为止
                    this.HandleFile(filedir)
                })
            })
        }
        if (fs.lstatSync(src).isFile()) { // 文件
            console.log('文件', src)
        }
    }
    
    
    
  }

  /**
   * 设置
   * @param {*} order
   */
  setOrder(order) {
    this.order = order;
  }

  /**
   * @param {*} suffix
   * @param {*} toSuffix
   */
  addUpdateSuffix(suffix, toSuffix) {
    this.suffix.push(suffix);
    this.toSuffix.push(toSuffix);
  }

  /**
   * js函数替换（存储）
   * @param {*} method
   * @param {*} toMethod
   */
  addUpdateMethods(method, toMethod) {
    this.methods.push(method);
    this.toMethods.push(toMethod);
  }

  /**
   * js中的函数参数的替换(存储)
   * @param {*} suffix
   * @param {*} toSuffix
   */
  addJSRegexp(suffix, toSuffix) {
    this.JSRegexp.push(suffix);
    this.JSToRegexp.push(toSuffix);
  }

  /**
   * axml中的内容替换（存储）
   * @param {*} suffix
   * @param {*} toSuffix
   */
  addAXMLRegexp(suffix, toSuffix) {
    this.AXMLRegexp.push(suffix);
    this.AXMLToRegexp.push(toSuffix);
  }

  /**
   * json中的内容替换（存储）
   * @param {*} suffix
   * @param {*} toSuffix
   */
  addJSONRegexp(suffix, toSuffix) {
    this.JSONRegexp.push(suffix);
    this.JSONToRegexp.push(toSuffix);
  }

  /**
   * 初始化
   * @param {*} options
   */
  readConfig(options) {
    this.dir = DIR;
    console.log(`工作目录：`, this.dir);
    JSmethod.forEach((item) => {
      let aTob = item.split("--->");
      this.addUpdateMethods(aTob[0], aTob[1]);
    });
    JS.forEach((item) => {
      let aTob = item.split("--->");
      this.addJSRegexp(aTob[0], aTob[1]);
    });
    AXML.forEach((item) => {
      let aTob = item.split("--->");
      this.addAXMLRegexp(aTob[0], aTob[1]);
    });
    JSON.forEach((item) => {
      let aTob = item.split("--->");
      this.addJSONRegexp(aTob[0], aTob[1]);
    });
  }
}
