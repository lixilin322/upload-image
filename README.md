#upload-image
> [中文文档]()
### 1 Introduction
This is a github repository with an object for mobile upload images
### 2. Usage
1. **Installation**
- Method 1: Use the `npm` command to install, `npm install --save js-upload-image`
- Method 2: Copy the contents of the `upload-image.js` file in the root directory to the js file you created yourself
2. **Import**
- Import using ES6: `import uploadImg from 'js-upload-image'`
(You can choose the name according to your preferences when importing, temporarily use `uploadImg`)
### 3. API
The calling method and parameters are described as follows:
```javascript
uploadImg.start({
	Event:event, // event object in the onchange event of input
    Url:'', // The address to upload
    Params:{}, // Uploads the carried parameter
    Callback:(res)=>{}, // The uploaded callback function
    withCredentials:false, // whether the request carries a cookie, the default is not
    imgMaxSize:1024 * 1024 * 10, // Maximum size allowed for image upload, default 10M
    imgShouldCompressSize:1024 * 200 // When the image size is greater than imgShouldCompressSize to compress, default 200k
})
```