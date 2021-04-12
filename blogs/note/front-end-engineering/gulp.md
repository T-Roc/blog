---
title: gulp 使用
date: 2020-03-12
author: T-ROC
tags:
 - 工程化
 - gulp
categories: 
 - 前端工程化
---

## 一、基本使用

```js
// 创建 gulpfile.js 
// gulp 入口文件

// yarn gulp foo 可以启动该任务
exports.foo = done => {
  done() // 标识任务完成
}

// yarn gulp 启动的默认任务
exports.default = done => {
  done() // 标识任务完成
}

// gulp 4.0 以前
const gulp = require('gulp')
gulp.task('bar', done => {
  done()
})
```

## 二、组合任务

- series 串行
- parallel 并行

```js
const { series, parallel } = require('gulp')

const task1 = done => {
  setTimeout(() => {
    console.log('task1 working~')
    done()
  }, 1000)
}

const task2 = done => {
  setTimeout(() => {
    console.log('task2 working~')
    done()
  }, 1000)  
}

const task3 = done => {
  setTimeout(() => {
    console.log('task3 working~')
    done()
  }, 1000)  
}

// 让多个任务按照顺序依次执行
exports.foo = series(task1, task2, task3)

// 让多个任务同时执行
exports.bar = parallel(task1, task2, task3)
```

## 三、异步任务

```js
// 返回 promise
exports.promise = () => {
  console.log('promise task~')
	return Promise.resolve()
}

// async 
const timeout = time => {
	return new promise(resolve => {
  	setTimeout(resolve, time)
  })
}
exports.async = async () => {
  await timeout(1000)
	console.log('async task')
}

// stream 
exports.stream = () => {
	const readStream = fs.createReadStream('package.json')
  const writeSteam = fs.createWriteStream('temp.txt')
  readStream.pipe(writeStream)
  return readStream
  // gulp 会自动监听 stream 的 end 事件
  // 可以模拟如下
  // readStream.on('end', () => {
  // 	done()
  // })
}

```

## 四、构建过程核心工作原理

```js
const fs = require('fs')
const { Transform } = require('stream')

exports.default = () => {
	// 文件读取流
  const read = fs.createReadStream('normalize.css')
  // 文件写入流
  const write = fs.createWriteStream('normalize.min.css')
  // 文件转换流
  const = transform = new Transform({
  	transform: (chunk, encoding, callback) => {
    	// 核心转换过程实现
      // chunk => 读取流中读取到的内容 （Buffer）
      const input = chunk.toString()
      const output = input.replace(/\s+/g, '').replace(/\/\*.+?\*\//g, '')
      callback(null, output)
    }
  })
  // 把读取出来的文件流导入写入流
  read
    .pipe(transform)
    .pipe(write)
  return read
}
```

## 五、文件操作 API

```js
const { src, dest } = require('gulp')
const cleanCss = require('gulp-clean-css')
const rename = require('gulp-rename')

exports.default = () => {
	return src('src/*.css') // 读取流 src 目录下所有的 css 文件
  	.pipe(cleanCss()) // css 转换流（压缩代码） yarn add gulp-clean-css --dev
  	.pipe(rename({ extname: '.min.css' })) // 重命名 yarn add gulp-rename --dev
  	.pipe(dest('dist')) // 写入流
}
```

## 六、Gulp 自动化构建案例

```js
const { src, dest, parallel, series}  = require('gulp');
const sass = require('gulp-sass')
// gulp-babel 直接做了链接，没办法直接编译，需要自己安装 @babel/core @babel/preset-env 两个核心包
const babel = require('gulp-babel')
// swig 类似于 ejs 的模版引擎
const swig = require('gulp-swig')
// 图片压缩
const imagemin = require('gulp-imagemin')
// 删除插件
const del = require('del')

// 页面渲染模拟数据
const data = {
  menus: [
    ......
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = () => {
  return del(['dist'])
}

const style = () => {
  return src('./src/assets/styles/*.scss', 
    // 这里是指定基础的目录结构
    { base: 'src' }
  )
  // 默认 _xx.scss 开头的 sass 文件不会被转化，因为被视做私有样式文件
  // outputStyle: 'extend' 是将 {} 完全展开符合我们的 css 编写习惯 👇
  // {
  //   width: 100px;}
  // 变为：
  // {
  //   width: 100px;
  // }
  .pipe(sass({ outputStyle: 'extend'}))
  .pipe(dest('dist')) 
}

const script = () => {
  return src('./src/assets/scripts/*.js', { base: 'src' })
  .pipe(babel({presets: ['@babel/preset-env']}))
  .pipe(dest('dist'))
}

const html = () => {
  return src('./src/*.html', { base: 'src' })
  .pipe(swig({ data }))
  .pipe(dest('dist'))
}

const image = () => {
  return src('./src/assets/images/**', { base: 'src' })
  .pipe(imagemin())
  .pipe(dest('dist'))
}

const font = () => {
  return src('./src/assets/fonts/**', { base: 'src' })
  .pipe(imagemin())
  .pipe(dest('dist'))
}

const extra = () => {
  return src('./public/**', { base: 'public' })
  .pipe(dest('dist'))
}

// 并行处理
const compile = parallel(style, script, html, image, font)

const build = series(clean, parallel(compile, extra)) 

module.exports = {
  build
}
```

为了方便 gulp 插件的取用，我们可以使用 gulp-load-plugins 自动引入插件

```js
const { src, dest, parallel, series}  = require('gulp');

// 删除插件
const del = require('del')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()

// 页面渲染模拟数据
const data = {
  menus: [
    ......
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = () => {
  return del(['dist'])
}

const style = () => {
  return src('./src/assets/styles/*.scss', 
    { base: 'src' }
  )
  .pipe(plugins.sass({ outputStyle: 'extend'}))
  .pipe(dest('dist')) 
}

const script = () => {
  return src('./src/assets/scripts/*.js', { base: 'src' })
  .pipe(plugins.babel({presets: ['@babel/preset-env']}))
  .pipe(dest('dist'))
}

const html = () => {
  return src('./src/*.html', { base: 'src' })
  .pipe(plugins.swig({ data }))
  .pipe(dest('dist'))
}

const image = () => {
  return src('./src/assets/images/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const font = () => {
  return src('./src/assets/fonts/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const extra = () => {
  return src('./public/**', { base: 'public' })
  .pipe(dest('dist'))
}

// 并行处理
const compile = parallel(style, script, html, image, font)

const build = series(clean, parallel(compile, extra)) 

module.exports = {
  build
}
```

## 七、监视页面变化及构建优化

```js
const { src, dest, parallel, series, watch}  = require('gulp');

// 删除插件
const del = require('del')

const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
const bs = browserSync.create()

// 页面渲染模拟数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        {
          name: 'Twitter',
          link: 'https://twitter.com/w_zce'
        },
        {
          name: 'About',
          link: 'https://weibo.com/zceme'
        },
        {
          name: 'divider'
        },
        {
          name: 'About',
          link: 'https://github.com/zce'
        }
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = () => {
  return del(['dist'])
}

const style = () => {
  return src('./src/assets/styles/*.scss', 
    // 这里是指定基础的目录结构
    { base: 'src' }
  )
  // 默认 _xx.scss 开头的 sass 文件不会被转化，因为被视做私有样式文件
  // outputStyle: 'extend' 是将 {} 完全展开符合我们的 css 编写习惯 👇
  // {
  //   width: 100px;}
  // 变为：
  // {
  //   width: 100px;
  // }
  .pipe(plugins.sass({ outputStyle: 'extend'}))
  .pipe(dest('dist')) 
}

const script = () => {
  return src('./src/assets/scripts/*.js', { base: 'src' })
  .pipe(plugins.babel({presets: ['@babel/preset-env']}))
  .pipe(dest('dist'))
}

const html = () => {
  return src('./src/*.html', { base: 'src' })
  .pipe(plugins.swig({ data }))
  .pipe(dest('dist'))
}

const image = () => {
  return src('./src/assets/images/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const font = () => {
  return src('./src/assets/fonts/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const extra = () => {
  return src('./public/**', { base: 'public' })
  .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/styles/*.js', script)
  watch('src/*.html', html)

  // 静态文件实时编译，这里注释掉
  // watch('src/assets/images/**', image)
  // watch('src/assets/font/**', font)
  // watch('public/**', extra)

  // 监控静态文件变化，更新浏览器
  watch([
    'src/assets/images/**',
    'src/assets/font/**',
    'src/*.html'
  ], bs.reload)
  

  bs.init({
    notify: false, // 页面提示
    port: 2080,
    // open: true, // 自动打开浏览器？
    files: 'dist/*', // 该指定目录下面的文件变化时，服务自动更新
    server: {
      baseDir: ['dist', 'src', 'public'], // 基准目录
      routes: {
        '/node_modules': 'node_modules' // 自定义映射路径，优先级高于 baseDir
      }
    }
  })
}



// 并行处理
const compile = parallel(style, script, html)

const build = series(clean, parallel(compile,image, font, extra)) 

const develop = series(compile, serve)

module.exports = {
  build,
  serve,
  clean,
  develop
}
```

## 八、 useref 文件引入处理

build 完之后我们会发现，node_modules 内的文件并没有打包进来

```html
<link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
```

这个时间我们可以使用 useref 插件，使用方式如下

```html
  <!-- build:css assets/styles/vendor.css -->
  <link rel="stylesheet" href="/node_modules/bootstrap/dist/css/bootstrap.css">
  <!-- endbuild -->

  <!-- build:css assets/styles/main.css -->
  <link rel="stylesheet" href="assets/styles/main.css">
  <!-- endbuild -->
```

利用注释 build -> endbuild 注释中间的代码都会打包到我们注释中提供的目录下面，`build:css` 就是指定文件类型，`assets/styles/vendor.css` 就是文件的打包路径

```js
const useref = () => {
  return src('./dist/*.html', { base: 'dist' })
  .pipe(plugins.useref({ searchPath: ['dist', '.']}))
  .pipe(dest('dist'))
}
```

构建结果

```html
  <link rel="stylesheet" href="assets/styles/vendor.css">
  <link rel="stylesheet" href="assets/styles/main.css">
```

对 html、css、js 进行压缩处理，压缩需要安装的依赖

```ssh
npm install gulp-htmlmin gulp-uglify gulp-clean-css
```

文件判断需要安装 gulp-if 插件

```js
const useref = () => {
  return src('./dist/*.html', { base: 'dist' })
  .pipe(plugins.useref({ searchPath: ['dist', '.']}))
  .pipe(plugins.if(/\.js$/, plugins.uglify()))
  .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
    collapseWhitespace: true, // 去除空格
    minifyCSS: true, // 压缩 html 文件内部的样式
    minifyJS: true, // 压缩内部的js
  })))
  .pipe(dest('release'))
}
```

## 九、重新规划整理

```js
const { src, dest, parallel, series, watch}  = require('gulp');

// 删除插件
const del = require('del')

const browserSync = require('browser-sync')

const loadPlugins = require('gulp-load-plugins')

const plugins = loadPlugins()
const bs = browserSync.create()

// 页面渲染模拟数据
const data = {
  menus: [
    {
      name: 'Home',
      icon: 'aperture',
      link: 'index.html'
    },
    {
      name: 'Features',
      link: 'features.html'
    },
    {
      name: 'About',
      link: 'about.html'
    },
    {
      name: 'Contact',
      link: '#',
      children: [
        
      ]
    }
  ],
  pkg: require('./package.json'),
  date: new Date()
}

const clean = () => {
  return del(['dist', 'temp'])
}

const style = () => {
  return src('./src/assets/styles/*.scss', 
    // 这里是指定基础的目录结构
    { base: 'src' }
  )
  // 默认 _xx.scss 开头的 sass 文件不会被转化，因为被视做私有样式文件
  // outputStyle: 'extend' 是将 {} 完全展开符合我们的 css 编写习惯 👇
  // {
  //   width: 100px;}
  // 变为：
  // {
  //   width: 100px;
  // }
  .pipe(plugins.sass({ outputStyle: 'extend'}))
  .pipe(dest('temp')) 
  .pipe(bs.reload({ stream: true }))
}

const script = () => {
  return src('./src/assets/scripts/*.js', { base: 'src' })
  .pipe(plugins.babel({presets: ['@babel/preset-env']}))
  .pipe(dest('temp'))
  .pipe(bs.reload({ stream: true }))
}

const html = () => {
  return src('./src/*.html', { base: 'src' })
  .pipe(plugins.swig({ data }))
  .pipe(dest('temp'))
  .pipe(bs.reload({ stream: true }))
}

const image = () => {
  return src('./src/assets/images/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const font = () => {
  return src('./src/assets/fonts/**', { base: 'src' })
  .pipe(plugins.imagemin())
  .pipe(dest('dist'))
}

const extra = () => {
  return src('./public/**', { base: 'public' })
  .pipe(dest('dist'))
}

const serve = () => {
  watch('src/assets/styles/*.scss', style)
  watch('src/assets/styles/*.js', script)
  watch('src/*.html', html)
  // watch('src/assets/images/**', image)
  // watch('src/assets/font/**', font)
  // watch('public/**', extra)

  watch([
    'src/assets/images/**',
    'src/assets/font/**',
    'src/*.html'
  ], bs.reload)
  

  bs.init({
    notify: false, // 页面提示
    port: 2080,
    // open: true, // 自动打开浏览器？
    files: 'dist/*', // 该指定目录下面的文件变化时，服务自动更新
    server: {
      baseDir: ['temp', 'src', 'public'], // 基准目录
      routes: {
        '/node_modules': 'node_modules' // 自定义映射路径，优先级高于 baseDir
      }
    }
  })
}

const useref = () => {
  return src('./temp/*.html', { base: 'temp' })
  .pipe(plugins.useref({ searchPath: ['temp', '.']}))
  .pipe(plugins.if(/\.js$/, plugins.uglify()))
  .pipe(plugins.if(/\.css$/, plugins.cleanCss()))
  .pipe(plugins.if(/\.html$/, plugins.htmlmin({ 
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
  })))
  .pipe(dest('dist'))
}

// 并行处理
const compile = parallel(style, script, html)

const build = series(clean, parallel( series(compile, useref),image, font, extra)) 

const develop = series(compile, serve)

module.exports = {
  build,
  clean,
  develop,
}
```
