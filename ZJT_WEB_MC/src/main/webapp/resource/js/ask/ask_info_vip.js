var askds, grid, panel, askinfo, ff, sck, bookTpl, fs, win;
var selectinfo = getCurArgs("id"), memid, memname, memdate;
// 创建表格
function buildAskinfo() {
	Ext.lib.Ajax.request("post", "/ep/EpRequestPriceServlet", {
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			askinfo = data.result;
			memid = askinfo["memberID"];
			memname = askinfo["trueName"];
			memdate = askinfo["updateOn"];
			panel = new Ext.form.FormPanel({
				autoHeight : true,
				renderTo : "askinfo_grid",
				layout : "table",
				border : false,
				bodyStyle : {
					background : '#DFE8F6'
				},
				items : [new Ext.form.FieldSet({
					title : '询价信息',
					layout : "table",
					width : 820,
					autoHeight : true,
					bodyStyle : {
						background : '#FFFFFF'
					},
					layoutConfig : {
						columns : 6
					},
					items : [{
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "名称："
								}]
					}, {
						width : 660,
						colspan : 5,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["name"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "型号规格："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["spec"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "单位："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["unit"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "公司名称："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["fname"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "用    途："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["purpose"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "数    量："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["amount"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "材料编码："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : askinfo["code"]
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "到期时间："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["validDate"] || "") == ""
									? "无限制"
									: askinfo["validDate"]
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "联 系 人："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["linkMan"] || "") == ""
									? ""
									: askinfo["linkMan"]
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "联系电话："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : (askinfo["phone"] || "") == ""
									? ""
									: askinfo["phone"]
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "是否含税："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : changedata(askinfo["tax"])
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "是否含运费："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : changedata(askinfo["carriage"])
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "是否采保："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
									xtype : "label",
									text : changedata(askinfo["keepFee"])
								}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "询价区域："
								}]
					}, {
						width : 180,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : askinfo["addr"] == ""
									? "&nbsp;"
									: askinfo["addr"]
						}]
					}, {
						width : 80,
						autoHeight : true,
						bodyStyle : 'border:none;font-size:12px;line-height:26px;_height:26px;min-height:26px;text-align:right;font-weight:bold',
						items : [{
									xtype : "label",
									text : "其他要求："
								}]
					}, {
						width : 360,
						colspan : 3,
						autoHeight : true,
						cls : 'ask_content',
						bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
						items : [{
							xtype : "label",
							text : askinfo["notes"] == ""
									? "&nbsp;"
									: askinfo["notes"]
						}]
					}]
				})]
			});

		},
		failure : function() {
			Ext.MessageBox.alert(data.result);

		}
	}, "method=get&id=" + selectinfo);
	buildReplyArea();

};

// 建立回复区
function buildReplyArea() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpResponsePriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						}, ["id", "name", "spec", "code", "fname", "brand",
								"unit", "priceGov", "priceFac", "priceAdv",
								"area", "tax", "carriage", "keepFee",
								"trueName", "createOn", "cid", "amount",
								"issueDate", "notes", "addr"]),
				baseParams : {
					pageSize : 2000,
					rid : selectinfo,
					page : 1,
					method : "getByRequest"
				},
				remoteSort : true
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : false
			});// 是否支持多行选择

	grid = new Ext.grid.GridPanel({
				store : ds,
				autoHeight : true,
				// autoWidth : true,
				width : 800,
				border : false,
				bodyStyle : "overflow-x:hidden",
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							text : '添加回复',
							tooltip : "点击此处添加一条新的回复",
							handler : add_win,
							hidden : compareAuth("VIP_ASK_REP_ADD")
						}],
				columns : [new Ext.grid.RowNumberer(), {

					header : '回复内容',
					dataIndex : 'name',
					width : parent.Ext.fly('tab_ask_info_vip_iframe')
							.getWidth(),
					sortable : false,
					renderer : renderContent
				}],
				view : new Ext.ux.grid.BufferView({
							// custom row height
							rowHeight : 10,
							// render rows as they come into viewable area.
							scrollDelay : true
						})
			});

	var panel2 = new Ext.FormPanel({
				// layout : "fit",
				autoHeight : true,
				layout : 'table',
				border : false,
				bodyStyle : {
					background : '#DFE8F6'
				},
				items : [new Ext.form.FieldSet({
							title : "回复信息",
							autoHeight : true,
							autoScroll : true,
							items : [grid]
						})],
				applyTo : "reply_area"
			});
	ds.load();
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());

			});
	function renderContent(value, p, record) {
		var trimtext = new cycleTrim();
		var temp = trimtext.cycleTrim(value, 24);
		trimtext.init();
		var str = String
				.format(
						'<div class="left_title"><b>名称：</b></div><div class="right_content">{0}</div><div class="left_title"><b>型号规格：</b></div><div class="right_content">{1}</div><div class="left_title"><b>品牌：</b></div><div class="right_content">{2}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>供应商：</b></div><div class="right_content">{3}</div><div class="left_title"><b>单位：</b></div><div class="right_content">{4}</div><div class="left_title"><b>产地：</b></div><div class="right_content">{16}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>信息价：</b></div><div class="right_content">{6}</div><div class="left_title"><b>厂商报价：</b></div><div class="right_content">{7}</div><div class="left_title"><b>建议价：</b></div><div class="right_content">{8}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>含税：</b></div><div class="right_content">{9}</div><div class="left_title"><b>含运费：</b></div><div class="right_content">{10}</div><div class="left_title"><b>含采保费：</b></div><div class="right_content">{11}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>材料编码：</b></div><div class="right_content">{12}</div><div class="left_title"><b>材料分类：</b></div><div class="right_content">{5}</div><div class="left_title"><b>回复时间：</b></div><div class="right_content">{13}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>发布时间：</b></div><div class="right_content">{14}</div><div class="left_title"><b>回复人：</b></div><div class="right_content">{17}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '<div class="left_title"><b>备注：</b></div><div class="right_content_bz">{15}</div><div style="clear:both; height:1px; line-height:1px; font-size:1px"></div>'
								+ '', value, record.data.spec,
						record.data.brand == null ? "" : record.data.brand,
						record.data.fname, record.data.unit,
						stuffcode(record.data.cid),
						changegov(record.data.priceGov),
						changeprice(record.data.priceFac),
						changeprice(record.data.priceAdv),
						changedata(record.data.tax),
						changedata(record.data.carriage),
						changedata(record.data.keepFee),
						record.data.code == undefined ? "" : record.data.code,
						record.data.createOn.slice(0, 10),
						record.data.issueDate.slice(0, 10),
						record.data.notes == null ? "" : record.data.notes,
						record.data.addr == null ? "" : record.data.addr,
						record.data.trueName == null
								? ""
								: record.data.trueName);
		str = str + '<div class="button_div">';
		if (!compareAuth("VIP_ASK_REP_DEL")) {
			str = str
					+ '<input class="button" type="button" value="删除回复" onclick="del_reply();"/>';
		}
		if (!compareAuth("VIP_ASK_REP_ADDMAT")) {
			str = str
					+ '<input class="button" type="button" value="添加此材料到材料库" onclick="addtTomat();" />';
		}
		str = str + '</div>';
		return str;
	}
};

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
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						text : '添加回复',
						handler : add_win,
						hidden : compareAuth("VIP_ASK_REP_ADD")
					}, {
						id : 'rMenu1',
						text : '删除',
						handler : del_reply,
						hidden : compareAuth("VIP_ASK_REP_DEL")
					}, {
						id : 'rMenu2',
						text : '添加此材料到材料库',
						hidden : compareAuth("VIP_ASK_REP_ADDMAT"),
						handler : addtTomat
					}]
		});

// 创建回复窗口
function add_win() {
	var stuff = new Ext.data.ArrayStore({
		fields : ['value', 'text'],
		data : Ext.stuff.code
			// from stuff.js
		});

	fs = new Ext.form.FormPanel({
		title : "",
		labelAlign : 'left',
		labelWidth : 80,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : parent.Ext.fly('tab_ask_info_vip_iframe').getHeight() / 2,
		layoutConfig : {
			columns : 2
		},
		bodyStyle : 'padding:6px',
		labelAlign : 'right',
		items : [{
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "材料名称",
				id : "name",
				name : "name",
				maxLength : 100,
				allowBlank : false,
				value : askinfo["name"]
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "规格型号",
				id : "spec",
				maxLength : 200,
				name : "spec",
				value : askinfo["spec"]
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "单    位",
				id : "unit",
				name : "unit",
				maxLength : 18,
				value : askinfo["unit"]
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "numberfield",
				width : 200,
				fieldLabel : "数    量",
				id : "amount",
				name : "amount",
				minValue : 0,
				allowNegative : false,
				value : askinfo["amount"]
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "numberfield",
				width : 200,
				fieldLabel : "信 息 价",
				id : "priceGov",
				name : "priceGov",
				minValue : 0,
				allowNegative : false
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "numberfield",
				width : 200,
				fieldLabel : "厂商报价",
				id : "priceFac",
				name : "priceFac",
				minValue : 0,
				allowNegative : false
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "numberfield",
				width : 200,
				fieldLabel : "建 议 价",
				id : "priceAdv",
				name : "priceAdv",
				minValue : 0,
				allowNegative : false
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "供 应 商",
				id : "supplier",
				maxLength : 50,
				allowBlank : false,
				name : "fname"
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "品    牌",
				id : "brand",
				maxLength : 20,
				name : "brand"
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "产    地",
				id : "addr",
				maxLength : 20,
				name : "addr"
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textfield",
				width : 200,
				fieldLabel : "材料编码",
				id : "code",
				maxLength : 10,
				name : "code"
			}
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : sck = new Ext.form.ComboBox({
						fieldLabel : "材料分类",
						width : 200,
						store : stuff,
						emptyText : "请选择",
						mode : "local",
						triggerAction : "all",
						valueField : "value",
						displayField : "text",
						hiddenName : "stuffcode",
						readOnly : true,
						value : 1,
						allowBlank : false
					})
		}, {
			layout : 'form',
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : new Ext.form.DateField({
						name : "issueDate",
						fieldLabel : "发布日期",
						id : "issueDate",
						format : "Y-m-d",
						width : 200,
						emptyText : "请选择",
						readOnly : true,
						allowBlank : false
					})
		}, {
			layout : 'table',
			layoutConfig : {
				columns : 6
			},
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',

			items : [{
						border : false,
						width : 85,
						html : "&nbsp;"
					}, {
						xtype : 'checkbox',
						boxLabel : "含税费",
						name : "tax",
						inputValue : "1"
					}, {
						border : false,
						width : 10,
						html : "&nbsp;"
					}, {
						xtype : 'checkbox',
						boxLabel : "含运费",
						name : "carriage",
						inputValue : "1"
					}, {
						border : false,
						width : 10,
						html : "&nbsp;"
					}, {
						xtype : 'checkbox',
						boxLabel : "含采保费",
						name : "keepFee",
						inputValue : "1"
					}]

		}, {
			layout : 'form',
			colspan : 2,
			bodyStyle : 'border:none;white-space: normal;word-break: break-all;overflow: hidden;',
			items : {
				xtype : "textarea",
				width : 490,
				fieldLabel : "备    注",
				id : "notes",
				maxLength : 400,
				name : "notes",
				value : "您好，以上价格仅供您参考，谢谢！"
			}
		}]

	});
	win = new Ext.Window({
				title : '添加回复',
				closable : true,
				draggable : true,
				autoscroll : true,
				scrollIntoView : true,
				width : 660,
				autoHeight : true,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				maximizable : true,
				closeAction : "close",
				items : [fs],
				buttons : [{
							xtype : "checkbox",
							boxLabel : "连续添加",
							id : "continue_add"
						}, {
							text : '添加',
							handler : add_reply
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();

};

function init() {
	buildAskinfo();
};
Ext.onReady(function() {
			init();
			Ext.QuickTips.init();
		});

// 删除回复
function del_reply() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request("post",
								"/ep/EpResponsePriceServlet?method=delete", {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")")
										if (getState(data.state,
												commonResultFunc, data.result)) {
											Ext.MessageBox.alert("提示",
													"回复删除成功。");
											ds.reload();

											ids = [];
										}
									}
								}, "id=" + ids.toString());
					}
				})
	} else
		Ext.MessageBox.alert("提示", "请点击回复信息。");
};

// 添加材料到材料库
function addtTomat() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		if (!rows[0].get("priceFac")) {
			Ext.MessageBox.alert("提示", "此回复没有厂商报价，无法添加到材料库");
			return;
		}
		Ext.lib.Ajax.request("post",
				"/ep/EpResponsePriceServlet?method=addToMaterialLib", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")")
						if (getState(data.state, commonResultFunc, data.result)) {
							Ext.MessageBox.alert("提示", "材料添加成功。");
							ids = [];
						}
					}
				}, "id=" + ids.toString());
	} else
		Ext.MessageBox.alert("提示", "请点击回复信息。");
};

// 提交回复
function add_reply() {
	if (fs.getForm().isValid()) {
		var name = Ext.fly("name").getValue();
		var spec = Ext.fly("spec").getValue();
		var uunit = Ext.fly("unit").getValue();
		var amount = Ext.fly("amount").getValue();
		var govprice = Ext.fly("priceGov").getValue();

		var facprice = Ext.fly("priceFac").getValue();

		var advprice = Ext.fly("priceAdv").getValue();

		var supplier = Ext.fly("supplier").getValue();
		var brand = Ext.fly("brand").getValue();

		var addr = Ext.fly("addr").getValue();

		var cid = Ext.fly("stuffcode").getValue();

		var code = Ext.fly("code").getValue();

		var issueDate = Ext.fly("issueDate").getValue();
		var tax = fs.getForm().findField('tax').getValue() == true ? 1 : "";

		var carriage = fs.getForm().findField('carriage').getValue() == true
				? 1
				: "";

		var keepFee = fs.getForm().findField('keepFee').getValue() == true
				? 1
				: "";

		var notes = Ext.fly("notes").getValue();

		if (advprice && facprice) {
			if (advprice / facprice >= 10) {
				Ext.MessageBox.alert("提示", "建议价比厂商报价高出太多，请重新填写建议价");
				return;
			}
		}

		Ext.lib.Ajax.request("post", "/ep/EpResponsePriceServlet?method=add", {
					success : function(response) {
						var data = eval("(" + response.responseText + ")")
						if (getState(data.state, commonResultFunc, data.result)) {
							Ext.MessageBox.alert("提示", "回复添加成功。");
							ds.reload();
							ids = [];
							if (Ext.fly("continue_add").dom.checked == false) {
								win.close();
							}
						}
					}
				}, encodeURI("content=rid~" + selectinfo + ";name~" + name
						+ ";spec~" + spec + ";unit~" + uunit + ";priceGov~"
						+ govprice + ";amount~" + amount + ";priceFac~"
						+ facprice + ";priceAdv~" + advprice + ";fname~"
						+ supplier + ";brand~" + brand + ";cid~" + cid
						+ ";code~" + code + ";issueDate~" + issueDate + ";tax~"
						+ tax + ";carriage~" + carriage + ";keepFee~" + keepFee
						+ ";addr~" + addr + "&notes=" + notes));
	} else
		Info_Tip();

};
