$(function () {

    $('.search-btn').click(function () {
        setfunction();
    });
    $('.search-txt').keypress(function (e) {
        if (e.which == 13) {
            setfunction();
        }
    });
    function setfunction() {
        $.ajax({
            type: 'GET',
            url: 'https://www.tianqiapi.com/api/',
            data: 'version=v1&appid=18254637&appsecret=9CyWNnCC&city=' +
                document.querySelector(".search-txt").value,
            dataType: 'JSON',
            error: function () {
                alert('Connecting Error~~~');
            },
            success: function (res) {
                if (res.city !== document.querySelector(".search-txt").value) { alert('请输入正确的城市！'); return; }
                $('.bottom').css('display', 'block');
                localStorage.setItem("res", JSON.stringify(res));
                for (var i = 0; i < res.data.length; i++) {
                    $('#day' + i).remove();
                    $('<div id="day' + i + '"></div>').appendTo('#' + i);
                    $('<div class="font">' + res.data[i].day + '</div>').appendTo('#day' + i);
                    var w1 = '', w2 = '';
                    for (var j = 0; j < res.data[i].wea.length; j++) {
                        if (res.data[i].wea.charAt(j) !== "转") {
                            w2 += res.data[i].wea.charAt(j);
                        } else {
                            w1 = w2;
                            w2 = '';
                        }
                    }
                    if (w1 === '') { w1 = w2; }
                    $('<img src="/img/weather/' + w1 + '.gif">').appendTo('#day' + i);
                    $('<img src="/img/weather/' + w2 + '.gif">').appendTo('#day' + i);
                    $('<div class="font">' + res.data[i].wea + '</div>').appendTo('#day' + i);
                    $('<div class="font">' + res.data[i].tem1 + '-' + res.data[i].tem2 + '</div>').appendTo('#day' + i);
                    $('<div class="font">' + res.data[i].win[0] + res.data[i].win_speed + '</div>').appendTo('#day' + i);
                }


                path(res.data[0]);
                $('#' + 0).css('background-color', '#FF774499');
                for (var j = 1; j < 7; j++) {
                    $('#' + j).css('background-color', '#FFFFBB99');
                }
            }
        });
    }
    $('.day').click(function () {

        var res = eval("(" + localStorage.getItem("res") + ")");
        for (var i = 0; i < 7; i++) {
            $('#' + i).css('background-color', '#FFFFBB99');
        }
        $('#' + this.id).css('background-color', '#FF774499');
        path(res.data[this.id]);
    });

    //绘制图像部分 修改自-weather-forecast
    function path(data) {
        var cy = [];
        $('circle').attr("r", 0);
        $('.time').remove();//清理旧数据
        for (var k = 0; k < data.hours.length; k++) {
            $('<div class="time">' + data.hours[k].day + '<br/><img src="/img/weather/' +
                data.hours[k].wea + '.gif" class="wea"><br />' + data.hours[k].tem + '</div>').appendTo('#temperature');//温度信息
            $('<div class="time">' + data.hours[k].win + '<br />' + data.hours[k].win_speed + '</div>').appendTo('#wind');//风向信息
            cy[k] = (90 - (number(data.hours[k].tem) - number(data.tem2)) * 80 / (number(data.tem1) - number(data.tem2)));//计算温度点纵坐标

            document.querySelector('.circle' + k).setAttribute("r", 4);
            document.querySelector('.circle' + k).setAttribute("cy", cy[k]);//绘制温度点
        }
        $('.time').width((680 / cy.length) + 'px');//修改文字位置
        document.querySelector('.circle0').setAttribute("cx", (680 / cy.length / 2));//初始点坐标
        var str = "M" + (680 / cy.length / 2) + "," + cy[0];//初始折线起始点
        for (var m = 1; m < cy.length; m++) {
            str += "L" + ((680 / cy.length / 2) + m * 680 / cy.length) + "," + cy[m];//计算路径坐标
            document.querySelector('.circle' + m).setAttribute("cx", ((680 / cy.length / 2) + m * 680 / cy.length));//计算点坐标
        }
        document.querySelector('#path').setAttribute("d", str);//绘制折线
    }
    function number(str) {
        var num = '';
        for (var i = 0; i < str.length; i++) {
            if (str.charAt(i) != '℃') {
                num += str.charAt(i);
            } else {
                return num;
            }
        }
    }
});
