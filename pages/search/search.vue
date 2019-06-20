<template>
	<view></view>
</template>

<script>
	export default {
		data() {
			return {
				pageName: '',
				searchVal: '',
				url: ''
			}
		},
		onLoad(event) {
			// 获取地址栏传送参数
			this.pageName = event.query;
			//console.log(this.pageName);
		},
		onNavigationBarSearchInputChanged(e) {
			this.searchVal = e.text;
		},
		onNavigationBarButtonTap(e) {
			this.$store.state.GWsearchData = this.searchVal;
			this.url = '/pages/' + this.pageName + '/' + this.pageName;
			if (e.index === 0) {
				uni.reLaunch({
					url: this.url
				});

			}
		},
		methods: {

		}
	}
</script>

<style>

</style>
