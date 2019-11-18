/**
 * gw-pageSideBar.js : 页面右侧下方纵向工具条
 * version : v0.1.0
 * require : jquery
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : kfzhang
 * LastModifyBy : kfzhang
 * LastModifyTime : 2016-7-01 14:00:00
 */
(function ($) {
    $.fn.GWPageSideBar = function (options) {
        var defaultVal = {
            sideBarFunction: ['home', 'quiz', 'favorite', 'toTop'],
            homePath:'../Index.html',
            isFavorite: true, //收藏状态（是否被收藏）
            quizContainer: '', //"提问"输入控件对应的jquery选择器 若存在"提问"单元则此字段必需。
            bottom: 113, // 控件定位，距离页面底部px.
            right: 30, //控件定位，距离页面右边px.
            onBeforeAddFavorite: null, // 添加收藏动作前处理，返回false停止动作
            onAddFavorite: null, // 添加收藏动作后处理
            onBeforeRemoveFavorite: null, // 取消收藏动作前处理，返回false停止动作
            onRemoveFavorite: null, // 取消收藏动作后处理
            onBeforeToTop: null, // 回到顶部前处理，返回false停止动作
            onToTop: null, // 回到顶部动作后处理
            onBeforeQuiz: null, // 提问动作前处理，返回false停止动作
            onQuiz: null, // 提问动作后处理
        };

        var $args = arguments;
        var $plugin = this;

        var addFavorite = function () {
            var $this = $('.favorite', $plugin)
            // 添加收藏
            if ($this.hasClass('addFavorite')) {
                $this.removeClass('addFavorite').addClass('removeFavorite')
                $this.find('i').removeClass('addFavorite-icon').addClass('removeFavorite-icon');
                $this.find('span').text('取消收藏');
            }
        }
        var removeFavorite = function () {
            var $this = $('.favorite', $plugin)
            // 取消收藏
            if ($this.hasClass('removeFavorite')) {
                $this.removeClass('removeFavorite').addClass('addFavorite');
                $this.find('i').removeClass('removeFavorite-icon').addClass('addFavorite-icon');
                $this.find('span').text('添加收藏');
            } 
        }

        var methods = {
            addFavorite: addFavorite,
            removeFavorite: removeFavorite
        }

        if (typeof options === 'string') {
            if ($.isFunction(methods[options])) {
                return methods[options].apply(this, Array.prototype.slice.call($args, 1));
            }

        }

        return this.each(function () {

            var $elem = $(this);
            var opt = $.extend(defaultVal, options);

            // 生成控件各部分
            var renderDetails = function () {
                $elem.addClass('m-side-operation');
                if (opt.bottom) {
                    $elem.css({ 'bottom': opt.bottom + 'px' })
                }
                if (opt.right) {
                    $elem.css({ 'right': opt.right + 'px' })
                }
                // 根据配置生成各部分
                if (opt.sideBarFunction) {
                    for (var i = 0; i < opt.sideBarFunction.length; i++) {
                        switch (opt.sideBarFunction[i]) {
                            case 'home':
                                $elem.append($('<div class="side-service-item">'
                                                + '<a class="item-link-block home" href="javascript:void(0)">'
                                                    + '<i class="side-service-icon home-icon"></i>'
                                                    + '<span class="item-hover-text">返回首页</span>'
                                                + '</a>'
                                              + '</div>'));
                                break;
                            case 'quiz':
                                $elem.append($('<div class="side-service-item">'
                                                + '<a class="item-link-block quiz" href="javascript:void(0)">'
                                                    + '<i class="side-service-icon feedback-icon"></i>'
                                                    + '<span class="item-hover-text">我要提问</span>'
                                                + '</a>'
                                              + '</div>'));
                                break;
                            case 'favorite':
                                $elem.append($('<div class="side-service-item">'
                                                + '<a class="item-link-block favorite ' + (opt.isFavorite ? 'removeFavorite' : 'addFavorite') + '" href="javascript:void(0)">'
                                                    + '<i class="side-service-icon ' + (opt.isFavorite ? 'removeFavorite-icon' : 'addFavorite-icon') + '""></i>'
                                                    + '<span class="item-hover-text">' + (opt.isFavorite ? '取消收藏' : '添加收藏') + '</span>'
                                                + '</a>'
                                              + '</div>'));
                                break;
                            case 'toTop':
                                $elem.append($('<div class="side-service-item">'
                                                + '<a class="item-link-block toTop"href="javascript:void(0)">'
                                                    + '<i class="side-service-icon top-icon"></i>'
                                                    + '<span class="item-hover-text">返回顶部</span>'
                                                + '</a>'
                                              + '</div>'));
                                break;
                            default:
                                break;
                        }
                        if (i < opt.sideBarFunction.length - 1) {
                            $elem.append($('<div class="line-wrap"><div class="line"></div></div>'));
                        }
                    }
                }
            }
            // 提问动作前处理，返回false停止动作
            var doBeforeQuiz = function () {
                if (typeof opt.onBeforeQuiz == 'function') {
                    return opt.onBeforeQuiz() == false ? false : true;
                }
                return true;
            }

            // 提问动作后处理
            var doQuiz = function () {
                if (typeof opt.onQuiz == 'function') {
                    return opt.onQuiz();
                }
                return true;
            }

            // 添加收藏动作前处理，返回false停止动作
            var doBeforeAddFavorite = function () {
                if (typeof opt.onBeforeAddFavorite == 'function') {
                    return opt.onBeforeAddFavorite() == false ? false : true;
                }
                return true;
            }

            // 添加收藏动作后处理
            var doAddFavorite = function () {
                if (typeof opt.onAddFavorite == 'function') {
                    return opt.onAddFavorite();
                }
                return true;
            }

            // 取消收藏动作前处理，返回false停止动作
            var doBeforeRemoveFavorite = function () {
                if (typeof opt.onBeforeRemoveFavorite == 'function') {
                    return opt.onBeforeRemoveFavorite() == false ? false : true;
                }
                return true;
            }

            // 取消收藏动作后处理
            var doRemoveFavorite = function () {
                if (typeof opt.onRemoveFavorite == 'function') {
                    return opt.onRemoveFavorite();
                }
                return true;
            }

            // 回到顶部前处理，返回false停止动作
            var doBeforeToTop = function () {
                if (typeof opt.onBeforeToTop == 'function') {
                    return opt.onBeforeToTop() == false ? false : true;
                }
                return true;
            }

            // 回到顶部动作后处理
            var doToTop = function () {
                if (typeof opt.onToTop == 'function') {
                    return opt.onToTop();
                }
                return true;
            }

            //绑定事件
            var bindEvent = function () {
                $('.toTop', $elem).on('click', function () {
                    if (doBeforeToTop() || typeof onBeforeToTop == undefined) {
                        $('html,body').animate({ scrollTop: 0 }, 'fast');
                        doToTop();
                        return false;
                    }
                });

                $('.home', $elem).on('click', function () {
                    if (opt.homePath != '') {
                        window.location = opt.homePath;
                    } else {
                        window.location = '../Index.html';
                    }
                });

                $('.favorite', $elem).on('click', function () {
                    // 添加或取消收藏
                    if ($(this).hasClass('removeFavorite')) {
                        if (doBeforeRemoveFavorite() || typeof onBeforeRemoveFavorite == undefined) {
                            $(this).removeClass('removeFavorite').addClass('addFavorite');
                            $(this).find('i').removeClass('removeFavorite-icon').addClass('addFavorite-icon');
                            $(this).find('span').text('添加收藏');
                            doRemoveFavorite();
                        }
                    } else if ($(this).hasClass('addFavorite')) {
                        if (doBeforeAddFavorite() || typeof onBeforeAddFavorite == undefined) {
                            $(this).removeClass('addFavorite').addClass('removeFavorite')
                            $(this).find('i').removeClass('addFavorite-icon').addClass('removeFavorite-icon');
                            $(this).find('span').text('取消收藏');
                            doAddFavorite();
                        }
                    }
                });

                // 点击“提问”时滚动定位
                $('.quiz', $elem).on('click', function () {
                    if (doBeforeQuiz() || typeof onBeforeQuiz == undefined) {
                        if (opt.quizContainer) {
                            // 提问
                            $(opt.quizContainer).focus();
                            $('html').animate({ scrollTop: $(opt.quizContainer).offset().top - 50 }, 'fast');
                            doQuiz();
                        }
                    }
                });

            }

            renderDetails();
            bindEvent();
        });
    }
})(jQuery);