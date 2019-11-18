/**
 * gw-activebar.js : 页面顶部显示提示条。
 * version : v0.1.0
 * require : jquery
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : kfzhang
 * LastModifyBy : kfzhang
 * LastModifyTime : 2016-7-01 14:00:00
 */
(function ($) {

    $.fn.GWActivebar = function (options) {
        // Merge the specified options with the default ones
        var options = $.fn.extend({}, $.fn.GWActivebar.defaults, options);

        // Create a new GWActivebar container if there is no one lying around
        if ($.fn.GWActivebar.container == null) {
            $.fn.GWActivebar.container = initializeActivebar(options);
        }

        // Update the style values according to the provided options
        setOptionsOnContainer($.fn.GWActivebar.container, options);

        // If the GWActivebar is currently visible hide it
        $.fn.GWActivebar.hide();


        // Update the position based on the new content data height
        $.fn.GWActivebar.container.css('top', '-' + $.fn.GWActivebar.container.height() + 'px');

        // Show the GWActivebar
        $.fn.GWActivebar.show();
    };

    /**
     * Default options used if nothing more specific is provided.
     */
    $.fn.GWActivebar.defaults = {
        'border': '#c8c8c8',
        'font': 'Microsoft YaHei',
        'fontSize': '13px',
        'data': []
    };

    /**
     * Indicator in which state the GWActivebar currently is
     * 0: Moved in (hidden)
     * 1: Moving in (hiding)
     * 2: Moving out (showing)
     * 3: Moved out (shown)
     */
    $.fn.GWActivebar.state = 0;

    /**
     * GWActivebar container object which holds the shown content
     */
    $.fn.GWActivebar.container = null;

    /**
     * Show the GWActivebar by moving it in
     */
    $.fn.GWActivebar.show = function () {
        if ($.fn.GWActivebar.state > 1) {
            // Already moving out or visible. Do Nothing.
            return;
        }

        $.fn.GWActivebar.state = 2;
        $.fn.GWActivebar.container.css('display', 'block');

        var height = $.fn.GWActivebar.container.height();
        $.fn.GWActivebar.container.animate({
            'top': '+=' + height + 'px'
        }, height * 20, 'linear', function () {
            $.fn.GWActivebar.state = 3;
        });
    };

    /**
     * Hide the GWActivebar by moving it out
     */
    $.fn.GWActivebar.hide = function () {
        if ($.fn.GWActivebar.state < 2) {
            // Already moving in or hidden. Do nothing.
            return;
        }

        $.fn.GWActivebar.state = 1;

        var height = $.fn.GWActivebar.container.height();
        $.fn.GWActivebar.container.animate({
            'top': '-=' + height + 'px'
        }, height * 20, 'linear', function () {
            $.fn.GWActivebar.container.css('display', 'none');
            $.fn.GWActivebar.visible = false;
        });

    };

    /****************************************************************
     * Private function only accessible from within this plugin
     ****************************************************************/

    /**
     * Create the a basic GWActivebar container object and return it
     */
    function initializeActivebar(options) {
        // Create the container object
        var container = $('<div></div>').addClass('GWActivebar-container');

        // Set the needed css styles
        container.css({
            'display': 'none',
            'position': 'fixed',
            'height': '24px',
            'zIndex': '999999',
            'top': '0px',
            'left': '0px'

        });

        // Make sure the bar has always the correct width
        $(window).bind('resize', function () {
            container.width($(this).width());
        });

        // Set the initial bar width
        $(window).trigger('resize');

        // The IE prior to version 7.0 does not support position fixed. However
        // the correct behaviour can be emulated using a hook to the scroll
        // event. This is a little choppy, but it works.
        if ($.browser.msie
          && ($.browser.version.substring(0, 1) == '5'
            || $.browser.version.substring(0, 1) == '6')) {
            // Position needs to be changed to absolute, because IEs fallback
            // for fixed is static, which is quite useless here.
            container.css('position', 'absolute');
            $(window).scroll(
                function () {
                    container.stop(true, true);
                    if ($.fn.GWActivebar.state == 3) {
                        // GWActivebar is visible
                        container.css('top', $(window).scrollTop() + 'px');
                    }
                    else {
                        // GWActivebar is hidden
                        container.css('top', ($(window).scrollTop() - container.height()) + 'px');
                    }
                }
            );
        }

        // Create the initial content container
        container.append(
            $('<div></div>').attr('class', 'content')
        );

        if (options.data) {
            if (options.data.alerts.length > 0) {
                var links = '';
                for (var i = 0; i < options.data.alerts.length; i++) {
                    links += '<div class="linkBar"><span class="pointBar"></span><a class=\"alertTags\" href=\"#\" onclick=\"' + options.data.alerts[i].onclick + '\">'
                                + '<label class="titleBegin">' + options.data.alerts[i].titleBegin + '</label>'
                                + '<label class="titleNum">' + options.data.alerts[i].titleNum + '</label>'
                                + '<label class="titleEnd">' + options.data.alerts[i].titleEnd + '</label>'
                           + '</a></div>';
                }


                $('.content', container).append($('<div id=\"ActivebarAlert\" role=\"alert\">'
                                    + '</div>')
                                    .attr('class', 'alert alert-warning alert-dismissable')
                                    .append($('<span class=\"alertIcon glyphicon ' + options.data.icon + '\" aria-hidden=\"true\"></span>'))
                                    .append(links)
                                    .prepend(
                                                $('<button class=\"close\" aria-label=\"Close\" type=\"button\">'
                                                    + '  <span aria-hidden=\"true\">&times;</span>'
                                                + '</button>').click(function () {
                                                    $.fn.GWActivebar.hide();
                                                    try {
                                                        if (event && event.stopPropagation)
                                                            event.stopPropagation();
                                                        else
                                                            window.event.cancelBubble = true;
                                                    } catch (e) {
                                                    }
                                                })
                                            )
                                    );
            }
        }

        $('body').prepend(container);

        return container;
    };

    /**
     * Set the provided options on the given GWActivebar container object
     */
    function setOptionsOnContainer(container, options) {
        container.css({
            //'background': options.background,
            //'borderBottom': '1px solid ' + options.border
        });

        // Set the content font styles
        $('.content', container).css({
            'fontFamily': options.font,
            'fontSize': options.fontSize
        });
    };

})(jQuery);
