<!--举报列表-->
<template>
	<view class="padding30">
		<!--区域选择-->
		<view class="u-m-15">
			<!--隐患区域-->
			<!-- 	<view class="u-m-15" prop="AREA" @click="showArea = true;hideKeyboard();">
				<u--input v-model="AREA" disabled disabledColor="#ffffff" placeholder="请选择区域" border="surround"
					suffixIcon="arrow-down" suffixIconStyle="color: #909399"> </u--input>
			</view>
			<u-picker :show="showArea" :columns="AREA_LIST" keyName="NAME" title="请选择隐患区域" @cancel="showArea = false"
				@confirm="areaSelect"></u-picker> -->
			<luyj-select-lay
				zindex="4"
				:value="tval"
				style="width:95%;"
				name="name1"
				slabel="name"
				svalue="value"
				placeholder="请选择隐患区域"
				:options="AREA_LIST"
				@selectitem="areaSelect"
			></luyj-select-lay>
		</view>
		<!--列表-->
		<template>
			<view class="box-card" v-for="(item, index) in varList" :key="index" @click="goReportDetails(item.id)">
				<view class="bg-blue">
					<text class="floatl" style="width:30%;">所属区域：</text>
					<text class="floatl" v-text="item.area">区域名称区域名称</text>
				</view>
				<view class="clearfix"></view>
				<view class="padding30">
					<view class="u-m-15 text-style" v-text="item.describes">
						问题一问题一问题一问题一问题一问题一问题一问题一问题一问题一问题一问题问题一问题一问题一问题一问题一问题问题一问题一问题一问题一问题一问题问题一问题一问题一问题一问题一问题一问题一问题一问题一问题一
					</view>
					<view class="borderline"></view>
					<view>
						<view class="floatl">
							<u-tag v-if="item.status == '0'" text="未读" type="error" shape="circle" style="width:30%;text-align:center;"></u-tag>
							<u-tag v-else text="已读" type="success" shape="circle" style="width:30%;text-align:center;"></u-tag>
						</view>
						<text class="floatr gray" v-text="'举报日期：' + item.insert_time">举报日期：2022-02-03 8:00</text>
					</view>
				</view>
			</view>
		</template>
		<!--空数据-->
		<u-empty v-if="varList.length == 0" mode="data" icon="http://cdn.uviewui.com/uview/empty/data.png"></u-empty>
		<view v-if="loading" style="text-align: center;">
			<u-loading-icon></u-loading-icon>
			正在加载
		</view>
	</view>
</template>
<script>
import config from '../../common/config.js';
var _this;
export default {
	data() {
		return {
			/*隐患区域*/
			AREA: '', // 隐患区域
			AREA_VALUE: '', // 隐患区域编号
			AREA_LIST: [],
			tval: '',
			RESPONSIBLE_UNIT: 'AREA330', // 责任单位编号
			varList: [],
			moreData: false, //是否还有数据
			loading: false, //是否正在加载
			showCount: -1, // 每页显示条数(这个是系统设置里面配置的，初始为-1即可，固定此写法)
			currentPage: 1 // 当前页码
		};
	},
	onShow() {
		//触发自定义的监听事件
		uni.$on('handClick', res => {
			//console.log(res);
			if (res == '页面刷新') {
				this.search();
			}
			// 清除监听
			uni.$off('handClick');
		});
	},
	onLoad(option) {
		_this = this;
	},
	created() {
		setTimeout(function() {
			_this.getReportList();
			_this.getAREA();
		}, 100);
	},
	methods: {
		//筛选
		search: function() {
			console.log('进来了');
			this.currentPage = 1;
			this.varList = [];
			this.getReportList();
		},

		//隐患区域
		areaSelect(index, item) {
			//console.log('item=>', item, 'index=>', index);
			if (index >= 0) {
				this.tval = item.value;
				this.AREA = item.name;
				this.AREA_VALUE = item.value;
			} else {
				this.tval = '';
				this.AREA = '';
				this.AREA_VALUE = '';
			}
			_this.currentPage = 1;
			_this.varList = [];
			this.getReportList();
		},
		//隐藏键盘
		hideKeyboard() {
			uni.hideKeyboard();
		},
		//上滑
		onReachBottom: function() {
			console.log('到底了');
			console.log(this.moreData);
			if (this.moreData) {
				this.currentPage++;
				this.getReportList();
			}
		},
		//获取举报列表
		getReportList: function() {
			uni.request({
				withCredentials: true,
				xhrFields: {
					withCredentials: true
				},
				url: config.httpurl + 'report/list?showCount=' + this.showCount + '&currentPage=' + this.currentPage,
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					AREA_VALUE: this.AREA_VALUE
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
					var varList = res.data.varList;
					var page = res.data.page;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					varList = JSONArray.varList;
					page = JSONArray.page;
					// #endif
					if ('success' == success) {
						//判断是否还有数据 如果页面查询条数 * 页码 >= 总条数 表示无数据
						if (page.showCount * page.currentPage >= page.totalResult) {
							_this.moreData = false;
							_this.loading = false;
						} else {
							_this.moreData = true;
							_this.loading = true;
						}
						_this.varList = _this.varList.concat(varList); //拼接消息列表
						//console.log(_this.varList)
					}
				}
			});
		},
		// 跳转举报详情页
		goReportDetails(id) {
			uni.navigateTo({
				url: './reportDetails?id=' + id
			});
		},
		// 隐患区域下拉菜单
		getAREA: function() {
			//$("#AREA").empty();
			uni.request({
				withCredentials: true,
				method: 'POST',
				dataType: 'JSON',
				url: config.httpurl + 'dictionaries/getLevels?tm=' + new Date().getTime(),
				data: {
					DICTIONARIES_ID: this.RESPONSIBLE_UNIT
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
					var list = res.data.list;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					list = JSONArray.list;
					// #endif
					if ('success' == success) {
						let areaList = [];
						for (var i = 0; i < list.length; i++) {
							let str = {
								name: list[i].NAME,
								value: list[i].DICTIONARIES_ID
							};
							areaList.push(str);
						}
						_this.AREA_LIST = areaList;
					}
				}
			});
		}
	}
};
</script>
<style lang="scss" scoped>
.box-card {
	margin: 10rpx auto 30rpx;
	padding: 0rpx 0 20rpx;
}
.u-m-15 {
	margin: 15rpx 0rpx;
}

.bg-blue {
	background: #409eff;
	color: white;
	height: 70rpx;
	line-height: 70rpx;
	padding-left: 20rpx;
	
}
.text-style {
	width: 100%;
	word-wrap: break-word;
	line-height: 25px;
}
.gray {
	color: #999;
}
</style>
