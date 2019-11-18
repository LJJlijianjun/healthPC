/*
 * common.js : 公用js
 * version : v1.0.3
 * require : jquery
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : LiYang
 * LastModifyBy : LiYang
 * LastModifyTime : 2017-01-12 10:00:00
 */

// 数组indexOf方法
if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (elt /*,from*/) {
        var len = this.length >>> 0;
        var from = Number(arguments[1]) || 0;
        from = (from < 0)
            ? Math.ceil(from)
            : Math.floor(from);
        if (from < 0)
            from += len;
        for (; from < len; from++) {
            if (from in this && this[from] === elt)
                return from;
        }
        return -1;
    }
}

//Array.isArray方法兼容ie8
if (!Array.isArray) {
    Array.isArray = function (arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
    }
}

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/(^\s*)|(\s*$)/g, "");
    }
}

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    };
}

if (!Date.prototype.toISOString) {
    (function () {
        function pad(number) {
            var r = String(number);
            if (r.length === 1) {
                r = '0' + r;
            }
            return r;
        }

        Date.prototype.toISOString = function () {
            return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + String((this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
        };
    }());
}

if (!Date.prototype.Format) {
    Date.prototype.Format = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
            "H+": this.getHours(), //小时 
            "m+": this.getMinutes(), //分 
            "s+": this.getSeconds(), //秒 
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
            "S": this.getMilliseconds() //毫秒 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt
                    = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
}

/*********************************************************************************************************************************************/

function formatFileSize(bytes) {
    if (typeof bytes !== 'number') {
        return '';
    }
    if (bytes >= 1073741824) {
        return (bytes / 1073741824).toFixed(2) + ' GB';
    }
    if (bytes >= 1048576) {
        return (bytes / 1048576).toFixed(2) + ' MB';
    }
    return (bytes / 1024).toFixed(2) + ' KB';
}

function getAttachIcon(fileName) {
    var icon;
    var arr = fileName.split('.');
    var type = arr[arr.length - 1].toLowerCase();

    switch (type) {
        case 'xls':
        case 'xlsx':
            icon = "file-excel-o";
            break;

        case "pdf":
            icon = "file-pdf-o";
            break;

        case "doc":
        case "docx":
            icon = "file-word-o";
            break;

        case "ppt":
            icon = "file-powerpoint-o";
            break;

        case "jpg":
        case "png":
        case "jpeg":
        case "bmp":
        case "gif":
        case "pic":
        case "tif":
            icon = "file-image-o";
            break;

        case "mp3":
        case "acm":
        case "aif":
        case "wav":
        case "mid":
        case "au":
        case "wma":
        case "ram":
        case "mmf":
        case "amr":
        case "aac":
        case "flac":
            icon = "file-sound-o";
            break;

        case "avi":
        case "mp4":
        case "flv":
        case "swf":
        case "mov":
        case "mpg":
        case "wmv":
            icon = "file-video-o";
            break;

        case "zip":
        case "rar":
        case "arj":
        case "gz":
        case "z":
        case "7z":
            icon = "file-zip-o";
            break;

        default:
            icon = "file-o";
            break;
    }

    return "fa fa-" + icon + " ";
}

// 格式化时间差
function getDateDiff(currentDateTimeStamp, dateTimeStamp) {
    if (!dateTimeStamp) return '';
    dateTimeStamp = dateTimeStamp.replace(/-/g, '/');

    var result = '';
    var minute = 1000 * 60;
    var hour = minute * 60;
    var day = hour * 24;
    var halfamonth = day * 15;
    var month = day * 30;

    var diffValue = '';
    if (!currentDateTimeStamp) {
        var now = new Date().getTime();
        diffValue = now - Date.parse(new Date(dateTimeStamp));
    } else {
        currentDateTimeStamp = currentDateTimeStamp.replace(/-/g, '/');
        diffValue = Date.parse(new Date(currentDateTimeStamp)) - Date.parse(new Date(dateTimeStamp));
    }

    if (diffValue < 0) {
        //alert("结束日期不能小于开始日期！");
        return result;
    }

    var monthC = diffValue / month;
    var weekC = diffValue / (7 * day);
    var dayC = diffValue / day;
    var hourC = diffValue / hour;
    var minC = diffValue / minute;
    if (monthC >= 1) {
        result = parseInt(monthC) + "个月前";
    }

    else if (weekC >= 1) {
        result = parseInt(weekC) + "周前";
    }

    else if (dayC >= 1) {
        result = parseInt(dayC) + "天前";
    }

    else if (hourC >= 1) {
        result = parseInt(hourC) + "个小时前";
    }

    else if (minC >= 1) {
        result = parseInt(minC) + "分钟前";
    } else {
        result = "刚刚";
    }

    return result;
}

//字符串转换为时间戳  
function getDateTimeStamp(dateStr) {
    if (dateStr) {
        return Date.parse(dateStr.replace(/-/gi, "/"));
    }
}

// jquery-validation使用显示错误信息
function jqValidationShowErrors(errorMap, errorList) {
    $.each(this.successList, function (index, value) {
        return $(value).popover('hide');
    });

    if (errorList && errorList.length > 0) {
        // jquery-validation 会把表单中所有的错误一块抛出来
        return $.each(errorList, function (index, value) {
            // 改为只提示第一个错误，如果页面上错误元素太多，出现了滚动条，而有的元素没有显示在当前屏幕中，弹出消息框的时候会重叠在一起
            if (index === 0) {
                var placement = $(value.element).data('popover-placement');
                if (!placement) placement = 'bottom';

                var _popover = $(value.element).popover({
                    trigger: 'manual',
                    placement: placement,
                    content: value.message,
                    template: '<div class="popover">' +
                                    '<div class="arrow"></div>' +
                                    '<div class="popover-inner">' +
                                        '<div class="popover-content"><p></p></div>' +
                                    '</div>' +
                                  '</div>'
                });
                _popover.data('bs.popover').options.content = value.message;

                // 防止页面滚动后元素不可见，先把页面滚动至元素所在位置顶部让元素显示出来，再弹出消息，否则弹出消息框位置不正确
                // 如果元素是表单中的最后一行，需要把data-popover-placement设置为top
                //alert($(value.element).offset().top);
                $("html,body").animate({ scrollTop: $(value.element).offset().top }, 'fast', function () {
                    return _popover.popover('show');
                });
            }
        });
    }
}

//解决ueditor在粘贴内容时提示“afterPaste”未定义的问题
function afterPaste(body) {

}

function elapsedDays(d) {
    var day = d.substring(0, 10).split('-');
    var publishDate = new Date(parseInt(day[0]), parseInt(day[1]) - 1, parseInt(day[2]));
    var diffDays = parseInt(((new Date()) - publishDate) / (1000 * 60 * 60 * 24));
    return diffDays;
}

// 图片按容器尺寸居中显示，自动缩放比例
function fitImage($img, imgWrapperWidth, imgWrapperHeight) {
    var image = new Image();
    image.onload = function () {
        var scale = 1;
        //缩放比例
        if (image.width > 0 && image.height > 0) {
            var wScale = imgWrapperWidth / image.width;
            var hScale = imgWrapperHeight / image.height;
            if (Math.abs(wScale - hScale) < 0.5) {// 0.5：该数值越大，图片被截掉的越多
                scale = (wScale < hScale) ? hScale : wScale;
            } else {
                scale = (wScale < hScale) ? wScale : hScale;
            }
            var newWidth = Math.round(image.width * scale);
            var newHeight = Math.round(image.height * scale);
            var marginLeft = Math.round((imgWrapperWidth - newWidth) / 2);
            var marginTop = Math.round((imgWrapperHeight - newHeight) / 2);
            $img.css('position', 'absolute');
            $img.css('max-width', '100000px');//设置一个比较大的尺寸，把空间撑开。不加这条有些地方运行不正常，原理不清楚
            $img.css('width', newWidth);
            $img.css('height', newHeight);
            $img.css('left', marginLeft);
            $img.css('top', marginTop);
        } else {//不能获取图片尺寸，则默认拉伸
            $img.css('width', imgWrapperWidth);
            $img.css('height', imgWrapperHeight);
        }
    };
    image.src = $img.attr('src');
}

// 检查IE版本
function checkIEVersion() {
    var result = true;

    if ($.browser.msie) {
        var ieVersionCheckResult = 0;
        if ($.browser.realVersion == 11 && parseInt($.browser.version) <= 7) {
            ieVersionCheckResult = 2;
        }
        else if ($.browser.realVersion == 10 && parseInt($.browser.version) < 7) {
            ieVersionCheckResult = 2;
        }
        else if ($.browser.realVersion == 8 && parseInt($.browser.version) < 7) {
            ieVersionCheckResult = 2;
        }
        else if ($.browser.realVersion < 8) {
            ieVersionCheckResult = 1;
        }

        if (ieVersionCheckResult != 0) {
            var ieUpgradeContent = '<div class="UpgradeIe">' +
            '<div class="UpgradeIeIcon">' +
            '   <img src="/webpub/Images/UpgradeIeIcon.jpg" alt="" />' +
            '</div>' +
            '<div class="UpgradeIeText">你的IE浏览器版本低于8.0，页面显示不正常，请升级到最新版本。</div>' +
            '<div class="UpgradeDownload">' +
            '   <a class="UpgradeIeA mr15" href="http://hq-fs1.chamc.com.cn/download/application/IE10-Windows6.1-x86-zh-cn.exe" target="_blank">IE10浏览器安装文件（32位）</a>' +
            '   <a class="UpgradeIeA" href="http://hq-fs1.chamc.com.cn/download/application/IE10-Windows6.1-x64-zh-cn.exe" target="_blank">IE10浏览器安装文件（64位）</a>' +
            '</div>' +
            '<div class="UpgradeIeCloseIcon none">' +
            '   <img src="/webpub/Images/UpgradeIeCloseIcon.jpg" alt="" />' +
            '</div>' +
            '</div>';
            $('body').html(ieUpgradeContent);

            // IE浏览器使用了低于IE8的兼容性视图
            if (ieVersionCheckResult == 2) {
                $('.UpgradeIe').show();
                $('.UpgradeIeText').html('你的IE浏览器使用了低于IE8的兼容性视图，导致页面显示可能不正常，请与系统管理员联系。');
                $('.UpgradeDownload').hide();
            }
                // IE浏览器版本低于8
            else if (ieVersionCheckResult == 1) {
                $('.UpgradeIe').show();
            }

            result = false;
        }
    }

    return result;
}

function G() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

// 生成GUID
function newGuid() {
    var guid = (G() + G() + "-" + G() + "-" + G() + "-" + G() + "-" + G() + G() + G()).toUpperCase();
    return guid;
}

function getClientInfo() {
    var _clientInfo = {
        BrowserType: platform.name,
        BrowserVersion: platform.version,
        BrowserPlatform: platform.os.toString(),
        Screen: { Width: screen.width, Height: screen.height }
    }

    return JSON.stringify(_clientInfo);
}

// 是否包含特殊字符和SQL关键字，防止SQL注入
function AntiSqlInject(value) {
    var reg = /\b(=|'|\*|or|create|%|select|update|alter|and|insert|delete|drop|truncate|declare|join|union|exec|count)\b/i;
    return reg.test(value);
}

// 添加页面访问统计信息
function pageVisited() {
    $.ajax({
        type: 'post',
        url: dataServiceBaseUrl + 'api/Common/Common/PageVisited?clientInfo=' + getClientInfo() + '&sid=' + sid,
        data: {
            RefererURL: document.referrer
        }
    });
}

window.onload = function () {
    // 屏蔽鼠标右键
    //document.oncontextmenu = function () {
    //    return false;
    //}

    // 屏蔽Ctrl+N、Shift+F10、F11、F5刷新、退格键  
    document.onkeydown = function (event) {
        var e = window.event || event;
        //if (e.keyCode == 122) {                   //屏蔽F11
        //    return false;
        //}
        //if (e.keyCode == 123) {                   //屏蔽F12
        //    return false;
        //}
        if ((e.altKey) &&
              ((e.keyCode == 37) ||            //屏蔽Alt+方向键←   
              (e.keyCode == 39))) {            //屏蔽Alt+方向键→
            return false;
        }
        //if (
        //    (e.keyCode == 116) ||                   //屏蔽F5刷新键   
        //(e.ctrlKey && e.keyCode == 82)) {   //Ctrl+R   
        //    return false;
        //}

        if (e.keyCode == 8) {  // backspace
            var act = document.activeElement;
            if ((act.type == 'text' || act.type == 'password' || act.type == 'textarea' || act.type == 'search') && act.readOnly == false && act.disabled == false) {
                return true;
            } else {
                return false;
            }
        }
    }
}

/* 编辑页面通用方法 begin */

// 检查是否有未上传的文件
function checkFileUploadState() {
    var unUploadFiles = $('.fileTable .files .template-upload .btn.start');
    if (unUploadFiles.length > 0) {
        var _popover = $(unUploadFiles[0]).popover({
            trigger: 'manual',
            placement: 'left',
            content: '文件未上传！',
            template: '<div class="popover">' +
                            '<div class="arrow"></div>' +
                            '<div class="popover-inner">' +
                                '<div class="popover-content"><p></p></div>' +
                            '</div>' +
                          '</div>'
        });
        _popover.data('bs.popover').options.content = '文件未上传！';

        $("html").animate({ scrollTop: $(unUploadFiles[0]).offset().top }, 'fast', function () {
            _popover.popover('show');

            $.each(unUploadFiles, function (i, item) {
                if (i > 0 && elementInViewport(item)) {
                    var popover = $(item).popover({
                        trigger: 'manual',
                        placement: 'left',
                        content: '文件未上传！',
                        template: '<div class="popover">' +
                                        '<div class="arrow"></div>' +
                                        '<div class="popover-inner">' +
                                            '<div class="popover-content"><p></p></div>' +
                                        '</div>' +
                                      '</div>'
                    });
                    popover.data('bs.popover').options.content = '文件未上传！';
                    popover.popover('show');
                }
            });
        });

        return false;
    }
    return true;
}

function elementInViewport(el) {
    var rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= getHeight() &&
      rect.right <= getWidth()
    );
}

function getHeight() {
    if (window.innerHeight) {
        return window.innerHeight;
    } else {
        return Math.min(document.documentElement.clientHeight, document.body.clientHeight);
    }
}

function getWidth() {
    if (window.innerWidth) {
        return window.innerWidth;
    } else {
        return Math.min(document.documentElement.clientWidth, document.body.clientWidth);
    }
}

/* 编辑页面通用方法 end */

/* 列表页面通用方法 begin */

// 隐藏未读图标
function hideReadFlag(id, moduleType) {
    var table;

    switch (moduleType) {
        case 1:
            if ($('#newsList').length === 1) {
                table = $('.newsInfo .panel-body');
            } else {
                table = $('.dataList');
            }
            break;

        case 2:
            if ($('#productList').length === 1) {
                table = $('.productInfo .panel-body');
            } else {
                table = $('.dataList');
            }
            break;

        case 3:
            if ($('#projectList').length === 1) {
                table = $('.projectInfo .panel-body');
            } else {
                table = $('.dataList');
            }
            break;

        case 4:
            table = $('.dataList');
            break;

        case 5:
            table = $('.dataList');
            break;

        default:
            return;
    }

    if (table && table.length === 1) {
        var row = table.find('.table-container .table-content-container .table-row[data-moduletype="' + moduleType + '"][data-id="' + id + '"]');
        if (row && row.length === 1) {
            var readFlagCell = row.find('.ReadFlag');
            if (readFlagCell.length === 1 && readFlagCell.is(':visible') && readFlagCell.html() != '') {
                readFlagCell.empty();
                var readFlagCells = table.find('.table-container .table-content-container .table-row .ReadFlag');
                if (readFlagCells && readFlagCells.length > 0) {
                    var hide = true;
                    for (var i = 0; i < readFlagCells.length; i++) {
                        if ($(readFlagCells[i]).is(':visible') && $(readFlagCells[i]).html() != '') {
                            hide = false;
                            break;
                        }
                    }
                    if (hide === true) {
                        table.GWDataTable('hideColumn', 'ReadFlag');
                    }
                }
            }
        }
    }
}

// 设置标题列的图标样式（New\Top\NewTop）
function setTitleClass(table) {
    $(table).find('.table-row a').each(function () {
        var titleClass = $(this).data('titleclass');
        if (titleClass) {
            if (($(this).outerWidth() + 13) >= ($(this).parent().width() - 16)) {
                $(this).removeClass(titleClass);
                $(this).parent().addClass(titleClass);
            } else {
                $(this).addClass(titleClass);
                $(this).parent().removeClass(titleClass);
            }
        }
    });
}

// 下载文件
function downLoadFile(obj) {
    $('#hidFileFrame').attr('src', $(obj).data('downloadurl'));
    return false;
}

/* 列表页面通用方法 end */


/* 阅读页面通用方法 begin */

// 绑定文件列表
function bindFileList(container, mode, data) {
    if (data && data.length > 0) {
        for (var i = 0; i < data.length; i++) {
            var fileLink = '';

            // Read
            if (mode === 1) {
                var fileType = data[i].FileExtType.toLowerCase();
                if (fileType == 'jpg' || fileType == 'jpeg' || fileType == 'png' || fileType == 'bmp' || fileType == 'pic' || fileType == 'tif') {
                    fileLink = '<a data-lightbox="{0}" data-title="{1}" title="{1}" href="{2}">{3}</a>'.format(container,
                        data[i].OriginFileName,
                        dataServiceBaseUrl + 'api/Common/FileManage?ids={0}&sid={1}'.format(data[i].FileID, sid),
                        data[i].OriginFileName + '（' + formatFileSize(data[i].FileLength) + '）');
                }
                else if (fileType == 'pdf' && !($.browser && $.browser.msie && parseInt($.browser.version) < 9)) {
                    fileLink = '<a title="{0}" href="{1}" target="_blank">{2}</a>'.format(data[i].OriginFileName,
                        '../../../assets/vendors/pdf.js/web/viewer.html?fileId=' + data[i].FileID + '&fileName=' + encodeURIComponent(data[i].OriginFileName),
                        data[i].OriginFileName + '（' + formatFileSize(data[i].FileLength) + '）');
                }
                else {
                    fileLink = '<span title="{0}" onclick="{1}">{2}</span>'.format(data[i].OriginFileName, 'downloadFile(' + data[i].FileID + ');',
                        data[i].OriginFileName + '（' + formatFileSize(data[i].FileLength) + '）');
                }
            }
            else {  // Preview
                fileLink = '<span title="{0}">{1}</span>'.format(data[i].OriginFileName, data[i].OriginFileName + '（' + formatFileSize(data[i].FileLength) + '）');
            }

            $('.' + container + ' .attachList').append('<div data-fileid="' + data[i].FileID + '">' +
                                                                      '<i class="' + getAttachIcon(data[i].FileExtType) + '"></i>' + fileLink +
                                                                   '</div>');
        }
        $('.' + container).show();
    }
}

// 加载问题列表
function loadDiscussInfo(moduleTypeKV, itemId) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/GetDiscussInfo?moduleTypeKV=' + moduleTypeKV + '&itemId=' + itemId + '&sid=' + sid,
        type: 'get',
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data) {
                $('.questionList .head .statistics').data('questioncount', data.Data.DiscussInfo.questionCount);
                $('.questionList .head .statistics').data('answercount', data.Data.DiscussInfo.answerCount);
                $('.questionList .head .statistics').html('{0}提问&nbsp;&nbsp;·&nbsp;&nbsp;{1}回复'.format(data.Data.DiscussInfo.questionCount, data.Data.DiscussInfo.answerCount));
                $('.questionList .questionListDetail').empty();
                if (data.Data.DiscussInfo.rows.length > 0) {
                    // 绑定数据
                    $(data.Data.DiscussInfo.rows).each(function () {
                        var row = this;

                        // 问题
                        var questionDetail = $('<div class="questionDetail"></div>');
                        var question = $('<div class="question" data-questionid="' + row.QuestionID + '"></div>');
                        var questionToolbar = '';
                        if (row.IsQuestionCreateUser === 1 && !row.AnswerID) {
                            questionToolbar = '<a class="modify ml10">修改</a><a class="cancel ml10 none">取消</a><a class="delete ml10">删除</a>';
                        }
                        question.append('<div>' +
                                                    '<span class="font14 black">问题：</span>' +
                                                       '<span class="toolbar">' +
                                                           questionToolbar +
                                                       '</span>' +
                                                  '</div>');
                        question.append('<div class="questionContent">' +
                                                    '<div class="showContent">' + row.QuestionContent + '</div>' +
                                                    (questionToolbar ? '<textarea class="form-control editContent" rows="3" maxlength="200" placeholder="在此输入问题内容..."></textarea>' : '') +
                                                  '</div>');
                        question.append('<div class="textRight">' +
                                                    '<span>' + row.QuestionCreateUserName + '</span>' +
                                                    '<span class="ml10">' + getDateDiff(data.Data.CurrentDateTime, row.QuestionLastModifyTime) + '</span>' +
                                                  '</div>');
                        questionDetail.append(question);

                        // 回复
                        if (row.AnswerID || data.Data.HasAnswerRight === true) {
                            var answer = $('<div class="answer" data-answerid="' + (row.AnswerID ? row.AnswerID : 0) + '"></div>');

                            var answerToolbar = '';
                            if (row.AnswerID && row.IsAnswerCreateUser === 1) {
                                answerToolbar = '<a class="modify ml10">修改</a><a class="cancel ml10 none">取消</a><a class="delete ml10">删除</a>';
                            }
                            if (!row.AnswerID) {
                                answerToolbar = '<a class="modify ml10">回复</a><a class="cancel ml10 none">取消</a><a class="delete ml10 none">删除</a>';
                            }

                            answer.append('<div><span class="font14 black">#答复：</span>' +
                                                      '<span class="toolbar">' +
                                                        answerToolbar +
                                                      '</span>' +
                                                   '</div>');

                            answer.append('<div class="answerContent">' +
                                                       '<div class="showContent">' + (row.AnswerContent ? row.AnswerContent : '') + '</div>' +
                                                       ((row.IsAnswerCreateUser === 1 || !row.AnswerID) ? '<textarea class="form-control editContent" rows="3" maxlength="500" placeholder="在此输入回复内容..."></textarea>' : '') +
                                                   '</div>');

                            if (row.AnswerID) {
                                answer.append('<div class="textRight">' +
                                                          '<span>' + row.AnswerCreateUserName + '</span>' +
                                                          '<span class="ml10">' + getDateDiff(data.Data.CurrentDateTime, row.AnswerLastModifyTime) + '</span>' +
                                                       '</div>');
                            } else {
                                answer.append('<div class="textRight none">' +
                                                        '<span>' + data.Data.UserName + '</span>' +
                                                        '<span class="ml10">刚刚</span>' +
                                                     '</div>');
                            }
                            questionDetail.append(answer);
                        }

                        $('.questionList .questionListDetail').append(questionDetail);
                    });

                    // 设置事件
                    $('.questionList .questionListDetail .questionDetail').each(function () {
                        var questionDetail = $(this);

                        questionDetail.find('.question .modify').on('click', function () {
                            var self = this;
                            var questionId = $(self).parent().parent().parent().data('questionid');
                            var questionContent;
                            if ($(self).text() === '修改') {
                                questionContent = questionDetail.find('.questionContent .showContent').hide().text().trim();
                                questionDetail.find('.questionContent .editContent').show().focus().val(questionContent);
                                $(self).text('确定');
                                $(self).next().show();
                                $(self).next().next().hide();
                            } else {
                                questionContent = questionDetail.find('.questionContent .editContent').val().trim();
                                if (questionContent) {
                                    updateQuestion(questionId, questionContent, function (msg) {
                                        if (msg === 'answerd') {
                                            loadDiscussInfo(moduleTypeKV, itemId);
                                        } else {
                                            questionDetail.find('.questionContent .editContent').hide();
                                            questionDetail.find('.questionContent .showContent').text(questionContent).show();
                                            $(self).text('修改');
                                            $(self).next().hide();
                                            $(self).next().next().show();
                                            $(self).parent().parent().next().next().find('.ml10').text('刚刚');
                                        }
                                    });
                                }
                            }
                        });
                        questionDetail.find('.answer .modify').on('click', function () {
                            var self = this;
                            var questionId = $(self).parent().parent().parent().prev().data('questionid');
                            var answerContent;

                            if ($(self).text() === '回复') {
                                questionDetail.find('.answerContent .showContent').hide();
                                questionDetail.find('.answerContent .editContent').val('').show().focus();
                                $(self).data('mode', 'add');
                                $(self).text('确定');
                                $(self).next().show();
                            } else if ($(self).text() === '确定') {
                                if ($(self).data('mode') === 'add') {
                                    answerContent = questionDetail.find('.answerContent .editContent').val().trim();
                                    if (answerContent) {
                                        addAnswer(moduleTypeKV, itemId, questionId, answerContent, function (answerId) {
                                            $(self).parent().parent().parent().data('answerid', answerId);
                                            questionDetail.find('.answerContent .editContent').hide();
                                            questionDetail.find('.answerContent .showContent').text(answerContent).show();
                                            $(self).text('修改');
                                            $(self).next().hide();
                                            $(self).next().next().show();
                                            $(self).parent().parent().next().next().find('.ml10').text('刚刚');
                                            $(self).parent().parent().next().next().show();
                                            var questionCount = $('.questionList .head .statistics').data('questioncount');
                                            $('.questionList .head .statistics').data('questioncount', questionCount);
                                            var answerCount = parseInt($('.questionList .head .statistics').data('answercount')) + 1;
                                            $('.questionList .head .statistics').data('answercount', answerCount);
                                            $('.questionList .head .statistics').html('{0}提问&nbsp;&nbsp;·&nbsp;&nbsp;{1}回复'.format(questionCount, answerCount));
                                        });
                                    }
                                } else if ($(self).data('mode') === 'update') {
                                    answerContent = questionDetail.find('.answerContent .editContent').val().trim();
                                    if (answerContent) {
                                        updateAnswer($(self).parent().parent().parent().data('answerid'), answerContent, function () {
                                            questionDetail.find('.answerContent .editContent').hide();
                                            questionDetail.find('.answerContent .showContent').text(answerContent).show();
                                            $(self).text('修改');
                                            $(self).next().hide();
                                            $(self).next().next().show();
                                        });
                                    }
                                }
                            } else if ($(self).text() === '修改') {
                                answerContent = questionDetail.find('.answerContent .showContent').hide().text().trim();
                                questionDetail.find('.answerContent .editContent').show().focus().val(answerContent);
                                $(self).data('mode', 'update');
                                $(self).text('确定');
                                $(self).next().show();
                                $(self).next().next().hide();
                            }
                        });

                        questionDetail.find('.question .cancel').on('click', function () {
                            var self = this;
                            questionDetail.find('.questionContent .showContent').show();
                            questionDetail.find('.questionContent .editContent').hide();
                            $(self).prev().text('修改');
                            $(self).hide();
                            $(self).next().show();
                        });
                        questionDetail.find('.answer .cancel').on('click', function () {
                            var self = this;
                            questionDetail.find('.answerContent .showContent').show();
                            questionDetail.find('.answerContent .editContent').hide();
                            if ($(self).prev().data('mode') === 'add') {
                                $(self).prev().text('回复');
                            } else if ($(self).prev().data('mode') === 'update') {
                                $(self).prev().text('修改');
                                $(self).next().show();
                            }
                            $(self).hide();
                        });

                        questionDetail.find('.question .delete').on('click', function () {
                            var self = this;
                            bootbox.confirm({
                                message: '确定要删除吗？',
                                size: 'small',
                                callback: function (result) {
                                    if (result === true) {
                                        var questionId = $(self).parent().parent().parent().data('questionid');
                                        deleteQuestion(questionId, function (msg) {
                                            if (msg === 'answerd') {
                                                loadDiscussInfo(moduleTypeKV, itemId);
                                            } else {
                                                $(self).parent().parent().parent().parent().remove();
                                                var questionCount = parseInt($('.questionList .head .statistics').data('questioncount')) - 1;
                                                $('.questionList .head .statistics').data('questioncount', questionCount);
                                                var answerCount = $('.questionList .head .statistics').data('answercount');
                                                $('.questionList .head .statistics').data('answercount', answerCount);
                                                $('.questionList .head .statistics').html('{0}提问&nbsp;&nbsp;·&nbsp;&nbsp;{1}回复'.format(questionCount, answerCount));
                                            }
                                        });
                                    }
                                }
                            });
                        });
                        questionDetail.find('.answer .delete').on('click', function () {
                            var self = this;
                            bootbox.confirm({
                                message: '确定要删除吗？',
                                size: 'small',
                                callback: function (result) {
                                    if (result === true) {
                                        var answerId = $(self).parent().parent().parent().data('answerid');
                                        deleteAnswer(answerId, function () {
                                            $(self).hide();
                                            $(self).prev().prev().text('回复');
                                            $(self).parent().parent().next().find('.showContent').text('');
                                            $(self).parent().parent().next().next().hide();

                                            var questionCount = $('.questionList .head .statistics').data('questioncount');
                                            $('.questionList .head .statistics').data('questioncount', questionCount);
                                            var answerCount = parseInt($('.questionList .head .statistics').data('answercount')) - 1;
                                            $('.questionList .head .statistics').data('answercount', answerCount);

                                            $('.questionList .head .statistics').html('{0}提问&nbsp;&nbsp;·&nbsp;&nbsp;{1}回复'.format(questionCount, answerCount));
                                        });
                                    }
                                }
                            });
                        });
                    });

                    // 定位
                    var qid = $.url().fparam('qid');
                    if (qid) {
                        var q = $('.questionList .questionListDetail').find('.questionDetail .question[data-questionid="' + qid + '"]');
                        if (q && q.length === 1) {
                            if ($.browser && $.browser.msie && parseInt($.browser.version) === 8) {
                                setTimeout(function () {
                                    $("html,body").animate({ scrollTop: $(q).offset().top - 5 }, 0, function () {
                                        $(q).parent().addClass('questionFocus');
                                    });
                                }, 500);
                            }
                            else {
                                $("html,body").animate({ scrollTop: $(q).offset().top - 5 }, 0, function () {
                                    $(q).parent().addClass('questionFocus');
                                });
                            }
                        }
                        if (window.opener != null && window.opener != undefined && (typeof (window.opener.refreshQuestionCount) == 'function' || typeof (window.opener.refreshQuestionCount) == 'object')) {
                            window.opener.refreshQuestionCount();
                        }
                    }
                }
            } else {
                bootbox.alert({ message: '加载问题列表失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '加载问题列表失败！' });
        }
    });
}

// 提交问题
function addQuestion(moduleTypeKV, itemId) {
    var questionContent = $('#txtQuestionContent').val().trim();
    if (questionContent) {
        $.ajax({
            url: dataServiceBaseUrl + 'api/Common/Common/AddQuestion?sid=' + sid,
            type: 'post',
            data: {
                ModuleTypeKV: moduleTypeKV,
                ItemID: itemId,
                QuestionContent: filterXSS(questionContent)
            },
            async: true,
            cache: false,
            success: function (data) {
                if (data && data.Success === true && data.Data > 0) {
                    $('#txtQuestionContent').val('');
                    loadDiscussInfo(moduleTypeKV, itemId);
                    if (window.opener != null && window.opener != undefined && (typeof (window.opener.refreshAnswerCount) == 'function' || typeof (window.opener.refreshAnswerCount) == 'object')) {
                        window.opener.refreshAnswerCount();
                    }
                }
                else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                    window.location.href = '../Common/NoRight.html';
                }
                else if (data.Message === 'NotAllowed') {
                    bootbox.alert({ message: '当前状态不可以提问！' });
                }
                else {
                    bootbox.alert({ message: '提交失败！' });
                }
            },
            error: function () {
                bootbox.alert({ message: '提交失败！' });
            }
        });
    }
}

// 修改问题
function updateQuestion(questionId, questionContent, callback) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/UpdateQuestion?sid=' + sid,
        type: 'put',
        data: {
            ID: questionId,
            QuestionContent: filterXSS(questionContent)
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data === 0) {
                callback();
            }
            else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                window.location.href = '../Common/NoRight.html';
            }
            else if (data.Message === 'Answerd') {
                bootbox.alert({ message: '问题已经被回复，修改失败！' });
                callback('answerd');
            }
            else {
                bootbox.alert({ message: '提交失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '提交失败！' });
        }
    });
}

// 删除问题
function deleteQuestion(questionId, callback) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/DeleteQuestion?sid=' + sid,
        type: 'delete',
        data: {
            ID: questionId
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data === 0) {
                callback();
                if (window.opener != null && window.opener != undefined && (typeof (window.opener.refreshAnswerCount) == 'function' || typeof (window.opener.refreshAnswerCount) == 'object')) {
                    window.opener.refreshAnswerCount();
                }
            }
            else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                window.location.href = '../Common/NoRight.html';
            }
            else if (data.Message === 'Answerd') {
                bootbox.alert({ message: '问题已经被回复，删除失败！' });
                callback('answerd');
            }
            else {
                bootbox.alert({ message: '删除失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '删除失败！' });
        }
    });
}

// 回复问题
function addAnswer(moduleTypeKV, itemId, questionId, answerContent, callback) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/AddAnswer?sid=' + sid,
        type: 'post',
        data: {
            ModuleTypeKV: moduleTypeKV,
            ItemID: itemId,
            QuestionID: questionId,
            AnswerContent: filterXSS(answerContent)
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data > 0) {
                callback(data.Data);
                if (window.opener != null && window.opener != undefined && (typeof (window.opener.refreshAnswerCount) == 'function' || typeof (window.opener.refreshAnswerCount) == 'object')) {
                    window.opener.refreshAnswerCount();
                }
            }
            else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                window.location.href = '../Common/NoRight.html';
            }
            else if (data.Message === 'Answerd') {
                bootbox.alert({ message: '问题已经被其它人回复，提交失败！' });
            }
            else {
                bootbox.alert({ message: '提交失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '提交失败！' });
        }
    });
}

// 修改回复
function updateAnswer(answerId, answerContent, callback) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/UpdateAnswer?sid=' + sid,
        type: 'put',
        data: {
            ID: answerId,
            AnswerContent: filterXSS(answerContent)
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data === 0) {
                callback();
            }
            else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                window.location.href = '../Common/NoRight.html';
            }
            else {
                bootbox.alert({ message: '提交失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '提交失败！' });
        }
    });
}

// 删除回复
function deleteAnswer(answerId, callback) {
    $.ajax({
        url: dataServiceBaseUrl + 'api/Common/Common/DeleteAnswer?sid=' + sid,
        type: 'delete',
        data: {
            ID: answerId
        },
        async: true,
        cache: false,
        success: function (data) {
            if (data && data.Success === true && data.Data === 0) {
                callback();
                if (window.opener != null && window.opener != undefined && (typeof (window.opener.refreshAnswerCount) == 'function' || typeof (window.opener.refreshAnswerCount) == 'object')) {
                    window.opener.refreshAnswerCount();
                }
            }
            else if (data.Message === 'NoPermisson' || data.Message === 'InvalidUser') {
                window.location.href = '../Common/NoRight.html';
            }
            else {
                bootbox.alert({ message: '删除失败！' });
            }
        },
        error: function () {
            bootbox.alert({ message: '删除失败！' });
        }
    });
}

// 下载文件
function downloadFile(fileIds) {
    var downloadUrl = dataServiceBaseUrl + 'api/Common/FileManage?ids={0}&sid={1}'.format(fileIds, sid);
    $('#hidFileFrame').attr('src', downloadUrl);
}

/* 阅读页面通用方法 end */

/* 
  打开人员信息简介窗口 
  传入参数：用户域账号
 */
function openUserProfile(userAccountId) {
    var userProfileModal = document.getElementById('userProfileModal');
    var url = '../Common/UserProfile.html?userAccountId=' + userAccountId + '&t=' + new Date().getMilliseconds();
    if (!userProfileModal) {
        userProfileModal = '<div class="modal fade" id="userProfileModal" tabindex="-1" role="dialog" aria-hidden="true">' +
                                    '<div class="modal-dialog">' +
                                      '<div class="modal-content">' +
                                        '<div class="modal-body">' +
                                          '<iframe src="' + url + '" frameborder="0" style="border-radius: 8px;"></iframe>' +
                                        '</div>' +
                                        '</div>' +
                                      '</div>' +
                                 '</div>';
        $('body').append(userProfileModal);
    }
    else {
        $(userProfileModal).find('iframe').attr('src', url);
    }
    $('#userProfileModal').modal();
}

/*  关闭人员信息简介窗口 */
function closeUserProfile() {
    $('#userProfileModal').modal('hide');
}

var HtmlEncode = function (str) {
    var hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f');
    var preescape = str;
    var escaped = "";
    for (var i = 0; i < preescape.length; i++) {
        var p = preescape.charAt(i);
        escaped = escaped + escapeCharx(p);
    }

    return escaped;

    function escapeCharx(original) {
        var found = true;
        var thechar = original.charCodeAt(0);
        switch (thechar) {
            case 10: return "<br/>"; break; //newline
            case 32: return "&nbsp;"; break; //space
            case 34: return "&quot;"; break; //"
            case 38: return "&amp;"; break; //&
            case 39: return "&#x27;"; break; //'
            case 47: return "&#x2F;"; break; // /
            case 60: return "&lt;"; break; //<
            case 62: return "&gt;"; break; //>
            case 198: return "&AElig;"; break;
            case 193: return "&Aacute;"; break;
            case 194: return "&Acirc;"; break;
            case 192: return "&Agrave;"; break;
            case 197: return "&Aring;"; break;
            case 195: return "&Atilde;"; break;
            case 196: return "&Auml;"; break;
            case 199: return "&Ccedil;"; break;
            case 208: return "&ETH;"; break;
            case 201: return "&Eacute;"; break;
            case 202: return "&Ecirc;"; break;
            case 200: return "&Egrave;"; break;
            case 203: return "&Euml;"; break;
            case 205: return "&Iacute;"; break;
            case 206: return "&Icirc;"; break;
            case 204: return "&Igrave;"; break;
            case 207: return "&Iuml;"; break;
            case 209: return "&Ntilde;"; break;
            case 211: return "&Oacute;"; break;
            case 212: return "&Ocirc;"; break;
            case 210: return "&Ograve;"; break;
            case 216: return "&Oslash;"; break;
            case 213: return "&Otilde;"; break;
            case 214: return "&Ouml;"; break;
            case 222: return "&THORN;"; break;
            case 218: return "&Uacute;"; break;
            case 219: return "&Ucirc;"; break;
            case 217: return "&Ugrave;"; break;
            case 220: return "&Uuml;"; break;
            case 221: return "&Yacute;"; break;
            case 225: return "&aacute;"; break;
            case 226: return "&acirc;"; break;
            case 230: return "&aelig;"; break;
            case 224: return "&agrave;"; break;
            case 229: return "&aring;"; break;
            case 227: return "&atilde;"; break;
            case 228: return "&auml;"; break;
            case 231: return "&ccedil;"; break;
            case 233: return "&eacute;"; break;
            case 234: return "&ecirc;"; break;
            case 232: return "&egrave;"; break;
            case 240: return "&eth;"; break;
            case 235: return "&euml;"; break;
            case 237: return "&iacute;"; break;
            case 238: return "&icirc;"; break;
            case 236: return "&igrave;"; break;
            case 239: return "&iuml;"; break;
            case 241: return "&ntilde;"; break;
            case 243: return "&oacute;"; break;
            case 244: return "&ocirc;"; break;
            case 242: return "&ograve;"; break;
            case 248: return "&oslash;"; break;
            case 245: return "&otilde;"; break;
            case 246: return "&ouml;"; break;
            case 223: return "&szlig;"; break;
            case 254: return "&thorn;"; break;
            case 250: return "&uacute;"; break;
            case 251: return "&ucirc;"; break;
            case 249: return "&ugrave;"; break;
            case 252: return "&uuml;"; break;
            case 253: return "&yacute;"; break;
            case 255: return "&yuml;"; break;
            case 162: return "&cent;"; break;
            case '\r': break;
            default:
                found = false;
                break;
        }
        if (!found) {
            if (thechar > 127) {
                var c = thechar;
                var a4 = c % 16;
                c = Math.floor(c / 16);
                var a3 = c % 16;
                c = Math.floor(c / 16);
                var a2 = c % 16;
                c = Math.floor(c / 16);
                var a1 = c % 16;
                return "&#x" + hex[a1] + hex[a2] + hex[a3] + hex[a4] + ";";
            }
            else {
                return original;
            }
        }
    }
}
