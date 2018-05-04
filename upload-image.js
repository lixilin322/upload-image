export default {
    // 不同函数共用的图片信息
    imgFile:{},

    // 定义用户可传的参数
    url:'', //要上传的地址
    params:'', // 跟随上传一起带的参数
    callback:'', // 上传后的回调函数
    dataType:'', // 返回数据的格式，默认json格式
    withCredentials:'', // 上传是否携带cookie，默认不携带
    imgMaxSize:'',   // 图片所允许上传的最大尺寸，默认10M
    imgShouldCompressSize:'', // 图片超过此尺寸就压缩，默认200k

    /**
     * input的onchange事件触发时调用
     */
    start(options){
        let that = this;

        // 存储用户传进来的参数
        let event = options.event;
        that.url = options.url;
        that.params = options.params;
        that.callback = options.callback;
        that.dataType = options.dataType || 'json';
        that.withCredentials = options.withCredentials === true ? true:false;
        that.imgMaxSize = options.imgMaxSize || 1024 * 1024 * 10;
        that.imgShouldCompressSize = options.imgShouldCompressSize || 1024 * 200;

        // 获取所选文件
        let file = event.target.files[0];

        // 检测文件类型是否为图片
        if(['jpeg','jpg','png','gif'].indexOf(file.type.split('/')[1]) < 0){
            alert('文件类型仅支持：jpg/png/gif')
            return;
        }

        // 检测文件是否超出最大尺寸
        if(file.size > that.imgMaxSize){
            let imgMaxSize = that.imgMaxSize;
            let M = Math.floor(imgMaxSize/(1024*1024)),
                KB = Math.floor((imgMaxSize - M * 1024 * 1024)/1024),
                B = imgMaxSize - M * 1024 * 1024 - KB * 1024;
            alert(`单个文件大小不能超过${M ? (M + 'M'):''}${KB ? (KB + 'KB'):''}${B ? (B + 'B'):''}`)
            return;
        }

        // iOS直接上传
        if(/iPone|iPad|iPod/i.test(navigator.userAgent) && !window.MSStream){
            that.transformFileToFormData(file);
            return;
        }

        // 非iOS先压缩再上传
        that.transformFileToDataUrl(file);
    },

    /**
     * 将文件file转化为ajax可以上传的formData
     */
    transformFileToFormData(file){
        let that = this;

        // 创建formData
        let formData = new FormData();
        formData.append('file', file);

        // 开始上传图片
        that.uploadImg(formData);
    },

    /**
     * 上传图片
     */
    uploadImg(formData){
        let that = this;

        for(let key in that.params){
            formData.append(key,that.params[key])
        }

        let xhr = new XMLHttpRequest();
        // 监听一下上传进度
        // xhr.upload.addEventListener('progress', (e)=>{console.log(e.loaded/e.total)}, false);
        xhr.onreadystatechange = ()=>{
            if (xhr.readyState === 4) {
                if (xhr.status === 200){
                    that.callback(that.dataType == 'json' ? JSON.parse(xhr.responseText):xhr.responseText)
                }
            }
        };

        xhr.withCredentials = that.withCredentials;
        xhr.open('POST',that.url,true);
        xhr.send(formData);
    },

    /**
     * 将文件file转化为dataUrl,以便canvas压缩
     */
    transformFileToDataUrl(file){
        let that = this;

        // 把文件类型存到属性imgFile中，以便canvas压缩时使用
        that.imgFile.type = file.type || "image/jpeg";

        // 创建新对象，将file转换成dataUrl
        let reader = new FileReader();
        reader.readAsDataURL(file);

        // 转换完毕后，开始压缩
        reader.addEventListener('load',()=>{
            let result = reader.result;
            if(result.length < that.imgShouldCompressSize){
                // 压缩
                that.compress(result, that.transformDataUrlToFile,false)
            } else {
                // 不压缩
                that.compress(result, that.transformDataUrlToFile)
            }
        })
    },

    /**
     * 将压缩后的dataUrl再换成file
     */
    transformDataUrlToFile(dataUrl,that){
        let binaryString = window.atob(dataUrl.split(',')[1]);
        let arrayBuffer = new ArrayBuffer(binaryString.length);
        let intArray = new Uint8Array(arrayBuffer);

        for(let i = 0, j = binaryString.length; i < j; i++){
            intArray[i] = binaryString.charCodeAt(i);
        }

        let blob;
        console.log(that.imgFile.type)

        try{
            blob = new Blob([intArray],{type:that.imgFile.type});
        } catch (error) {
            window.BlobBuilder = window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (error.name === 'TypeError' && window.BlobBuilder){
                let builder = new BlobBuilder();
                builder.append(arrayBuffer);
                blob = builder.getBlob(that.imgFile.type);
            } else {
                alert("版本过低，不支持上传图片");
                throw new Error('版本过低，不支持上传图片');
            }
        }
        that.transformFileToFormData(blob)
    },

    /**
     * 利用canvas压缩图片
     */
    compress(dataUrl, callback, shouldCompress = true){
        let that = this;

        // 初始化一个图片，canvas画图用
        let img = new Image();
        img.src = dataUrl;

        // 图片初始化完毕后，开始压缩
        img.addEventListener('load',()=>{
            let canvas = document.createElement('canvas');
            let ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            let compressedDataUrl;
            if(shouldCompress){
                compressedDataUrl = canvas.toDataURL(that.imgFile.type, 0.2);
            } else {
                compressedDataUrl = canvas.toDataURL(that.imgFile.type, 1);
            }
            callback(compressedDataUrl,that);
        })
    }
}