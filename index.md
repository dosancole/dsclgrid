---
layout: default
title: プロジェクト・タイトル
---
 
dsclgrid.jsは表頭表側固定の多機能jQueryテーブルです。  
dsclgrid.js is a multi-functional table(fixed table head and side) for jQuery.

-----

業務系アプリケーションでは、今までExcelで運用していた大きな表を表現したいシーンがよくあります。
dsclgrid.jsは、業務系Webアプリケーションでの利用を想定した以下の機能を持つ多機能テーブルです。

*   表頭・表側固定
*   ajaxによるサーバ連携
*   ページャ
*   多段ソート
*   行選択
*   簡易編集


Quick Start4
-----
表頭・表側固定の一番シンプルなテーブルを表示してみます。以下の htmlファイルを用意してください。

    <html>
    <head>
    	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <link rel="stylesheet" type="text/css" href="../../web/css/superTables.css" />
        <link rel="stylesheet" type="text/css" href="../../web/css/dsclgrid.css" />
        <link rel="stylesheet" type="text/css" href="../../web/css/jqueryui/jquery-ui-1.8.16.custom.css" />
    	<script type="text/javascript" src="../../web/js/jquery-1.6.2.min.js"></script>
    	<script type="text/javascript" src="../../web/js/jquery-ui-1.8.16.custom.min.js"></script>
        <script type="text/javascript" src="../../web/js/superTables.js" ></script>
        <script type="text/javascript" src="../../web/js/dsclgrid.js" ></script>
    	<title>dsclgrid.js sample 001</title>
    	<script type="text/javascript">
    
    $(function(){
        $('#sample000').dsclgrid({
        	titlebar: false,
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
    <body>
    	<div id="sample000"></div>
    </body>
    </html>

サーバ相当のJSONを返却する data.json を用意します（簡単のために固定のものです）。

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
        "total"  : 2
    }
