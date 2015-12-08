<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%@page import="org.yeeda.costexpress.dto.enterprise.EpShop"%>
<%@page import="org.yeeda.costexpress.service.factory.enterprise.EpShopServiceFactory"%>
<%@page import="org.yeeda.costexpress.service.enterprise.EpShopService"%>
<%@page import="org.yeeda.costexpress.score.dto.CreditScoreRule"%>
<%@page import="org.yeeda.costexpress.util.score.CreditScoreUtil"%>
<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<%@page import="org.yeeda.costexpress.score.service.impl.CreditScoreServiceImpl"%>
<%@page import="org.yeeda.costexpress.score.service.CreditScoreService"%>
<%@page import="org.yeeda.costexpress.score.dto.CreditScoreDetail"%>
<%@page import="org.yeeda.costexpress.dto.vip.EpAccount"%>
<%@page import="org.yeeda.costexpress.service.factory.vip.EpAccountServiceFactory"%>
<%@page import="org.yeeda.costexpress.service.vip.EpAccountservice"%>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<style>
.cxjf_info_box{padding:10px 20px;color:#666; font-size:12px;}
.cxjf_info_box h3{ font-size:12px; margin-bottom:20px; font-weight:normal;}
.cxjf_info_box table{ width:50%; border-collapse:collapse;}
.cxjf_info_box table tr th,.cxjf_info_box tr td{ height:33px; line-height:33px; border:1px #d7d7d7 solid; text-align:center;}
.cxjf_info_box table tr th{ background-color:#efefef; font-weight:bold;}
.cxjf_info_box a,.cxjf_info_box a:visited{ color:#0066CC; text-decoration:none;}
.cxjf_info_box a:hover{ text-decoration:underline; color:#f60;}
</style>
<script type="text/javascript" src="/resource/js/common_mc.js"></script>
</head>
<body>
	<%!
		private CreditScoreDetail getCreditScoreDetail(List<CreditScoreDetail> list, String code){
			if (ParameterUtil.isEmpty(code, true) || list == null || list.size() == 0) return null;
			for (int i = 0, j = list.size(); i < j; i ++){
				CreditScoreDetail csd = list.get(i);
				String curr_code = csd.getCode();
				if (code.equals(curr_code)) return csd;
			}
			return null;
		}
	%>
	<%
		String eid = request.getParameter("eid");
		EpShopService shopService = EpShopServiceFactory.getInstance();
		EpShop epShop = shopService.getShop(eid);
		if (epShop == null) return;
		CreditScoreService service = new CreditScoreServiceImpl();
		List<CreditScoreRule> csrList = CreditScoreUtil.getCreditScoreRuleList();
		if (csrList == null || csrList.size() == 0) return;
		List<CreditScoreDetail> list = service.queryCreditScoreDetailForList(" eid = '" + eid + "'", "code", " id desc ", null);
		if (list != null){
	%>
	<div class="cxjf_info_box">
		<h3>企业名称：<%=epShop.getEname() %></h3>
		<table>
			<tr>
	            <th>积分项</th>
	            <th>总积分</th>
	            <th colspan="2">积分详情</th>
        	</tr>
			<%
				for (int i = 0, j = csrList.size(); i < j; i ++){
        			CreditScoreRule csr = csrList.get(i);
        			String key = csr.getCode();
        			if ("0".equals(csr.getType())){
        				CreditScoreDetail csd = getCreditScoreDetail(list, key);
            			String score = "0";
            			String countDetail = "-";
            			if (csd != null){
            				score = csd.getScore();
            				countDetail = csd.getCount() + CreditScoreUtil.getUnit(key, csd.getCount());
            			}
            			%>
            			<tr>
    						<td width="30%"><%=csr.getTitle() %></td>
    						<td width="20%"><%=score %></td>
    						<td width="25%"><%=csr.getDetail() %></td>
    						<% if ("FAC_SUC_EXAMPLE".equals(key)){ //企业案例 %>
    							<td width="25%"><a target="blank" href="http://www.ccwcw.com/shop/<%=eid %>/shopcase/" /><%=countDetail %></a></td>
    						<%}else if ("FAC_HONOR".equals(key)){ //荣誉资质 %>
    							<td width="25%"><a target="blank" href="http://www.ccwcw.com/shop/<%=eid %>/certificate/" /><%=countDetail %></a></td>
    						<%}else if ("FAC_AWARD".equals(key)){ //活动奖励 %>
    							<td width="25%"><a target="blank" href="http://www.ccwcw.com/shop/<%=eid %>/chengxin/" /><%=countDetail %></a></td>
    						<%}else{ %>
    							<td width="25%"><%=countDetail %></td>
    						<%} %>
    					</tr>
            			<%
        			}
        		}
        	%>
		</table>
		</div>
	<%} %>
</body>