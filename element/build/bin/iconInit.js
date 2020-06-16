'use strict';

/**
 * 初始化icon图标
 * 读取icon的样式表,通过解析样式表.最终生成一份所有可用的icon清单
 * 最后生成的json对象挂载在Vue.prototype.$icon原型对象上，作为icon.md图标文档
*/

var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
/**
 * 通过fs模块读取packages/theme-chalk/src/icon.scss图标样式
 * 目标内容：.el-icon-fork-spoon:before {
              content: "\e6c2";
            }
            ...
  
*/
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
/**
 * 通过postcss.parse对象将fontFile转换为对象并获取nodes节点
*/
var nodes = postcss.parse(fontFile).nodes;
/**
 * Rule {
    raws: { before: '\n\n', between: ' ', semicolon: true, after: '\n' },
    type: 'rule',
    nodes: [ [Declaration] ],
    parent: Root {
      raws: [Object],
      type: 'root',
      nodes: [Circular],
      source: [Object]
    },
    source: { start: [Object], input: [Input], end: [Object] },
    selector: '.el-icon-coffee-cup:before'
  },
  ...
 */
var classList = [];

nodes.forEach((node) => {
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/);
  var arr = selector.match(reg);

  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

classList.reverse(); // 希望按 css 文件顺序倒序排列

/**
 * 将classList存为icon.json文件
 * ["platform-eleme","eleme",...]
*/
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
