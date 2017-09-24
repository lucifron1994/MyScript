// ==UserScript==
// @name         Buy 48Ticket
// @namespace    https://github.com/
// @version      2.1
// @description  公演抢票
// @author       lucifron
// @match        https://shop.48.cn/tickets/item/*
// @grant        none
// ==/UserScript==

$(function() {
    'use strict';
    var _startTime = new Date().getTime();
    var _dayNum = parseInt(_startTime / (3600 * 24 * 1000));
    var _offset = -100; //时间差100ms
    var _beijingTime = _dayNum * 3600 * 24 *1000 + 12 * 3600 * 1000 + _offset; //东8区，慢8小时

    var _num = 1;
    var _seattype = 2;  // 2V 3普 4站
    var _repeatTime = 5000;

    var _addUrl = "/TOrder/add";
    var _id = location.pathname.split('/tickets/item/')[1];


    function _loop(){
        setTimeout(function(){tickets();},_repeatTime);
    }

    function tickets(){
        layer.msg('/TOrder/tickCheck');

        var __id =_id;
        var __checkUrl = "/TOrder/tickCheck";

        $.ajax({
            url: __checkUrl,
            type: "GET",
            dataType: "json",
            data: { id: __id,r: Math.random() },
            success: function (result) {
                if (result.HasError) {
                    layer.msg(result.Message);
                    console.info(result.Message);
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


    function init(){
        console.info('调用 /TOrder/add');

        $.ajax({
            url: _addUrl,
            type: "post",
            dataType: "json",
            data: { id: _id, num: _num, seattype:_seattype, brand_id:$('body script').text().match(/brand_id:(\d+)/)[1], r: Math.random() },
            success: function (result) {
                if (result.HasError) {
                    //失败操作
                    layer.msg(result.Message);
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
                layer.msg("调用 /TOrder/add Error");
            }
        });
    }

    function _timeCheck(){
        var currentTS = new Date().getTime();
        
        console.info(currentTS + '  ' + _beijingTime);

        if (currentTS >= _beijingTime) {
            init();
        }else{
            setTimeout(function(){_timeCheck();},100);
        }
    }

    _timeCheck();

    console.info('购买信息：场次id ' + _id);
});
