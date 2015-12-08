<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="org.yeeda.costexpress.util.RandomCode"%>
<%
	String code = RandomCode.getRandCode();
	session.setAttribute("code", code);
%>
<head>
<meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>中建普联数据管理系统</title>
<link rel="stylesheet" href="/ext/resource/css/ext-all.css"
			type="text/css" media="screen,projection" />
<link rel="stylesheet" type="text/css" href="/ext/resource/css/ext-patch.css"/>
<script src="/ext/adapter/ext/ext-base.js"></script>
<script src="/ext/ext-all.js"></script>
<script src="/ext/adapter/locale/ext-lang-zh_CN-min.js"></script>
<script src="/resource/js/login/login.js"></script>
</head>
<body>
	<div id="win" class="x-hidden"></div>
	<input type="hidden" value="<%=code %>" id="code" name="code" />
</body>
