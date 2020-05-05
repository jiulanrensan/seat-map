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
	},
	splitUniqueWords: function (searchStr, words = 'ticket') {
		if (!searchStr) {
			return {
			searchStr: '',
			words: ''
			}
		}
		const arr = searchStr.slice(1).split('&')
		const newArr = []
		let uniqueWords = ''
		arr.forEach(item => {
			if (item.indexOf(words) === 0) {
			uniqueWords = item
			} else {
			newArr.push(item)
			}
		})
		return {
			searchStr: newArr.join('&'),
			words: uniqueWords
		}
	}
}

export default utils
