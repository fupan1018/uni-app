<template>
	<div class="main">
		<div class="g_gd">
			<div class="fmhead">
				<ul>
					<li :class="['fm',tabIndex==index?'active':'']" v-for="(item, index) in navArr" @tap="orderList(index)">
						<p >{{item}}</p>
					</li>
				</ul>
			</div>
		</div>
		<div class="z_gd show" v-if="bOk">
			<div class="z_order f_order" @tap="orderDetail(item)" v-for="(item,index) in alarmArr">
				<p>
					<span class="z_oL"><img src="static/images/products/gd.png" />设备编号：</span>
					<span class="z_oR">{{item.CfNodeAll.NodeOID}}</span>
				</p>
				<p>
					<span class="z_oL">状态：</span>
					<span :class="['z_oR','z_pa']">{{orderState(item.State)}}</span>
				</p>
			</div>
		</div>
		<div class="nodata" style="top:120upx;" v-else>暂无数据！</div>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				navArr: ['报警工单', '日常维护'],
				tabIndex: 0,
				bOk: false,
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				alarmArr: [],
				GWsearchData: this.$store.state.GWsearchData
			}
		},
		computed: {

		},
		onLoad: function() {
			this.orderList(0);
		},
		onNavigationBarButtonTap(e) {
			//console.log(e)
			if (e.index === 0) {
				uni.navigateTo({
					url: '/pages/search/search?query=workOrder'
				});
			}
		},
		methods: {
			orderState(flag) {
				var orderTxt = ''
				switch (flag) {
					case 0:
						orderTxt = '工单确认中';
						break;
					case 1:
						orderTxt = '工单拒接';
						break;
					case 2:
						orderTxt = '工单超时';
						break;
					case 3:
						orderTxt = '进行中';
						break;
					case 4:
						orderTxt = '调整申请中';
						break;
					case 5:
						orderTxt = '终止';
						break;
					case 6:
						orderTxt = '完成';
						break;
				}
				return orderTxt;
			},
			orderList(index) {
				this.tabIndex = index;
				if (index == 1) {
					//日常维护
					var type = 0;
				} else {
					//报警维护
					var type = 1;
				}
				var that = this;
				uni.showLoading({
					title: 'loading'
				});
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetPageList_SendOrder',
					'GET', {
						token: this.token,
						type: type,
						condition: that.GWsearchData
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							if (res.data.Data.length > 0) {
								that.bOk = true;
								that.alarmArr = res.data.Data;
							} else {
								that.bOk = false;
							}
						}
						
					}
				)

			},
			orderDetail(item) {
				uni.navigateTo({
					url: '/pages/alarmMaintain/alarmMaintain?query=' + item.ID + '&flag=' + this.tabIndex
				})
			}
		}
	}
</script>
<style>

</style>
