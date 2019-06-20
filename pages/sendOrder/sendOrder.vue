<template>
	<div class="main bg">
		<div class="fp_ok" v-if="bOk">
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						维护人员：
					</view>
					<view class="uni-list-cell-db" v-if="bOk">
						<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
							<view class="uni-input">{{array[index].name}}</view>
						</picker>
					</view>
					<text class="right_arr"></text>
				</view>
			</view>
			<div class="clearFix f_comn" @tap="calendar();">
				<span class="f_txtL">预计完成时间：</span>
				<p class="f_txtR">{{nowTimer?nowTimer:'年/月/日'}}</p>
				<i></i>
			</div>
			<div class="z_tex">
				<p class="mark">工作内容：</p>
				<textarea maxlength="200"  class="txt" v-model="workTxt" /></textarea>
			</div>
			<div class="z_tex">
				<p class="mark">备注：</p>
				<textarea maxlength="200"  class="txt" v-model="marker" /></textarea>
			</div>
			<div class="f_btn">
				<div class="z_btn" @tap="addOrder()">确 认</div>
			</div>
		</div>
		<view class="calendar-content" v-else>
			<view class="calendar-mask" @click="closeMask">
				<view class="calendar-box" @click.stop="">
					<uni-calendar :lunar="tags[0].checked" :fixed-heihgt="tags[1].checked" :slide="slide" :disable-before="tags[6].checked"
					 :start-date="startDate" :end-date="endDate" :date="date" @change="change" @to-click="toClick" />
					<view class="calendar-button-groups">
						<button class="calendar-button-confirm calend_btn" @click="confirm">确认</button>
					</view>
				</view>
			</view>
		</view>
	</div>
</template>
<script>
	import uniCalendar from '@/components/uni-calendar/uni-calendar.vue'
	export default {
		components: {
			uniCalendar
		},
		data() {
			function getDate(date, AddDayCount = 0) {
				if (typeof date !== 'object') {
					date = date.replace(/-/g, '/')
				}
				let dd = new Date(date)
				dd.setMonth(dd.getMonth() + AddDayCount) // 获取AddDayCount天后的日期
				let y = dd.getFullYear()
				let m = dd.getMonth() + 1 < 10 ? '0' + (dd.getMonth() + 1) : dd.getMonth() + 1 // 获取当前月份的日期，不足10补0
				let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate() // 获取当前几号，不足10补0
				return y + '-' + m + '-' + d
			}
			let tags = [{
					id: 0,
					name: '农历',
					checked: false,
					attr: 'lunar'
				},
				{
					id: 1,
					name: '固定高度',
					checked: false,
					attr: 'fixedHeihgt'
				},
				{
					id: 2,
					name: '垂直滚动',
					checked: false,
					attr: 'vertical'
				},
				{
					id: 3,
					name: '水平滚动',
					checked: false,
					attr: 'horizontal'
				},
				{
					id: 4,
					name: '开始日期(' + getDate(new Date(), -1) + ')',
					checked: false,
					value: getDate(new Date(), -1),
					attr: 'startDate'
				},
				{
					id: 5,
					name: '结束日期(' + getDate(new Date(), 2) + ')',
					value: getDate(new Date(), 2),
					checked: false,
					attr: 'endDate'
				},
				{
					id: 6,
					name: '禁用今天之前的日期',
					checked: true,
					attr: 'disableBefore'
				},
				{
					id: 7,
					name: '自定义当前日期(' + getDate(new Date(), 1) + ')',
					value: getDate(new Date(), 1),
					checked: false,
					attr: 'date'
				}
			]
			return {
				array: [{
					name: '',
					ID: ''
				}],
				index: 0,
				nowTimer: '',
				bOk: true,
				tags,
				slide: 'none',
				date: '',
				startDate: '',
				endDate: '',
				timeData: {},
				NodeID: '',
				Type: '',
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				workTxt: '',
				marker: '',
				UserName: '',
				UserId: ''
			}
		},
		computed: {

		},
		onLoad(event) {
			this.nowTimer = event.timer;
			this.NodeID = event.NodeID;
			this.Type = event.Type;
			//获取用户列表
			this.getUser()
		},
		methods: {
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
				//console.log(this.array[this.index].ID)

			},
			calendar() {
				//日历
				this.bOk = false;
			},
			change(e) {
				//console.log('change 返回:', e.fulldate)
				this.timeData = e
				this.nowTimer = e.fulldate;
			},
			toClick(e) {
				//console.log('点击事件', e.fulldate)
				this.timeData = e
				this.nowTimer = e.fulldate;
			},
			confirm() {
				this.bOk = true;
			},
			getUser() {
				var that = this;
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetUsers',
					'GET', {
						token: this.token
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							var d = res.data.Data;
							let arr = [];
							for (var i = 0; i < d.length; i++) {
								arr.push({
									name: d[i].Username,
									ID: d[i].ID
								});
							}
							that.array = arr;
							that.bOk = true;
						}
					}
				)

			},
			addOrder() {
				var that = this;
				var info = {};
				info.NodeID = that.NodeID;
				info.Prescription = that.nowTimer;
				info.State = 3;
				info.Reason = that.workTxt;
				info.Descr = that.marker;
				this.UserName = this.array[this.index].name
				this.UserId = this.array[this.index].ID
				info.UserName = that.UserName;
				info.UserId = that.UserId;
				if(!this.nowTimer){
					uni.showToast({
						title: '请选择日期',
						icon: "none"
					});
					return;
				}else if(!this.workTxt){
					uni.showToast({
						title: '请填写工作内容',
						icon: "none"
					});
					return;
				}
				
				//console.log(info);
				this.GLOBAL.ajax(
					this.config.apiUrl + 'AddSendOrder',
					'POST', {
						token: this.token,
						info: JSON.stringify(info)
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.showModal({
								content: "操作成功",
								confirmText: "确定",
								cancelColor: '#999',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.reLaunch({
											url: '/pages/workOrder/workOrder'
										});
									}
								}
							})
						}else if(res.data.Code == 2){
							uni.showModal({
								content: "操作失败，"+res.data.Message,
								confirmText: "确定",
								cancelColor: '#999',
								showCancel: false,
								success(res) {
									if (res.confirm) {
										uni.reLaunch({
											url: '/pages/workOrder/workOrder'
										});
									}
								}
							})
						}
					}
				)
			}
		}
	}
</script>
<style>
	/* .uni-list-cell{border-bottom: 1px solid #eaeff3;} */
	.uni-list-cell-left {
		marign-left: 15upx;
	}

	.uni-input {
		color: #8C8C8C;
	}

	page {
		display: flex;
		flex-direction: column;
		box-sizing: border-box;
		background-color: #fff
	}

	view {
		font-size: 28upx;
		line-height: inherit
	}

	.example {
		padding: 0 30upx 30upx
	}

	.example-title {
		font-size: 32upx;
		line-height: 32upx;
		color: #777;
		margin: 40upx 25upx;
		position: relative
	}

	.example .example-title {
		margin: 40upx 0
	}

	.example-body {
		padding: 0 40upx
	}

	page {
		background: #fff;
	}

	.calendar-content {
		padding: 20upx 0;
		padding-bottom: 60upx;
		font-size: 26upx;
	}

	.calendar-content>.calendar-title {
		line-height: 80upx;
		/* font-weight: bold; */
		color: #666;
		font-size: 32upx;
		/* border-left: 2px #0d9ebb solid; */
		/* padding-left: 20upx; */
		margin: 0 20upx;
	}

	.calendar-tags-group {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		margin: 0 10upx;
	}

	.calendar-tags {
		width: 50%;
		box-sizing: border-box;
	}

	.calendar-tags-item {
		padding: 10upx 20upx;
		border: 1px rgba(0, 0, 0, 0.2) solid;
		color: #333;
		border-radius: 10upx;
		text-align: center;
		margin: 10upx;
		background: #f8f8f8;
	}

	.calendar-tags-item:active {
		background: #f8f8f8;
	}

	.checked .calendar-tags-item {
		background: rgb(0, 122, 255);
		color: #fff;
		border: 1px rgba(0, 0, 0, 0.1) solid;
	}

	.calendar-button {
		margin: 10upx 20upx;
	}

	.calendar-info {
		padding: 0 20upx;
	}

	.calendar-mask {
		position: fixed;
		/* #ifdef H5 */
		top: 45px;
		/* #endif */
		/* #ifndef H5 */
		top: 0;
		/* #endif */
		bottom: 0;
		display: flex;
		align-items: center;
		width: 100%;
		background: rgba(0, 0, 0, 0.4);
	}

	.calendar-box {
		/* margin: 20upx; */
		border: 1px #f5f5f5 solid;
		/* border-radius: 10upx; */
		width: 100%;
		height: 100%;
		overflow: hidden;
		background: #fff;
	}

	.calendar-button-groups {
		position: absolute;
		width: 100%;
		bottom: 0;
		display: flex;
	}

	.calendar-button-confirm {
		width: 50%;
		margin: 10upx;
		border: 1px #eee solid;
		font-size: 32upx;
	}

	.calendar-button-confirm:after {
		border: none;
	}
</style>
