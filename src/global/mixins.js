// "reserve_status":
//'预约状态：0-已预约，1-用户取消预约，2-系统取消预约，3-座位使用中'

// "current_seat_status"
// 可预约 RESERVABLE、已预约 RESERVED、使用中 USING
export default {
	data () {
		return {
			areaList: [
				{id: 1, area_name: '宏愿室'},
				{id: 2, area_name: '义利室'},
				{id: 3, area_name: '前台办公区域'}
			],
			reserveStatus: ['已预约', '用户取消预约', '系统取消预约', '座位使用中', '结束使用', '完成使用'],
			user_id: 1
		}
	},
	created () {
		this.user_id = localStorage.userId
	},
	methods: {
		// 请求方法
		getData: function (api, params) {
			return new Promise((resolve, reject) => {
				this.$HTTP.post(api, params)
					.then(res => {
						resolve(res)
					})
					.catch(err => {
						reject(err)
					})
			})
		}
	},
	watch: {

	}
}