---
layout: default
title: dsclgrid.js - 表頭表側固定の多機能jQueryテーブル
---

dsclgrid.jsは表頭表側固定の多機能jQueryテーブルです。  
dsclgrid.js is a multi-functional table(fixed table head and side) for jQuery.

Japanese / [English](index_en.html)

[>>2.簡易編集の説明へ](edit.html)  
[>>3.詳しい説明へ](details.html)

Features
-----

業務系Webアプリケーションの開発では、今までExcelで運用していた大きな表を表現したいシーンがよくあります。
dsclgrid.jsは、業務系Webアプリケーションでの利用を想定した以下の機能を持つ多機能テーブルです。

-   表頭・表側固定（ヘッダ固定）
-   ajaxによるサーバ連携
-   ページャ
-   多段ソート
-   行選択
-   簡易編集

※dsclgridのdsclはアカウント名(dosancole)の略字をあてています。読めなくてごめんなさい^^;

Sample View
-----
表頭・表側を固定し、ajaxによるサーバ取得、ページャ、3段の多段ソート、行選択の
例です。（サーバが出力するデータは静的なもので、ページャやソートは動作しません^^;）

<script type="text/javascript">
$(function(){
    $('#qv').dsclgrid({
        method: "GET",
        title: "Sample View Table",
        width: "700px",
        height: "200px",
        url: "qvdata.json",
        fixedCols : 2,
        pager: true,
        pagestat : "from {from} to {to} / all {total}",
        sortable: true,
        sortNum: 3,
        selectable: true,
        model : [
            {display: 'ユーザ名', name : 'name',    width: 100, align: 'left'  },
            {display: '管理番号', name : 'number',  width: 80,  align: 'center'},
            {display: '住所',    name : 'depart',  width: 200, align: 'left'  },
            {display: '年齢',    name : 'age',     width: 50,  align: 'right' },
            {display: '電話番号', name : 'tel',     width: 200, align: 'center' },
            {display: '備考',    name : 'comment', width: 200, align: 'left'  }
        ]
    });
    $('#qv').dsclgridLoad();
});
</script>
<div style="padding:20px;padding-top:0px;"><div id="qv"></div></div>

Change Log
-----

*  v0.5
    *  first public version.

Quick Start
-----

ここでは表頭・表側固定の一番シンプルなテーブルを表示してみます。
事前に[ダウンロード](https://github.com/dosancole/dsclgrid/zipball/master "ダウンロード")したファイルを展開、配置しておいてください。
参照可能な位置にhtmlファイルとJSONのデータファイルを作成します。


まずは以下のhtmlファイルを用意してください。
※cssとjavascriptのURL、後で用意するdata.jsonのURLは、配置場所によって修正してください。

    <html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="web/css/superTables.css" />
        <link rel="stylesheet" type="text/css" href="web/css/dsclgrid.css" />
        <link rel="stylesheet" type="text/css" href="web/css/jqueryui/jquery-ui-1.8.16.custom.css" />
        <script type="text/javascript" src="web/js/jquery-1.6.2.min.js"></script>
        <script type="text/javascript" src="web/js/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="web/js/superTables.js" ></script>
        <script type="text/javascript" src="web/js/dsclgrid.js" ></script>
        <title>dsclgrid.js sample 000</title>
        <script type="text/javascript">

    $(function(){
        $('#sample000').dsclgrid({
            titlebar: false,
            method: "GET",
            width: "400px",
            height: "200px",
            url: "data.json",
            fixedCols : 2,
            model : [
                {display: 'ユーザ名', name : 'name',    width: 100, align: 'left'  },
                {display: '管理番号', name : 'number',  width: 80,  align: 'center'},
                {display: '住所',    name : 'depart',  width: 150, align: 'left'  },
                {display: '年齢',    name : 'age',     width: 50,  align: 'right' },
                {display: '備考',    name : 'comment', width: 200, align: 'left'  }
            ]
        });
        $('#sample000').dsclgridLoad();
    });

        </script>
    </head>
    <body style="font-size:15px;">
        <div id="sample000"></div>
    </body>
    </html>

次にサーバ相当のJSONを返却する data.json を用意します（簡単のために固定のものです）。

    {
        "offset" : 0,
        "page"   : 1,
        "rows"   : [
            { "cell" : ["sato",     "0001","tokyo Japan",    "20", "comment."] },
            { "cell" : ["suzuki",   "0002","hokkaido Japan", "45", "comment."] },
            { "cell" : ["takahashi","0003","okinawa Japan",  "25", "comment."] },
            { "cell" : ["tanaka",   "0004","kanagawa Japan", "35", "comment."] },
            { "cell" : ["watanabe", "0005","osaka Japan",    "30", "comment."] },
            { "cell" : ["ito",      "0006","sendai Japan",   "22", "comment."] },
            { "cell" : ["nakamura", "0007","aomori Japan",   "49", "comment."] },
            { "cell" : ["yamamoto", "0008","nagoya Japan",   "52", "comment."] },
            { "cell" : ["kobayashi","0009","toyama Japan",   "23", "comment."] },
            { "cell" : ["saito",    "0010","shimane Japan",  "32", "comment."] }
        ],
        "total"  : 10
    }

以下が表示できます。
※ローカル環境のchromeで確認する場合、```--allow-file-access-from-files```オプションで起動する必要があります。

<script type="text/javascript">
$(function(){
    $('#sample000').dsclgrid({
        method: "GET",
        titlebar: false,
        width: "400px",
        height: "200px",
        url: "sample/000/data.json",
        fixedCols : 2,
        model : [
            {display: 'ユーザ名', name : 'name',    width: 100, align: 'left'  },
            {display: '管理番号', name : 'number',  width: 80,  align: 'center'},
            {display: '住所',    name : 'depart',  width: 150, align: 'left'  },
            {display: '年齢',    name : 'age',     width: 50,  align: 'right' },
            {display: '備考',    name : 'comment', width: 200, align: 'left'  }
        ]
    });
    $('#sample000').dsclgridLoad();
});
</script>
<div style="padding:20px;padding-top:0px;"><div id="sample000"></div></div>

このようにdivをひとつ用意し、jQueryの一般的なライブラリと同様にdsclgridメソッドで表を生成し、
dsclgridLoadメソッドでデータをサーバからロードすることができました！

####さらに・・・####

[>>2.簡易編集の説明へ](edit.html)  
[>>3.詳しい説明へ](details.html)

License
-----
Copyright &copy; 2012 [takuya Dosancole].
Dual licensed under the [MIT license][MIT] or [GPL Verion 2 license][GPL].
dsclgrid.js includes [jQuery] and [SUPER TABLES]. please check each license.

[MIT]: http://www.opensource.org/licenses/mit-license.php
[GPL]: http://www.gnu.org/licenses/gpl.html
[jQuery]: http://jquery.org/
[SUPER TABLES]: http://www.matts411.com/post/super_tables/
[takuya Dosancole]: https://github.com/dosancole