<template>
	<div class="main bg">
		<view v-if="bOk">
			<div class="z_porder">
				<p>
					<span class="z_pan011">设备ID：</span>
					<span class="z_pan044">{{nodeDetail.NodeOID}}</span>
				</p>
				<p>
					<span class="z_pan011">设备名称：</span>
					<span class="z_pan044">{{nodeDetail.Name}}</span>
				</p>
				<p>
					<span class="z_pan011">灯杆号：</span>
					<span class="z_pan044">{{nodeDetail.Lamp_post}}</span>
				</p>
				<p class="z_pom">
					<span class="z_pan011">设备位置：</span>
					<span class="z_pan044">{{nodeDetail.map}}</span>
				</p>
				<p class="z_pom" v-show="bool">
					<span class="z_pan011">报警类型：</span>
					<span class="z_pan044 red">{{nodeDetail.EventName}}</span>
				</p>
				<p v-show="bool">
					<span class="z_pan011">报警时间：</span>
					<span class="z_pan044">{{config.convertTime(nodeDetail.LastDataUpdateTime)}}</span>
				</p>
				<div class="clearFix f_comn" @tap="calendar();">
					<span class="f_txtL">维修完成时间：</span>
					<p class="f_txtR">{{nowTimer?nowTimer:'年/月/日'}}</p>
					<i></i>
				</div>
				<div class="gd_cont">
					<span class="z_pan011">工单内容：</span>
					<div class="gd_txt">{{nodeDetail.Reason?nodeDetail.Reason:'暂无'}}</div>
				</div>

				<div class="z_tex gd_area clearFix">
					<div class="z_texL1">处理结果：</div>
					<div class="z_texC1">
						<textarea maxlength="200" v-model="textarea"/></textarea>
					</div>
				</div>
				<div class="ylImg z_tex v_z_tex" v-if="imageList.length>0">
					<div class="z_texL1 v_z_texL1">上传图片：</div>
					<div class="z_texC1 v_z_texC1">
						<image v-for="(src, index) in imageList" @tap="ylImg" :key="index" :src="src"></image>
					</div>

				</div>
			</div>

			<div class="z_but f_but">
				<span class="z_butL" @tap="uploadImg()"><img src="static/images/products/y1.png" /> 上传图片</span>
				<span v-if="bOk2" class="z_butR" @tap="startRecord()"><img src="static/images/products/y2.png" />开始语音</span>
				<span v-else class="z_butR" @tap="uploadRecord()"><img src="static/images/products/y2.png" />上传语音</span>
			</div>

			<div class="z_but01">
				<span class="z_butL01" @tap="UpdateSendOrderState">终止工单</span>
				<span class="z_butR01" @tap="AddOrderFeedBack">完 成</span>
			</div>
		</view>
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
					checked: false,
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
				imageList: [],
				bOk: true,
				bOk2:true,
				voicePath: '',
				type: 0,
				textarea:'',
				bool: true,
				nodeid: '',
				nodeDetail: {},
				recorderManager: {},
				innerAudioContext: {},
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				nowTimer: '',
				tags,
				startDate: '',
				endDate: '',
				date: '',
				slide: 'none',
			}
		},
		computed: {

		},
		onLoad(event) {
			// 初始化
			this.recorderManager = uni.getRecorderManager();
			this.innerAudioContext = uni.createInnerAudioContext();
			this.innerAudioContext.autoplay = true;

			let self = this;
			if (this.recorderManager) {
				this.recorderManager.onStop(function(res) {
					//console.log('recorder stop' + JSON.stringify(res));
					self.voicePath = res.tempFilePath;
				});
			}
			this.nodeid = event.query;
			// 初始化详情
			this.FindModel();
			// 获取地址栏传送参数
			this.type = event.flag;
			if (this.type == 0) {
				var titleTxt = "报警维护";
				this.bool = true;
			} else {
				var titleTxt = "日常维护";
				this.bool = false;
			}
			uni.setNavigationBarTitle({
				title: titleTxt
			})
		},
		methods: {
			uploadImg() {
				//上传图片
				uni.chooseImage({
					success: (res) => {
						if (this.imageList.length == 5) {
							uni.showToast({
								title: "图片最多上传5张",
								icon: "none"
							});
							return;
						}
						this.imageList = this.imageList.concat(res.tempFilePaths);


					}
				})
			},
			startRecord() {
				//开始语音
				this.bOk2 = false;
				this.recorderManager.start();
			},
			uploadRecord() {
				//上传语音
				this.bOk2 = true;
				//结束录音
				this.recorderManager.stop();
				if (this.voicePath) {
					//获取音频路径
					//console.log(this.voicePath)
					uni.showToast({
						title: "完成语音录制，再次点击“开始语音”可重新录制"
					});
					//innerAudioContext.src = this.voicePath;
				}
			},
			// 获取工单详情
			FindModel() {
				this.GLOBAL.ajax(
					this.GLOBAL.apiUrl + 'FindModel',
					'GET', {
						token: this.token,
						Id: this.nodeid
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							this.nodeDetail = res.data.Data;
						}
					}
				)
			},
			// 提交录音、图片、处理结果(必传)
			AddOrderFeedBack() {
				if(!this.nowTimer){
					uni.showToast({
						title: '请选择日期',
						icon: "none"
					});
					return;
				}else if(!this.textarea){
					uni.showToast({
						title: '处理结果不能为空',
						icon: "none"
					});
					return;
				}else if(this.imageList.length<1||this.voicePath==''){
					uni.showToast({
						title: "图片、语音必传",
						icon: "none"
					});
					return;
				}
				uni.showLoading({
					title: 'loading'
				});
				let imgs = this.imageList.map((value, index) => {
					return {
						name: "image" + index,
						uri: value
					}
				});
				
				imgs.push({
					name: "video",
					uri: this.voicePath
				})
				//console.log(JSON.stringify(imgs));
				uni.uploadFile({
					url: this.config.apiUrl + 'AddOrderFeedBack',
					files: imgs,
					formData: {
						token: this.token,
						info: JSON.stringify({
							OrderID: this.nodeid,
							CompleteTime: this.nowTimer, 
							Descr: this.textarea
						})
					},
					header: {
						"Content-Type": "multipart/form-data"
					},
					success: (res) => {
						//console.log(res);
						res.data = JSON.parse(res.data)
						if(res.data.Code ==1){
							uni.hideLoading();
							uni.showToast({
								title: res.data.Message,
								image: ""
							});
							uni.reLaunch({
								url: '/pages/workOrder/workOrder'
							});
							
						}else{
							uni.showToast({
								title: '操作失败',
								image: "../../static/images/bgImages/error.png"
							});
						}
						
					},
					fail: (err) => {
						uni.showToast({
							title: err.errMsg,
							image: "../../static/images/bgImages/error.png"
						});
						uni.hideLoading();
					}
				})
			},
			// 预览图片
			ylImg() {
				// 预览图片
				uni.previewImage({
					urls: this.imageList,
					longPressActions: {
						success: function(res) {

						},
						fail: function(res) {
							//console.log(res.errMsg);
						}
					}
				});
			},
			// 终止工单
			UpdateSendOrderState() {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'UpdateSendOrderState',
					'GET', {
						token: this.token,
						state: 5,
						ID: this.nodeid
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.showToast({
								title: res.data.Message
							});
							uni.reLaunch({
								url: '/pages/workOrder/workOrder'
							});
						}
					}
				)
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
		}
	}
</script>
<style>
	page {
		background: #eaeff3;
	}

	.ylImg image {
		width: 80upx;
		height: 80upx;
	}

	.v_z_tex {
		height: 120upx;
	}

	.v_z_texL1 {
		line-height: 120upx;
		margin-top: 0;
	}

	.v_z_texC1 image {
		margin-top: 20upx;
		margin-right: 4upx;
	}
	.f_comn .f_txtR{width:180upx;}

</style>
