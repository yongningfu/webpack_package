## webpack打包原理解析

一开始，对webpack打包原理很不熟悉，看了不少资料，但是讲的都不是很清楚，现在来梳理一遍。

## 所有资源统一入口

这个是什么意思呢？就是webpack是通过js来获取和操作其他文件资源的，比如webpack想处理less,但是它并不会直接从本地的文件夹中直接通过路径去读取css文件，而且通过执行入口js文件，如果入口文件中，或者入口文件相关联的js文件中含有 require(xx.less) 这个less文件，那么它就会通过对应的loader去处理这个less文件

## 打包中的文件管理

重点来了: webpack是如何进行资源的打包的呢？

### js单文件入口的情况

![](./image/img1.gif)

比如整个应用的入口为 entry.js

entry.js引用 util1.js util2.js， 同时util1.js又引用了util2.js

>关键问题是: 它打包的会不会将 util2.js打包两份？

其实不会的，webpack打包的原理为，在入口文件中，对每个require资源文件进行配置一个id, 也
就是说，对于同一个资源,就算是require多次的话，它的id也是一样的，所以无论在多少个文件中
require，它都只会打包一分

![](./image/img2.gif)

通过上面的图片我们看到，
- entry.js 入口文件对应的id为 1
- util1.js的id为 2
-  util2.js的id为 3

entry.js引用了 2 和 3, util1.js引用了 3，说明了entry和util1引用的是同一份，util2.js不会重复打包

### css单文件入口的情况

上面分析了js的情况，其实css也是一个道理。它同样也会为每个css资源分配一个id, 每个资源同样也只会导入一次。

![](./image/img3.gif)

可以看到, entry.js 和 util1.js共同引用了 style2.less，那么它们作用的结果是怎么样的呢？

![](./image/img4.gif)

可以看到 entry.js 和 util1.js使用的是同一个 css资源

注意: ```/* 1 */``` 注释表示id为1的模块

听说 ExtractTextPlugin 导出css的插件比较火， 让我们来看看它到底帮我们干了啥？配置好相关引用后
```js
newExtractTextPlugin('[name].[chunkhash].css')
```
运行，在static下面生成了 一个.css 一个.js

生成的css代码为
```css
.style2 {
  color: green;
}
.style3 {
  color: blue;
}
.style1 {
  color: red;
}
```
实际就是把三个css导出

生成的.js为

![](./image/img5.gif)

2 实际就是 util1.js模块，还是引用 id为3的模块 即css2, 但是我们看 3 模块的定义，为空函数， 它给出的解释是  ```removed by extract-text-webpack-plugin``` 实际就是newExtractTextPlugin把相关的css全部移出去了
