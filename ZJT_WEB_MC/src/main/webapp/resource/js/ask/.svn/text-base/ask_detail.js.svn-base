var askds, grid, panel, askinfo, ff, sck, bookTpl, fs;
var selectinfo = getCurArgs("id");
var lockPage = getCurArgs("lockPage");
var curUser = parent.currUser_mc;
var ids = [];
var win, memid, memname;

var foreachPanel,goodPanel, goodReplyPanel,panel2;
var lastItemIndex; // panel中的item最大下标
var totalReplyCount = 0; // 回复总条数
var askPriceStatus = 2;

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
	if (date == null || date == "") {
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
 * 
 * @param isExpPrice
 * @returns {String}
 */
function returnAskPriceType(isExpPrice) {
	if ("1" == isExpPrice) {
		return "经验报价：";
	}
	return "厂商报价：";
}

/**
 * 返回供应商或者单位
 * 
 * @param isExpPrice
 * @returns {String}
 */
function returnUnitOrSupplier(isExpPrice) {
	if ("1" == isExpPrice) {
		return "单位：";
	}
	return "供应商：";
}

/**
 * 返回供应商或者单位的值
 * 
 * @param isExpPrice
 * @returns {String}
 */
function returnUnitOrSupplierVal(isExpPrice, sup, unit) {
	if ("1" == isExpPrice) {
		return unit;
	}
	return sup;
}

/**
 * 经验报价，则隐藏单位和品牌
 * 
 * @param isExpPrice
 * @returns {Boolean}
 */
function expPriceHidden(isExpPrice) {
	if ("1" == isExpPrice) {
		return true;
	}
	return false;
}

/**
 * 获得相应的角色类型
 * 
 * @param memberId
 * @param memberList
 * @returns {String}
 */
function getRole(memberId, memberList) {
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
 * 
 * @param memberId
 * @param memberList
 * @returns
 */
function getNickName(memberId, memberList) {
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
	if (nickName == null || "" == nickName) {
		return trueName;
	}
	return nickName;
}

/**
 * 根据会员id获取会员昵称
 * 
 * @param memberId
 */
function getNickNameByMemId(memberId) {
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
			// if (getState(data.state, commonResultFunc, data.result)) {
			// }
			if (data.result != null) {
				nickName = data.result.nickName;
			}
			return nickName;
		}
	});
	return nickName;
}

/**
 * 堂主显示身份
 * 
 * @param role
 * @returns {String}
 */
function getMonitor(role) {
	if ("1" == role) {
		return "<img src='/resource/images/img_monitor.png'  title='堂主' />";
	}
	return "";
}

/**
 * 获取会员集合
 * 
 * @param replyList
 * @returns
 */
function getMemberList(replyList) {
	// 拼接id集合查询条件
	var appendId = "";
	for ( var i = 0; i < replyList.length; i++) {
		var reply = replyList[i];
		appendId = appendId + "'" + reply.memberID + "',";
	}
	appendId = appendId.substring(0, appendId.lastIndexOf(","));

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
function buildUploadFileArea(id) {
	var uploadFileHtml = "";
	$
			.ajax({
				type : 'POST',
				url : '/ask/AskPriceServlet.do',
				async : false,
				data : "type=51&id=" + id,
				success : function(response) {
					var data = eval("(" + response + ")");
					var uploadFileList = data.result;
					if (uploadFileList != null) {
						for ( var i = 0; i < uploadFileList.length; i++) {
							uploadFile = uploadFileList[i];
							uploadFileHtml += "<img src='/resource/images/u13_uploadfile.png' />&nbsp;<a href='"
									+ FileSite
									+ uploadFile.filePath
									+ "' target='_blank' style='text-decoration:none;' >"
									+ uploadFile.filename + ".jpg</a></span>";
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
 * 
 * @param id
 * @returns {String}
 */
function buildAppContentArea(id) {
	var appContentHtml = "";
	$
			.ajax({
				type : 'POST',
				url : '/ask/AskPriceServlet.do',
				async : false,
				data : "type=50&id=" + id,
				success : function(response) {
					var data = eval("(" + response + ")");
					var appContentList = data.result;
					if (appContentList != null) {
						for ( var i = 0; i < appContentList.length; i++) {
							var appContent = appContentList[i];
							appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;'>["
									+ substringDate(appContent.createOn)
									+ "]</span>&nbsp;";
							appContentHtml += "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>"
									+ appContent.notes + "</span>";
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
							if (currNickName == null || "" == currNickName) {
								currNickName = askinfo["trueName"];
							}
							memname = currNickName;
							askPriceStatus = askinfo["status"];
							// memname = askinfo["trueName"];
							// memname = askinfo["nickName"] == null ?
							// askinfo["trueName"] : askinfo["nickName"];
							// 公司名称
							$("#coprName_text").html(
									"公司名称：" + returnNull(askinfo["corpName"]));
							panel = new Ext.Panel(
									{
										renderTo : "askinfo_title_grid",
										title : "询价信息",
										layout : "table",
										border : false,
										layoutConfig : {
											columns : 6
										},
										items : [
												{
													autoHeight : true,
													bodyStyle : "border:none;padding-top:10px;padding-left:15px;",
													colspan : 6,
													items : [ {
														xtype : 'panel',
														border : false,
														html : "<span style='font-family:宋体;font-size:15px;font-weight:bold;font-style:normal;text-decoration:none;color:#333333;'>公司名称："
																+ returnNull(askinfo["corpName"])
																+ "</span>"
													} ]
												},
												{
													autoHeight : true,
													// cls:'ask_border_none',
													bodyStyle : "border:none;padding-top:15px;padding-left:15px;",
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
																+ "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;padding-bottom:25px;'>悬赏积分:</span>&nbsp;"
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
													hidden : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														text : "公司名称: "
													} ]
												},
												{
													width : 400,
													colspan : 5,
													hidden : true,
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
														text : (askinfo["carriage"] == "1" ? ""
																: "不")
																+ "含运费;"
																+ (askinfo["tax"] == "1" ? ""
																		: "不")
																+ "含税费;"
																+ (askinfo["keepFee"] == "1" ? ""
																		: "不")
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
												},
												{
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
												},
												{
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
												},
												{
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
					}, "type=8&id=" + selectinfo);
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
	var replyList;
	Ext.Ajax.request({
		url : '/ask/AskPriceServlet.do',
		params : {
			pageSize : 2000,
			type : 9,
			id : selectinfo,
			page : 1,
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				replyList = jsondata.result;
				// 创建父面板
				createPanel();
				// 创建回复内容区域
				if (replyList.length > 0) {
					var memberList = getMemberList(replyList);
					foreachReplyPanel(replyList, memberList);
				}
				// 添加关闭按钮
				addCloseItem();
			}
		}
	});
}

/**
 * 创建回复父面板(回复内容区域面板属于子面板)
 */
function createPanel() {
	panel2 = new Ext.FormPanel({
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
	
	goodReplyPanel = new Ext.FormPanel({
		applyTo : "good_replay",
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
	
}

/**
 * 添加关闭按钮
 */
function addCloseItem() {
	// 添加关闭按钮
	panel2
			.add({
				colspan : 2,
				bodyStyle : "border:none;padding-left:300px;margin-top:15px;float:center;",
				items : [ {
					xtype : "tbbutton",
					width : 90,
					text : "关闭",
					handler : function() {
						// alert("关闭");
						if (lockPage == "1") {
							window.parent.Ext.getCmp('center').remove(
									"ask_locked");
						} else {
							window.parent.Ext.getCmp('center').remove(
									"ask_detail");
						}
					}
				} ]
			});
	// 将动态加载的item显示
	panel2.doLayout();
}

/**
 * 移除删除的回复信息
 * 
 * @param removeItemIndex
 */
function removeReplyWhenDel(removeItemIndex) {
	// for ( var i = removeItemIndex; i < removeItemIndex + 15; i++) {
	//for ( var i = removeItemIndex; i < removeItemIndex + 18; i++) {
	for ( var i = removeItemIndex; i < removeItemIndex + 13; i++) {
		foreachPanel.remove("item" + i);
	}
	totalReplyCount = parseInt(totalReplyCount) - 1;
	// 如果删除的是最后一条回复，则移除上一个虚线
	// if (removeItemIndex == lastItemIndex - 14) {
	//if (removeItemIndex == lastItemIndex - 17) {
	if (removeItemIndex == lastItemIndex - 12) {
		foreachPanel.remove("item" + (removeItemIndex - 1));
		// lastItemIndex -= 15;
		// lastItemIndex -= 18;
		lastItemIndex -= 13;
	}
	// 全部移除，则隐藏询价回复面板
	if (totalReplyCount <= 0) {
		// panel2.collapse();
		panel2.hide();
	}
	foreachPanel.doLayout();
}

/**
 * 删除回复
 */
function delReply(id, askId, removeItemIndex) {
	// removeReplyWhenDel(removeItemIndex);
	Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", "/ask/AskPriceServlet.do?type=10", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")")
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.MessageBox.alert("提示", "回复删除成功。");
						// getReplyInfo();
						removeReplyWhenDel(removeItemIndex);
					}
				}
			}, "id=" + id + "&askId=" + askId);
		}
	});
}

function foreachReplyPanel(replyList, memberList) {
	var otherReplyCount = replyList.length;
	if ("3" == askPriceStatus){
		otherReplyCount = replyList.length - 1;
	}
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
								+ "<span style='font-family:宋体;font-size:15px;font-weight:bold;font-style:normal;text-decoration:none;color:#333333;'>其它回复"
								+ "</span><span style='font-family:宋体;font-size:12px;font-style:normal;text-decoration:none;color:#666666;' id='replyCount'>&nbsp;&nbsp;&nbsp;共"
								+ otherReplyCount + "个</span>"
					} ]
				} ]
			});
	
	goodPanel= new Ext.Panel(
			{
				layout : "table",
				border : true,
				bodyStyle : 'border-color:green;',
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
						html : '<img src="/resource/images/icon_goodReply.gif" width="16" height="16" />&nbsp;'
							+ "<span style='font-family:宋体;font-size:15px;font-weight:bold;font-style:normal;text-decoration:none;color:#333333;'>最佳回复</span>"
					} ]
				} ]
			});
	
	//添加普通回复
	var itemIndex = 0;
	totalReplyCount = replyList.length;
	var hasGoodReply = false;
	var otherReplyCount = replyList.length;
	for ( var i = 0; i < replyList.length; i++) {
		var currentRecord = replyList[i];
		var currentIndex = itemIndex + 1;
		if ("2" == currentRecord.state) {
			hasGoodReply = true;
			var replyCount = replyList.length - 1;
			if (replyCount == 0){
				panel2.hide();
			}
			goodPanel
					.add([
							{
								width : 100,
								autoHeight : true,
								bodyStyle : 'border:none;padding-left:15px;line-height: 15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnAskPriceType(currentRecord.isExpPrice)
											+ "</span>"
								} ]
							},
							{
								width : 80,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF6600;'>"
											+ returnNull(currentRecord.priceFac)
											+ "</span>"
								} ]
							},{
								width : 60,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>单位：</span>"
								} ]
							},
							{
								width : 350,
								autoHeight : true,
								colspan : 3,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(currentRecord.unit)
											+ "</span>"
								} ]
							},
							/*{
								width : 60,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>"
											+ returnUnitOrSupplier(currentRecord.isExpPrice)
											+ "</span>"
								} ]
							},
							{
								width : 350,
								autoHeight : true,
								colspan : 3,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(returnUnitOrSupplierVal(
													currentRecord.isExpPrice,
													currentRecord.supplier,
													currentRecord.unit))
											+ "</span>"
								} ]
							},*/
							{
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;float:right;',
								items : [ {
									xtype : "label",
									hidden : compareAuth("ASK_REP_DEL"),
									html : "<a href='javascript:delReply("
											+ currentRecord.id
											+ ","
											+ currentRecord.pid
											+ ","
											+ currentIndex
											+ ");' style='text-decoration:none;'></a>"
								} ]
							},/*
							{
								width : 100,
								autoHeight : false,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align:top;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;vertical-align:top;'>单    位：</span>"
								} ]
							},
							{
								width : 80,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: auto;'>"
											+ returnNull(currentRecord.unit)
											+ "</span>"
								} ]
							},
							{
								width : 60,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>品    牌：</span>"
								} ]
							},
							{
								width : 220,
								colspan : 4,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(currentRecord.brand)
											+ "</span>"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},*/
							{
								width : 80,
								autoHeight : false,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align:top;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;vertical-align:top;'>备    注：</span>"
								} ]
							},
							{
								width : 450,
								colspan : 6,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: auto;'>"
											+ returnNull(currentRecord.notes)
											+ "</span>"
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},
							{
								colspan : 3,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#999999;'>"
											+ substringDate(currentRecord.createOn)
											+ "</span>"
								} ]
							},
							{
								colspan : 4,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									text : ""
								} ]
							},
							{
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;float:right;'>"
											+ getMonitor(getRole(
													currentRecord.memberID,
													memberList))
											+ getNickName(
													currentRecord.memberID,
													memberList)
											+ " | "
											+ getLevelByScore(getExp(
													currentRecord.memberID,
													memberList), true)
											+ " "
											+ getLevelByScore(getExp(
													currentRecord.memberID,
													memberList), false)
											+ "</span>"
								} ]
							} ]);
		}else{
			foreachPanel
					.add([
							{
								id : "item" + (itemIndex += 1),
								width : 100,
								autoHeight : true,
								bodyStyle : 'border:none;padding-left:15px;line-height: 15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnAskPriceType(currentRecord.isExpPrice)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 80,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF6600;'>"
											+ returnNull(currentRecord.priceFac)
											+ "</span>"
								} ]
							},/*
							{
								id : "item" + (itemIndex += 1),
								width : 60,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>"
											+ returnUnitOrSupplier(currentRecord.isExpPrice)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 350,
								autoHeight : true,
								colspan : 3,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(returnUnitOrSupplierVal(
													currentRecord.isExpPrice,
													currentRecord.supplier,
													currentRecord.unit))
											+ "</span>"
								} ]
							},*/

							{
								id : "item" + (itemIndex += 1),
								width : 60,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>单位：</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 350,
								autoHeight : true,
								colspan : 3,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(currentRecord.unit)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;float:right;',
								items : [ {
									xtype : "label",
									hidden : compareAuth("ASK_REP_DEL"),
									html : "<a href='javascript:delReply("
											+ currentRecord.id
											+ ","
											+ currentRecord.pid
											+ ","
											+ currentIndex
											+ ");' style='text-decoration:none;'>删除</a>"
								} ]
							},/*
							{
								id : "item" + (itemIndex += 1),
								width : 100,
								autoHeight : false,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align:top;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;vertical-align:top;'>单    位：</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 80,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: auto;'>"
											+ returnNull(currentRecord.unit)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 60,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>品    牌：</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 220,
								colspan : 4,
								autoHeight : true,
								hidden : expPriceHidden(currentRecord.isExpPrice),
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
											+ returnNull(currentRecord.brand)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},*/
							{
								id : "item" + (itemIndex += 1),
								width : 80,
								autoHeight : false,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;vertical-align:top;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;vertical-align:top;'>备    注：</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								width : 450,
								colspan : 6,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;overflow: auto;'>"
											+ returnNull(currentRecord.notes)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								autoHeight : true,
								bodyStyle : 'border:none;font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#0766B1;line-height: 20px;',
								items : [ {
									xtype : "label",
									text : " "
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								colspan : 3,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#999999;'>"
											+ substringDate(currentRecord.createOn)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								colspan : 4,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									text : ""
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									html : "<span style='font-family:宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#666666;float:right;'>"
											+ getMonitor(getRole(
													currentRecord.memberID,
													memberList))
											+ getNickName(
													currentRecord.memberID,
													memberList)
											+ " | "
											+ getLevelByScore(getExp(
													currentRecord.memberID,
													memberList), true)
											+ " "
											+ getLevelByScore(getExp(
													currentRecord.memberID,
													memberList), false)
											+ "</span>"
								} ]
							},
							{
								id : "item" + (itemIndex += 1),
								colspan : 8,
								autoHeight : true,
								bodyStyle : 'border:none;line-height: 20px;padding-left:15px;',
								items : [ {
									xtype : "label",
									html : "<hr style='border:1px #cccccc dotted;' />"
								} ]
							} ]);
			if (i == replyList.length - 1) {
				foreachPanel.remove("item" + itemIndex);
				// itemIndex -= 1;
			}
			lastItemIndex = itemIndex;
		}
	}
	// 将动态加载的item显示
	foreachPanel.doLayout();
	// 添加组件
	panel2.add(foreachPanel);
	//无最佳回复，则最佳回复区域不显示
	if (hasGoodReply){
		goodPanel.doLayout();
		goodReplyPanel.add(goodPanel);
		if (replyList.length - 1 == 0){
			// 添加关闭按钮
			goodReplyPanel
					.add({
						colspan : 2,
						bodyStyle : "border:none;padding-left:300px;margin-top:15px;float:center;",
						items : [ {
							xtype : "tbbutton",
							width : 90,
							text : "关闭",
							handler : function() {
								if (lockPage == "1") {
									window.parent.Ext.getCmp('center').remove(
											"ask_locked");
								} else {
									window.parent.Ext.getCmp('center').remove(
											"ask_detail");
								}
							}
						} ]
					});
		}
		goodReplyPanel.doLayout();
	}
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
				var data = eval("(" + response.responseText + ")")
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
			var data = eval("(" + response.responseText + ")")
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
