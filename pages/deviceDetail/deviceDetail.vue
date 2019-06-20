<template>
	<div class="main">
		<div class="z_sbT">
			<map id="myMap" style="width: 100%;height: 100%;" v-if="covers[0]" :latitude="covers[0].latitude" :longitude="covers[0].longitude"
			 :markers="covers" show-location>
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
				<!-- <div class="z_msR">
					<view class="tag-view">
						<uni-tag :circle="true" class="active" text="手动" type="primary" size="small" />
						<uni-tag :circle="true" text="策略" type="" size="small" />
					</view>
				</div> -->
			</h2>
			<div class="z_Ld">
				<span class="z_Ld01">亮度调节</span>
				<!-- <span class="z_Ld02"><img src="static/images/products/xq05.png" /></span> -->
				<view class="tag-view z_Ld03 v_primary">
					<uni-tag :circle="true" class="active" @tap="readData()" text="读取数据" type="primary" size="small" />
				</view>

			</div>
			<div class="de">
				<div v-if="flag" class="de_t">
					<view class="z_hd">
						<slider v-model="defaultNum" step="25" backgroundColor="#f1f1f1" block-color="#1f89dd" block-size="15" @change="sliderChange"
						 show-value />
						<div class="chi clearFix">
							<span v-for="(item, index) in menuIDs" :key="index">{{index*25}}%</span>
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
				covers: [],
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				lampMsg: {},
				sensorList: [],
				defaultNum: 25,
				menuIDs: [],
				menuID: '',
				nodeid: '',
				nowX: '',
				nowY: '',
				titleName:''
			}
		},
		components: {
			uniTag
		},
		onLoad: function(event) {
			//创建 map 上下文 MapContext 对象。
			this.myMap = uni.createMapContext('myMap');
			this.nodeid = event.nodeid;
			this.getDeviceMsg(this.nodeid);

			// 设置标题
			uni.setNavigationBarTitle({
				title: event.name
			})
		},
		methods: {
			//将地图中心移动到当前定位点
			moveToLocation: function() {
				this.myMap.moveToLocation()
			},
			sliderChange(e) {
				this.defaultNum = e.detail.value;
			},
			// 获取亮度ID
			getLdId() {
				//menuIDs
				let searchFlag = this.defaultNum == 0 ? '关' : this.defaultNum;
				let that = this;
				this.menuIDs.forEach(function(v, i) {
					if (v.CfDeviceCmd.Name.indexOf(searchFlag) != -1) {
						// that.menuID = v.CfDeviceCmd.ID;
						that.menuID = v.ID;
						return false;
					}
				});
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
								iconPath: (d.State == 0 ? '../../static/images/products/ld02.png' :
									'../../static/images/products/map_icon01.png')
							}];

							that.lampMsg = d;
							//console.log(that.lampMsg);
							that.sensorList = d.cfnodesensor;
							if (that.sensorList.length > 0) {
								that.bOk = true;
							} else {
								that.bOk = false;
							}
							// 初始化获取模式指令
							this.getSliderData(this.lampMsg.ID);
						}
						uni.hideLoading();
					}
				)

			},
			readData() {
				//读取数据
				uni.showLoading({
					title: '读取数据，时间较长，请稍候'
				});
				var that = this;
				var deviceID = that.lampMsg.ID;
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
							//var d=res.data.Data;
							// 更新指令数据 
							this.GetSensor(this.lampMsg.GroupID);
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
				//默认加载设备模式指令
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
								this.GetSensor(this.lampMsg.GroupID);
							} else {
								that.flag = false;
							}
						}
					}
				)

			},
			// 亮度调节回显数据
			GetSensor(groupID) {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetSensor',
					'GET', {
						token: this.token,
						groupID: groupID
					},
					(res) => {
						//console.log(res)
						uni.hideLoading();
						if (res.data.Code == 1) {
							this.defaultNum = res.data.Data * 1;
						}
					}
				)

			},
			makerLocal() {
				uni.showLoading({
					title: 'loading'
				});
				let that = this;
				//矫正位置
				this.myMap.moveToLocation(); //移动到当前点
				let ID = that.lampMsg.NodeID;
				setTimeout(function() { // 移动至中心点有延迟，所以设置定时器
					// 获取地图中心点
					that.myMap.getCenterLocation({
						success: function(res) {
							//console.log(res);
							that.nowX = res.longitude;
							that.nowY = res.latitude;

							that.GLOBAL.ajax(
								that.config.apiUrl + 'Location',
								'GET', {
									token: that.token,
									ID: ID,
									Type: 1,
									MapX: that.nowX,
									MapY: that.nowY,
									Address: ''
								},
								(res) => {
									//console.log(res)
									uni.hideLoading();
									if (res.data.Code == 1) {
										// 刷新地图坐标
										that.getDeviceMsg(that.nodeid);
										uni.hideLoading();
									} else {
										uni.showToast({
											title: '位置矫正失败！',
											image: "../../static/images/bgImages/error.png"
										});
									}
								}
							)

						}
					});
				}, 1000);

			},
			sureBtn() {
				// 获取当前选中指令ID
				this.getLdId();
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
						para: this.defaultNum
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.hideLoading();
							uni.showToast({
								title: res.data.Message 
							});
						}
					}
				)

			},
			sendOrder() {
				var that = this;
				if (that.lampMsg.State) {
					//报警维护
					var Type = 1
				} else {
					//日常维护
					var Type = 0
				}
				//指派工单
				uni.navigateTo({
					url: '/pages/sendOrder/sendOrder?NodeID=' + that.lampMsg.NodeID + '&Type=' + Type
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

	page {
		background: #eaeff3;
	}

	.ser_L {
		width: 60%;
	}

	.ser_R {
		width: 40%;
	}
	.z_xq .z01R1{
		width:110upx;
		height:50upx;
		line-height:50upx;
		font-size: 26upx;
		margin-top: 6upx;
	}
	.z_bhL{
		font-size: 28upx;
		width:120upx;
	}
	.z_bhR{font-size: 26upx;width:580upx;}
	.z_xq p{height:48upx;line-height: 48upx;}
	.z_bhR022 img{width:24upx; height:24upx; float:left; margin:14upx 8upx 0 5upx;}
	.z_bhR022,.z_bhR02,.v_primary{height:50upx;line-height: 50upx;width:110upx;font-size: 26upx;margin-top:0;}
	.z_bhR02{width:130upx;}
	.z_bhR01{width: 400upx;}
	.v_primary{width:150upx;}
	.chi{font-size: 24upx;}
	.z_cgq ul li{font-size: 26upx;line-height: 48upx;}
	.z_Ld03{margin-top: 8upx;font-size: 24upx;}
</style>
