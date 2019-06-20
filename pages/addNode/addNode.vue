<template>
	<div class="main bg">

		<div class="z_tjd">
			<p>
				<span class="z_tj01">ID编号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="路灯编号" v-model="infoData.NodeOID" /></span>
			</p>
			<p>
				<span class="z_tj01">名称：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="路灯名称" v-model="infoData.Name" /></span>
			</p>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						AP：
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="array" range-key="Name">
							<view class="uni-input" :id="array[index].ID">{{array[index].Name}}</view>
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
				<span class="z_tj01">灯杆号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="灯杆号" v-model="infoData.Lamp_post" /></span>
			</p>
			<p>
				<span class="z_tj01">位置：</span>
				<span class="z_tj02"><img src="static/images/products/dw.png" @tap="getPosition()" /><input maxlength="30"  class="poIpt" type="text"
					 placeholder="定位到当前位置" :value="infoData.MapX?(infoData.MapX+','+infoData.MapY):''" disabled="disabled" /></span>
			</p>
			<p class="z_p1">
				<span class="z_tj01">配电箱：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="配电箱" v-model="infoData.Distribution_Box" /></span>
			</p>
			<p>
				<span class="z_tj01">型号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="型号" v-model="infoData.NodeType" /></span>
			</p>
			<p>
				<span class="z_tj01">功率：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" placeholder="功率" v-model="infoData.Power" /></span>
			</p>
		</div>
		<div class="z_btn" @tap="AddNode()">确 定</div>

	</div>
</template>

<script>
	export default {
		data() {
			return {
				banner: {},
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				index2: 0,
				infoData: {
					MapX: '',
					MapY: '',
					deviceID: '0557a46e-2b1b-419d-8d24-913705822191',
					Name: '',
					NodeOID: '',
					Descr: '',
					GroupID: '',
					NetTypeId: '',
					NodeOID: '',
					IsNoDataAlarm: true,
					IsSupportExport: true,
					Address: '',
					APID: '',
					NodeType: '',
					Power: '',
					Lamp_post: '',
					Distribution_Box: ''
				},
				array2: [{
					Name: '',
					ID: ''
				}],
				array: [{
					name: '4G'
				}, {
					name: '3G'
				}],
				index: 0,
			}
		},
		onLoad(event) {
			if (event.query) {
				try {
					this.banner = JSON.parse(decodeURIComponent(event.query));
				} catch (error) {
					this.banner = JSON.parse(event.query);
				}
				//console.log(this.banner);
				// todo 处理扫码数据的绑定

				// 扫码设备暂无，添加临时模拟数据
				// 编号
				this.infoData.NodeOID = 'df4340'
				// 名称
				this.infoData.Name = '模拟路灯'
				// 灯杆号
				this.infoData.Lamp_post = '34000435'

			}
			this.infoData.GroupID = event.ID;
			// 获取组网模式列表
			this.GetNetTypeList();
			// 获取AP列表
			this.GetAPs();
			// 获取当前手机定位经纬度
			this.getPosition();
		},
		methods: {
			// AP列表选择
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
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
					'GET', {
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							this.array2 = res.data.Data
						}
					}
				)

			},
			// 添加设备
			AddNode() {
				let info = {};
				let infoNode = {};
				let deviceID = this.infoData.deviceID;
				info.ID = '00000000-0000-0000-0000-000000000000';
				info.Name = this.infoData.Name;
				info.NodeOID = this.infoData.NodeOID;
				info.MapX = this.infoData.MapX;
				info.MapY = this.infoData.MapY;
				info.Descr = this.infoData.Descr;
				info.GroupID = this.infoData.GroupID;
				infoNode.NetTypeId = this.array2[this.index2].ID;
				infoNode.NetTypeLabel = this.array2[this.index2].Label;
				infoNode.NodeOID = this.infoData.NodeOID;
				infoNode.IsNoDataAlarm = this.infoData.IsNoDataAlarm;
				infoNode.IsSupportExport = this.infoData.IsSupportExport;
				infoNode.Address = this.infoData.Address;
				infoNode.APID = this.array[this.index].ID;
				//infoNode.DeviceID = $('.bom01 input[name="DeviceID"]').val();
				infoNode.NodeType = this.infoData.NodeType;
				infoNode.Power = this.infoData.Power;
				infoNode.Lamp_post = this.infoData.Lamp_post;
				infoNode.Distribution_Box = this.infoData.Distribution_Box;
				if(!this.infoData.MapX){
					uni.showToast({
						title: '定位失败，请设置允许获取位置再试',
						icon: "none"
					});
					return;
				}else if(!this.infoData.NodeOID||!this.infoData.Name||!this.infoData.Lamp_post||!this.infoData.Distribution_Box||!this.infoData.NodeType||!this.infoData.Power){
					uni.showToast({
						title: '请填写完整信息',
						icon: "none"
					});
					return;
				}
				
				this.GLOBAL.ajax(
					this.config.apiUrl + 'AddNode',
					'POST', {
						token: this.token,
						info: JSON.stringify(info),
						infoNode: JSON.stringify(infoNode),
						DeviceID: deviceID
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.showToast({
								title: '操作成功',
								image: ""
							});
							uni.reLaunch({
								url: '/pages/monitor/monitor'
							});
						}
					}
				)

			},
			// 获取AP列表
			GetAPs() {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetAPs',
					'GET', {
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							this.array = res.data.Data
						}
					}
				)

			},

		}
	}
</script>

<style>
	.main {
		position: absolute;
		height: 100%;
	}

	img {
		width: 10px;
		height: 13px;
		position: absolute;
		margin-top: 20upx;
	}

	.poIpt {
		margin-left: 30upx;
	}

	.lxCls {
		width: 170upx;
		padding: 0;
		text-align: right;
	}

	.uni-list-cell-left {
		width: 170upx;
		padding: 0;
		text-align: right;
	}

	.uni-input {
		padding-left: 0;
	}
</style>
