<template>
	<div class="main bg">
		<div class="z_gw">
			<scroll-view id="tab-bar" class="uni-swiper-tab" scroll-x="true" @scroll="scroll">
				<view :class="['swiper-tab-list',tabIndex==index ? 'active' : '']" @tap="alarmList(item,index)" v-for="(item, index) in projectArr">{{item.Name}}</view>
			</scroll-view>
		</div>
		<div class="z_bjM" v-if="bOk">
			<div class="z_bjMa" v-for="(item, index) in alarmArr">
				<div class="z_st clearFix">
					<div class="z_stL">{{item.Name}}</div>
					<div class="z_stR">{{config.convertTime(item.LastDataUpdateTime)}}</div>
				</div>
				<div class="z_sb clearFix">
					<div class="f_sbR" @tap="goAlarmDetail(item.NodeID,item.Name)">
						<div class="z_sbL"><img v-bind:src="item.ImgUrl?item.ImgUrl:defualtImg" /></div>
						<div class="z_sbC">
							<p>
								<span>分组名称：</span>
								<span>{{item.groupName}}</span>
							</p>
							<p>
								<span>报警原因：</span>
								<span class="z_red">{{item.alarmName}}</span>
							</p>
						</div>
					</div>

					<div class="z_sbR" @tap="goAlarmRecord(item.NodeID)">
						<p><img src="static/images/products/jl.png" /></p>
						<p><a href="javascript:;">报警记录</a></p>
					</div>
				</div>
			</div>
		</div>
		<div class="nodata" v-else>暂无数据！</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				tabIndex: 0,
				scrollTop: 0,
				old: {
					scrollTop: 0
				},
				projectArr: [],
				alarmArr: [],
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				bOk: false,
				defualtImg: 'static/images/products/img01.png',
				GWsearchData: this.$store.state.GWsearchData
			}
		},
		computed: {

		},
		mounted: function() {
			this.getProjectName();
		},
		onNavigationBarButtonTap(e) {
			//console.log(e)
			if (e.index === 0) {
				uni.navigateTo({
					url: '/pages/search/search?query=alarm'
				});
				uni.setStorage({
					key: 'flagIndex',
					data: this.tabIndex
				});
			}
		},
		methods: {
			scroll: function(e) {
				this.old.scrollTop = e.detail.scrollTop
			},
			alarmList(item, index) {
				var that = this;
				that.tabIndex = index;
				uni.showLoading({
					title: 'loading'
				});
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetAlarmMessage',
					'GET', {
						token: this.token,
						projectID: item.ID,
						condition: that.GWsearchData
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							if (res.data.Data.length > 0) {
								that.bOk = true;
								that.alarmArr = res.data.Data;
								//console.log(that.alarmArr);
							} else {
								that.bOk = false;
							}
						}
						that.GWsearchData = '';
						uni.setStorage({
							key: 'flagIndex',
							data: ''
						});
						uni.hideLoading();
					}
				)

			},
			getProjectName() {
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetProject',
					'GET', {
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							that.projectArr = res.data.Data;
							var flag = uni.getStorageSync('flagIndex');
							if (flag) {
								that.tabIndex = flag;
							} else {
								flag = 0;
							}
							that.alarmList(that.projectArr[flag], flag);
						}
					}
				)

			},
			goAlarmDetail(nodeid,name) {
				uni.navigateTo({
					url: '/pages/deviceDetail/deviceDetail?nodeid=' + nodeid+'&name='+name
				})
			},
			goAlarmRecord(nodeid) {
				uni.navigateTo({
					url: '/pages/alarmRecord/alarmRecord?nodeid=' + nodeid
				})
			}
		}
	}
</script>
<style>
	.swiper-tab-list {
		font-size: 30upx;
		width: 150upx;
		display: inline-block;
		text-align: center;
		color: #555;
	}

	.uni-swiper-tab .active {
		color: #277ce6;
	}
	.z_st .z_stR{font-size: 24upx;}
	.z_sbC p span{font-size: 26upx;}
</style>
