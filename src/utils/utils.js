const utils = {
	// 获取日期
	getSpecialDate: function (offset) {
		return new Date(
			new Date().getFullYear(),
			new Date().getMonth(),
			new Date().getDate() + offset
		)
	},
	// 格式化日期
	formatDate: function (date, separator) {
		const time = new Date(date)
		const sep = separator ? separator : '-'
		let month = time.getMonth() + 1
		let day = time.getDate()
		month = month < 10 ? '0' + month : month
		day = day < 10 ? '0' + day : day
		return `${time.getFullYear()}${sep}${month}${sep}${day}`
	}
}

export default utils
