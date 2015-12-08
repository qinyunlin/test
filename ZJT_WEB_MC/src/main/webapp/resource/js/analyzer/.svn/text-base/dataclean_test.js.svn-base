$(document).ready(function() {

});

/**
 * 数据分析
 * 
 * @param flag
 */
function doAnalyzer() {
	var name = $("#name").val();
	var spec = $("#spec").val();
	var unit = $("#unit").val();
	var brand = $("#brand").val();
	if (name == null || "" == name) {
		alert("名称不可为空！");
		return;
	}
	var data = {};
	data["type"] = "2";
	data["name"] = name;
	data["spec"] = spec;
	data["unit"] = unit;
	data["brand"] = brand;
	$.ajax({
		type : 'POST',
		url : '/analyzer/Analyzer.do',
		async : false,
		data : data,
		complete : function(response) {
			var result = eval("(" + response.responseText + ")");
			if (result.result != null) {
				createTable(true, result.result);
			}
		}
	});
}

/**
 * 创建表格
 */
function createTable(flag, result) {
	if (flag) { // 删除除表头以下的tr
		$("#analyzerTable tr:not(:first)").remove();
	}
	var code2013 = result["code"];
	if (code2013 == null || "null" == code2013){
		code2013 = "";
	}
	var name = result["name"];
	var stdName = result["stdName"];
	var spec = result["spec"];
	var unit = result["unit"];
	var brand = result["brand"];
	var zjtSubcid = result["zjtSubcid"];
	var cgSubcid = result["cgSubcid"];
	var features = result["features"];
	var keyFeatures = result["keyFeatures"];
	// 创建tr
	var tr = $("<tr></tr>");
	// 创建td
	var code_tr = $("<td>" + code2013 + "</td>");
	var name_tr = $("<td>" + name + "</td>");
	var stdName_tr = $("<td>" + stdName + "</td>");
	var spec_tr = $("<td>" + spec + "</td>");
	var unit_tr = $("<td>" + unit + "</td>");
	var brand_tr = $("<td>" + brand + "</td>");
	var zjtSubcid_tr = $("<td>" + zjtSubcid + "</td>");
	var cgSubcid_tr = $("<td>" + cgSubcid + "</td>");
	var features_tr = $("<td>" + features + "</td>");
	var keyFeatures_tr = $("<td>" + keyFeatures + "</td>");

	// 追加
	$(code_tr).appendTo($(tr));
	$(name_tr).appendTo($(tr));
	$(stdName_tr).appendTo($(tr));
	$(stdName_tr).appendTo($(tr));
	$(spec_tr).appendTo($(tr));
	$(unit_tr).appendTo($(tr));
	$(brand_tr).appendTo($(tr));
	$(zjtSubcid_tr).appendTo($(tr));
	$(cgSubcid_tr).appendTo($(tr));
	$(features_tr).appendTo($(tr));
	$(keyFeatures_tr).appendTo($(tr));
	$(tr).appendTo($("#analyzerTable"));

	// 无法提取特征项标红显示
	if (features == null || features == "") {
		$(tr).addClass("divCls");
		$(tr).children("td").addClass("divCls");
	}
	$("#format_table").show();
}

function reset(){
	$("#analyzerTable tr:not(:first)").remove();
	$("#name").val("");
	$("#spec").val("");
	$("#unit").val("");
	$("#brand").val("");
}
