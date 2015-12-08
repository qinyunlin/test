<%--图片广告  --%>
<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@page import="java.util.Map"%>
<%@page import="java.util.List"%>
<%@page import="org.yeeda.costexpress.dto.InfoContentTitle"%>
<%@page import="org.yeeda.costexpress.service.InfoContentService"%>
<%@page
	import="org.yeeda.costexpress.service.factory.InfoContentServiceFactory"%>
<%@page import="org.yeeda.costexpress.area.AreaAccessUtil"%>
<%@page import="java.util.HashMap"%>
<%@page import="org.yeeda.costexpress.util.file.FileUtil"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%
	String width = request.getParameter("w");//图片的宽
	String height = request.getParameter("h");//图片的高
	String tid = request.getParameter("tid");//广告分类id
	String altPicPath = request.getParameter("altPic");//无广告时的替换图片路径
	String infoPath = request.getParameter("infoPath");//广告信息的页面(如果广告不是外部链接时)
	String css = request.getParameter("css");//图片的class样式
	if (ParameterUtil.isEmpty(css))
		css = "";
	String num = request.getParameter("num");//广告图片的数量(默认是1个)
	int size = 1;
	if (!ParameterUtil.isEmpty(num))
		size = Integer.parseInt(num);
	Map<String, String> conditions = new HashMap<String, String>(0);
	List<InfoContentTitle> list;
	InfoContentTitle info;
	InfoContentService service = InfoContentServiceFactory
			.getInstance();
	conditions.put("tid", tid);
	list = service.searchInfoContentTitles(size, 1, AreaAccessUtil
			.getSite(), conditions, false);
	int s = list.size();
	for (int i = 0; i < size; i++) {
		if (i < s) {
			info = list.get(i);
			if ("4".equals(info.getIssueType())) {
%>
<div
	style="overflow: hidden; width: <%=width%> px; height: <%=height%> px;">
	<embed width="<%=width%>" height="<%=height%>"
		src="<%=FileUtil.getFileUrl(info.getUrl())%>" quality="autohigh"
		wmode="opaque" type="application/x-shockwave-flash"
		plugspace="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash"></embed>
</div>
<%
	} else {
%>
<a href="<%=info.getUrl(infoPath)%>" title="<%=info.getTitle()%>"
	target="_blank"> <img class="<%=css%>" width="<%=width%>"
		height="<%=height%>"
		src="<%=FileUtil.getFileUrl(info.getPicPath())%>"
		style="display: inline-block;" /> </a>
<%
	}
		} else {
%>
<img class="<%=css%>" width="<%=width%>" height="<%=height%>"
	src="<%=altPicPath%>" style="display: inline-block;" />
<%
	}
%>
<%
	}
%>