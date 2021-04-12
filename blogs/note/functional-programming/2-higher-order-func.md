---
title: 高阶函数
date: 2020-03-12
author: T-ROC
tags:
 - javaScript
 - 高阶函数
categories: 
 - 函数式编程
---

## 什么是高阶函数

- 可以把函数作为参数传给另外一个函数
- 可以把函数作为另外一个函数的返回结果

<!-- more -->

### 函数作为参数

```js
// forEach
function forEach (array, fn) {
  for (let i = 0; i < array.length; i++) {
    fn(array[i])
  }
}

// filter
function filter (array, fn) {
  let results = []
  for (let i = 0; i < array.length; i++) {
    if (fn(array[i])) {
      results.push(array[i])
    }
  }
  return results
}
```

### 函数作为返回值

```js
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

## 使用高阶函数的意义

- 抽象可以帮助我们屏蔽细节，只需要关注与我们的目标
- 高阶函数是用来抽象通用问题

```js
// 面向过程的方式
let array = [1, 2, 3, 4]
for(let i = 0; i < array.length; i++) {
  console.log(array[i])
}

// 高阶函数
let array = [1, 2, 3, 4]
forEach(array, item => {
  console.log(item)
})

let r = filter(array, item => {
  return item % 2 === 0
})
```

## 常见高阶函数

forEach、map、filter、every、some、reduce、sort ......

```js
// map
const map = (array, fn) => {
  let results = [];
  for(const value of array) {
    results.push(fn(value));
  }
  return results;
}

// every
const every = (array, fn) => {
  let result = true;
  for(const value of array) {
    result = fn(value);
    if (!result) {
      break;
    }
  }
  return result;
}

// some
const some = (array, fn) => {
  let result = false;
  for(const value of array) {
    result = fn(value);
    if (result) {
      break;
    }
  }
  return result;
}
```
