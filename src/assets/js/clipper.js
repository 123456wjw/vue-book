/**
 *	name : vue 的图片裁减压缩处理
 *   date : 2017/6/20
 *   dependence :
 *       cropper 第三方的一个裁剪库
 *       exif    获取图片源信息，解决ios图片旋转的问题   cropper自带判断图片旋转 所以暂时不需要
 * */

import Cropper from 'cropperjs'
import Exif from 'exif-js'
export default {
	install(Vue) {
		//初始化方法
		Vue.prototype.initilize = function(opt) {
			let self = this;
			this.options = opt; //包括预览图片对象和cropper需要的参数
			//创建dom
			this.createElement();
			this.resultObj = opt.resultObj; //预览图片
			//初始化裁剪对象
			this.cropper = new Cropper(this.preview, {
				aspectRatio: opt.aspectRatio || 1,
				autoCropArea: opt.autoCropArea || 0.8,
				viewMode: 1,
				guides: opt.aspectRatio == 'Free' ? false : true,
				cropBoxResizable: opt.aspectRatio == 'Free' ? false : true,
				cropBoxMovable: opt.aspectRatio == 'Free' ? false : true,
				dragCrop: opt.aspectRatio == 'Free' ? false : true,
				background: false,
				checkOrientation: true,
				checkCrossOrigin: true,
				zoomable: true,
				zoomOnTouch: true,
				zoomOnWheel: false,
				rotatable: true,
				scalable: true,
				center: true,
				cropBoxMovable: true,
				toggleDragModeOnDblclick: false,
				ready: function() {
					// console.log(self.cropper.rotate(90))
					if (opt.aspectRatio == 'Free') {
						let cropBox = self.cropper.cropBox;
						cropBox.querySelector('span.cropper-view-box').style.outline = 'none';
						self.cropper.disable();
					}
				}
			});
		}
		//创建一些必要的DOM，用于图片裁剪
		Vue.prototype.createElement = function() {
			//初始化图片为空对象
			this.preview = null;

			let str =
				'<div><img id="clip_image" src="originUrl"></div><button type="button" id="cancel_clip">取消</button><button type="button" id="button_rotate">旋转</button><button type="button" id="clip_button">确定</button>';
			str +=
				'<div class="crop_loading"><div class="crop_content"><img src="./loading.gif"><div class="crop_text">图片上传中</div></div></div>';
			str += '<div class="crop_success"><div class="crop_success_text">上传成功</div></div></div>';

			let body = document.getElementsByTagName('body')[0];
			this.reagion = document.createElement('div');
			this.reagion.id = 'clip_container';
			this.reagion.className = 'container';
			this.reagion.innerHTML = str;
			//添加创建好的DOM元素
			body.appendChild(this.reagion);
			this.preview = document.getElementById('clip_image');

			//绑定一些方法
			this.initFunction();
		}
		//初始化一些函数绑定
		Vue.prototype.initFunction = function() {
			let self = this;
			this.clickBtn = document.getElementById('clip_button');
			this.cancelBtn = document.getElementById('cancel_clip');
			this.btnRotate = document.getElementById('button_rotate');
			//确定事件
			this.addEvent(this.clickBtn, 'click', function() {
				self.crop();
			})
			//取消事件
			this.addEvent(this.cancelBtn, 'click', function() {
				self.destoried();
			})
			//旋转事件
			this.addEvent(this.btnRotate, 'click', function() {
				self.cropper.rotate(90 % 360);
			})
			//清空input的值
			this.addEvent(this.fileObj, 'click', function() {
				this.value = '';
			})
		}

		//外部接口，用于input['file']对象change时的调用
		Vue.prototype.clip = function(e, opt) {
			let self = this;

			this.fileObj = e.srcElement; // 获取input file

			let files = e.target.files || e.dataTransfer.files; //获取图片文件对象数组

			if (!files.length) return false; //不是图片直接返回

			//调用初始化方法
			this.initilize(opt);

			//获取图片文件资源
			this.picValue = files[0];
			console.log('压缩前this.picValue', this.picValue)

			//去获取拍照时的信息，解决拍出来的照片旋转问题
			Exif.getData(files[0], function() {
				self.Orientation = Exif.getTag(files[0], 'Orientation');
				console.log('Exif,self.Orientation', self.Orientation)
			});


			//调用方法转成url格式
			this.originUrl = this.getObjectURL(this.picValue);
			console.log('this.originUrl', this.originUrl)

			//每次替换图片要重新得到新的url
			if (this.cropper) {
				this.cropper.replace(this.originUrl);
			}

		}
		//图片转码方法
		Vue.prototype.getObjectURL = function(file) {
			let url = null;
			if (window.createObjectURL != undefined) { // basic
				url = window.createObjectURL(file);
			} else if (window.URL != undefined) { // mozilla(firefox)
				url = window.URL.createObjectURL(file);
			} else if (window.webkitURL != undefined) { // webkit or chrome
				url = window.webkitURL.createObjectURL(file);
			}
			return url;
		}
		//点击确定进行裁剪
		Vue.prototype.crop = function() {
			let self = this;
			let image = new Image();
			let croppedCanvas;
			let roundedCanvas;

			// Crop
			document.querySelector('.crop_loading').style.display = 'block';

			setTimeout(function() {
				croppedCanvas = self.cropper.getCroppedCanvas();
				// Round
				roundedCanvas = self.getRoundedCanvas(croppedCanvas);

				let imgData = roundedCanvas.toDataURL();
				console.log('imgData', imgData, imgData.length)
				image.src = imgData;

				//判断图片是否大于100k,不大于直接上传，反之压缩
				if (imgData.length < (100 * 1024)) {
					self.resultObj.src = imgData; //预览图片
					let file = self.dataURLtoFile(imgData, self.picValue.name); //将base转成图片文件上传   后台可以转 所以这里直接传base64即可
					//图片上传
					self.postImg(file, imgData);
				} else {
					image.onload = function() {
						//压缩处理
						console.log('self.Orientation', self.Orientation)
						let data = self.compress(image, self.Orientation);
						self.resultObj.src = data; //预览图片
						let file = self.dataURLtoFile(data, self.picValue.name); //将base转成图片文件上传   后台可以转 所以这里直接传base64即可
						//图片上传
						self.postImg(file, data);
					}
				}
			}, 20)
		}
		//获取裁剪图片资源
		Vue.prototype.getRoundedCanvas = function(sourceCanvas) {

			let canvas = document.createElement('canvas');
			let context = canvas.getContext('2d');
			let width = sourceCanvas.width;
			let height = sourceCanvas.height;

			canvas.width = width;
			canvas.height = height;

			context.imageSmoothingEnabled = true;
			context.drawImage(sourceCanvas, 0, 0, width, height);
			context.globalCompositeOperation = 'destination-in';
			context.beginPath();
			context.rect(0, 0, width, height);
			context.fill();

			return canvas;
		}
		//base64转文件
		Vue.prototype.dataURLtoFile = function(dataurl, filename) {
			var arr = dataurl.split(','),
				mime = arr[0].match(/:(.*?);/)[1],
				bstr = atob(arr[1]),
				n = bstr.length,
				u8arr = new Uint8Array(n);
			while (n--) {
				u8arr[n] = bstr.charCodeAt(n);
			}
			return new File([u8arr], filename, {
				type: mime
			});
		}
		//销毁原来的对象
		Vue.prototype.destoried = function() {
			let self = this;
			//移除事件
			this.removeEvent(this.clickBtn, 'click', null);
			this.removeEvent(this.btnRotate, 'click', null);
			this.removeEvent(this.cancelBtn, 'click', null);
			this.removeEvent(this.fileObj, 'click', null);
			//移除裁剪框
			this.reagion.parentNode.removeChild(this.reagion);

			//销毁裁剪对象
			this.cropper.destroy();
			this.cropper = null;
		}
		//图片上传
		Vue.prototype.postImg = function(file, base64) {
			let user = JSON.parse(window.localStorage.getItem('user'));
			// user.photosrc = base64;
			let params = new FormData();
			let config = {
				headers: {
					'Content-Type': 'multipart/form-data'
				}
			}
			params.append('photoImg', file, file.name);
			params.append('userid', user.id);
			this.$post('users/savePhoto', params,config).then(res => {
				console.log('users/savePhoto', res);
				if(res.code == 0) {
					user.photosrc = res.photosrc;
				}
				window.localStorage.setItem('user', JSON.stringify(user));
				document.querySelector('.crop_loading').style.display = 'none';
				document.querySelector('.crop_success').style.display = 'block';
				//裁剪完后摧毁对象
				this.destoried();
			})
		}

		//图片旋转
		Vue.prototype.rotateImg = function(img, direction, canvas) {
			//最小与最大旋转方向，图片旋转4次后回到原方向
			const min_step = 0;
			const max_step = 3;
			if (img == null) return;
			//img的高度和宽度不能在img元素隐藏后获取，否则会出错
			let height = img.height;
			let width = img.width;
			let step = 2;
			if (step == null) {
				step = min_step;
			}
			if (direction == 'right') {
				step++;
				//旋转到原位置，即超过最大值
				step > max_step && (step = min_step);
			} else if (direction == 'right2') {
				step = 2;
			} else {
				step--;
				step < min_step && (step = max_step);
			}
			//旋转角度以弧度值为参数
			let degree = step * 90 * Math.PI / 180;
			alert(`degree:${degree}       step:${step}`);
			let ctx = canvas.getContext('2d');
			switch (step) {
				case 0:
					canvas.width = width;
					canvas.height = height;
					ctx.drawImage(img, 0, 0, width, height);
					break;
				case 1:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, 0, -height, width, height);
					break;
				case 2:
					canvas.width = width;
					canvas.height = height;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, -height, width, height);
					break;
				case 3:
					canvas.width = height;
					canvas.height = width;
					ctx.rotate(degree);
					ctx.drawImage(img, -width, 0, width, height);
					break;
			}
		}

		//图片压缩
		Vue.prototype.compress = function(img, Orientation) {
			let canvas = document.createElement("canvas");
			let ctx = canvas.getContext('2d');
			//瓦片canvas
			let tCanvas = document.createElement("canvas");
			let tctx = tCanvas.getContext("2d");
			let initSize = img.src.length;
			let width = img.width;
			let height = img.height;

			//如果图片大于四百万像素，计算压缩比并将大小压至400万以下
			let ratio;
			if ((ratio = width * height / 4000000) > 1) {
				console.log("大于400万像素")
				ratio = Math.sqrt(ratio);
				width /= ratio;
				height /= ratio;
			} else {
				ratio = 1;
			}
			canvas.width = width;
			canvas.height = height;
			//        铺底色
			ctx.fillStyle = "#fff";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			//如果图片像素大于100万则使用瓦片绘制
			let count;
			if ((count = width * height / 1000000) > 1) {
				count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
				//            计算每块瓦片的宽和高
				let nw = ~~(width / count);
				let nh = ~~(height / count);
				tCanvas.width = nw;
				tCanvas.height = nh;
				for (let i = 0; i < count; i++) {
					for (let j = 0; j < count; j++) {
						tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
						ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
					}
				}
			} else {
				ctx.drawImage(img, 0, 0, width, height);
			}
			//修复ios上传图片的时候 被旋转的问题
			// if( Orientation != "" && Orientation != 1){
			//   switch(Orientation){
			//     case 6://需要顺时针（向左）90度旋转
			//       this.rotateImg(img,'left',canvas);
			//       break;
			//     case 8://需要逆时针（向右）90度旋转
			//       this.rotateImg(img,'right',canvas);
			//       break;
			//     case 3://需要180度旋转
			//       this.rotateImg(img,'right2',canvas);//转两次
			//       break;
			//   }
			// }
			//进行最小压缩
			let ndata = canvas.toDataURL('image/jpeg', 0.1);
			console.log('压缩前：' + initSize);
			console.log('压缩后：' + ndata.length);
			console.log('压缩率：' + ~~(100 * (initSize - ndata.length) / initSize) + "%");
			tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

			return ndata;
		}

		//添加事件
		Vue.prototype.addEvent = function(obj, type, fn) {
			if (obj.addEventListener) {
				obj.addEventListener(type, fn, false);
			} else {
				obj.attachEvent('on' + type, fn);
			}
		}
		//移除事件
		Vue.prototype.removeEvent = function(obj, type, fn) {
			if (obj.removeEventListener) {
				obj.removeEventListener(type, fn, false);
			} else {
				obj.detachEvent('on' + type, fn);
			}
		}
	}
}
