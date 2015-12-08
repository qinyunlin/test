var askds, grid, panel, askinfo, ff, sck, bookTpl, fs;
var selectinfo = getCurArgs("id");
var lockPage = getCurArgs("lockPage");
var curUser = parent.currUser_mc;
var ids = [];
var win, memid, memname;

var foreachPanel, panel2;
var lastItemIndex; // panel中的item最大下标
var totalReplyCount = 0; // 回复总条数

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
							//memname = askinfo["trueName"];
							var currNickName = getNickNameByMemId(askinfo["memberID"]);
							if (currNickName == null || "" == currNickName){
								currNickName = askinfo["trueName"];
							}
							memname = currNickName;
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
													// cls:'ask_border_none',
													bodyStyle : "border:none;padding-top:25px;padding-left:25px;",
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
																+ currNickName // askinfo["memberID"]
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
												} ,
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
														text : ""
													} ]
												},{
													colspan : 6,
													autoHeight : true,
													bodyStyle : 'border:none;font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;line-height: 20px;padding-left:25px;',
													items : [ {
														xtype : "label",
														html : bulidToexamineArea(askinfo["remark"],askinfo["auditor"])
													} ]
												}]
									});
						},
						failure : function() {
							Ext.MessageBox.alert(data.result);

						}
					}, "type=8&id=" + selectinfo);
	//buildReplyArea();
	addCloseItem();
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
}

/**
 * 添加关闭按钮
 */
function addCloseItem() {
	createPanel();
	// 添加关闭按钮
	panel2
			.add({
				colspan : 2,
				bodyStyle : "border:none;padding-left:350px;float:center;",
				items : [ {
					xtype : "tbbutton",
					width : 90,
					text : "关闭",
					handler : function() {
							window.parent.Ext.getCmp('center').remove(
									"ask_price_nopass_detail");
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
	for ( var i = removeItemIndex; i < removeItemIndex + 15; i++) {
		foreachPanel.remove("item" + i);
	}
	totalReplyCount = parseInt(totalReplyCount) - 1;
	// 如果删除的是最后一条回复，则移除上一个虚线
	if (removeItemIndex == lastItemIndex - 14) {
		foreachPanel.remove("item" + (removeItemIndex - 1));
		lastItemIndex -= 15;
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
function delReply(id, askId,removeItemIndex) {
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
			}, "id=" + id+"&askId="+askId);
		}
	});
}

function foreachReplyPanel(replyList, memberList) {

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
	var itemIndex = 0;
	totalReplyCount = replyList.length;
	for ( var i = 0; i < replyList.length; i++) {
		var currentRecord = replyList[i];
		var currentIndex = itemIndex + 1;
		foreachPanel
				.add([
						{
							id : "item" + (itemIndex += 1),
							width : 100,
							autoHeight : true,
							bodyStyle : 'border:none;padding-left:15px;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>厂商报价：</span>"
							} ]
						},
						{
							id : "item" + (itemIndex += 1),
							width : 80,
							autoHeight : true,
							bodyStyle : 'border:none;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-weight:bold;font-style:normal;text-decoration:none;color:#FF6600;'>"
										+ returnNull(currentRecord.priceFac)
										+ "</span>"
							} ]
						},
						{
							id : "item" + (itemIndex += 1),
							width : 60,
							autoHeight : true,
							bodyStyle : 'border:none;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#333333;'>供应商：</span>"
							} ]
						},
						{
							id : "item" + (itemIndex += 1),
							width : 220,
							autoHeight : true,
							bodyStyle : 'border:none;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>"
										+ returnNull(currentRecord.supplier)
										+ "</span>"
							} ]
						},
						{
							id : "item" + (itemIndex += 1),
							width : 50,
							autoHeight : true,
							bodyStyle : 'border:none;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-weight:normal;font-style:normal;text-decoration:none;color:#000000;'>品牌：</span>"
							} ]
						},
						{
							id : "item" + (itemIndex += 1),
							width : 60,
							autoHeight : true,
							bodyStyle : 'border:none;line-height: 20px;',
							items : [ {
								xtype : "label",
								html : "<span style='font-family:新宋体;font-size:13px;font-style:normal;text-decoration:none;color:#000000;'>"
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
										+ ","+currentRecord.pid+","
										+ currentIndex
										+ ");' style='text-decoration:none;'>删除</a>"
							} ]
						},
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
										+ currentRecord.trueName
										+ " | "
										+ getLevelByScore(getExp(
												currentRecord.memberID,
												memberList), true)
										+ " "
										+ getLevelByScore(getExp(
												currentRecord.memberID,
												memberList), false) + "</span>"
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
	// 将动态加载的item显示
	foreachPanel.doLayout();
	// 添加组件
	panel2.add(foreachPanel);
}


function bulidToexamineArea(remark,updateBy){
	var html = "<table style='border:solid 1px black;width:100%;'>";
	html += "<tr style='line-height:20px;'><td>&nbsp;&nbsp;&nbsp;审核不通过理由:" + remark +"</td></tr>";
	html += "<tr style='line-height:20px;'><td>&nbsp;&nbsp;&nbsp;审核人:" + updateBy +"</td></tr>";
	html += "</table>";
	return html;
}

function init() {
	buildAskinfo();
};
Ext.onReady(function() {
	init();
	Ext.QuickTips.init();
});

