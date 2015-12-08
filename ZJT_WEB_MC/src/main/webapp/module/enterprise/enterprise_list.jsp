<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<script type="text/javascript" src="/ext/UI/Store.js"></script>
	<script type="text/javascript" src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
	<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<div id="grid">
	<select id="query_con">
		<option value="eid">
			企业ID
		</option>
		<option value="name">
			企业名称
		</option>
		<option value="fname">
			企业简称
		</option>
		<option value="area">
			所在地区
		</option>
	</select>
	<select id="query_type">
	    <!-- <option value="1">
			建材厂商
		</option> -->
		<option value="0">
			所有类型
		</option>
		
		<option value="2">
			政府机构
		</option>
		<option value="3">
			造价咨询
		</option>
		<option value="4">
			施工单位
		</option>
		<option value="5">
			业主单位
		</option>
		<option value="6">
			设计单位
		</option>
		<option value="7">
			其它单位
		</option>
	</select>
</div>

<script type="text/javascript"
	src="/resource/js/enterprise/enterprise_list.js"></script>
