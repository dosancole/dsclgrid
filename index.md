---
layout: default
title: プロジェクト・タイトル
---
 
dsclgrid.jsは表頭表側固定の多機能jQueryテーブルです。  
dsclgrid.js is a multi-functional table(fixed table head and side) for jQuery.

-----

業務系アプリケーションでは、今までExcelで運用していた大きな表を表現したいシーンがよくあります。
dsclgrid.jsは、業務系Webアプリケーションでの利用を想定した以下の機能を持つ多機能テーブルです。

*   表頭・表側固定_
*   ajaxによるサーバ連携_
*   ページャ_
*   多段ソート_
*   行選択_
*   簡易編集_


Quick Start
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

あいうえお