<%@ page language="java" import="java.util.*,java.net.URLDecoder" pageEncoding="UTF-8"%>
<%
request.setCharacterEncoding("UTF-8");
String state=request.getParameter("state");
String msg=request.getParameter("msg");
String size=request.getParameter("size");
String callbackFn=request.getParameter("callbackFn");
 %>
<script>
	parent.uploadFileResult(<%=state%>,'<%=msg%>','<%=callbackFn%>','<%=size%>');
</script>
