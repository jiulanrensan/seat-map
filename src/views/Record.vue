<template>
  <div class="record">
    <topBar 
      title="我的预约记录"
      leftShow="home"
      rightShow="none"
      :onClickLeft="onClickLeft">
    </topBar>
    <!-- dataList -->
    <!-- list上拉加载，下拉刷新 -->
    <pagoda-pull-refresh v-model="refreshing" @refresh="onRefresh">
    
      <pagoda-list
        v-model="loading"
        :finished="finished"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- <pagoda-cell v-for="item in list" :key="item" :title="item" /> -->
        <div class="panel">
          <pagoda-panel 
            title="" 
            desc="" 
            :status="formatStatus(item.reserve_status)"
            v-for="(item,index) in bookList"
            :key="index"
          >
          <!-- bug： 没区域信息 -->
            <pagoda-cell title="区域" :value="item.area_name" />
            <pagoda-cell title="预约日期" :value="item.date" />
            <pagoda-cell title="预约时间" :value="item.time" />
            <pagoda-cell title="座位号" :value="item.seat_no" />
            <pagoda-cell title="备注" :value="item.purpose" />
          </pagoda-panel>
        </div>
      </pagoda-list>
      <!-- <div v-show="!bookList.length">暂无数据</div> -->
    </pagoda-pull-refresh>
  </div>
</template>

<script>
import mixins from '@/global/mixins'
export default {
  name: 'Record',
  mixins: [mixins],
  data () {
    return {
      bookList: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false,
      page_num: 1,
			page_size: 10,
    }
  },
  methods: {
    findArea (id) {
      const idx = this.areaList.findIndex(el => el.area_id === id)
      console.log(this.areaList)
      console.log(idx)
      return idx
    },
    onClickLeft () {
      this.$router.push({name: 'Home'})
    },
    async onLoad() {
      if (this.refreshing) {
          this.bookList = []
          this.refreshing = false;
        }
      try {
        // debugger
        const res = await this.getData(this.$api.searchMyInfo, {
          "user_id": this.user_id,
          "page_num": this.page_num,
          "page_size": this.page_size
        })
        res.data.data.forEach(el => {
          el.date = el.reserve_start.split(' ')[0]
          el.time = `${el.reserve_start.split(' ')[1]} - ${el.reserve_end.split(' ')[1]}`
        })
        this.bookList.push(...res.data.data)
        // 加载状态结束
        this.loading = false;
        if (!res.data.data.length) {
          this.finished = true
        } else {
          this.page_num += 1
        }
      } catch (error) {
        console.log(error)
      }
    },
    onRefresh() {
      this.page_num = 1
      this.page_size = 10
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    },
    formatStatus (status) {
      return this.reserveStatus[status]
    }
  }
}
</script>

<style lang="scss" scoped>
.record{
  height:100vh;
  padding-top: 46px;
  overflow-y: auto;
  background-color: #fafafa;
  text-align: left;
  // padding-top: 46px;
  box-sizing: border-box;
  .panel{
    padding: 10px 0;
  }
  .pagoda-panel{
    margin: 10px 0;
  }
}

</style>
