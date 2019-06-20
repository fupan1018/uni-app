<template>
	<div class="main bg">
		<view class="z_min">
			<p class="z_m01"><img src="static/images/products/mine.png" /></p>
			<p class="z_m02">智慧路灯管理系统</p>
		</view>
		<view class="z_minA" @tap="changePwd()">
				<span>修改密码</span>
				<span class="z_minr"><img src="static/images/products/right.png" /></span>
		</view>
		<view class="z_minA" @tap="loginOut()">
				<span>退出登录</span>
				<span class="z_minr"><img src="static/images/products/right.png" /></span>
		</view>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			loginOut(){
				uni.showModal({
					content: "确定退出吗？",
					confirmText: "确定",
					cancelText: "取消",
					cancelColor:'#999',
					success(res){
						if (res.confirm) {
							uni.setStorage({key:'token',data:''});
							uni.reLaunch({
								url: '/pages/login/login'
							});
						} else if (res.cancel) {
							
						}
					}
				})
			},
			changePwd(){
				uni.navigateTo({
					url: '/pages/changePassword/changePassword'
				})
			}
		}
	}
</script>

<style>
.main{position: absolute;width: 100%;height:100%;}
 

</style>
