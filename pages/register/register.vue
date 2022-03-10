<!--注册页面-->
<template>
	<view class="reg_bg">
		<view class="reg-text">新用户注册</view>
		<u--form labelPosition="left" ref="form1">
			<view class="padding30" style="margin-top:30rpx;">
				<u-form-item
					label="注册类型"
					labelWidth="100"
					@click="
						showType = true;
						hideKeyboard();
					"
				>
					<u--input
						v-model="regType"
						readonly="readonly"
						customStyle="width:95%;margin:10rpx 0;"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择注册类型"
						border="surround"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #909399"
					></u--input>
				</u-form-item>
				<!--注册类型弹窗-->
				<u-action-sheet :show="showType" :actions="actions2" title="请选择注册类型" @close="showType = false" @select="typeSelect"></u-action-sheet>
				<u-form-item label="身份证号" labelWidth="100">
					<u-input type="text"  maxlength="18" v-model="ID" clearable border="surround" placeholder="请输入身份证号" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item label="手机号" labelWidth="100">
					<u-input type="text"  maxlength="11" v-model="PHONE" clearable border="surround" placeholder="请输入手机号" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item label="真实姓名" labelWidth="100">
					<u-input v-model="RNAME" clearable border="surround" placeholder="请输入真实姓名" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item label="登录用户名" labelWidth="100">
					<u-input v-model="RUSERNAME" clearable border="surround" placeholder="请输入用户名" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item label="登录密码" labelWidth="100">
					<u-input v-model="RPASSWORD" clearable type="password" border="surround" placeholder="请输入密码" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item label="确认密码" labelWidth="100">
					<u-input v-model="RPASSWORD2" clearable type="password" border="surround" placeholder="请再次输入密码" customStyle="width:95%;margin:10rpx 0;"></u-input>
				</u-form-item>
				<u-form-item
					label="性别"
					labelWidth="100"
					@click="
						showSex = true;
						hideKeyboard();">
					<u--input
						v-model="sex"
						readonly="readonly"
						customStyle="width:95%;margin:10rpx 0;"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择性别"
						border="surround"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #909399"
					></u--input>
				</u-form-item>
				<!--性别弹窗-->
				<u-action-sheet :show="showSex" :actions="actions" title="请选择性别" @close="showSex = false" @select="sexSelect"></u-action-sheet>
				<u-form-item label="签约公司" labelWidth="100" v-if="isSigningCompany">
					<luyj-select-lay
						zindex="4"
						:value="tval1"
						style="width:95%;"
						name="name1"
						slabel="name"
						svalue="value"
						placeholder="可以手动输入搜索选公司"
						:options="companyList"
						@selectitem="selectST"
					></luyj-select-lay>
					<!-- <u--input
						v-model="ST"
						readonly="readonly"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择签约公司"
						border="surround"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #909399"						
					></u--input> -->
				</u-form-item>
				<!--签约公司弹窗-->
				<!-- 	<u-action-sheet :show="showST" :actions="actions3" title="请选择签约公司" @close="showST = false" @select="STSelect"></u-action-sheet> -->
				<u-form-item label="服务部门" labelWidth="100" v-if="isServiceSector">
					<luyj-select-lay
						zindex="3"
						:value="tval2"
						style="width:95%;"
						name="name2"
						slabel="name"
						svalue="value"
						placeholder="可以手动输入搜索选部门"
						:options="serviceList"
						@selectitem="selectST2"
					></luyj-select-lay>

					<!-- <u--input
						v-model="ST2"
						readonly="readonly"
						disabled
						disabledColor="#ffffff"
						placeholder="请选择服务部门"
						border="surround"
						suffixIcon="arrow-down"
						suffixIconStyle="color: #909399"
					></u--input> -->
				</u-form-item>
				<!--服务部门弹窗-->
				<!-- 	<u-action-sheet :show="showST2" :actions="actions4" title="请选择服务部门" @close="showST2 = false" @select="ST2Select" ></u-action-sheet> -->
			</view>
		</u--form>
		<view class="reg-btn-box"><view class="login-btn" @click="register()">注&nbsp;&nbsp;&nbsp;册</view></view>
		<view class="center-style">
			<text>已有帐号，请</text>
			<text class="tip-text" @click="goLogin">登录</text>
		</view>
	</view>
</template>

<script>
import config from '../../common/config.js';
import formatDate from '../../common/formatDate.js';
import md5 from '../../common/md5.js';
var _this;
export default {
	data() {
		return {
			/*签约公司*/
			companyList: [],
			tval1: '',
			/*服务部门*/
			serviceList: [],
			tval2: '',
			TYPE: '0',
			RUSERNAME: '', //登录名
			RPASSWORD: '', //登录密码
			RPASSWORD2: '', //确认密码
			RNAME: '', //真实姓名
			ID: '', //身份证号
			PHONE: '', //手机号
			ST: '', //签约公司
			ST2: '', //服务部门
			SEX: '0',
			commitBtn: false, // 提交按钮
			isServiceSector: false, //是否显示服务部门
			isSigningCompany: false, //是否显示签约公司
			//性别
			sex: '',
			showSex: false,
			actions: [
				{
					name: '男',
					value: '男'
				},
				{
					name: '女',
					value: '女'
				}
			],
			//注册类型
			regType: '',
			showType: false,
			actions2: [
				{
					name: '--- 点击选择注册类型 ---',
					value: '0'
				},
				{
					name: '北船本工',
					value: '本工'
				},
				{
					name: '北船管业',
					value: '北船管业'
				},
				{
					name: '派遣工',
					value: '派遣工'
				},
				{
					name: '外包工',
					value: '外包工'
				},
				{
					name: '服务商',
					value: '服务商'
				},
				{
					name: '其它',
					value: '其它'
				}
			],
			
		};
	},
	onLoad(option) {
		_this = this;
	},
	
	methods: {
		//选择签约公司
		selectST(index, item) {
			//console.log('item=>', item, 'index=>', index);
			if (index >= 0) {
				this.tval1 = item.value;
				this.ST = item.value;
			} else {
				this.tval1 = '';
				this.ST = '';
			}
		},
		//选择服务部门
		selectST2(index, item) {
			//console.log('item=>', item, 'index=>', index);
			if (index >= 0) {
				this.tval2 = item.value;
				this.ST2 = item.value;
			} else {
				this.tval2 = '';
				this.ST2 = '';
			}
		},
		//选择性别
		sexSelect(e) {
			this.sex = e.name;
			this.SEX = e.value;
		},
		//选择类型
		typeSelect(e) {
			this.regType = e.name;
			console.log(e);
			this.TYPE = e.value;
			if (e.value == '本工') {
				this.ST = '';
				this.ST2 = '';
				this.isSigningCompany = false;
				this.ST = '3';
				this.ServicesDept(3);
				this.isServiceSector = true;
			} else if (e.value == '北船管业') {
				this.ST = '';
				this.ST2 = '';
				this.isSigningCompany = false;
				this.ST = '4';
				this.ServicesDept(4);
				this.isServiceSector = true;
			} else if (e.value == '0') {
				this.ST = '';
				this.ST2 = '';
				this.isSigningCompany = false;
				this.isServiceSector = false;
			} else {
				this.ST = '';
				this.ST2 = '';
				this.ContractCompany(2);
				this.isSigningCompany = true;
				this.ServicesDept(1);
				this.isServiceSector = true;
			}
		},
		
		//隐藏键盘
		hideKeyboard() {
			uni.hideKeyboard();
		},

		//注册
		register: function() {
			if (this.TYPE == '' || this.TYPE == '0') {
				uni.showToast({
					title: '请选择注册类型!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.ID == '') {
				uni.showToast({
					title: '身份证号不能为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.PHONE == '') {
				uni.showToast({
					title: '手机号码不得为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			var phonerule = /^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/;
			if (!phonerule.test(this.PHONE)) {
				uni.showToast({
					title: '不合法的手机号码',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.RNAME == '') {
				uni.showToast({
					title: '真实姓名不得为空',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.RUSERNAME == '') {
				uni.showToast({
					title: '登录名不得为空!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.RPASSWORD == '') {
				uni.showToast({
					title: '密码不得为空!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.RPASSWORD != this.RPASSWORD2) {
				uni.showToast({
					title: '登录密码和确认密码不一致!',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			var pwd_strong = this.checkStrong(this.RPASSWORD);
			if (pwd_strong < 3) {
				uni.showToast({
					title: '密码强度较弱，建议包含数字、大写字母、小写字母，且长度不小于8位！',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.SEX == '' || this.SEX == '0') {
				uni.showToast({
					title: '请选择性别',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			if (this.ST == '' || this.ST == undefined) {
				uni.showToast({
					title: '请选择签约公司',
					icon: 'none',
					duration: 2000
				});
				this.ST = '';
				return false;
			}
			if (this.ST2 == '' || this.ST2 == undefined) {
				uni.showToast({
					title: '请选择服务部门',
					icon: 'none',
					duration: 2000
				});
				this.ST2 = '';
				return false;
			}
			if (this.ST2 == '1' || this.ST2 == '2' || this.ST2 == '3' || this.ST2 == '4') {
				uni.showToast({
					title: '请选择具体的所属用工部门，不要只选择到公司！',
					icon: 'none',
					duration: 2000
				});
				return false;
			}
			var nowtime = formatDate.methods.formatDateUtil(new Date(), '1');
			
			uni.request({
				//withCredentials: true,
				url: config.httpurl + 'admin/register',
				method: 'GET',
				dataType: 'jsonp',
				jsonp:"callback",
				//传递参数
				data: {
					callback: 'jQuery17204468320903717977_1644909305719',
					TYPE: this.TYPE, // 注册类型
					USERNAME: this.RUSERNAME, // 登录名
					PASSWORD: this.RPASSWORD, // 密码
					NAME: this.RNAME, // 真实姓名
					SEX: this.SEX, // 性别
					ID: this.ID, // 身份证号
					PHONE: this.PHONE, // 电话号码
					ST: this.ST, // 合同公司
					ST2: this.ST2, // 服务部门
					FKEY: md5('USERNAME' + nowtime + ',fh,'), // MD5校验值
					tm: new Date().getTime() // 时间戳
				},
				header: {
					//'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
					'content-type': 'application/x-www-form-urlencoded' //发送请求头格式为From Data
				},
				success: function(res) {
					var result = res.data.result;
					var token = res.data.token;
					var exception = res.data.exception;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data.match(/\(([^)]*)\)/)[1]);
					result = JSONArray.result;
					exception = JSONArray.exception;
					// #endif
					//将token放入缓存中 方便以后请求接口是带入请求头
					uni.setStorageSync('token', token);
					if ("00" == result) {
						uni.showToast({
							title: '注册成功，正在等待服务部门管理员审核！',
							icon: 'none',
							duration: 2000
						});
						setTimeout(function(){
							_this.goLogin();
						},500);
					}else if("01" == result){
						uni.showToast({
							title: '登录名已被使用',
							icon: 'none',
							duration: 2000
						});
					}else if("02" == result){
						uni.showToast({
							title: '未授权注册的身份信息',
							icon: 'none',
							duration: 2000
						});
					}else if("03" == result){
						uni.showToast({
							title: '真实姓名和授权注册的姓名不符',
							icon: 'none',
							duration: 2000
						});
					}else if("04" == result){
						uni.showToast({
							title: '手机号码和预留授权手机号不符',
							icon: 'none',
							duration: 2000
						});
					}else if("05" == result){
						uni.showToast({
							title: '登录名已被使用',
							icon: 'none',
							duration: 2000
						});
					}else if("06" == result){
						uni.showToast({
							title: '您已经注册且审核通过，请直接登录',
							icon: 'none',
							duration: 2000
						});
						setTimeout(function(){
							_this.goLogin();
						},500);
					}else if("07" == result){
						uni.showToast({
							title: '您已经注册正在等待服务部门审核，请不要重复提交注册',
							icon: 'none',
							duration: 2000
						});
						setTimeout(function(){
							_this.goLogin();
						},500);
					}else if("08" == result){
						uni.showToast({
							title: '未知错误，请与系统管理员联系',
							icon: 'none',
							duration: 2000
						});
					}else if("exception" == result){
						uni.showToast({
							title: '注册' + exception,
							icon: 'none',
							duration: 2000
						});
					}
					
				}
			});
		},

		// 获取服务部门下拉树
		ServicesDept: function(com_type) {
			uni.request({
				withCredentials: true,
				url: config.httpurl + 'admin/getAllDept',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					COM_TYPE: com_type, // 部门树：北船重工：3、北船管业：4、外包工：1
					tm: new Date().getTime()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
				},
				success: function(res) {
					var success = res.data.result;
					var token = res.data.token;
					var defaultNodes;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					defaultNodes = JSON.parse(JSONArray.zTreeNodes);
					// #endif
					//将token放入缓存中 方便以后请求接口是带入请求头
					uni.setStorageSync('token', token);
					if ('success' == success) {
						let deptList = [];
						for (var i = 0; i < defaultNodes.treeNodes.length; i++) {
							let str = {
								name: defaultNodes.treeNodes[i].name,
								value: defaultNodes.treeNodes[i].id
							}
							deptList.push(str);
						}
						_this.serviceList = deptList;
					}
				}
			});
		},
		//获取签约公司下拉
		ContractCompany: function(com_type) {
			uni.request({
				withCredentials: true,
				url: config.httpurl + 'admin/getAllCompamy',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					COM_TYPE: com_type, // 部门树：北船重工：3、北船管业：4、外包工：1
					tm: new Date().getTime()
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
				},
				success: function(res) {
					var success = res.data.result;
					var token = res.data.token;
					var defaultNodes;
					// #ifdef MP-WEIXIN
					var JSONArray = JSON.parse(res.data);
					success = JSONArray.result;
					defaultNodes = JSON.parse(JSONArray.zTreeNodes);
					// #endif
					//将token放入缓存中 方便以后请求接口是带入请求头
					uni.setStorageSync('token', token);
					if ('success' == success) {
						let companyList = [];
						for (var i = 0; i < defaultNodes.treeNodes.length; i++) {
							let str = {
								name:defaultNodes.treeNodes[i].name,
								value:defaultNodes.treeNodes[i].id
							}
							companyList.push(str);
						}
						_this.companyList = companyList;
					}
				}
			});
		},

		// 密码强度检验函数
		checkStrong: function(sValue) {
			var modes = 0;
			// 正则表达式验证符合要求的
			if (sValue.length < 1) return modes;
			if (/\d/.test(sValue)) modes++; // 数字
			if (/[a-z]/.test(sValue)) modes++; // 小写
			if (/[A-Z]/.test(sValue)) modes++; // 大写
			if (/\W/.test(sValue)) modes++; // 特殊字符

			// 逻辑处理
			switch (modes) {
				case 1:
					return 1;
					break;
				case 2:
					return 2;
					break;
				case 3:
					return 3;
					break;
				case 4:
					return sValue.length < 8 ? 3 : 4;
					break;
			}
			return modes;
		},
		//登录跳转
		goLogin() {
			uni.navigateBack({
				url: '../login/login'
			});
		},
		//获取注册用户的真实姓名
		getRealName(ID){
			uni.request({
				withCredentials: true,
				url: config.httpurl + 'report/getInfoByID',
				method: 'POST',
				dataType: 'JSON',
				//传递参数
				data: {
					KEYWORDS: ID
				},
				header: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' //发送请求头格式为From Data
				},
				success: function(res) {
					var success = res.data.result;
					var info = res.data.info;
					// #ifdef MP-WEIXIN
						var JSONArray = JSON.parse(res.data);
						success = JSONArray.result;
						info = JSONArray.info[0];
					// #endif
					if ('success' == success) {
						_this.RNAME = info.NAME;
						_this.RUSERNAME = info.NAME + ID.substring(ID.length-4)
					}
				}
			});
		}
	},
	watch:{
		ID (val,olVal){
			if(val.length == 18){
				//获取真实姓名和登录名
				this.getRealName(val);
			}
			
		}
	}
};
</script>

<style lang="scss" scoped>
.reg-text {
	text-align: center;
	font-size: 35rpx;
	font-weight: bold;
	padding-top: 5vh;
	color: #4fb3ff;
	margin-bottom: 30rpx;
}
.reg_bg {
	width: 100%;
	height: 100vh;
	background: url(http://www.51topping.com/bhimages/reg-bg.jpg) no-repeat;
	background-size: 100% 100%;
}
/deep/ .u-form-item {
	margin-bottom: -20rpx !important;
}
/deep/ .u-input {
	margin-top: 0rpx !important;
}
.reg-btn-box {
	margin-top: 10rpx;
	width: 750rpx;
	padding: 30rpx 68rpx 40rpx;
}
.center-style {
	margin: 0 auto;
	width: 60%;
	text-align: center;
}
.tip-text {
	margin: 0 15rpx;
	color: #0056b3;
}
</style>
