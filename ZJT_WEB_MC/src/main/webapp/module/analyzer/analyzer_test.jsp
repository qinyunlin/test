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
	src="http://c2.zjtcn.com/js/plungins/textareaAutoHeight.js"></script>
<script type="text/javascript"
	src="/resource/js/analyzer/analyzer_test.js"></script>
<div style="margin-left: 10px; margin-top: 10px;">
	请输入材料名称，多个请回车换行（建议一次性不要超过1000条）：<br />
	<textarea id="analyzerArea" style="line-height: 1.0em; width: 500px;"></textarea>
	<br /> <input type="button" id="analyzerClearBtn" title="清除当前表格中的分析数据再进行分析" value="重新分析" /><input type="button" id="analyzerAppendBtn" title="在当前表格上追加分析数据" value="追加分析" />
</div>
<div style="margin-left: 10px; margin-top: 10px;">
	已匹配个数：<span id="haveNum" style="color:red;">0</span><br />
	未匹配个数：<span id="noneNum" style="color:red;">0</span><br />
	显示/隐藏 未匹配项:<input type="checkbox" id="noneChk" /> &nbsp;&nbsp;&nbsp;
	显示/隐藏 匹配项:<input type="checkbox" id="haveChk" />
	<table id="analyzerTable" cellspacing="0">
		<caption></caption>
		<tr>
			<th scope="col">序号</th>
			<th scope="col">材料名称</th>
			<th scope="col">规范化材料名称</th>
			<th scope="col">标准名称</th>
			<th scope="col">造价二级分类</th>
			<th scope="col">采购二级分类</th>
			<th scope="col">匹配关键字</th>
			<th scope="col">分词</th>
			<th scope="col">详情</th>
		</tr>
	</table>
</div>

