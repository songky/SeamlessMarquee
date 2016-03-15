/*
 * 文字跑马灯效果，根据文字缩进实现无缝字幕滚动
 *
 * Updated at 00:20, Wen Mar 09 2016
 *
 * Based on stackoverflow
 *
 */
(function($) {
    // 临时标签，获取滚动字幕文本宽度
    $.fn.textWidth = function(){
        var calc = '<span id="temp_span" style="display:none">' + $(this).text() + '</span>';
        $('#header_main').append(calc);
        var width = $('#header_main').find('#temp_span').width();
        $('#header_main').find('#temp_span').remove();
        return width;
    };
    // 跑马灯方法
    $.fn.marquee       = function(args) {
        var that       = $(this);
        var options    = $.extend(true, { count: -1, speed: 1, leftToRight: false }, args),
            textWidth  = that.textWidth(),
            offset     = that.width(),
            width      = offset,
            css        = {
                'text-indent' : that.css('text-indent'),
                'overflow'    : that.css('overflow'),
                'white-space' : that.css('white-space')
            },
            marqueeCss = {
                'text-indent' : width,
                'overflow'    : 'hidden',
                'white-space' : 'nowrap'
            },
            i    = 0,
        // 文字最终停止位置
            stop = (width + 1.5 * textWidth) * -1,
        // 新建一个Deferred对象
            dfd  = $.Deferred();

        // 定义方法
        function start_scroll() {
            // 根据overflow属性值判断是否开始滚动
            if (that.css('overflow') != "hidden") {
                that.css('text-indent', width + 'px');
                return false;
            }
            // 判断是否存在需要调用跑马灯方法的标签，改变Deferred对象的执行状态，已失败，fail
            if (!that.length) return dfd.reject();
            // 字幕到达已定义停止位置，重新开始滚动
            if ((width + 1.5 * textWidth) == stop) {
                i++;
                // 允许的滚动次数
                if (i == options.count) {
                    that.css(css);
                    // 改变Deferred对象的执行状态，已完成，done
                    return dfd.resolve();
                }
                // 滚动的方向，false表示从左往右滚动，默认值
                if (options.leftToRight) {
                    width = textWidth * -1;
                } else {
                    width = offset;
                }
            }
            // 定义初始位置，默认从当前窗体的最右侧开始
            that.css('text-indent', width + 'px');
            // 如果从左往右滚动，则text-indent的值逐次低贱
            if (options.leftToRight) {
                width++;
            } else {
                width--;
            }
            // 滚动速度
            setTimeout(start_scroll, options.speed);
        }
        // 位移
        if (options.leftToRight) {
            width = textWidth*-1;
            width++;
            stop = offset;
        } else {
            width--;
        }
        // 赋予css样式，实现滚动效果
        that.css(marqueeCss);
        start_scroll();
        // 屏蔽与改变执行状态有关的方法(比如resolve()方法和reject()方法)，从而使得执行状态不能被改变
        return dfd.promise();
    };
    // 获取字幕滚动的允许时间
    var _scroll_content = $('#scroll_content');
    var speed_time = _scroll_content.data('scroll-time');
    _scroll_content.marquee({speed: speed_time});
})(jQuery);

