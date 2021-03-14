---
title: 柯里化
date: 2020-03-13
---

## 什么是柯里化

**柯里化**这个名字由 Christopher Strachey 以逻辑学家 **Haskell Curry** 命名的

当函数有**多个参数**的时候，我们可以对函数进行改造。我们可以调用一个函数，**只传递部分的参数**（这部分参数以后永远不变），然后让这个函数**返回一个新的函数**。新的函数传递剩余的参数，并且返回相应的结果。

我们来看一个例子

```js
// 求 a, b, c 三个数的和
function sum(a, b, c) {
  return a + b + c;
}
// 调用
sum(1, 2, 3); // 6
```

改写为柯里化函数

```js
function sum(a) {
  return function (b) {
    return function(c) {
      return a + b + c;
    } 
  }
}
// 调用
let sum1 = sum(1);
let sum2 = sum1(2);
sum2(3); // 6
```
如果按照上面的方式去改造函数，势必就让开发者抓狂，最终的代码也并不简洁友好

在实际开发中我们会更多的借助成熟函数组件库进行柯里化改造，比如接下来要介绍的 **Lodash**

## Lodash 中的柯里化

**调用方法**：`_.curry(fn)`

- **功能**：创建一个函数，该函数接收**一个或多个** fn 的参数，如果 fn 所需要的参数都被提供则执行 fn 并返回执行的结果。否则继续返回该函数并等待接收剩余的参数。
- **参数**：需要柯里化的函数
- **返回值**：柯里化后的函数

我们使用 Lodash 中的`_.curry(fn)`对上面对求和函数进行柯里化

```js
// 参数是一个的为一元函数，两个的是二元函数
// 柯里化可以把一个多元函数转化成一元函数
function sum (a, b, c) {
  return a + b + c
}
// 定义一个柯里化函数
const curried = _.curry(sum)

// 如果输入了全部的参数，则立即返回结果
console.log(curried(1, 2, 3)) // 6

//如果传入了部分的参数，此时它会返回当前函数，并且等待接收 sum 中的剩余参数
console.log(curried(1)(2, 3)) // 6
console.log(curried(1, 2)(3)) // 6
```

## 手写 Lodash 中的柯里化函数

我们先分析一下上面的 `_.curry(sum)` 的特征

- 接受一个纯函数入参 sum ，返回柯里化后的函数 curried

- 如果传入 curried 参数个数与 sum 相同，及一次传入全部参数，curried 会立即执行

- 如果传入 curried 参数个数小于 sum 需要的参数，会返回一个新的函数，等待剩余需要的参数全部传入，才会执行。如果还是没有传递完所需数，会继续上面过程，返回一个新的函数，直到全部参数接收完毕

```js
function curry(fn) {
  // curriedFn 为柯里化生产的新函数
  // 为什么不使用匿名函数？因为如果传入参数 args.length 小于 fn 函数的形参个数 fn.length，需要重新递归
  return function curriedFn(...args) {
    if (args.length < fn.length){
      return function() {
        // 之前传入的参数都储存在 args 中
        // 新函数参入参数在 arguments，因为 arguments 并非真正的数组需要 Array.from() 转换成数组
        // 递归执行，重复之前的过程
        return curriedFn(...args.concat(Array.from(arguments)))
      }
    }
    return fn(...args)
  }
}
```

## 柯里化实战案例

我们工作中经常遇到各种需要正则校验的需求，例如在提交用户信息的时候校验手机号、邮箱等

下面我们来封装一个校验函数

```js
// 非柯里化版本
function checkByRegExp(regExp,string) {
    return regExp.test(string);  
}

checkByRegExp(/^1\d{10}$/, '15010001000'); // 校验电话号码
checkByRegExp(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/, 'test@163.com'); // 校验邮箱

```

在实际使用中，其实我们不需要去关注正则是如何匹配的，只需要使用更具体函数去分别校验手机号或者邮箱，这里就需要我们使用柯里化函数处理一下。

```js
//进行柯里化
let _check = curry(checkByRegExp);
//生成工具函数，验证电话号码
let checkCellPhone = _check(/^1\d{10}$/);
//生成工具函数，验证邮箱
let checkEmail = _check(/^(\w)+(\.\w+)*@(\w)+((\.\w+)+)$/);

checkCellPhone('18642838455'); // 校验电话号码
checkCellPhone('13109840560'); // 校验电话号码
checkCellPhone('13204061212'); // 校验电话号码

checkEmail('test@163.com'); // 校验邮箱
checkEmail('test@qq.com'); // 校验邮箱
checkEmail('test@gmail.com'); // 校验邮箱

```

下面对上面的思路做一个小的**总结**，柯里化的好处就是**我们可以最大程度的重用我们的函数**。


参考资料：

https://juejin.cn/post/6844904056163401742

https://juejin.cn/post/6844903882208837645



（【深入理解】函数防抖与节流 ｜ 技术点评）https://juejin.cn/post/6936410734037303332
（【深入理解】函数柯里化 ｜ 技术点评）https://juejin.cn/post/6939160922170605604
（【深入理解】面试热点-- 闭包 ｜ 技术点评）https://juejin.cn/post/6939129392715005983