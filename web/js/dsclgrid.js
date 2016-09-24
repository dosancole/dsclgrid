/*
 * dsclgrid.js for jQuery - v1.01 2012.12.20
 * http://dosancole.github.com/dsclgrid/
 *
 * Copyright (c) 2011- takuya Dosancole.
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Some icons are created by http://www.fatcow.com/free-icons .
 */
(function ($) {
    $.addDsclgrid = function (t, p) {
        if (t.grid)
            return false;
        // -----------------------------
        // apply default props.
        // -----------------------------
        p = $.extend({
            innerTableId: t.id + "_innerTable",
            pagestat: "全 {total} 件のうち、{from} - {to} 件目を表示中",
            page: 1,
            total: 9,
            rp: 10,
            pager: false,
            sortable: false,
            sortCol: [],
            sortAsc: [],
            sortColn: [],
            sortBase: '',
            sortNum: 3,
            titlebar: true,
            cssSkin: "sSky",
            fixedCols: 2,
            headerRows: 1,
            width: "800px",
            height: "200px",
            method: "POST",
            visible: false,
            editLimit: false,
            tokeyKey: false,
            modeluse: false,
            onClick: false,
            onDblClick: false,
            onLoad: false,
            onSelectChanged: false,
            onCheckChanged: false,
            onPreLoad: false,
            onError: false,
            toScrollTop: 0,
            toScrollLeft: 0,
            toScrollBottomAtOnce: false,
            disabled: false,
            autosize: false,
            autoMarginWidth: 100,
            autoMarginHeight: 100,
            checkable: false,
            empty: true
        }, p);
        if (p.autosize) {
            p.width = ($(window).width() - p.autoMarginWidth) + "px";
            p.height = ($(window).height() - p.autoMarginHeight) + "px";
        }
        p.order = p.sortBase;
        if (p.modeluse) {
            // モデルの削減
            var temp = new Array();
            p.colWidths = new Array();
            $.each(p.model, function (i, m) {
                if (p.modeluse[i] == null || p.modeluse[i]) {
                    temp.push(m);
                    p.colWidths.push(m.width);
                }
            });
            p.model = temp;
        } else {
            p.colWidths = $.map(p.model, function (n, i) {
                return n.width;
                // TODO width未指定の場合に変になる
            });
        }
        // モデルのパラメタ化
        $.each(p.model, function (i, m) {
            var splited = m.name.split('_');
            var a = '';
            $.each(splited, function (i, s) {
                if (i == 0) {
                    a += s;
                } else {
                    a += s.charAt(0).toUpperCase();
                    a += s.substring(1, s.length);
                }
            });
            m.param = a;
        });
        // 編集アイコン用html
        p.htmlEdit = '<div class="pEdit pButton"><span></span></div>';
        p.htmlCancel = '<div class="pCancel pButton"><span></span></div>';
        p.htmlUpdate = '<div class="pUpdate pButton"><span></span></div>';
        p.htmlRegist = '<div class="pRegist pButton"><span></span></div>';
        p.htmlAdd = '<div class="pAdd pButton"><span></span></div>';
        p.htmlRemove = '<div class="pRemove pButton"><span></span></div>';
        p.htmlNone = '<div class="pNone"></div>';
        // -----------------------------
        // create grid class.
        // -----------------------------
        var grid = {
            changeWidth: function (width) {
                if (width > p.mygrid.find('div.sFHeader').width() + 100) {
                    var diff = width - parseInt(p.mygrid.css('width'), 10);
                    p.width = width + 'px';
                    if (p.mytitlebar) {
                        p.mytitlebar.css({
                            width: p.width
                        });
                    }
                    p.mygrid.css({
                        width: p.width
                    });
                    if (p.mypager) {
                        p.mypager.css({
                            width: p.width
                        });
                    }
                    var $sData = p.mygrid.find('div.sData');
                    $sData.css({
                        width: ($sData.width() + diff) + 'px'
                    });
                }
            },
            changeHeight: function (height) {
                if (height > p.mygrid.find('div.sFHeader').height() + 100) {
                    var diff = height - parseInt(p.mygrid.css('height'), 10);
                    p.height = height + 'px';
                    p.mygrid.css({
                        height: p.height
                    });
                    var $sData = p.mygrid.find('div.sData');
                    $sData.css({
                        height: ($sData.height() + diff) + 'px'
                    });
                }
            },
            createEmptyTable: function () {
                var innerTable = grid.createTableDummyRows(grid.createTableHeader());
                p.mygrid.append(innerTable);
                innerTable = null;
                grid.createSuperTable();
                p.pages = 1;
                p.page = 1;
                p.total = 0;
            },
            dataLoad: function (userParam) {
                if (p.loading) {
                    return true;
                }
                if (!p.url) {
                    return false;
                }
                if (!p.newp) {
                    p.newp = 1;
                }

                // 一つ目のパラメタがdsclgridPageであることを前提としている箇所あり。
                var param = [{
                    name: 'dsclgridPage',
                    value: p.newp
                }, {
                    name: 'dsclgridRp',
                    value: p.rp
                }];

                // set userParam.
                if (userParam) {
                    p.userParam = userParam
                }
                // add userParam
                if (p.sortable) {
                    var userOrder = false;
                    var userOrderIndex = 0;
                    if (p.userParam) {
                        $.each(p.userParam, function (k, v) {
                            if (k == 'order') {
                                userOrder = true;
                                grid.parseSorterOrder(v);
                                grid.createOrder();
                                v = p.order;
                            } else if (k == 'dsclgridPage' && userParam) {
                                // 明示的ロードで、dsclgridPageパラメタがわたされた場合
                                // 元のdsclgridPageパラメタを削除
                                param.splice(0, 1);
                                p.newp = v;
                            }
                            param.push({
                                name: k,
                                value: v
                            });
                        });
                    }
                    if (!userOrder) {
                        param.push({
                            name: 'order',
                            value: p.order
                        });
                    } else {
                        delete userParam.order;
                    }
                } else {
                    if (p.userParam) {
                        $.each(p.userParam, function (k, v) {
                            if (k == 'dsclgridPage' && userParam) {
                                // 明示的ロードで、dsclgridPageパラメタがわたされた場合
                                // 元のdsclgridPageパラメタを削除
                                param.splice(0, 1);
                                p.newp = v;
                            }
                            param.push({
                                name: k,
                                value: v
                            });
                        });
                    }
                }
                p.loading = true;
                $('.icon', p.mytitlebar).addClass('loading');
                $('.icon', p.mypager).addClass('loading');
                if (p.onPreLoad) {
                    p.onPreLoad(param);
                }
                $.ajax({
                    type: p.method,
                    url: p.url,
                    data: param,
                    dataType: 'json',
                    success: function (data) {
                        if ((data.error != null && data.error.length > 0) || data.errors != null || data.systemerror != null) {
                            // エラー時処理
                            if (p.onError) {
                                p.onError(data);
                            } else {
                                if (data.error) {
                                    alert(data.error);
                                } else if (data.systemerror) {
                                    alert(data.systemerror);
                                } else if (data.errors) {
                                    var message = '';
                                    $.each(json.errors, function (k, v) {
                                        $.each(v, function (i, vv) {
                                            message += vv;
                                        });
                                        message += '/'
                                    });
                                    alert(message);
                                }
                            }
                            p.empty = true;
                            grid.createEmptyTable();
                            grid.bindHandler();
                        } else {
                            if (data.rows.length > 0) {
                                p.empty = false;
                                p.mygrid.unbind();
                                var innerTable = grid.createTableRows(data, grid.createTableHeader());
                                p.mygrid.append(innerTable);
                                innerTable = null;
                                grid.createSuperTable(data);
                                grid.bindHandler();
                                p.page = data.page;
                            } else {
                                p.empty = true;
                                grid.createEmptyTable();
                                grid.bindHandler();
                            }
                        }
                        if (p.toScrollBottomAtOnce) {
                            $('div.sData', p.mygrid).scrollTop($('div.sData table', p.mygrid).height());
                            p.toScrollBottomAtOnce = false;
                        }
                        if (p.pager) {
                            grid.updatePageStatus();
                        }
                        if (p.onLoad) {
                            p.onLoad(data);
                        }
                        if (p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        p.loading = false;
                        $('.icon', p.mytitlebar).removeClass('loading');
                        $('.icon', p.mypager).removeClass('loading');
                    },
                    error: function (XMLHttpRequest, textStatus, errorThrown) {
                        try {
                            if (p.onError) {
                                p.onError(XMLHttpRequest, textStatus, errorThrown);
                            }
                        } catch (e) {}
                        p.loading = false;
                        $('.icon', p.mytitlebar).removeClass('loading');
                        $('.icon', p.mypager).removeClass('loading');
                    }
                });
            },
            createTableHeader: function () {
                // construct inner table.
                p.mygrid.empty();
                var innerTable = document.createElement('table');
                innerTable.id = p.innerTableId;
                // table header.
                var html = '<tr>';
                if (p.editable) {
                    html += '<th>操作</th>';
                } else if (p.checkable) {
                    html += '<th><input type="checkbox"></input></th>';
                }
                $.each(p.model, function (i, m) {
                    html += '<th class="' + m.thclass + '">' + m.display + '</th>';
                });
                $(innerTable).html(html);
                return innerTable;
            },
            createTableRows: function (data, innerTable) {
                // table cell.
                if (p.editable) {
                    $.each(data.rows, function (i, row) {
                        var tr = document.createElement('tr');
                        if (i % 2 == 1) {
                            $(tr).addClass('even');
                        }

                        if (p.editable) {
                            var td = document.createElement('td');
                            td.align = 'center';
                            td.innerHTML = '<span class="normal">' + p.htmlEdit + p.htmlNone + p.htmlNone + p.htmlRemove + '&nbsp;</span>' + '<span class="editing">' + p.htmlNone + p.htmlUpdate + p.htmlCancel + p.htmlNone + '&nbsp;</span>' + '<span class="exclude">' + p.htmlNone + p.htmlNone + p.htmlNone + p.htmlNone + '&nbsp;</span>';

                            $('span.editing', td).hide();
                            $('span.exclude', td).hide();
                            $(tr).append(td);
                            //$(td).addClass('ope'); こうすると編集モードでrowクラスを取得できないので注意
                            td = null;
                        }
                        $.each(row.cell, function (i, c) {
                            var td = document.createElement('td');
                            td.align = p.model[i].align;
                            // 表示値の変換
                            if (p.editable) {
                                if (p.model[i].edittype == 'select') {
                                    $.each(p.model[i].select, function (i, option) {
                                        if (option.value == c) {
                                            td.innerHTML = option.name;
                                        }
                                    });
                                } else if (p.model[i].edittype == 'password') {
                                    td.innerHTML = (c != null) ? c : '';
                                } else if (p.model[i].edittype == 'date') {
                                    td.innerHTML = (c != null) ? c : '';
                                } else {
                                    td.innerHTML = (c != null) ? c : '';
                                }
                            } else {
                                td.innerHTML = (c != null) ? c : '';
                            }
                            $(tr).append(td);
                            td = null;
                        });
                        $(innerTable).append(tr);
                        tr = null;
                    });
                    if (!p.editLimit || data.rows.length < p.editLimit) {
                        // editリミットが指定されていない、もしくはLimitに達してなければ
                        var tr = document.createElement('tr');
                        var td = document.createElement('td');
                        td.align = 'center';
                        td.innerHTML = '<span class="normal">' + p.htmlAdd + p.htmlNone + p.htmlNone + '&nbsp;</span>' + '<span class="editing">' + p.htmlNone + p.htmlRegist + p.htmlCancel + '&nbsp;</span>' + '<span class="exclude">' + p.htmlNone + p.htmlNone + p.htmlNone + '&nbsp;</span>';
                        $('span.editing', td).hide();
                        $('span.exclude', td).hide();
                        $(tr).append(td);
                        td = null;
                        $.each(p.model, function (i, c) {
                            var td = document.createElement('td');
                            td.align = c.align;
                            // td.innerHTML = '&nbsp;';
                            $(tr).append(td);
                            td = null;
                        });
                        $(innerTable).append(tr);
                        tr = null;
                    }
                } else { // 編集モードじゃない場合には最速の構築
                    var html = '';
                    $.each(data.rows, function (i, row) {
                        if (row.cl) {
                            if (i % 2 == 0) {
                                html += '<tr class="' + row.cl + '">';
                            } else {
                                html += '<tr class="even ' + row.cl + '">';
                            }
                        } else {
                            if (i % 2 == 0) {
                                html += '<tr>';
                            } else {
                                html += '<tr class="even">';
                            }
                        }
                        if (p.checkable) {
                            if (row.summary) {
                                html += '<td align="center"> </td>';
                            } else {
                                html += '<td align="center"><input type="checkbox"></input></td>';
                            }
                        }
                        if (row.summary) {
                            $.each(row.cell, function (i, c) {
                                if (i == 0) {
                                    html += '<td align="center">(合計)</td>';
                                } else {
                                    html += '<td align="' + p.model[i].align + '">' + c + '</td>';
                                }
                            });
                        } else {
                            $.each(row.cell, function (i, c) {
                                html += '<td align="' + p.model[i].align + '">' + c + '</td>';
                            });
                        }
                        html += '</tr>';
                    });
                    $(innerTable).append(html);
                    html = null;
                }
                p.total = data.total;
                p.pages = Math.ceil(p.total / p.rp);
                return innerTable;
            },
            createTableDummyRows: function (innerTable) {
                // table cell.
                var tr = document.createElement('tr');
                if (p.editable) {
                    var td = document.createElement('td');
                    td.align = 'center';
                    td.innerHTML = '<span class="normal">' + p.htmlAdd + p.htmlNone + p.htmlNone + '&nbsp;</span>' + '<span class="editing">' + p.htmlNone + p.htmlRegist + p.htmlCancel + '&nbsp;</span>' + '<span class="exclude">' + p.htmlNone + p.htmlNone + p.htmlNone + '&nbsp;</span>';
                    $('span.editing', td).hide();
                    $('span.exclude', td).hide();
                    $(tr).append(td);
                    td = null;
                } else if (p.checkable) {
                    var td = document.createElement('td');
                    $(tr).append(td);
                    td = null;
                }
                $.each(p.model, function (i, c) {
                    var td = document.createElement('td');
                    td.align = c.align;
                    //td.innerHTML = 'a&nbsp;';
                    $(tr).append(td);
                    td = null;
                });
                $(innerTable).append(tr);
                tr = null;
                return innerTable;
            },
            createSuperTable: function (data) {
                var cws = p.colWidths;
                if (p.editable) {
                    cws = $.merge([120], cws);
                } else if (p.checkable) {
                    cws = $.merge([50], cws);
                }
                var mySt = new superTable(p.innerTableId, {
                    cssSkin: p.cssSkin,
                    fixedCols: p.fixedCols,
                    headerRows: p.headerRows,
                    toScrollTop: p.toScrollTop,
                    toScrollLeft: p.toScrollLeft,
                    colWidths: cws
                });
                // スクロールバー復帰
                //$('div.sData', p.mygrid).get(0).onscroll = null;
                //$('div.sData', p.mygrid).get(0).scrollTop = p.toScrollTop;
                //$('div.sData', p.mygrid).get(0).scrollLeft = p.toScrollLeft;
                /*$('div.sData', p.mygrid).css( {
                'top' : p.toScrollTop + 'px',
                'left' : p.toScrollLeft + 'px'
                } );*/

                // temp
                //$('div.sData', p.mygrid).scrollTop(p.toScrollTop);
                //$('div.sData', p.mygrid).scrollLeft(p.toScrollLeft);
                // temp

                // 行にクラスを振る
                var rowLength = 0;
                if (data) {
                    rowLength = data.rows.length;
                }

                // temp
                //p.mygrid.find('div.sFHeader tr th,div.sHeader tr th,div.sFData tr th, div.sFData tr td, div.sData tr th, div.sData tr td').each(function(num) {
                //    $(this).attr('style', 'white-space:normal;word-break:break-all;');
                // temp

                //});
                if (p.sortable) {
                    // ヘッダループ
                    p.mygrid.find('div.sFHeader tr th').each(function (num) {
                        var setnum = num;
                        if (p.editable || p.checkable) {
                            setnum--;
                        }
                        var $t = $(this);
                        $t.data('coln', setnum);
                        $.each(p.sortColn, function (i, scn) {
                            if (setnum == scn) {
                                $t.addClass(p.sortAsc[i] + i);
                                return false;
                            }
                        })
                    });
                    p.mygrid.find('div.sHeader tr th').each(function (num) {
                        var setnum = num;
                        if (p.editable || p.checkable) {
                            setnum--;
                        }
                        var $t = $(this);
                        $t.data('coln', setnum);
                        $.each(p.sortColn, function (i, scn) {
                            if (setnum == scn) {
                                $t.addClass(p.sortAsc[i] + i);
                                return false;
                            }
                        })
                    });
                }
                // 表示・非表示
                if (p.visible) {
                    alert('visibleは使えなくなりました。新たに追加されたhiddenデータのIFを使ってください。');
                }
                // 行ループ（sFData側）
                p.mygrid.find('div.sFData tr').each(function (num) {
                    var $t = $(this);
                    if (num > 0) { // 1行目はヘッダのため
                        if (num - 1 < rowLength) {
                            $t.data('id', data.rows[num - 1].id)
                            $t.data('versionNo', data.rows[num - 1].versionNo);
                            $t.data('cell', data.rows[num - 1].cell);
                            $t.data('hidden', data.rows[num - 1].hidden);
                            $t.data('row', num);
                        } else { // 新規行。editLimit時にも本判定でOK。
                            $t.data('id', -1)
                            $t.data('versionNo', 0);
                            $t.data('row', num);
                        }
                    }
                    //カラムループ
                    $t.addClass('row' + num).children('td').each(function (numtd) {
                        var $tt = $(this);
                        //$tt.addClass('row' + num);
                        if (p.editable) {
                            if (numtd == 0) {
                                $tt.data('ope', true);
                            } else if (numtd > 0 && numtd < p.fixedCols) {
                                //表示されているカラムか
                                $tt.data('col', true);
                                //カラム番号
                                $tt.data('coln', numtd - 1);
                                $tt.data('default', $(this).text());
                            } else {}
                        }
                    });
                });
                // 行ループ（sData側）
                p.mygrid.find('div.sData tr').each(function (num) {
                    var $t = $(this);
                    if (num > 0) { // 1行目はヘッダのため
                        if (num - 1 < rowLength) {
                            $t.data('id', data.rows[num - 1].id)
                            $t.data('versionNo', data.rows[num - 1].versionNo);
                            $t.data('cell', data.rows[num - 1].cell);
                            $t.data('hidden', data.rows[num - 1].hidden);
                            $t.data('row', num);
                        } else { // 新規行。editLimit時にも本判定でOK。
                            $t.data('id', -1)
                            $t.data('versionNo', 0);
                            $t.data('row', num);
                        }
                    }
                    //カラムループ
                    $t.addClass('row' + num).children('td').each(function (numtd) {
                        var $tt = $(this);
                        //$tt.addClass('row' + num);
                        if (p.editable) {
                            if (numtd == 0) {
                                $tt.data('ope', true);
                                //こちらは表示されないため空にしておく
                                $tt.html('&nbsp;');
                            } else if (numtd >= p.fixedCols) {
                                //表示されているカラムか
                                $tt.data('col', true);
                                //カラム番号
                                $tt.data('coln', numtd - 1);
                                $tt.data('default', $(this).text());
                            } else {}
                        }
                    });
                });
            },
            createTitlebar: function () {
                p.mytitlebar.html('<div class="title">' + p.title + '</div><div class="status"></div><div class="icon"></div>');
                if (!p.titlebar) {
                    p.mytitlebar.css("display", "none");
                }
            },
            createSorter: function () {
                $('div', p.mysorter).unbind();
                p.mysorter.empty();
                p.mysorter.html('<select class="sCol1"></select><select class="sAsc1"></select>');
                $('.sCol1', p.mysorter).append('<option value=""></option>');
                $.each(p.model, function (i, v) {
                    $('.sCol1', p.mysorter).append('<option value="' + v.name + '">' + v.display + '</option>');
                });
                $('.sAsc1', p.mysorter).html('<option value=" asc">昇順</option><option value=" desc">降順</opti');
            },
            getSorterStr: function () {
                var str = '';
                for (i = 1; i <= 3; i++) {
                    var v = $('.sCol' + i, p.mysorter).val();
                    if (!v || v.length == 0) {
                        break;
                    }
                    if (i > 1) {
                        str = str + ',';
                    }
                    str = str + v + $('.sAsc' + i, p.mysorter).val();
                }
                return str;
            },
            createPager: function () {
                $('div', p.mypager).unbind();
                p.mypager.empty();
                p.mypager.html('<div class="icon"></div><div class="pFirst pButton"><span></span></div>' + '<div class="pPrev pButton"><span></span></div>' + '<div class="pSeparator"></div>' + '<div class="pPage"><input type="text" size="4" value="1"/><span>/ 1</span></div>' + '<div class="pSeparator"></div>' + '<div class="pNext pButton"><span></span></div>' + '<div class="pLast pButton"><span></span></div>' + '<div class="pSeparator"></div>' + '<div class="pMessage"></div>');
                $('.pFirst', p.mypager).click(function () {
                    grid.changePage('first')
                });
                $('.pPrev', p.mypager).click(function () {
                    grid.changePage('prev')
                });
                $('.pNext', p.mypager).click(function () {
                    grid.changePage('next')
                });
                $('.pLast', p.mypager).click(function () {
                    grid.changePage('last')
                });
                $('.pPage input', p.mypager).keydown(function (e) {
                    if (e.keyCode == 13)
                        grid.changePage('input')
                });
                /* 2015.4.5 comment out
                if ($.browser.msie && $.browser.version < 7)
                    $('.pButton', p.mypager).hover(function () {
                        $(this).addClass('pBtnOver');
                    }, function () {
                        $(this).removeClass('pBtnOver');
                    });
                    */
            },
            changePage: function (ctype) {
                if (p.loading) {
                    return true;
                }
                switch (ctype) {
                case 'first':
                    p.newp = 1;
                    break;
                case 'prev':
                    if (p.page > 1) {
                        p.newp = parseInt(p.page) - 1;
                    }
                    break;
                case 'next':
                    if (p.page < p.pages) {
                        p.newp = parseInt(p.page) + 1;
                    }
                    break;
                case 'last':
                    p.newp = p.pages;
                    break;
                case 'input':
                    var nv = parseInt($('.pPage input', p.mypager).val());
                    if (isNaN(nv)) {
                        nv = 1;
                    }
                    if (nv < 1) {
                        nv = 1;
                    } else if (nv > p.pages) {
                        nv = p.pages;
                    }
                    $('.pPage input', p.mypager).val(nv);
                    p.newp = nv;
                    break;
                }
                if (p.newp == p.page) {
                    return false;
                }
                // スクロールリセット
                p.toScrollTop = 0;
                p.toScrollLeft = 0;
                grid.dataLoad();
            },
            updatePageStatus: function () {
                $('.pPage input', p.mypager).val(p.page);
                $('.pPage span', p.mypager).html('/ ' + p.pages);
                var r1 = (p.page - 1) * p.rp + 1;
                if (p.total == 0) {
                    r1 = 0;
                }
                var r2 = r1 + p.rp - 1;
                if (p.total < r2) {
                    r2 = p.total;
                }
                var stat = p.pagestat;
                stat = stat.replace(/{from}/, r1);
                stat = stat.replace(/{to}/, r2);
                stat = stat.replace(/{total}/, p.total);
                $('.pMessage', p.mypager).html('<span>' + stat + '</span>');
            },
            bindHandler: function () {
                // clickable
                if (!p.editable && p.selectable && !p.empty) {
                    p.mygrid.find('div.sFData tr,div.sData tr').css('cursor', 'pointer').click(function (e) {
                        var $t = $(this);
                        p.mygrid.find('tr.rowselect').removeClass('rowselect');
                        p.mygrid.find('tr.row' + $t.data('row')).addClass('rowselect');
                        if (p.checkable) {
                            if (!$(e.target).is('input')) {
                                var $cb = p.mygrid.find('tr.row' + $t.data('row') + ' td:first input');
                                if ($cb.attr('checked')) {
                                    $cb.removeAttr('checked');
                                    p.mygrid.find('div.sFHeader th:first input').removeAttr('checked');
                                } else {
                                    $cb.attr('checked', 'checked');
                                }
                            }
                            if (p.onCheckChanged) {
                                p.onCheckChanged();
                            }
                        }
                        if (p.onSelectChanged) {
                            p.onSelectChanged();
                        }
                        if (p.onClick) {
                            p.onClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    }).dblclick(function () {
                        if (p.onDblClick) {
                            var $t = $(this);
                            p.onDblClick($t.data('id'), $t.data('versionNo'), $t.data('cell'), $t.data('row') - 1, $t.data('hidden'));
                        }
                    });
                    // check all
                    if (p.checkable) {
                        // TODO allチェックボックスは3回呼ばれて帳尻があう問題があり。
                        var checkAllFunc = function (e) {
                            var $cb = p.mygrid.find('div.sFHeader th:first input');
                            if ($cb.attr('checked')) {
                                $cb.removeAttr('checked');
                                p.mygrid.find('tr td:first-child input').removeAttr('checked');
                            } else {
                                $cb.attr('checked', 'checked');
                                p.mygrid.find('tr td:first-child input').attr('checked', 'checked');
                            }
                            if (p.onCheckChanged) {
                                p.onCheckChanged();
                            }
                        };
                        p.mygrid.find('div.sFHeader th:first').css('cursor', 'pointer').click(checkAllFunc);
                        p.mygrid.find('div.sFHeader th:first input').click(checkAllFunc);
                    }
                }
                // sortable
                if (p.sortable) {
                    var selector = 'div.sFHeader tr th,div.sHeader tr th';
                    if (p.editable || p.checkable) {
                        selector = 'div.sFHeader tr th:gt(0),div.sHeader tr th:gt(0)';
                    }
                    // attach css
                    p.mygrid.find(selector).each( function(){
                        var coln = $(this).data('coln');
                        if (p.model[coln].sortable == null || p.model[coln].sortable) {
                            $(this).css('cursor', 'pointer');
                        }
                    });
                    // attach click event
                    p.mygrid.find(selector).click(function (e) {
                        if (e.which == 3) { // 右クリックはキャンセル
                            return;
                        }
                        var hit = -1;
                        var coln = $(this).data('coln');
                        if (p.model[coln].sortable == null || p.model[coln].sortable) {
                            var targetName = p.model[coln].name;
                            $.each(p.sortCol, function (i, sc) {
                                if (targetName == sc) {
                                    hit = i;
                                    return false;
                                }
                            });
                            if (hit != -1) {
                                // あれば、逆順に
                                p.sortAsc[hit] = (p.sortAsc[hit] == 'asc') ? 'desc' : 'asc';
                            } else {
                                // なければ(hit=-1)最後に追加
                                p.sortCol.push(targetName);
                                p.sortAsc.push('asc');
                                p.sortColn.push(coln);
                            }
                            if (p.sortCol.length > p.sortNum) {
                                // 多い場合、最初を削除
                                p.sortCol.splice(0, p.sortCol.length - p.sortNum);
                                p.sortAsc.splice(0, p.sortAsc.length - p.sortNum);
                                p.sortColn.splice(0, p.sortColn.length - p.sortNum);
                            }
                            grid.createOrder();
                            p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                            p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                            grid.dataLoad();
                        }
                    }).bind('contextmenu', function () { // 右クリック
                        var hit = -1;
                        var coln = $(this).data('coln');
                        if (p.model[coln].sortable == null || p.model[coln].sortable) {
                            var targetName = p.model[coln].name;
                            $.each(p.sortCol, function (i, sc) {
                                if (targetName == sc) {
                                    hit = i;
                                    return false;
                                }
                            });
                            if (hit >= 0) {
                                // あれば削除する
                                p.sortCol.splice(hit, 1);
                                p.sortAsc.splice(hit, 1);
                                p.sortColn.splice(hit, 1);
                            }
                            grid.createOrder();
                            p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                            p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                            grid.dataLoad();
                            return false;
                        }
                    });
                }
                // editable
                grid.bindEditableHandler();
            },
            bindEditableHandler: function () {
                if (p.editable) {
                    // 削除
                    p.mygrid.find('div.sFData tr td div.pRemove,div.sData tr td div.pRemove').click(function () {
                        p.mympanel.hide();
                        if (window.confirm('削除してもよろしいですか？')) {
                            var param = [{
                                name: 'id',
                                value: $(this).closest('tr').data('id')
                            }, {
                                name: 'versionNo',
                                value: $(this).closest('tr').data('versionNo')
                            }];
                            if (p.tokenKey) {
                                param.push({
                                    name: p.tokenKey,
                                    value: p.token
                                });
                            }
                            p.loading = true;
                            $('.icon', p.mytitlebar).addClass('loading');
                            $('.icon', p.mypager).addClass('loading');
                            $.ajax({
                                type: p.method,
                                url: p.urlDelete,
                                data: param,
                                dataType: 'html',
                                success: function (data) {
                                    p.loading = false;
                                    $('.icon', p.mytitlebar).removeClass('loading');
                                    $('.icon', p.mypager).removeClass('loading');
                                    if (data == null || data.length == 0) {
                                        // スクロール保持
                                        p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                                        p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                                        grid.dataLoad();
                                    } else {
                                        p.mympanel.html(data);
                                        p.mympanel.dialog('open');
                                    }
                                },
                                error: function (XMLHttpRequest, textStatus, errorThrown) {
                                    try {
                                        if (p.onError) {
                                            p.onError(XMLHttpRequest, textStatus, errorThrown);
                                        }
                                    } catch (e) {}
                                    p.loading = false;
                                    $('.icon', p.mytitlebar).removeClass('loading');
                                    $('.icon', p.mypager).removeClass('loading');
                                }
                            });
                        }
                        return false;
                    });
                    // 編集開始
                    //p.mygrid.find('div.sFData tr td a.edit,div.sData tr td a.edit').click(function() {
                    p.mygrid.find('div.sFData tr td div.pEdit,div.sData tr td div.pEdit,div.sFData tr td div.pAdd,div.sData tr td div.pAdd').click(function () {
                        p.mympanel.hide();
                        p.mygrid.find('tr.row' + $(this).closest('tr').data('row') + ' td').each(function (num) {
                            if ($(this).data('col')) {
                                var edittype = p.model[$(this).data('coln')].edittype;
                                // プルダウン変換
                                if (edittype == 'select') {
                                    var v = $(this).text();
                                    $(this).html('<select></select>');
                                    var $option_entries = new Array();
                                    $.each(p.model[$(this).data('coln')].select, function (i, option) {
                                        if (v == option.name) {
                                            $option_entries.push('<option value="' + option.value + '" selected >' + option.name + '</option>');
                                        } else {
                                            $option_entries.push('<option value="' + option.value + '">' + option.name + '</option>');
                                        }
                                    });
                                    $('select', this).append($option_entries.join());
                                    $('select', this).width($(this).width());
                                    //$('select', this).height($(this).height());
                                } else if (edittype == 'password') {
                                    $(this).html('<input type="password" value=""/>');
                                    $('input', this).width($(this).width());
                                    //$('input', this).height($(this).height());
                                } else if (edittype == 'date') {
                                    var v = $(this).text();
                                    $(this).html('<input type="text" value=""/>');
                                    $('input', this).val(v);
                                    $('input', this).datepicker({
                                        showOn: 'button',
                                        buttonImage: p.calendarIconUrl,
                                        buttonImageOnly: true,
                                        changeMonth: true,
                                        changeYear: true,
                                        buttonText: 'カレンダー'
                                    });
                                    $('input', this).width($(this).width() - 32);
                                    //$('input', this).height($(this).height());
                                } else {
                                    var v = $(this).text();
                                    $(this).html('<input type="text" value=""/>');
                                    $('input', this).val(v);
                                    $('input', this).width($(this).width());
                                    //$('input', this).height($(this).height());
                                }
                            } else if ($(this).data('ope')) {} else {
                                //表示されていないカラムの処理
                                if (p.fixedCols == 1) {
                                    // 表側がない場合、高さをあわせるため裏にinputタグを埋め込む
                                    $(this).html('<input type="text" value=""/>');
                                }
                            }
                        });
                        $('span', $(this).closest('table')).css("display", "none");
                        $('span.exclude', $(this).closest('table')).css("display", "inline");

                        $('span.normal', $(this).closest('td')).css("display", "none");
                        $('span.editing', $(this).closest('td')).css("display", "inline");
                        $('span.exclude', $(this).closest('td')).css("display", "none");
                        if ($(this).closest('tr').data('id') == -1) { // 新規行の場合、スクロールを下に
                            $('div.sData', p.mygrid).scrollTop($('div.sData table', p.mygrid).height());
                        }
                        return false;
                    });
                    // キャンセル
                    p.mygrid.find('div.sFData tr td div.pCancel,div.sData tr td div.pCancel').click(function () {
                        p.mympanel.hide();
                        p.mygrid.find('tr.row' + $(this).closest('tr').data('row') + ' td').each(function () {
                            if ($(this).data('col')) {
                                $(this).html($(this).data('default'));
                            } else if ($(this).data('ope')) {} else {
                                //表示されていないカラムの処理
                                if (p.fixedCols == 1) {
                                    // 裏のinputタグを削除
                                    $(this).html('');
                                }
                            }
                        });

                        $('span', $(this).closest('table')).css("display", "none");
                        $('span.normal', $(this).closest('table')).css("display", "inline");
                        //スクロール調整
                        $('div.sFDataInner', p.mygrid).css('top', ($('div.sData', p.mygrid).scrollTop() * -1) + "px");
                        return false;
                    });
                    // 更新
                    p.mygrid.find('div.sFData tr td div.pUpdate,div.sData tr td div.pUpdate').click(function () {
                        p.mympanel.hide();
                        var param = [{
                            name: 'id',
                            value: $(this).closest('tr').data('id')
                        }, {
                            name: 'versionNo',
                            value: $(this).closest('tr').data('versionNo')
                        }];
                        if (p.tokenKey) {
                            param.push({
                                name: p.tokenKey,
                                value: p.token
                            });
                        }
                        p.mygrid.find('tr.row' + $(this).closest('tr').data('row') + ' td').each(function () {
                            if ($(this).data('col')) {
                                var coln = $(this).data('coln');
                                var edittype = p.model[coln].edittype;
                                if (edittype == 'select') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('select', this).val()
                                    });
                                } else if (edittype == 'password') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                } else if (edittype == 'date') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                } else {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                }
                            } else if ($(this).data('ope')) {}
                        });
                        p.loading = true;
                        $('.icon', p.mytitlebar).addClass('loading');
                        $('.icon', p.mypager).addClass('loading');
                        $.ajax({
                            type: p.method,
                            url: p.urlUpdate,
                            data: param,
                            dataType: 'html',
                            success: function (data) {
                                p.loading = false;
                                $('.icon', p.mytitlebar).removeClass('loading');
                                $('.icon', p.mypager).removeClass('loading');
                                if (data == null || data.length == 0) {
                                    // スクロール保持
                                    p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                                    p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                                    grid.dataLoad();
                                } else {
                                    p.mympanel.html(data);
                                    p.mympanel.dialog('open');
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                try {
                                    if (p.onError) {
                                        p.onError(XMLHttpRequest, textStatus, errorThrown);
                                    }
                                } catch (e) {}
                                p.loading = false;
                                $('.icon', p.mytitlebar).removeClass('loading');
                                $('.icon', p.mypager).removeClass('loading');
                            }
                        });
                        return false;
                    });
                    // 新規登録
                    p.mygrid.find('div.sFData tr td div.pRegist,div.sData tr td div.pRegist').click(function () {
                        p.mympanel.hide();
                        var param = [{
                            name: 'id',
                            value: -1
                        }];
                        if (p.tokenKey) {
                            param.push({
                                name: p.tokenKey,
                                value: p.token
                            });
                        }
                        p.mygrid.find('tr.row' + $(this).closest('tr').data('row') + ' td').each(function () {
                            if ($(this).data('col')) {
                                var coln = $(this).data('coln');
                                var edittype = p.model[coln].edittype;
                                if (edittype == 'select') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('select', this).val()
                                    });
                                } else if (edittype == 'password') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                } else if (edittype == 'date') {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                } else {
                                    param.push({
                                        name: p.model[coln].param,
                                        value: $('input', this).val()
                                    });
                                }
                            } else if ($(this).data('ope')) {}
                        });
                        p.loading = true;
                        $('.icon', p.mytitlebar).addClass('loading');
                        $('.icon', p.mypager).addClass('loading');
                        $.ajax({
                            type: p.method,
                            url: p.urlRegist,
                            data: param,
                            dataType: 'html',
                            success: function (data) {
                                p.loading = false;
                                $('.icon', p.mytitlebar).removeClass('loading');
                                $('.icon', p.mypager).removeClass('loading');
                                if (data == null || data.length == 0) {
                                    // スクロール保持
                                    p.toScrollTop = $('div.sData', p.mygrid).scrollTop();
                                    p.toScrollLeft = $('div.sData', p.mygrid).scrollLeft();
                                    p.toScrollBottomAtOnce = true;
                                    grid.dataLoad();
                                } else {
                                    p.mympanel.html(data);
                                    p.mympanel.dialog('open');
                                }
                            },
                            error: function (XMLHttpRequest, textStatus, errorThrown) {
                                try {
                                    if (p.onError) {
                                        p.onError(XMLHttpRequest, textStatus, errorThrown);
                                    }
                                } catch (e) {}
                                p.loading = false;
                                $('.icon', p.mytitlebar).removeClass('loading');
                                $('.icon', p.mypager).removeClass('loading');
                            }
                        });
                        return false;
                    });
                    if (p.disabled) {
                        grid.unbindEditableHandler();
                        p.mygrid.addClass('disabled');
                    }
                }
            },
            unbindEditableHandler: function () {
                if (p.editable) {
                    p.mygrid.find('div.sFData tr td div.pRemove,div.sData tr td div.pRemove').unbind();
                    p.mygrid.find('div.sFData tr td div.pEdit,div.sData tr td div.pEdit').unbind();
                    p.mygrid.find('div.sFData tr td div.pCancel,div.sData tr td div.pCancel').unbind();
                    p.mygrid.find('div.sFData tr td div.pUpdate,div.sData tr td div.pUpdate').unbind();
                    p.mygrid.find('div.sFData tr td div.pRegist,div.sData tr td div.pRegist').unbind();
                    p.mygrid.find('div.sFData tr td div.pAdd,div.sData tr td div.pAdd').unbind();
                    p.mygrid.find('div.sFData tr td span,sData tr td span').css("display", "none");
                    p.mygrid.find('div.sFData tr td span.exclude,sData tr td span.exclude').css("display", "inline");
                }
            },
            selectByNo: function (no) {
                // clear select.
                $('tr.rowselect', p.mygrid).removeClass('rowselect');
                // select.
                var selector = 'tr.row' + (no + 1);
                $(selector, p.mygrid).addClass('rowselect');
                if (p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            selectById: function (id) {
                // clear select.
                $('tr.rowselect', p.mygrid).removeClass('rowselect');
                // select.
                var idStr = '' + id;
                $('div.sFData tr', p.mygrid).each(function (num) {
                    if ($(this).data('id') == idStr) {
                        var selector = 'tr.row' + $(this).data('row');
                        $(selector, p.mygrid).addClass('rowselect');
                        return false;
                    }
                });
                if (p.onSelectChanged) {
                    p.onSelectChanged();
                }
            },
            getSelectedNo: function () {
                var selectedTr = $('tr.rowselect:first', p.mygrid);
                if (selectedTr) {
                    var r = selectedTr.data('row');
                    if (r) {
                        return r - 1;
                    }
                }
                return -1;
            },
            getSelectedId: function () {
                var selectedTr = $('tr.rowselect:first', p.mygrid);
                if (selectedTr) {
                    var r = selectedTr.data('id');
                    if (r) {
                        return r;
                    }
                }
                return -1;
            },
            getSelectedCell: function () {
                var selectedTr = $('tr.rowselect:first', p.mygrid);
                if (selectedTr) {
                    var r = selectedTr.data('cell');
                    if (r) {
                        return r;
                    }
                }
                return null;
            },
            getSelectedHidden: function () {
                var selectedTr = $('tr.rowselect:first', p.mygrid);
                if (selectedTr) {
                    var r = selectedTr.data('hidden');
                    if (r) {
                        return r;
                    }
                }
                return null;
            },
            checkByNos: function (nos, uncheck) {
                $.each(nos, function (i, no) {
                    var selector = 'tr.row' + (no + 1) + ' td:first input';
                    if (uncheck) {
                        $(selector, p.mygrid).removeAttr('checked');
                    } else {
                        $(selector, p.mygrid).attr('checked', 'checked');
                    }
                });
            },
            checkByIds: function (ids, uncheck) {
                $('div.sFData tr', p.mygrid).each(function (num) {
                    $thisTr = $(this);
                    $.each(ids, function (i, id) {
                        var idStr = '' + id;
                        if ($thisTr.data('id') == idStr) {
                            var selector = 'tr.row' + $thisTr.data('row') + ' td:first input';;
                            if (uncheck) {
                                $(selector, p.mygrid).removeAttr('checked');
                            } else {
                                $(selector, p.mygrid).attr('checked', 'checked');
                            }
                            return false;
                        }
                    });
                });
            },
            getChecked: function (isNo) {
                return $.map($('div.sFData input:checked', p.mygrid), function (n, i) {
                    if (isNo) {
                        return $(n).closest('tr').data('row') - 1;
                    } else {
                        return $(n).closest('tr').data('id');
                    }
                });
            },
            parseSorterOrder: function (str) {
                var baseIndex = str.lastIndexOf(p.sortBase);
                if (baseIndex != -1) {
                    str = str.substring(0, baseIndex);
                }
                p.sortCol = [];
                p.sortAsc = [];
                p.sortColn = [];
                if (str.length > 0) {
                    var splited = str.split(',');
                    $.each(splited, function (i, s) {
                        if (s.length > 0) {
                            var ss = s.split(' ');
                            $.each(p.model, function (ii, m) {
                                if (ss[0] == m.name) {
                                    p.sortCol.push(ss[0]);
                                    p.sortAsc.push(ss[1]);
                                    p.sortColn.push(ii);
                                    return false;
                                }
                            });
                        }
                    });
                }
            },
            createOrder: function () {
                p.order = '';
                $.each(p.sortCol, function (i, sc) {
                    p.order += sc + ' ' + p.sortAsc[i] + ',';
                });
                if (p.order.length > 1) {
                    p.order = p.order.substring(0, p.order.length - 1);
                }
                if (p.sortBase.length > 1) {
                    if (p.order.length > 0) {
                        p.order += ',' + p.sortBase;
                    } else {
                        p.order = p.sortBase;
                    }
                }
            }
        };
        if (p.autosize) {
            $(window).resize(function () {
                grid.changeWidth($(window).width() - p.autoMarginWidth);
                grid.changeHeight($(window).height() - p.autoMarginHeight);
            });
        }
        // -----------------------------
        // create main DOM.
        // -----------------------------
        // create titlebar
        var divTitlebar = document.createElement('div');
        p.mytitlebar = $(divTitlebar);
        p.mytitlebar.addClass('dscltitlebar').css({
            width: p.width,
            overflow: "hidden"
        });
        $(t).append(divTitlebar);
        divTitlebar = null;
        grid.createTitlebar();

        // create mysorter
        if (p.sorter) {
            var divSorter = document.createElement('div');
            p.mysorter = $(divSorter);
            p.mysorter.addClass('dsclsorter').css({
                width: p.width,
                overflow: "hidden"
            });
            $(t).append(divSorter);
            divSorter = null;
            grid.createSorter();
        }
        // create mygrid.
        var divGrid = document.createElement('div');
        p.mygrid = $(divGrid);
        p.mygrid.addClass('dsclgrid').css({
            width: p.width,
            height: p.height,
            overflow: "hidden"
        });
        $(t).append(divGrid);
        divGrid = null;
        grid.createEmptyTable();

        // create mypager
        if (p.pager) {
            var divPager = document.createElement('div');
            p.mypager = $(divPager);
            p.mypager.addClass('dsclpager').css({
                width: p.width,
                overflow: "hidden"
            });
            $(t).append(divPager);
            divPager = null;
            grid.createPager();
        }
        // create messagepanel
        var divmpanel = document.createElement('div');
        p.mympanel = $(divmpanel);
        p.mympanel.attr("id", "dsclmpanel");
        p.mympanel.addClass('dsclmpanel');
        $(t).append(divmpanel);
        /* 2015.4.5 ダイアログを依存させない対処前仮 
        p.mympanel.dialog({
            autoOpen: false,
            width: 600,
            title: 'メッセージ',
            modal: true,
            resizable: false,
            buttons: {
                "閉じる": function () {
                    $(this).dialog("close");
                }
            }
        });
        */
        divmpanel = null;

        $(t).show();

        t.p = p;
        t.grid = grid;
        return t;
    };
    var docloaded = false;
    $(document).ready(function () {
        docloaded = true
    });
    $.fn.dsclgrid = function (p) {
        return this.each(function () {
            if (!docloaded) {
                $(this).hide();
                var t = this;
                $(document).ready(function () {
                    $.addDsclgrid(t, p);
                });
            } else {
                $.addDsclgrid(this, p);
            }

        });
    };
    $.fn.dsclgridLoad = function (param) {
        return this.each(function () {
            if (this.grid) {
                if (param) {
                    // スクロールリセット
                    this.p.toScrollTop = 0;
                    this.p.toScrollLeft = 0;
                    this.grid.dataLoad(param);
                } else {
                    // スクロールリセット
                    this.p.toScrollTop = 0;
                    this.p.toScrollLeft = 0;
                    this.grid.dataLoad();
                }
            }
        });
    };
    $.fn.dsclgridDisabled = function (disabled) {
        return this.each(function () {
            if (this.grid) {
                this.p.disabled = disabled;
                this.grid.dataLoad();
            }
        });
    };
    $.fn.dsclgridWidth = function (width) {
        return this.each(function () {
            if (this.grid) {
                this.grid.changeWidth(width);
            }
        });
    };
    $.fn.dsclgridHeight = function (height) {
        return this.each(function () {
            if (this.grid) {
                this.grid.changeHeight(height);
            }
        });
    };
    $.fn.dsclgridSelectByNo = function (no) {
        return this.each(function () {
            if (this.grid) {
                this.grid.selectByNo(no);
            }
        });
    };
    $.fn.dsclgridSelectById = function (id) {
        return this.each(function () {
            if (this.grid) {
                this.grid.selectById(id);
            }
        });
    };
    $.fn.dsclgridGetSelectedNo = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getSelectedNo();
            }
        });
        return r;
    };
    $.fn.dsclgridGetSelectedId = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getSelectedId();
            }
        });
        return r;
    };
    $.fn.dsclgridGetSelectedCell = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getSelectedCell();
            }
        });
        return r;
    };
    $.fn.dsclgridGetSelectedHidden = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getSelectedHidden();
            }
        });
        return r;
    };
    $.fn.dsclgridCheckByNos = function (nos) {
        return this.each(function () {
            if (this.grid) {
                this.grid.checkByNos(nos);
            }
        });
    };
    $.fn.dsclgridUncheckByNos = function (nos) {
        return this.each(function () {
            if (this.grid) {
                this.grid.checkByNos(nos, true);
            }
        });
    };
    $.fn.dsclgridCheckByIds = function (ids) {
        return this.each(function () {
            if (this.grid) {
                this.grid.checkByIds(ids);
            }
        });
    };
    $.fn.dsclgridUncheckByIds = function (ids) {
        return this.each(function () {
            if (this.grid) {
                this.grid.checkByIds(ids, true);
            }
        });
    };
    $.fn.dsclgridGetCheckedNos = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getChecked(true);
            }
        });
        return r;
    };
    $.fn.dsclgridGetCheckedIds = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.grid.getChecked();
            }
        });
        return r;
    };
    $.fn.dsclgridGetSorterOrder = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.p.order;
            }
        });
        return r;
    };
    $.fn.dsclgridGetUserParam = function () {
        var r;
        this.each(function () {
            if (this.grid) {
                r = this.p.userParam;
            }
        });
        return r;
    };
})(jQuery);