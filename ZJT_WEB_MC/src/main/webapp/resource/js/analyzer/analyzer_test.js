$(document).ready(function(){
	$('#analyzerArea').tah({
	     moreSpace:15,   // 输入框底部预留的空白, 默认15, 单位像素
	     maxHeight:600,  // 指定Textarea的最大高度, 默认600, 单位像素
	     animateDur:200  // 调整高度时的动画过渡时间, 默认200, 单位毫秒
	 });
	
	/**
	 * 添加点击事件
	 */
	$("#analyzerClearBtn").click(function(){
		doAnalyzer(true);
	});

	/**
	 * 添加点击事件
	 */
	$("#analyzerAppendBtn").click(function(){
		doAnalyzer(false);
	});
	
	/**
	 * 添加点击事件
	 */
	$("#noneChk").click(function(){
		displayNone($(this));
	});
	
	/**
	 * 添加点击事件
	 */
	$("#haveChk").click(function(){
		displayHave($(this));
	});
});

/**
 * 数据分析
 * @param flag
 */
function doAnalyzer(flag){
	var analyzerArea = $("#analyzerArea").val();
	if (analyzerArea == null || "" == analyzerArea){
		alert("请输入信息！");
		return;
	}
	var data = {};
	data["type"] = "1";
	data["name"] = analyzerArea;
	$.ajax({
		type : 'POST',
		url : '/analyzer/Analyzer.do',
		async : false,
		data : data,
		complete : function(response) {
			var result = eval("(" + response.responseText + ")");
			if (result.result != null) {
				createTable(flag, result.result);
			}
		}
	});	
}

/**
 * 创建表格
 */
function createTable(flag,result){
	if (flag){ //删除除表头以下的tr
		$("#analyzerTable tr:not(:first)").remove();
	}
	var count = $("#analyzerTable tr").length;
	for (var i = 0, j = result.length; i < j; i ++){
		var curr_result = result[i];
		var name = curr_result["name"];
		var formatName = curr_result["formatName"];
		var stdName = curr_result["stdName"];
		var zjtSubcid = curr_result["zjtSubcid"];
		var cgSubcid = curr_result["cgSubcid"];
		var keyword = curr_result["keyword"];
		var list = curr_result["list"];
		var detail = curr_result["detail"];
		//创建tr
		var tr = $("<tr></tr>");

		//创建td
		var num_tr = $("<td>" + count + "</td>");
		var name_tr = $("<td>" + name + "</td>");
		var formatName_tr = $("<td>" + formatName + "</td>");
		var stdName_tr = $("<td>" + stdName + "</td>");
		var zjtSubcid_tr = $("<td>" + zjtSubcid + "</td>");
		var cgSubcid_tr = $("<td>" + cgSubcid + "</td>");
		var keyword_tr = $("<td>" + keyword + "</td>");
		var list_tr = $("<td>" + list + "</td>");
		var detial_tr = $("<td>" + detail + "</td>");
		
		//追加
		$(num_tr).appendTo($(tr));
		$(name_tr).appendTo($(tr));
		$(formatName_tr).appendTo($(tr));
		$(stdName_tr).appendTo($(tr));
		$(zjtSubcid_tr).appendTo($(tr));
		$(cgSubcid_tr).appendTo($(tr));
		$(keyword_tr).appendTo($(tr));
		$(list_tr).appendTo($(tr));
		$(detial_tr).appendTo($(tr));
		$(tr).appendTo($("#analyzerTable"));
		
		//未分类标红显示
		if (zjtSubcid == null || zjtSubcid == ""){
			$(tr).addClass("divCls");
			$(tr).children("td").addClass("divCls");
		}
		
		count += 1;
	}
	//已匹配个数：
	var noneNum = $("#analyzerTable tr[class=divCls]").length;
	$("#haveNum").html($("#analyzerTable tr").length - noneNum - 1);
	//未匹配个数：
	$("#noneNum").html(noneNum);
}

/**
 * 显示/隐藏 未匹配项
 */
function displayNone(obj){
	var checked = $(obj).attr("checked");
	if (checked){
		$("#analyzerTable tr[class=divCls]").hide();
	}else{
		$("#analyzerTable tr[class=divCls]").show();
	}
}

/**
 * 显示/隐藏 未匹配项
 */
function displayHave(obj){
	var checked = $(obj).attr("checked");
	if (checked){
		$("#analyzerTable tr:not(:first)[class!=divCls]").hide();
	}else{
		$("#analyzerTable tr:not(:first)[class!=divCls]").show();
	}
}
