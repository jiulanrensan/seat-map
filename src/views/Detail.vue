
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
			<pagoda-cell title="办公室" :value="`${currentInfo.id ? currentInfo.id : '暂无数据'}`" />
			<pagoda-cell title="预约日期" :value="currentInfo.date" />
			<!-- 可预约状态下，右边显示当前时间段 -->
			<pagoda-cell title="预约时间" :value="currentInfo.time" />
			<pagoda-cell title="座位号" :value="$route.params.seatId" />
		</pagoda-panel>

		<!-- 待使用，使用中显示倒计时 -->
		<div class="countdown" v-show="currentInfo.id">
			<div class="title">使用时间还剩</div>
			<div class="time">
				<pagoda-count-down :time="time" />
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
			time: 60 * 60 * 1000
		}
	},
	created () {
		this.getSeatDetail(this.$route.params.seatId)
	},
	methods: {
		onClickLeft () {
      this.$router.push({name: 'Home'})
		},
		toggle (index) {
			if (this.cellClickable) {
				this.$refs.checkboxes[index].toggle();
			}
		},
		showPopup (type) {
			// type: show,select
			this.showTime = true
			this.cellClickable = type === 'select'
		},
		async getSeatDetail (seatId) {
			try {
				const res = await this.getData(this.$api.seatDetail, {
					"user_id": this.user_id,
					"seat_id": Number(seatId)
				})
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
					// 确认之后刷新本页
					this.getSeatDetail(this.$route.params.seatId)
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