<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<script type="text/javascript" src="/ext/UI/Store.js"></script>
<script type="text/javascript" src="/ext/UI/PagingToolbar.js"></script>
<link rel="stylesheet" type="text/css" href="/ext/UI/css/TipSelf.css" />
<script type="text/javascript" src="/ext/UI/TipSelf.js"></script>
<script type="text/javascript"
	src="http://c2.zjtcn.com/js/zjt/commonJS/zhcn_db.js"></script>
<script type="text/javascript" src="/resource/js/zhcn_select.js"></script>
<style>
.margin_right_8 {
	margin-right: 8px;
	margin-left: 8px;
}

.font_red {
	color: red;
}
</style>
	<div id="info_head"></div>
	<div id="grid_list_info"></div>
	<form id="exportform" name="exportform" target="exporttarget"
		method="post">
		<input id="content" name="content" value="" type="hidden" />
		<iframe width="0" height="0" frameborder="0" id="exporttarget"
			name="exporttarget"></iframe>
	</form>
	<!-- <div align="center">
		<table border="1" width="778" cellpadding="0"
			style="border-collapse: collapse" height="30" id="table4"
			bgcolor=#DBDBDB bordercolor="#DBDBDB" cellspacing="0">
			<tr>
				<td>
					<div align="center">
						<table class="xmenu" id="xmenu0" border="0" width="776"
							cellspacing="3" cellpadding="3" height="30" id="table5">
							<tr>
								<td onclick="initData('crPro')">初始化城市圈省份</td>
								<td onclick="initData('rmPro')">初始化参考材价库省份</td>
								<td onclick="initData('rmPro')">初始化参考材价库基础编码</td>
								<td onclick="initData('rmPro')">初始化供应商材料基础编码</td>
								<td onclick="initData('hisCode')">初始化历史参考材价库基础编码</td>
								<td onclick="initData('diffRatio')">初始化调差系数</td>
								<td onclick="initData('zjtRefPrice')">初始化造价通参考价</td>
								<td onclick="javascript:alert('亲, 暂时不支持哦~')">一键初始化</td>
							</tr>
						</table>
						<script>
							attachXMenu(xmenu0); //在上面这个table结束的地方执行事件动作的绑定, 这里的这个xmenu0就是那个table的id
						</script>
					</div>
				</td>
			</tr>
		</table>
	</div> -->
<script type="text/javascript" src="/resource/js/mat/data_init.js"></script>

