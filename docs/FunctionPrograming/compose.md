---
title: 函数组合
date: 2020-03-13
---

## 函数组合

### 背景知识
- 纯函数和柯里化很容易写出洋葱代码 `h(g(f(x)))`
```js
//获取数组的最后一个元素再转换成大写字母
//先翻转数据 --> 再取第一个元素 --> 再转换成大写字母
_.toUpper(_.first(_.reverse(array)))
```
函数组合可以让我们把细粒度的函数重新组合生成一个新的函数，避免写出洋葱代码
### 管道
>a --> fn --> b
>
>a-> f3 -> m -> f2 -> n -> f1 -> b
>
>其实中间m、n、是什么我们也不关心
类似于下面的函数
```js
fn = compose(f1, f2, f3)
b = fn(a)
```
函数组合
- **函数组合 (compose)**：如果一个函数要经过多个函数处理才能得到最终值，这个时候可以把中间
过程的函数合并成一个函数
- 函数组合默认是**从右到左**执行

```js
// 函数组合演示
function compose(f, g) {
  return function (value) {
    return f(g(value))
  }
}

// 数组翻转函数
function reverse (array) {
  return array.reverse()
}

// 获取函数第一个元素函数
function first (array) {
  return array[0]
}

// 组合函数，获取函数最后一个元素
const last = compose(first, reverse)

console.log(last([1, 2, 3, 4])) // 4
```
### Lodash中的组合函数 —— flow()/flowRight()
lodash 中组合函数 flow() 或者flowRight()，他们都可以组合多个函数。
- flow() 是从左到右运行
- flowRight() 是从右到左运行，使用的更多一些

下面实例是获取数组的最后一个元素并转化成大写字母
```js
const _ = require('lodash')

const reverse = arr => arr.reverse()
const first = arr => arr[0]
const toUpper = s => s.toUpperCase()

const f = _.flowRight(toUpper, first, reverse)

console.log(f(['one', 'two', 'three'])) // THREE
```

### 函数组合原理模拟
上面的例子我们来分析一下：

入参不固定，参数都是函数，出参是一个函数，这个函数要有一个初始的参数值
```js
function compose (...args) {
  // 返回的函数，有一个传入的初始参数即value
  return function (value) {
    // ...args是执行的函数的数组，从右向左执行那么数组要进行reverse翻转
    // reduce: 对数组中的每一个元素，去执行我们提供的一个函数，并将其汇总成一个单个结果
    // reduce的第一个参数是一个回调函数，第二个参数是acc的初始值，这里acc的初始值就是value

    // reduce第一个参数的回调函数需要两个参数，第一个参数是汇总的一个结果，第二个参数是如果处理汇总的结果的函数并返回一个新的值
    // fn指的是数组中的每一个元素（即函数），来处理参数acc，完成之后下一个数组元素处理的是上一个数组的结果acc
    return args.reverse().reduce(function (acc, fn) {
      return fn(acc)
    }, value)
  }
}


//test
const fTest = compose(toUpper, first, reverse)
console.log(fTest(['one', 'two', 'three'])) // THREE


// ES6的写法（函数都变成箭头函数）
const compose = (...args) => value => args.reverse().reduce((acc, fn) => fn(acc), value)
```

### 函数组合-结合律

#### 什么是函数组合结合律？
下面三个情况结果一样，我们既可以把 g 和 h 组合，还可以把 f 和 g 组合。
```js
// 结合律（associativity） 
let f = compose(f, g, h) 
let associative = compose(compose(f, g), h) == compose(f, compose(g, h)) 
// true
```
下面用之前的例子再详细说一下：
```js
const _ = require('lodash')

// 方式一
const f = _.flowRight(_.toUpper, _.first, _.reverse)
// 方式二
const f = _.flowRight(_.flowRight(_.toUpper, _.first), _.reverse)
// 方式三
const f = _.flowRight(_.toUpper, _.flowRight(_.first,  _.reverse))

// 无论上面那种写法，下面都输出THREE这个相同的结果
console.log(f(['one', 'two', 'three'])) // THREE
```

### 函数组合-调试
如果我们运行的结果和我们的预期不一致，我们怎么调试呢？我们怎么能知道中间运行的结果呢？

下面这个输入`NEVER SAY DIE`要对应输出`nerver-say-die`

注意：
每次把自己加的参数写前面，传入的值写后面
```js
const _ = require('lodash')

// 这里split函数需要传入两个参数，且我们最后调用的时候要传入字符串，所以字符串要在第二个位置传入，这里我们需要自己封装一个split函数
// _.split(string, separator)

// 将多个参数转成一个参数，用到函数的柯里化
const split = _.curry((sep, str) => _.split(str, sep))

// 大写变小写，用到toLower()，因为这个函数只有一个参数，所以可以在函数组合中直接使用

// 这里join方法也需要两个参数，第一个参数是数组，第二个参数是分隔符，数组也是最后的时候才传递，也需要交换
const join = _.curry((sep, array) => _.join(array, sep))

const f = _.flowRight(join('-'), _.toLower, split(' '))

console.log(f('NEVER SAY DIE')) //n-e-v-e-r-,-s-a-y-,-d-i-e
```

但是最后的结果却不是我们想要的，那么我们怎么调试呢？
```js
// NEVER SAY DIE --> nerver-say-die

const _ = require('lodash')
 
const split = _.curry((sep, str) => _.split(str, sep))
const join = _.curry((sep, array) => _.join(array, sep))

// 我们需要对中间值进行打印，并且知道其位置，用柯里化输出一下
const log = _.curry((tag, v) => {
  console.log(tag, v)
  return v
})

// 从右往左在每个函数后面加一个log，并且传入tag的值，就可以知道每次结果输出的是什么
const f = _.flowRight(join('-'), log('after toLower:'), _.toLower, log('after split:'), split(' '))
// 从右到左
//第一个log：after split: [ 'NEVER', 'SAY', 'DIE' ] 正确
//第二个log: after toLower: never,say,die  转化成小写字母的时候，同时转成了字符串，这里出了问题
console.log(f('NEVER SAY DIE')) //n-e-v-e-r-,-s-a-y-,-d-i-e


// 修改方式，利用数组的map方法，遍历数组的每个元素让其变成小写 
// 这里的map需要两个参数，第一个是数组，第二个是回调函数，需要柯里化
const map = _.curry((fn, array) => _.map(array, fn))

const f1 = _.flowRight(join('-'), map(_.toLower), split(' '))
console.log(f1('NEVER SAY DIE')) // never-say-die
```