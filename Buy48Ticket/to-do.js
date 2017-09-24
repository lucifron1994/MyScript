// ==UserScript==
// @name         Buy48TicketJL
// @namespace    https://github.com/lucifron1994/Buy48Ticket
// @version      1.0
// @description  Buy48TicketJL Version
// @author       lucifron
// @match        https://shop.48.cn/tickets/item/*
// @grant        none
// ==/UserScript==

$(function() {
    'use strict';

    console.info('开始JS脚本');

    var _num = 1;
    var _seattype = 2;  // 2V 3普 4站

    var _addUrl = "/TOrder/add";
    var _id = location.pathname.split('/tickets/item/')[1];

    var _beijingTime = 0;

    function _loop(){
        setTimeout(function(){tickets();},5000);
    }

    function tickets(){

        var __id =_id;
        var __checkUrl = "/TOrder/tickCheck";
        layer.msg(__checkUrl);

        $.ajax({
            url: __checkUrl,
            type: "GET",
            dataType: "json",
            data: { id: __id,r: Math.random() },
            success: function (result) {
                console.info(result.Message);
                
                if (result.HasError) {
                    _loop();
                }
                else
                {
                    switch(result.ErrorCode)
                    {
                        case "success":
                            window.location.href = result.ReturnObject;
                            break;
                        case "fail":
                            layer.msg(result.Message);
                            _retryCheckSaleList();
                            break;
                        default:
                            _loop();
                    }

                }
            },
            error: function (e) {
                _loop();

            }
        });
    }

    function _checkSaleList(){
        var _curl = "/tickets/saleList";
        $.ajax({
            url: _curl,
            type: "GET",
            dataType : "json",
            data: { id:_id, brand_id:$('body script').text().match(/brand_id:(\d+)/)[1] },

            success: function (result) {
                var _vamount = result[1]['amount'];
                var _vseattype = result[1]['seat_type']; //Type = 2 Vip
                var _isOnsale = result[1]['tickets_sale_is_on_sale'];

                console.info('V last amount: ' + _vamount + 'Type: ' + _vseattype);
                if (_vamount > 0) {
                    //
                    init();
                }else{
                    _retryCheckSaleList();
                }
            },
            error: function (e) {
                console.info(e);
            }
        });
    }

    function _retryCheckSaleList(){
        setTimeout(function(){tickets();},2000);
    }



    function init(){
        console.info('/TOrder/add');

        $.ajax({
            url: _addUrl,
            type: "post",
            dataType: "json",
            data: { id: _id, num: _num, seattype:_seattype, brand_id:$('body script').text().match(/brand_id:(\d+)/)[1], r: Math.random() },
            success: function (result) {
                if (result.HasError) {
                    console.info('/TOrder/add Failed' + result.Message);
                    layer.msg(result.Message);

                    _retryCheckSaleList();
                }
                else {
                    if(result.Message =="success")
                    {
                        window.location.href = result.ReturnObject;
                    }else
                    {
                        setTimeout(function(){tickets();},2000);
                    }
                }
            },
            error: function (e) {
                layer.msg("/TOrder/add Error");
            }
        });
    }

    function _timeCheck(){
        var currentTS = new Date().getTime();
        //console.info(currentTS + '  ' + _beijingTime);
        if (currentTS >= _beijingTime) {
            console.info('Current/Predict Time: ' + currentTS + '  ' + _beijingTime);
            init();
        }else{
            setTimeout(function(){_timeCheck();},30);
        }
    }

    _checkSaleList();
});
