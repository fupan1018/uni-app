<template>
	<div class="main">
		<div class="v_z_he" v-show="addBtnStyle">
			<ul class="z_he">
				<li @tap="addNode"><img src="static/images/products/sd.png" />手动添加</li>
				<li @tap="RichScanaddNode"><img src="static/images/products/sys.png" />扫一扫</li>
			</ul>
		</div>
		<div v-show="mapOrList">

			<view>
				<view class="page-body">
					<view class="page-section page-section-gap">
						<map class="map" id="myMap" :latitude="latitude" show-location=true :longitude="longitude" @markertap="tapMarker"
						 :markers="covers">
							<cover-image class="controls-play img" @click="moveOn" src="../../static/images/products/zb01.png"></cover-image>
						</map>
					</view>
				</view>
			</view>
		</div>
		<div v-show="!mapOrList">
			<div class="z_djh">
				<div class="z_gw">
					<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
						<view v-for="(tab, index) in data1.Data" :key="tab.ID" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']"
						 :id="tab.ID" :data-current="index" @tap="getList1(index,'tap')">{{tab.Name}}</view>
					</scroll-view>
				</div>
				<div class="z_mr" v-show="haveData2">
					<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft2">
						<view v-for="(tab, index2) in data2" :key="tab.ID" :class="['swiper-tab-list',tabIndex2==index2 ? 'active' : '']"
						 :id="tab.ID" :data-current="index2" @tap="getList2(tab.ID,index2)">{{tab.Name}}</view>
					</scroll-view>
				</div>
				<div class="nodata" v-show="!haveData3">暂无数据！</div>
			</div>

			<div class="z_bjMb" v-show="haveData3">
				<div class="z_wg" v-for="(tab, index) in data3.Data.data" :key="index" @tap="goDetail(tab.NodeID,tab.Name)">
					<div class="z_wgL"><img :src="tab.IsLink?'static/images/products/img01.png':'static/images/products/img01.png'" /></div>
					<div class="z_wgC">
						<h3>
							<span>设备名称：</span>
							<span>{{tab.Name}}</span>
						</h3>
						<p>
							<span>设备编号：</span>
							<span>{{tab.APOID}}</span>
						</p>
						<p>
							<span>更新日期：</span>
							<span>{{convertTime(tab.LastDataUpdateTime)}}</span>
						</p>
					</div>
					<div :class="['z_zca',tab.State==0?'':'z_zcb']">{{tab.State==0?"正常":"报警"}}</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				// 列表
				scrollLeft: 0,
				data1: {
					Data: {}
				},
				data2: {
					Data: {}
				},
				haveData3: true,
				haveData2: true,
				tabIndex: 0,
				index: 0,
				scrollLeft2: 0,
				tabIndex2: 0,
				index2: 0,
				data3: {
					Data: {}
				},
				mapOrList: true,
				addBtnStyle: false,
				config: this.GLOBAL,
				convertTime: this.GLOBAL.convertTime,
				token: uni.getStorageSync("token"),
				latitude: 39.909,
				longitude: 116.39742,
				// 渲染标记
				covers: [],
				map: {},
				// 原始坐标
				markerList: []
			}
		},
		computed: {

		},
		onLoad: function() {
			// 如果用户没有登陆 则跳转到登陆页面
			if (!uni.getStorageSync("token")) {
				uni.reLaunch({
					url: '/pages/login/login'
				});
				return;
			}
			//console.log(uni.getStorageSync("token"));

			this.map = uni.createMapContext('myMap', this)

			// 获取项目列表
			this.getItemList();

			// 获取地图坐标点
			this.GetMapNode();
		},
		onShow(){
			// 获取项目列表
			this.getItemList();
			
			// 获取地图坐标点
			this.GetMapNode();
		},
		onNavigationBarButtonTap(e) {
			//console.log(e)
			if (e.index === 1) {
				if (this.mapOrList == true) {
					this.mapOrList = false;
					this.addBtnStyle = false;
				}
				// 添加菜单
				this.addBtnStyle = !this.addBtnStyle;

			} else if (e.index === 0) {
				// 显示列表或地图
				this.mapOrList = !this.mapOrList;
			}
			if (e.index === 2) {
				// 去搜索
				uni.setStorageSync("v_index", this.tabIndex);
				uni.setStorageSync("v_index2", this.tabIndex2);
				uni.navigateTo({
					url: '/pages/search/search?query=monitor'
				});
			}
		},
		methods: {
			// 添加设备
			addNode() {
				if (this.data2[this.tabIndex2]) {
					uni.navigateTo({
						url: '/pages/addNode/addNode?ID=' + this.data2[this.tabIndex2].ID
					});
				} else {
					uni.showToast({
						title: '该项目组下无设备组，不可添加设备',
						icon: "none"
					});
				}
			},
			// 扫码添加设备
			RichScanaddNode() {
				uni.navigateTo({
					url: '/pages/RichScanGW/RichScanGW?query=addNode&ID=' + this.data2[this.tabIndex2].ID
				});
			},
			// 地图移动至当前位置
			moveOn() {
				this.map.moveToLocation()
			},
			// 项目横向列表
			getItemList() {
				let that = this;
				uni.request({
					url: this.config.apiUrl + 'GetProjectGroup',
					method: 'GET',
					header: {
						"content-type": "application/x-www-form-urlencoded"
					},
					data: {
						token: this.token
					},
					success: (res) => {
						//console.log(res)
						if (res.data.Code == 1 && res.data.Data.length > 0) {
							this.data1 = res.data;
							let v_index = uni.getStorageSync("v_index") || 0;
							this.getList1(v_index)
						}
					},
					fail: (err) => {
						uni.showToast({
							title: errmsg || err.errMsg,
							image: "../../static/images/bgImages/error.png"
						});
					}
				});
			},
			// 点击一级菜单，显示二级菜单
			getList1(index, even) {
				if (even) {
					this.tabIndex2 = 0
					uni.setStorageSync("v_index2", 0);
				}
				this.tabIndex = index;
				this.data2 = this.data1.Data[index].data;
				if (this.data2.length == 0) {
					this.haveData2 = false;
					this.haveData3 = false;
					return;
				}
				this.haveData2 = true;
				this.haveData3 = true;
				let v_index2 = uni.getStorageSync("v_index2") || 0;
				//console.log(this.data2);
				this.getList2(this.data2[v_index2].ID, v_index2)
			},
			// 点击二级菜单，显示列表
			getList2(id, index) {
				this.tabIndex2 = index;
				uni.request({
					url: this.config.apiUrl + 'GetLampList',
					method: 'GET',
					header: {
						"content-type": "application/x-www-form-urlencoded"
					},
					data: {
						token: this.token,
						PageIndex: 1,
						PageSize: 99999,
						condition: this.$store.state.GWsearchData || '',
						groupID: id
					},
					success: (res) => {
						//console.log(res)
						if (res.data.Code == 1 && res.data.Data.data.length > 0) {
							this.haveData3 = true;
							this.data3 = res.data
							//console.log(this.data3.Data.data );
							this.$store.state.GWsearchData = '';
						} else {
							this.haveData3 = false;
						}
					},
					fail: (err) => {
						uni.showToast({
							title: errmsg || err.errMsg,
							image: "../../static/images/bgImages/error.png"
						});
					}
				});
				// this.GLOBAL.ajax(
				// 	this.config.apiUrl + 'GetLampList',
				// 	'GET', {
				// 		token: this.token,
				// 		PageIndex: 1,
				// 		PageSize: 99999,
				// 		condition: this.$store.state.GWsearchData || '',
				// 		groupID: id
				// 	},
				// 	(res) => {
				// 		//console.log(res)
				// 		if (res.data.Code == 1 && res.data.Data.data.length > 0) {
				// 			this.haveData3 = true;
				// 			this.data3 = res.data
				// 			//console.log(this.data3.Data.data );
				// 			this.$store.state.GWsearchData = '';
				// 		} else {
				// 			this.haveData3 = false;
				// 		}
				// 	}
				// )
			},
			// 跳转至详情页
			goDetail(ID, name) {
				uni.navigateTo({
					url: '/pages/deviceDetail/deviceDetail?nodeid=' + ID + '&name=' + name
				});
			},
			// 获取地图坐标
			GetMapNode() {
				let that = this;
				uni.request({
					url: this.config.apiUrl + 'GetMapNode',
					method: 'GET',
					header: {
						"content-type": "application/x-www-form-urlencoded"
					},
					data: {
						token: this.token,
						condition: this.$store.state.GWsearchData || ''
					},
					success: (res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							if (res.data.Data.info && res.data.Data.list) {
								this.markerList = res.data.Data.info.concat(res.data.Data.list);
								this.markerList.forEach(function(v, i) {
									that.creatMarker(v, i);
								});
							}
						}
					},
					fail: (err) => {
						uni.showToast({
							title: errmsg || err.errMsg,
							image: "../../static/images/bgImages/error.png"
						});
					}
				});

			},
			// 初始化坐标点
			creatMarker(json, index) {
				if (!json.MapX || !json.MapY) return;
				let marker = {};
				if (json.Type == 1) {
					marker = {
						id: index,
						latitude: json.MapY,
						longitude: json.MapX,
						iconPath: (json.State == 0 ? '../../static/images/products/ld02.png' :
							'../../static/images/products/map_icon01.png')
					}
				} else {
					marker = {
						id: index,
						latitude: json.MapY,
						longitude: json.MapX,
						iconPath: (json.State == 0 ? '../../static/images/products/wg02.png' : '../../static/images/products/wg01.png')
					}
				}
				this.covers.push(marker)


			},
			// 地图标记点击事件
			tapMarker(e) {
				//console.log(e);
				let node = this.markerList[e.markerId];
				//console.log(node);
				if (node.Type == 1) {
					// 路灯 ID
					uni.navigateTo({
						url: '/pages/deviceDetail/deviceDetail?nodeid=' + node.NodeID + '&name=' + node.Name
					});

				} else {
					// 网关 NodeID
					uni.navigateTo({
						url: '/pages/gatewayDetail/gatewayDetail?query=' + encodeURIComponent(JSON.stringify(node))

					});

				}
			}
		}
	}
</script>

<style>
	.v_z_he {
		position: absolute;
		z-index: 9999;
		top: 0upx;
		right: 0;
	}

	.z_he {
		position: sticky;
		background: url(../../static/images/bgImages/xl.png) no-repeat;
		background-size: cover;
		padding-top: 20upx;
	}

	.z_he li {
		border: 0 none;
	}

	.z_he li:first-child {
		margin: 0;
	}

	.map {
		width: 100%;
		position: absolute;
		height: 100%;
	}

	.z_map {
		z-index: 9999;
	}

	.z_mr,
	.nodata,
	.z_gw {
		position: sticky;
	}

	.z_gw .active,
	.z_mr .active {
		color: #2e7fdb;
	}

	.z_mr {
		height: 100upx;
		line-height: 100upx;
	}

	.img {
		position: absolute;
		width: 100upx;
		height: 100upx;
		top: 30%;
		margin-top: -50upx;
	}

	.controls-play {
		right: 20upx;
	}
	.z_wgC p{font-size: 26upx;}
	.z_zca{height:50upx;line-height: 50upx;width:90upx;font-size: 26upx;margin-top:0;}
</style>
