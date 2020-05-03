
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
			status="状态"
		>
		<!-- 状态： 已预约，待使用，可预约，使用中 -->
			<pagoda-cell title="办公室" value="1" />
			<pagoda-cell title="预约日期" value="2020" />
			<!-- 可预约状态下，右边显示当前时间段 -->
			<pagoda-cell title="预约时间" value="查看" is-link @click="showPopup('show')"/>
			<pagoda-cell title="座位号" value="2" />
		</pagoda-panel>

		<!-- 待使用，使用中显示倒计时 -->
		<!-- 若预约时间区间不连续，倒计时以哪个为准 -->
		<div class="countdown">
			<div class="title">使用时间还剩</div>
			<div class="time">
				<pagoda-count-down :time="time" />
			</div>
		</div>

		<!-- 查询要限定时间范围 -->
		<!-- 扫码查询时，时间限定在当前 -->
		<div class="bottomBtn">
			<!-- 可预约 -->
			<pagoda-button type="primary" block square>预约</pagoda-button>
			<!-- 已预约 -->
			<pagoda-button type="primary" block square>查看可预约时间</pagoda-button>
			<!-- 待使用 -->
			<pagoda-button type="primary" block square>使用</pagoda-button>
			<!-- 使用中 -->
			<pagoda-button type="primary" block square>续时</pagoda-button>
		</div>

		<pagoda-popup
      v-model="showTime"
      class="bookPopup">
			<div v-show="list.length">
				<pagoda-checkbox-group v-model="seatTime" ref="checkboxGroup">
					<pagoda-cell-group>
						<pagoda-cell
							v-for="(item, index) in list"
							clickable
							:key="item"
							:title="`${item}`"
							@click="toggle(index)"
						>
						<template #right-icon v-if="cellClickable">
							<pagoda-checkbox :name="item" ref="checkboxes" />
						</template>
						</pagoda-cell>
					</pagoda-cell-group>
				</pagoda-checkbox-group>
			</div>
			<div v-show="!list.length">暂无数据</div>
		</pagoda-popup>
	</section>
</template>
<script>
// 座位详情页
export default {
	data () {
		return {
			showTime: false,
			seatTime: [],
			cellClickable: false,
			list: [
				'9:00 - 11:00',
				'15:00-  17:00',
				'19:00 - 21:00'
			],
			seatStatus: '',
			time: 60 * 60 * 1000
		}
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