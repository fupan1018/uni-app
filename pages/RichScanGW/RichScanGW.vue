<template>
	<div class="main">
		<div id="barcode" class="barcode"></div>
		<view class="barcodeInfo">
			<view class="sys">将二维码放入框内，即可自动扫描</view>
			<view class="z_sys">
				<view class="uni-list-cell-left" @tap="setFlash()"><img src="static/images/products/s01.png" /><i>打开照明</i></view>
				<view class="z_syL uni-list-cell-right" @tap="goManualAddGW()"><img src="static/images/products/s02.png" /><i>手动输入</i></view>
			</view>
		</view>


	</div>
</template>

<script>
	export default {
		data() {
			return {
				pageName: '',
				barcode:null,
				flashType:false,
				ID:''
			}
		},
		onLoad: function(event) {
			// 获取地址栏传送参数
			this.pageName = event.query;
			this.ID = event.ID;
			let pages = getCurrentPages();
			let page = pages[pages.length - 1];
			// #ifdef APP-PLUS  
			let currentWebview = page.$getAppWebview();
			// #endif  
			// 
			this.barcode = plus.barcode.create('barcode', [plus.barcode.QR], {
				background: '#ccc',
				top: '10%',
				left: '10%', 
				width: '80%',
				height: '40%',
				position: 'static'
			});
			//此处未演示扫码成功回调的地址设置，实际请参考HTML5Plus API自行处理  
			//注意扫码区域需为正方形，否则影响扫码识别率  
			this.barcode.onmarked = this.onmarked;
			currentWebview.append(this.barcode);
			this.barcode.start();
		},
		onShow(){
			this.barcode.start(); 
		},
		methods: {
			// 扫码成功回调
			onmarked(type, result) {
				var text = '未知: ';
				switch (type) {
					case plus.barcode.QR:
						text = 'QR: ';
						break;
					case plus.barcode.EAN13:
						text = 'EAN13: ';
						break; 
					case plus.barcode.EAN8:
						text = 'EAN8: ';
						break;
				}
				//console.log(result );
				// 跳转，并在地址栏携带参数
				uni.navigateTo({
					url: '/pages/'+this.pageName+'/'+this.pageName+'?query='+ encodeURIComponent(JSON.stringify(result))+'&ID='+this.ID
							
				});
				
			},
			// 打开关闭闪光灯
			setFlash() {
				this.flashType = !this.flashType;
				if(this.barcode){
					this.barcode.setFlash(this.flashType);
				}
			},
			// 跳转到手动添加
			goManualAddGW(){ 
				uni.navigateTo({
					url: '/pages/'+this.pageName+'/'+this.pageName
				});
			}
		}
	}
</script>

<style>
	.main {
		background: #000;
	}
	.barcodeInfo {
		top: 55%;
		position: absolute;
		left: 10%;
		width: 80%;
	}

	.z_sys {
		width: 60%;
	}
	.z_sys view{width:120upx; float:left; font-size:28upx; color:#FFF;}
	.z_sys view img{width:90upx; height:90upx; margin:0 auto;}
	.z_sys view i{margin-top:0.4533rem; width:120upx; text-align:center; display:block;}
	.main{position: absolute;height:100%;width:100%;}
</style>
