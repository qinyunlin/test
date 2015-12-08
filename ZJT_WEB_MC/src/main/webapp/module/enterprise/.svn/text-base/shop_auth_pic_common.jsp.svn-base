<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="org.yeeda.costexpress.util.DateUtil"%>
<%@page import="org.yeeda.costexpress.dto.enterprise.EpShop"%>
<%@page import="org.yeeda.costexpress.service.factory.enterprise.EpShopServiceFactory"%>
<%@page import="org.yeeda.costexpress.service.enterprise.EpShopService"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<script type="text/javascript" src="/resource/js/common_mc.js"></script>
</head>
<body>
	<%
		//保存诚信供应商生成证书的路径
		String eid = request.getParameter("eid");
		String picURL = request.getParameter("picURL");
		if (ParameterUtil.isEmpty(eid, true) || ParameterUtil.isEmpty(picURL, true)) return;
		
		User user = (User) request.getSession().getAttribute("user");
		EpShopService service = EpShopServiceFactory.getInstance();
		EpShop epShop = new EpShop();
		epShop.setIntegrityLogo(picURL);
		epShop.setUpdateBy(user.getUid());
		epShop.setUpdateOn(DateUtil.getCurrentFullDateTime());
		service.updateShop(epShop, eid);
	%>
</body>