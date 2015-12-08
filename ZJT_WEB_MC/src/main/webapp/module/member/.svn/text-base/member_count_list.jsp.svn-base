<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/TipSelf.css" />
<script type="text/javascript" src="/ext/UI/TipSelf.js"></script>
<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
<style>
.margin_right_8 {
	margin-right: 8px;
	margin-left: 8px;
}

.font_red {
	color: red;
}

.title{
font-family:宋体;
font-size:14px;
font-weight:bold;
font-style:normal;
text-decoration:none;
color:#000000;
margin-top:20px;
margin-bottom:20px;
margin-left:8px;
}
</style>
</br>
<span class="title">
普通会员统计：</span>
<select id="yearSelect1" onchange="selectChange(1,this)"></select>
<div id="grid1"></div>
</br>
<span class="title">
正式会员统计：</span>
<select id="yearSelect3" onchange="selectChange(3,this)"></select>
<div id="grid3"></div>
</br>
<span class="title">
云造价会员统计：</span>
<select id="yearSelect8" onchange="selectChange(8,this)"></select>
<div id="grid8"></div>
<form id="exportform" name="exportform" target="exporttarget"
	method="post">
	<input id="content" name="content" value="" type="hidden"/>
	<iframe width="0" height="0" frameborder="0" id="exporttarget"
		name="exporttarget"></iframe>
</form>

<script type="text/javascript" src="/resource/js/member/member_count_list.js"></script>

