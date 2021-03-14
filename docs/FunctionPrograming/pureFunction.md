---
title: 纯函数
date: 2020-03-12
---

### 纯函数的概念

**相同的输入永远会得到相同的输出**，而且没有任何可观察的副作用。

纯函数就类似数学中的函数(用来描述输入和输出之间的关系)，y = f(x)

```javascript
let numbers = [1, 2, 3, 4, 5] 
// 纯函数 
// 对于相同的函数，输出是一样的
// slice方法，截取的时候返回截取的函数，不影响原数组
numbers.slice(0, 3) // => [1, 2, 3] 
numbers.slice(0, 3) // => [1, 2, 3] 
numbers.slice(0, 3) // => [1, 2, 3] 
// 不纯的函数 
// 对于相同的输入，输出是不一样的
// splice方法，返回原数组，改变原数组
numbers.splice(0, 3) // => [1, 2, 3] 
numbers.splice(0, 3) // => [4, 5] 
numbers.splice(0, 3) // => []
// 下面函数也是纯函数 
function getSum (n1, n2) {
    return n1 + n2
}
console.log(getSum(1, 2)) // 3
console.log(getSum(1, 2)) // 3
console.log(getSum(1, 2)) // 3
```

* 函数式编程不会保留计算中间的结果，所以变量是不可变的(无状态的)
* 我们也可以把一个函数的执行结果交给另一个函数处理

### Lodash——纯函数的代表

* lodash 是一个纯函数的功能库，提供了模块化、高性能以及一些附加功能。提供了对数组、数字、对象、字符串、函数等操作的一些方法

#### 体验Lodash

* 安装

新建文件夹 -> npm init -y -> npm i lodash

* 体验

```javascript
const _ = require('lodash')
const array = ['jack', 'tom', 'lucy', 'kate']
// head的别名是first  _.head(array)也可以
console.log(_.first(array)) //jack
console.log(_.last(array)) //kate
console.log(_.toUpper(_.first(array))) //JACK
console.log(_.reverse(array))  //[ 'kate', 'lucy', 'tom', 'jack' ]
// 数组的翻转不是纯函数，因为会改变原数组。这里的reserve是使用了数组的reverse，所以也不是纯函数
const r = _.each(array, (item, index) => {
  console.log(item, index)
  // kate 0
  // lucy 1
  // tom 2
  // jack 3
})
console.log(r) // [ 'kate', 'lucy', 'tom', 'jack' ]
```

### 纯函数的好处

#### 可缓存

因为对于相同的输入始终有相同的结果，那么可以把纯函数的结果缓存起来，可以提高性能。

```javascript
const _ = require('lodash')
function getArea(r) {
  console.log(r)
  return Math.PI * r * r
}
let getAreaWithMemory = _.memoize(getArea)
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))
console.log(getAreaWithMemory(4))
// 4
// 50.26548245743669
// 50.26548245743669
// 50.26548245743669
// 看到输出的4只执行了一次，因为其结果被缓存下来了
```

那我们可以模拟一个记忆函数

```javascript
function memoize (f) {
  let cache = {}
  return function () {
    // arguments是一个伪数组，所以要进行字符串的转化
    let key = JSON.stringify(arguments)
    // 如果缓存中有值就把值赋值，没有值就调用f函数并且把参数传递给它
    cache[key] = cache[key] || f.apply(f,arguments)
    return cache[key]
  }
}
let getAreaWithMemory1 = memoize(getArea)
console.log(getAreaWithMemory1(4))
console.log(getAreaWithMemory1(4))
console.log(getAreaWithMemory1(4))
// 4
// 50.26548245743669
// 50.26548245743669
// 50.26548245743669
```

值得注意的一点是，可以通过延迟执行的方式把不纯的函数转换为纯函数：

```js
var pureHttpCall = memoize(function(url, params){
  return function() { return $.getJSON(url, params); }
});
```

这里有趣的地方在于我们**并没有真正发送 http 请求**，只是返回了一个函数，当调用它的时候才会发请求。这个函数**之所以有资格成为纯函数**，是因为它**总是会根据相同的输入返回相同的输出**：给定了 url 和 params 之后，它就只会返回同一个发送 http 请求的函数。

#### 可测试

纯函数让测试更加的方便

#### 并行处理

* 多线程环境下并行操作共享的内存数据很可能会出现意外情况。纯函数不需要访问共享的内存数据，所以在并行环境下可以任意运行纯函数
* 虽然JS是单线程，但是ES6以后有一个Web Worker，可以开启一个新线程

#### 可移植性／自文档化

#### 合理性

### 副作用

副作用就是让一个函数变得不纯，纯函数的根据市相同的输入返回相同的输出，如果函数依赖于外部的状态就无法保证输出相同，就会带来副作用，如下面的例子：

```javascript
// 不纯的函数，因为它依赖于外部的变量
let mini = 18 
function checkAge (age) { 
    return age >= mini 
}
```

副作用可能包含但不限于：

* 更改文件系统
* 往数据库插入记录
* 发送一个 http 请求
* 可变数据
* 打印/log
* 获取用户输入
* DOM 查询
* 访问系统状态

所有的外部交互都有可能带来副作用，副作用也使得方法**通用性下降不适合扩展**和**可重用性**，同时副作用会给程序中带来**安全隐患**给程序带来**不确定性**，但是副作用**不可能完全禁止**，我们不能禁止用户输入用户名和密码，只能尽可能控制它们在可控范围内发生。