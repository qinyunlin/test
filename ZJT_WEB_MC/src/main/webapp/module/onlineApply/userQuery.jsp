<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@page import="org.yeeda.costexpress.dto.activity.ApplyUserView"%>
<%@page import="org.yeeda.costexpress.service.activity.ActUserViewService;"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<script type="text/javascript" src="/resource/js/curr_area_code.js"></script>
<style>
.margin_right_8 {
	margin-right: 8px;
	margin-left: 8px;
}

.font_red {
	color: red;
}
</style>

<div id="grid">
	<select id="state">
		<option value="">活动所有报名用户</option>
		<option value="NOPASS">
			审核不通过
		</option>
		<option value="PASS">
			审核通过
		</option>
		<option value="NEW">
			新注册
		</option>

	</select>

</div>
<form id="exportform" name="exportform" target="exporttarget"
	method="post">
	<iframe width="0" height="0" frameborder="0" id="exporttarget"
		name="exporttarget"></iframe>
</form>
<script type="text/javascript"
	src="/resource/js/onlineApply/userQuery.js"></script>

