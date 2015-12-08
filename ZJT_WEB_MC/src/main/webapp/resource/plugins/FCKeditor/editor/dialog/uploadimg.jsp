<%@ page contentType="text/html;charset=utf-8" language="java" import="java.util.*"%>
<%@ page import="java.text.SimpleDateFormat,org.yeeda.costexpress.util.ApplicationProp"%>
<%@ page import="javazoom.upload.*"%>
<%@ page import="java.util.Arrays" %>
<%@ page import="java.io.File"%>
<%@ page import="uploadutilities.FileMover"%>

<%
 String msg = "http://ftp.zjtcn.com/"+request.getParameter("msg");
 out.println(" <script language='javascript'>");
 
 out.println("alert('图片上传成功')");
 out.println("window.parent.document.getElementById(\"txtUrl\").value='"+msg+"'");
 out.println("</script>");
 %>