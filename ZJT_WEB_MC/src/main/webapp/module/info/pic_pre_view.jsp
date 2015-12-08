<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
  <head>
    
    <title>效果图查看</title>
	<script type="text/javascript">
		window.onload = function(){
		var url = window.location.href;
		var picUrl = url.split('=')[1];
		document.getElementById('picPreView').src='http://ftp.zjtchina.cn'+picUrl;
		}
	</script>
  </head>
  
  <body>
	  <center>
	  	<img id="picPreView" style="margin:0 auto;"/>
	  </center>	
  </body>
</html>
