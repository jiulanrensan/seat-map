const apiUrl = {
    // 查询所有预约数据
    // post
    searchAllInfo: `/api/list_reservations`,

    // 查询我的预约数据
    // post
    searchMyInfo: `/api/list_my_reservations`,

    // 获取座位预约详情
    // post
    seatDetail: `/api/get_seat_reservation`,

    // 取消预约/结束使用
    // post
    cancel: `/api/cancel_reservation`,

    // 确认使用座位
    // post
    confirm: `/api/confirm_reservation`,

    // 预定座位
    // post
    book: `/api/reserve_seat`,

    // 登录
    // post
    login: `/api/login`
}
export default apiUrl