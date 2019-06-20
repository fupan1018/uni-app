<template>
	<view class="main bg">
		<!-- <div class="head">
			华亮网关
			<span class="headL"><a href="wg.html"><img src="images/products/h04.png" /></a></span>
		</div> -->
		<div class="z_tjd">
			<p>
				<span class="z_tj01">编号：</span>
				<span class="z_tj02"><input maxlength="30"  type="text" disabled :value="infoData.Data.APOID" /></span>
			</p>
			<p>
				<span class="z_tj01">类型：</span>
				<span :class="['z_tj02', 'v_edit',editStyle ? 'active' : '']"><input maxlength="30"  type="text" :disabled="!editStyle ? 'disabled' : false"
					 v-model="modelList.APType" /></span>
			</p>
			<p>
				<span class="z_tj01">型号：</span>
				<span :class="['z_tj02', 'v_edit',editStyle ? 'active' : '']"><input maxlength="30"  type="text" :disabled="!editStyle ? 'disabled' : false"
					 v-model="modelList.APModel" /></span>
			</p>
			<p class="z_p1">
				<span class="z_tj01">位置：</span>
				<span class="z_tj02"><input maxlength="30"  disabled type="text" :value="infoData.Data.MapX+','+infoData.Data.MapY" /></span>
			</p>
			<view class="uni-list">
				<view class="uni-list-cell">
					<view class="uni-list-cell-left">
						联网方式
					</view>
					<view class="uni-list-cell-db">
						<picker @change="bindPickerChange" :value="index" :range="array" range-key="name">
							<view class="uni-input">{{array[index].name}}</view>
						</picker>
					</view>
				</view>
			</view>
			<!-- <p class="z_p1">
				<span class="z_tj01">物联方式：</span>
				<span class="z_tj02">
					<select :value="infoData.Data.NetWork">
					   <option value="4G">4G</option>
					   <option value="3G">3G</option>
					</select>
				</span>
			</p> -->
			<p>
				<span class="z_tj01">物联卡号：</span>
				<span class="z_tj02"><input maxlength="30"  disabled type="text" placeholder="物联卡号" /></span>
			</p>
			<p>
				<span class="z_tj01">物联套餐：</span>
				<span class="z_tj02"><input maxlength="30"  disabled type="text" placeholder="物联套餐" /></span>
			</p>
		</div>
		<div class="z_btnA">
			<span class="z_btnL" v-if="!editStyle" @tap="edit()">编 辑</span>
			<span class="z_btnL" v-if="editStyle" @tap="save()">保 存</span>
			<span class="z_btnR" @tap="DeleteApModel()">删 除</span>
		</div>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				// 父页面携带参数
				banner: {},
				// 标题
				topTitle: '',
				// 详情
				infoData: {
					Data: {}
				},
				config: this.GLOBAL,
				token: uni.getStorageSync("token"),
				// 编辑状态
				editStyle: false,
				// 网络
				array: [{
					name: '4G'
				}, {
					name: '3G'
				}],
				index: 0,
				// 绑定数据
				modelList: {
					APType: '',
					APModel: ''
				}
			}
		},
		onLoad(event) {
			if (event.query) {
				try {
					this.banner = JSON.parse(decodeURIComponent(event.query));
				} catch (error) {
					this.banner = JSON.parse(event.query);
				}
			} else if (event.ID) {
				this.banner = event.ID;
			}

			//console.log(this.banner);
			// 设置标题
			this.topTitle = this.banner.Name;
			this.setText()
			// 获取详情
			this.getInfo(this.banner.ID);
		},
		methods: {
			// 获取父页面传递的参数
			setText() {
				this.hasSetText = !this.hasSetText;
				uni.setNavigationBarTitle({
					title: this.topTitle
				})
			},
			// 用ID获取详情
			getInfo(id) {
				this.GLOBAL.ajax(
					this.config.apiUrl + 'GetApModel',
					'GET', {
						token: this.token,
						ID: id
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							this.infoData = res.data;
							this.modelList.APType = res.data.Data.APType;
							this.modelList.APModel = res.data.Data.APModel;
							//console.log(this.infoData);
							// 上网方式
							this.getline(this.infoData.Data.NetWork)
						}
					}
				)

			},
			// input可编辑状态
			edit() {
				this.editStyle = true;
			},
			// 保存网关
			save() {
				if(!this.infoData.APType||!this.infoData.APModel||!this.infoData.PhoneNumber||!this.infoData.Flow){
					uni.showToast({
						title: '请填写完整信息再试',
						icon: "none"
					});
					return;
				}
				//console.log(this.banner);
				this.editStyle = false;
				let Name = this.banner.Name;
				let APType = this.modelList.APType;
				let APModel = this.modelList.APModel;
				let NetWork = this.banner.NetWork;
				let Descr = this.banner.Descr || '';
				let ID = this.banner.ID;
				var info = {};
				info.ID = ID;
				info.Name = Name;
				info.Descr = Descr;
				info.APType = APType;
				info.APModel = APModel;
				info.NetWork = NetWork;
				//console.log(info);
				this.GLOBAL.ajax(
					this.config.apiUrl + 'AddAP',
					'POST', {
						token: this.token,
						info: JSON.stringify(info)
					},
					(res) => {
						//console.log(res)
						if (res.data.Code == 1) {
							uni.showToast({
								title: '操作成功！'
							});
							uni.reLaunch({
								url: '/pages/gateway/gateway'
							});
						}
					}
				)

			},
			bindPickerChange: function(e) {
				//console.log('picker发送选择改变，携带值为：' + e.target.value)
				this.index = e.target.value
			},
			// 回显上网方式
			getline(data) {
				//console.log(data)
				const _this = this;
				this.array.forEach(function(i, v) {
					//console.log(i, v);
					if (i.name === data) {
						_this.index = v;
						//console.log(v);
						return;
					}
				})
			},
			// 删除网关
			DeleteApModel() {
				uni.showModal({
					title: "删除网关",
					content: "你确定删除网关吗？",
					confirmText: "确定",
					cancelText: "取消",
					success: (confirm, cancel) => {
						if (confirm.confirm) {
							this.GLOBAL.ajax(
								this.config.apiUrl + 'DeleteApModel',
								'GET', {
									token: this.token,
									ID: this.banner.ID
								},
								(res) => {
									//console.log(res)
									if (res.data.Code == 1) {
										uni.showToast({
											title: '操作成功！'
										});
										uni.reLaunch({
											url: '/pages/gateway/gateway'
										});
									}
								}
							)

						}
					}
				})

			}
		}
	}
</script>

<style>
	.z_btnA view {
		width: 135px;
		height: 40px;
		line-height: 40px;
		text-align: center;
		display: block;
		float: left;
		font-size: 14px;
		border-radius: 2px;
	}

	.main {
		height: 100%;
		position: absolute;
	}
</style>
