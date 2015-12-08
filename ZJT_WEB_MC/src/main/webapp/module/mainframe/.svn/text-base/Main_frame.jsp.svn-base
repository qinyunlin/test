<%@ page language="java" pageEncoding="utf-8"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%
	User user = (User) session.getAttribute("user");
	if (user == null) {
		response.addHeader("refresh", "1;url=/login.jsp");
		return;
	}
	String uid = user.getUid();
	String uname = user.getUname();
%>
<head>
	<script type="text/javascript" src="/ext/UI/ColumnNodeUI.js"></script>
	<script type="text/javascript" src="/ext/UI/TabCloseMenu.js"></script>
	<script type="text/javascript" src="/resource/js/area_code.js"></script>
	<script type="text/javascript" src="/resource/js/mainframe/main_frame.js"></script>
	<script type="text/javascript" src="/resource/js/mainframe/index.js"></script>
	<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
	<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
	<style>
#area_select div div {
	float: left;
	margin-right: 24px;
	line-height: 26px;
	font-size: 12px;
	font-family: "华文宋体";
}
</style>
</head>
<body>
	<div id="header">

	</div>
	<div id="west">
		<div id="treearea"></div>
	</div>
	<div id="east"></div>
	<div id="south"></div>
	<div id="password_edit_form"></div>
	<div id="password_edit"></div>
	<input id="uid" type="hidden" value="<%=uid%>" />
	<input id="uname" type="hidden" value="<%=uname%>" />
</body>

