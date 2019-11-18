// http://stackoverflow.com/questions/1117086/how-to-create-a-jquery-plugin-with-methods
// How to create a jQuery plugin with methods?

(function ($) {
    $.fn.loadingUI = function (options) {

        //默认值
        var defaultVal = {
            text: '加载中...'
        };

        var $args = arguments;

        return this.each(function () {

            var $elem = $(this);

            // Public methods
            // Usage: $('.tree').tree2014('expand', el);
            var methods = {
                hide: function () {
                    $('.loadingui-overlay').remove();
                    $('.loadingui-table').remove();
                    $elem.mutate('stop');
                }
            }

            //Check for methods
            if (typeof options === 'string') {
                if ($.isFunction(methods[options])) {
                    // do some check and prepare
                    // apply传入的this对象很重要，在public method中通过this引用
                    methods[options].apply(this, Array.prototype.slice.call($args, 1));
                    //http://stackoverflow.com/questions/1986896/what-is-the-difference-between-call-and-apply
                }
                return;
            }

            // Initialize
            var opt = $.extend(defaultVal, options);

            var rendLoadingUI = function () {
                $('div.loadingui-overlay').remove();
                $('div.loadingui-table').remove();
                var overlay = $("<div class='loadingui-overlay'></div>").appendTo(document.body);
                var loadingWrapper = $(
                    '<div class="loadingui-table">' +
                        '<div class="loadingui-table-cell">' +
                            '<span class="loadingui-box">' + opt.text +
                            '</span></div></div>').appendTo(document.body);

                if ($elem.is('body')) {
                    overlay.addClass('loadingui-overlay-fullwindow');
                    loadingWrapper.addClass('loadingui-overlay-fullwindow');
                } else {
                    overlay.addClass('loadingui-overlay-positioned');
                    loadingWrapper.addClass('loadingui-overlay-positioned');

                    position($elem, overlay);
                    position($elem, loadingWrapper, $(window).height());

                    $elem.delayExec = null;
                    $elem.mutate('offsetTop offsetLeft width height', function (el, info) {
                        if ($elem.delayExec != null) {
                            clearTimeout($elem.delayExec);
                            $elem.delayExec = null;
                        }
                        $elem.delayExec = setTimeout(function () {
                            position($(el), overlay);
                            position($(el), loadingWrapper);
                        }, 10);

                    });
                }
            }

            function position($target, $src, maxHeight) {
                $src.width($target.width());
                var height = $target.height();
                if (maxHeight != null && height > maxHeight) {
                    height = maxHeight; // 当被覆盖对象很高时，为避免Loading框看不见，要限制一下
                }
                $src.height(height);

                if ($target[0].x) {
                    $src.css("left", ($target[0].x) + "px");
                    $src.css("top", $target[0].y + "px");
                } else {
                    // Handle IE incompatibility
                    $src.css("left", $target.offset().left);
                    $src.css("top", $target.offset().top);
                }
            }

            rendLoadingUI();
        });
    }
})(jQuery);



/**
* @license jQuery-mutate
* Licensed under the MIT license
* http://www.opensource.org/licenses/mit-license.php
* Date: 2014-02-04
* https://github.com/valtido/jQuery-mutate
*/
mutate_event_stack = [
{
    name: 'width',
    handler: function (elem) {
        n = { el: elem }
        if (!$(n.el).data('mutate-width')) $(n.el).data('mutate-width', $(n.el).width());
        if ($(n.el).data('mutate-width') && $(n.el).width() != $(n.el).data('mutate-width')) {
            $(n.el).data('mutate-width', $(n.el).width());
            return true;
        }
        return false;
    }
},
{
    name: 'height',
    handler: function (n) {
        element = n;
        if (!$(element).data('mutate-height')) $(element).data('mutate-height', $(element).height());
        if ($(element).data('mutate-height') && $(element).height() != $(element).data('mutate-height')) {
            $(element).data('mutate-height', $(element).height());
            return true;
        }
    }
},
{
    name: 'offsetTop',
    handler: function (n) {
        if (!$(n).data('prev-offsetTop')) $(n).data('prev-offsetTop', $(n).offset().top);

        if ($(n).data('prev-offsetTop') && $(n).offset().top != $(n).data('prev-offsetTop')) {
            $(n).data('prev-offsetTop', $(n).offset().top);
            return true;
        }
    }
},
{
    name: 'offsetLeft',
    handler: function (n) {
        if (!$(n).data('prev-offsetLeft')) $(n).data('prev-offsetLeft', $(n).offset().left);

        if ($(n).data('prev-offsetLeft') && $(n).offset().left != $(n).data('prev-offsetLeft')) {
            $(n).data('prev-offsetLeft', $(n).offset().left);
            return true;
        }
    }
}
];

;
(function ($) {
    mutate = {
        speed: 5, // 这个时间太短，性能有压力，太长，反应不灵敏
        event_stack: mutate_event_stack,
        stack: [],
        events: {},
        stop: false,
        add_event: function (evt) {
            mutate.events[evt.name] = evt.handler;
        },
        add: function (event_name, selector, callback, false_callback) {
            mutate.stack[mutate.stack.length] = {
                event_name: event_name,
                selector: selector,
                callback: callback,
                false_callback: false_callback
            }
        }
    };

    function reset() {
        var parent = mutate;
        if (parent.event_stack != 'undefined' && parent.event_stack.length) {
            $.each(parent.event_stack, function (j, k) {
                mutate.add_event(k);
            });
        }
        parent.event_stack = [];
        $.each(parent.stack, function (i, n) {
            $(n.selector).each(function (a, b) {
                if (parent.events[n.event_name](b) === true) {
                    if (n['callback']) n.callback(b, n);
                } else {
                    if (n['false_callback']) n.false_callback(b, n);
                }
            });
        });
        if (mutate.stop == false)
            setTimeout(reset, mutate.speed);
    }
    reset();
    $.fn.extend({
        mutate: function () {
            var event_name = false,
                callback = arguments[1],
                selector = this,
                false_callback = arguments[2] ? arguments[2] : function () { };
            mutate.stop = false;
            if (arguments[0].toLowerCase() == 'extend') {
                mutate.add_event(callback);
                return this;
            }
            if (arguments[0].toLowerCase() == 'stop') {
                mutate.stack = [];
                mutate.stop = true;
                return this;
            }
            $.each($.trim(arguments[0]).split(' '), function (i, n) {
                event_name = n;
                mutate.add(event_name, selector, callback, false_callback);
            });
            return this;
        }
    });
})(jQuery);