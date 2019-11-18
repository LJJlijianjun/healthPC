/*
 * jquery.tools.min.js
 */

// jquery.cookie
(function ($, document) { var pluses = /\+/g; function raw(s) { return s } function decoded(s) { return decodeURIComponent(s.replace(pluses, ' ')) } $.cookie = function (key, value, options) { if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value == null)) { options = $.extend({}, $.cookie.defaults, options); if (value == null) { options.expires = -1 } if (typeof options.expires === 'number') { var days = options.expires, t = options.expires = new Date(); t.setDate(t.getDate() + days) } value = String(value); return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join('')) } options = value || $.cookie.defaults || {}; var decode = options.raw ? raw : decoded; var cookies = document.cookie.split('; '); for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')) ; i++) { if (decode(parts.shift()) === key) { return decode(parts.join('=')) } } return null }; $.cookie.defaults = {} })(jQuery, document);

// jquery.url
; (function ($, undefined) { var tag2attr = { a: 'href', img: 'src', form: 'action', base: 'href', script: 'src', iframe: 'src', link: 'href' }, key = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "fragment"], aliases = { "anchor": "fragment" }, parser = { strict: /^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/, loose: /^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*):?([^:@]*))?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/ }, querystring_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g, fragment_parser = /(?:^|&|;)([^&=;]*)=?([^&;]*)/g; function parseUri(url, strictMode) { var str = decodeURI(url), res = parser[strictMode || false ? "strict" : "loose"].exec(str), uri = { attr: {}, param: {}, seg: {} }, i = 14; while (i--) { uri.attr[key[i]] = res[i] || "" } uri.param['query'] = {}; uri.param['fragment'] = {}; uri.attr['query'].replace(querystring_parser, function ($0, $1, $2) { if ($1) { uri.param['query'][$1] = $2 } }); uri.attr['fragment'].replace(fragment_parser, function ($0, $1, $2) { if ($1) { uri.param['fragment'][$1] = $2 } }); uri.seg['path'] = uri.attr.path.replace(/^\/+|\/+$/g, '').split('/'); uri.seg['fragment'] = uri.attr.fragment.replace(/^\/+|\/+$/g, '').split('/'); uri.attr['base'] = uri.attr.host ? uri.attr.protocol + "://" + uri.attr.host + (uri.attr.port ? ":" + uri.attr.port : '') : ''; return uri }; function getAttrName(elm) { var tn = elm.tagName; if (tn !== undefined) return tag2attr[tn.toLowerCase()]; return tn } $.fn.url = function (strictMode) { var url = ''; if (this.length) { url = $(this).attr(getAttrName(this[0])) || '' } return $.url(url, strictMode) }; $.url = function (url, strictMode) { if (arguments.length === 1 && url === true) { strictMode = true; url = undefined } strictMode = strictMode || false; url = url || window.location.toString(); return { data: parseUri(url, strictMode), attr: function (attr) { attr = aliases[attr] || attr; return attr !== undefined ? this.data.attr[attr] : this.data.attr }, param: function (param) { return param !== undefined ? this.data.param.query[param] : this.data.param.query }, fparam: function (param) { return param !== undefined ? this.data.param.fragment[param] : this.data.param.fragment }, segment: function (seg) { if (seg === undefined) { return this.data.seg.path } else { seg = seg < 0 ? this.data.seg.path.length + seg : seg - 1; return this.data.seg.path[seg] } }, fsegment: function (seg) { if (seg === undefined) { return this.data.seg.fragment } else { seg = seg < 0 ? this.data.seg.fragment.length + seg : seg - 1; return this.data.seg.fragment[seg] } } } } })(jQuery);

// jquery.browser
(function (jQuery) {
    var userAgent = navigator.userAgent || "";
    jQuery.uaMatch = function (ua) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
			/(webkit)[ \/]([\w.]+)/.exec(ua) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) ||
			/(msie) ([\w.]+)/.exec(ua) ||
			ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) ||
			[];

        var realBrowser = match[1] || "";
        var version = match[2] || "0";
        var realVersion = version;
        var ieDetection = /(?:trident\/)(\d+)/;
        var ieMatch = ieDetection.exec(ua);
        if (ieMatch != null) {
            realBrowser = 'msie';
            var tv = ieMatch[1];
            if (parseInt(version) >= 7) {
                realVersion = parseInt(tv) + 4;
            }
        }

        return {
            browser: realBrowser,
            version: version,
            realVersion: realVersion
        };
    };

    var matched = jQuery.uaMatch(userAgent);

    jQuery.browser = {};

    if (matched.browser) {
        jQuery.browser[matched.browser] = true;
        jQuery.browser.version = matched.version;
        jQuery.browser.realVersion = matched.realVersion;
    }

    if (jQuery.browser.webkit) {
        jQuery.browser.safari = true;
    }

}(jQuery));