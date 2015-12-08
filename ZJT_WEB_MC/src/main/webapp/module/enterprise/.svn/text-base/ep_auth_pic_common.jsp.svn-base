<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="org.yeeda.costexpress.util.DateUtil"%>
<%@page import="org.yeeda.costexpress.dto.vip.EpAccount"%>
<%@page import="org.yeeda.costexpress.service.factory.vip.EpAccountServiceFactory"%>
<%@page import="org.yeeda.costexpress.service.vip.EpAccountservice"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<script type="text/javascript" src="/resource/js/common_mc.js"></script>
</head>
<body>
	<%
		//保存诚信采购商生成证书的路径
		String eid = request.getParameter("eid");
		String picURL = request.getParameter("picURL");
		if (ParameterUtil.isEmpty(eid, true) || ParameterUtil.isEmpty(picURL, true)) return;
		
		User user = (User) request.getSession().getAttribute("user");
		EpAccountservice service = EpAccountServiceFactory.getInstance();
		EpAccount epAccount = new EpAccount();
		epAccount.setLogo(picURL);
		epAccount.setUpdateBy(user.getUid());
		epAccount.setUpdateOn(DateUtil.getCurrentFullDateTime());
		service.update(eid, epAccount);
	%>
</body>