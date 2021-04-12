---
title: Point Free
date: 2020-03-12
author: T-ROC
tags:
 - javaScript
 - Point Free
categories: 
 - 函数式编程
---

## Point Free

是一种编程风格，具体的实现是函数的组合。

**Point Free：** 我们可以把数据处理的过程定义成与数据无关的合成运算，不需要用到代表数据的那个参数，只要把简单的运算步骤合成到一起，在使用这种模式之前我们需要定义一些辅助的基本运算函数。

- 不需要指明处理的数据
- 只需要合成运算过程
- 需要定义一些辅助的基本运算函数

<!-- more -->

```js
//Hello World => hello world

//思路：
//先将字母换成小写，然后将空格换成下划线。如果空格比较多，要替换成一个
const fp = require('lodash/fp')

// replace方法接收三个参数
// 第一个是正则匹配pattern，第二个是匹配后替换的数据，第三个是要传的字符串
// 所以这里需要传两个参数
const f = fp.flowRight(fp.replace(/\s+/g, '_'), fp.toLower)

console.log(f('Hello World')) //hello_world
```
### Pointfree案例
```js
//world wild web -->W. W. W
//思路：
//把一个字符串中的额首字母提取并转换成大写，使用. 作为分隔符
const fp = require('lodash/fp')

const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.first), fp.map(fp.toUpper), fp.split(' '))
console.log(firstLetterToUpper('world wild web')) //W. W. W

// 上面的代码进行了两次的遍历，性能较低
// 优化
const firstLetterToUpper = fp.flowRight(fp.join('. '), fp.map(fp.flowRight(fp.first, fp.toUpper)), fp.split(' '))
console.log(firstLetterToUpper('world wild web')) //W. W. W
