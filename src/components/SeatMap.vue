<template>
  <section :style="{width: mapWidth+'px',height: mapHeight+'px'}">
		<div class="info">
			<div>可预约</div>
			<div>已预约</div>
			<div>已选择</div>
		</div>
		<div class="map" :style="{'pointer-events': clickable ? '' : 'none'}">
			<div v-for="(item,index) in seatData" :key="index">
				<input 
					type="radio" 
					:id="item.id" 
					name="seat" 
					:disabled="!item.free"
					:value="item.id"
					v-model="selectedMap">
				<label :for="item.id">{{index}}</label>
			</div>
		</div>
	</section>
</template>
<script>
export default {
  name: "SeatMap",
  data() {
    return {
			selectedMap: '',
			seatSelected: '#F7534F',
			seatFree: '#F8F8F8',
		};
	},
	props: {
		mapWidth: {
			type: String,
			default: '500'
		},
		mapHeight: {
			type: String,
			default: '500'
		},
		seatNum: {
			type: Number,
			default: 10
		},
		seatData: {
			type: Array,
			default: () => Array(30)
		},
		clickable: {
			type: Boolean,
			default: true
		}
	},
	watch: {
		selectedMap (val) {
			// console.log(val)
			this.$emit('select', val)
		}
	}
};
</script>
<style lang="scss" scoped>
	$seatSelected: #F7534F;
	$seatFree: #F8F8F8;
	$mySeat: #008C3C;
	$fontColor: rgba(69, 90, 100, 0.6);
	.info{
		display: flex;
		margin: 10px 0;
		color: $fontColor;
		div{
			margin-left: 10px;
			display: flex;
			&:before{
				content: '';
				display: block;
				width: 20px;
				height: 20px;
				margin-right: 5px;
				border: 1px solid rgba(0,0,0,0.1);
			}
			&:nth-child(1):before{
				background-color: $seatFree;
			}
			&:nth-child(2):before{
				background-color: $seatSelected;
			}
			&:nth-child(3):before{
				background-color: $mySeat;
			}
		}
	}
	.map{
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 30px;
		div{
			position: relative;
			box-sizing: border-box;
			// 宽高动态确定
			width: 50px;
			height: 50px;
			overflow: hidden;
			input{
				// visibility: hidden;
				opacity: 0;
				position: absolute;
				display: block;
				width: 100%;
				height: 100%;
				z-index: 2;
			}
			input[type="radio"]:checked + label{
				background-color: $mySeat;
				color: #fff;
			}
			input[type="radio"]:disabled + label{
				background-color: $seatSelected;
				color: #fff;
			}
			label{
				position: absolute;
				display: block;
				box-sizing: border-box;
				width: 70%;
				height: 70%;
				top: 15%;
				left: 15%;
				font-size: 20px;
				border-radius: 5px;
				text-align: center;
				box-shadow: 0 0 2px 1px rgba(0,0,0,0.2);
				background-color: $seatFree;
				&:after{
					content: '';
					display: block;
					width: 80%;
					height: 50%;
					border-radius: 5px;
					overflow: hidden;
					margin-top: -10px;
					position: absolute;
					left: 50%;
					transform: translateX(-50%);
					border-bottom: 5px solid #000;
					border-left: 5px solid #000;
					border-right: 5px solid #000;
				}
			}
			
		}
		
	}
</style>