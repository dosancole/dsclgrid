---
layout: default
title: dsclgrid.js - 詳しい説明
---

コンストラクタ
-----

dsclgridオブジェクトは、jqueryオブジェクトに対してdsclgrid()で生成します。
動作を指定する様々なパラメータを設定することができます。

    $('xxx').dsclgrid({
        titlebar: false,
        method: "GET",
        width: "400px",
        height: "200px",
        url: "data.json",
        fixedCols : 2,
        model : [...],
        ...
    });

パラメータ一覧とその説明を以下に示します。

    width: "800px",                            // 横幅
    height: "200px",                           // 縦幅
    method: "POST",                            // ajaxのメソッド種別
    url: "/hoge/ajaxList",               // 必須。検索のURL
    urlRegist:  "/hoge/ajaxRegist')}",   // 登録のURL
    urlUpdate:  "/hoge/ajaxUpdate')}",   // 更新のURL
    urlDelete:  "/hoge/ajaxDelete')}",   // 削除のURL
    tokenKey: "org.apache.struts.taglib.html.TOKEN", // 登録、更新、削除時に発行するトークンのキー。既定値は false。
    token: "xxxxxxx",                                // 登録、更新、削除時に発行するトークン文字列。
                                                     // 画面初期表示時にトークンを発行し、その後何度も本トークンを使う形となるため、
                                                     // 画面遷移時のトークンのように、ワンタイムトークンとせず、保持すること。
    title: "一覧",                              // タイトルバーの文字列
    fixedCols : 1,                             // 止める表側の数。1以上。編集モード時の操作カラムも含む。
    visible : [true, true, false, true],       // カラムの表示可否を設定する。未指定は全表示。配列の省略はtrueとなる。現在editable:false前提。
    titlebar: true,                            // タイトルバーを表示するかどうか
    pager: true,                               // ページャーを表示するかどうか
    sortable: false,                           // 表頭クリックによるソートを可能とする
    sortNum : 3,                               // ソートを何段まで可能とするか
    sortBase : '',                             // ソートの最後に付与するorder句。'id, version desc'など。
    editable: false,                           // 編集可能とするかどう
    editLimit : 3,                             // 編集可能な場合、最大値を設定する。行数が最大値に達すると新規作成行が出ない。ページャとは共用し難い。
    selectable: true,                          // 選択可能とするかどうか（trueの場合、編集可能とはならない）
    rp : 26,                                   // 一覧の行数。本値を超えるとページングされる。
    pagestat : "全 {total} 件のうち、{from} - {to} 件目を表示中", // ページャの文言
    disabled : false,                          // editable=trueのときにロック状態で始めるか否か。その後の制御は
    onClick:function( i, v, c, n, h ){               // クリック時のハンドラ。i:ID、v:バージョン番号、c:セル情報（データ）、n:行番号（0始まり）
      xxx                                            // h:Hidden情報
    },
    onDblClick:function( i, v, c, n, h ){            // ダブルクリック時のハンドラ。i:ID、v:バージョン番号、c:セル情報（データ）、n:行番号（0始まり）
      xxx                                            // h:Hidden情報
    },
    onLoad:function( data ){                   // データロード成功時に呼ばれるハンドラ。dataには
      xxx                                      // ロードしたデータそのものが入る。例えばdata.row.lengthで件数が取得できる。
    },
    onSelectChanged:function(){                // 選択が変更された可能性がある場合に呼ばれるハンドラ。onLoadの後、onClickの前に呼ばれる。
      xxx                                      // onClick系との違いは、selectById等でも呼ばれる点。変更に紐づいた制御を行いたい場合にはこちらでハンドルすること。
    },
    modeluse: [ true, true, false, true ],     // モデル(model)パラメタの使用可否を設定する。未指定は制御しない。配列の省略はtrueとなる。
    model: xxxx                                // 必須。スキーマを設定する。後述。

modelパラメータ
-----
modelパラメータには、本テーブルが扱うスキーマ情報を設定します。

    model : [
        {display: 'ユーザ名', name : 'name',    width: 100, align: 'left'  },
        {display: '管理番号', name : 'number',  width: 80,  align: 'center'},
        {display: '住所',    name : 'depart',  width: 150, align: 'left'  },
        {display: '年齢',    name : 'age',     width: 50,  align: 'right' },
        {display: '備考',    name : 'comment', width: 200, align: 'left'  }
    ]

上記以外にも、ソートや簡易編集モードで扱う属性も加え、以下の設定が可能です。

    display  : 表示文字列
    name     : カラム文字列。sortable=trueの際のカラム名として、editable=trueの際のPOSTするパラメタ名として使われる。
               POSTパラメタ名は、team_id -> teamId への変換が内部で行われる。
    width    : 幅。数値で指定。
    sortable : パラメタのsortableがtrueの場合に、カラム単位でソート可否を設定。省略時はtrue。
    align    : text-alignにあてる文字列
    edittype : 編集タイプを指定。text:単純な文字列、password：伏字文字列、select：プルダウン、date：日付
    select   : edittype=selectの時に、[{name:'xxxx',value:'xxxx'},{...}]を設定することで、プルダウンの内容を設定。

一覧のサーバロード
-----

コンストラクタでdsclgridオブジェクトを生成した後、dsclgridLoadメソッドで、
サーバからデータをロードします。

    $(xxx).dsclgridLoad({
        querySql: 'id = ? and verion = ?',   // where句部分。省略可。
        queryValues: [ 1, 3 ],               // 値部分の配列。省略可。
        order: 'id asc,version desc',        // order by部分。省略可。
        etc: ...                             // その他パラメータはそのままPOSTパラメータとして付与される
    });

