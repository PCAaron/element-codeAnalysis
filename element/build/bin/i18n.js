/**
 * 多语言的模板生成器
 * 通过读取examples/i18n/page.json对象并根据键值对来生成对于的不同语言的模板
*/

'use strict';

var fs = require('fs');
var path = require('path');
// 引入json文件
var langConfig = require('../../examples/i18n/page.json');

// 遍历json对象，如果存在对应语言的文件夹则返回文件信息，否则则创建新的语言文件夹
langConfig.forEach(lang => {
  try {
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  // 遍历对应语言的pages属性值，以对应template的语言模板为模板
  Object.keys(lang.pages).forEach(page => {
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`);
    // 输出到对应的vue文件路径
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`);
    var content = fs.readFileSync(templatePath, 'utf8');
    // 获取对应内容对象
    var pairs = lang.pages[page];
    // 将模板字符串替换
    Object.keys(pairs).forEach(key => {
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]);
    });
    // 写入
    fs.writeFileSync(outputPath, content);
  });
});
