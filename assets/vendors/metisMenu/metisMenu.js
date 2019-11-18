(function ($, window, document, undefined) {

    var pluginName = "metisMenu",
        defaults = {
            toggle: true
        };

    function Plugin(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function () {

            var $this = $(this.element),
                $toggle = this.settings.toggle;

            $this.find('li.active').has('ul').children('ul').addClass('collapse in');
            $this.find('li').not('.active').has('ul').children('ul').addClass('collapse');

            $this.find('li').has('ul').children('a').on('click', function (e) {
                e.preventDefault();
                var $a = $(this);

                var isIE10 = true;

                try {
                    if ($.browser && $.browser.msie && $.browser.version && parseInt($.browser.version) < 10) {
                        isIE10 = false;
                    }
                } catch (e) {
                }

                if (isIE10) {
                    $(this).parent('li').toggleClass('active').children('ul').collapse('toggle');
                } else {
                    $.each($(this).parent('li').toggleClass('active').children('ul'), function () {
                        if ($(this).hasClass('collapse in')) {
                            $(this).removeClass('collapse in').addClass('collapse');
                        } else {
                            $(this).removeClass('collapse').addClass('collapse in');
                        }
                    });
                }

                if ($toggle) {
                    if (isIE10) {
                        $(this).parent('li').siblings().removeClass('active').children('ul.in').collapse('hide');
                    } else {
                        $.each($(this).parent('li').siblings().removeClass('active').children('ul.in'), function () {
                            if ($(this).hasClass('collapse in')) {
                                $(this).removeClass('collapse in').addClass('collapse');
                            } else {
                                $(this).removeClass('collapse').addClass('collapse in');
                            }
                        });
                    }
                }

                //setTimeout(function () {
                //    if ($a.parent().hasClass('active')) {
                //        $('.orgTree').animate({ scrollTop: ($a.offset().top - 100) }, 1000);
                //    }
                //}, 300);
            });

            $this.removeClass('hidden');
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            }
        });
    };

})(jQuery, window, document);
