/**
 * gw-pageSlideBar.js : 页面分块滑动切换指示工具。
 * version : v0.1.0
 * require : jquery
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : kfzhang
 * LastModifyBy : kfzhang
 * LastModifyTime : 2016-7-01 14:00:00
 */

(function ($) {
    $.fn.GWPageSlideBar = function (options) {
        var defaultVal = {
            regions: [], // 滚动面板单元的id数组，按先后顺序输入。
            scrollContainer: 'html', // 滚动容器的选择器 exp: '.classA'  '#abc'
            onBeforeClick: null, // 点击定位点事件处理前触发 return false 则不执行之后动作
            onClicked: null,// 点击定位点事件处理后触发
            bottom: 20, // 控件定位，距离底部px.
            right: 17 // 控件定位，距离右边px.
        };

        var $args = arguments;
        var $plugin = this;

        return this.each(function () { 

            var $elem = $(this);
            var opt = $.extend(defaultVal, options);

            // 生成控件各部分
            var renderDetails = function () {
                if (opt.bottom) {
                    $elem.css({'bottom': opt.bottom + 'px'})
                }
                if (opt.right) {
                    $elem.css({ 'right' : opt.right + 'px'})
                }
                var $innerUl = $('<ul></ul>')

                if (opt.regions === [] || !opt.regions) { return;
                }
                $elem.addClass('fp-nav');
                $innerUl.append($('<li><a class="active btnGlide topOne" href="javascript:void(0)" data-tooltip="' + opt.regions[0]
                                        + '"><span></span></a></li>'));
                for (var i = 1 ; i < opt.regions.length; i++) {
                    $innerUl.append($('<li><a class="btnGlide" href="javascript:void(0)" data-tooltip="' + opt.regions[i]
                                        + '"><span></span></a></li>'));
                }

                $elem.append($innerUl);
            }
            // 执行点击前事件
            var doBeforeClick = function () {
                if (typeof opt.onBeforeClick == 'function') {
                    return opt.onBeforeClick() == false ? false : true;
                }
                return true;
            }
            // 执行点击处理后事件
            var doClicked = function () {
                if (typeof opt.onClicked == 'function') {
                    return opt.onClicked();
                }
                return true;
            }
                        
            //绑定事件
            var bindEvent = function () {
                // 滚动时定位响应
                $(opt.scrollContainer).scroll(function () {

                    for (var i = 0; i < opt.regions.length; i++) {
                        if ($('#' + opt.regions[i]).position().top + $('#' + opt.regions[i]).height() - 20 < 0) {
                            continue;
                        } else if ($('#' + opt.regions[i]).position().top + $('#' + opt.regions[i]).height() + 20 > 0) {

                            if ($('.active', $elem).data('tooltip') != opt.regions[i]) {
                                $elem.find('a').removeClass('active');
                                $('[data-tooltip=' + opt.regions[i] + ']', $elem).addClass('active');
                            }
                            break;
                        }
                    }
                });

                // 页面定位
                $('.btnGlide', $elem).on('click', function () {
                    var $target = $(this);
                    var strDivId = $target.data('tooltip');
                    var $divPosition = $('#' + strDivId).position();

                    if (!doBeforeClick()) {
                        $elem.find('a').removeClass('active');
                        $target.addClass('active');
                        return false;
                    }

                    if ($target.hasClass('active')) {

                        doClicked();
                        return true;
                    }
                    if ($target.hasClass('topOne')) {
                        $elem.find('a').removeClass('active');
                        $target.addClass('active');
                        $(opt.scrollContainer).animate({ scrollTop: 0 }, 'fast');

                        doClicked();
                        return true;
                    }
                    $elem.find('a').removeClass('active');
                    $target.addClass('active');
                    $(opt.scrollContainer).stop(true);
                    // 10 为面板间隙
                    $(opt.scrollContainer).animate({ scrollTop: $divPosition.top + $(opt.scrollContainer).scrollTop() + 10 }, 'fast');

                    doClicked();
                });
                 
            }

            renderDetails();
            bindEvent();
        });
    } 
})(jQuery);