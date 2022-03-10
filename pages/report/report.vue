<!--隐患举报-->
<template>
	<view class="report_bg">
		<view class="padding30">
			<u--form>
				<view>
					<label class="u-m-15">隐患描述</label>
					<u--textarea v-model="INS_DETIAL" count autoheight></u--textarea>
				</view>
				<!--隐患区域-->		
				<u-form-item label="选择区域" labelWidth="100" prop="AREA" @click="
						showArea = true;
						hideKeyboard();
					" ref="item1" borderBottom >
					<u--input v-model="AREA" disabled disabledColor="#ffffff" placeholder="请选择区域" border="surround"
						suffixIcon="arrow-down" suffixIconStyle="color: #909399"></u--input>
				</u-form-item>
				<u-form-item label="当前日期" labelWidth="100" borderBottom>
					<u--input v-model="todayDate" border="none" readonly></u--input>
				</u-form-item>
			</u--form>
			<!--拍照-->
			<view class="img-box">
				<label>拍照上传</label>
				<view style="height:1vh; clear:both;"></view>
				<view class="img" v-for="(list, index) in imgShow" :key="index">
					<image class="pic" :src="list" mode="aspectFill" @click="lookImg(index)"></image>
					<image @click="deletePic(index)" class="close" src="../../static/del.png" mode="aspectFill"></image>
				</view>
				<view class="img">
					<image @click="chooseImage" class="pic" src="../../static/photo.png" mode="aspectFill"></image>
				</view>
			</view>
			<view class="reg-btn-box" @click="report()">
				<view class="login-btn">立即举报</view>
			</view>
			<!--区域弹窗-->
			<u-picker :show="showArea" :columns="AREA_LIST" keyName="NAME" title="请选择隐患区域" @cancel="showArea = false"
				@confirm="areaSelect"></u-picker>
		</view>
	</view>
</template>
<script>
	import config from "../../common/config.js";
	import formatDate from '../../common/formatDate.js';
	var httpurl = config.httpurl;
	export default {
		data() {
			return {
				// 现场图
				INSMEDIA_I_PATHS: [],
				INSMEDIA_I_NAMES: [],
				
				openid:'',
				phone:'11111',
				RESPONSIBLE_UNIT: 'AREA330', // 责任单位编号
				INS_DETIAL: '', //隐患文字描述
				/*隐患区域*/
				AREA: '', // 隐患区域
				AREA_VALUE: '', // 隐患区域编号
				showArea: false, // 隐患类型弹窗
				AREA_LIST: [[]],
				todayDate: '2022-02-11 8:00', //当前日期
				imgShow: [] //图片
			};
		},
		onLoad(option) {
			this.todayDate = formatDate.methods.formatDateUtil(new Date())
			let phone = uni.getStorageSync('phone');
			if(phone != '' && phone != null && phone != undefined){
				this.phone = phone;
			}
			this.openid = uni.getStorageSync('openid');
			//console.log(this.openid)
		},
		created() {
			var that = this;
			setTimeout(function() {
				uni.showLoading({
					title: '正在加载...',
					mask: true
				});
				
				that.getAREA();
			}, 100);
		},
		methods: {
			//隐患区域
			areaSelect(e) {
				this.AREA = e.value[0].NAME;
				this.AREA_VALUE = e.value[0].DICTIONARIES_ID;
				//this.$refs.form1.validateField('AREA');
				this.showArea = false;
			},
			// 隐藏键盘
			hideKeyboard: function() {
				uni.hideKeyboard();
			},
			// 查看图片
			lookImg: function(val) {
				const urls = this.imgShow;
				const current = val;
				uni.previewImage({
					urls,
					current
				});
			},
			// 删除图片
			deletePic(index) {
				this.imgShow.splice(index, 1);
			},
			//手机真机操作测试才能调用摄像头，相册图片，网页上只能选择图片
			chooseImage(e) {
				var that = this;
				uni.chooseImage({
					count: 1,
					sizeType: ['copressed'],
					success(res) {
						//因为有一张图片， 输出下标[0]， 直接输出地址
						that.imgShow = that.imgShow.concat(res.tempFilePaths[0]);
						
					}
				});
			},
			//点击举报
			report:function(){
				var that = this;
				that.INSMEDIA_I_PATHS = [];
				that.INSMEDIA_I_NAMES = [];
				//循环次数
				var cycle_index = that.imgShow.length;
				var falg = 0;
				//先获取订阅消息权限获取
				let tmplId = 'gb9NEGtAyg_8tNm4MGTkFV7JGrAgI1CJnjU0Wy4Vr9M';
				uni.requestSubscribeMessage({
					tmplIds: [tmplId],
					success (res) {
						//授权成功	
						if(res[tmplId] == 'accept'){
							if(cycle_index == 0){
								that.INSMEDIA_I_PATHS = 'NONE';
								that.INSMEDIA_I_NAMES = '';
								that.save();
							}else{
								for (var i = 0; i < that.imgShow.length; i++) {
									uni.uploadFile({
										 // 需要上传的地址
										 url:httpurl + 'insmedia/uploadImgs',
										 // filePath  需要上传的文件
										 filePath: that.imgShow[i],
										 name: 'file',
										 formData:{
											 'fileCount': '1',
											 
										 },
										 header: {
											"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
											"token": uni.getStorageSync('token'),
											// #ifdef MP-WEIXIN
												"Cookie": "JSESSIONID=" + uni.getStorageSync('token')
											// #endif
										},
										 success(res) {
											// 显示上传信息
											var data = res.data;
											// #ifdef MP-WEIXIN
											data = JSON.parse(res.data);
											// #endif
											that.INSMEDIA_I_PATHS = that.INSMEDIA_I_PATHS.concat(data.INSMEDIA_PATHS[0]);
											that.INSMEDIA_I_NAMES = that.INSMEDIA_I_NAMES.concat(data.INSMEDIA_NAMES);
											
											falg++;
											if(cycle_index == falg){
												that.save();
											}
										 },
										 fail(res1) {
											// 显示上传信息
											console.log(res1.data)
										 }
									});
								}
							}
						}else{
							//授权失败
							uni.showToast({
								icon: 'none',
								title: '授权失败，请点击允许推送!',
								duration: 2000
							});
						}
					  
					},
					fail(e){
						console.log(e);
					}
				})
				
				
				
			},
			save:function(){
				var that = this;
				if(that.INS_DETIAL == '' || that.INS_DETIAL ==null){
					uni.showToast({
						icon: 'none',
						title: '请填写描述',
						duration: 2000
					});
					return;
				}
				if(that.AREA == '' || that.AREA == null){
					uni.showToast({
						icon: 'none',
						title: '请选择区域',
						duration: 2000
					});
					return;
				}
				uni.request({
					withCredentials: true,
					url: httpurl + "report/add",
					method: 'POST',
					dataType: 'JSON', 
					//传递参数
					data: {
						openid: that.openid,
						phone: that.phone,
						describes: that.INS_DETIAL,
						area: that.AREA,
						area_value: that.AREA_VALUE,
						INSMEDIA_I_PATHS: that.INSMEDIA_I_PATHS, 
						INSMEDIA_I_NAMES: that.INSMEDIA_I_NAMES,
						tm: new Date().getTime()
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
						"token": uni.getStorageSync('token'),
						// #ifdef MP-WEIXIN
							"Cookie": "JSESSIONID=" + uni.getStorageSync('token')
						// #endif
					},
					success: function(res) {
						var success = res.data.result;
						
						// #ifdef MP-WEIXIN
							var JSONArray = JSON.parse(res.data);
							success = JSONArray.result;
						// #endif
						if(success == 'success'){
							uni.showToast({
								icon: 'none',
								title: '举报成功',
								duration: 2000
							});
							
							setTimeout(function() {
								uni.navigateBack({
									delta: 1
								});
							}, 500);
							
						}
						
					}
				})	
				
			},
			// 隐患区域下拉菜单
			getAREA: function() {
				var that = this;
				//$("#AREA").empty();
				uni.request({
					withCredentials: true,
					method: 'POST',
					dataType: 'JSON',
					url: httpurl + 'dictionaries/getLevels?tm=' + new Date().getTime(),
					data: {
						DICTIONARIES_ID: that.RESPONSIBLE_UNIT
					},
					header: {
						"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8", //发送请求头格式为From Data
						"token": uni.getStorageSync('token'),
						// #ifdef MP-WEIXIN
						    "Cookie": "JSESSIONID=" + uni.getStorageSync('token')
						// #endif
					},
					success: function(res) {
						let data = res.data;
						// #ifdef MP-WEIXIN
						  data = JSON.parse(res.data);
						// #endif
						that.AREA = data.list[0].NAME;
						that.AREA_VALUE = data.list[0].DICTIONARIES_ID;
						let list = [data.list];
						that.AREA_LIST = list;
						uni.hideLoading()
					}
				});
			},
		}
	};
</script>
<style lang="scss" scoped>
	.report_bg {
		width: 100%;
		height: 100vh;
		background: url(http://www.51topping.com/bhimages/report-bg.png) no-repeat;
		background-size: cover;
	}

	label {
		display: block;
		color: #666;
		font-size: 15px;
	}
	.u-m-15 {
		margin: 15rpx 0rpx 30rpx;
	}

	.reg-btn-box {
		width: 90%;
		margin: 60rpx auto 0rpx;
	}

	.img-box {
		padding-top:15rpx;
		.img {
			width: 200rpx;
			height: 200rpx;
			border: 1px solid #ccc;
			display: inline-flex;
			position: relative;
			margin-left: 10rpx;
			margin-top: 20rpx;
			margin-right: 10rpx;

			&:nth-child(3n + 1) {
				margin-left: 0;
				margin-top: 10rpx;
			}

			.pic {
				width: 100%;
				height: 100%;
			}

			.close {
				width: 38rpx;
				height: 38rpx;
				position: absolute;
				top: -10rpx;
				right: -10rpx;
			}
		}
	}
</style>
