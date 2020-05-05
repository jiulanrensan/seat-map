
<template>
	<section class="detail">
		<topBar 
			title="座位详情"
			leftShow="home"
			rightShow="none"
			:onClickLeft="onClickLeft">
		</topBar>
		<pagoda-panel 
			title="" 
			desc="" 
			:status="`${currentInfo.reserve_status !== '' ? reserveStatus[currentInfo.reserve_status] : '暂无数据'}`"
		>
		<!-- 状态： 已预约，待使用，可预约，使用中, 已使用 -->
			<pagoda-cell title="办公区域" :value="`${currentInfo.area_name ? currentInfo.area_name : '暂无数据'}`" />
			<pagoda-cell title="预约日期" :value="currentInfo.date" />
			<!-- 可预约状态下，右边显示当前时间段 -->
			<pagoda-cell title="预约时间" :value="currentInfo.time" />
			<pagoda-cell title="座位号" :value="currentInfo.seat_no" />
			<pagoda-cell title="备注" :value="currentInfo.purpose" />
		</pagoda-panel>

		<!-- 待使用，使用中显示倒计时 -->
		<div class="countdown" v-if="currentInfo.reserve_status === 0 || currentInfo.reserve_status === 3">
			<!-- currentInfo.reserve_status === 0 ? 使用时间还剩 -->
			<div class="title">{{setCownDownTitle(currentInfo.reserve_status)}}</div>
			<div class="time">
				<pagoda-count-down :time="setCownDownTime(currentInfo.reserve_status)" />
			</div>
		</div>

		<!-- 查询要限定时间范围 -->
		<!-- 扫码查询时，时间限定在当前 -->
		<div class="bottomBtn">
			<!-- 可预约 -->
			<!-- 扫码不是自己预约的座位 -->
			<!-- <pagoda-button type="primary" block square>预约</pagoda-button> -->
			<!-- 已预约 -->
			<!-- <pagoda-button type="primary" block square>查看可预约时间</pagoda-button> -->
			<template v-if="currentInfo.reserve_status === 0">
				<!-- 待使用 -->
				<pagoda-button type="primary" block square @click="handleUse">使用</pagoda-button>
				<pagoda-button type="danger" block square @click="handleCancel(1)">取消预约</pagoda-button>
			</template>
			<template v-if="currentInfo.reserve_status === 3">
				<!-- 使用中 -->
				<pagoda-button type="primary" block square @click="handleCancel(2)">结束使用</pagoda-button>
			</template>
			
			<!-- <pagoda-button type="primary" block square>续时</pagoda-button> -->
		</div>
	</section>
</template>
<script>
import mixins from '@/global/mixins'
// 座位详情页
export default {
	mixins: [mixins],
	data () {
		return {
			showTime: false,
			seatTime: [],
			cellClickable: false,
			currentInfo: {},
			time: 0
		}
	},
	created () {
		console.log(this.$route.params)
		const {seatId, reserveId} = this.$route.params
		this.getSeatDetail(seatId, reserveId)
	},
	methods: {
		setCownDownTitle (status) {
			return status === 3 ? `使用时间还剩` : `距离可使用还有`
		},
		setCownDownTime () {
			// 返回当前时间距离指定时间的毫秒数
			// 距离开始使用、距离结束使用
			// 状态为已预约且当前时间已过开始使用时间，targetTime应为结束时间
			const {reserve_start: start, reserve_end: end} = this.currentInfo
			const time = +new Date(start) - +new Date()
			console.log(time)
			return time > 0 ? 
				time :
				+new Date(end) - +new Date()
		},
		onClickLeft () {
      this.$router.push({name: 'Home'})
		},
		async getSeatDetail (seatId, reserveId) {
			try {
				const params = Object.assign({"user_id": this.user_id}, reserveId === undefined ? 
				{"seat_id": Number(seatId)} : {"reserve_id": Number(reserveId)})
				const res = await this.getData(this.$api.seatDetail, params)
				const data = res.data.data
				const detail = data.current_reservation ? data.current_reservation : {
					"id": '',
					"purpose": '',
					"reserve_end": '',
					"reserve_start": '',
					"reserve_status": '', 
					"seat_id": '',
					"seat_no": ''
				}
				detail.date = detail.reserve_start ? detail.reserve_start.split(' ')[0] : '暂无数据'
				detail.time = detail.reserve_start ? `${detail.reserve_start.split(' ')[1]} - ${detail.reserve_end.split(' ')[1]}` : '暂无数据'
				this.currentInfo = detail
				console.log(this.currentInfo)
			} catch (error) {
				console.log(error)
			}
		},
		async handleUse () {
			try {
				const res = await this.getData(this.$api.confirm, {
					"user_id": this.user_id,
					"reserve_id": this.currentInfo.id
				})
				if (res.data.code === 0) {
					this.$toast.success('提交成功！');
					// 确认之后刷新本页
					this.getSeatDetail(this.$route.params.seatId)
				} else {
					this.$toast.fail('提交失败！请重新提交');
				}
			} catch (error) {
				console.log(error)
			}
		},
		// 和handleUse类似，可以合并成一个函数
		async handleCancel (type) {
			try {
				const res = await this.getData(this.$api.cancel, {
					"user_id": this.user_id,
					"reserve_id": this.currentInfo.id,
					"cancel_type": type
				})
				if (res.data.code === 0) {
					this.$toast.success('提交成功！');
					// 确认之后返回主页
					this.$router.push({name: 'Home'})
				} else {
					this.$toast.fail('提交失败！请重新提交');
				}
			} catch (error) {
				console.log(error)
			}
		}
	}
}
</script>
<style lang="scss" scoped>
.detail{
	height:100vh;
  overflow-y: auto;
  background-color: #fafafa;
	position: relative;
	box-sizing: border-box;
	color: rgba(69, 90, 100, 0.6);
}
	.bookPopup{
    width: 80%;
    height: 60%;
    padding: 10px;
  }
	.countdown{
		padding: 16px 20px;
		text-align: center;
		.time{
			margin-top: 10px;
			.pagoda-count-down{
				font-size: 20px;
			}
		}
	}
	.bottomBtn{
		position: absolute;
		bottom: 0;
		width: 100%;
	}
</style>