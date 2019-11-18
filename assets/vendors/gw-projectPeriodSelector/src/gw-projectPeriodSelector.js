/*
 *  jquery.GWLightSelectUnitOrg v1.1
 *  require：jquery、jquery-tools-min.js、font-awesome 
*/

(function ($) {

    $.fn.GWProjectPeriodSelector = function (options) {

        var defaultVal = {
            width: 90,
            valueYear: 0,// 设置初始年份，如无则为当前年
            valueMonth: 0, // 设置初始季度，如无则为第一季度
            addOnPosition: 'right'// 与addon配合样式  如为中间位置控件样式则为‘mid’
        };

        var $args = arguments;
        var $plugin = $(this);

        var getSelectedProjectPeriod = function () {
            if ($('.gwProjectPeriodSelector-form').text()) {
                return $plugin.val();
            } else {
                return '';
            }
        }

        var setNullProjectPeriod = function () {
            $('.gwProjectPeriodSelector-form', $plugin).html('');
            $plugin.val({ year: -1, month: -1 });
        }

        var methods = {
            getSelectedProjectPeriod: getSelectedProjectPeriod,
            setNullProjectPeriod: setNullProjectPeriod
        }

        if (typeof options === 'string') {
            if ($.isFunction(methods[options])) {
                return methods[options].apply(this, Array.prototype.slice.call($args, 1));
            }
        }

        return this.each(function () {
            var $elem = $(this);
            var opt = $.extend(defaultVal, options);
            $elem.settings = opt;
            // 生成控件各部分
            var renderSelector = function () {
                $elem.html('');
                $elem.addClass('gwProjectPeriodSelector');

                if (opt.addOnPosition == 'mid') {
                    $elem.addClass('gwProjectPeriodSelector-mid');
                } else {
                    $elem.addClass('gwProjectPeriodSelector-right');
                }

                var $selectSeasonForm = $('<div type="text" readonly="readonly" ></div>')
                                                    .addClass("gwProjectPeriodSelector-form form-control")
                if (opt.addOnPosition == 'mid') {
                    $selectSeasonForm.addClass('gwProjectPeriodSelector-form-mid');
                } else {
                    $selectSeasonForm.addClass('gwProjectPeriodSelector-form-right');
                }

                if (typeof opt.width == 'number' && opt.width >= 103) {
                    $selectSeasonForm.css('width', opt.width + 'px');
                }

                $elem.append($selectSeasonForm);

                var $projectPeriodSelectorDropdown = $('<div class="gwProjectPeriodSelector-dropdown gwProjectPeriodSelector-dropdown-bottom-right gwProjectPeriodSelector-dropdown-menu">'
                                               + ' <div class="gwProjectPeriodSelector-label">'
                                                    + '<table class="table-condensed year-sel">'
                                                        + '<thead>'
                                                            + '<tr>'
                                                                + '<th class="switch" colspan="5">' + opt.valueYear + '年</th>'
                                                            + '</tr>'
                                                        + '</thead>'
                                                        + '<tbody>'
                                                            + '<tr>'
                                                                + '<td colspan="7">'
                                                                    + '<span class="year year0" data-year = "0">0</span>'
                                                                    + '<span class="year year1" data-year = "1">1</span>'
                                                                    + '<span class="year year2" data-year = "2">2</span>'
                                                                    + '<span class="year year3" data-year = "3">3</span>'
                                                                    + '<span class="year year4" data-year = "4">4</span>'
                                                                    + '<span class="year year5" data-year = "5">5</span>'
                                                                    + '<span class="year year6" data-year = "6">6</span>'
                                                                    + '<span class="year year7" data-year = "7">7</span>'
                                                                    + '<span class="year year8" data-year = "8">8</span>'
                                                                    + '<span class="year year9" data-year = "9">9</span>'
                                                                    + '<span class="year year10" data-year = "10">10</span>'
                                                                + '</td>'
                                                            + '</tr>'
                                                        + '</tbody>'
                                                    + '</table>'
                                                + '</div>'
                                                + '<div class="gwProjectPeriodSelector-label">'
                                                    + '<table class="table-condensed month-sel">'
                                                        + '<thead>'
                                                            + '<tr>'
                                                                + '<th class="switch" colspan="5">' + opt.valueMonth + '个月</th>'
                                                            + '</tr>'
                                                        + '</thead>'
                                                        + '<tbody>'
                                                            + '<tr>'
                                                                + '<td colspan="7">'
                                                                    + '<span class="month month0" data-month = "0">0</span>'
                                                                    + '<span class="month month1" data-month = "1">1</span>'
                                                                    + '<span class="month month2" data-month = "2">2</span>'
                                                                    + '<span class="month month3" data-month = "3">3</span>'
                                                                    + '<span class="month month4" data-month = "4">4</span>'
                                                                    + '<span class="month month5" data-month = "5">5</span>'
                                                                    + '<span class="month month6" data-month = "6">6</span>'
                                                                    + '<span class="month month7" data-month = "7">7</span>'
                                                                    + '<span class="month month8" data-month = "8">8</span>'
                                                                    + '<span class="month month9" data-month = "9">9</span>'
                                                                    + '<span class="month month10" data-month = "10">10</span>'
                                                                    + '<span class="month month11" data-month = "11">11</span>'
                                                                + '</td>'
                                                            + '</tr>'
                                                        + '</tbody>'
                                                    + '</table>'
                                                + '</div>'
                                            + '</div>');

                var defaultVal = { year: -1, month: -1 };
                if (typeof opt.valueYear == 'number' && typeof opt.valueMonth == 'number') {
                    // 设置初始年大小
                    if (opt.valueYear > 0 && opt.valueYear <= 10) {
                        $('.year.year' + opt.valueYear, $projectPeriodSelectorDropdown).addClass('active');
                        $('.year-sel .switch', $elem).text(opt.valueYear + '年');
                        $('.gwProjectPeriodSelector-form', $elem).html(opt.valueYear + '年');
                        defaultVal.year = opt.valueYear;
                    } else {
                        $('.year.year0', $projectPeriodSelectorDropdown).addClass('active');
                        $('.year-sel .switch', $elem).text('0年');
                        $('.gwProjectPeriodSelector-form', $elem).html('');
                    }
                    // 设置初始月大小
                    if (opt.valueMonth > 0 && opt.valueMonth <= 11) {
                        $('.month.month' + opt.valueMonth, $projectPeriodSelectorDropdown).addClass('active');
                        $('.month-sel .switch', $elem).text(opt.valueMonth + '个月');
                        $('.gwProjectPeriodSelector-form', $elem).append(opt.valueMonth + '个月');
                        defaultVal.month = opt.valueMonth;
                    } else {
                        $('.month.month0', $projectPeriodSelectorDropdown).addClass('active');
                        $('.month-sel .switch', $elem).text('0个月');
                    }
                }
                $elem.val(defaultVal);
                $elem.append($projectPeriodSelectorDropdown);
            }

            // 展开面板
            var panelExpand = function () {
                if ($('.gwProjectPeriodSelector-dropdown-menu', $elem).css('display') == 'none') {
                    $('.gwProjectPeriodSelector-dropdown-menu', $elem).css('display', 'block');
                    return true;
                } else {
                    return false;
                }
            }

            // 收起面板
            var panelCollapse = function () {
                if ($('.gwProjectPeriodSelector-dropdown-menu', $elem).css('display') == 'block') {
                    $('.gwProjectPeriodSelector-dropdown-menu', $elem).css('display', 'none');
                    return true;
                } else {
                    return false;
                }
            }

            // 确认选择周期信息
            var affirmSelect = function () {
                var strProjectPeriod = '';
                if ($('.year.active', $elem).text() !="0" ) {
                    strProjectPeriod += $('.year.active', $elem).text() + '年';
                }
                if ($('.month.active', $elem).text() != "0") {
                    strProjectPeriod += $('.month.active', $elem).text() + '个月';
                }
                $('.gwProjectPeriodSelector-form', $elem).text(strProjectPeriod);
                $elem.val({ year: $('.year.active', $elem).text(), month: $('.month.active', $elem).text() });
            }

            // 事件合法验证
            var doOnSelect = function () {
                if (typeof opt.onSelect == 'function') {
                    return opt.onSelect() == false ? false : true;
                }
                return true;
            }


            //绑定事件
            var bindEvent = function () {

                // 点击输入框展开关闭面板
                $('.gwProjectPeriodSelector-form', $elem).on('click', function () {
                    if (!panelCollapse()) {
                        panelExpand();
                    }
                });

                $('.year', $elem).on('click', function () {
                    $('.year', $elem).removeClass('active');
                    $(this).addClass('active');
                    $('.year-sel .switch', $elem).text($(this).text() + '年');
                });

                $('.month', $elem).on('click', function () {
                    $('.month', $elem).removeClass('active');
                    $(this).addClass('active');
                    $('.month-sel .switch', $elem).text($(this).text() + '个月');
                    panelCollapse();
                    affirmSelect();
                });

                // 控件外点击事件，关闭面板
                $(document).on('click', function (e) {
                    if ($elem.find($(e.target)).length == 0 || $(e.target).closest('.gwProjectPeriodSelector').length == 0) {
                        panelCollapse();
                    }
                });
            }

            renderSelector();
            bindEvent();

        });
    }

})(jQuery);