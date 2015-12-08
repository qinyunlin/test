var askds, grid, panel, askinfo, ff, sck, bookTpl, fs;
var selectinfo = getCurArgs("id");
var selectinfoPID = getCurArgs("pid");
var selectProvince = getCurArgs("province");
var selectCity = getCurArgs("city");
var currCorpName = getCurArgs("currCorpName");
// var currStatus = getCurArgs("currStatus");
var currStatus = "0";
var changeStatus = true;
var curUser = parent.currUser_mc;
var ids = [];
var win, memid, memname;

var foreachPanel;

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
 * 截取时间：YYYY-MM-DD
 * 
 * @param date
 */
function subDate(date) {
	if (date == null || date == ""){
		return "";
	}
	return date.split(" ")[0];
}

/**
 * 截取时间：YYYY-MM-DD HH:MM:SS
 */
function substringDate(date) {
	if (date == null || date == "") {
		return "";
	}
	return date.substring(0, date.lastIndexOf("."));
}

/**
 * 返回报价类型
 * @param isExpPrice
 * @returns {String} 
 */
function returnAskPriceType(isExpPrice){
	if ("1" == isExpPrice){
		return "经验报价：";
	}
	return "厂商报价：";
}

/**
 * 返回供应商或者单位
 * @param isExpPrice
 * @returns {String}
 */
function returnUnitOrSupplier(isExpPrice){
	if ("1" == isExpPrice){
		return "单位：";
	}
	return "供应商：";
}

/**
 * 返回供应商或者单位的值
 * @param isExpPrice
 * @returns {String}
 */
function returnUnitOrSupplierVal(isExpPrice,sup,unit){
	if ("1" == isExpPrice){
		return unit;
	}
	return sup;
}

/**
 * 获得相应的角色类型
 * @param memberId
 * @param memberList
 * @returns {String}
 */
function getRole(memberId,memberList){
	var role = "0";
	for ( var i = 0; i < memberList.length; i++) {
		var member = memberList[i];
		if (member.memberID == memberId) {
			role = member.role;
			break;
		}
	}
	return role;
}

/**
 * 获取昵称
 * @param memberId
 * @param memberList
 * @returns
 */
function getNickName(memberId,memberList){
	var nickName = null;
	var trueName = null;
	for ( var i = 0; i < memberList.length; i++) {
		var member = memberList[i];
		if (member.memberID == memberId) {
			nickName = member.nickName;
			trueName = member.trueName;
			break;
		}
	}
	if (nickName == null || "" == nickName){
		return trueName;
	}
	return nickName;
}

/**
 * 根据会员id获取会员昵称
 * @param memberId
 */
function getNickNameByMemId(memberId){
	var nickName = "";
	var url = "/ask/AskPriceServlet.do";
	var data = {};
	data["type"] = "52";
	data["memberID"] = memberId;
	$.ajax({
		type : "post",
		url : url,
		data : data,
		async : false,
		complete : function(json) {
			var data = eval("(" + json.responseText + ")");
			//if (getState(data.state, commonResultFunc, data.result)) {
			//}
			if (data.result != null){
				nickName = data.result.nickName;
			}
			return nickName;	
		}
	});
	return nickName;
}

/**
 * 堂主显示身份
 * @param role
 * @returns {String}
 */
function getMonitor(role){
	if ("1" == role){
		return "<img src='/resource/images/img_monitor.png' title='堂主' />";
	}
	return "";
}

/**
 * 经验报价，则隐藏单位和品牌
 * @param isExpPrice
 * @returns {Boolean}
 */
function expPriceHidden(isExpPrice){
	if ("1" == isExpPrice){
		return true;
	}
	return false;
}

/**
 * 获取会员集合
 * 
 * @param replyList
 * @returns
 */
function getMemberList(replyData) {
	// 拼接id集合查询条件
	var appendId = "'" + replyData.memberID + "'";

	// 会员集合
	var memberList = null;
	$.ajax({
		type : 'POST',
		url : '/ask/AskPriceServlet.do',
		async : false,
		data : "type=20&id=" + appendId,
		success : function(response) {
			var data = eval("(" + response + ")");
			memberList = data.result;
		}
	});
	return memberList;
}

/**
 * 获取经验值
 * 
 * @param replyMemberId
 * @param memberList
 * @returns {Number}
 */
function getExp(replyMemberId, memberList) {
	// 经验值
	var exp = 0;
	for ( var i = 0; i < memberList.length; i++) {
		var member = memberList[i];
		if (member.memberID == replyMemberId) {
			exp = member.exp;
			break;
		}
	}
	return exp;
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
					appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;'>[" + substringDate(appContent.createOn) + "]</span>&nbsp;";
					appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>" + appContent.notes + "</span>";
					appContentHtml += "</br>";
				}
			}
			return appContentHtml;
		}
	});
	return appContentHtml;
}

// 创建表格
function buildAskinfo() {
	Ext.lib.Ajax
			.request(
					"post",
					"/ask/AskPriceServlet.do",
					{
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							askinfo = data.result;
							memid = askinfo["memberID"];
							var currNickName = getNickNameByMemId(askinfo["memberID"]);
							if (currNickName == null || "" == currNickName){
								currNickName = askinfo["trueName"];
							}
							memname = currNickName;
							//memname = askinfo["trueName"];
							//memname = askinfo["nickName"] == null ? askinfo["trueName"] : askinfo["nickName"];
							panel = new Ext.Panel(
									{
										renderTo : "askinfo_title_grid",
										title : "查看审核不通过回复",
										layout : "table",
										border : false,
										layoutConfig : {
											columns : 6
										},
										items : [
												{
													autoHeight : true,
													// cls:'ask_border_none',
													bodyStyle : "border:none;padding-top:25px;padding-left:15px;",
													colspan : 6,
													items : [ {
														xtype : 'panel',
														border : false,
														html : '<img src="/resource/images/ask_title.png">&nbsp;'
																+ "<span style='font-family:宋体;font-size:15px;font-weight:bold;font-style:normal;text-decoration:none;color:#333333;'>"
																+ askinfo["name"]
																+ "</span>"
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;line-height: 40px; padding-left:25px;padding-bottom:15px;',
													items : [ {
														xtype : "label",
														text : "提问者: "
																+ currNickName
													} ]
												},
												{
													autoHeight : true,
													bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#CCCCCC;line-height: 40px; padding-left:5px;padding-right:5px;padding-bottom:15px;',
													items : [ {
														xtype : "label",
														text : "|"
													} ]
												},
												{
													autoHeight : true,
													colspan : 4,
													bodyStyle : "border:none;padding-bottom:15px;",
													items : [ {
														xtype : 'panel',
														border : false,
														html : '<img src="/resource/images/ask_point.png">'
																+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;padding-bottom:25px;'>悬赏积分: </span>&nbsp;"
																+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#FF6600;padding-bottom:25px;'>"
																+ askinfo["score"]
																+ "</span>"
													} ]
												} ]
									});
							new Ext.Panel(
									{
										renderTo : "askinfo_grid",
										layout : "table",
										border : false,
										layoutConfig : {
											columns : 6
										},
										items : [
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "公司名称: "
													} ]
												},
												{
													width : 400,
													colspan : 5,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["corpName"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "规格型号: "
													} ]
												},
												{
													width : 400,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["spec"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-top:25px;',
													items : [ {
														xtype : "label",
														text : ""
													} ]
												},
												{
													width : 70,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;vertical-align:super;',
													items : [ {
														xtype : "label",
														text : "档        次: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 2,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(getGradeByStatus(askinfo["grade"]))
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "材料分类: "
													} ]
												},

												{
													width : 400,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(getSubCidNameBySubcid(askinfo["subCid"]))
													// getStuffName(askinfo["cid"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : ""
													} ]
												},
												{
													width : 70,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : "用        途: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 2,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["purpose"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "数        量: "
													} ]
												},

												{
													width : 400,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["amount"])
																+ returnNull(askinfo["unit"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : ""
													} ]
												},
												{
													width : 70,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : "费用说明: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 2,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : (askinfo["carriage"] == "0" ? "不"
																: "")
																+ "含运费;"
																+ (askinfo["tax"] == "0" ? "不"
																		: "")
																+ "含税费;"
																+ (askinfo["keepFee"] == "0" ? "不"
																		: "")
																+ "含采保费;"
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "报价地区: "
													} ]
												},

												{
													width : 400,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["addr"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : ""
													} ]
												},
												{
													width : 70,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;',
													items : [ {
														xtype : "label",
														text : "到期时间: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 2,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : subDate(askinfo["validDate"])
													} ]
												},
												{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "备        注: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 5,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : returnNull(askinfo["notes"])
													} ]
												},{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "图        片: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 5,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														html : buildUploadFileArea(askinfo["id"])
													} ]
												},{
													width : 100,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "补充说明: "
													} ]
												},
												{
													autoHeight : true,
													colspan : 5,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;overflow:auto;',
													items : [ {
														xtype : "label",
														text : ""
													} ]
												},{
													colspan : 6,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														html : buildAppContentArea(askinfo["id"])
													} ]
												} ]
									});
						},
						failure : function() {
							Ext.MessageBox.alert(data.result);

						}
					}, "type=8&id=" + selectinfoPID);
	buildReplyArea();

};

// 建立回复区
function buildReplyArea() {
	// 加载回复区域列表内容
	getReplyInfo();
};

/**
 * 加载回复区域列表内容
 */
function getReplyInfo() {
	Ext.Ajax.request({
		url : '/ask/AskPriceServlet.do',
		params : {
			pageSize : 2000,
			type : 16,
			id : selectinfo,
			page : 1,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var replyData = jsondata.result;
				var memberList = getMemberList(replyData);
				bulidReplyPanel(replyData, memberList);
			}
		}
	});
}

// 删除回复
function delReply(id) {
	Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", "/ask/AskPriceServlet.do?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.MessageBox.alert("提示", "回复删除成功。");
						getReplyInfo();
					}
				}
			}, "id=" + id);
		}
	});
}

function bulidReplyPanel(replyData, memberList) {
	var panel2 = new Ext.FormPanel({
		applyTo : "reply_area",
		layout : 'table',
		autoHeight : true,
		width : 800,
		border : false,
		bodyStyle : 'padding-top:30px;',
		layoutConfig : {
			columns : 2
		},
		items : [ {
			width : 10,
			autoHeight : true,
			bodyStyle : 'border:none;',
			items : [ {
				xtype : "label",
				text : ""
			} ]
		} ]
	});

	foreachPanel = new Ext.Panel(
			{
				layout : "table",
				border : true,
				bodyStyle : 'border-color:#000000;',
				width : 790,
				layoutConfig : {
					columns : 8
				},
				items : [ {
					autoHeight : true,
					colspan : 8,
					bodyStyle : "border:none;padding-top:10px;padding-left:15px;",
					items : [ {
						xtype : 'panel',
						border : false,
						html : '<img src="/resource/images/ask_reply.png">&nbsp;'
								+ "<span style='font-family:宋体;font-size:15px;font-weight:bold;font-style:normal;text-decoration:none;color:#333333;'>询价回复</span>"
					} ]
				} ]
			});
	foreachPanel
			.add({
				width : 100,
				autoHeight : true,
				bodyStyle : 'border:none;padding-left:15px;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>" + returnAskPriceType(replyData.isExpPrice) + "</span>"
				} ]
			});
	foreachPanel
			.add({
				width : 120,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF6600;'>"
							+ returnNull(replyData.priceFac) + "</span>"
				} ]
			});
	
	foreachPanel
	.add({
		width : 180,
		autoHeight : true,
		bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align:top;',
		items : [ {
			xtype : "label",
			html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;vertical-align:top;'>单    位：" + returnNull(replyData.unit) + "</span>"
		} ] 
	});

/*foreachPanel
	.add({
		width : 80,
		autoHeight : true,
		bodyStyle : 'border:none;line-height: 20px;',
		items : [ {
			xtype : "label",
			html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: ;'>"
					+ returnNull(replyData.unit)
					+ "</span>"
		} ]
	});*/

	foreachPanel
		.add({
			autoHeight : true,
			colspan : 5,
			bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;float:right;',
			items : [ {
				xtype : "label",
				html : ""
			} ]
		});
	/*
	foreachPanel
			.add({
				width : 60,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>" + returnUnitOrSupplier(replyData.isExpPrice) + "</span>"
				} ]
			});
	foreachPanel
			.add({
				width : 250,
				autoHeight : true,
				colspan : 4,
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
							+ returnNull(returnUnitOrSupplierVal(replyData.isExpPrice,replyData.supplier,replyData.unit)) + "</span>"
				} ]
			});
	foreachPanel
			.add({
				width : 50,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 50px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>品牌：</span>"
				} ]
			});
	foreachPanel
			.add({
				width : 100,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 50px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-style:normal;text-decoration:none;color:#000000;'>"
							+ returnNull(replyData.brand) + "</span>"
				} ]
			});
	*/
	/*
	foreachPanel
			.add({
				width : 60,
				autoHeight : true,
				hidden : expPriceHidden(replyData.isExpPrice),
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>品    牌：</span>"
				} ]
			});
	
	foreachPanel
			.add({
				width : 220,
				colspan : 4,
				autoHeight : true,
				hidden : expPriceHidden(replyData.isExpPrice),
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
							+ returnNull(replyData.brand)
							+ "</span>"
				} ]
			});
	
	foreachPanel
			.add({
				autoHeight : true,
				bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
				items : [ {
					xtype : "label",
					text : " "
				} ]
			});
	*/
	foreachPanel
			.add({
				width : 80,
				autoHeight : false,
				bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align: text-top;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>备    注："
				} ]
			});
	foreachPanel
			.add({
				width : 450,
				colspan : 6,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 20px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: auto;'>"
							+ returnNull(replyData.notes) + "</span>"
				} ]
			});
	foreachPanel
			.add({
				autoHeight : true,
				bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
				items : [ {
					xtype : "label",
					text : " "
				} ]
			});
	foreachPanel
			.add({
				colspan : 3,
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#999999;'>"
							+ substringDate(replyData.createOn) + "</span>"
				} ]
			});
	foreachPanel.add({
		colspan : 4,
		autoHeight : true,
		bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
		items : [ {
			xtype : "label",
			text : ""
		} ]
	});
	foreachPanel
			.add({
				autoHeight : true,
				bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
				items : [ {
					xtype : "label",
					html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;float:right;'>"
							+ getMonitor(getRole(replyData.memberID,
								memberList))
							+ getNickName(replyData.memberID,
								memberList)
							+ " | "
							+ getLevelByScore(getExp(replyData.memberID,
									memberList), true)
							+ " "
							+ getLevelByScore(getExp(replyData.memberID,
									memberList), false) + "</span>"
				} ]
			});
	foreachPanel
			.add({
				hidden : replyData.state == "3" ? true : false, //state=3时则是通过审核不通过回复列表进来查看详情的 
				colspan : 4,
				bodyStyle : "border:none;padding-left:250px;margin-top:25px;margin-bottom:10px;",
				items : [ {
					xtype : "tbbutton",
					width : 90,
					text : "通过",
					hidden : compareAuth("ASK_REPLY_AUDIT"),
					handler : function() {
						// 设置最新回复状态
						reSetStatus(replyData.state);
						// 先判断是否已处理过
						if (checkToexamine()) {
							Ext.MessageBox
									.confirm(
											"提示",
											"确定审核通过？",
											function(op) {
												if (op == "yes") {
													Ext.lib.Ajax
															.request(
																	"post",
																	"/ask/AskPriceServlet.do?type=15&status=1&&memberID="
																			+ replyData.memberID
																			+ "&askId="
																			+ selectinfoPID
																			+ "&province="
																			+ selectProvince
																			+ "&city="
																			+ selectCity,
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
																				/*
																				 * Ext.MessageBox
																				 * .alert(
																				 * "提示",
																				 * "已审核通过，确定后关闭页面！");
																				 */
																				reSetStatus("1");
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

						}
					}
				} ]
			});

	foreachPanel
			.add({
				hidden : replyData.state == "3" ? true : false, //state=3时则是通过审核不通过回复列表进来查看详情的 
				colspan : 4,
				bodyStyle : "border:none;padding-left:30px;margin-top:25px;margin-bottom:10px;",
				items : [ {
					xtype : "tbbutton",
					width : 90,
					text : "不通过",
					hidden : compareAuth("ASK_REPLY_AUDIT"),
					handler : function() {
						// 设置最新回复状态
						reSetStatus(replyData.state);
						// 先判断是否已处理过
						if (checkToexamine()) {
							Ext.MessageBox
									.confirm(
											"提示",
											"确定审核不通过？",
											function(op) {
												if (op == "yes") {
													Ext.lib.Ajax
															.request(
																	"post",
																	"/ask/AskPriceServlet.do?type=15&status=3&askId="
																			+ selectinfoPID,
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
																				Info_Tip("已审核不通过，该条回复自动删除，确定后关闭页面！");
																				/*
																				 * Ext.MessageBox
																				 * .alert(
																				 * "提示",
																				 * "已审核不通过，该条回复自动删除，确定后关闭页面！");
																				 */
																				reSetStatus("3");
																				changeStatus = false;
																				Ext.MessageBox
																						.alert(
																								"提示",
																								"已审核不通过，该条回复自动删除，确定后关闭页面！",
																								closeCurrWin);
																			}
																		}
																	},
																	"id="
																			+ selectinfo);
												}
											});

						}
					}
				} ]
			});

	// 将动态加载的item显示
	foreachPanel.doLayout(),
	// 添加组件
	panel2.add(foreachPanel);
	// 将动态加载的item显示
	panel2.doLayout();
	// 添加关闭按钮
}

function changedata(v) {
	if ((v || "") == "")
		return "否";
	else {
		if (v == "0")
			return "否";
		else
			return "是";
	}
}

function changegov(v) {
	if ((v || "") == "")
		return "造价站暂时没有公布。";
	else {
		if (parseFloat(v) == 0)
			return "造价站暂时没有公布。";
		else
			return v;
	}
};
function changeprice(v) {
	if ((v || "") == "")
		return "非常抱歉，暂时没有数据。";
	else {
		if (parseFloat(v) == 0)
			return "非常抱歉，暂时没有数据。";
		else
			return v;
	}
};
// 右键菜单
/*
 * var rightClick = new Ext.menu.Menu({ id : 'rightClickCont', shadom : false,
 * items : [ { text : '添加回复', handler : add_win, hidden :
 * compareAuth("ASK_REP_ADD") }, { id : 'rMenu1', text : '删除', handler :
 * del_reply, hidden : compareAuth("ASK_REP_DEL") }, { id : 'rMenu2', text :
 * '添加此材料到材料库', handler : addtTomat, hidden : compareAuth("ASK_REP_ADDMAT") } ]
 * });
 */

/**
 * 关闭当前选项卡页面，重新加载列表数据
 * 
 * @param btn
 */
function closeCurrWin(btn) {
	if ("ok" == btn) {
		// window.parent.tab_ask_reply_unaudited_iframe.ds.reload();
		if (window.parent.tab_ask_reply_unaudited_iframe) {
			window.parent.tab_ask_reply_unaudited_iframe.ds.reload();
		}
		// alert(window.parent.tab_ask_reply_unaudited_iframe.grid.store.proxy.url);
		window.parent.Ext.getCmp('center').remove("ask_reply_toexamine");
	}
}

function init() {
	buildAskinfo();
};
Ext.onReady(function() {
	init();
	Ext.QuickTips.init();
});

// 添加材料到材料库
function addtTomat() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for ( var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		if (!rows[0].get("priceFac")) {
			Ext.MessageBox.alert("提示", "此回复没有厂商报价，无法添加到材料库");
			return;
		}
		Ext.lib.Ajax.request("post", "/ask/AskServlet?type=20", {
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc, data.result)) {
					Ext.MessageBox.alert("提示", "材料添加成功。");
					ds.reload();
					ids = [];
				}
			}
		}, "id=" + ids.toString());
	} else
		Ext.MessageBox.alert("提示", "请点击回复信息。");
};

// 提交回复
function add_reply() {
	if (!fs.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按照要求填写内容!");
		return;
	}
	var name = Ext.fly("name").getValue();

	var spec = Ext.fly("spec").getValue();

	var uunit = Ext.fly("unit").getValue();

	var amount = Ext.fly("amount").getValue();

	var govprice = Ext.fly("priceGov").getValue();

	var facprice = Ext.fly("priceFac").getValue();

	var advprice = Ext.fly("priceAdv").getValue();

	var supplier = Ext.fly("supplier").getValue();

	var brand = Ext.fly("brand").getValue();

	var area = Ext.fly("area").getValue();

	var cid = Ext.fly("stuffcode").getValue();

	var code = Ext.fly("code").getValue();

	var issueDate = Ext.fly("issueDate").getValue();

	var tax = fs.getForm().findField('tax').getValue() == true ? 1 : "";

	var carriage = fs.getForm().findField('carriage').getValue() == true ? 1
			: "";

	var keepFee = fs.getForm().findField('keepFee').getValue() == true ? 1 : "";

	var notes = Ext.fly("notes").getValue();

	if (advprice && facprice) {
		if (advprice / facprice >= 10) {
			Ext.MessageBox.alert("提示", "建议价比厂商报价高出太多，请重新填写建议价");
			return;
		}
	}

	Ext.lib.Ajax.request("post", "/ask/AskServlet?type=13", {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				Ext.MessageBox.alert("提示", "回复添加成功。");
				ds.reload();
				ids = [];
				if (Ext.fly("continue_add").dom.checked == false) {
					win.close();
				} else {
					fs.getForm().reset();
				}
			}
		}
	}, encodeURI("content=pid~" + selectinfo + ";name~" + name + ";spec~"
			+ spec + ";unit~" + uunit + ";priceGov~" + govprice + ";amount~"
			+ amount + ";priceFac~" + facprice + ";priceAdv~" + advprice
			+ ";supplier~" + supplier + ";brand~" + brand + ";cid~" + cid
			+ ";code~" + code + ";area~" + area + ";issueDate~" + issueDate
			+ ";tax~" + tax + ";carriage~" + carriage + ";keepFee~" + keepFee
			+ ";notes~" + notes + ";askId~" + memid + ";askName~" + memname));
};

/**
 * 判断当前询价是否已处理
 * 
 * @returns
 */
function checkToexamine() {
	if (currStatus != "0") {
		Info_Tip("该回复已处理，无需重复审核！");
		return false;
	}
	return true;
}

/**
 * 设置最新的状态
 * 
 * @param newStatus
 */
function reSetStatus(newStatus) {
	if (changeStatus) {
		currStatus = newStatus;
	}
}
