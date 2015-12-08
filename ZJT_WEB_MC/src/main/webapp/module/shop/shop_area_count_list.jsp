<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<style>

.title{
font-family:宋体;
font-size:22px;
font-weight:bold;
font-style:normal;
text-decoration:none;
color:#000000;
margin-top:20px;
margin-bottom:20px;
margin-left:8px;
}

#grid{
   margin-top:20px;
}
#grid table tr{
width:auto;
font-family:宋体;font-size:13px;
}
#grid table tr td{
width:160px;
height:30px;
line-height:28px;
text-align:center;
font-family:宋体;font-size:13px;

}
.x-grid-back-color{
   background:#D1D1D1;
}
</style>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/data-view.css" />
<link rel="stylesheet" type="text/css" href="/ext/UI/css/chooser.css" />
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/TipSelf.css" />
<script type="text/javascript" src="/ext/UI/TipSelf.js"></script>
<script type="text/javascript" src="/ext/UI/DataView-more.js"></script>
<script type="text/javascript" src="/ext/UI/RowExpander.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/cid_db.js" ></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/common/cid_util.js" ></script>
<div id="bar"></div>
<div id="tbar"></div>
<div id="grid">
</div>
<div class="title">区域统计</div>
<div id="center"></div>
<div id="city" >
  	
</div>

               
<script type="text/javascript" src="/resource/js/shop/shop_area_count_list.js"></script>