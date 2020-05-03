<template>
  <pagoda-nav-bar
    :title="title"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  >
    <template #left>
      <pagoda-icon name="arrow-left" size="25" v-show="leftShow ==='home'">
        <span class="left-slot-text">主页</span>
      </pagoda-icon>
			<pagoda-icon name="scan" size="25" v-show="leftShow==='scan'" />
    </template>
    <template #right>
      <pagoda-icon name="orders-o" v-show="rightShow === 'record'" size="25" />
    </template>
  </pagoda-nav-bar>
</template>
<script>
export default {
  name: "topBar",
  data() {
    return {};
  },
	props: {
		leftShow: {
			type: String,
			default: 'scan'
    },
    rightShow: {
      type: String,
			default: 'record'
    },
    title: {
      type: String,
      default: '选座系统'
    },
    onClickRight: {
      type: Function,
      default: function () {}
    },
    onClickLeft: {
      type: Function,
      default: function () {}
    }
	},
  methods: {
    // onClickLeft() {
    //   // Toast('返回');
    // },
    // onClickRight() {
    //   // Toast('按钮');
    // }
  }
};
</script>
<style lang="scss" scoped>
  .left-slot-text{
    font-size: 18px;
    vertical-align: top;
  }
</style>