---
layout: default
title: dsclgrid.js - 簡易編集の説明
---

Contents
-----

[トップページ](index.html)
[詳しい説明](details.html)

簡易編集の説明

*  [簡易編集機能とは](#edit)
*  [実装例](#sample)
    *  [htmlファイル](#edit-html)
    *  [JSONファイル](#edit-json)
    *  [結果ファイル](#edit-success)
*  [サーバ側の実装詳細](#edit-server)
    *  [楽観的排他制御とトランザクショントークン制御](#edit-token)

<a name="edit"></a>簡易編集機能とは
-----

dsclgrid.jsは簡易編集の機能も有しており、1行ごとの新規、更新、削除を簡単に実現できます。
業務系Webアプリケーションでは、マスタデータの管理画面などの利用が考えられます。

<a name="sample"></a>実装例
-----

動作イメージを以下に示します。行の左側のアイコンで新規、更新、削除の動作イメージを確認してください。
※サーバは静的なデータを返却しているため、反映はされません。

<script type="text/javascript">
$(function(){
    $('#sample001').dsclgrid({
        method: "GET",
        titlebar: false,
        width: "730px",
        height: "150px",
        url: "sample/001/data.json",
        urlRegist: "sample/001/success.html",
        urlUpdate: "sample/001/success.html",
        urlDelete: "sample/001/success.html",
        calendarIconUrl: "web/css/dsclgridimg/bullet_arrow_down.png",
        fixedCols : 2,
        editable: true,
        model : [
            {display: 'ユーザ名',   name : 'name',    width: 100, align: 'left',   edittype: "text"  },
            {display: 'パスワード', name : 'password',  width: 80,  align: 'left',   edittype: "password"  },
            {display: '住所',      name : 'depart',  width: 150, align: 'left',   edittype: "text"    },
            {display: '年齢',      name : 'age',     width: 100,  align: 'left',  edittype: "select",  select: [{name:'20代',value:'20'},{name:'30代',value:'30'},{name:'40代',value:'40'}] },
            {display: '更新日',      name : 'update', width: 150, align: 'left',  edittype: "date"    }
        ]
    });
    $('#sample001').dsclgridLoad();
});
</script>
<div style="padding:20px;padding-top:0px;"><div id="sample001"></div></div>

上記を実装してみましょう。

####<a name="edit-html"></a>htmlファイル####

まずは以下のhtmlファイルを用意してください。
※cssとjavascriptのURL、後で用意するdata.json, success.jsonのURLは、配置場所によって修正してください。

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
        $('#sample001').dsclgrid({
            method: "GET",
            titlebar: false,
            width: "730px",
            height: "150px",
            url: "data.json",
            urlRegist: "success.html",
            urlUpdate: "success.html",
            urlDelete: "success.html",
            calendarIconUrl: "web/css/dsclgridimg/bullet_arrow_down.png",
            fixedCols : 2,
            editable: true,
            model : [
                {display: 'ユーザ名',   name : 'name',    width: 100, align: 'left',   edittype: "text"  },
                {display: 'パスワード', name : 'password',  width: 80,  align: 'left',   edittype: "password"  },
                {display: '住所',      name : 'depart',  width: 150, align: 'left',   edittype: "text"    },
                {display: '年齢',      name : 'age',     width: 100,  align: 'left',  edittype: "select",  select: [{name:'20代',value:'20'},{name:'30代',value:'30'},{name:'40代',value:'40'}] },
                {display: '更新日',      name : 'update', width: 150, align: 'left',  edittype: "date"    }
            ]
        });
        $('#sample001').dsclgridLoad();
    });

        </script>
    </head>
    <body style="font-size:15px;">
        <div id="sample001"></div>
    </body>
    </html>

単なる一覧表示との違いは、editable:trueとし、urlRegist, urlUpdate, urlDelete と、カレンダーを使う場合には、calendarIconUrl
を指定することと、modelパラメータにedittypeを指定することです。これだけで簡易編集可能なテーブルになります。

####<a name="edit-json"></a>JSONファイル####

次にサーバ相当のJSONを返却する data.json を用意します（簡単のために固定のものです）。

    {
        "offset" : 0,
        "page"   : 1,
        "rows"   : [
            { "cell" : ["sato",     "***","tokyo Japan",    "20", "04/01/2012"], "id" : 1, "versionNo" : 1 },
            { "cell" : ["suzuki",   "***","hokkaido Japan", "30", "04/05/2012"], "id" : 2, "versionNo" : 1 },
            { "cell" : ["takahashi","***","okinawa Japan",  "20", "04/12/2012"], "id" : 3, "versionNo" : 1 }
        ],
        "total"  : 3
    }

簡易編集可能とするため、idとversionNoを属性に含めます。
edittype:selectのカラムは、valueからnameへ変換されて表示します。


####<a name="edit-success"></a>結果ファイル####

最後にサーバ相当の結果を返却する、success.json を用意します。
空の返却が成功を意味するため、ここでは空ファイルとします。
※ローカルファイル環境での確認では、空ファイルをうまく取得できない可能性があります。その場合にはWebサーバに配置してご確認ください。

ここまでで、サンプルの動作が確認できます。

<a name="edit-server"></a>サーバ側の実装詳細
-----

実際には一覧の実装に加えて、新規、更新、削除時の実装を行う必要があります。
dsclgrid.jsは、新規登録や更新、削除の操作が行われた場合、urlRegist, urlUpdate, urlDeleteに以下のようなアクセスを行います。
（GETの例です。method="POST"の場合には、POSTで送信します。）

新規（urlRegist:"/hoge/ajaxRegist"の場合）

    /hoge/ajaxRsgist?id=-1&name=xxx&password=xxx&depart=xxx&age=xxx&update=xxx

更新（urlUpdate:"/hoge/ajaxUpdate"の場合）

    /hoge/ajaxUpdate?id=xxx&version=xxx&name=xxx&password=xxx&depart=xxx&age=xxx&update=xxx

削除（urlDelete:"/hoge/ajaxDelete"の場合）

    /hoge/ajaxDelete?id=xxx&version=xxx

サーバ側はパラメータを受け取り、適切なデータソースに対して処理を行い、結果を返却します。
結果は以下の2通りを返却します。

-   空データ :
    空を返却します。これは処理の成功を意味し、dsclgrid.jsは一覧を再ロードして見た目を確定します。

-   htmlコンテンツ :
    何らかのhtmlコンテンツを返却します。これは処理の失敗を意味し、dsclgrid.jsはその内容をダイアログ表示します。

####<a name="edit-token"></a>楽観的排他制御とトランザクショントークン制御####

業務系Webアプリケーションでは、楽観的排他制御とトランザクショントークン制御を組み込む場合があります。
dsclgrid.jsは本制御を意図した仕組みを有します。

データに含まれたversionNoは、サーバへのアクセスにパラメータとして含むため、楽観的排他制御に利用することができます。

コンストラクタのtokenKeyとtokenパラメータを利用すると、サーバへのアクセスにパラメータとして含むため、
トランザクショントークン制御に利用することができます。



