/*
 *  gw-dataTable.js
 *  ver：1.0.1
 *  支持IE8及以上浏览器
 *  required：jquery\jquery.browser\iCheck(skins\square\blue.css)\twbs-pagination
 *  LastModifyBy : LiYang
 *  LastModifyTime : 2017-02-22 11:09:00
 */

(function ($) {
    "use strict";

    var defaultOptions = {
        /* 表属性 */
        tableTitle: '',  // 标题
        tableCollapse: false,  // 是否启用折叠表格功能，在tableTitle不为空时有效
        tableIcon: false,  // 是否在标题前显示图标，在tableTitle不为空时有效
        // btn配置：
        //{
        //    id: '',  // 按钮ID
        //    name: '',  // 按钮Name
        //    btnClass:'',  // 自定义类样式名称
        //    faClass: '',  // font-awesome图标名称，例如hand-paper-o
        //    text: '',  // 按钮文字
        //    enabled: function () { },  // 按钮是否可用，可以直接设置true或false，也可以为函数，返回true或false即可
        //    onclick: function (e) {  }  // 点击事件，可以直接设置函数名称，也可以为函数
        //}
        toolbar: { 'btn': [], 'selector': '' },  // 按钮工具栏，btn传入按钮配置，selector为工具栏的外部html选择器，在tableTitle不为空时有效

        /* 分割线 */
        showLine: true, // 是否显示工具栏和表格之间的分割线

        // 表格
        tableOverflowY: 'auto',  // 控制表格内容是否出现纵向滚动条overflow-y属性，默认为auto，在表格内部滚动，在不分页显示数据的情况下可设置为visible把表格撑开出现其父元素的滚动条
        /* 列属性 */
        showHeader: true, // 是否显示表头
        headerTextWeightBold: true,  // 表头字体是否加粗
        // 列配置：
        // {
        //    title: '',  // 列标题文本
        //    field: '',  // 列字段名称
        //    nowrap: true,  // 在列内容超出宽度后是否折行显示，默认不折行，显示...
        //    width: 'auto',  // 列的宽度，默认为auto
        //    align: 'left',  // 列数据水平对齐方式，left\right\center，默认为left
        //    sortable: false,  // 是否启用列排序，本地数据暂不支持
        //    order: 'desc',  // 默认排序数序，asc\desc，默认为desc，在sortable=true时有效
        //    hidden: false,  // 是否隐藏列，也可以为函数，返回布尔值即可，格式为：function (value, row, rows, index) { }，value为当前字段的值，row为当前行的数据源，rows为整体的数据源，index为当前行索引，从0开始
        //    formatter: function (value, rowData, index) { },  // 格式化单元格内容函数，value为当前字段的值，rowData为当前行的数据源，index为当前行索引，从0开始
        //    styler: function (value, rowData, index) { }  // 格式化单元格样式函数，value为当前字段的值，rowData为当前行的数据源，index为当前行索引，从0开始
        // }
        columns: [],

        /* 行属性 */
        idField: '',  // 指明哪一个字段是标识字段
        rowNumbers: false,  // 是否显示行号
        checkbox: false,  // 是否显示选择框，默认为单选
        multiCheck: false,  // 是否允许多选，如果允许多选则会显示全选框

        rowStriped: true, // 是否显示数据行斑马线效果
        rowHover: true, // 是否显示数据行鼠标Hover变色效果
        rowSelect: false, // 是否启用数据行选中效果
        checkOnSelect: false,  // 在rowSelect为true时有效，如果为true，当点击行的时候该复选框就会被选中或取消选中。如果为false，仅在点击该复选框的时候才会被选中或取消
        rowStyler: function (rowIndex, rowData) { },  // 格式化数据行样式函数，rowIndex为选择行的索引，从0开始；rowData对应于所选行的记录
        rowAttr: function (rowIndex, rowData) { },  // DataRow属性函数，rowIndex为选择行的索引，从0开始；rowData对应于所选行的记录

        onRowCheck: function (rowIndex, rowData) { }, // 在勾选一行时触发，rowIndex为选择行的索引，从0开始；rowData对应于所选行的记录
        onRowUnCheck: function (rowIndex, rowData) { }, // 在取消勾选一行时触发，rowIndex为选择行的索引，从0开始；rowData对应于所选行的记录
        onRowCheckAll: function (rows) { }, // 在勾选所有行时触发
        onRowUnCheckAll: function (rows) { }, // 在取消勾选所有行时触发

        /* 数据 */
        data: null, // 本地数据源，格式要求：{ "totalcount": 99, "rows": [ ... ] }
        dataUrl: null, // 远程数据地址，服务器返回数据格式为：{ Success: true, Message: "", Data: { "totalcount": 99, "rows": [ ... ] } }
        method: 'get', // 请求远程数据方法
        params: {}, // 请求数据时的参数
        queryParams: function (pageNumber, pageSize, sortCondition) { },  // 自定义额外查询参数（可以包装分页参数和排序参数到查询对象中）
        loadMsg: '加载中...', // 在从远程站点加载数据的时候显示提示消息
        async: true, // 是否异步请求数据
        cache: false, // 是否从缓存中加载数据
        dataType: 'json', // 返回数据类型，默认为json
        noDataImgPath: '',  // 在没有数据时，自定义要显示的图片（此时下面的noDataText不生效，自定义图片中应包含说明文字）
        noDataText: '暂无数据。',  // 在没有数据时，自定义显示的文字提示

        /* 分页 */
        pagination: false,  // 是否显示分页栏，本地数据暂不支持翻页效果
        pageNumber: 1,  // 在设置分页属性的时候初始化页码
        pageSize: 0,  // 在设置分页属性的时候初始化页面大小

        /* 事件 */
        onNoData: null,  // 没有数据时触发，此时noDataImgPath、noDataText无效。
        onLoadError: function (e) { }, // 在载入远程数据产生错误的时候触发
        onBeforeLoad: function (data) { }, // 在载入请求数据数据之前触发，供用户修改数据，如果返回false可终止载入数据操作
        onLoadSuccess: function (table, data) { }, // 在数据加载成功的时候触发
        onClickRow: function (rowIndex, rowData) { }, // 在点击一行时触发，其中rowIndex为点击行的索引，从0开始；rowData对应于点击行的记录，返回false可以阻止之后的操作
        onDblClickRow: function (rowIndex, rowData) { }, // 在双击一行时触发，其中rowIndex为点击行的索引，从0开始；rowData对应于点击行的记录
        onClickCell: function (rowIndex, field, value) { }, // 在点击一个单元格的时候触发
        onDblClickCell: function (rowIndex, field, value) { }, // 在双击一个单元格的时候触发
        onSortColumn: function (sort, order) { } // 在用排序一列时触发，sort为排序列字段名称，order为排序列的顺序(ASC或DESC)
    };

    var GWDataTable = function (element, options) {
        this.rowDataAll = [];
        this.pageCountLast = 0;
        this.sortCondition = '';

        this.$element = $(element);
        this.$element.css('position', 'relative');

        this.$container = $('<div class="GWDataTable"></div>');
        this.$element.empty().append(this.$container);
        this.build(options);
    }

    GWDataTable.prototype = {
        constructor: GWDataTable,

        // 生成表格
        build: function (options) {
            var self = this;
            self.options = $.extend({}, defaultOptions, options);

            //生成表格头部，加载表体
            var renderTable = function () {
                // 标题和按钮工具栏
                if (self.options.tableTitle) {
                    var tableToolbar = $('<div class="table-toolbar"></div>');

                    // 标题
                    tableToolbar.append('<div class="table-title-container">' +
                                                        (self.options.tableCollapse === true ? '<i class="table-title-collapse-icon fa fa-minus-square-o">&nbsp;</i>' : '') +
                                                        (self.options.tableIcon === true ? '<i class="table-title-default-icon fa fa-th-large" style="' + (self.options.tableCollapse === false ? 'margin-left: 0;' : '') + '">&nbsp;</i>' : '') +
                                                        '<span class="table-title-text" style="' + ((self.options.tableCollapse === false && self.options.tableIcon === false) ? 'margin-left: 0;' : '') + '">' + self.options.tableTitle + '</span>' +
                                                    '</div>');

                    // 按钮工具栏
                    if ((self.options.toolbar.btn && self.options.toolbar.btn.length > 0) || self.options.toolbar.selector) {
                        var btnContainer = $('<div class="table-btn-container"></div>');
                        var btnGroup = $('<div class="btn-group"></div>');
                        if (self.options.toolbar.btn && self.options.toolbar.btn.length > 0) {
                            $.each(self.options.toolbar.btn, function (i, btn) {
                                var button = $('<button class="btn btn-default" id="' + (btn.id ? btn.id : '') + '" name="' + (btn.name ? btn.name : '') + '" type="button"><span class="fa fa-' + btn.faClass + '"></span>&nbsp;' + btn.text + '</button>');
                                if (btn.btnClass) {
                                    $(button).addClass(btn.btnClass);
                                }

                                if (btn.enabled === false) {
                                    $(button).prop('disabled', true);
                                } else if ($.isFunction(btn.enabled)) {
                                    if (btn.enabled() === false) {
                                        $(button).prop('disabled', true);
                                    }
                                }

                                if ($.isFunction(btn.onclick)) {
                                    $(button).off('click').on('click', function (e) {
                                        e.preventDefault();
                                        btn.onclick(e);
                                    });
                                } else if (typeof (btn.onclick) === 'string') {
                                    $(button).attr('onclick', btn.onclick);
                                }

                                btnGroup.append(button);
                            });
                        } else {
                            btnGroup.append($(self.options.toolbar.selector).html());
                            $(self.options.toolbar.selector).remove();
                        }
                        btnContainer.append(btnGroup);
                        tableToolbar.append(btnContainer);
                    }

                    self.$container.append(tableToolbar);
                }

                // 分割线
                if (self.options.showLine === true) {
                    var hrline = $('<div class="hrline"></div>');
                    if (!self.options.tableTitle) {
                        hrline.css('top', 0);
                    }
                    self.$container.append(hrline);
                }

                // 表格
                var tableTop = '40px';
                if (!self.options.tableTitle) {
                    if (self.options.showLine !== true) {
                        tableTop = '0';
                    } else {
                        tableTop = '3px';
                    }
                } else if (self.options.showLine === true) {
                    tableTop = '43px';
                }
                var tableContainer = $('<div class="table-container collapse in" style="top: ' + tableTop + '"></div>');

                // 表头
                var tableHeadContainer;
                if (self.options.showHeader === true) {
                    tableHeadContainer = $('<div class="table-head-container"></div>');
                    tableHeadContainer.append('<div class="table-fixed"></div>');
                    var tableHead = $('<div class="table-head"></div>');
                    var tableHeadRow = $('<div class="table-head-row" style="font-weight: ' + (self.options.headerTextWeightBold === true ? 'bold' : 'normal') + ';"></div>');

                    var colIndex = 0;
                    if (self.options.rowNumbers === true) {
                        tableHeadRow.append('<div class="table-th" data-colindex="' + colIndex + '" style="width: 20px; padding-right: 0;"></div>');
                        colIndex += 1;
                    }
                    if (self.options.checkbox === true) {
                        tableHeadRow.append('<div class="table-th" data-colindex="' + colIndex + '" style="width: 25px; padding-right: 0;"><input class="checkAll" type="checkbox" style="display: none;" /></div>');
                        colIndex += 1;
                    }

                    $.each(self.options.columns, function (i) {
                        var style = 'style="';
                        style += 'width: ' + ((this.width && this.width > 0) ? (this.width + 'px') : '100%') + '; ';  // auto,!IE8
                        style += 'text-align: ' + (this.align ? this.align : 'left') + ';';
                        style += '"';

                        tableHeadRow.append('<div class="table-th" data-colindex="' + colIndex + '" data-colname="' + this.field + '" ' + style + '>' + this.title + '</span>' + (this.sortable === true ? '<span class="sort" data-order="' + (this.order ? this.order : 'desc') + '" data-defaultorder="' + (this.order ? this.order : 'desc') + '"></span>' : '') + '</div>');
                        colIndex += 1;
                    });

                    tableHead.append(tableHeadRow);
                    tableHeadContainer.find('.table-fixed').append(tableHead);
                    tableContainer.append(tableHeadContainer);
                }

                // 表体
                var tableContentContainer = $('<div class="table-content-container" style="' + ('overflow-y: ' + (self.options.pagination !== true ? self.options.tableOverflowY : 'auto') + '; ') + (self.options.pagination === true ? 'bottom: 45px;' : '') + '"></div>');
                if (self.options.pagination !== true) {
                    if (self.options.tableOverflowY !== 'auto')
                        self.$element.css('overflow', self.options.tableOverflowY);  // visible
                } else {
                    self.$element.css('overflow', 'hidden');
                }
                tableContentContainer.append('<div class="table-fixed"></div>');
                var tableBody = tableContentContainer.find('.table-fixed');
                tableContainer.append(tableContentContainer);
                self.$container.append(tableContainer);
                tableContentContainer.css('top', self.options.showHeader === true ? (tableHeadContainer.height() === 0 ? '40px' : tableHeadContainer.height()) : 0);

                if (self.options.pagination === true && self.options.pageSize === 0) {
                    self.options.pageSize = Math.floor(tableBody.height() / 40);
                }
                tableBody.css('height', 'auto');

                // 绑定本地数据
                if (self.options.data) {
                    try {
                        var bRenderTable = true;
                        if (self.options.onBeforeLoad && $.isFunction(self.options.onBeforeLoad)) {
                            if (self.options.onBeforeLoad(self.options.data) === false) {
                                bRenderTable = false;
                            }
                        }
                        if (bRenderTable === true) {
                            renderTableBody(self.options.data, tableBody);
                            if (self.options.onLoadSuccess && $.isFunction(self.options.onLoadSuccess)) {
                                self.options.onLoadSuccess(self.$container, self.options.data);
                            }
                        }
                    } catch (e) {
                        if (self.options.onLoadError && $.isFunction(self.options.onLoadError)) {
                            self.options.onLoadError(e);
                        }
                    }
                } else if (self.options.dataUrl) {
                    self.$container.processServerData(self.options.pageNumber);
                } else {
                    noData();
                }
            }

            self.$element.ajaxRequest = null;
            // 请求服务器数据
            var loadServerData = function (pageNumber, onSuccess) {
                if (self.$element.ajaxRequest) {
                    self.$element.ajaxRequest.abort();
                }

                if ($.isFunction(self.options.queryParams)) {
                    var queryParams = self.options.queryParams(pageNumber, self.options.pageSize, self.sortCondition);
                    if (queryParams) {
                        self.options.params = $.extend({}, self.options.params, queryParams);
                    }
                } else if (self.options.pagination === true) {
                    if (!self.options.params.pageNumber) self.options.params.pageNumber = pageNumber;
                    if (!self.options.params.pageSize) self.options.params.pageSize = self.options.pageSize;
                    if (!self.options.params.sortCondition && sortCondition) self.options.params.sortCondition = self.sortCondition;
                } else {
                    if (!self.options.params.sortCondition && sortCondition) self.options.params.sortCondition = self.sortCondition;
                }

                var ajaxOptions = {
                    type: self.options.method,
                    url: self.options.dataUrl,
                    data: self.options.params,
                    async: self.options.async,
                    cache: self.options.cache,
                    dataType: self.options.dataType,
                    beforeSend: function () {
                        if (self.options.loadMsg) {
                            self.$element.loadingUI({ text: self.options.loadMsg });
                        }
                    },
                    success: function (response) {
                        self.$element.ajaxRequest = null;
                        if (response && response.Success === true && response.Data) {
                            var bRenderTable = true;
                            var data = response.Data;
                            if (typeof (data) === 'string') {
                                data = JSON.parse(data);
                            }
                            if (self.options.onBeforeLoad && $.isFunction(self.options.onBeforeLoad)) {
                                if (self.options.onBeforeLoad(data) === false) {
                                    bRenderTable = false;
                                }
                            }
                            if (bRenderTable === true) {
                                onSuccess(data);
                            }
                        } else {
                            noData();
                        }
                        if (self.options.loadMsg) {
                            self.$element.loadingUI('hide');
                        }
                    },
                    error: function (xhr, e) {
                        if (self.options.loadMsg) {
                            self.$element.loadingUI('hide');
                        }
                        if (e === 'abort') {
                            return;
                        }
                        if (self.options.onLoadError && $.isFunction(self.options.onLoadError)) {
                            self.options.onLoadError(e);
                        }
                    }
                };

                self.$element.ajaxRequest = $.ajax(ajaxOptions);
            }

            // 处理服务器数据
            self.$container.processServerData = function (pageNumber) {
                var tableBody = self.$container.find('.table-content-container .table-fixed');

                loadServerData(pageNumber, function (data) {
                    renderTableBody(data, tableBody);
                    if (self.options.onLoadSuccess && $.isFunction(self.options.onLoadSuccess)) {
                        self.options.onLoadSuccess(self.$container, data);
                    }
                });
            }

            // 分页控件设置
            var renderPager = function (totalCount) {
                self.$container.find('.table-container .twbs-pagination-container').remove();
                var pagerContainer = $('<div class="twbs-pagination-container"><ul class="pagination"></ul></div>');
                self.$container.find('.table-container').append(pagerContainer);
                var pageCount;
                if (totalCount === 0) {
                    pageCount = 0;
                } else {
                    pageCount = Math.ceil(totalCount / self.options.pageSize);
                }
                if (pageCount !== self.pageCountLast) {
                    self.$container.find('.twbs-pagination-container').html('<ul class="pagination"></ul>');
                }
                self.pageCountLast = pageCount;
                if (pageCount === 0) {
                    self.$container.find('.twbs-pagination-container').hide();
                } else {
                    self.$container.find('.twbs-pagination-container .pagination').twbsPagination({
                        totalPages: pageCount,
                        startPage: self.options.pageNumber,
                        visiblePages: 5,
                        initiateStartPageClick: false,
                        onPageClick: function (event, pageNumber) {
                            if (!self.options.data && self.options.dataUrl) {
                                self.options.pageNumber = pageNumber;
                                self.$container.processServerData(self.options.pageNumber);
                            }
                        }
                    });
                    self.$container.find('.twbs-pagination-container').show();
                }
            }

            // 生成表格体
            var renderTableBody = function (data, tableBody) {
                tableBody.empty();

                if (data.rows && data.rows.length > 0) {
                    self.rowDataAll = data.rows;
                    var tableBodyHtml = '<div class="table-body">';

                    $.each(data.rows, function (rowIndex) {
                        if (self.options.pagination === true && (rowIndex + 1) > self.options.pageSize) {
                            return;
                        }

                        var rowData = this;
                        var rowStyle = '';
                        var rowAttr = '';
                        var colIndex = 0;

                        if (self.options.rowStriped) {
                            if (((rowIndex + 1) % 2) === 0) {
                                rowStyle = "background-color: #edf1f3;";
                            } else {
                                rowStyle = "background-color: #ffffff;";
                            }
                        }

                        if (self.options.rowStyler && $.isFunction(self.options.rowStyler)) {
                            var style = self.options.rowStyler(rowIndex, rowData);
                            if (style)
                                rowStyle += style;
                        }

                        if (self.options.rowAttr && $.isFunction(self.options.rowAttr)) {
                            rowAttr = self.options.rowAttr(rowIndex, rowData);
                            if (rowAttr) {
                                rowAttr = ' ' + rowAttr;
                            }
                        }
                        tableBodyHtml += '<div class="table-row"' + (self.options.idField ? ' data-id="' + rowData[self.options.idField] + '"' : '') + 'data-rowindex="{0}"{1} style="{2}">'.format(rowIndex, rowAttr, rowStyle);

                        if (self.options.rowNumbers === true) {
                            tableBodyHtml += '<div class="table-cell textOverFlowEllipsis" data-colindex="' + colIndex + '" style="width: 20px; padding-right: 0; text-align: center;">' + (rowIndex + 1) + '</div>';
                            colIndex += 1;
                        }
                        if (self.options.checkbox === true) {
                            tableBodyHtml += '<div class="table-cell textOverFlowEllipsis" data-colindex="' + colIndex + '" style="width: 25px; padding-right: 0;"><input type="checkbox" /></div>';
                            colIndex += 1;
                        }

                        $.each(self.options.columns, function (i) {
                            var col = this;
                            var cellHtml = '';

                            if (col.formatter && $.isFunction(col.formatter)) {
                                cellHtml += col.formatter(rowData[col.field], rowData, rowIndex);
                            } else {
                                cellHtml += rowData[col.field] || '';
                            }

                            var cellStyle = 'style="';
                            if (col.width && col.width > 0) {
                                cellStyle += 'width: ' + col.width + 'px;';
                            } else {
                                cellStyle += 'width: 100%;';  // auto,!IE8
                            }
                            cellStyle += 'text-align: ' + (col.align || 'left') + ';';

                            if (col.styler && $.isFunction(col.styler)) {
                                cellStyle += col.styler(rowData[col.field], rowData, rowIndex) + ';';
                            }
                            cellStyle += '"';

                            tableBodyHtml += '<div class="table-cell' + (col.nowrap === false ? '' : ' textOverFlowEllipsis') + ' ' + col.field + '" data-colindex="{0}" {1}>{2}</div>'.format(colIndex, cellStyle, cellHtml);
                            colIndex += 1;
                        });

                        tableBodyHtml += '</div>';
                    });
                    tableBodyHtml += '</div>';

                    tableBody.append(tableBodyHtml);

                    // 列的隐藏和显示
                    $.each(self.options.columns, function (i) {
                        var hidden = false;
                        if (this.hidden === true) {
                            hidden = true;
                        } else if ($.isFunction(this.hidden)) {
                            hidden = this.hidden(data.rows);
                        }
                        if (hidden === true) {
                            self.hideColumn(this.field);
                        } else {
                            self.showColumn(this.field);
                        }
                    });

                    // 表体内容出现滚动条后，为head设置right，保持和表体对齐
                    var w1 = self.$container.find('.table-content-container').width();
                    var w2 = self.$container.find('.table-content-container')[0].clientWidth;
                    if (w2 < w1) {
                        self.$container.find('.table-head-container').css('right', w1 - w2);
                    } else {
                        self.$container.find('.table-head-container').css('right', 0);
                    }

                    if (self.options.checkbox === true) {
                        renderCheckBox();
                    }
                    if (self.options.pagination === true) {
                        renderPager(data.totalcount);
                    }
                } else {
                    self.rowDataAll = [];
                    // 列的隐藏和显示
                    $.each(self.options.columns, function (i) {
                        var hidden = false;
                        if (this.hidden === true) {
                            hidden = true;
                        } else if ($.isFunction(this.hidden)) {
                            hidden = this.hidden(data.rows);
                        }
                        if (hidden === true) {
                            self.hideColumn(this.field);
                        } else {
                            self.showColumn(this.field);
                        }
                    });

                    if (self.options.checkbox === true && self.options.multiCheck === true) {
                        self.$container.find('.table-container .table-head-container .table-th .checkAll').hide();
                        self.$container.find('.table-container .table-head-container .table-th .icheckbox_square-blue-16').hide();
                    }
                    noData();
                }

                if (self.options.pagination === false && self.options.tableOverflowY === 'visible') {
                    self.$element.css('height', 'auto');
                    self.$element.css('height', self.$container.get(0).scrollHeight);
                    self.$element.css('min-height', 0);
                }

                bindEvent();
            }

            // 初始化icheck
            var renderCheckBox = function () {
                self.$container.find('input[type=checkbox]').iCheck({
                    checkboxClass: 'icheckbox_square-blue-16'
                }).on('ifClicked', function () {
                    if ($(this).is(':checked')) {  // 取消选中
                        if ($(this).hasClass('checkAll')) {
                            self.uncheckAll();
                        } else {
                            self.uncheckRow($(this).parent().parent().parent().data('rowindex'));
                        }
                    } else {  // 选中
                        if ($(this).hasClass('checkAll')) {
                            self.checkAll();
                        } else {
                            self.checkRow($(this).parent().parent().parent().data('rowindex'));
                        }
                    }
                });

                if (self.options.multiCheck === true) {
                    self.$container.find('.table-container .table-head-container .table-th .checkAll').iCheck('uncheck');
                    self.$container.find('.table-container .table-head-container .table-th .checkAll').show();
                    self.$container.find('.table-container .table-head-container .table-th .icheckbox_square-blue-16').show();
                } else {
                    self.$container.find('.table-container .table-head-container .table-th .checkAll').hide();
                    self.$container.find('.table-container .table-head-container .table-th .icheckbox_square-blue-16').hide();
                }
            };

            // 没有数据
            var noData = function () {
                self.$container.find('.table-content-container .table-fixed').empty();
                if (self.options.pagination === true)
                    self.$container.find('.twbs-pagination-container').hide();

                if ($.isFunction(self.options.onNoData)) {
                    self.options.onNoData();
                } else {
                    if (self.options.noDataImgPath) {
                        self.$container.find('.table-content-container .table-fixed').append('<div class="noData"><img src="' + self.options.noDataImgPath + '" alt="" /></div>');
                    } else {
                        self.$container.find('.table-content-container .table-fixed').append('<div class="noData">' +
                            '<div class="img">' +
                            '</div>' +
                            '<div class="text">'
                            + self.options.noDataText + '</div>' +
                            '</div>');
                    }
                }
            }

            // 绑定事件
            var bindEvent = function () {
                // 表格折叠
                if (self.options.tableCollapse === true) {
                    var isBelowIE10 = false;
                    if ($.browser && $.browser.msie && $.browser.version && parseInt($.browser.version) < 10) {
                        isBelowIE10 = true;
                    }

                    self.$container.find('.table-toolbar .table-title-container .table-title-collapse-icon').off('click').on('click', function () {
                        if ($(this).hasClass('fa-minus-square-o')) {
                            $(this).removeClass('fa-minus-square-o').addClass('fa-plus-square-o');
                            if (isBelowIE10) {
                                self.$container.find('.table-container').removeClass('collapse in').addClass('collapse');

                                if (self.options.pagination === false && self.options.tableOverflowY === 'visible') {
                                    self.$element.data('height', self.$element.css('height'));
                                    var h = self.$container.find('.table-toolbar').outerHeight(true);
                                    if (self.options.showLine === true) h += 3;
                                    self.$element.css('height', h);
                                }
                            }
                        } else {
                            $(this).removeClass('fa-plus-square-o').addClass('fa-minus-square-o');
                            if (isBelowIE10) {
                                self.$container.find('.table-container').removeClass('collapse').addClass('collapse in');

                                if (self.options.pagination === false && self.options.tableOverflowY === 'visible') {
                                    self.$element.css('height', self.$element.data('height'));
                                }
                            }
                        }

                        if (!isBelowIE10) {
                            self.$container.find('.table-container').collapse('toggle');
                        }
                    });

                    if (self.options.pagination === false && self.options.tableOverflowY === 'visible' && !isBelowIE10) {
                        self.$container.find('.table-container').off('hidden.bs.collapse').on('hidden.bs.collapse', function () {
                            self.$element.data('height', self.$element.css('height'));
                            var h = self.$container.find('.table-toolbar').outerHeight(true);
                            if (self.options.showLine === true) h += 3;
                            self.$element.css('height', h);
                        }).off('show.bs.collapse').on('show.bs.collapse', function () {
                            self.$element.css('height', self.$element.data('height'));
                        });
                    }
                }

                // 数据行鼠标Hover变色效果
                if (self.options.rowHover === true) {
                    var isIE8 = false;
                    if ($.browser && $.browser.msie && $.browser.version && parseInt($.browser.version) < 9) {
                        isIE8 = true;
                    }
                    self.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row').each(function () {
                        $(this).on('mouseover', function () {
                            if (isIE8) {
                                $(this).addClass('row-hoverIE8');
                            } else {
                                $(this).addClass('row-hover');
                            }
                        }).on('mouseout', function () {
                            if (isIE8) {
                                $(this).removeClass('row-hoverIE8');
                            } else {
                                $(this).removeClass('row-hover');
                            }
                        });
                    });
                }

                // 行选中
                if (self.options.rowSelect === true) {
                    self.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row').each(function () {
                        var row = this;
                        $(this).on('click', function (e) {
                            var clickRow = true;
                            if (self.options.onClickRow && $.isFunction(self.options.onClickRow)) {
                                var rowIndex = $(row).data('rowindex');
                                var returnValue = self.options.onClickRow(rowIndex, self.rowDataAll[rowIndex]);
                                if (typeof (returnValue) === 'boolean') {
                                    clickRow = returnValue;
                                }
                            }
                            if (clickRow === true) {
                                if (self.options.checkOnSelect === true) {
                                    var nodeName = e.target.nodeName.toLowerCase();
                                    if (nodeName !== 'a' && nodeName !== "a") {
                                        if ($(row).hasClass('row-active')) {
                                            self.uncheckRow($(row).data('rowindex'));
                                        } else {
                                            self.checkRow($(row).data('rowindex'));
                                        }
                                    }
                                }
                            }
                        }).on('dblclick', function (e) {
                            if (self.options.onDblClickRow && $.isFunction(self.options.onDblClickRow)) {
                                var rowIndex = $(row).data('rowindex');
                                self.options.onDblClickRow(rowIndex, self.rowDataAll[rowIndex]);
                            }
                        });
                    });
                }

                // 排序
                var sortColumns = self.$container.find('.table-container .table-head-container .table-fixed .table-head .table-head-row .table-th span.sort');
                if (sortColumns && sortColumns.length > 0) {
                    sortColumns.each(function () {
                        var $span = $(this);
                        $span.parent().css('cursor', 'pointer').off('click').on('click', function () {
                            var sort = $span.parent().data('colname');
                            var order = $span.data('order');
                            if (!order) order = 'desc';
                            self.sortCondition = sort + ' ' + order;
                            sortColumns.removeClass('asc').removeClass('desc');
                            $span.addClass(order);
                            $span.data('order', order === 'asc' ? 'desc' : 'asc');

                            if (self.options.onSortColumn && $.isFunction(self.options.onSortColumn)) {
                                self.sortCondition = self.options.onSortColumn(sort, order);
                            }

                            if (!self.options.data && self.options.dataUrl) {
                                self.options.pageNumber = 1;
                                self.pageCountLast = 0;
                                processServerData(self.options.pageNumber);
                            }
                        });
                    });
                }
            }

            renderTable();
        },

        // 显示指定的列
        showColumn: function (field) {
            var th = this.$container.find('.table-container .table-head-container .table-fixed .table-head .table-head-row .table-th[data-colname=' + field + ']');
            th.show();
            this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row .table-cell[data-colindex=' + th.data('colindex') + ']').show();
        },

        // 隐藏指定的列
        hideColumn: function (field) {
            var th = this.$container.find('.table-container .table-head-container .table-fixed .table-head .table-head-row .table-th[data-colname=' + field + ']');
            th.hide();
            this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row .table-cell[data-colindex=' + th.data('colindex') + ']').hide();
        },

        // 返回当前页的所有行
        getRows: function () {
            return this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row');
        },

        // 勾选当前页中的所有行
        checkAll: function () {
            if (this.options.multiCheck === true) {
                this.$container.find('input[type=checkbox]').iCheck('check');
                var rows = this.getRows();
                rows.removeClass('row-active').addClass('row-active');
                if (this.options.onRowCheckAll && $.isFunction(this.options.onRowCheckAll)) {
                    this.options.onRowCheckAll(this.rowDataAll);
                }
            }
        },

        // 取消勾选当前页中的所有行
        uncheckAll: function () {
            this.$container.find('input[type=checkbox]:checked').iCheck('uncheck');
            var rows = this.getRows();
            rows.removeClass('row-active');
            if (this.options.onRowUnCheckAll && $.isFunction(this.options.onRowUnCheckAll)) {
                this.options.onRowUnCheckAll(this.rowDataAll);
            }
        },

        // 勾选一行
        checkRow: function (rowIndex) {
            if (this.options.multiCheck !== true) {
                this.uncheckAll();
            }
            var row = this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row[data-rowindex="' + rowIndex + '"]');
            $(row).find('.table-cell input[type=checkbox]').iCheck('check');
            if (!$(row).hasClass('row-active')) $(row).addClass('row-active');
            if (this.options.onRowCheck && $.isFunction(this.options.onRowCheck)) {
                this.options.onRowCheck(rowIndex, this.rowDataAll[rowIndex]);
            }
        },

        // 取消勾选一行
        uncheckRow: function (rowIndex) {
            var row = this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row[data-rowindex="' + rowIndex + '"]');
            $(row).find('.table-cell input[type=checkbox]').iCheck('uncheck');
            $(row).removeClass('row-active');
            if (this.options.onRowUnCheck && typeof (this.options.onRowUnCheck) === 'function') {
                this.options.onRowUnCheck(rowIndex, this.rowDataAll[rowIndex]);
            }
        },

        // 返回所有被勾选的行
        getChecked: function () {
            var self = this;
            var checkedRowsData = [];
            var checkedRows = this.$container.find('.table-container .table-content-container .table-fixed .table-body .table-row.row-active');
            checkedRows.each(function () {
                checkedRowsData.push(self.rowDataAll[$(this).data('rowindex')]);
            });
            return checkedRowsData;
        },

        // 返回属性对象
        options: function () {
            return this.options;
        },

        // 加载和显示第一页的所有行。如果指定了'param'，它将取代'queryParams'属性。
        // 通常可以通过传递一些参数执行一次查询，通过调用这个方法从服务器加载新数据。
        load: function (param, pageNum) {
            if (this.options.dataUrl) {
                var sortColumns = this.$container.find('.table-container .table-head-container .table-fixed .table-head .table-head-row .table-th span.sort');
                if (sortColumns && sortColumns.length > 0) {
                    this.sortCondition = '';
                    sortColumns.each(function () {
                        $(this).removeClass('asc').removeClass('desc');
                        $(this).data('order', $(this).data('defaultorder'));
                    });
                }
                if (param) {
                    this.options = $.extend({}, this.options, param);
                }
                if (pageNum > 0) {
                    this.options.pageNumber = pageNum;
                } else {
                    this.options.pageNumber = 1;
                }
                this.pageCountLast = 0;
                this.$container.processServerData(this.options.pageNumber);
            }
        },

        // 重载行。等同于'load'方法，但是它将保持在当前页
        reload: function (param) {
        },

        // 加载本地数据，旧的行将被移除
        loadData: function (data) {

        },

        // 返回加载完毕后的数据
        getData: function () {
            var self = this;
            return self.rowDataAll;
        },

        // 高亮一行
        highlightRow: function (rowIndex) {

        },

        // 通过ID值参数选择一行
        selectRecord: function (idValue) {

        }
    }

    $.fn.GWDataTable = function (arg1, arg2, arg3) {
        var results = [];

        this.each(function () {
            var gWDataTable = $(this).data('GWDataTable');
            if (!gWDataTable || arg2 === 'refresh') {
                gWDataTable = new GWDataTable(this, arg1);
                $(this).data('GWDataTable', gWDataTable);
                results.push(gWDataTable);
            } else if (!arg1 && !arg2) {
                results.push(gWDataTable);
            } else if (gWDataTable[arg1]) {
                var retVal;
                if (gWDataTable[arg1].length === 2) {
                    retVal = gWDataTable[arg1](arg2, arg3);
                } else {
                    retVal = gWDataTable[arg1](arg2);
                }
                if (retVal)
                    results.push(retVal);
            }
        });

        if (typeof arg1 === 'string') {
            return results.length > 1 ? results : results[0];
        } else {
            return results;
        }
    }

    $.fn.GWDataTable.Constructor = GWDataTable;

    if (!String.prototype.trim) {
        String.prototype.trim = function () {
            return this.replace(/(^\s*)|(\s*$)/g, '');
        }
    }

    if (!String.prototype.format) {
        String.prototype.format = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] !== 'undefined' ? args[number] : match;
            });
        };
    }
})(jQuery);