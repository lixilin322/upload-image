# upload-image
[![npm](https://img.shields.io/npm/v/js-upload-image.svg)](https://www.npmjs.com/package/js-upload-image)
> [English Readme](https://github.com/lixilin123/upload-image)
### 1. 简介
本仓库封装了一个用于移动端上传图片的对象
### 2. 使用方法
1. **安装**
- 方式一：使用 `npm` 命令安装，`npm install --save js-upload-image`
- 方式二：将根目录下的 `upload-image.js` 文件内容复制到你自己创建的js文件中
2. **引入**
- 使用ES6的方式引入：`import uploadImg from 'js-upload-image'`
（引入的时候可以根据自己喜好选取名字，这里暂用 `uploadImg` ）
### 3. API
调用方式及参数说明如下
```javascript
uploadImg.start({
    event:event,  // input的onchange事件里的事件对象
    url:'',  // 要上传的地址
    params:{},  // 上传携带的参数
    callback:(res)=>{},  // 上传完毕的回调函数
    dataType:'',  // 返回数据的格式，默认json
    withCredentials:false,  // 请求是否携带cookie，默认不带
    imgMaxSize:1024 * 1024 * 10,  // 图片上传所允许的最大尺寸，默认10M
    imgShouldCompressSize:1024 * 200  // 图片尺寸大于多少就压缩，默认200k
})
```
 