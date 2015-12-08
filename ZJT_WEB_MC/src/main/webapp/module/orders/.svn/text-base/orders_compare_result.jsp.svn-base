<%@page language="java" import="java.sql.*" import="java.util.*"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
<%
	String v_oid = request.getParameter("v_oid");
	String v_pmode = request.getParameter("v_pmode");
	String v_pstatus = request.getParameter("v_pstatus");
	String result = "";
	if ("20".equals(v_pstatus)) {
		result ="已付款成功";
	} else{
		result ="未付款成功";
	}
%>

<script type="text/javascript">
	parent.ordersCompareRe('<%=result%>');
</script>

</body>
</html>
