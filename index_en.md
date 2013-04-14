---
layout: default
title: dsclgrid.js - multi-functional table(fixed table head and side) for jQuery.
---

dsclgrid.js is a multi-functional table(fixed table head and side) for jQuery.

[Japanese](./) / English

[go to explanation of simple edit](edit.html)(sorry, only japanese.)  
[go to detailed explanation](details.html)(sorry, only japanese.)

Features
-----
In the development of Web applications business system,
there is a scene we want to represent a large table (was used in Excel).

dsclgrid.js is a multi-functional table with the following features were intended to be used in Web applications business system.

-   fixed table head and side ( fixed header ).
-   collaboration server by Ajax.
-   pager.
-   multistage sort.
-   select row.
-   quick edit.

*"dscl" of "dsclgrid" is the abbreviation of account name(dosancole).

Sample View
-----
This sample is a fixed table head and side, collaboration server by Ajax, pager, multistage(3) sort, select row.
(The data from server is static, pager and sorter does not work.)

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
            {display: 'user name', name : 'name',    width: 100, align: 'left'  },
            {display: 'number',    name : 'number',  width: 80,  align: 'center'},
            {display: 'address',   name : 'depart',  width: 200, align: 'left'  },
            {display: 'age',       name : 'age',     width: 50,  align: 'right' },
            {display: 'tel',       name : 'tel',     width: 200, align: 'center' },
            {display: 'comment',   name : 'comment', width: 200, align: 'left'  }
        ]
    });
    $('#qv').dsclgridLoad();
});
</script>
<div style="padding:20px;padding-top:0px;"><div id="qv"></div></div>

Change Log
-----

*  <span style="color:#D5000D;">v1.01 2012.12.20 NEW!</span>
    *  autosize=true/pager=false bug fix.
*  <span style="color:#D5000D;">v1.0 2012.12.12 NEW!</span>
    *  initial parameter(autosize) added.
    *  getUserparam method added.
    *  stable version (that worked for one year in the real project).
*  v0.5
    *  first public version.

Required
-----

*  IE9,8,7 FF, Chrome
*  jquery-1.6,x,1.8.x, jquery-ui-1.8.x

*dsclgird.js can be run on most browsers.

Quick Start
-----

We will try to display a simple table(fixed head and side).
In advance, please extract the files that you [downloaded](download_zip.html).

First, please prepare the following html file.
*Url(css and javascript, data.json), please fixe by location.

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
                {display: 'user name', name : 'name',    width: 100, align: 'left'  },
                {display: 'number',    name : 'number',  width: 80,  align: 'center'},
                {display: 'address',   name : 'depart',  width: 150, align: 'left'  },
                {display: 'age',       name : 'age',     width: 50,  align: 'right' },
                {display: 'comment',   name : 'comment', width: 200, align: 'left'  }
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

Next, prepare data.json.

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

The following can be displayed.
*If you want to see in the Chrome of the local environent, you need to start the ```--allow-file-access-from-files``` option.

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
            {display: 'user name',  name : 'name',    width: 100, align: 'left'  },
            {display: 'number',     name : 'number',  width: 80,  align: 'center'},
            {display: 'address',    name : 'depart',  width: 150, align: 'left'  },
            {display: 'age',        name : 'age',     width: 50,  align: 'right' },
            {display: 'comment',    name : 'comment', width: 200, align: 'left'  }
        ]
    });
    $('#sample000').dsclgridLoad();
});
</script>
<div style="padding:20px;padding-top:0px;"><div id="sample000"></div></div>

In the way, we were able to easily load data from the server!

####In addition...####

[go to explanation of simple edit](edit.html)(sorry, only japanese.)  
[go to detailed explanation](details.html)(sorry, only japanese.)

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