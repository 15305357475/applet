<!-- 首页 -->
<template>
	<view>
		<!--头部-->
		<view class="banner-img">
			<view class="img-content" v-if="anonymous">
				<image src="../../static/touxiang.png" style="width:200rpx;height:200rpx;"></image>		
			</view>
			<view class="img-content" v-else>
				<view style="width:20%;margin:0 auto;"><u-avatar :src="userPhoto" shape="circle" size="70"></u-avatar></view>
				<view class="img-text">欢迎你 , {{NAME}}</view>
			</view>
			
			
		</view>
		<!--四个小图标
<!-- 		<view class="bg-style">
			<u-row customStyle="width:100%;margin:20rpx auto 0 25rpx;position: absolute;z-index: 999;">
				<u-col span="3">
					<view class="icon1">
						<view class="icon1-wz"><span class="iconfont icon-daibanshixiang"></span></view>
					</view>
					<view class="text-style">待办任务</view>
				</u-col>
				<u-col span="3">
					<view class="icon2">
						<view class="icon1-wz"><span class="iconfont icon-richeng"></span></view>
					</view>
					<view class="text-style">我的日程</view>
				</u-col>
				<u-col span="3">
					<view class="icon3">
						<view class="icon1-wz"><span class="iconfont icon-shouye"></span></view>
					</view>
					<view class="text-style">我的提醒</view>
				</u-col>
				<u-col span="3">
					<view class="icon4">
						<view class="icon1-wz"><span class="iconfont icon-geren"></span></view>
					</view>
					<view class="text-style">个人中心</view>
				</u-col>
			</u-row>
		</view> -->
		<!--模块图标-->
		<u-gap height="7" bgColor="#f3f4f5"></u-gap>
		<view class="main">
			<u-row customStyle="width:90%;margin:30rpx auto;">
				<u-col span="6">
				<view class="list1-style" @click="goReport()">
						<view class="nav-li bg-index1">
							<view class="icon1-wz2"><span class="iconfont icon-weifajubao large"></span></view>
						</view>
						<view class="nav-name">隐患举报</view>
					</view>
				</u-col>
				<u-col span="6">
					<view class="list1-style" @click="goReportList()">
						<view class="nav-li bg-index2">
							<view class="icon1-wz2"><span class="iconfont icon-liulanjilu large"></span></view>
						</view>
						<view class="nav-name">举报列表</view>
					</view>
				</u-col>				
			</u-row>
			<u-row customStyle="width:90%;margin:30rpx auto;">
				<u-col span="6">
					<!--@click="goinsindex()"-->
				<view class="list1-style">
						<view class="nav-li bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-fengxianpaicha large"></span></view>
						</view>
						<view class="nav-name">隐患排查</view>
					</view>
				</u-col>
				<u-col span="6">
					<view class="list1-style">
						<view class="nav-li  bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-renwuguanli large"></span></view>
						</view>
						<view class="nav-name">任务管理</view>
					</view>
				</u-col>				
			</u-row>
			<u-row customStyle="width:90%;margin:30rpx auto;">
				<u-col span="6">
				<view class="list1-style">
						<view class="nav-li  bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-shenpi large"></span></view>
						</view>
						<view class="nav-name">作业审批</view>
					</view>
				</u-col>
				<u-col span="6">
				<view class="list1-style">
						<view class="nav-li bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-tongzhi large"></span></view>
						</view>
						<view class="nav-name">通知公告</view>
					</view>
				</u-col>
			</u-row>
			<u-row customStyle="width:90%;margin:30rpx auto;">
				<u-col span="6">
				<view class="list1-style">
						<view class="nav-li  bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-xunjiandian large"></span></view>
						</view>
						<view class="nav-name">设备巡检</view>
					</view>
				</u-col>
				<u-col span="6">
				<view class="list1-style">
						<view class="nav-li  bg-gray">
							<view class="icon1-wz2"><span class="iconfont icon-renyuan large"></span></view>
						</view>
						<view class="nav-name">人员信息巡检</view>
					</view>
				</u-col>
			</u-row>
		</view>
	</view>
</template>
<script>
	import config from "../../common/config.js";
	var _this;
export default {
	data() {
		return {
			user: '', // 用于即时通讯（ 当前登录用户）
			userPhoto: '', // 用户头像
			Base64String: '', // Base64编码头像
			NAME: '', // 姓名
			integral: '', // 积分
			fhsmsCount: 0, // 站内信未读数量
			taskCount: 0, // 待办任务
			systips: '', // 系统公告
			sbxjtips: '', // 设备巡检待办任务数tips
			fptips: '', // 出门证待办任务数tips
			indexActive: true, // 底部菜单选中状态(首页)
			fhsmsActive: false, // 底部菜单选中状态(站内信)
			myimActive: false, // 底部菜单选中状态(我的通讯)
			usercenterActive: false, // 底部菜单选中状态(用户中心)
			firstInit: false,
			phone:'',
			
			anonymous: false,//匿名登录
			
			src: 'https://cdn.uviewui.com/uview/album/1.jpg' //头像
		};
	},
	onLoad(option) {
		if(option.anonymous == 1){
			this.anonymous = true;
		}else{
			this.anonymous = false;
		}
		_this = this;
	},
	created() {
		this.init();
	},
	methods:{
		init: function() {
			// 防止后端session还没有创建成功
			setTimeout(function() {
				_this.goIndex();
			}, 250);
			
		},
		//获取菜单栏
		goIndex: function() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			uni.request({
				withCredentials: true,
				xhrFields: {
					withCredentials: true
				},
				url: config.httpurl + "main/index?tm=" + new Date().getTime(),
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {},
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
					if ('success' == success) {
						setTimeout(function() {
							_this.getNowUser();
						}, 500);
					}
				}
			})
		},
		//获取个人信息
		getNowUser: function() {
			uni.request({
				withCredentials: true,
				url: config.httpurl + "head/getInfo",
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
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
					uni.hideLoading();
					var success = res.data.result;
					var NAME = res.data.NAME;
					var userPhoto = res.data.userPhoto;
					var phone = res.data.PHONE;
					// #ifdef MP-WEIXIN
						var JSONArray = JSON.parse(res.data);
						success = JSONArray.result;
						NAME = JSONArray.NAME;
						userPhoto = JSONArray.userPhoto;
						phone = JSONArray.PHONE;
					// #endif
					if('success' == success){
						_this.NAME = NAME;
						_this.phone = phone;
						_this.userPhoto = config.httpurl + userPhoto;
						if(_this.phone != '' && _this.phone != null && _this.phone != undefined){
							uni.setStorageSync('phone', _this.phone);
						}
						
						
					}else if('errer' == success){
						uni.navigateTo({
							url: '../login/login'
						});
					}
					// if ('success' == res.data.result) {
					// 	_this.integral = res.data.INTEGRAL; // 积分
					// 	_this.user = res.data.USERNAME; // 用户名
					// 	_this.NAME = res.data.NAME; // 姓名
					// 	_this.fhsmsCount = res.data.fhsmsCount; // 站内信未读数量
					// 	_this.userPhoto = config.httpurl + res.data.userPhoto; // 用户头像
					// 	_this.firstInit = true;
					// } else if ('errer' == res.data.result) {
					// 	uni.navigateTo({
					// 		url: '../login/login'
					// 	});
					// }
				}
			})
		},
		//跳转到隐患排查页面
		goinsindex(){
			 uni.navigateTo({
			          url: '../ins/ins_index'
			        })
		},
		//跳转到隐患举报页面
		goReport(){
			 uni.navigateTo({
			          url: '../report/report'
			        })
		},
		//跳转到隐患列表页面
		goReportList(){
			 uni.navigateTo({
			          url: '../report/reportList'
			        })
		}
		
	}
};
</script>
<style lang="scss" scoped>
page {
	background: #f5f6f7;
		
}
/*头部*/
.banner-img {
	width: 100%;
	height: 30vh;
	background: url(http://www.51topping.com/bhimages/my_top.jpg) no-repeat;
	background-size:100% 100%;
	text-align: center;
}
.iconfont {
	font-size: 60rpx;
	color: white;
}

.img-content {
	color: white;
	padding-top:9vh;
	.img-text {
		font-size: 35rpx;
		margin-top: 30rpx;	
	}
}

/*四个图标*/

.bg-style {
	position: relative;
	z-index: 1;
	background: white;
	width: 90%;
	height: 13vh;
	margin: -100rpx auto 20rpx;
	border-radius: 20rpx;
	transition: 0.3s;
	box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.text-style {
	color: #666;
	margin-top: 10rpx;
	font-size: 30rpx;
}
.icon1,
.icon2,
.icon3,
.icon4 {
	width: 120rpx;
	height: 120rpx;
	border-radius: 60rpx;
	text-align: center;
	position: relative;
}
.icon1 {
	background: #3c9cff;
}
.icon2 {
	background: #f37b1d;
}
.icon3 {
	background: #1cbbb4;
}
.icon4 {
	background: #fbbd08;
}
.icon1-wz {
	position: absolute;
	top: 2vh;
	left: 25%;
}
/*模块图标*/
.icon1-wz2 {
	position: absolute;
	top: 1vh;
	left: 32%;
}
.large{font-size:90rpx;}
.main {
	padding-top:1vh;
	background: white;
	margin-left:1.5vw;
	.u-row{clear:both;}
	.list1-style {
		display: inline-block;
		width: 310rpx;
		height: 12.5vh;
		background-color: #ffffff;
		border-radius: 10rpx;
		overflow: hidden;
		box-shadow: 2px 2px 3px rgba(26, 26, 26, 0.2);
	}
	.nav-li {
		padding: 40rpx 30rpx;
		width: 100%;
		height: 8vh;
		background-image: url(../../static/tu1.png);
		background-size: cover;
		background-position: center;
		position: relative;
		z-index: 1;
	}
	.nav-name {
		font-size: 30rpx;
		font-weight:600;
		margin-top: 15rpx;
		text-align: center;
			color:#999999;
	}
	
	.bg-index1 {
		background-color: #e54d42;
		color: #fff;
	}
	.bg-gray{
		background-color: #dfe2e5;
		color: #fff;}
	.bg-index2 {
		
		background-color: #f49a02;
		color: #fff;
	}
	
	.bg-index3 {
		background-color: #19cf8a;
		color: #fff;
	}
	
	.bg-index4 {
		background-color: #954ff6;
		color: #fff;
	}
	
	.bg-index5 {
		background-color: #5177ee;
		color: #fff;
	}
	
	.bg-index6 {
		background-color: #7fd02b;
		color: #fff;
	}
}

</style>
