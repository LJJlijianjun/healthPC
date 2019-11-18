 /*
  * auth.js : 用于用户认证，获取sid存入cookie中
  * version : v1.0.0
  * require : jquery
  * CreateTime : 2016-7-01 14:00:00
  * CreateBy : LiYang
  * LastModifyBy : LiYang
  * LastModifyTime : 2016-12-19 14:00:00
  */

var sid = null;

var AuthUtility = {
    Auth: function (callback) {
        $.support.cors = true;
        // 获取cookie中已经有的sid
        sid = $.cookie('GWWealthPlatformBackendsid');
        if (!sid) {
            // cookie中没有
            $.ajax({
                type: 'get',
                url: dataServiceBaseUrl + 'api/Common/Auth',
                async: true,
                cache: false,
                success: function (data) {
                    if (data && data.Success === true && data.Data != "-1") {
                        // 认证成功
                        sid = encodeURIComponent(data.Data);
                        $.cookie('GWWealthPlatformBackendsid', sid, { path: '/' });
                        callback();
                    } else {// 认证失败
                        window.location.href = GWWealthPlatformFrontendWebBaseUrl;
                    }
                    
                }
            });
        } else {
            // cookie中有
            callback();
        }
    }
}