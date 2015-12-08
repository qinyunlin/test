<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="java.util.Set"%>


<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<div id="grid">
	<select id="query_con">
		<option value="eid">
			企业ID
		</option>
		<option value="name">
			企业名称
		</option>
	</select>
	<select id="vip_type">
		<option value="8">
			VIP会员
		</option>
		<option value="9">
			企业会员
		</option>
	</select>
</div>
<script type="text/javascript"
	src="/resource/js/enterprise/purchase_enterprise_vip_lock.js"></script>
