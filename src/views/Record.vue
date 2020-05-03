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
            status="状态"
            v-for="(item,index) in list"
            :key="index"
          >
            <pagoda-cell title="办公室" :value="item.room" />
            <pagoda-cell title="预约日期" :value="item.date" />
            <pagoda-cell title="预约时间" :value="item.time" />
            <pagoda-cell title="备注信息" value="" />
          </pagoda-panel>
        </div>
      </pagoda-list>
      <div v-show="!list.length">暂无数据</div>
    </pagoda-pull-refresh>
  </div>
</template>

<script>
export default {
  name: 'Record',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      refreshing: false
    }
  },
  methods: {
    onClickLeft () {
      this.$router.push({name: 'Home'})
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      this.loading = false;
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push({
            room: `会议室1`,
            date: `2020-05-02`,
            time: `19:00-21:00`
          });
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 20) {
          this.finished = true;
        }
      }, 1000);
      
    },
    onRefresh() {
      // 清空列表数据
      // this.list.length = 0
      this.finished = false;
      // 重新加载数据
      // 将 loading 设置为 true，表示处于加载状态
      this.loading = true;
      this.onLoad();
    }
  }
}
</script>

<style lang="scss" scoped>
.record{
  height:100vh;
  overflow-y: auto;
  background-color: #fafafa;
  text-align: left;
  .panel{
    padding: 10px 0;
  }
  .pagoda-panel{
    margin: 10px 0;
  }
}

</style>
