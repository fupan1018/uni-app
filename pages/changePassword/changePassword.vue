<template>
	<div>
		<div class="z_mot">
			<p>
				<span>原密码：</span>
				<input maxlength="30"  type="password" placeholder="请输入原密码" v-model="oldPwd" />
			</p>
			<p>
				<span>新密码：</span>
				<input maxlength="30"  type="password" placeholder="请输入新密码" v-model="newPwd" />
			</p>
			<p class="z_po">
				<span>确认密码：</span>
				<input maxlength="30"  type="password" placeholder="请再次确认新密码" v-model="againPwd" />
			</p>
		</div>
		<div class="z_btn" @tap="changePwd()">确 定</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				oldPwd: '',
				newPwd: '',
				againPwd: '',
				config: this.GLOBAL,
				token: uni.getStorageSync("token")
			}
		},
		methods: {
			changePwd() {
				if (!this.oldPwd) {
					uni.showToast({
						title: '旧密码不能为空！',
						icon: "none"
					});
					return;
				}
				if (!this.newPwd) {
					uni.showToast({
						title: '新密码不能为空！',
						icon: "none"
					});
					return;
				}
				if (!(this.newPwd == this.againPwd)) {
					uni.showToast({
						title: '确认密码不一致！',
						icon: "none"
					});
					return;
				}
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'ResetPwd',
					'GET', {
						token: this.token,
						OldPwd: that.oldPwd,
						NewPwd: that.newPwd
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.showToast({
								title: res.data.Message,
								image: "../../static/images/bgImages/sucess.png"
							});
							uni.setStorage({key:'token',data:''});
							uni.reLaunch({
								url: '/pages/login/login'
							});
						} else {
							uni.showToast({
								title: res.data.Message,
								image: "../../static/images/bgImages/error.png"
							});
						}
					}
				)

			}
		}
	}
</script>
<style>
	page {
		background: #eaeff3;
	}
</style>
