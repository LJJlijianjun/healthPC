/*
 *  jquery.GWLightSelectUnitOrg v1.1
 *  require：jquery、jquery-tools-min.js、font-awesome 
*/

(function ($) {

    $.fn.GWSelectSeason = function (options) {

        var defaultVal = {
            width:130,
            valueYear: '',// 设置初始年份，如无则为当前年
            addOnPosition: 'right', // 与addon配合样式  如为中间控件样式则为‘mid’
            onSelect:null,
            valueSeason: 1 // 设置初始季度，如无则为第一季度

        };


        var $args = arguments;
        var $plugin = this;

        var getSelectSeason = function () {
            if ($('.gwSelectSeason-form').text()) {
                return $plugin.val();
            } else {
                return '';
            }
        }
        var setDefaultSeason = function () {
            $('.gwSelectSeason-form', $plugin).text('');
            $plugin.val('');
        }

        var methods = {
            getSelectSeason: getSelectSeason,
            setDefaultSeason: setDefaultSeason
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
                $elem.addClass('gwSelectSeason');

                if (opt.addOnPosition == 'mid') {
                    $elem.addClass('gwSelectSeason-mid');
                } else {
                    $elem.addClass('gwSelectSeason-right');
                }
                
                var $selectSeasonForm = $('<div type="text" readonly="readonly" ></div>')
                                                    .addClass("gwSelectSeason-form form-control")
                if (opt.addOnPosition == 'mid') {
                    $selectSeasonForm.addClass('gwSelectSeason-form-mid');
                } else {
                    $selectSeasonForm.addClass('gwSelectSeason-form-right');
                }
                if (typeof opt.width == 'number' && opt.width>=130) {
                    $selectSeasonForm.css('width',opt.width+ 'px');
                }

                $elem.append($selectSeasonForm);
                                                    
                var $selectSeasonDropdown = $('<div class="gwSelectSeason-dropdown gwSelectSeason-dropdown-bottom-right gwSelectSeason-dropdown-menu">'
                                                    + '<div class="gwSelectSeason-months">'
                                                        + '<table class="table-condensed">'
                                                            + '<thead>'
                                                                + '<tr>'
                                                                    + '<th class="prev">'
                                                                        + '<span class="glyphicon glyphicon-arrow-left"></span>'
                                                                    + '</th>'
                                                                    + '<th class="switch" colspan="5">'
                                                                    + '</th>'
                                                                    + '<th class="next">'
                                                                        + '<span class="glyphicon glyphicon-arrow-right"></span>'
                                                                    + '</th>'
                                                                + '</tr>'
                                                            + '</thead>'
                                                            + '<tbody>'
                                                                + ' <tr>'
                                                                    + ' <td colspan="7">'
                                                                    + ' <span class="season season1" data-season = "1">第一季度</span>'
                                                                    + ' <span class="season season2" data-season = "2">第二季度</span>'
                                                                    + ' <span class="season season3" data-season = "3">第三季度</span>'
                                                                    + ' <span class="season season4" data-season = "4">第四季度</span>'
                                                                    + ' </td>'
                                                                + ' </tr>'
                                                            + '</tbody>'
                                                        + '</table>'
                                                    + '</div>'
                                                + ' </div>');

                // 设置初始年份
                if (opt.valueYear > 1900) {
                    $('.switch', $selectSeasonDropdown).text(opt.valueYear);
                } else {
                    $('.switch', $selectSeasonDropdown).text((new Date()).getFullYear());
                }
                // 设置初始季度
                if (opt.valueSeason > 0 && opt.valueSeason < 5) {
                    $('.season.season' + opt.valueSeason, $selectSeasonDropdown).addClass('active');
                } else {
                    $('.season.season1', $selectSeasonDropdown).addClass('active');
                }

                $elem.append($selectSeasonDropdown);

            }

            // 展开面板
            var panelExpand = function () {
                if ($('.gwSelectSeason-dropdown-menu', $elem).css('display') == 'none') {
                    $('.gwSelectSeason-dropdown-menu', $elem).css('display', 'block');
                    return true;
                } else {
                    return false;
                }
            }

            // 收起面板
            var panelCollapse = function () {
                if ($('.gwSelectSeason-dropdown-menu', $elem).css('display') == 'block') {
                    $('.gwSelectSeason-dropdown-menu', $elem).css('display', 'none');
                    return true;
                } else {
                    return false;
                }
            }

            // 年份减一
            var yearPrev = function () {
                var year =  parseInt($('.switch', $elem).text());
                if (year - 1 > 1900) {
                    $('.switch', $elem).text(year - 1);
                }
            }
            // 年份加一
            var yearNext = function () {
                var year = parseInt($('.switch', $elem).text());
                if (year + 1 > 1900) {
                    $('.switch', $elem).text(year + 1);
                }
            }

            // 设置季度为空
            var setSeasonNull = function () {
                $('.season', $elem).removeClass('active').val('');
            }

            // 确认选择季度信息
            var affirmSelect = function () {
                $('.gwSelectSeason-form', $elem).text($('.switch', $elem).text() + '年' + $('.season.active', $elem).text());
                $elem.val({ year: $('.switch', $elem).text(), season: $('.active', $('.season', $plugin).parent()).data('season') });
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
                $('.gwSelectSeason-form', $elem).on('click', function () {
                    if (!panelCollapse()) {
                        panelExpand();
                    }
                });

                $('.prev', $elem).on('click', function () {
                    setSeasonNull();
                    yearPrev();
                });

                $('.next', $elem).on('click', function () {
                    setSeasonNull();
                    yearNext();
                });

                $('.season', $elem).on('click', function () {
                    $('.season', $elem).removeClass('active');
                    $(this).addClass('active');
                    panelCollapse();
                    if (doOnSelect) {
                        affirmSelect();
                    }
                });

                $(document).on('click', function (e) {
                    if ($elem.find($(e.target)).length == 0 || $(e.target).closest('.gwSelectSeason').length == 0) {
                         panelCollapse();
                    }
                });
            }

            renderSelector();
            bindEvent();

        });
    }

})(jQuery);