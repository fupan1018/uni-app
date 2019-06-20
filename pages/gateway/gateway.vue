<template>
	<div class="main bg">
		<div class="v_z_he" v-if="addBtnStyle">
			<ul class="z_he">
				<li class="clearFix" @tap="addGW"><img src="static/images/products/sd.png" />手动添加</li>
				<li class="clearFix" @tap="RichScanGW"><img src="static/images/products/sys.png" />扫一扫</li>
			</ul>
		</div>
		<div class="z_gw">

			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x :scroll-left="scrollLeft">
				<view v-for="(tab, index) in data1.Data" :key="tab.ID" :class="['swiper-tab-list',tabIndex==index ? 'active' : '']"
				 :id="tab.ID" :data-current="index" @tap="getList(tab.ID,index)">{{tab.Name}}</view>
			</scroll-view>
		</div>
		<div class="z_bjM" v-if="haveData">
			<div class="z_wg" v-for="(tab, index) in data2.Data.data" :key="tab.ID" @tap="goDetail(tab)">
				<div class="z_wgL"><img :src="tab.IsLink?'static/images/products/img01.png':'static/images/products/img01.png'" /></div>
				<div class="z_wgC">
					<h3>{{tab.Name}}</h3>
					<p>
						<span>设备编号：</span>
						<text>{{tab.APOID}}</text>
					</p>
					<p>
						<!-- <span>信号强度：</span>
							<span class="z_qd"><i class="z_i1"></i> {{tab.IsLink?"在线":"离线"}}</span> -->
						<span class="z_jd">节点数：<text>{{tab.nodecount}}</text></span>
					</p>
				</div>
				<div :class="['z_wgR',tab.IsLink?'z_gR01':'z_gR02'] "></div>
			</div>

		</div>
		<div class="nodata" v-else>暂无数据！</div>
	</div>

</template>
<script>
	export default {

		data() {
			return {
				data1: {
					Data: {}
				},
				data2: {
					Data: {}
				},
				config: this.GLOBAL,
				haveData: true,
				scrollLeft: 0,
				tabIndex: 0,
				addBtnStyle: false,
				token: uni.getStorageSync("token"),
				index: 0
			}
		},
		onLoad: function(event) {
			// 获取项目列表
			this.getItemList();

		},
		onShow: function() {


		},
		onNavigationBarButtonTap(e) {
			//console.log(e)
			if (e.index === 1) {
				uni.setStorageSync("v_index", this.tabIndex);
				uni.navigateTo({
					url: '/pages/search/search?query=gateway'
				});

			} else if (e.index === 0) {
				this.addBtnStyle = !this.addBtnStyle;
			}
		},
		methods: {
			// 获取网关列表
			getList(id, index) {
				this.tabIndex = index;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetAPList',
					'GET', 
					{
						token: this.token,
						PageIndex: 1,
						PageSize: 99999,
						condition: this.$store.state.GWsearchData || '',
						ProjectManagement_ID: id
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1 && res.data.Data.data.length > 0) {
							this.haveData = true;
							this.data2 = res.data
							this.$store.state.GWsearchData = '';
						} else {
							this.haveData = false;
						}
					}
				)
				
			},
			// 去详情页
			goDetail(detail) {
				uni.navigateTo({
					url: '/pages/gatewayDetail/gatewayDetail?query=' + encodeURIComponent(JSON.stringify(detail)),
				});
			},
			// 添加网关
			addGW() {
				uni.navigateTo({
					url: '/pages/addGWDetail/addGWDetail?ID=' + this.data1.Data[this.tabIndex].ID
				});
			},
			// 扫码添加网关
			RichScanGW() {
				uni.navigateTo({
					url: '/pages/RichScanGW/RichScanGW?query=addGWDetail&ID=' + this.data1.Data[this.tabIndex].ID
				});
			},

			// 项目横向列表
			getItemList() {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetProjectGroup',
					'GET', 
					{
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							this.data1 = res.data;
							let v_index = uni.getStorageSync("v_index") || 0;
							this.getList(this.data1.Data[v_index].ID, v_index)
						} 
					}
				)
			}
		}
	}
</script>
<style>
	page {
		background-color: #FFFFFF;
		height: 100%;
		font-size: 11px;
		line-height: 1.8;
	}

	.uni-tab-bar {
		display: flex;
		flex: 1;
		flex-direction: column;
		overflow: hidden;
		height: 100%;
	}

	.uni-tab-bar .list {
		width: 750upx;
		height: calc(100% - 100upx);
		margin-top: 100upx;
	}

	.uni-swiper-tab {
		width: 100%;
		white-space: nowrap;
		line-height: 100upx;
		height: 100upx;
		border-bottom: 1px solid #c8c7cc;
		position: fixed;
		background: #FFFFFF;
		z-index: 999;
		top: var(--window-top);
		left: 0;
	}

	.swiper-tab-list {
		font-size: 30upx;
		width: 150upx;
		display: inline-block;
		text-align: center;
		color: #555;
	}

	.uni-tab-bar .active {
		color: #007AFF;
	}

	.uni-tab-bar .swiper-box {
		flex: 1;
		width: 100%;
		height: calc(100% - 100upx);
		overflow: scroll;
	}

	.uni-tab-bar-loading {
		text-align: center;
		padding: 20upx 0;
		font-size: 14px;
		color: #CCCCCC;
	}

	.z_gw .active {
		color: #2e7fdb;
	}

	.v_z_he {
		position: absolute;
		z-index: 9999;
		top: 0upx;
		width: 300upx;
		height: 200upx;
	}

	.z_he {
		position: sticky;
		background-size: cover;
		padding-top: 20upx;
	}

	.z_he li {
		border: 0 none;
	}

	.z_he li:first-child {
		margin-top: 0;
	}
	.z_wgC{width:400upx;}
	.z_wgC p{font-size: 26upx;}
	.z_wgR{height:50upx;line-height: 50upx;width:132upx;font-size: 26upx;margin-top:0;}
</style>
