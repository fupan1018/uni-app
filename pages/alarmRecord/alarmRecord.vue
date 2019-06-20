<template>
	<div class="main">
		<div class="z_bjt">
			<a href="javascript:;">
				<div class="z_bjtL"><img v-bind:src="nodeList.ImgUrl?nodeList.ImgUrl:defualtImg" /></div>
				<div class="z_bjtR">
					<p class="z_bj01">
						<span>节点名称：</span>
						<span>{{nodeList.Name}}</span>
					</p>
					<p class="z_bj02">
						<span>节点编号：</span>
						<span class="z_bj03">{{nodeList.NodeOID}}</span>
					</p>
					<p class="z_bj02">
						<span>节点分组：</span>
						<span>{{nodeList.CfGroupName}}</span>
					</p>
				</div>
			</a>
		</div>
		<div class="z_jl">
			<h2><i></i>报警记录</h2>
			<div class="record_box" v-if="bOk">
				<div class="z_jlA clearFix" v-for="(item, index) in recordArr">
					<div class="z_jlAL"></div>
					<div class="z_jlAR">
						<p class="z_AR01">{{config.convertTime(item.UpdateTime)}}</p>
						<p class="z_AR02">{{item.Descr?item.Descr:'暂无'}}</p>
					</div>
				</div>
			</div>
			<div class="nodata" v-else>暂无数据！</div>
		</div>
	</div>
</template>
<script>
	export default {
		data() {
			return {
				bOk: false,
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				recordArr: [],
				nodeList: {},
				defualtImg: 'static/images/products/img01.png'
			}
		},
		computed: {

		},
		onLoad: function(event) {
			this.getAlarmRecord(event.nodeid);
		},
		methods: {
			getAlarmRecord(nodeid) {
				uni.showLoading({
					title: 'loading'
				});
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'AlarmLogList',
					'GET', {
						token: this.token,
						ID: nodeid
					},
					(res) => {
						console.log(res)
						if (res.data.Code == 1) {
							var d = res.data.Data;
							that.nodeList = d.node;
							if (d.nodelist && d.nodelist.length > 0) {
								that.bOk = true;
								that.recordArr = d.nodelist;
							} else {
								that.bOk = false;
							}
						}
						uni.hideLoading();
					}
				)

			}
		}
	}
</script>
<style>
	page {
		background: #eaeff3;
	}
	.z_bjtR .z_bj03{font-size: 26upx;}
	.z_jlA{padding: 0; }
	.z_jlAL{margin: 20upx 0 20upx 50upx;}
	.z_jlAR .z_AR01,.z_jlAR .z_AR02{line-height: 60upx;margin-top: 0;font-size: 26upx;}
</style>
