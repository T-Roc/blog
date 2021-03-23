---
title: FP 模块
date: 2020-03-12
author: T-ROC
tags:
 - lodash
categories: 
 - 函数式编程
---

## FP模块

函数组合的时候用到很多的函数需要柯里化处理，我们每次都处理那些函数有些麻烦，所以lodash中有一个FP模块

- lodash 的 fp 模块提供了实用的对函数式编程友好的方法
- 提供了不可变 auto-curried iteratee-first data-last （函数之先，数据之后）的方法

<!-- more -->

```js
// lodash 模块 
const _ = require('lodash')
// 数据置先，函数置后
_.map(['a', 'b', 'c'], _.toUpper) 
// => ['A', 'B', 'C'] 
_.map(['a', 'b', 'c']) 
// => ['a', 'b', 'c'] 

// 数据置先，规则置后
_.split('Hello World', ' ') 

//BUT
// lodash/fp 模块 
const fp = require('lodash/fp') 

// 函数置先，数据置后
fp.map(fp.toUpper, ['a', 'b', 'c'])
fp.map(fp.toUpper)(['a', 'b', 'c']) 
// 规则置先，数据置后
fp.split(' ', 'Hello World') 
fp.split(' ')('Hello World')
```

### 体验FP模块对于组合函数的友好
```js
const fp = require('lodash/fp')

const f = fp.flowRight(fp.join('-'), fp.map(fp.toLower), fp.split(' '))

console.log(f('NEVER SAY DIE')) // never-say-die
```

### Lodash-map方法的小问题
```js
const _ = require('lodash')
const fp = require('lodash/fp')

console.log(_.map(['23', '8', '10'], parseInt)) 
// [ 23, NaN, 2 ]

_.map(['23', '8', '10'], function(...args){
  console.log(...args)
})
// _.map后面的回调函数接受有三个参数，第一个参数是遍历的数组，第二个参数是key/index，第三个参数是对应函数
// 23 0 [ '23', '8', '10' ]
// 8 1 [ '23', '8', '10' ]
// 10 2 [ '23', '8', '10' ]

// parseInt第二个参数表示进制，0默认就是10进制，1不存在，2表示2进制，所以输出是那个样子
//parseInt('23', 0, array)
//parseInt('8', 1, array)
//parseInt('10', 2, array)

// 要解决的话需要重新封装一个parseInt方法

// 而使用fp模块的map方法不存在下面的问题
console.log(fp.map(parseInt, ['23', '8', '10'])) 
// [ 23, 8, 10 ]
```