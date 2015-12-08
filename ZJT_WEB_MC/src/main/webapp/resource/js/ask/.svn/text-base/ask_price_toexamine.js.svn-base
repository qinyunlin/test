var askinfo;
var selectinfo = getCurArgs("id");
//var currStatus = getCurArgs("currStatus");
var currStatus = "0";
var changeStatus = true;
var otherReasonTextDefault = false;

function doEnabled() {
	var isChecked = document.getElementById("checkbox12").checked;
	var otherReasonText = document.getElementById("otherReasonText");
	if (isChecked) {
		otherReasonText.disabled = false;
		otherReasonText.focus();
		if (!otherReasonTextDefault && otherReasonText.value == "请输入自定义理由!") {
			otherReasonText.value = "";
			otherReasonTextDefault = true;
		}
	} else {
		otherReasonText.disabled = true;
	}
}

/**
 * 根据标识获得档次名称：1普通，2中档，3中高挡，4高档
 * 
 * @param status
 */
function getGradeByStatus(status) {
	var grade = "普通";
	switch (status) {
	case "1":
		grade = "普通";
		break;
	case "2":
		grade = "中档";
		break;
	case "3":
		grade = "中高挡";
		break;
	case "4":
		grade = "高档";
		break;
	}
	return grade;
}

/**
 * 将null处理为""
 * 
 * @param notes
 * @returns
 */
function returnNull(val) {
	if (val == null) {
		return "";
	}
	return val;
}

/**
 * 创建附件区域
 */
function buildUploadFileArea(id){
	var uploadFileHtml = "";
	$.ajax({
		type : 'POST',
		url : '/ask/AskPriceServlet.do',
		async : false,
		data : "type=51&id=" + id,
		success : function(response) {
			var data = eval("(" + response + ")");
			var uploadFileList = data.result;
			if (uploadFileList != null){
				for (var i = 0; i < uploadFileList.length; i ++){
					uploadFile = uploadFileList[i];
					uploadFileHtml += "<img src='/resource/images/u13_uploadfile.png' />&nbsp;<a href='" + FileSite + uploadFile.filePath + "' target='_blank' style='text-decoration:none;' >" + uploadFile.filename + ".jpg</a></span>";
					uploadFileHtml += "&nbsp;&nbsp;&nbsp;";
				}
			}
			return uploadFileHtml;
		}
	});
	return uploadFileHtml;
}

/**
 * 创建补充说明显示区域
 * @param id
 * @returns {String}
 */
function buildAppContentArea(id){
	var appContentHtml = "";
	$.ajax({
		type : 'POST',
		url : '/ask/AskPriceServlet.do',
		async : false,
		data : "type=50&id=" + id,
		success : function(response) {
			var data = eval("(" + response + ")");
			var appContentList = data.result;
			if (appContentList != null){
				for (var i = 0; i < appContentList.length; i ++){
					var appContent = appContentList[i];
					appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;'>[" + appContent.createOn + "]</span>&nbsp;";
					appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>" + appContent.notes + "</span>";
					appContentHtml += "</br>";
				}
			}
			return appContentHtml;
		}
	});
	return appContentHtml;
}

function buildAskinfo() {
	Ext.Ajax
			.request({
				url : '/ask/AskPriceServlet.do',
				params : {
					pageSize : 20,
					type : 8,
					id : selectinfo,
					page : 1,
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						askinfo = jsondata.result;
						var panel = new Ext.Panel(
								{
									renderTo : Ext.getBody(),
									title : "查看待审核询价详情",
									layout : "table",
									border : false,
									layoutConfig : {
										columns : 3
									},
									items : [
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-top:10px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : ""
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-top:20px; ',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>请注意！</span>"
															+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#FF0000;'>*</span>"
															+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>为必填选项</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>*</span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>材料分类: "
															+ returnNull(getStuffName(askinfo["cid"]))
															+ "&nbsp;&nbsp;&nbsp;"
															+ returnNull(getSubCidNameBySubcid(askinfo["subCid"]))
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>*</span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>材    料: "
															+ returnNull(askinfo["name"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>*</span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>规格型号: "
															+ returnNull(askinfo["spec"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>*</span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>数    量: "
															+ returnNull(askinfo["amount"])
															+ "&nbsp;/&nbsp;"
															+ returnNull(askinfo["unit"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>*</span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>档    次: "
															+ returnNull(getGradeByStatus(askinfo["grade"]))
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>报价地区: "
															+ returnNull(askinfo["addr"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>用    途: "
															+ returnNull(askinfo["purpose"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>费用说明: "
															+ (askinfo["carriage"] == "1" ? ""
																	: "不")
															+ "含运费;"
															+ (askinfo["tax"] == "1" ? ""
																	: "不")
															+ "含税费;"
															+ (askinfo["keepFee"] == "1" ? ""
																	: "不")
															+ "含采保费;"
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>有 效 期: "
															+ returnNull(askinfo["validDay"])
															+ "&nbsp;天（有效期范围限制在3-15天内，默认为7天）</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>备注要求: "
															+ returnNull(askinfo["notes"])
															+ "</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 3,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>图    片: </span>"
															+ buildUploadFileArea(askinfo["id"])
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>补充说明: </span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 20px;',
												items : [ {
													xtype : "label",
													html : buildAppContentArea(askinfo["id"])
												} ]
											},
											{
												colspan : 3,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 80px; padding-left:15px;',
												items : [ {
													xtype : "label",
													html : "<hr style='border:1px #cccccc dotted;' />"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 80px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												colspan : 2,
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 40px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>悬赏积分: "
															+ askinfo["score"]
															+ "</span>"
															+ "&nbsp;"
															+ "<img src='/resource/images/ask_point.png'>"
															+ "&nbsp;&nbsp;"
															+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#999999;'>发布询价，悬赏不可少于5积分</span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 80px; padding-left:25px;',
												items : [ {
													xtype : "label",
													html : "<span style='font-family:Arial;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'></span>"
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 80px;',
												items : [ {
													xtype : "button",
													text : "通  过",
													width : 90,
													hidden : compareAuth("ASK_AUDIT"),
													onClick : function() {
														//设置最新状态
														reSetStatus(askinfo["status"]);
														//先判断是否已处理过
														//if (checkToexamine()){
															doToexamine(true,"2",askinfo["validDay"],askinfo["memberID"],askinfo["score"],askinfo["province"],askinfo["city"]);
														//}
													}
												} ]
											},
											{
												autoHeight : true,
												bodyStyle : 'border:none;line-height: 80px;',
												items : [ {
													xtype : "button",
													text : "不 通  过",
													width : 90,
													hidden : compareAuth("ASK_AUDIT"),
													onClick : function() {
														//设置最新状态
														reSetStatus(askinfo["status"]);
														//先判断是否已处理过
														//if (checkToexamine()){
															doToexamine(false,"1",askinfo["validDay"],askinfo["memberID"],askinfo["score"],askinfo["province"],askinfo["city"]);
														//}
													}
												} ]
											} ]
								});
					}
				}
			});
}

/**
 * 关闭当前选项卡页面，重新加载列表数据
 * @param btn
 */
function closeCurrWin(btn) {
	if ("ok" == btn) {
		if (window.parent.tab_ask_price_unaudited_iframe){
			window.parent.tab_ask_price_unaudited_iframe.ds.reload();
		}
		window.parent.Ext.getCmp('center').remove("ask_price_toexamine");
	}
}

/**
 * 判断当前询价是否已处理
 * @returns
 */
function checkToexamine(){
	if (currStatus != "0"){
		Info_Tip("该询价已处理，无需重复审核！");
		return false;
	}
	return true;
}

/**
 * 验证询价不通过理由是否合法
 * @param reason
 * @returns {Boolean}
 */
function checkAppReason(reason,flag,status,validDay,memberId,score,province,city){
	if (reason.length == 0){
		otherReasonTextDefault = false;
		Ext.MessageBox
		.alert(
				"提示",
				"询价不通过理由不能为空！",function(btn){
					if ("ok" == btn || "cancel" == btn){
						doToexamine(flag,status,validDay,memberId,score,province,city);
					}
				});
		return false;
	}else if (reason.length > 200){
		otherReasonTextDefault = false;
		Ext.MessageBox
		.alert(
				"提示",
				"询价不通过理由不能超过200字，请调整之后再进行提交！",function(btn){
					if ("ok" == btn || "cancel" == btn){
						doToexamine(flag,status,validDay,memberId,score,province,city);
					}
				});
		return false;
	}
	return true;
}

/**
 * 设置最新的状态
 * @param newStatus
 */
function reSetStatus(newStatus){
	if (changeStatus){
		currStatus = newStatus;
	}
}

/**
 * 审核
 */
function doToexamine(flag,status,validDay,memberId,score,province,city){
	//先判断是否已处理过
	if (!checkToexamine()){
		return false;
	}
	if (flag){ //审核通过
		Ext.MessageBox
		.confirm(
				"提示",
				"确定审核通过？",
				function(
						op) {
					if (op == "yes") {
						Ext.lib.Ajax
								.request(
										"post",
										"/ask/AskPriceServlet.do?type=14&status=" 
												+ status
												+ "&validDay="
												+ validDay
												+ "&memberID="
												+ memberId
												+ "&score="
												+ score
												+ "&province="
												+ province
												+ "&city="
												+ city,
										{
											success : function(
													response) {
												var data = eval("("
														+ response.responseText
														+ ")");
												if (getState(
														data.state,
														commonResultFunc,
														data.result)) {
													reSetStatus("2");
													changeStatus = false;
													Ext.MessageBox
															.alert(
																	"提示",
																	"已审核通过，确定后关闭页面！",
																	closeCurrWin);
												}
											}
										},
										"id="
												+ selectinfo);
					}
				});
	}else{ //审核不通过
		Ext.MessageBox
				.show({
					title : '提示',
					msg : "<span style='line-height:40px;'>请选择不通过理由：</span><p>"
						+ "<input type='radio' id='checkbox1' name='checkbox' value='您好！非常抱歉，该材料需要提供图纸或图片，请通过附件上传后重新发布！如有疑问请联系客服：020-38974866，谢谢！' checked onclick='doEnabled();' />&nbsp;您好！非常抱歉，该材料需要提供图纸或图片，请通过附件上传后重新发布！如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox2' name='checkbox' value='您好！非常抱歉，您提供的图纸与所询材料不符或者图纸太模糊，请您确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' />&nbsp;您好！非常抱歉，您提供的图纸与所询材料不符或者图纸太模糊，请您确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox3' name='checkbox' value='您好！非常抱歉，由于没有提供详细的材料规格，型号，用途等必备参数，厂商无法报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，由于没有提供详细的材料规格，型号，用途等必备参数，厂商无法报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox4' name='checkbox' value='您好！非常抱歉，您填写的材料名称太模糊或不正确，厂商无法报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您填写的材料名称太模糊或不正确，厂商无法报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox5' name='checkbox' value='您好！非常抱歉，您提供的材料名称与规格型号无法匹配，无法提供报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您提供的材料名称与规格型号无法匹配，无法提供报价！请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox6' name='checkbox' value='您好！非常抱歉，该型号规格的材料暂无供应厂家，无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，该型号规格的材料暂无供应厂家，无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox7' name='checkbox' value='您好！非常抱歉，该材料型号规格厂商已经停产或没有生产该规格型号！无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，该材料型号规格厂商已经停产或没有生产该规格型号！无法为您提供报价，请确认后重新发布，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox8' name='checkbox' value='您好！非常抱歉，您询的对象不属于建材！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，您询的对象不属于建材！如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox9' name='checkbox' value='您好！非常抱歉，内容属于无效信息！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，内容属于无效信息！如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox10' name='checkbox' value='您好！非常抱歉，内容中包含违规信息！如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，内容中包含违规信息！如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox11' name='checkbox' value='您好！非常抱歉，纯人工费用及加工、安装、台班类费用不属于询价范围，请您上www.zjtcn.com相关频道查阅，如有疑问请联系客服：020-38974866，谢谢！' onclick='doEnabled();' />&nbsp;您好！非常抱歉，纯人工费用及加工、安装、台班类费用不属于询价范围，请您上www.zjtcn.com相关频道查阅，如有疑问请联系客服：020-38974866，谢谢！<br/>"
						+ "<input type='radio' id='checkbox12' name='checkbox' value='' onclick='doEnabled();' />&nbsp;其他(不超过200字)<p>"
						+ "<textarea rows='5' cols='10' id='otherReasonText' value='请输入自定义理由!' disabled='disabled' style='width:550px;' >请输入自定义理由!</textarea>",
					width : 600,
					prompt : false,
					// id :
					// 'otherReasonText',
					// value :
					// "请输入自定义理由!",
					buttons : {
						"ok" : "确定",
						"cancel" : "取消"
					},
					multiline : false,
					fn : function(
							btn,
							text) {
						var appReasonText = "";
						var otherCheckObj = document
								.getElementById("checkbox12");
						if (otherCheckObj.checked){
							appReasonText = document.getElementById("otherReasonText").value;
							//appReasonText = document.getElementById("otherReasonText").innerHTML;
						}else{
							var radioArr = document.getElementsByName("checkbox");
							 for(var i = 0; i < radioArr.length; i ++){
								 if(radioArr[i].checked){
									appReasonText = radioArr[i].value;
									break;
								}		
							 }
						}
						if ("ok" == btn) {
							//验证理由不能为空，且字数不能超过200字
							if (!checkAppReason(appReasonText,false,"1",validDay,memberId,score,province,city)){
								//doToexamine(false,status,validDay,memberId,score,province,city);
								return false;
							}
							Ext.lib.Ajax
									.request(
											"post",
											"/ask/AskPriceServlet.do?type=14&status=" + status 
													+ "&score="
													+ score
													+ "&memberID="
													+ memberId,
											{
												success : function(
														response) {
													var data = eval("("
															+ response.responseText
															+ ")");
													if (getState(
															data.state,
															commonResultFunc,
															data.result)) {
														reSetStatus("1");
														changeStatus = false;
														Ext.MessageBox
																.alert(
																		"提示",
																		"已审核不通过，确定后关闭页面！",
																		closeCurrWin);
													}
												}
											},
											"id="
													+ selectinfo
													+ "&notes="
													+ appReasonText);
						}
						otherReasonTextDefault = false;
					}
				});
	}
}

function init() {
	buildAskinfo();
};

Ext.onReady(function() {
	init();
	Ext.QuickTips.init();
});
