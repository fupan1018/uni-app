<template>
	<view class="main bg">
		
		<div class="z_tjd">
			<p>
				<span class="z_tj01">名称：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="名称" v-model="infoData.Name" /></span>
			</p>
			<p>
				<span class="z_tj01">编号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="编号" v-model="infoData.APOID" /></span>
			</p>
			<p>
				<span class="z_tj01">类型：</span>
				<span :class="['z_tj02']"><input maxlength="30"  type="text" placeholder="类型" v-model="infoData.APType" /></span>
			</p>
			<p>
				<span class="z_tj01">型号：</span>
				<span :class="['z_tj02']"><input maxlength="30"  type="text" placeholder="型号" v-model="infoData.APModel" /></span>
			</p>
			<p class="z_p1">
				<span class="z_tj01">位置：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="位置" disabled="disabled" :value="infoData.MapX?(infoData.MapX+','+infoData.MapY):''" /></span>
			</p>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						联网方式：
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
							<view class="uni-input">{{array[index].name}}</view>
						</picker>
					</view>
				</view>
			</view>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						组网模式：
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange2" :value="index2" :range="array2" range-key="Name">
							<view class="uni-input" :id="array2[index2].ID">{{array2[index2].Name}}</view>
						</picker>
					</view>
				</view>
			</view>

			<p>
				<span class="z_tj01">物联卡号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" v-model="infoData.PhoneNumber" placeholder="物联卡号" /></span>
			</p>
			<p>
				<span class="z_tj01">物联套餐：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" v-model="infoData.Flow" placeholder="物联套餐" /></span>
			</p>
		</div>
		<div class="z_btn" @tap="save()">保 存</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				banner: {},
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				ProjectManagement_ID:'',
				infoData: {
					ID: '',
					Name: '',
					APOID: '',
					APType: '',
					APModel: '',
					MapX:'',
					MapY:'',
					NetWork: '', // 联网方式
					PhoneNumber: '', // 物联卡号
					Flow: '', // 流量套餐
					BaseNetType: '', //组网模式
					Descr: '',
					StartTime: '',
					NetTypeID: ''
				},
				editStyle: false,
				array: [{
					name: '4G'
				}, {
					name: '3G'
				}],
				array2: [{
					Name: '',
					ID: ''
				}],
				index: 0,
				index2: 0
			}
		},
		onLoad(event) {
			// 获取地址栏传送参数,是否是扫码添加过来的
			if (event.query) {
				try {
					this.banner = JSON.parse(decodeURIComponent(event.query));
				} catch (error) {
					this.banner = JSON.parse(event.query);
				}
				// todo 处理扫码数据的绑定
				
				// 扫码设备暂无，添加临时模拟数据
				
				// 编号
				this.infoData.APOID = 'df4340'
				// 名称
				this.infoData.Name = 'offf013'
				// 类型
				this.infoData.APType = 'et001'
				// 型号
				this.infoData.APModel = '34000435'

			} 
			this.ProjectManagement_ID = event.ID
			// 获取组网模式列表
			this.GetNetTypeList();
			// 获取当前手机定位经纬度
			this.getPosition();
		},
		methods: {

			save() {
				this.infoData.NetTypeID = this.array2[this.index2].ID;
				this.infoData.NetWork = this.array[this.index].name;
				this.infoData.ID = "00000000-0000-0000-0000-000000000000";
				this.infoData.BaseNetType = null;
				this.infoData.ProjectManagement_ID=this.ProjectManagement_ID
				if(!this.infoData.MapX){
					uni.showToast({
						title: '定位失败，请设置允许获取位置再试',
						icon: "none"
					});
					return;
				}else if(!this.infoData.APOID||!this.infoData.Name||!this.infoData.APType||!this.infoData.APModel||!this.infoData.PhoneNumber||!this.infoData.Flow){
					uni.showToast({
						title: '请填写完整信息再试',
						icon: "none"
					});
					return;
				}
				//console.log(this.infoData);
				this.GLOBAL.ajax(
					this.config.apiUrl + 'AddAP',
					'POST',
					{
						token: this.token,
						info: JSON.stringify(this.infoData)
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1 ) {
							uni.showToast({
								title: '操作成功！'
							});
							uni.reLaunch({
								url: '/pages/gateway/gateway'
							});
						}
					}
				)
			},
			// 上网方式选择
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
			},
			// 组网模式选择
			bindPickerChange2: function(e) {
				//console.log(e.target)
				this.index2 = e.target.value
			},
			// 组网模式数据
			GetNetTypeList: function() {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetNetTypeList',
					'GET',
					{
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1 ) {
							this.array2 = res.data.Data
						}
					}
				)
			},
			// 获取当前位置
			getPosition() {
				uni.getLocation({
					type: 'gcj02',
					success: (res) => {
						// console.log('当前位置的经度：' + res.longitude);
						// console.log('当前位置的纬度：' + res.latitude);
						this.infoData.MapX = res.longitude;
						this.infoData.MapY = res.latitude;
					}
				});
			}
		}
	}
</script>

<style>
	.main {
		position: absolute;
		height: 100%;
	}
</style>
