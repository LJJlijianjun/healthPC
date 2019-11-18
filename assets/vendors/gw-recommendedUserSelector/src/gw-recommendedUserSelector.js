/**
 * gw-recommendedUserSelector.js : 人员（组织机构）选择工具。
 * version : v0.1.0
 * require :jquery.js jquery-tools.js bootstrap.js bootstrap-tagsinput.js
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : kfzhang
 * LastModifyBy : kfzhang
 * LastModifyTime : 2016-7-01 14:00:00
 */

(function ($) {
    // 在调用页面添加赋值回调
    window.addRecommendedUserToList = function (id) {
        $('#btnClose' + id + 'Modal').click();
        $('body').loadingUI({ text: '数据加载中...' });
    }

    $.fn.GWRecommendedUserSelector = function (options) {
        var defaultVal = {
            selectOrgOrUser: 1, // 选择部门还是人员 1：人员，2：部门。
            isMultiSelect: true,
            selectorPath: '',
            orgRootId: 0
        };

        var $args = arguments;
        var $plugin = this;

        return this.each(function () {

            var $elem = $(this);
            var opt = $.extend(defaultVal, options);

            // 打开收件人选择框
            var _openUserSelector = function () {
                $('#' + $elem[0].id + 'Frame', $elem.parent()).attr('src', opt.selectorPath + '?selectOrgOrUser=' + opt.selectOrgOrUser
                                                                    + '&selectedItems=' + $elem.val()
                                                                    + '&isMultiSelect=' + (opt.isMultiSelect ? 2 : 1)
                                                                    + '&orgRootId=' + opt.orgRootId
                                                                    + '&inputId=' + $elem[0].id
                                                                    + '&g=' + newGuid()
                );

                $('#' + $elem[0].id + 'Modal', $elem.parent()).modal({ backdrop: 'static', keyboard: false });
            }

            // 生成控件各部分
            var renderSelector = function () {
                // 如无选人页面路径则不进行之后动作
                if (opt.selectorPath == '' || !opt.selectorPath) { return false; }
                $elem.parent().append($('<div class="modal fade GWRecommendedUserSelectorModal" id="' + $elem[0].id + 'Modal" tabindex="-1" role="dialog" aria-labelledby="' + $elem[0].id + 'Modal" aria-hidden="true">'
                    + ' <div class="modal-dialog">'
                    + '<div class="modal-content">'
                    + ' <div class="modal-body">'
                    + '  <button class="close btnColseGWRecommendedUserSelectorModal" id="btnClose' + $elem[0].id + 'Modal" title="关闭" data-dismiss="modal" type="button"  aria-hidden="true">&times;</button>'
                    + '     <iframe class="GWRecommendedUserSelectorFrame" id="' + $elem[0].id + 'Frame" ></iframe>'
                    + '  </div>'
                    + ' </div>'
                    + '</div>'
                    + '</div>'));
                $elem.parent().append('<span class="input-group-btn"><button class="btn btn-default btnToSelect"><i class="fa fa-plus"></i>&nbsp;选择</button></span>');

                if (opt.selectOrgOrUser == 1) {
                    initUserSelectorTagsInput();
                } else if (opt.selectOrgOrUser == 2) {
                    initOrgSelectorTagsInput();
                }
            }

            // 初始化输入框(人员信息)
            var initUserSelectorTagsInput = function () {
                $elem.tagsinput({
                    itemValue: 'OrgEmpId',
                    itemText: 'UserName',
                    tagClass: function () {
                        return 'label label-info';
                    }
                });
                $elem.val('');
                $elem.prev().find('input').css('width', 55).prop('readonly', true);
            }

            // 初始化输入框(机构信息)
            var initOrgSelectorTagsInput = function () {
                $elem.tagsinput({
                    itemValue: 'OrgId',
                    itemText: 'OrgName',
                    tagClass: function () {
                        return 'label label-info';
                    }
                });

                $elem.prev().find('input').css('width', 50).prop('readonly', true);
            }

            // 初始化,选人延迟
            var currentReceiver = 0;
            var addToTagsInput = function (id, data) {
                if (data.length > 0) {
                    $('.bootstrap-tagsinput input', $('#' + id).parent()).focus();
                    if (currentReceiver < data.length) {
                        $('#' + id).tagsinput('add', data[currentReceiver]);
                        setTimeout(function () {
                            if (currentReceiver >= data.length - 1) {
                                $('.bootstrap-tagsinput input', $('#' + id).parent()).blur();
                                $('body').loadingUI('hide');
                            } else {
                                currentReceiver = currentReceiver + 1;
                                addToTagsInput(id, data);
                            }
                        }, 20);
                    }
                } else {
                    setTimeout(function () {
                        $('.bootstrap-tagsinput input', $('#' + id).parent()).blur();
                        $('body').loadingUI('hide');
                    }, 20);
                }
            }

            //绑定事件
            var bindEvent = function () {
                // 为输入框添加打开面板方法
                $('.btnToSelect', $elem.parent()).on('click', function () {
                    _openUserSelector();
                    return false;
                });

                // 关闭选人窗口
                $('#' + $elem[0].id + 'Modal').on('hidden.bs.modal', function (e) {

                    var id = $elem[0].id
                    var arrSelectedItem = document.getElementById(id + 'Frame').contentWindow.getSelectedItems();
                    var isAffirmClick = document.getElementById(id + 'Frame').contentWindow.getAffirmClickSource();
                    if (isAffirmClick == 1) {
                        $('#' + id).tagsinput('removeAll');
                        currentReceiver = 0;
                        addToTagsInput(id, arrSelectedItem);
                        //$('#' + id).tagsinput('removeAll');
                        //$('.bootstrap-tagsinput input', $('#' + id).parent()).focus();


                        //if (arrSelectedItem && arrSelectedItem.length > 0) {
                        //    for (var i = 0; i < arrSelectedItem.length; i++) {
                        //        $('#' + id).tagsinput('add', arrSelectedItem[i]);
                        //    }

                        //    $('.bootstrap-tagsinput input', $('#' + id).parent()).val(' ');
                        //}
                        //$('body').loadingUI('hide');
                    }
                });
            }

            renderSelector();
            bindEvent();
        });
    }
})(jQuery);