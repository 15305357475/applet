<!--登录页面-->
<template>
	<view class="page-login">
		<!-- #ifdef MP -->
		<view class="login-pic-box">
			<image src="https://api.szyashu.com/static/wave.gif" mode="scaleToFill" class="gif-wave"></image>
			<image src="../../static/login_top.jpg" class="banner-img"></image>
		</view>
		<!-- #endif -->
		<view class="login-box">
			<!-- #ifdef MP -->
			<view style="text-align: center;"><image src="../../static/logos.png" class="logo-size"></image></view>
			<!-- #endif -->
			<view class="label">
				<u--input
					placeholder="请输入用户名"
					placeholder-class="placeholder-class"
					prefixIcon="account"
					prefixIconStyle="font-size: 22px;color: #909399"
					v-model="USERNAME"
					clearable
				></u--input>
			</view>
		</view>
		<view class="login-box">
			<view class="label">
				<!-- <span class="iconfont icon-tijiao"></span> -->
				<!-- 	<u-icon name="photo" color="#2979ff" size="28"></u-icon> -->
				<u--input
					placeholder="请输入密码"
					type="password"
					placeholder-class="placeholder-class"
					prefixIcon="lock-open"
					prefixIconStyle="font-size: 22px;color: #909399"
					v-model="PASSWORD"
					clearable
				></u--input>
			</view>
		</view>
		<view class="login-box">
			<checkbox-group @change="checkboxChange" class="floatl">
				<label>
					<checkbox value="yes" checked="true" />
					记住密码
				</label>
			</checkbox-group>
			<view class="floatr">
				<text class="tip-text" @click="goRegister">新用户注册</text>			
			</view>
		</view>
		<!-- <view class="login-btn-box"><view class="login-btn" @click="goLogin('0')">登&nbsp;&nbsp;&nbsp;录</view></view> -->
		<button @click="userwchat" class="login-btn-blue" style="margin-bottom:35rpx;margin-top: 60rpx;background-color: #2979FF;color: #FFFFFF;" lang="zh_CN">微信登录</button>
		<!-- <button class="login-btn-blue" open-type="getPhoneNumber" @getPhoneNumber="getPhoneNumber">匿名登录</button> -->
		<button class="login-btn-blue" @click="anonymousLogin">匿名登录</button>
		<view class="center-style">
			<view class="red-style">⚠ 非密网络严禁处理国家秘密！</view>			
			<view class="copyright-style">Copyright&copy;&nbsp;&nbsp;云上北船 版权所有</view>
		</view>
	</view>
</template>

<script>
import config from '../../common/config.js';
/* import amapFile from '../../common/amap-wx.130.js'; */
import WXBizDataCrypt from "../../common/WXBizDataCrypt.js";  
/* var markersData = {
  latitude: '',//纬度
  longitude: '',//经度
  key: "需要去高德地图注册成为开发者，然后就会获得一个key"//申请的高德地图key
}; */
var _this;
export default {
	name: 'page-login',
	data() {
		return {
			//clearable: true,
			CHECKED: true, //记住密码
			USERNAME: '', //用户名
			PASSWORD: '', //密码
			currentVersionName: '', // 当前版本号
			cid: '' ,// 客户端cid
			encryptedData:'',
			iv:'',
			phonecode:'',
			openid:''
		};
	},
	onUnload(){
		console.log("我被卸载了....")
	},
	onLoad(option) {
		_this = this;
		this.getopenid();
		/* this.loadInfo(); */
		
	},
	created() {
		this.init();
		
		//this.getUserInfo();
	},
	methods: {
		onShareAppMessage: function(options) {
		    //有三个字段，用于自定义转发内容
		    // title, path, imageUrl
		    //路径非常重要，用于决定，打开分享时进入哪一个页面
		    return {
		      title: 'hahahahaha',
		      path: 'www.baidu.com' , 
		      imageUrl: '图片地址'  //默认截图
		      }
		  },
		//获取当前位置的经纬度
		 //获取当前位置的经纬度
		   loadInfo: function(){
		     var that=this;
		     uni.getLocation({
		       type: 'gcj02', //返回可以用于wx.openLocation的经纬度
		       success: function (res) {
		         var latitude = res.latitude//维度
		         var longitude = res.longitude//经度
		         console.log(res);
		         that.loadCity(latitude,longitude);
		       }
		     })
		   },
		 
		   //把当前位置的经纬度传给高德地图，调用高德API获取当前地理位置，天气情况等信息
		   loadCity: function (latitude, longitude){
		     var that=this;
		     var myAmapFun = new amapFile.AMapWX({ key: markersData.key });
		     myAmapFun.getRegeo({
		       location: '' + longitude + ',' + latitude + '',//location的格式为'经度,纬度'
		       success: function (data) {
		         console.log(data);
		       },
		       fail: function (info) { }
		     });
		 
		     myAmapFun.getWeather({
		       success: function (data) {
		         that.setData({
		           weather: data
		         })
		         console.log(data);
		         //成功回调
		       },
		       fail: function (info) {
		         //失败回调
		         console.log(info)
		       }
		     })
		   },
		

		
		//注册跳转
		goRegister(){
			 uni.navigateTo({
			          url: '../register/register'
			        })
		},
		//获取openid
		getopenid:function(){
			uni.login({
			 provider: 'weixin',
			 success: res => {
				 //获取临时登录凭证code
			   _this.Code = res.code;
				uni.request({
					withCredentials: true,
					method: 'POST',
					dataType: 'JSON',
					url: config.httpurl+'wx/getopenid',
					data: {
						code:_this.Code
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
						
					},
					success: function(res) {
						var resdata = res.data;
						_this.openid = resdata;
						uni.setStorageSync('openid', _this.openid);
						_this.nopasswordlogin();
						},
				})
				}
			})
		},
		//微信免密登陆
		nopasswordlogin:function(){
				uni.request({
					withCredentials: true,
					method: 'POST',
					dataType: 'JSON',
					url: config.httpurl+'wx/nopasswordlogin',
					data: {
						OPEN_ID:_this.openid
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
						
					},
					success: function(res) {
						var data = res.data;
																	
								// #ifdef MP-WEIXIN
								  data = JSON.parse(res.data);
								// #endif
								if(data.result == "success"){
									_this.PASSWORD = data.PASSWORD;
									_this.USERNAME = data.USERNAME;
									_this.openid = data.OPEN_ID;
									
								uni.showToast({
									title: '正在登录',
									icon: 'none',
									mask: true,
									duration: 2000
								});
								_this.goLogin();
								}
						}
						
				})
		},
		getPhoneNumber: function(e) {
			console.log(e);
			 var that = this;
			 that.phonecode = e.detail.code;
			 that.encryptedData = e.detail. encryptedData;
			 that.iv = e.detail.iv;
			uni.request({
				withCredentials: true,
				method: 'POST',
				dataType: 'JSON',
				url: config.httpurl+'/wx/getUserPhone',
				data: {
					code:that.phonecode,
					encryptedData:that.encryptedData,
					iv:that.iv
				},
				header: {
					"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
					
				},
				success: function(res) {
					var data = res.data;
														
					// #ifdef MP-WEIXIN
					  data = JSON.parse(res.data);
					// #endif
					
				}
			}) 	                
		},
		 userwchat: function(e) {  
			 var that = this;
			 if (this.USERNAME == '') {
			  	uni.showToast({
			  		title: '用户名不得为空',
			  		icon: 'none',
			  		duration: 2000
			  	});
			  	return false;
			  }
			  if (this.PASSWORD == '') {
			  	uni.showToast({
			  		title: '密码不得为空',
			  		icon: 'none',
			  		duration: 2000
			  	});
			  	return false;
			  }
			 uni.getUserProfile({
			       desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
			       success: (res) => {
					 uni.request({
					 	withCredentials: true,
					 	method: 'POST',
					 	dataType: 'JSON',
					 	url: config.httpurl+'/wx/userwchat',
					 	data: {
					 		OPEN_ID:that.openid,
					 		PASSWORD:that.PASSWORD,
					 		USERNAME:that.USERNAME,
					 		VERSION: that.currentVersionName,
					 		CID: that.cid,
					 	},
					 	header: {
					 		"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
					 		
					 	},
					 	success: function(res) {
					 		var data = res.data;
					 											
					 		// #ifdef MP-WEIXIN
					 		  data = JSON.parse(res.data);
					 		// #endif
					 		if(data.result !=null && data.result == 'success'){
					 			uni.showToast({
					 				title: '绑定成功',
					 				icon: 'none',
					 				mask: true,
					 				duration: 2000,
					 				success() {
					 					that.goLogin('0');
					 				}
					 			});
					 			
					 		}else if(data.result == "usererror"){
					 			uni.showToast({
					 				title: '账号密码错误',
					 				icon: 'error',
					 				mask: true,
					 				duration: 2000
					 			});
					 		}else if(data.result == "openiderror"){
					 			uni.showToast({
					 				title: '微信已被绑定',
					 				icon: 'error',
					 				mask: true,
					 				duration: 2000
					 			});
					 		}else if(data.result == "wchaterror"){
					 			uni.showToast({
					 				title: '用户已绑定微信',
					 				icon: 'error',
					 				mask: true,
					 				duration: 2000
					 			});
					 		}
					 	}
					 }) 	 
			       },fail(res) {
			       	console.log(12132)
			       }
			     })
			                
		},
		//请求登录
		goLogin: function(type) {
			
			var openid = _this.openid;
			if(type == '0'){
				openid = '';
			}
			var that = this;
			if (this.USERNAME == '') {
				uni.showToast({
					title: '用户名不得为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.PASSWORD == '') {
				uni.showToast({
					title: '密码不得为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			uni.request({
				withCredentials: true,
				url: config.httpurl + 'admin/check',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					OPEN_ID:openid,
					KEYDATA: 'BSIC' + this.USERNAME + ',FSCI,' + this.PASSWORD,
					VERSION: this.currentVersionName,
					CID: this.cid,
					tm: new Date().getTime()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
				},
				success: function(res) {
					uni.showToast({
						title: '正在验证身份...',
						icon: 'none',
						mask: true,
						duration: 2000
					});
					var success = res.data.result;
					var token = res.data.token;
					// #ifdef MP-WEIXIN
						var JSONArray = JSON.parse(res.data);
						success = JSONArray.result;
						token = JSONArray.token;
					// #endif

					//将token放入缓存中 方便以后请求接口是带入请求头
					uni.setStorageSync('token', token);

					if ('success' == success) {
						_this.PASSWORD = "";
						_this.USERNAME = "";
						_this.saveCookie(); // 如果勾选了记住密码则保存用户名和密码到cookie
						// 跳转隐患列表
						setTimeout(function() {
							if(type == '1'){
								_this.USERNAME = "";
								_this.PASSWORD = "";
								uni.navigateTo({
									url: '../index/index?anonymous=1'
								});
							}else{
								uni.navigateTo({
									url: '../index/index'
								});
							}
							
						}, 1000);
					}else if('usererror' == success){
						uni.showToast({
							title: '账号或密码有误',
							icon: 'error',
							mask: true,
							duration: 2000
						});
					}
				}
			});
		},
		//记住密码到Cookie
		saveCookie: function() {
			//console.log(this.CHECKED)
			if (this.CHECKED) {
				//this.setCookie("USERNAME", this.USERNAME, 7); // cookie有效期7天
				//this.setCookie("PASSWORD", this.PASSWORD, 7);
				// 记录到本机存储
				uni.setStorageSync('USERNAME', this.USERNAME);
				uni.setStorageSync('PASSWORD', this.PASSWORD);
				uni.setStorageSync('CHECKED', 'CHECKED');
			}
		},
		//获取是否记住密码
		checkboxChange: function(e) {
			let a = e.detail.value;
			if (a.length == 0) {
				this.CHECKED = false;
			} else {
				this.CHECKED = true;
			}
		},
		//判断登录状态
		islogin: function() {
			uni.request({
				url: config.httpurl + 'admin/islogin',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					tm: new Date().getTime()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
				},
				success: function(res) {
					var success = res.data.result;
					// #ifdef MP-WEIXIN
						var JSONArray = JSON.parse(res.data);
						success = JSONArray.result;
					// #endif
					if ('success' == success) {
						uni.navigateTo({
							url: '../index/index'
						});
					}
				}
			});
		},
		//匿名登录
		anonymousLogin:function(){
			this.USERNAME = "chentao";
			this.PASSWORD = "123456";
			this.openid = "";
			this.goLogin(1);
		},
		//初始执行
		init: function() {
			this.islogin(); //判断登录状态
			/* var msg = this.getUrlKey('msg'); //链接参数
			if (null != msg) {
				this.logOut();
			} else {
				
			}
			if (this.USERNAME != '') {
				this.CHECKED = true;
			} */
		}
		//根据url参数名称获取参数值
		/* getUrlKey: function(name) {
			return decodeURIComponent(
				(new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[
					1].replace(/\+/g, '%20')) || null;
		}, */
	}
};
</script>

<style lang="scss" scoped>
.page-login {
	/* 字体图标*/
	.icon {
		width: 2rem;
		height: 2rem;
		fill: currentColor;
		overflow: hidden;
	}
	.login-pic-box {
		display: flex;
	}
	.logo-size {
		width: 50%;
		height: 8vh;
		margin: 20rpx auto;
	}
	/deep/.uni-checkbox-input {
		width: 30rpx !important;
		height: 30rpx !important;
	}
	.u-input {
		border: 1px solid #eee;
		border-radius: 10rpx;
	}

	.banner-img {
		width: 100%;
		height: 30vh;
		// position: absolute;
	}
	.gif-wave {
		position: absolute;
		width: 100%;
		top: 17%;
		left: 0;
		z-index: 99;
		mix-blend-mode: screen;
		height: 200rpx;
	}
	.red-style {
		color: red;
		display: inline-block;
		font-size: 30rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.center-style {
		margin: 0 auto;
		width: 60%;
		text-align: center;
	}
	.copyright-style {
		font-size: 25rpx;
		margin-top: 30rpx;
	}
	.pic-text {
		color: #0071ce;
		font-size: 50rpx;
		text-indent: 350rpx;
		font-weight: bold;
	}

	.icon-img {
		width: 120rpx;
		height: 120rpx;
	}
	.login-box {
		margin-top: 10rpx;
		padding: 10rpx 60rpx;
	}
	.label {
		display: flex;
		align-items: center;
	}
	.label-text {
		margin-left: 16rpx;
		font-weight: 500;
		color: #272e2d;
		font-size: 30rpx;
	}

	.placeholder-class {
		font-size: 30rpx;
		color: #c0c0c0;
	}

	.tip-text {
		margin: 0 15rpx;
		color: #0056b3;
	}
	.login-btn-box {
		margin-top: 30rpx;
		width: 750rpx;
		padding: 30rpx 68rpx 40rpx;
	}
	.login-btn-blue,.login-btn-green {
		width:80%;
		height: 82rpx;
		border-radius: 41rpx;		
		text-align: center;
		line-height: 82rpx;
		font-size: 36rpx;
		font-weight: 500;
		margin-bottom:20rpx;
	}
	.login-btn-blue {
		border:1px solid #3c9cff;
		color:#3c9cff;
		background-color: white;
	}
	.login-btn-green{
		color:white;
		background:#55aa00;
	}
}
</style>
