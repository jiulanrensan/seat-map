<template>
  <div class="home">
    <topBar 
      leftShow=""
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
        :value="fieldStartTimeValue"
        label="起始时间"
        placeholder="点击预约时间"
        @click="handleShowPicker('showStartTimePicker')"
      />
      <pagoda-field
        readonly
        clickable
        name="datetimePicker"
        :value="fieldEndTimeValue"
        label="结束时间"
        :error-message="errorMessage"
        placeholder="点击预约时间"
        @click="handleShowPicker('showEndTimePicker')"
      />
      <pagoda-field v-model="fieldTextValue" label="备注" placeholder="请输入备注" />
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
        <!-- min_hours有bug -->
        <pagoda-datetime-picker
          v-show="showStartTimePicker || showEndTimePicker"
          v-model="currentTime"
          type="time"
          :min-hour="setMinHour()"
          :max-hour="24"
          :min-minute="0"
          :max-minute="59"
          @confirm="onConfirm"
          @cancel="handleCancelPicker('showTimePicker')"
        />
        <pagoda-picker
          v-show="showRoomPicker"
          v-model="cuurentRoom"
          show-toolbar
          title="办公区域"
          :columns="areaNameList"
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

    <!-- 已选信息 -->
    <pagoda-panel 
     title="座位已预约信息" 
     desc="" 
     :status="`座位号：${seatData[selectedSeat - 1] ? seatData[selectedSeat - 1].seat_no : ''}`"
     class="seatDetail">
      <pagoda-cell-group>
        <pagoda-cell
          v-for="(item, index) in detailList"
          clickable
          :key="index"
          :title="item.reserve_start.split(' ')[0]"
          :label="`${item.reserve_start.split(' ')[1]} - ${item.reserve_end.split(' ')[1]}`"
          :value="item.user_name"
        >
        </pagoda-cell>
      </pagoda-cell-group>
      <div v-show="!detailList.length" class="bookInfo">暂无预约信息</div>
    </pagoda-panel>
    <!-- 底部确认 -->
    <div class="btn">
      <pagoda-button
        type="primary"
        square 
        block
        :disabled="!submitable"
        @click="handleSubmit"
      >
        提交预约
      </pagoda-button>
    </div>
    
  </div>
</template>

<script>
// import {getSpecialDate, formatDate} from '@/utils/utils'
import mixins from '@/global/mixins'
export default {
  name: 'Home',
  mixins: [mixins],
  data () {
    return {
      fieldDateValue: '',
      fieldStartTimeValue: '',
      fieldEndTimeValue: '',
      fieldRoomValue: '',
      fieldTextValue: '',
      showPicker: false,
      showDatePicker: false,
      showStartTimePicker: false,
      showEndTimePicker: false,
      showRoomPicker: false,
      minDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
      maxDate: this.$utils.getSpecialDate(7),
      currentDate: '',
      currentTime: '',
      cuurentRoom: '',
      errorMessage: '',
      areaNameList: [],
      otherSelect: [],
      beforeBook: false,
      detailList: [],
      selectedSeat: '',
      seatData: []
    }
  },
  created () {
    this.initField()
    setTimeout(() => {
      this.getSeatMap()
    }, 500);
  },
  computed: {
    submitable () {
      return this.errorMessage === '' && this.seatData[this.selectedSeat - 1] && this.seatData[this.selectedSeat - 1].current_seat_status === 'RESERVABLE'
    }
  },
  watch: {
    showPicker (val) {
      // console.log(val)
      if (!val) {
        setTimeout(() => {
          this.showDatePicker = this.showStartTimePicker = this.showRoomPicker = this.showEndTimePicker = val
        }, 300);
      }
    },
    fieldEndTimeValue (val){
      const end = Number(val.replace(':', ''))
      const start = Number(this.fieldStartTimeValue.replace(':', ''))
      this.errorMessage = start >= end ? '结束时间不能小于起始时间' : ''
    },
    selectedSeat (val) {
      this.getSeatDetail(val)
    }
  },
  methods: {
    initField () {
      // 初始化数据
      // 日期
      this.fieldDateValue = this.$utils.formatDate(new Date())

      // 开始，结束时间
      let hours = new Date().getHours()
      this.fieldStartTimeValue = `${hours < 10 ? `0${hours}` : hours}:00`
      this.fieldEndTimeValue = `${hours+2 < 10 ? `0${hours+2}` : hours+2}:00`

      // 办公区域
      this.fieldRoomValue = '宏愿室'

      // 初始化办公区域列表
      this.areaNameList = this.areaList.map(el => {return el.area_name})
    },
    // 请求座位数据，初始化座位图
    async getSeatMap () {
      // 格式化参数
      let idx = this.areaNameList.indexOf(this.fieldRoomValue)
      try {
        const res = await this.getData(this.$api.searchAllInfo, {
          "user_id": this.user_id,
          "area_id": this.areaList[idx].id,
          // bug: 22:00之后报错？
          // "date_from": "2020-05-01 10:00:00",
          // "date_to": "2020-05-01 11:30:00"
          "date_from": `${this.fieldDateValue} ${this.fieldStartTimeValue}:00`,
          "date_to": `${this.fieldDateValue} ${this.fieldEndTimeValue > 24 ? 24 : this.fieldEndTimeValue}:00`
        })
        this.seatData = res.data.data
      } catch (error) {
        console.log(error)
      }
    },
    // 获取座位详情
    async getSeatDetail (val) {
      try {
        // http://wiki.pagoda.com.cn/pages/viewpage.action?pageId=12095963
        // 接口只能查当天的座位详情
        const res = await this.getData(this.$api.seatDetail, {
          "user_id": this.user_id,
          "seat_id": val,
          "reserve_date": this.fieldDateValue
        })
        this.detailList = res.data.data.reservations_all
        // console.log(this.detailList)
      } catch (error) {
        console.log(error)
      }
    },
    setMinHour () {
      return new Date(this.fieldDateValue).getDate() > new Date().getDate() ? 
        0 :
        new Date().getHours()
    },
    onConfirm(val) {
      console.log(val)
      let type = '';
      ['Date', 'StartTime', 'EndTime', 'Room'].forEach(el => {
        if (this[`show${el}Picker`]) {
          type = `field${el}Value`
        }
      })
      this._setPickerValue(type, val)
      this.showPicker = false;
      this.getSeatMap()
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
      // this.$router.push({path: `seat-detail/${this.selectedSeat}/undefined`})
      this.$router.push({name: 'SeatDetail', query: {seat_id: this.selectedSeat}})
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
    async handleSubmit () {
      try {
        const res = await this.getData(this.$api.book, {
          "user_id": this.user_id,
          "seat_id": this.selectedSeat,
          // "reserve_start":"2020-05-05 10:00:00",
          // "reserve_end":"2020-05-05 12:00:00",
          // bug
          "reserve_start": `${this.fieldDateValue} ${this.fieldStartTimeValue}:00`,
          "reserve_end": `${this.fieldDateValue} ${this.fieldEndTimeValue}:00`,
          "purpose": this.fieldTextValue
        })
        if (res.data.code === 0) {
          this.$toast.success('提交成功！');
          setTimeout(() => {
            // this.$router.push({path: `seat-detail/${this.selectedSeat}/undefined`})
            this.$router.push({name: 'SeatDetail', query: {seat_id: this.selectedSeat}})
          }, 1000);
        } else {
          this.$toast.fail(`提交失败！${res.data.message}`);
          // 重新请求数据
          setTimeout(() => {
            this.getSeatMap()
          }, 1000);
        }
      } catch (error) {
        console.log(error)
        this.$toast.fail('提交失败！请重新提交');
      }
    },
    _setPickerValue (type, val) {
      if (type === 'fieldDateValue') {
        this[type] = this.$utils.formatDate(+val)
      } else {
        this[type] = val
      }
    }
  }
}
</script>
<style lang="scss" scoped>
  // $controlBgColor: #F8F8F8;
  // $normalBgColor: #F5F5F5;
  .home{
    height: 100vh;
    overflow-y: auto;
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
    // background-color: $controlBgColor;
  }
  .btn{
    position: fixed;
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
  .seatDetail{
    padding-bottom: 60px;
  }
  .bookInfo{
    padding: 40px 0;
    text-align: center;
    color: rgba(69, 90, 100, 0.6);
  }
</style>