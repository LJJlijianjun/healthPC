/*
 * workFlow.js : 工作流js
 * version : v1.0.2
 * require : jquery、jquery-tools-min.js、bootbox.js、config.js
 * CreateTime : 2016-7-01 14:00:00
 * CreateBy : LiYang
 * LastModifyBy : LiYang
 * LastModifyTime : 2017-2-22 10:26:00
 */

function debug(log) {
    if (window.console && window.console.log) {
        var date = new Date();
        window.console.log("" + date + ": " + JSON.stringify(log));
    }
};

(function ($) {
    var methods =
    {
        // 获取待办已办列表
        ProcessList: function (options) {
            var defaults = {
                Waitting: true,
                ModelIds: '',
                PageNum: 0,
                PageSize: 0,
                Title: '',
                callback: null
            };

            var settings = $.extend({}, defaults, options);

            $.ajax({
                type: "GET",
                url: dataServiceBaseUrl + "api/WorkFlow/Process?sid=" + sid,
                async: true,
                cache: false,
                dataType: 'json',
                data: {
                    waitting: settings.Waitting,
                    modelIds: settings.ModelIds,
                    pageNum: settings.PageNum,
                    pageSize: settings.PageSize,
                    title: settings.Title
                },
                success: function (data) {
                    if (data && data.Success === true) {
                        settings.callback(data.Data);
                    } else {
                        settings.callback();
                    }
                }
            });
        },

        // 流程中，获取流程信息
        ProcessInfo: function (options, callback) {
            var defaults = {
                ModelId: 0,
                ProcessId: 0,
                InstanceId: 0,
                TaskId: 0,
                Btn: {
                    Save: null,
                    Preview: null,
                    EmailPreview: null,
                    Next: null,
                    Complete: null,
                    Redirect: null,
                    Back: null,
                    Delete: null
                }
            };

            var $this = $(this);

            var p = WFUtils.getParams();
            defaults = $.extend({}, defaults, p);
            var settings = $.extend({}, defaults, options);

            WorkflowEngine.SaveInstanceContent(function () {
                $.ajax({
                    type: "GET",
                    url: dataServiceBaseUrl + "api/WorkFlow/Process?sid=" + sid,
                    async: true,
                    cache: false,
                    dataType: 'json',
                    data: {
                        modelId: settings.ModelId,
                        processId: settings.ProcessId,
                        instanceId: settings.InstanceId,
                        taskId: settings.TaskId
                    },
                    success: function (data) {
                        if (data && data.Success === true) {
                            if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                                window.location.href = '../Common/NoRight.html';
                            } else if (data.Data) {
                                // 流程头部信息设置
                                var $processInfo = $this.find('.processInfo');
                                if ($processInfo) {
                                    // 流程图示
                                    $processInfo.find('.process-picture').attr('href', '../../../assets/img/ProcessPic/' + data.Data.Model.ModelId + '.png');
                                    // 当前步骤
                                    $processInfo.find('.process-currentTask').text(data.Data.Task.TaskName);
                                    // 流转明细
                                    $processInfo.find('.process-detail').on('click', function () {
                                        WorkflowEngine.ShowProcessDetail(settings.ProcessId);
                                    });
                                    // 回退原因
                                    if (data.Data.Instance[0].isback == '1') {
                                        $processInfo.find('.process-backReasonDesc').text(data.Data.Instance[0].BackReasonDesc);
                                        $processInfo.find('.process-backReason').text(data.Data.Instance[0].BackReason ? data.Data.Instance[0].BackReason : '');
                                    }
                                }

                                // 操作按钮设置
                                var $processButtonGroup = $this.find('.processButtonGroup');
                                if ($processButtonGroup && $processButtonGroup.length > 0) {
                                    $processButtonGroup.each(function (i, buttonGroup) {
                                        $(buttonGroup).empty();

                                        var btnSaveText = '保存';
                                        var btnCompleteText = '已审核并发布';
                                        if (settings.ModelId === 6) {
                                            //btnSaveText = '保存并返回';
                                            btnCompleteText = '审核通过';
                                        }

                                        var btnNextText = '已审核并提交';
                                        if (data.Data.LastTaskType == '1') {
                                            btnNextText = '下一步';
                                            if ((settings.ModelId === 4 && settings.TaskId === 3) || (settings.ModelId === 5 && settings.TaskId === 3)) {
                                                btnNextText = '分发';
                                            }
                                        }

                                        var btnGoBack = '<button type="button" class="btn btn-default" id="btn_GoBack_' + i + '" name="btn_GoBack"><span class="fa fa-mail-reply"></span>&nbsp;返回</button>';
                                        var btnSave = '<button type="button" class="btn btn-default" id="btnWf_Save_' + i + '" name="btnWf_Save" data-loading-text="保存中..."><span class="fa fa-save"></span>&nbsp;' + btnSaveText + '</button>';
                                        var btnPreview = '<button type="button" class="btn btn-default" id="btn_Preview_' + i + '" name="btn_Preview"><span class="fa fa-eye"></span>&nbsp;预览</button>';
                                        var btnNext = '<button type="button" class="btn btn-default" id="btnWf_Next_' + i + '" name="btnWf_Next"><span class="fa fa-check"></span>&nbsp;' + btnNextText + '</button>';
                                        var btnComplete = '<button type="button" class="btn btn-default" id="btnWf_Complete_' + i + '" name="btnWf_Complete"><span class="fa fa-check"></span>&nbsp;' + btnCompleteText + '</button>';
                                        var btnRedirect = '<button type="button" class="btn btn-default" id="btnWf_Redirect_' + i + '" name="btnWf_Redirect"><span class="fa fa-reply"></span>&nbsp;转办</button>';
                                        var btnBack = '<button type="button" class="btn btn-default" id="btnWf_Back_' + i + '" name="btnWf_Back"><span class="fa fa-arrow-left"></span>&nbsp;回退</button>';
                                        var btnDelete = '<button type="button" class="btn btn-default" id="btnWf_Delete_' + i + '" name="btnWf_Delete"><span class="fa fa-trash-o"></span>&nbsp;删除</button>';
                                        var btnRefuse = '<button type="button" class="btn btn-default" id="btnWf_Refuse_' + i + '" name="btnWf_Refuse"><span class="fa fa-trash-o"></span>&nbsp;未通过</button>'

                                        // 上一步是开始节点，说明当前是第一步，显示保存、预览按钮
                                        if (data.Data.LastTaskType == '1') {
                                            $(buttonGroup).append(btnGoBack);

                                            if (!((settings.ModelId === 4 && settings.TaskId === 3) || (settings.ModelId === 5 && settings.TaskId === 3) || settings.ModelId == 6)) {

                                                if (!(settings.ModelId === 3)) {
                                                    $(buttonGroup).append(btnPreview);
                                                } 
                                                $(buttonGroup).append(btnSave);
                                                $(buttonGroup).append(btnDelete);
                                            }
                                        } else {
                                            if (settings.ModelId === 1 || settings.ModelId === 2) {
                                                $(buttonGroup).append(btnPreview);
                                            }
                                        }

                                        // 下一步是结束节点，说明当前是最后一步，显示结束（释放）按钮
                                        if (data.Data.NextTaskType == '2') {
                                            $(buttonGroup).append(btnComplete);
                                        } else {
                                            $(buttonGroup).append(btnNext);
                                        }
                                        

                                        // 是否显示转办按钮，报表流程不显示转办按钮
                                        if (data.Data.Task.CanRedirect == true && settings.ModelId !== 6) {
                                            //$(buttonGroup).append(btnRedirect);
                                        }

                                        // 是否显示回退按钮，报表流程不显示回退按钮
                                        if (data.Data.Task.CanBack == true && settings.ModelId !== 6) {
                                            $(buttonGroup).append(btnBack);
                                        }


                                        if (settings.ModelId === 6) {
                                            $(buttonGroup).append(btnRefuse);
                                        }

                                        WorkflowEngine.BindButtonAction(i, settings);
                                    });
                                }

                                // 分发步骤无需填写审批意见，非分发步骤时，将提示信息、常用语、意见输入框显示
                                // 报表流程在审批表单中都无需填写审批意见（操作功能也没有），由外面统一处理
                                if ((settings.ModelId === 4 && settings.TaskId === 3) || (settings.ModelId === 5 && settings.TaskId === 3)) {
                                    $('.processMessage').css('display','none');
                                } else {
                                    $('.processToolBar .formTip').show();
                                    $('#formWorkFlowMessage').show();
                                }

                                // 绑定审批意见信息
                                WorkflowEngine.GetMessage();

                                // 设置流程变量信息
                                WorkflowEngine.GetInstanceContent(settings.ProcessId, settings.InstanceId);

                                // 回调
                                if (callback) callback();
                            }
                        }
                    },
                    error: function (data) {
                        bootbox.alert({ message: "获取流程信息失败！" });
                    }
                });
            });
        }
    };

    $.fn.Workflow = function () {
        var method = arguments[0];

        if (methods[method]) {
            method = methods[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        }
        else {
            bootbox.alert({ message: "方法 [" + method + "] 在Workflow中不存在。" });
            return this;
        }

        return method.apply(this, arguments);
    };
})(jQuery);

var WorkflowEngine = {
    // 创建流程
    CreateProcess: function (options) {
        var defaults = {
            modelId: 0,
            callback: null
        };

        var settings = $.extend({}, defaults, options);

        $.ajax({
            type: "POST",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?modelId=" + settings.modelId + "&sid=" + sid,
            async: false,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true && data.Data) {
                    if (typeof (settings.callback) == 'function') {
                        settings.callback(data.Data);
                    }
                }
            },
            error: function (data) {
                bootbox.alert({ message: "创建流程失败！" });
            }
        });
    },

    // 显示流程流转明细
    ShowProcessDetail: function (processid) {
        var detailModal = document.getElementById('wfProcessDetailModal');
        var url = '../WorkFlow/ProcessDetail.html?processId=' + processid;
        if (!detailModal) {
            detailModal = '<div class="modal fade" id="wfProcessDetailModal" tabindex="-1" role="dialog" aria-labelledby="processDetailModalLabel">' +
                                    '<div class="modal-dialog" role="document" style="width: 900px;">' +
                                         '<div class="modal-content">' +
                                            '<div class="modal-header">' +
                                                '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
                                                '<span class="modal-title" id="processDetailModalLabel" style="font-size: 15px; font-weight: 700; color: #353535;">流转明细及回退意见</span>' +
                                            '</div>' +
                                            '<div class="modal-body" style="height: 400px; padding-top: 0;">' +
                                                '<iframe src="' + url + '" style="width: 100%; height: 100%; border: none;" frameborder="0"></iframe>' +
                                            '</div>' +
                                         '</div>' +
                                    '</div>' +
                                    '</div>';
            $('body').append(detailModal);
        } else {
            $(detailModal).find('iframe').attr('src', url);
        }
        $('#wfProcessDetailModal').modal();
    },

    // 获取流转明细数据
    GetProcessDetail: function (callback) {
        var p = WFUtils.getParams();

        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?sid=" + sid,
            async: true,
            cache: false,
            dataType: "json",
            data: {
                processId: p.ProcessId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'NoPermisson' || data.Message == 'InvalidUser') {
                            window.location.href = '../Common/NoRight.html';
                        } else {
                            callback(data.Data);
                        }
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 绑定按钮事件
    BindButtonAction: function (index, options) {
        $('#btn_GoBack_' + index).on('click', function () {
            WorkflowEngine.RedirectToLastPage();
        });

        $('#btnWf_Save_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Save)) {
                options.Btn.Save();
            } else {
                WorkflowAction.Save('save', function () {
                    if ($(this).text() == '保存并返回') {
                        WorkflowEngine.RedirectToLastPage();
                    }
                });
            }
        });

        $('#btn_Preview_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Preview)) {
                options.Btn.Preview();
            }
        });

        $('#btn_EmailPreview_' + index).on('click', function () {
            if ($.isFunction(options.Btn.EmailPreview)) {
                options.Btn.EmailPreview();
            }
        });

        $('#btnWf_Next_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Next)) {
                options.Btn.Next();
            } else {
                WorkflowAction.Next();
            }
        });

        $('#btnWf_Complete_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Complete)) {
                options.Btn.Complete();
            } else {
                WorkflowAction.Complete();
            }
        });

        $('#btnWf_Redirect_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Redirect)) {
                options.Btn.Redirect();
            } else {
                WorkflowAction.Redirect();
            }
        });

        $('#btnWf_Back_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Back)) {
                options.Btn.Back();
            } else {
                WorkflowAction.Back();
            }
        });

        $('#btnWf_Delete_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Delete)) {
                options.Btn.Delete();
            } else {
                WorkflowAction.Delete();
            }
        });

        $('#btnWf_Refuse_' + index).on('click', function () {
            if ($.isFunction(options.Btn.Refuse)) {
                options.Btn.Refuse();
            } else {
                WorkflowAction.Delete();
            }
        });
    },

    // 获取下一步任务信息
    GetNextTask: function (callback) {
        var p = WFUtils.getParams();

        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Task?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                processId: p.ProcessId,
                instanceId: p.InstanceId,
                taskId: p.TaskId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data) {
                            callback(data.Data);
                        }
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 流程下一步流转
    InstanceMoveNext: function (options, callback) {
        var defaults = {
            ModelId: 0,
            ProcessId: 0,
            InstanceId: 0,
            TaskId: 0,
            NextTaskId: 0,
            NextTaskEmpIds: ''
        };

        var p = WFUtils.getParams();
        defaults = $.extend({}, defaults, p);
        var settings = $.extend({}, defaults, options);

        $.ajax({
            type: "POST",
            url: dataServiceBaseUrl + "api/WorkFlow/Instance/InstanceMoveNext?processId=" + settings.ProcessId + "&instanceId=" + settings.InstanceId + "&nextTaskId=" + settings.NextTaskId + "&nextTaskEmpIds=" + settings.NextTaskEmpIds + "&sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (callback) {
                        callback(p.ModelId, p.ProcessId, data.Data);
                    } else if (data.Data > 0) {
                        WorkflowEngine.RedirectToDoListPage();
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 获取转办信息
    GetInstanceRedirectTaskInfo: function (callback) {
        var p = WFUtils.getParams();

        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Task?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                modelId: p.ModelId,
                instanceId: p.InstanceId,
                taskId: p.TaskId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data) {
                            callback(data.Data);
                        }
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 流程转办
    InstanceRedirect: function (options, callback) {
        var defaults = {
            ModelId: 0,
            ProcessId: 0,
            InstanceId: 0,
            TaskId: 0,
            RedirectEmpId: ''
        };

        var p = WFUtils.getParams();
        defaults = $.extend({}, defaults, p);
        var settings = $.extend({}, defaults, options);

        $.ajax({
            type: "POST",
            url: dataServiceBaseUrl + "api/WorkFlow/Instance/InstanceRedirect?processId=" + settings.ProcessId + "&instanceId=" + settings.InstanceId + "&taskId=" + settings.TaskId + "&redirectEmpId=" + settings.RedirectEmpId + "&sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (callback) {
                        callback(p.ModelId, p.ProcessId, data.Data);
                    } else if (data.Data > 0) {
                        WorkflowEngine.RedirectToDoListPage();
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 获取当前流程在当前实例下可回退到的实例列表
    GetInstanceBackList: function (mode, publishOrgId, callback) {
        var p = WFUtils.getParams();
        // 标记位，如果为0则只能选择回退到第一步，1为所有
        if (!mode) mode = 0;
        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Instance/GetInstanceBackList?sid=" + sid,
            cache: false,
            async: false,
            dataType: "json",
            data: {
                mode: mode,
                instanceId: p.InstanceId,
                CreateUserOrgID: publishOrgId
            },
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (data.Data) {
                        callback(data.Data);
                    }
                }
            }
        });
    },

    // 流程回退
    InstanceBack: function (options, callback) {
        var defaults = {
            ModelId: 0,
            ProcessId: 0,
            InstanceId: 0,
            BackToInstanceId: 0,
            BackToTaskId: 0,
            BackToEmpId: 0,
            BackReason: ''
        };

        var p = WFUtils.getParams();
        defaults = $.extend({}, defaults, p);
        var settings = $.extend({}, defaults, options);

        $.ajax({
            type: "POST",
            url: dataServiceBaseUrl + "api/WorkFlow/Instance/InstanceBack?instanceId=" + settings.InstanceId + "&backToInstanceId=" + settings.BackToInstanceId + "&backToTaskId=" + settings.BackToTaskId + "&backToEmpId=" + settings.BackToEmpId + "&backReason=" + encodeURIComponent(settings.BackReason) + "&sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (callback) {
                            callback(p.ModelId, p.ProcessId, data.Data);
                        } else if (data.Data > 0) {
                            WorkflowEngine.RedirectToDoListPage();
                        }
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 判断实例是否可以撤回（已办页面调用）
    InstanceCanRollBack: function () {
        var $processButtonGroup = $('.processButtonGroup');
        if ($processButtonGroup && $processButtonGroup.length > 0) {
            // 添加返回按钮
            $processButtonGroup.each(function (i, buttonGroup) {
                var btnGoBack = '<button type="button" class="btn btn-default" id="btn_GoBack_' + i + '" name="btn_GoBack"><span class="fa fa-mail-reply"></span>&nbsp;返回</button>';
                $(buttonGroup).append(btnGoBack);
                $('#btn_GoBack_' + i).on('click', function () {
                    WorkflowEngine.RedirectToLastPage();
                });
            });

            // 添加撤回按钮
            var p = WFUtils.getParams();
            $.ajax({
                type: "GET",
                url: dataServiceBaseUrl + "api/WorkFlow/Instance/GetInstanceCanRollBack?sid=" + sid,
                async: true,
                cache: false,
                dataType: 'json',
                data: {
                    instanceId: p.InstanceId
                },
                success: function (data) {
                    if (data && data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data === 0) {
                            $processButtonGroup.each(function (i, buttonGroup) {
                                var btnInstanceRollBack = '<button type="button" class="btn btn btn-default" id="btnWf_InstanceRollBack_' + i + '"><span class="fa fa-recycle"></span>&nbsp;撤回</button>';
                                $(buttonGroup).append(btnInstanceRollBack);
                                $('#btnWf_InstanceRollBack_' + i).on('click', function () {
                                    bootbox.confirm({
                                        size: 'small',
                                        message: "确定要撤回吗？",
                                        callback: function (s) {
                                            if (s === true) {
                                                WorkflowAction.InstanceRollBack(function (result) {
                                                    if (result === 0) {
                                                        bootbox.alert({
                                                            message: '撤回成功！',
                                                            callback: function () {
                                                                WorkflowEngine.RedirectToDoListPage();
                                                            }
                                                        });
                                                    } else {
                                                        bootbox.alert({ message: '撤回失败，对方可能已经开始办理。' });
                                                    }
                                                });
                                            }
                                        }
                                    });
                                });
                            });
                        }
                    }
                }
            });

            $('.processButtonGroup').parent().parent().show();
            $('.processInfo').find('.process-picture').attr('href', '../../../assets/img/ProcessPic/' + p.ModelId + '.png');
            $('.processInfo').find('.process-detail').on('click', function () {
                WorkflowEngine.ShowProcessDetail(p.ProcessId);
            });
        }
    },

    // 已结束流程撤回
    ProcessRollback: function (processId, callback) {
        $.ajax({
            type: "PUT",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?action=rollback&processId=" + processId + "&sid=" + sid,
            cache: false,
            async: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (callback) {
                        callback(data.Data);
                    } else if (data.Data === 0) {
                        WorkflowEngine.RedirectToDoListPage();
                    }
                } else if (callback) {
                    callback();
                }
            },
            error: function () {
                if (callback)
                    callback();
            }
        });
    },

    // 获取审批意见信息
    GetMessage: function (processId, instanceId, taskId) {
        var processMessage = $('.processMessage');
        if (processMessage && processMessage.length > 0) {
            var p = WFUtils.getParams();
            $.ajax({
                type: "GET",
                url: dataServiceBaseUrl + "api/WorkFlow/Form/GetMessage?sid=" + sid,
                async: true,
                cache: false,
                dataType: 'json',
                data: {
                    processId: processId?processId:p.ProcessId,
                    instanceId: instanceId?instanceId:p.InstanceId,
                    taskId: taskId?taskId:p.TaskId
                },
                success: function (data) {
                    if (data && data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data) {
                            var txtWorkFlowMessage = processMessage.find('.panel-body .workFlowMessage');
                            // 审批页面有审批意见录入框
                            if (txtWorkFlowMessage && txtWorkFlowMessage.length > 0) {
                                if (data.Data.CurrentInstanceMessage.length > 0) {
                                    var option = '';
                                    if (data.Data.CurrentInstanceMessage[0].ItemArray[9])
                                        option = data.Data.CurrentInstanceMessage[0].ItemArray[9];
                                    txtWorkFlowMessage.val(option);
                                }
                                // 绑定除当前实例外的审批内容
                                WorkflowEngine.BindMessage(data.Data.ExtInstanceMessage);
                            }
                            else {
                                // 已办只读页面，绑定所有审批内容
                                WorkflowEngine.BindMessage(data.Data.AllInstanceMessage);
                            }
                        }
                    }
                }
            });
        }
    },

    // 绑定审批意见列表
    BindMessage: function (instanceMessage) {
        if (instanceMessage && instanceMessage.length > 0) {
            var messageBody = $('.processMessage').find('.panel-body .table tbody');
            for (var i = 0; i < instanceMessage.length; i++) {
                var row = $('<tr class="h35">');
                var option = '';
                if (instanceMessage[i].ItemArray[9])
                    option = instanceMessage[i].ItemArray[9];
                row.append('<td style="text-align: center;">' + instanceMessage[i].ItemArray[4] + '</td>');
                row.append('<td style="text-align: center;">' + instanceMessage[i].ItemArray[6] + '</td>');
                row.append('<td style="text-align: center;">' + instanceMessage[i].ItemArray[10].replace('T', ' ') + '</td>');
                row.append('<td style="text-align: left;">' + option + '</td>');
                messageBody.append(row);
            }
            $('.processMessage').find('.panel-body #formWorkFlowMessage').css('margin-top', 10);
            $('.processMessage').find('.panel-body .table').show();
        }
    },

    // 获取流程变量值，并赋值到表单中
    GetInstanceContent: function (processId, instanceId) {
        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Form/GetInstanceContent?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                processId: processId,
                instanceId: instanceId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data) {
                            $.each(data.Data, function (index, item) {
                                if (!$("#" + item.Table.schemaname).val())
                                    $("#" + item.Table.schemaname).val(item.Table.Value);
                            });
                        }
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 获得办理表单的地址，并跳转
    TaskForm: function (processId, instanceId) {
        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                type: 'task',
                processId: processId,
                instanceId: instanceId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true) {
                        if (data.Message == 'NoPermisson' || data.Message == 'InvalidUser') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (data.Data) {
                            window.location.href = data.Data + '&pageNum=' + $('.GWDataTable .twbs-pagination-container:first .pagination .active a').text() + '&ReportInfoID=' + $.url().param("ReportInfoID") + '&FolderName=' + encodeURI($.url().param("FolderName")) + '&sourceUrl=' + window.location.pathname + '&CollaborateOrgID=' + $.url().param('CollaborateOrgID') + '&ReportTypeKV=' + $.url().param('ReportTypeKV') + '&Year=' + $.url().param('Year') + '&PeriodTime=' + $.url().param('PeriodTime');
                        }
                    }
                }
            }
        });
    },

    // 获取查看表单的地址，并跳转
    ViewForm: function (processId, instanceId) {
        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                type: 'view',
                processId: processId,
                instanceId: instanceId
            },
            success: function (data) {
                if (data) {
                    if (data.Success === true && data.Data) {
                        window.location.href = data.Data + '&pageNum=' + $('.GWDataTable .twbs-pagination-container:first .pagination .active a').text() + '&ReportInfoID=' + $.url().param("ReportInfoID") + '&FolderName=' + encodeURI($.url().param("FolderName")) + '&sourceUrl=' + window.location.pathname + '&CollaborateOrgID=' + $.url().param('CollaborateOrgID') + '&ReportTypeKV=' + $.url().param('ReportTypeKV') + '&Year=' + $.url().param('Year') + '&PeriodTime=' + $.url().param('PeriodTime');
                    }
                }
            },
            error: function (data) {
            }
        });
    },

    // 办理完毕后，跳转到待办列表页面
    RedirectToDoListPage: function () {
        if (window.parent && window.parent.getToDoCount) {
            window.parent.getToDoCount(function () {
                window.parent.clickNode('todoList');
            });
        } else {
            var ReportInfoID = $.url().param("ReportInfoID");
            var FolderName = $.url().param("FolderName");
            window.location.href = $.url().param("sourceUrl") + '?pageNum=' + $.url().param("pageNum") + '&ReportInfoID=' + ReportInfoID + '&FolderName=' + encodeURI(FolderName) + '&CollaborateOrgID=' + $.url().param('CollaborateOrgID') + '&ReportTypeKV=' + $.url().param('ReportTypeKV') + '&Year=' + $.url().param('Year') + '&PeriodTime=' + $.url().param('PeriodTime');
        }
    },

    // 跳转到上一页面
    RedirectToLastPage: function () {
        if (window.parent && window.parent.getToDoCount) {
            window.parent.getToDoCount();
        }
        var ReportInfoID = $.url().param("ReportInfoID");
        var FolderName = $.url().param("FolderName");
        window.location.href = $.url().param("sourceUrl") + '?pageNum=' + $.url().param("pageNum") + '&ReportInfoID=' + ReportInfoID + '&FolderName=' + encodeURI(FolderName) + '&CollaborateOrgID=' + $.url().param('CollaborateOrgID') + '&ReportTypeKV=' + $.url().param('ReportTypeKV') + '&Year=' + $.url().param('Year') + '&PeriodTime=' + $.url().param('PeriodTime');
    },

    // 保存流程变量
    SaveInstanceContent: function (callback) {
        var p = WFUtils.getParams();
        $.ajax({
            type: "GET",
            url: dataServiceBaseUrl + "api/WorkFlow/Form?sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            data: {
                instanceId: p.InstanceId
            },
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (data.Data && data.Data.length > 0) {
                        var formData = [];

                        $.each(data.Data, function (index, item) {
                            var id = item.schemaname;
                            var value = $("#" + id).val();
                            var data = {};
                            data.SchemaName = item.schemaname;
                            data.DatabaseName = item.databasename;
                            data.DisplayName = item.displayname;
                            data.SchemaValue = value;
                            formData.push(data);
                        });

                        var submitFormData = {};
                        submitFormData.InstanceId = p.InstanceId;
                        submitFormData.ProcessId = p.ProcessId;
                        submitFormData.Data = formData;
                        submitFormData.ResultCode = 0;
                        submitFormData.Message = "OK";

                        $.ajax({
                            type: "POST",
                            url: dataServiceBaseUrl + "api/WorkFlow/Form/SaveInstanceContent?sid=" + sid,
                            data: JSON.stringify(submitFormData),
                            async: true,
                            cache: false,
                            dataType: 'json',
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                if (data && data.Success === true) {
                                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                                        window.location.href = '../Common/NoRight.html';
                                    } else if (callback) {
                                        callback(data.Data);
                                    }
                                }
                            }
                        });
                    } else if (callback) {
                        callback();
                    }
                }
            }
        });
    }
};

var WorkflowAction = {
    // 保存
    Save: function (action, callback) {
        var p = WFUtils.getParams();

        // 回退的时候无需填写审批意见，所以不保存
        if (action !== 'back') {
            var txtWorkFlowMessage = $('.processMessage .panel-body .workFlowMessage');
            if (txtWorkFlowMessage && txtWorkFlowMessage.length > 0) {
                var msgContent = txtWorkFlowMessage.val().trim();
                if (filterXSS && $.isFunction(filterXSS))
                    msgContent = filterXSS(msgContent);

                $.ajax({
                    url: dataServiceBaseUrl + 'api/WorkFlow/Form/SaveMessage?sid=' + sid,
                    type: 'post',
                    async: true,
                    cache: false,
                    contentType: 'application/json; charset=utf-8',
                    dataType: 'json',
                    data: JSON.stringify({
                        ProcessID: p.ProcessId,
                        InstanceID: p.InstanceId,
                        TaskID: p.TaskId,
                        MsgContent: msgContent
                    }),
                    success: function (data) {
                        if (data && data.Success === true) {
                            if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                                window.location.href = '../Common/NoRight.html';
                            } else {
                                WorkflowEngine.SaveInstanceContent(callback);
                            }
                        }
                    }
                });
            } else {
                WorkflowEngine.SaveInstanceContent(callback);
            }

        } else {
            WorkflowEngine.SaveInstanceContent(callback);
        }
    },
    // 下一步
    Next: function (callback) {
        var postSave = function () {
            var p = WFUtils.getParams();
            var url = "../WorkFlow/InstanceMoveNext.html?modelId=" + p.ModelId + "&processId=" + p.ProcessId + "&instanceId=" + p.InstanceId + "&taskId=" + p.TaskId;
            if (callback) {
                callback(url);
            } else {
                window.location.href = url;
            }
        }
        WorkflowAction.Save('next', postSave);
    },
    // 完成
    Complete: function (callback) {
        var postSave = function () {
            var p = WFUtils.getParams();
            $.ajax({
                type: "PUT",
                url: dataServiceBaseUrl + "api/WorkFlow/Process?action=dispose&processId=" + p.ProcessId + "&sid=" + sid,
                async: false,
                cache: false,
                dataType: 'json',
                success: function (data) {
                    if (data && data.Success === true) {
                        if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                            window.location.href = '../Common/NoRight.html';
                        } else if (callback) {
                            callback(data.Data);
                        } else if (data.Data === 0) {
                            WorkflowEngine.RedirectToDoListPage();
                        } else {
                            bootbox.alert({ message: '执行失败！' });
                            $('body').loadingUI('hide');
                        }
                    } else {
                        bootbox.alert({ message: '执行失败！' });
                        $('body').loadingUI('hide');
                    }
                }
            });
        }

        WorkflowAction.Save('complete', postSave);
    },
    // 转办
    Redirect: function (callback) {
        var postSave = function () {
            var p = WFUtils.getParams();
            var url = "../WorkFlow/InstanceRedirect.html?modelId=" + p.ModelId + "&processId=" + p.ProcessId + "&instanceId=" + p.InstanceId + "&taskId=" + p.TaskId;
            if (callback) {
                callback(url);
            } else {
                window.location.href = url;
            }
        }
        WorkflowAction.Save('redirect', postSave);
    },
    // 回退
    Back: function (callback) {
        var postSave = function () {
            var p = WFUtils.getParams();
            var url = "../WorkFlow/InstanceBack.html?modelId=" + p.ModelId + "&processId=" + p.ProcessId + "&instanceId=" + p.InstanceId + "&taskId=" + p.TaskId + '&publishOrgId=' + $('#hidPublishOrgID').val();
            if (callback) {
                callback(url);
            } else {
                window.location.href = url;
            }
        }
        WorkflowAction.Save('back', postSave);
    },
    // 删除
    Delete: function (callback) {
        var p = WFUtils.getParams();
        $.ajax({
            type: "DELETE",
            url: dataServiceBaseUrl + "api/WorkFlow/Process?processId=" + p.ProcessId + "&instanceId=" + p.InstanceId + "&sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else if (callback) {
                        callback(data.Data);
                    } else if (data.Data === 0) {
                        WorkflowEngine.RedirectToDoListPage();
                    }
                }
            }
        });
    },
    // 在已办中点击撤回按钮（实例撤回）
    InstanceRollBack: function (callback) {
        var p = WFUtils.getParams();
        $.ajax({
            type: "PUT",
            url: dataServiceBaseUrl + "api/WorkFlow/Instance?instanceId=" + p.InstanceId + "&sid=" + sid,
            async: true,
            cache: false,
            dataType: 'json',
            success: function (data) {
                if (data && data.Success === true) {
                    if (data.Message == 'InvalidUser' || data.Message == 'NoPermisson') {
                        window.location.href = '../Common/NoRight.html';
                    } else {
                        callback(data.Data);
                    }
                }
            }
        });
    }
};

//工具类
var WFUtils = {
    // 获取URL中工作流的相关参数
    getParams: function () {
        var p = {};

        p.ModelId = parseInt($.url().param("modelId"), 10);
        if (!p.ModelId) p.ModelId = 0;

        p.ProcessId = parseInt($.url().param("processId"), 10);
        if (!p.ProcessId) p.ProcessId = 0;

        p.InstanceId = parseInt($.url().param("instanceId"), 10);
        if (!p.InstanceId) p.InstanceId = 0;

        p.TaskId = parseInt($.url().param("taskId"), 10);
        if (!p.TaskId) p.TaskId = 0;

        return p;
    }
}