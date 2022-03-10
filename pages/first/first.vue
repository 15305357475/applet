<!--引导页-->
<template>
	<view>
		<navigator url="/pages/login/login" open-type="redirect">		
		<image src="../../static/enter.png" class="image-style"></image></navigator>
		</view>
</template>

<script>
export default {
	data() {
		return {
			// isTiptrue: true
		};
	},
	onLoad: function(query) {
		this.closeThis();
		// let firstOpen = uni.getStorageSync('loadOpen');
		// console.log('是否首次打开本页面==', firstOpen);
		// if (firstOpen == undefined || firstOpen == '') {
		// 	//根据缓存周期决定是否显示新手引导
		// 	this.isTiptrue= true;
		// 		console.log("12222222111111")
		// 	this.closeThis();
		// } else {
		// 	this.isTiptrue= false;
		// 	console.log("333333")
		// }
	},
	methods: {
		closeThis(e) {
			setTimeout(function(){
				 // console.log("22222222222222")
				uni.navigateTo({
					url:'../login/login',
				})
			 },1000)
			
			// uni.setStorage({
			// 	key: 'loadOpen',
			// 	data: 'OpenTwo'
			// });
			// this.isTiptrue= false;
			
			
		}
	}
};
</script>

<style scoped>
.image-style {
	/* 		position: absolute; */
	width: 100%;
	height: 100vh;
}
</style>
