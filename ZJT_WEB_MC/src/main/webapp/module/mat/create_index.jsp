<%@page import="org.yeeda.costexpress.lucene.service.impl.ShopLuceneServiceImpl"%>
<%@page import="org.yeeda.costexpress.lucene.service.impl.MaterialGovLuceneServiceImpl"%>
<%@page import="org.yeeda.costexpress.lucene.service.impl.MaterialFacLuceneServiceImpl"%>
<%@page import="org.yeeda.costexpress.lucene.service.impl.MaterialRefLuceneServiceImpl"%>
<%@page import="org.yeeda.costexpress.lucene.service.MaterialLuceneService"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<html>
<head>
	<title>初始化参考价索引</title>
</head>
<body>
	<%
	String flag = request.getParameter("flag");
	try {
		System.out.println("----------------ref begin----------------------");
		if ("ref".equals(flag)){
			System.out.println("----------------ref----------------------");
			MaterialLuceneService service = new MaterialRefLuceneServiceImpl();
			service.buildAll();
		}else if ("fac".equals(flag)){
			System.out.println("----------------fac----------------------");
			MaterialLuceneService service = new MaterialFacLuceneServiceImpl();
			service.buildAll();
		}else if ("gov".equals(flag)){
			System.out.println("----------------gov----------------------");
			MaterialLuceneService service = new MaterialGovLuceneServiceImpl();
			service.buildAll();
		}else if ("shop".equals(flag)){
			System.out.println("----------------shop----------------------");
			MaterialLuceneService service = new ShopLuceneServiceImpl();
			service.buildAll();
		}
		System.out.println("----------------ref over----------------------");
	} catch (Exception e) {
		e.printStackTrace();
	}
	%>
</body>
</html>
