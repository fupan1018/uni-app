<template>
	<div class="main">
		<div class="z_sbT">
			<map id="myMap" style="width: 100%;height: 100%;" :latitude="covers.latitude" :longitude="covers.longitude" :markers="covers"
			 show-location>
			</map>
		</div>
		<div class="z_xq">
			<h2>
				<span class="z01L">
					<img src="static/images/products/xq01.png" />
					<i>详情</i>
				</span>
				<span class="z01R1" v-if="lampMsg.State==0">正常</span>
				<span class="z01R" v-else>报警</span>
			</h2>
			<p>
				<span class="z_bhL">ID编号：</span>
				<span class="z_bhR">{{lampMsg.APOID}}</span>
			</p>
			<p>
				<span class="z_bhL">灯杆号：</span>
				<span class="z_bhR">{{lampMsg.Lamp_post}}</span>
			</p>
			<p>
				<span class="z_bhL">类型：</span>
				<span class="z_bhR">{{lampMsg.NodeType}}</span>
			</p>
			<p>
				<span class="z_bhL">网关：</span>
				<span class="z_bhR01">{{lampMsg.Name}}</span>
				<span class="z_bhR02" @tap="sendOrder()">指派工单</span>
			</p>
			<p>
				<span class="z_bhL">位置：</span>
				<span class="z_bhR011">{{lampMsg.Lamp_post}}</span>
				<span class="z_bhR022 clearFix" @tap="makerLocal()">
					<img src="static/images/products/xq04.png" />
					<text>矫正</text>
				</span>
			</p>
		</div>

		<div class="z_xq z_ms">
			<h2>
				<span class="z01L">
					<img src="static/images/products/xq03.png" />
					<i>模式</i>
				</span>
				<div class="z_msR">
					<view class="tag-view">
						<uni-tag :circle="true" class="active" text="手动" type="primary" size="small" />
						<uni-tag :circle="true" text="策略" type="" size="small" />
					</view>
				</div>
			</h2>
			<div class="z_Ld">
				<span class="z_Ld01">亮度调节</span>
				<!-- <span class="z_Ld02"><img src="static/images/products/xq05.png" /></span> -->
				<view class="tag-view z_Ld03">
					<uni-tag :circle="true" class="active" @tap="readData()" text="读取数据" type="primary" size="small" />
				</view>

			</div>
			<div class="de">
				<div v-if="flag" class="de_t">
					<view class="z_hd">
						<slider v-model="defaultNum" step="25" backgroundColor="#f1f1f1" block-color="#1f89dd" block-size="15" @change="sliderChange"
						 show-value />
						<div class="chi clearFix">
							<span v-for="(item, index) in menuIDs">{{index*25}}%</span>
						</div>
					</view>
					<div class="z_hda">
						<view class="tag-view">
							<uni-tag :circle="true" class="active" text="确认" @tap="sureBtn()" type="primary" size="normal" />
						</view>
					</div>
				</div>
				<div class="nodata" v-else>暂无指令！</div>
			</div>
		</div>
		<div class="z_xq z_cgq">
			<h2>
				<span class="z01L">
					<img src="static/images/products/xq02.png" />
					<i>传感器</i>
				</span>
			</h2>
			<ul v-if="bOk">
				<li class="clearFix" v-for="(item, index) in sensorList">
					<div class="ser_L">
						<span class="z_qdL">传感器名称：</span>
						<span class="z_qdR">{{item.Name}}</span>
					</div>
					<div class="ser_R">
						<span class="z_qdL">传感器值：</span>
						<span class="z_qdR">{{item.DValue}} {{item.Unit}}</span>
					</div>
				</li>
			</ul>
			<div class="nodata" v-else>暂无数据！</div>
		</div>
	</div>
</template>
<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue'
	export default {
		data() {
			return {
				bOk: false,
				flag: false,
				title: 'map',
				covers: [{
					latitude: 39.909,
					longitude: 116.39742,
					iconPath: '../../static/images/products/map_icon01.png'
				}],
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				lampMsg: {},
				sensorList: [],
				defaultNum: 25,
				menuIDs: [],
				menuID: ''
			}
		},
		components: {
			uniTag
		},
		onLoad: function(event) {
			//创建 map 上下文 MapContext 对象。
			this.myMap = uni.createMapContext('myMap');
			this.getDeviceMsg(event.nodeid);
			this.getSliderData(event.nodeid);
		},
		methods: {
			//将地图中心移动到当前定位点
			moveToLocation: function() {
				this.myMap.moveToLocation()
			},
			sliderChange(e) {
				//调节亮度
				if (e.detail.value == 0) {
					this.menuID = this.menuIDs[0].ID;
				} else if (e.detail.value == 25) {
					this.menuID = this.menuIDs[1].ID;
				} else if (e.detail.value == 50) {
					this.menuID = this.menuIDs[2].ID;
				} else if (e.detail.value == 75) {
					this.menuID = this.menuIDs[3].ID;
				} else {
					this.menuID = this.menuIDs[4].ID;
				}
			},
			getDeviceMsg(nodeid) {
				//获取设备详情
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetNodeModel',
					'GET', {
						token: this.token,
						ID: nodeid
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							var d = res.data.Data;
							that.covers = [{
								latitude: d.MapY,
								longitude: d.MapX,
								iconPath: '../../static/images/products/map_icon01.png'
							}];
							that.lampMsg = d;
							that.sensorList = d.cfnodesensor;
							if (that.sensorList.length > 0) {
								that.bOk = true;
							} else {
								that.bOk = false;
							}
						}
						uni.hideLoading();
					}
				)

			},
			readData() {
				//读取数据
				uni.showLoading({
					title: 'loading'
				});
				var that = this;
				var deviceID = that.lampMsg.NodeID;
				var groupID = that.lampMsg.GroupID;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetData',
					'GET', {
						token: this.token,
						deviceID: deviceID,
						groupID: groupID,
						para: ''
					},
					(res) => {
						//console.log(res)
						uni.hideLoading();
						if (res.data.Code == 1) {
							var d = res.data.Data;
						} else {
							uni.showToast({
								title: '读取数据失败！',
								image: "../../static/images/bgImages/error.png"
							});
						}
					}
				)

			},
			getSliderData(deviceID) {
				//默认加载设备指令
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetDeviceMenu',
					'GET', {
						token: this.token,
						deviceID: deviceID
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							var d = res.data.Data;
							if (d.length > 0) {
								that.flag = true;
								that.menuIDs = d;
								that.menuID = that.menuIDs[0].ID;
							} else {
								that.flag = false;
							}
						}
					}
				)

			},
			makerLocal() {
				//矫正位置
				var that = this;
				var ID = that.lampMsg.NodeID;
				uni.showLoading({
					title: 'loading'
				});
				uni.getLocation({
					success: (res) => {
						//console.log(res)
						that.covers.longitude = res.longitude;
						that.covers.latitude = res.latitude;
						that.GLOBAL.ajax(
							that.config.apiUrl + 'Location',
							'GET', {
								token: that.token,
								ID: ID,
								Type: 1,
								MapX: that.covers.longitude,
								MapY: that.covers.latitude,
								Address: ''
							},
							(res) => {
								//console.log(res)
								uni.hideLoading();
								if (res.data.Code == 1) {
									//定位到当前点
									that.myMap.moveToLocation();
								} else {
									uni.showToast({
										title: '位置矫正失败！',
										image: "../../static/images/bgImages/error.png"
									});
								}
							}
						)

					},
					fail: (res) => {
						//console.log(res)
						uni.hideLoading();
						uni.showToast({
							title: '位置矫正失败！',
							image: "../../static/images/bgImages/error.png"
						});
					}
				});
			},
			sureBtn() {
				//确认发送指令
				uni.showLoading({
					title: 'loading'
				});
				var that = this;
				var groupID = that.lampMsg.GroupID;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'SendCmd_ByNode',
					'GET', {
						token: this.token,
						Groupid: groupID,
						menuID: that.menuID,
						Option: 1,
						para: ''
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.hideLoading();
							uni.showToast({
								title: res.data.Message,
								image: "../../static/images/bgImages/error.png"
							});
						}
					}
				)

			},
			sendOrder() {
				//指派工单
				uni.navigateTo({
					url: '/pages/sendOrder/sendOrder'
				});
			}

		}
	}
</script>
<style>
	.tag-view {
		display: inline-block;
	}

	.tag-view .uni-tag--primary {
		background: #2E7FDB;
		border-color: #2E7FDB;
	}
</style>
