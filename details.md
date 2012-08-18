---
layout: default
title: dsclgrid.js - 詳しい説明
---

Contents
-----

[>>1.トップページ](index.html)  
[>>2.簡易編集の説明](edit.html)

3.詳しい説明

*  [dsclgridの生成](#generate)
    *  [dsclgrid（コンストラクタ）](#constructor)
    *  [modelパラメータ](#model)
*  [一覧の表示](#dsclgridload)
    *  [dsclgridload クライアント側の実装](#dsclgridload-client)
    *  [orderパラメータの扱い](#dsclgridload-order)
    *  [サーバ側の実装](#dsclgridload-server)
*  [その他のメソッド](#etcmethod)
    *  [dsclgridSelectByNo](#dsclgridSelectByNo)
    *  [dsclgridGetSelectedNo](#dsclgridGetSelectedNo)
    *  [dsclgridSelectById](#dsclgridSelectById)
    *  [dsclgridGetSelectedId](#dsclgridGetSelectedId)
    *  [dsclgridGetSelectedCell](#dsclgridGetSelectedCell)
    *  [dsclgridGetSelectedHidden](#dsclgridGetSelectedHidden)
    *  [dsclgridGetSorterOrder](#dsclgridGetSorterOrder)
    *  [dsclgridDisabled](#dsclgridDisabled)


<a name="generate"></a>dsclgridの生成
-----

一般的なjqueryライブラリと同じように、用意したdivに対してdsclgrid（コンストラクタ）を利用してdsclgridを生成します。

####<a name="constructor"></a>dsclgrid（コンストラクタ）####

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
    urlRegist:  "/hoge/ajaxRegist",   // 登録のURL
    urlUpdate:  "/hoge/ajaxUpdate",   // 更新のURL
    urlDelete:  "/hoge/ajaxDelete",   // 削除のURL
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
    editable: false,                           // 編集可能とするかどうか。
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

####<a name="model"></a>modelパラメータ####

modelパラメータには、本テーブルが扱うスキーマ情報を設定します。

    model : [
        {display: 'ユーザ名', name : 'name',    width: 100, align: 'left'  },
        {display: '管理番号', name : 'number',  width: 80,  align: 'center'},
        {display: '住所',    name : 'depart',  width: 150, align: 'left'  },
        {display: '年齢',    name : 'age',     width: 50,  align: 'right' },
        {display: '備考',    name : 'comment', width: 200, align: 'left'  }
    ]

modelパラメータの属性一覧とその説明を以下に示します。

    display  : 表示文字列
    name     : カラム文字列。sortable=trueの際のカラム名として、editable=trueの際のPOSTするパラメタ名として使われる。
               POSTパラメタ名は、team_id -> teamId への変換が内部で行われる。
    width    : 幅。数値で指定。
    align    : text-alignにあてる文字列
    sortable : パラメタのsortableがtrueの場合に、カラム単位でソート可否を設定。省略時はtrue。
    edittype : 編集タイプを指定。text:単純な文字列、password：伏字文字列、select：プルダウン、date：日付
    select   : edittype=selectの時に、[{name:'xxxx',value:'xxxx'},{...}]を設定することで、プルダウンの内容を設定。

<a name="dsclgridload"></a>一覧の表示
-----

dsclgridを生成したら、次に一覧を表示します。
一覧はクライアント側で dsclgridLoad を実行し、要求を受けたサーバ側で仕様に従った JSON を返却することで実現します。

####<a name="dsclgridload-client"></a>dsclgridload クライアント側の実装####

クライアント側では dsclgridオブジェクトに対して、dsclgridLoadメソッドを実行します。
指定したパラメータに従ってdsclgrid.jsがサーバに要求を発行し、その応答によって見た目を更新します。

    $(xxx).dsclgridLoad({
        querySql: 'id = ? and verion = ?',   // where句部分。省略可。
        queryValues: [ 1, 3 ],               // 値部分の配列。省略可。
        order: 'id asc,version desc',        // order by部分。省略可。
        etc1: ...,                           // その他パラメータはそのままPOSTパラメータとして付与される。省略可。
        etc2: ...
    });

サーバには、urlパラメータで指定したURLに、以下のパラメータでアクセスされます。
（GETの例です。method="POST"の場合には、POSTで送信します。）

    /hoge/ajaxList?dsclgridPage=xx&dsclgridRp=xx&querySql=xx&queryValues&order=xx&etc1=...&etc2=...

dsclgridPageは現在のページ、dsclgridRpはrpパラメータで設定した一覧の行数が規定パラメータとして付与されます。
それ以外はdsclgridLoadで渡したパラメータが並びます。一度発行したパラメータは記憶し、省略した場合には、
前回発行のパラメータが付与されます。

本メソッドはページャ操作、ソート操作によっても暗黙的に呼ばれます。

dsclgridPageはページャと連動して自動付与されますが、以下のように明示的にページを指定することもできます。
範囲外ページを指定した場合の挙動はサーバ依存となります。

    $(xxx).dsclgridLoad({
        dsclgridPage : 2
    });

####<a name="dsclgridload-order"></a>orderパラメータの扱い####

dsclgridLoadのorderパラメータは、ソート機能と関連して若干扱いが複雑です。

sortable : false の場合には、orderは文字列として扱われ、そのままサーバにPOSTされます。
sortable : true の場合には、orderは厳密にチェックされ、GUIと連動します。
もともとGUIに合わせて自動付与されるため、orderは指定する必要はありませんが、指定すると初期値を設定できます。
その場合正確な文字列を設定する必要があります。正確な数値とは、

-  区切りは半角空白一文字、「,」一文字とし、余計な空白は入れない
-  カラム名がmodelのname属性に存在すること。
-  asc または desc を省略しないこと。

です。sortBaseパラメータについては追加されるだけなので、正確でなくて構いません。（modelにない値も指定できます）
 
####<a name="dsclgridload-server"></a>サーバ側の実装####

前述のdsclgridLoadメソッド呼び出しによって、dsclgrid.jsはURLパラメータで指定したURLに、
パラメータを付与してアクセスします。サーバ側はパラメータを受け取り、適切なデータソースからデータを取得、
結果を以下のJSONで返却してください。

DBから取得するか、ファイルから取得するか等は自由です。dscgrid.jsはデータソースに依存していません
（ただしqueryやorderはSQLを意図しています）。

    {
        "offset" : 0,   // 先頭行の全体におけるrow番号（0始まり）。(page-1)*rpで計算される。
        "page"   : 1,   // 現在のページ数。
        "rows"   : [    // rowの配列。0件の場合には0件配列とする。
                        // cell カラム値の配列, hidden 隠しデータの配列(省略可), id ユニークなID(省略可)、versionNo バージョン番号(省略可)
            { "cell" : ["a","b","c"], "hidden" : ["x","y"], "id" : 1, "versionNo" : 3 },
            { "cell" : ["a","b","c"], "hidden" : ["x","y"], "id" : 2, "versionNo" : 3, "cl" : "alert" },
            { "cell" : ["a","b","c"], "hidden" : ["x","y"], "id" : 3, "versionNo" : 3 }
        ],
        "total"  : 5,    // 総row数
        "error"  : "エラーメッセージ" // エラー発生時のメッセージ
    }

editable=trueの場合はidとversionNoを規定パラメータとして返却してください。
本パラメータは編集のURLにパラメタとして送信されます。
clはオプションで行単位で付与することで、その行の tr タグに本クラスが付与されます。

実際に表示されるcellの値は、dsclgrid.jsでエスケープしていません。サーバ側で適切にエスケープ（CSS等対策）してください。
反面、改行タグやアンカータグを自由に入れることができます。

簡易編集機能については、[簡易編集の説明](edit.html)をご参照ください。

<a name="etcmethod"></a>その他のメソッド
-----

####<a name="dsclgridSelectByNo"></a>dsclgridSelectByNo####

行番号指定で選択します。0始まり。

    $(xxx).dsclgridSelectByNo( 2 );

####<a name="dsclgridGetSelectedNo"></a>dsclgridGetSelectedNo####

選択している行番号を取得します。0始まり。未選択の場合は-1。jqueryセレクタの場合、最後の値を取得します。

    var n = $(xxx).dsclgridGetSelectedNo();

####<a name="dsclgridSelectById"></a>dsclgridSelectById####

ID指定で選択します。なければ選択しません（元の選択は外れます）。
IDはサーバが返却するJSONに含まれるid属性です。

    $(xxx).dsclgridSelectById( 2 );

####<a name="dsclgridGetSelectedId"></a>dsclgridGetSelectedId####

選択しているIDを取得します。未選択の場合は-1。jqueryセレクタの場合、最後の値を取得します。

    var id = $(xxx).dsclgridGetSelectedId();

####<a name="dsclgridGetSelectedCell"></a>dsclgridGetSelectedCell####

選択しているCellデータを取得します。未選択の場合はnull。jqueryセレクタの場合、最後の値を取得します
Cellデータは配列となります。サーバが返却するJSONに含まれるcell属性です。

    var cell = $(xxx).dsclgridGetSelectedCell();

####<a name="dsclgridGetSelectedHidden"></a>dsclgridGetSelectedHidden####

選択しているHiddenデータを取得します。未選択の場合はnull。jqueryセレクタの場合、最後の値を取得します
Hiddenデータは配列となります。サーバが返却するJSONに含まれるhidden属性です。

    var cell = $(xxx).dsclgridGetSelectedHidden();

####<a name="dsclgridGetSorterOrder"></a>dsclgridGetSorterOrder####

ソータによるオーダ文字列を取得します。sortBaseも付与されたものです。
基本的に本文字列はdsclgridLoad内で自動で付与されるため扱う必要はないですが、
文字列そのものを扱いたい場合など（記録など）に利用します。本ゲッターに対するセッターはdsclgridLoadとなります。

    var order = $(xxx).dsclgridGetSorterOrder(); // ex. name desc, id asc

####<a name="dsclgridDisabled"></a>dsclgridDisabled####

editable=trueのときに、disabledをtrue/falseします。ロックに利用できます。
本メソッド実行時には一覧が再ロードされ、編集中であった行も元に戻ります。

    $(xxx).dsclgridDisabled( true );


[>>1.トップページ](index.html)  
[>>2.簡易編集の説明](edit.html)
