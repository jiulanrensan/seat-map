<template>
  <div class="home">
    <topBar 
      leftShow="scan"
      :onClickRight="onClickRight"
      :onClickLeft="onClickLeft">
    </topBar>
    <!-- form表单选择日期，选择时间 -->
    <!-- 时间选择 -->
    <!-- 选择规则弹窗提示 -->
    <div class="select">
      <pagoda-field
        readonly
        clickable
        name="datetimePicker"
        :value="fieldRoomValue"
        label="选择会议室"
        placeholder="点击选择"
        @click="handleShowPicker('showRoomPicker')"
      />
      <pagoda-field
        readonly
        clickable
        name="datetimePicker"
        type="date"
        :value="fieldDateValue"
        label="选择日期"
        placeholder="点击选择日期"
        @click="handleShowPicker('showDatePicker')"
      />
      <pagoda-field
        readonly
        clickable
        name="datetimePicker"
        :value="fieldTimeValue"
        label="预约时间"
        placeholder="点击预约时间"
        @click="handleShowPicker('showTimePicker')"
      />
      <pagoda-popup v-model="showPicker" position="bottom">
        <pagoda-datetime-picker
          v-show="showDatePicker"
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="onConfirm"
          @cancel="handleCancelPicker('showDatePicker')"
        />
        <pagoda-datetime-picker
          v-show="showTimePicker"
          v-model="currentTime"
          type="time"
          :min-hour="9"
          :max-hour="21"
          :min-minute="0"
          :max-minute="0"
          @confirm="onConfirm"
          @cancel="handleCancelPicker('showTimePicker')"
        />
        <pagoda-picker
          v-show="showRoomPicker"
          v-model="cuurentRoom"
          show-toolbar
          title="会议室"
          :columns="columns"
          @cancel="handleCancelPicker('showRoomPicker')"
          @confirm="onConfirm"
        />
      </pagoda-popup>
      
    </div>
    <div class="rule" @click="showRule">
      <pagoda-icon name="question-o" size="25" color="#999999"/>
      <span>选座规则</span>
    </div>
    <!-- 颜色说明 -->
    <!-- canvas -->
    <div class="seatMap">
      <SeatMap @select="select" :seatData="seatData"></SeatMap>
    </div>
    <!-- 底部确认 -->
    <div class="btn">
      <pagoda-button
        type="primary"
        square 
        block
        @click="handleBook"
      >
        已选好座位
      </pagoda-button>
    </div>
    <!-- :style="{width: '80%'}" -->
    <pagoda-popup
      v-model="beforeBook"
      class="bookPopup">
      <div class="info">
        <pagoda-panel 
          title="已选座位信息" 
          desc="" 
          status=""
        >
          <pagoda-cell title="办公室" :value="fieldRoomValue" />
          <pagoda-cell title="预约日期" :value="fieldDateValue" />
          <pagoda-cell title="预约时间" :value="fieldTimeValue" />
          <pagoda-cell title="座位号" :value="selectedSeat" />
        </pagoda-panel>
        <div class="otherSeat">
          <div class="title">此座位的其余可预约时间</div>
          <div class="btn">
            <pagoda-button type="primary" size="mini" @click="checkAll">全选</pagoda-button>
            <pagoda-button type="info" size="mini" @click="toggleAll">反选</pagoda-button>
          </div>
          <pagoda-checkbox-group v-model="otherSelect" ref="checkboxGroup">
            <pagoda-cell-group>
              <pagoda-cell
                v-for="(item, index) in list"
                clickable
                :key="item"
                :title="`复选框 ${item}`"
                @click="toggle(index)"
              >
              <template #right-icon>
                <pagoda-checkbox :name="item" ref="checkboxes" />
              </template>
              </pagoda-cell>
            </pagoda-cell-group>
          </pagoda-checkbox-group>
        </div>
      </div>
      <div class="bottomBtn">
        <pagoda-button size="small" @click="cancelBook">取消</pagoda-button>
        <pagoda-button type="primary" size="small" @click="handleSumbit">确认提交</pagoda-button>
      </div>
    </pagoda-popup>
    
  </div>
</template>

<script>
import {getSpecialDate, formatDate} from '@/utils/utils'
export default {
  name: 'Home',
  data () {
    return {
      fieldDateValue: '',
      fieldTimeValue: '',
      fieldRoomValue: '会议室1',
      showPicker: false,
      showDatePicker: false,
      showTimePicker: false,
      showRoomPicker: false,
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      maxDate: getSpecialDate(7),
      currentDate: '',
      currentTime: '',
      cuurentRoom: '',
      columns: ['会议室1'],
      otherSelect: [],
      beforeBook: false,
      list: ['a', 'b', 'c', 'd'],
      selectedSeat: '',
      seatData: Array.from({length: 30}, (item,index) => {
        return {
          id: index+1,
          free: index % 2 === 0,
        }
      })
    }
  },
  created () {
    // 初始化数据
    this.fieldDateValue = formatDate(new Date())
    this.fieldTimeValue = `${new Date().getHours()}:00`
  },
  watch: {
    showPicker (val) {
      // console.log(val)
      if (!val) {
        setTimeout(() => {
          this.showDatePicker = this.showTimePicker = this.showRoomPicker = val
        }, 300);
      }
    }
  },
  methods: {
    onConfirm(val) {
      let type = '';
      ['Date', 'Time', 'Room'].forEach(el => {
        if (this[`show${el}Picker`]) {
          type = `field${el}Value`
        }
      })
      this._setPickerValue(type, val)
      this.showPicker = false;
    },
    handleShowPicker (type) {
      this.showPicker = true
      this[type] = true
    },
    handleCancelPicker (type) {
      console.log(type)
      this.showPicker = false
      this[type] = false
    },
    formatter(type, val) {
      if (type === 'year') {
        return `${val}年`;
      } else if (type === 'month') {
        return `${val}月`
      } else {
        return `${val}日`
      }
      
    },
    onClickRight () {
      this.$router.push({name: 'Record'})
    },
    onClickLeft () {
      // 扫码接口
      // 暂时跳转到座位详情页
      this.$router.push({name: 'SeatDetail'})
    },
    showRule () {
      this.$dialog.alert({
        title: '选座规则',
        message: '弹窗内容',
      });
    },
    select (val) {
      console.log('home',val)
      this.selectedSeat = val
    },
    handleBook () {
      this.beforeBook = true
    },
    toggle(index) {
      this.$refs.checkboxes[index].toggle();
    },
    checkAll() {
      this.$refs.checkboxGroup.toggleAll(true);
    },
    toggleAll() {
      this.$refs.checkboxGroup.toggleAll();
    },
    cancelBook () {
      this.beforeBook = false
    },
    handleSumbit () {
      this.beforeBook = false
    },
    _setPickerValue (type, val) {
      if (type === 'fieldDateValue') {
        this[type] = formatDate(+val)
      } else if (type === 'fieldTimeValue') {
        this[type] = `${val} - ${Number(val.split(':')[0])+2}:00`
      } else {
        this[type] = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  .home{
    height: 100vh;
    overflow-y: hidden;
    background-color: #fafafa;
    position: relative;
  }
  .rule{
    padding: 5px;
    text-align: left;
    display: flex;
    justify-content: flex-start;
    span{
      margin-left: 5px;
      font-size: 18px;
      color: #999999;
    }
  }
  .seatMap{
    width: 100%;
    height: 50vh;
    overflow: auto;
    margin: 20px 0;
  }
  .btn{
    position: absolute;
    bottom: 0;
    z-index: 5;
    width: 100%;
  }
  .bookPopup{
    width: 80%;
    height: 60%;
    padding: 10px;
    box-sizing: border-box;
    // position: relative;
    .info{
      height: 90%;
      overflow-y: auto;
    }
  }
  .otherSeat{
    .title{
      padding: 20px 16px;
      color: rgba(69, 90, 100, 0.6);
    }
    .btn{
      position: relative;
      box-sizing: border-box;
      padding: 10px 16px;
    }
  }
  .bottomBtn{
    // position: absolute;
    // bottom: 0;
    padding: 10px 0;
    width: 100%;
    height: 10%;
    text-align: center;
    button{
      margin: 0 10px;
    }
  }
</style>