<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<style>
table {
	padding: 0;
	margin: 0;
}

caption {
	padding: 0 0 5px 0;
	width: 700px;
	font: italic 11px "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
	text-align: right;
}

th {
	font: bold 11px "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
	color: #4f6b72;
	border-right: 1px solid #C1DAD7;
	border-bottom: 1px solid #C1DAD7;
	border-top: 1px solid #C1DAD7;
	letter-spacing: 2px;
	text-transform: uppercase;
	text-align: left;
	padding: 6px 6px 6px 12px;
	background: #CAE8EA no-repeat;
}

th.nobg {
	border-top: 0;
	border-left: 0;
	border-right: 1px solid #C1DAD7;
	background: none;
}

td {
	border-right: 1px solid #C1DAD7;
	border-bottom: 1px solid #C1DAD7;
	background: #fff;
	font-size: 16px;
	padding: 6px 6px 6px 12px;
	color: #4f6b72;
}

td.alt {
	background: #F5FAFA;
	color: #797268;
}

th.spec {
	border-left: 1px solid #C1DAD7;
	border-top: 0;
	background: #fff no-repeat;
	font: bold 10px "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
}

th.specalt {
	border-left: 1px solid #C1DAD7;
	border-top: 0;
	background: #f5fafa no-repeat;
	font: bold 10px "Trebuchet MS", Verdana, Arial, Helvetica, sans-serif;
	color: #797268;
}
/*---------for IE 5.x bug*/
html>body td {
	font-size: 16px;
}

body,td,th {
	font-family: 宋体, Arial;
	font-size: 16px;
}

.divCls{color:red;};
</style>
<script type="text/javascript"
	src="http://c2.zjtcn.com/js/zjt/commonJS/cid_db.js"></script>
<script type="text/javascript"
	src="http://c2.zjtcn.com/js/common/cid_util.js"></script>
<script type="text/javascript"
	src="/resource/js/analyzer/dataclean_test.js"></script>
<div style="margin-left: 10px; margin-top: 10px;">
	名称：<input type="text" name="name" id="name" style="width: 250px;" /> 
	规格：<input type="text" name="spec" id="spec" style="width: 200px;" />
	单位：<input type="text" name="unit" id="unit" style="width: 100px;"/>
	品牌：<input type="text" name="brand" id="brand" style="width: 100px;"/>
	<input type="button" value="标准化" onclick="doAnalyzer();"/>
	<input type="button" value="重置" onclick="reset();"/>
</div>
<div style="margin-left: 10px; margin-top: 10px; display: none;" id="format_table">
	<table id="analyzerTable" cellspacing="0">
		<caption></caption>
		<tr>
			<th scope="col">国标编码</th>
			<th scope="col">名称</th>
			<th scope="col">标准名称</th>
			<th scope="col">规格</th>
			<th scope="col">单位</th>
			<th scope="col">品牌</th>
			<th scope="col">造价分类</th>
			<th scope="col">采购分类</th>
			<th scope="col">特征集</th>
			<th scope="col">关键特征集</th>
		</tr>
	</table>
</div>

