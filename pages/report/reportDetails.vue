<!--详情-->
<template>
	<view class="padding30">
		<view class="borderline gray-bg">
			<label class="u-m-15">隐患描述：</label>		
		</view>
		<view class="text-style" style="white-space: pre-wrap;" v-text="detail.describes">
			伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎伯伯围绕图尔特演绎
		</view>
		<view class="borderline blue-bg">
			<label class="u-m-15">所属区域：</label>
			<span blue v-text="detail.area">区域名称区域名称</span>
		</view>
		<view class="borderline gray-bg">
			<label class="u-m-15">举报日期：</label>
			<span v-text="detail.insert_time">2022-04-01 09:23</span>
		</view>
		<template>
			<!-- <view class="borderline  blue-bg">
				<label class="u-m-15">举报人：</label>
				<span>张三</span>
			</view> -->
			<!-- <view class="borderline gray-bg">
				<label class="u-m-15">举报人公司：</label>
				<span>xx公司</span>
			</view> -->
			<!-- <view class="borderline blue-bg">
				<label class="u-m-15">举报电话：</label>
				<span v-text="detail.phone">xx公司</span>
			</view> -->
		</template>
		<view class="borderline gray-bg">
			<label class="u-m-15">隐患照片：</label>		
		</view>
		<view class="img" v-for="(list, index) in uploadImage" :key="index">
			<image class="pic" :src="'data:image/jpeg;base64,' + list.value" mode="widthFix" @click="lookImg(index)"></image>
		</view>
	</view>
</template>
<script>
import config from '../../common/config.js';
var _this;
export default {
	data() {
		return {
			id: '',
			detail: '',
			uploadImage: [] //上传图片
		};
	},
	onUnload() {
		console.log('我被卸载了....');
		//自定义监听事件
		uni.$emit('handClick', '页面刷新');
	},
	onLoad(option) {
		_this = this;
		this.id = option.id;
		this.openid = uni.getStorageSync('openid');
	},
	created() {
		setTimeout(function() {
			uni.showLoading({
				title: '正在加载...',
				mask: true
			});
			_this.getDetailById();
			_this.getPhotos();
		}, 100);
	},
	methods: {
		getDetailById: function() {
			uni.request({
				withCredentials: true,
				xhrFields: {
					withCredentials: true
				},
				url: config.httpurl + 'report/detail',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					id: this.id,
					OPEN_ID: this.openid
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', //发送请求头格式为From Data
					token: uni.getStorageSync('token'),
					// #ifdef MP-WEIXIN
					Cookie: 'JSESSIONID=' + uni.getStorageSync('token')
					// #endif
				},
				success: function(res) {
					var success = res.data.result;
					var detail = res.data.detail;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					detail = JSONArray.detail;
					// #endif
					if ('success' == success) {
						_this.detail = detail;
					}
				}
			});
		},
		getPhotos: function() {
			uni.request({
				withCredentials: true,
				xhrFields: {
					withCredentials: true
				},
				url: config.httpurl + 'inssys/getMediaByInsId',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					INSSYS_ID: this.id,
					TYPE: 'image/*', // image/*：图片；audio/*：音频；ALL：全部
					tm: new Date().getTime()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', //发送请求头格式为From Data
					token: uni.getStorageSync('token'),
					// #ifdef MP-WEIXIN
					Cookie: 'JSESSIONID=' + uni.getStorageSync('token')
					// #endif
				},
				success: function(res) {
					var success = res.data.result;
					var base64ListI = res.data.base64ListI;
					var varListI = res.data.varListI;
					var varList = res.data.varList;
					let data = [];
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					success = JSONArray.result;
					base64ListI = JSONArray.base64ListI;
					varListI = JSONArray.varListI;
					varList = JSONArray.varList;
					// #endif
					if ('success' == success) {
						if (varList.length > 0) {
							_this.viewImage = true;
							for (let i = 0; i < varListI.length; i++) {
								var onebase64 = base64ListI[i];
								var onename = varListI[i].CREATE_USER;
								var oneTime = varListI[i].CREATE_DATE.substring(0, 19).replace('T', ' ');
								const str = {
									name: onename,
									time: oneTime,
									value: onebase64
								};
								data.push(str);
							}
							_this.uploadImage = data;
						}
					}
					uni.hideLoading();
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.blue-bg {
	background: #e3f1ff;
	padding: 10rpx;
}
.gray-bg {
	background: #f7f8f8;
	padding: 10rpx;
}
.borderline {
	padding: 20rpx 0rpx;
	border: none;
	label {
		width: 20%;
		font-weight: 600;
		color: #666;
		padding-left: 20rpx;
	}
	span {
		width: 70%;
		color: #3c9cff;
		float: right;
		font-weight: normal;
	}
}
.text-style {
	width: 100%;
	word-wrap: break-word;
	line-height: 25px;
	color: #3c9cff;
	padding-left: 20rpx;
}
.img {
	width: 100%;
	margin: 20rpx auto 10rpx;
	text-align: center;
}
</style>
