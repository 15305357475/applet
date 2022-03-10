<script>
	export default {
		onLaunch: function(options) {			
			//console.log('App Launch')
			//引导页3秒后 进入登录页			
		},
		onShow: function() {
			//console.log('App Show')
		},
		onHide: function() {
			//console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	// @import "uview-ui/index.scss";
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "@/uni_modules/uview-ui/index.scss";
	@import "css/common.css";
	/*引入字体图标*/
	@import "./fonts/iconfont.css";
	/* ==================
	        初始化
	 ==================== */

</style>
