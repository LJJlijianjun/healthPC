/**
 * gw-selectOrg.js : 顶级机构及下一级部门选择工具。
 * version : v1.0.1
 * require : jquery.js、jquery-tools.js 、font-awesome.js 、iCheck.js
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : kfzhang
 * LastModifyBy : liyang
 * LastModifyTime : 2017-2-23 09:22:00
 */

(function ($) {
    var setting;
    $.fn.GWSelectOrg = function (options) {
        var defaultVal = {
            allowClear: true, // 显示清空‘x’按钮
            data: null, // 要加载的数据
            dataUrl: null, // 加载的数据源地址
            dataListType: 'OrgDeptList',  // 显示数据类型（数据来源：OrgController.cs，方法GetTopOrgList、GetOrgDeptList），OrgDeptList显示了所有机构（总部、分公司、平台公司），TopOrgList只显示某个机构  
            defaultValue: [0],
            defaultName: [],
            method: 'get', // 加载方式
            async: true, // 是否异步
            cache: false, // 是否缓存
            dataType: 'json', // 接收响应数据类型
            singleSelect: false, // 是否单选
            beforeSend: null, // 请求发送前事件。
            onLoadingError: null, // 加载请求出现错误事件。
            onDataLoaded: null, // 接收到响应数据事件。
            onDataLoadCompleted: null, // 数据加载完成事件
            onSelelcted: null // 点击确定按钮事件
        };

        var $args = arguments;
        var $plugin = this;

        var getSelectedOrgs = function () {
            var arrSelectedOrg = [];
            $('.orgSelector input[type=checkbox]:checked', $($plugin)).each(function () {
                if (setting.dataListType == 'OrgDeptList') {
                    if ($(this).hasClass('selectAll')) {
                        arrSelectedOrg.push({ 'OrgId': 0, 'OrgName': '全公司' });
                        return false;
                    } else if ($(this).hasClass('itemAll')) {

                    } else {
                        arrSelectedOrg.push({
                            'OrgId': $(this).parent().parent().data('orgid'),
                            'OrgName': $(this).parent().next().text(),
                            'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                            'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                        });
                    }
                } else {
                    if (!$(this).hasClass('selectAll') && !$(this).hasClass('itemAll')) {
                        arrSelectedOrg.push({
                            'OrgId': $(this).parent().parent().data('orgid'),
                            'OrgName': $(this).parent().next().text(),
                            'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                            'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                        });
                    }
                }
            });
            return arrSelectedOrg;
        }

        var getSelectedOrgIDs = function () {
            var arrSelectedOrgID = [];
            $('.orgSelector input[type=checkbox]:checked', $($plugin)).each(function () {
                if (setting.dataListType == 'OrgDeptList') {
                    if ($(this).hasClass('selectAll')) {
                        arrSelectedOrgID.push(0);
                        return false;
                    } else if ($(this).hasClass('itemAll')) {

                    } else {
                        arrSelectedOrgID.push($(this).parent().parent().data('orgid'));
                    }
                } else {
                    if (!$(this).hasClass('selectAll') && !$(this).hasClass('itemAll')) {
                        arrSelectedOrgID.push($(this).parent().parent().data('orgid'));
                    }
                }
            });
            return arrSelectedOrgID;
        }

        var reSetSelected = function () {
            if (setting.defaultValue.length > 0) {
                if (setting.defaultValue.length == 1 && setting.defaultValue[0] == 0) {
                    $plugin.find('.tags-label input[type=checkbox]').iCheck('check');
                } else {
                    $plugin.find('.tags-label input[type=checkbox]').iCheck('uncheck');
                    for (var i = 0; i < setting.defaultValue.length; i++) {
                        $this = $($plugin.find('.orgSelector')).find('.tags-label[data-orgid=' + setting.defaultValue[i] + ']').find('input[type=checkbox]');
                        if (setting.singleSelect) {
                            if ($this.hasClass('selectAll')) {
                                return false;
                            } else if ($this.hasClass('itemAll')) {
                                return false;
                            } else {
                                $plugin.find('.tags-label input[type=checkbox]:checked').iCheck('uncheck');
                                $this.iCheck('check');
                            }
                        } else {
                            $this.iCheck('check');
                            if ($this.hasClass('selectAll')) {
                                $plugin.find('.tags-label input[type=checkbox]').iCheck('check');
                            } else {
                                var intAllSelectedFlag;
                                if ($this.hasClass('itemAll')) {
                                    $this.parent().parent().parent().parent().next().find('.tags-label input[type=checkbox]').iCheck('check');
                                    intAllSelectedFlag = $plugin.find('.tags-label input[type=checkbox]').length - $plugin.find('.tags-label input[type=checkbox]:checked').length;
                                    if (intAllSelectedFlag == 1) {
                                        $plugin.find('.selectAll').iCheck('check');
                                    }
                                } else {
                                    var intGroupAllSelectedFlag = $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]').length
                                        - $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]:checked').length;
                                    if (intGroupAllSelectedFlag < 1) {
                                        $this.parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]').iCheck('check');
                                    }
                                    intAllSelectedFlag = $plugin.find('.tags-label input[type=checkbox]').length - $plugin.find('.tags-label input[type=checkbox]:checked').length;
                                    if (intAllSelectedFlag == 1) {
                                        $plugin.find('.selectAll').iCheck('check');
                                    }
                                }
                            }
                        }
                    }
                    var arrDepts = getSelectedOrgIDs();
                    $('#selPublishOrg').find('div.GWSelectOrg-selection__rendered').val(arrDepts.toString());
                }

                var strTitle = '';
                if (setting.defaultValue.length > 0 && setting.defaultName.length > 0) {
                    strTitle = setting.defaultName.toString();
                } else {
                    strTitle = '全公司';
                }

                $plugin.find('div.GWSelectOrg-selection__rendered').html('');
                $plugin.find('div.GWSelectOrg-selection__rendered').append($('<div title="' + strTitle + '">' + strTitle + '</div>').addClass('renderedText'));
                $plugin.find('div.GWSelectOrg-selection__clear').show();
            }
        }

        var methods = {
            getSelectedOrgs: getSelectedOrgs,
            getSelectedOrgIDs: getSelectedOrgIDs,
            reSetSelected: reSetSelected
        }

        if (typeof options === 'string') {
            if ($.isFunction(methods[options])) {
                return methods[options].apply(this, Array.prototype.slice.call($args, 1));
            }
        }

        return this.each(function () {
            var $elem = $(this);
            var opt = $.extend(defaultVal, options);
            setting = $.extend(defaultVal, options);
            $elem.css('width', $elem.width());
            // 生成控件各部分
            var renderSelector = function () {
                $elem.html('');
                $elem.addClass('GWSelectOrg');
                $elem.addClass('GWSelectOrg-container');
                $elem.addClass('GWSelectOrg-container--default');
                $elem.addClass('GWSelectOrg-container--below');

                var selection = '<div class="selection">';
                selection += '<div class="GWSelectOrg-selection GWSelectOrg-selection--default">';

                var strTitle = '';
                if (opt.defaultValue.length > 0 && opt.defaultName.length > 0) {
                    strTitle = opt.defaultName.toString();
                } else {
                    strTitle = '全公司';
                }
                var showTitle = '<div title="' + strTitle + '" class="GWSelectOrg-selection__rendered">' + strTitle + '</div>';
                selection += showTitle;
                var clearSign = opt.allowClear ? '<div class="GWSelectOrg-selection__clear">×</div>' : '';
                selection += clearSign;
                var selectArrow = '<div class="GWSelectOrg-selection__arrow"><b class="arrow-close"></b></div>';
                selection += selectArrow;
                selection += '</div>';
                selection += '</div>';

                $elem.html(selection);

                var dropdown = $('<div class=" GWSelectOrg-dropdown-wrapper GWSelectOrg-dropdown-hidden GWSelectOrg-dropdown-menu"></div>');
                $elem.append(dropdown);

                if (opt.data != null) {
                    renderDropdownBody(opt.data, $elem.find('div.GWSelectOrg-dropdown-wrapper'));
                } else if (opt.dataUrl != null) {

                    $elem.processServerData(opt.parms);
                } else {
                    return false;
                }
            }

            $elem.ajaxRequest = null;
            $elem.counter = 0;
            //请求服务器数据
            var loadServerData = function (parms, onSuccess) {
                if ($elem.ajaxRequest) {
                    $elem.ajaxRequest.abort();
                }
                var ajaxOptions = {
                    type: opt.method,
                    url: opt.dataUrl,
                    data: parms,
                    async: opt.async,
                    cache: opt.cache,
                    dataType: opt.dataType,
                    beforeSend: function () {
                        if (opt.beforeSend && $.isFunction(opt.beforeSend)) {
                            opt.beforeSend(parms);
                        }
                    },
                    success: function (response) {
                        $elem.ajaxRequest = null;
                        if (response && response.Success == true && response.Data) {
                            if (opt.onDataLoaded && $.isFunction(opt.onDataLoaded)) {
                                opt.onDataLoaded(response.Data);
                            }
                            onSuccess(response.Data);
                        }
                    },
                    error: function (xhr, e) {
                        if (e == 'abort') {
                            return;
                        }
                        if (opt.onLoadingError && $.isFunction(opt.onLoadingError)) {
                            opt.onLoadingError(xhr, e);
                        }
                    }
                };
                if (opt.contentType) ajaxOptions.contentType = opt.contentType;
                if (opt.dataType === 'jsonp') {
                    ajaxOptions.jsonpCallback = 'callBackFake';
                }

                $elem.ajaxRequest = $.ajax(ajaxOptions);
                $elem.counter++;
            }

            //处理服务器数据
            $elem.processServerData = function (parms) {
                var itemsContainer = $elem.find('div.GWSelectOrg-dropdown-wrapper');

                loadServerData(parms, function (data) {
                    if (data) {
                        renderDropdownBody(data, itemsContainer);
                        if (opt.onDataLoadCompleted && $.isFunction(opt.onDataLoadCompleted)) {
                            opt.onDataLoadCompleted(_getSelectedDepts());
                        }
                    }
                });
            }

            // 初始化ichick控件
            var initIcheck = function () {
                $('.orgSelector input[type=checkbox]', $elem.find('div.GWSelectOrg-dropdown-wrapper')).iCheck({
                    checkboxClass: 'icheckbox_square-blue-16'
                }).on('ifClicked', function () {
                    // 判断当前checkbox是否被选中
                    _toggleICheckState($(this));
                });
                setDefaultSelectedOrg();
                setCollapseTool();
            }

            // 生成下拉面板内容体
            var renderDropdownBody = function (bodyData, itemsContainer) {
                $(itemsContainer).html('');

                var itemsContainerHtml = "";
                var arrGroup = new Array();
                var arrGroupIds = new Array();
                var data = bodyData;
                for (var i = 0; i < data.length; i++) {
                    var flag = arrGroupIds.indexOf(data[i].RootID);

                    if (flag < 0) {
                        arrGroupIds[arrGroupIds.length] = data[i].RootID;
                        var obj = new Object();
                        obj.RootID = data[i].RootID;
                        obj.RootName = data[i].RootName;
                        obj.CollaborateType = data[i].CollaborateType;
                        obj.CollaborateTypeName = data[i].CollaborateTypeName;
                        obj.Info = new Array();
                        obj.Info[0] = data[i].orgInfo;

                        arrGroup[arrGroup.length] = obj;
                    } else {
                        arrGroup[flag].Info[arrGroup[flag].Info.length] = data[i].orgInfo;
                    }
                }
                itemsContainerHtml += '<div class="orgSelector">';
                if (!opt.singleSelect) {
                    itemsContainerHtml += '<div class="group">'
                    itemsContainerHtml += '<div class="list-inline"><div class="orgItem"><div class="tags-label" data-orgid="0">'
                    itemsContainerHtml += '<input type="checkbox" class="selectAll"><div class="bold-orgName">'
                    itemsContainerHtml += "全选";
                    itemsContainerHtml += '</div></div></div></div></div>'
                }

                for (var i = 0; i < arrGroup.length; i++) {
                    if (arrGroup[i].Info.length == 1) {
                        itemsContainerHtml += '<div class="group">'

                        itemsContainerHtml += '<div class="list-inline"><div class="orgItem"><div class="tags-label" data-collaboratetype = "' + arrGroup[i].CollaborateType + '" data-collaboratetypename = "' + arrGroup[i].CollaborateTypeName + '" data-orgid="' + arrGroup[i].Info[0].Org_ID
                        if (!opt.singleSelect) {
                            itemsContainerHtml += '"><input type="checkbox" class="itemAll"><div class="bold-orgName">'
                        } else {
                            itemsContainerHtml += '"><div class="bold-orgName">'
                        }
                        itemsContainerHtml += arrGroup[i].RootName;
                        itemsContainerHtml += '</div></div></div></div></div>'
                    } else {

                        itemsContainerHtml += '<div class="group">'
                        itemsContainerHtml += '<div class="list-inline exp-e"><div class="expander showList" data-itemlistid="itemList' + i + '"></div><div class="orgItem"><div class="tags-label" data-collaboratetype = "' + arrGroup[i].CollaborateType + '" data-collaboratetypename = "' + arrGroup[i].CollaborateTypeName + '" data-orgid="' + arrGroup[i].RootID
                        if (!opt.singleSelect) {
                            itemsContainerHtml += '"><input type="checkbox" class="itemAll"><div class="bold-orgName">'
                        } else {
                            itemsContainerHtml += '"><div class="bold-orgName">'
                        }
                        itemsContainerHtml += arrGroup[i].RootName;
                        itemsContainerHtml += '</div></div></div></div>'

                        itemsContainerHtml += '<div id="itemList' + i + '" class="list-inline collapse in itemList">'
                        for (var j = 0; j < arrGroup[i].Info.length; j++) {
                            if ((j % 4) == 0) {
                                itemsContainerHtml += '<div class="rowTest">'
                            }

                            itemsContainerHtml += '<div class="orgItem"><div class="tags-label"  data-orgid="' + arrGroup[i].Info[j].Org_ID
                            itemsContainerHtml += '"><input type="checkbox"><div class="normal-orgName">'
                            itemsContainerHtml += arrGroup[i].Info[j].Name
                            itemsContainerHtml += '</div></div></div>'

                            if ((j % 4) == 3) {
                                itemsContainerHtml += '</div>'
                            } else if (j == arrGroup[i].Info.length - 1) {
                                itemsContainerHtml += '</div>'
                            }
                        }

                        itemsContainerHtml += '</div>'
                        itemsContainerHtml += '</div>'
                    }
                }

                itemsContainerHtml += '</div>'
                itemsContainerHtml += '<button type="button" id="btnAffirmOrgToList" class="btnAffirmOrgToList btn btn-primary btn-right-align-first">确定</button>'
                itemsContainerHtml += '<button type="button" id="btnClear" class="btnClear btn btn-primary btn-right-align">清空</button>'
                itemsContainer.html(itemsContainerHtml);
                initIcheck();
            }

            var _getSelectedOrgs = function () {
                var arrSelectedOrg = [];
                $('.orgSelector input[type=checkbox]:checked', $($plugin)).each(function () {
                    if (setting.dataListType == 'OrgDeptList') {
                        if ($(this).hasClass('selectAll')) {
                            arrSelectedOrg.push({ 'OrgId': 0, 'OrgName': '全公司' });
                            return false;
                        } else if ($(this).hasClass('itemAll')) {
                            arrSelectedOrg.push({
                                'OrgId': $(this).parent().parent().data('orgid'),
                                'OrgName': $(this).parent().next().text(),
                                'CollaborateType': $(this).parent().parent().data('collaboratetype'),
                                'CollaborateTypeName': $(this).parent().parent().data('collaboratetypename')
                            });
                        } else {
                            if ($(this).parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]:checked').length == 0) {
                                arrSelectedOrg.push({
                                    'OrgId': $(this).parent().parent().data('orgid'),
                                    'OrgName': $(this).parent().next().text(),
                                    'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                                    'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                                });
                            }
                        }
                    } else {
                        if (!$(this).hasClass('selectAll')) {
                            if ($(this).hasClass('itemAll')) {
                                arrSelectedOrg.push({
                                    'OrgId': $(this).parent().parent().data('orgid'),
                                    'OrgName': $(this).parent().next().text(),
                                    'CollaborateType': $(this).parent().parent().data('collaboratetype'),
                                    'CollaborateTypeName': $(this).parent().parent().data('collaboratetypename')
                                });
                            } else {
                                if ($(this).parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]:checked').length == 0) {
                                    arrSelectedOrg.push({
                                        'OrgId': $(this).parent().parent().data('orgid'),
                                        'OrgName': $(this).parent().next().text(),
                                        'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                                        'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                                    });
                                }
                            }
                        }
                    }
                });
                return arrSelectedOrg;
            }

            var _getSelectedDepts = function () {
                var arrSelectedOrg = [];
                $('.orgSelector input[type=checkbox]:checked', $($plugin)).each(function () {
                    if (setting.dataListType == 'OrgDeptList') {
                        if ($(this).hasClass('selectAll')) {
                            arrSelectedOrg.push({ 'OrgId': 0, 'OrgName': '全公司' });
                            return false;
                        } else if ($(this).hasClass('itemAll')) {

                        } else {
                            arrSelectedOrg.push({
                                'OrgId': $(this).parent().parent().data('orgid'),
                                'OrgName': $(this).parent().next().text(),
                                'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                                'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                            });
                        }
                    } else {
                        if (!$(this).hasClass('selectAll') && !$(this).hasClass('itemAll')) {
                            arrSelectedOrg.push({
                                'OrgId': $(this).parent().parent().data('orgid'),
                                'OrgName': $(this).parent().next().text(),
                                'CollaborateType': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetype'),
                                'CollaborateTypeName': $(this).parent().parent().parent().parent().parent().prev().find('.tags-label').data('collaboratetypename')
                            });
                        }
                    }
                });
                return arrSelectedOrg;
            }

            var _toggleICheckState = function (el) {
                $this = el;
                if (opt.singleSelect) {
                    if (!$this.is(':checked')) {
                        if ($this.hasClass('selectAll')) {
                            return false;
                        } else if ($this.hasClass('itemAll')) {
                            return false;
                        } else {
                            $elem.find('.tags-label input[type=checkbox]:checked').iCheck('uncheck');
                            $this.iCheck('check');
                        }
                    } else {
                        if ($this.hasClass('selectAll')) {
                            return false;
                        } else if ($this.hasClass('itemAll')) {
                            return false;
                        } else {
                            $this.iCheck('uncheck');
                        }
                    }
                } else {
                    if (!$this.is(':checked')) {
                        $this.iCheck('check');
                        if ($this.hasClass('selectAll')) {
                            $elem.find('.tags-label input[type=checkbox]').each(function () {
                                $(this).iCheck('check');
                            });
                        } else if ($this.hasClass('itemAll')) {
                            $this.parent().parent().parent().parent().next().find('.tags-label input[type=checkbox]').iCheck('check');
                            var intAllSelectedFlag = $elem.find('.tags-label input[type=checkbox]').length - $elem.find('.tags-label input[type=checkbox]:checked').length
                            if (intAllSelectedFlag == 1) {
                                $elem.find('.selectAll').iCheck('check');
                            }
                        } else {
                            var intGroupAllSelectedFlag = $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]').length
                            - $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]:checked').length;
                            if (intGroupAllSelectedFlag < 1) {
                                $this.parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]').iCheck('check');
                            }
                            var intAllSelectedFlag = $elem.find('.tags-label input[type=checkbox]').length - $elem.find('.tags-label input[type=checkbox]:checked').length
                            if (intAllSelectedFlag == 1) {
                                $elem.find('.selectAll').iCheck('check');
                            }
                        }
                    } else {
                        $this.iCheck('uncheck');
                        if ($this.hasClass('selectAll')) {
                            $elem.find('.tags-label input[type=checkbox]').each(function () {
                                $(this).iCheck('uncheck');
                            });
                        } else if ($this.hasClass('itemAll')) {
                            $elem.find('.selectAll').iCheck('uncheck');
                            $this.parent().parent().parent().parent().next().find('.tags-label input[type=checkbox]').iCheck('uncheck');
                        } else {
                            $elem.find('.selectAll').iCheck('uncheck');
                            $this.parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]').iCheck('uncheck');
                        }
                    }
                }
            }

            var setDefaultSelectedOrg = function () {
                if (opt.defaultValue.length > 0) {
                    for (var i = 0; i < opt.defaultValue.length; i++) {
                        $this = $($elem.find('.orgSelector .orgItem')).find('.tags-label[data-orgid=' + opt.defaultValue[i] + ']').find('input[type=checkbox]');
                        if (opt.singleSelect) {
                            if ($this.hasClass('selectAll')) {
                                return false;
                            } else if ($this.hasClass('itemAll')) {
                                return false;
                            } else {
                                $elem.find('.tags-label input[type=checkbox]:checked').iCheck('uncheck');
                                $this.iCheck('check');
                            }
                        } else {
                            $this.iCheck('check');
                            if ($this.hasClass('selectAll')) {
                                $elem.find('.tags-label input[type=checkbox]').each(function () {
                                    $(this).iCheck('check');
                                });
                            } else if ($this.hasClass('itemAll')) {
                                $this.parent().parent().parent().parent().next().find('.tags-label input[type=checkbox]').iCheck('check');
                                var intAllSelectedFlag = $elem.find('.tags-label input[type=checkbox]').length - $elem.find('.tags-label input[type=checkbox]:checked').length
                                if (intAllSelectedFlag == 1) {
                                    $elem.find('.selectAll').iCheck('check');
                                }
                            } else {
                                var intGroupAllSelectedFlag = $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]').length
                                - $this.parent().parent().parent().parent().parent().find('.tags-label input[type=checkbox]:checked').length;
                                if (intGroupAllSelectedFlag < 1) {
                                    $this.parent().parent().parent().parent().parent().prev().find('.tags-label input[type=checkbox]').iCheck('check');
                                }
                                var intAllSelectedFlag = $elem.find('.tags-label input[type=checkbox]').length - $elem.find('.tags-label input[type=checkbox]:checked').length
                                if (intAllSelectedFlag == 1) {
                                    $elem.find('.selectAll').iCheck('check');
                                }
                            }
                        }
                    }
                    var arrDepts = _getSelectedDepts();
                    $('#selPublishOrg').find('div.GWSelectOrg-selection__rendered').val(arrDepts.toString());
                }
            }

            var setCollapseTool = function () {
                var isIE10 = true;

                try {
                    if ($.browser && $.browser.msie && $.browser.version && parseInt($.browser.version) < 10) {
                        isIE10 = false;
                    }
                } catch (e) {
                }

                $('.showList', $elem.find('.orgSelector')).on('click', function () {

                    var itemlistid = $(this).data().itemlistid;

                    if ($(this).parent().hasClass('exp-e')) {
                        $(this).parent().removeClass('exp-e');
                        if (!isIE10) {
                            $('#' + itemlistid, $elem.find('.orgSelector')).removeClass('collapse in').addClass('collapse');
                        }
                    } else {
                        $(this).parent().addClass('exp-e');
                        if (!isIE10) {
                            $('#' + itemlistid, $elem.find('.orgSelector')).removeClass('collapse').addClass('collapse in');
                        }
                    }

                    $('#' + itemlistid).collapse('toggle');
                });
            }

            var arrowUp = function () {
                $elem.find('.GWSelectOrg-selection__arrow b').removeClass('arrow-close');
                $elem.find('.GWSelectOrg-selection__arrow b').addClass('arrow-open');
            }
            var arrowDown = function () {
                $elem.find('.GWSelectOrg-selection__arrow b').removeClass('arrow-open');
                $elem.find('.GWSelectOrg-selection__arrow b').addClass('arrow-close');
            }

            var panleCollapse = function () {
                arrowDown();
                if ($elem.find('div.GWSelectOrg-dropdown-wrapper').hasClass('GWSelectOrg-dropdown-hidden')) {
                    return false;
                } else {
                    $elem.find('div.GWSelectOrg-dropdown-wrapper').addClass('GWSelectOrg-dropdown-hidden');
                    return true;
                }
            }

            var panleExpand = function () {
                arrowUp();
                if ($elem.find('div.GWSelectOrg-dropdown-wrapper').hasClass('GWSelectOrg-dropdown-hidden')) {
                    $elem.find('div.GWSelectOrg-dropdown-wrapper').removeClass('GWSelectOrg-dropdown-hidden');
                } else {
                    return false;
                }
            }

            var affirmOrgToList = function (callback) {
                var arrSelectedOrg = _getSelectedOrgs();
                var arrSelectedDept = _getSelectedDepts();
                var orgIds = '';
                var orgName = '';
                var textOrgName = '';

                if (arrSelectedOrg == []) {
                    panleCollapse();
                    callback(arrSelectedDept);
                    return false;
                }
                for (var i = 0; i < arrSelectedOrg.length; i++) {
                    textOrgName += arrSelectedOrg[i].OrgName;
                    textOrgName += ',';
                }
                for (var i = 0; i < arrSelectedDept.length; i++) {
                    orgIds += arrSelectedDept[i].OrgId;
                    orgIds += ',';
                    orgName += arrSelectedDept[i].OrgName;
                    orgName += ',';
                }
                orgIds = orgIds.substr(0, orgIds.length - 1);
                textOrgName = textOrgName.substr(0, textOrgName.length - 1);
                $elem.find('div.GWSelectOrg-selection__rendered').html('');
                $elem.find('div.GWSelectOrg-selection__rendered').append($('<div title="' + textOrgName + '">' + textOrgName + '</div>').addClass('renderedText'));
                $elem.find('div.GWSelectOrg-selection__clear').show();
                $elem.find('div.GWSelectOrg-selection__rendered').val(orgIds);
                panleCollapse();
                if (arrSelectedOrg && typeof callback == 'function') {
                    callback(arrSelectedDept);
                }
            }

            //绑定事件
            var bindEvent = function () {
                // 点击展开或收起面板
                $elem.find('div.GWSelectOrg-selection').on('click', function (event) {
                    if (!panleCollapse()) {
                        panleExpand();
                        event.stopPropagation();
                    }
                });
                // 点击展开或收起面板
                $elem.find('div.GWSelectOrg-selection__arrow').on('click', function (event) {
                    if ($elem.find('div.GWSelectOrg-selection__arrow b').hasClass('arrow-open')) {
                        panleCollapse();
                    } else {
                        panleExpand();
                    }
                    event.stopPropagation();
                });

                // 清除选中
                $elem.find('div.GWSelectOrg-selection__clear').on('click', function (event) {
                    $elem.find('div.GWSelectOrg-selection__rendered').html('');
                    $elem.find('div.GWSelectOrg-selection__rendered').attr('title', '');
                    $elem.find('div.GWSelectOrg-selection__rendered').val('');
                    $elem.find('div.GWSelectOrg-selection__clear').hide();
                    event.stopPropagation();
                });

                $elem.find('button .btnAffirmOrgToList').on('click', function () {
                    affirmOrgToList(opt.onSelelcted);
                    event.stopPropagation();
                });

                $('.btnClear').on('click', function () {
                    $elem.find('.tags-label input[type=checkbox]').iCheck('uncheck');
                });

                $elem.on('click', function (event) {
                    if ($(event.target).hasClass('GWSelectOrg-dropdown-wrapper')) {
                        return false;
                    } else if ($(event.target).hasClass('btnAffirmOrgToList')) {
                        affirmOrgToList(opt.onSelelcted);
                        event.stopPropagation();
                    } else if ($(event.target).hasClass('btnClear')) {
                        $elem.find('.tags-label input[type=checkbox]').iCheck('uncheck');
                    } else if ($(event.target).hasClass('normal-orgName') || $(event.target).hasClass('bold-orgName')) {
                        var iptCheck = $(event.target).parent().find('input[type=checkbox]');
                        _toggleICheckState(iptCheck);
                    }
                    return false;
                });

                $(document).on('click', function (event) {
                    if (!$(event.target).parents('.GWSelectOrg-dropdown-wrapper').length > 0) {
                        if (!$(event.target).parents('.GWSelectOrg-selection__arrow').length > 0) {
                            panleCollapse();
                        }
                    }
                });
            }

            renderSelector();
            bindEvent();
        });
    }

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined' ? args[number] : match;
            });
        };
    }
})(jQuery);