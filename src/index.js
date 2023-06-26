import { DIR } from "./config/index";
const fs = require("fs");
const path = require("path");
const readline = require("linebyline");
const JSAPR = require("./lib/JSApiPropReplace.js");
let jsaprstate = "";
export class Wx2Ant {
  constructor(options) {
    this.rl = "";
    this.ACSSRegexp = [];
    this.ACSSToRegexp = [];
    this.suffix = [];
    this.toSuffix = [];
    this.methods = [];
    this.toMethods = [];
    this.JSRegexp = [];
    this.JSToRegexp = [];
    this.JSApiPropReplace = [];
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
    this.WX2ANTEXECUTE = 4;
    // 导入配置
    this.readConfig(options);
  }

  main() {
    this.addUpdateSuffix("wxml", "axml"); // 这边的order是UPDATESUFFIX 所以是修改后缀名
    this.addUpdateSuffix("wxss", "acss"); // wxss->acss
    this.setOrder(this.UPDATESUFFIX);
    this.HandleFile(this.dir);
    this.clearSuffix();
    this.addUpdateSuffix(".axml", "");
    this.addUpdateSuffix(".acss", "");
    this.addUpdateSuffix(".json", "");
    this.addUpdateSuffix(".js", "");
    // 动作
    this.setOrder(this.WX2ANTEXECUTE);
    this.HandleFile(this.dir);
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
      f = null;
    // 文件夹
    if (typeof src == "string" && fs.lstatSync(src).isDirectory()) {
      // 读取文件夹的下的文件
      let files = fs.readdirSync(src);
      files.forEach((filename) => {
        //获取当前文件的绝对路径
        const filedir = path.join(src, filename);
        // 继续遍历知道拿到文件为止
        this.HandleFile(filedir);
      });
    }
    // 文件
    if (
      typeof src == "string" &&
      this.isValid(src) != -1 &&
      fs.lstatSync(src).isFile()
    ) {
      let order = this.order;
      switch (order) {
        case this.UPDATAANDCOPY:
          this.updataAndCopy(src);
          break;
        case this.DELETEFILE:
          this.deleteFile(src);
          break;
        case this.UPDATESUFFIX:
          this.updataSuffix(src);
          break;
        case this.WX2ANTEXECUTE:
          this.wx2ant(src);
          break;
        default:
          console.error("没有该种处理文件的方式");
          break;
      }
    }
  }

  /**
   * 判断是否是需要转换的文件
   * @param {*} f
   * @returns
   */
  isValid(f) {
    let suffix = this.suffix;
    for (let i = 0; i < suffix.length; i++) {
      if (f.endsWith(suffix[i])) {
        return i;
      }
    }
    return -1;
  }

  /**
   * 删除指定后缀的文件 e.g. addUpdateSuffix("abc.xml")将会删除指定目录下所有的abc.xml
   * @param {*} f
   */
  deleteFile(f) {
    let index = this.isValid(f);
    let rStr = `\.${this.suffix[index]}$`;
    let reg = new RegExp(rStr);
    let newFilename = f.replace(reg, `.${this.toSuffix[index]}`);
    try {
      fs.unlinkSync(f, newFilename);
    } catch (e) {
      console.error("文件删除出错：" + e);
    }
  }

  /**
   * 将符合后缀的文件copy和修改后缀名为指定的后缀。e.g.
   * addUpdateSuffix(".wxml",".axml");将会copy指定目录下所有的.wxml后缀的文件为.axml后缀的文件
   * @param {*} f
   */
  updataAndCopy(f) {
    let index = this.isValid(f);
    let rStr = `\.${this.suffix[index]}$`;
    let reg = new RegExp(rStr);
    let newFilename = f.replace(reg, `.${this.toSuffix[index]}`);
    try {
      fs.copyFileSync(f, newFilename);
    } catch (e) {
      console.error("文件复制出错：" + e);
    }
  }

  /**
   * 将符合后缀的文件替换为指定的后缀 e.g.
   * addUpdateSuffix(".wxml",".axml");将会修改指定目录下所有的.wxml为.axml
   * @param {*} f
   */
  updataSuffix(f) {
    let index = this.isValid(f);
    let rStr = `\.${this.suffix[index]}$`;
    let reg = new RegExp(rStr);
    let newFilename = f.replace(reg, `.${this.toSuffix[index]}`);
    try {
      // 文件重命名
      fs.renameSync(f, newFilename);
    } catch (e) {
      console.error("文件修改后缀名出错：" + newFilename + "--" + e);
    }
  }

  /**
   * 主要逻辑
   * @param {*} f
   */
  wx2ant(f) {
    // js 转换
    if (f.endsWith(".js")) {
      this.updateJs(f);
    }
    // axml 转换
    if (f.endsWith(".axml")) {
      this.updateAxml(f);
    }
    // json 转换
    if (f.endsWith(".json")) {
      this.updateJson(f);
    }
    // scss 转换
    if (f.endsWith(".acss")) {
      this.updateAcss(f);
    }
  }

  /**
   * 转换acss
   * @param {*} file 
   */
  updateAcss(file) {
    let ACSSRegexp = this.ACSSRegexp;
    let ACSSToRegexp = this.ACSSToRegexp;
    try {
        let content = fs.readFileSync(file, "utf8");
        for (let i in ACSSRegexp) {// 修改不一样的方法
            content = content.replace(new RegExp(ACSSRegexp[i], "g"), ACSSToRegexp[i]);
        }
        fs.writeFileSync(file, content);
        console.log("转换acss文件成功：" + file);
    } catch (e) {
        console.log(e)
        console.log("转换acss文件出错：" + file);
    }
  }

  /**
   * 转换json文件
   * @param {*} file
   */
  updateJson(file) {
    let JSONRegexp = this.JSONRegexp;
    let JSONToRegexp = this.JSONToRegexp;
    try {
      let content = fs.readFileSync(file, "utf8");
      for (let i in JSONRegexp) {
        // 修改不一样的方法
        content = content.replace(
          new RegExp(JSONRegexp[i], "g"),
          JSONToRegexp[i]
        );
      }
      fs.writeFileSync(file, content);
      console.log("转换json文件成功：" + file);
    } catch (e) {
      console.log("转换json文件出错：" + file);
    }
  }

  /**
   * 修改html
   * @param {*} f
   */
  updateAxml(file) {
    let AXMLRegexp = this.AXMLRegexp;
    let AXMLToRegexp = this.AXMLToRegexp;
    try {
      let content = fs.readFileSync(file, "utf8");
      for (let i in AXMLRegexp) {
        // 修改不一样的方法
        content = content.replace(
          new RegExp(AXMLRegexp[i], "g"),
          AXMLToRegexp[i]
        );
      }
      fs.writeFileSync(file, content);
      console.log("转换axml文件成功：" + file);
    } catch (e) {
      console.log("转换axml文件出错：" + file, e);
    }
  }

  /**
   * 修改js
   * @param {*} file
   */
  updateJs(file) {
    const methods = this.methods;
    const toMethods = this.toMethods;
    const JSRegexp = this.JSRegexp;
    const JSToRegexp = this.JSToRegexp;
    let preffix = "(^|\\W+)wx\\.";
    let toPreffix = "$1my.";
    try {
      let content = fs.readFileSync(file, "utf8");
      for (let i in methods) {
        // 修改不一样的方法
        content = content.replace(
          new RegExp(preffix + methods[i], "g"),
          toPreffix + toMethods[i]
        );
      }
      for (let i in JSRegexp) {
        // 修改不一样的方法
        content = content.replace(new RegExp(JSRegexp[i], "g"), JSToRegexp[i]);
      }
      content = content.replace(new RegExp(preffix, "g"), toPreffix); // 统一修改未进行方法替换的前缀
      content = JSAPR.replace(content, this.JSApiPropReplace);
      fs.writeFileSync(file, content);
      console.log("转换js文件成功", file);
    } catch (e) {
      console.error("转换js文件出错：" + file, e);
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
   * 获取当前执行任务
   * @returns
   */
  getOrder() {
    return this.order;
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
   * acss要更新的正则表达式
   * @param {*} suffix
   * @param {*} toSuffix
   */
  addACSSRegexp(suffix, toSuffix) {
    this.ACSSRegexp.push(suffix);
    this.ACSSToRegexp.push(toSuffix);
  }

  /**
   * JSApiPropReplace
   * @param {*} str
   */
  addToJSApiPropReplace(str) {
    
    if (str === "PRO:") {
      jsaprstate = "";
    } else if (str === "KEYS:") {
    } else if (str.startsWith("KEYS:") && jsaprstate !== "") {
      str = str.substring(5).trim();
      let aTob = str.split("--->");
      if (aTob[0]) {
        this.JSApiPropReplace[jsaprstate][aTob[0]] = aTob[1];
      }
      
    } else if (str.startsWith("PRO:")) {
      str = str.substring(4).trim();
      jsaprstate = str;
      this.JSApiPropReplace[jsaprstate] = {};
    } else if (jsaprstate === "") {
      jsaprstate = str;
      this.JSApiPropReplace[jsaprstate] = {};
    } else if (jsaprstate !== "") {
      let aTob = str.split("--->");
      if (aTob[0]) {
        this.JSApiPropReplace[jsaprstate][aTob[0]] = aTob[1];
      }
    }
  }

  /**
   * 初始化
   * @param {*} options
   */
  readConfig(options) {
    let _this = this;
    this.dir = options && options.DIR ? options.DIR : DIR;

    let configpath = path.resolve(__dirname, "./config/index.txt");
    this.rl = readline(options.configpath || configpath);
    let line = "";
    let state = "";
    this.rl.on("line", function (line, lineCount, byteCount) {
      line = line.replace(/#.*$/g, "").trim();
      if (state === "") {
        if ("JSmethod" === line) {
          state = line;
        } else if ("JS" === line) {
          state = line;
        } else if ("AXML" === line) {
          state = line;
        } else if ("ACSS" === line) {
          state = line;
        } else if ("DIR" === line) {
          state = line;
        } else if ("JSON" === line) {
          state = line;
        } else if ("JS_API_PROP_REPLACE" === line) {
          state = line;
        } else if ("OVER" === line) {
          // 结束
          _this.main();
        }
      } else if ("end" === line) {
        state = "";
      } else if ("JSmethod" === state) {
        let aTob = line.split("--->");
        _this.addUpdateMethods(aTob[0], aTob[1]);
      } else if ("JS" === state) {
        let aTob = line.split("--->");
        _this.addJSRegexp(aTob[0], aTob[1]);
      } else if ("AXML" === state) {
        let aTob = line.split("--->");
        _this.addAXMLRegexp(aTob[0], aTob[1]);
      } else if ("ACSS" === state) {
        let aTob = line.split("--->");
        _this.addACSSRegexp(aTob[0], aTob[1]);
      } else if ("JSON" === state) {
        let aTob = line.split("--->");
        _this.addJSONRegexp(aTob[0], aTob[1]);
      } else if ("JS_API_PROP_REPLACE" === state) {
        _this.addToJSApiPropReplace(line);
      } else if ("DIR" === state) {
        console.log(`工作目录：`, _this.dir);
      } else if ("OVER" === line) {
        // 结束
        console.log(_this);
      }
    });
  }
}
