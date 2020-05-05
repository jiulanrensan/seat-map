<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  data () {
    return {
      currentUrl: '',
      ticket: '',
      userInfo: '',
      token: '',
    }
  },
  async created () {
    const { origin, pathname, hash, search } = location
    const searchObj = this.$utils.splitUniqueWords(search)
    this.currentUrl = origin + pathname + hash + '?' + searchObj.searchStr
    this.ticket = searchObj.words
    if (sessionStorage.flag === 'true' && !this.ticket) {
      // 后端登录接口
      this.userInfo = JSON.parse(localStorage.userInfo)
      // console.log(this.userInfo)
      try {
        const res = await this.getData(this.$api.login, {
          oaid: this.userInfo.oaid[0],
          user_name: this.userInfo.employeeName[0]
        })
        // console.log(res)
        const {token, user_id} = res.data.data
        localStorage.setItem('token', token)
        localStorage.setItem('userId', user_id)
      } catch (error) {
        console.log(error)
      }
    } else {
      if (this.ticket) {
        this.authUser()
      } else {
        console.log('login',this.ticket)
        this.loginUser()
      }
    }
  },
  methods: {
    authUser () {
      let query = `?${this.ticket}`
      query += `&format=json&service=${this.currentUrl}`
      this.$HTTP.get(`http://cas.kt3.pagoda.com.cn/p3/serviceValidate${query}`)
        .then(res => {
          console.log(res)
          if (res.data.serviceResponse) {
            this.userInfo = res.data.serviceResponse.authenticationSuccess.attributes
            // const username = userInfo.employeeName[0]
            localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
            sessionStorage.setItem('flag', 'true')
            window.location.replace(location.origin + location.pathname)
          } else {
            // 重新进行单点登录
            this.loginUser()
          } 
        })
    },
    loginUser () {
      // 进行单点登录
      setTimeout(() => {
        window.location.replace(`http://cas.kt3.pagoda.com.cn/cas2/login?service=${this.currentUrl}`)
      }, 200)
    },
    getData (api, params) {
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
  }
}
</script>

<style lang="scss">
html,body{
  margin: 0;
  padding: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  box-sizing: border-box;
  // tab-var固定在顶部
  padding-top: 46px;
}
</style>
