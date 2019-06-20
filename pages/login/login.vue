<template>
	<div class="main">
		<div class="z_Ltop">
			<img src="static/images/bgImages/L01.png" alt="">
			<div class="imgLogoBox">
				<div class="z_Logo"><img src="static/images/products/logo.png" /></div>
				<div class="z_title">智慧路灯管理系统</div>
			</div>
			
		</div>

		<div class="z_Lbottom">
			<p><img src="static/images/products/01.png" /><input type="text" v-model="username" placeholder="输入账号" /></p>
			<p><img src="static/images/products/02.png" /> <input type="password" v-model="Password" placeholder="输入密码" /></p>
			<p class="z_p3">
				<view class="z_pan01">
					<checkbox-group @change="checkboxChange">
						<label>
							<checkbox v-bind:checked="bOk" style="transform:scale(0.7)"/>记住密码
						</label>
					</checkbox-group>
				</view>
			</p>
		</div>
		<div class="z_btn"  @tap="bindLogin">登 录</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				username:'',
				Password:'',
				config:this.GLOBAL,
				bOk:false
			}
		},
		mounted: function() {
			var cunUser=uni.getStorageSync('username');
			var cunPwd=uni.getStorageSync('Password');
			if(cunUser){
				//记住密码
				this.bOk=true;
				this.username=cunUser;
				this.Password=cunPwd;
			}else{
				this.bOk=false;
			}
		},
		methods: {
			checkboxChange(e){
				var values = e.detail.value;
				if(values.length==0){
					this.bOk=false;
				}else{
					this.bOk=true;
				}
			},
			bindLogin(){
				var that=this;
				//console.log(that.username,that.Password,);
				if(!(that.username)){
					uni.showToast({
						title: "账号不能为空",
						image: "../../static/images/bgImages/error.png"
					});
					return;
				}
				if(!(that.Password)){
					uni.showToast({
						title: "密码不能为空",
						image: "../../static/images/bgImages/error.png"
					});
					return;
				}
				uni.showLoading({
					title: 'loading'
				});
				uni.request({
					url: that.config.apiUrl+'PostLogin',
					method:'POST',
					header:{
					  "content-type":"application/x-www-form-urlencoded"
					},
					data: {
						Username:that.username,
						Password:that.Password,
					},
					success: (res) => {
						//console.log(res)
						if(res.data.Code==1){
							uni.setStorage({key:'token',data:res.data.Data});
							//记住密码
							if(that.bOk){
								uni.setStorage({key:'username',data:that.username});
								uni.setStorage({key:'Password',data:that.Password});
							}else{
								uni.setStorage({key:'username',data:''});
								uni.setStorage({key:'Password',data:''});
							}
							uni.hideLoading();
							uni.reLaunch({
								url: '/pages/monitor/monitor'
							});
						}else{
							//console.log('失败');
							uni.showToast({
								title: res.data.Message,
								image: "../../static/images/bgImages/error.png"
							});
						}
					},
					fail: (err) => {
						//console.log('失败');
						uni.showToast({
							title: err.errMsg,
							image: "../../static/images/bgImages/error.png"
						});
					}
				});
			}
		}
	}
</script>
<style>
	.z_Ltop{background: none;}
	.z_Ltop > img{width: 100%;height: 100%;}
	.imgLogoBox{position: absolute;top: 0;left:0;}
	.main{height:100%;position: absolute;width: 100%;}
</style>
