<script>
	//调试http://localhost:46632/api/apilamp/
	//测试http://10.10.50.153:8009/api/ApiLamp/
	//上线http://221.123.191.53:8248/api/ApiLamp/
	const apiUrl = 'http://10.10.50.153:8009/api/ApiLamp/'; 
	//时间格式化
	const convertTime = function(datetime) {
		var step1 = String(datetime).substr(0, 19);
		var step2 = step1.replace('T', ' ');
		return step2;
	}
	// 接口调用
	const ajax = function(url, getpost, data, success, errmsg) {
		uni.showLoading({
			title: 'loading'
		});
		uni.request({
			url: url,
			method: getpost,
			header: {
				"content-type": "application/x-www-form-urlencoded"
			},
			data: data,
			success: (res) => {
				if (res.data.Code === 3) {
					uni.showModal({
						content: "登陆失效，请重新登陆",
						confirmText: "确定",
						cancelColor:'#999',
						showCancel: false, 
						success(res){
							if (res.confirm) {
								uni.setStorage({key:'token',data:''});
								uni.reLaunch({
									url: '/pages/login/login'
								});
							} 
						}
					})
					
				}else{
					success(res)
				}
				uni.hideLoading();
			},
			fail: (err) => {
				uni.showToast({
					title: errmsg || err.errMsg,
					image: "../../static/images/bgImages/error.png"
				});
				uni.hideLoading();
			}
		});
	}

	export default {
		apiUrl,
		convertTime,
		ajax
	}
</script>
