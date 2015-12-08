<%@page language="java" import="java.util.*" contentType="text/html; charset=utf-8" %>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<head>
</head>
<body>
	<!-- <div style="display: none;">
		<form id="uploadform" target="uploadtarget" method="post" action="http://pay3.chinabank.com.cn/receiveorder.jsp">
			 <input type=hidden id="v_oid" name="v_oid" value="JF20130507173029751" />
			 <input type=hidden id="v_mid" name="v_mid" value="20972310" />
			 <input type=hidden id="billNo_md5" name="billNo_md5" value="60F1D6FF262AAFCD84FA89C924A68DC6" />
			 <input type=hidden id="v_url" name="v_url" value="http://mc.zjtcn.com/module/orders/reconciliation_result_byScore.jsp">
			 <iframe frameborder="0" id="uploadtarget" name="uploadtarget" src="" width="0" height="0"></iframe>
		</form>
	</div> -->
<%
	String v_oid = request.getParameter("v_oid");
	String v_mid = request.getParameter("v_mid");
	String billNo_md5 = request.getParameter("billNo_md5");
	String v_url = request.getParameter("v_url");
	if (!ParameterUtil.isEmpty(v_oid, true) && !ParameterUtil.isEmpty(v_mid, true)
			&& !ParameterUtil.isEmpty(billNo_md5, true) && !ParameterUtil.isEmpty(v_url, true)){
		System.out.println("-----统一对账-----");
		%>
		
		<div style="display: none;">
			<form id="uploadform" target="uploadtarget" method="post" action="http://pay3.chinabank.com.cn/receiveorder.jsp">
				 <%-- <input type=hidden id="v_oid" name="v_oid" value="<%=v_oid %>" />
				 <input type=hidden id="v_mid" name="v_mid" value="<%=v_mid %>" />
				 <input type=hidden id="billNo_md5" name="billNo_md5" value="<%=billNo_md5 %>" />
				 <input type=hidden id="v_url" name="v_url" value="<%=v_url %>"> --%>
				 <input type=hidden id="v_oid" name="v_oid" value="JF20130507173029751" />
				 <input type=hidden id="v_mid" name="v_mid" value="20972310" />
			 	 <input type=hidden id="billNo_md5" name="billNo_md5" value="60F1D6FF262AAFCD84FA89C924A68DC6" />
			 	 <input type=hidden id="v_url" name="v_url" value="http://mc.zjtcn.com/module/orders/reconciliation_result_byScore.jsp">
				 <iframe frameborder="0" id="uploadtarget" name="uploadtarget" src="" width="0" height="0"></iframe>
			</form>
		</div>
		
		<script>
			function doAction(){
				document.forms["uploadform"].submit();
			}
			window.onload = doAction;
		</script>
		<%
	}
%>

<!-- <script>
	function doAction(){
		document.forms["uploadform"].submit();
	}
	window.onload = doAction;
</script> -->
</body>
</html>
