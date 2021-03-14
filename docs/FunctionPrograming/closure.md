---
title: 闭包
date: 2020-03-13
---
## 定义

一个函数和对其周围状态（lexical environment，词法环境）的引用捆绑在一起（或者说函数被引用包围），这样的组合就是闭包（closure）。也就是说，闭包让你可以**在一个内层函数中访问到其外层函数的作用域**。在 JavaScript 中，每当创建一个函数，闭包就会在函数创建的同时被创建出来。

--- 来源：[MDN](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Closures)

下面我们来看一些闭包的例子：

```javascript
// 函数作为返回值
function makeFun() {
  const msg = "Hello function";
  return function () {
    console.log(msg)
  }
}
const fn = makeFun()
fn()

// once
function once(fn){
  let done = false;
  return function(){
    if (!done) {
      done = true;
      return fn.apply(this, arguments);
    }
  }
}
```

## 闭包的本质

函数在执行的时候会放到一个执行栈上，当函数执行完毕之后会从执行栈上移除，**但是堆上的作用域成员因为被外部引用不能释放**，因此内部函数依然可以访问外部函数的成员。

## 闭包实际应用案例

1. 给了一组数据，使用 Math.pow() 求平方根

```javascript
// 不使用闭包
Math.pow(4, 2)
Math.pow(5, 2)
// 闭包实现
function makePower (power) {
  return function (number) {
    return Math.pow(number, power)
  }
}
// 求平方
let power2 = makePower(2)
let power3 = makePower(3)
console.log(power2(4))
console.log(power2(5))
console.log(power3(4))
```

2. 例如公司为不同职级别程序员计算工资，假设：

- S5: 基本工资 10000
- S6: 基本工资 20000
- 另外绩效工资是 2000 至 5000 不等

我们定义基本工资为 base, 绩效工资为 performance

```javascript
// 非闭包
function makeSalary(base, performance) {
  return base + performance;
}
// 基本
const S5 = 10000;
const S6 = 20000;
// 员工 A, B, C ....
let A,B,C; // ....
A = makeSalary(S5, 3000);
B = makeSalary(S6, 4000);
C = makeSalary(S5, 2000);
......
```

我们使用闭包的方式改造一下

```javascript
// 闭包
function makeSalary(base) {
  return function(performance){
    return base + performance;
  }
}
// 基本
const S5 = 10000;
const S6 = 20000;
const makeSalaryS5 = makeSalary(S5);
const makeSalaryS6 = makeSalary(S6);
// 员工 A, B, C ....
let A,B,C; // ....
A = makeSalaryS5(3000);
B = makeSalaryS6(4000);
C = makeSalaryS5(2000);
......
```

从上面的案例，我们可以看到使用闭包，避免来例如基本工资这类变化不大的参数每次都需要传入，而是生成可读性更好的只需要一个参数的函数。

## 如何在浏览器上调试

我们以上面案例1为例

* **step 1 我们先打断点**

![图片](https://uploader.shimo.im/f/hrQO21IzBSg8WDKj.png!thumbnail?fileGuid=JJYPGkKcvWqChdvK)

* **step 2 开始调试**

当 js 执行到 15 行时，我们可以发现因为闭包的产生，power 变量并没有被释放。我们可以从调试工具上看到 Closure 下面 出现了`power: 2`，这里就是我们要从调试工具上找的闭包区域，也是判断闭包有没有产生的不错依据。

![图片](https://uploader.shimo.im/f/JFIlE6taO3TQOalx.png!thumbnail?fileGuid=JJYPGkKcvWqChdvK)
