var grid_info, ds_info, ds_mem, area_win, fs, query_fs, sel_combo;
var area, area1, area2, highContent = {};

var ds_temp;
var tree, root;
var email_grid;
var emailWin = null;

var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = ["全部城市"];

Ext.onReady(init);
function init() {
	// buildPanel();
	getPersonConfig();

};
var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var personConfig;
// 右键菜单
var tbar = [{
			text : '打开',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("MEM_VIEW"),
			handler : openInfo
		}, {
			text : '锁定',
			icon : "/resource/images/lock.png",
			hidden : compareAuth("MEM_LOCK"),
			handler : lockfun
		}, {
			text : '关联商铺',
			icon : "/resource/images/house_link.png",
			hidden : compareAuth("MEM_MOD"),
			handler : showEmpAction
		}, {
			text : '设置软件',
			icon : "/resource/images/computer_go.png",
			hidden : compareAuth("MEM_MOD"),
			handler : showSoftWare
		}, {
			text : '续期',
			icon : "/resource/images/table_multiple.png",
			hidden : compareAuth("MEM_RENEW"),
			handler : showKeep
		}, {
			text : '审核',
			icon : "/resource/images/tick.png",
			hidden : compareAuth("MEM_AUDIT"),
			handler : showPas
		}, {
			text : "修改会员访问站点",
			icon : '/resource/images/world_edit.png',
			hidden : compareAuth("MEM_AREA"),
			tooltip : '修改会员网站的访问权限',
			handler : changeUserArea
		}, {
			text : "导出",
			icon : '/resource/images/page_excel.png',
			hidden : compareAuth("MEM_EXPORT"),
			handler : exportExcel
		}, {
			text : '重设会员密码',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/group.png',
			hidden : compareAuth("MEM_RESETPWD"),
			handler : setmemberpwd
		}, {
			text : '发送邮件',
			icon : '/resource/images/email_go.png',
			handler : showEmailWin,
			hidden : compareAuth('EMAIL_TEMP_SEND')
		}, {
			text : '定制搜索条件',
			icon : "/resource/images/keyboard_magnify.png",
			handler : jumpToconfig
		}, {
			text : '设置积分',
			icon : "/resource/images/edit.gif",
			handler : showType,
			hidden : compareAuth('SCORE_RECORD_ADD')
		}, {
			text : '兑换奖品',
			icon : "/resource/images/ruby_add.png",
			handler : showPrizeWin,
			hidden : compareAuth('SCORE_GOODS_ADD')
		}, {
			text : '积分清零',
			icon : "/resource/images/ruby_delete.png",
			handler : showPromptWin,
			hidden : compareAuth('MEM_SCORE_RESET')
		}];
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : tbar
		});

function buildGirid() {
	var webArea = "";
	if (parent.currUser_mc.webProvince.indexOf(",") != -1) {
		webArea = parent.currUser_mc.webProvince.split(",")[0];
	} else
		webArea = parent.currUser_mc.accessStie;
	if (webArea == "ALL") {
		webArea = '';
	}
	ds_mem = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : fac_type_combox
			});
	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/mc/Member.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","eid","memberID","memberType","degree","trueName","corpName","createOn","validDate","province","city","loginNum","lastTime","webProvince","webArea","score","ipAddr"]),
				baseParams : {
					method : "searchPaged",
					pageNo : 1,
					validDate : 0,
					memberType : 1,
					province : webArea,
					pageSize : 20,
					content : '',
					diff : '',
					degree : ''
				},
				countUrl : '/mc/Member.do',
				countParams : {
					method : "searchCount",
					isvoid : 1
				},
				remoteSort : true
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	query_fs = new Ext.FormPanel({
				title : '',
				bodyStyle : 'border:none;',
				items : [{
							layout : 'column',
							bodyStyle : 'border:none;background-color:#D1DFF0',
							items : [{
										xtype : "radio",
										boxLabel : "有效会员",
										inputValue : "1",
										name : "memType"
									}, {
										xtype : "radio",
										boxLabel : "过期会员",
										inputValue : "-1",
										name : "memType"
									}, {
										xtype : "radio",
										boxLabel : "所有会员",
										inputValue : "0",
										name : "memType",
										checked : true
									}]
						}]
			});
	var sel_type = new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [["memberID", "会员ID"], ["trueName", "会员名称"],
						["corpName", "公司名称"], ["regProvince", "注册地区"]]
			});
	grid_info = new Ext.grid.GridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '会员ID',
							sortable : false,
							dataIndex : 'memberID'
						}, {
							header : 'eid',
							sortable : false,
							dataIndex : 'EID',
							hidden : true
						}, {
							header : '会员类型',
							sortable : false,
							dataIndex : 'degree',
							renderer : showDegree
						}, {
							header : '会员名称',
							sortable : true,
							dataIndex : 'trueName'
						}, {
							header : '公司名称',
							sortable : true,
							dataIndex : 'corpName'
						}, {
							header : '所属城市',
							sortable : true,
							renderer:function(value,meta,record){
								var province = record.get("province");
								var city = record.get("city");
								if(province == null){
									return "";
								}
								return province + " " + city;
							}
						},{
							header : "登录次数",
							sortable : true,
							width : 70,
							dataIndex : "loginNum"
						}, {
							header : "积分",
							sortable : true,
							dataIndex : "score"
						},{
							header : "注册日期",
							sortable : true,
							dataIndex : "createOn"
						}, {
							header : "有效期限",
							sortable : true,
							dataIndex : "validDate"
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "grid_list_info"
			});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [{
							xtype : 'combo',
							id : 'province',
							store : pro,
							value:'全部省份',
							triggerAction : 'all',
							readOnly : true,
							width : 90,
							listeners : {
								select : function(combo, record, index) {
									var province = combo.getValue();
									if(province == "全部省份") {
										city = ["全部城市"];
									}else{
										city = zhcn.getCity(province).concat();;
										city.unshift("全部城市");
									}
									
									Ext.getCmp('city').store.loadData(city);
									Ext.getCmp('city').setValue("全部城市");
									Ext.getCmp('city').enable();
								}
							}
						}, 
							{
							xtype : 'combo',
							id : 'city',
							store : city,
							value:"全部城市",
							triggerAction : 'all',
							emptyText : '请选择城市',
							width : 120,
							readOnly : true
						},{
					id : 'info_type',
					name : 'info_type',
					hiddenName : "info_type_input",
					fieldLabel : '会员类型',
					store : ds_mem,
					typeAhead : true,
					mode : 'local',
					triggerAction : 'all',
					emptyText : '请选择用户角色',
					valueField : "value",
					displayField : "text",
					readOnly : true,
					xtype : "combo",
					value : "",
					width : 80
				}, "-", sel_combo = new Ext.form.ComboBox({
							store : sel_type,
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							displayField : "text",
							value : "memberID",
							width : 80

						}), "-", {
					xtype : "textfield",
					id : "search_input",
					width : 130,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}, query_fs, "-", "搜索器:", {
					xtype : 'combo',
					width : 110,
					store : personConfig,
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					listeners : {
						"select" : function(combo) {
							ds_info.baseParams = {};
							ds_info.baseParams = {
								method : "searchPaged",
								pageNo : 1,
								memberType : 1,
								province : webArea,
								pageSize : 20
							};
							var obj = decodeSearchcontent(combo.getValue());
							ds_info.baseParams["province"] = obj[0]["province"];
							ds_info.baseParams["degree"] = obj[0]["degree"] == undefined
									? ""
									: obj[0]["degree"];
							ds_info.baseParams["content"] = obj[2].replace(
									/=/g, "~").replace(/;;/g, ";");
							ds_info.baseParams["diff"] = obj[0]["diff"];

							if (!Ext.isEmpty(obj[0]["diff"]))
								ds_info.baseParams["validDate"] = "0";
							else
								ds_info.baseParams["validDate"] = obj[0]["isvoid"];
							ds_info.load();
						}
					}
				}]
	});

	ds_info.load();
	grid_info.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				openInfo();
			});
	/*
	 * grid_info.on("cellclick", function(grid_info, rowIndex, columnIndex, e) {
	 * if (columnIndex == 6) { var record =
	 * grid_info.getStore().getAt(rowIndex); // 返回Record对象 var fieldName =
	 * grid_info.getColumnModel() .getDataIndex(columnIndex); // 返回字段名称 var eid =
	 * record.get("EID"); window.parent .createNewWidget("enterprise_edit",
	 * '修改企业信息', '/module/enterprise/enterprise_edit.jsp?eid=' + eid); } });
	 */
};

// 查询
function searchlist() {
	var temp_query = "";
	var mem_type = Ext.fly("info_type_input").getValue();
	var val_type = query_fs.form.findField('memType').getGroupValue();
	ds_info.baseParams = {};
	ds_info.baseParams = {
		method : "searchPaged",
		pageNo : 1,
		memberType : 1,
		accessStie : webArea,
		pageSize : 20
	};
	
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		temp_query += "province~" + Ext.getCmp("province").getValue() + ";";
		if(city != "全部城市"){
			temp_query += ";city~" + Ext.getCmp("city").getValue()+";";
		}
	}
	
	temp_query += "query_type~" + sel_combo.getValue() + ";";
	temp_query += "query_input~" + Ext.fly("search_input").getValue() + ";";
	ds_info.baseParams["degree"] = mem_type;
	ds_info.baseParams["content"] = temp_query;
	ds_info.baseParams["validDate"] = val_type;
	ds_info.load();
};

// 修改会员区域
function changeUserArea() {
	var sels = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	fs = new Ext.FormPanel({
				title : "",
				bodyStyle : "padding:8px",
				layout : "table",
				labelWidth : 10,
				labelAlign : "left",
				layoutConfig : {
					columns : 4
				},
				items : Sites_checkbox()
			});
	area_win = new Ext.Window({
				title : '访问站点选择',
				closable : true,
				draggable : true,
				width : 600,
				height : parseInt(parent.Ext.get("tab_0202_iframe").getHeight())
						/ 2,
				modal : true,
				border : false,
				plain : true,
				layout : 'fit',
				closeAction : "close",
				items : [fs],
				buttons : [{
							xtype : "label",
							text : "全部"
						}, {
							xtype : "checkbox",
							id : "sel_all",
							inputValue : "全部",
							handler : takeall
						}, {
							text : "确定",
							handler : submitArea
						}]
			});
	area_win.show();
	fillCheck()
};

// 全选
function takeall() {
	Ext.select("input[name=area]").each(function(el) {
				Ext.getDom(el).checked = Ext.fly("sel_all").dom.checked;
			});
};
// 填充访问区域勾选
function fillCheck() {
	var sels = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	var mid = sels.get("memberID");
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=getMem", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						if (jsondata.result.accessSite == "ALL") {
							Ext.select("input[name=curSite]").each(
									function(el) {
										Ext.getDom(el).checked = "checked";
									});
							return;
						}
						var temp = jsondata.result.accessSite.split(",");
						Ext.select("input[name=curSite]").each(function(el) {
									if (temp.indexOf(el.dom.value) != -1) {
										Ext.getDom(el).checked = "checked";
									}
								});
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "mid=" + sels.get("memberID"))

};
// 导出
function exportExcel() {
	var sels = grid_info.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	var query_type = sel_combo.getValue();
	temp_query = query_type + "~";
	if (Ext.isEmpty(ds_info.baseParams["diff"])) {
		window.document.exportform.action = "/mc/Member.do?method=export&ids="
				+ mids.toString() + "&memberType=0&degree="
				+ ds_info.baseParams["degree"] + "&validDate="
				+ ds_info.baseParams["validDate"]+ "&site_sel="
				+ ds_info.baseParams["site_sel"];
	} else {
		window.document.exportform.action = "/mc/Member.do?method=export&ids="
				+ mids.toString() + "&memberType=0&degree="
				+ ds_info.baseParams["degree"] + "&validDate="
				+ ds_info.baseParams["validDate"]+ "&site_sel="
				+ ds_info.baseParams["site_sel"] + "&diff="
				+ ds_info.baseParams["diff"];
	}
	Ext.get("content").value = ds_info.baseParams["content"];
	document.getElementById("content").value = ds_info.baseParams["content"];
	
	window.document.exportform.submit();
	highContent = {};
};

// 打开
function openInfo() {
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择会员");
		return;
	}
	var id = row.get("memberID");
	window.parent.createNewWidget("member_info", '会员信息',
			'/module/member/member_info.jsp?id=' + id);
};

// 锁定
function lockfun() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择会员");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("memberID"));
	}
	Ext.Msg.confirm("提示", "您确定要锁定该会员吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", "/mc/Member.do?method=lock", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("锁定会员成功");
										ds_info.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "mid=" + ids.toString());
				}
			});

};
// 提交区域选择
function submitArea() {
	var e = [];
	e = decodeURI(fs.getForm().getValues(true).replace(/&/g, "").replace(
			"curSite=", "")).split("curSite=");
	var sels = grid_info.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	if (e == "") {
		Info_Tip("请选择一个地区。");
		return;
	}
	// if (Ext.fly("sel_all").dom.checked == true)
	// e = "全国";
	Ext.Msg.confirm("提示", "您确定要修改选中会员访问区域吗?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post",
							"/mc/Member.do?method=modWebArea", {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("修改区域成功");
										area_win.close();
										ds_info.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "accessSite=" + e + "&id=" + mids.toString());
				}
			});
};

// 获得统计数据
function getTotal() {
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=getTotal", {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						$("#send_mem").html(jsondata.result["degree_4"]);
						$("#new_come").html(jsondata.result["degree_12"]);
						$("#try_mem").html(jsondata.result["degree_2"]);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "type=1");
};

// 导出返回提示
function getResult(flag, info) {
	if (!flag) {
		Warn_Tip(info);
	}
};

// 续期区域
function showKeep() {
	var sels = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	
	win = new Ext.Window({
				title : "续期",
				width : 400,
				height : 130,
				closable : true,
				draggable : true,
				modal : true,
				border : false,
				plain : true,
				layout : 'form',
				closeAction : "close",
				buttonAlign : 'center',
				items : [{
					xtype : "combo",
					store : new Ext.data.SimpleStore({
								fields : [{
											name : 'value'
										}, {
											name : 'text'
										}],
								data : [['0', '有效日期'], ['1', '有效天数']]
							}),
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					valueField : "value",
					displayField : "text",
					emptyText : '请选择续期类型',
					fieldLabel : "类型选择",
					value : '0',
					listeners : {
						select : function(ComboBox, record) {
							if (record.get('value') == '1') {

								Ext.fly("day_area").setVisible(true);
								Ext.fly("date_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("date_area").setVisible(false);
							} else {
								Ext.fly("day_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("day_area").setVisible(false);
								Ext.fly("date_area").setVisible(true);
							}
						}
					}
				}, {
					id : "date_area",
					layout : 'table',
					layoutConfig : {
						columns : 2
					},
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								layout : "form",
								bodyStyle : "border:none;background-color:#CED9E7",
								items : [{
											xtype : 'datefield',
											emptyText : '请选择日期',
											fieldLabel : "有效日期",
											format : 'Y-m-d',
											name : 'validDate',
											id : "date_y",
											readOnly : true
										}]
							}, {
								xtype : 'label',
								html : '<font color="red">(不包含此日期)</font>'
							}]
				}, {
					id : "day_area",
					layout : "form",
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								xtype : 'textfield',
								emptyText : '请输入天数',
								name : 'addDays',
								fieldLabel : "有效天数",
								allowBlank : false,
								id : "day_y"
							}]
				}],
				buttons : [{
							text : "续期",
							handler : keepOp
						}, {
							text : "取消",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
	Ext.fly("day_area").setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly("day_area").setVisible(false);
};

// 审核区域
function showPas() {
	var sels = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}
	var mem_type_ds = new Ext.data.SimpleStore({
				fields : [{
							name : 'value'
						}, {
							name : 'text'
						}],
				data : [['2', '试用厂商会员'], ['4', '正式厂商会员']]

			});
	win = new Ext.Window({
		title : "审核",
		width : 360,
		height : 160,
		closable : true,
		draggable : true,
		modal : true,
		border : false,
		plain : true,
		layout : 'form',
		closeAction : "close",
		buttonAlign : 'center',
		items : [{
					xtype : "combo",
					store : mem_type_ds,
					mode : 'local',
					id : 'mem_type',
					name : 'degree',
					triggerAction : 'all',
					readOnly : true,
					valueField : "value",
					displayField : "text",
					fieldLabel : "信息会员类型",
					hiddenName : 'degree_input',
					emptyText : '请选择信息会员类型'
				}, {
					xtype : "combo",
					id : 'pass_type',
					store : new Ext.data.SimpleStore({
								fields : [{
											name : 'value'
										}, {
											name : 'text'
										}],
								data : [['0', '有效日期'], ['1', '有效天数']]
							}),
					mode : 'local',
					triggerAction : 'all',
					readOnly : true,
					valueField : "value",
					displayField : "text",
					fieldLabel : "审核类型",
					emptyText : '请选择审核类型',
					value : '0',
					listeners : {
						select : function(ComboBox, record) {
							if (record.get('value') == '1') {

								Ext.fly("day_area").setVisible(true);
								Ext.fly("date_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("date_area").setVisible(false);
							} else {
								Ext.fly("day_area")
										.setVisibilityMode(Ext.Element.DISPLAY);
								Ext.fly("day_area").setVisible(false);
								Ext.fly("date_area").setVisible(true);
							}
						}
					}
				}, {
					id : "date_area",
					layout : 'table',
					layoutConfig : {
						columns : 2
					},
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								layout : "form",
								bodyStyle : "border:none;background-color:#CED9E7",
								items : [{
											xtype : 'datefield',
											emptyText : '请选择日期',
											format : 'Y-m-d',
											fieldLabel : "有效日期",
											name : 'validDate',
											id : "date_i",
											readOnly : true
										}]
							}, {
								xtype : 'label',
								html : '<font color="red">(不包含此日期)'
							}]
				}, {
					id : "day_area",
					layout : "form",
					bodyStyle : "border:none;background-color:#CED9E7",
					items : [{
								xtype : 'textfield',
								emptyText : '请输入天数',
								name : 'addDays',
								fieldLabel : "有效天数",
								allowBlank : false,
								id : "day_i"

							}]
				}],
		buttons : [{
					text : "审核",
					handler : passOp
				}, {
					text : "取消",
					handler : function() {
						win.close();
					}
				}]
	});
	win.show();
	Ext.fly("day_area").setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly("day_area").setVisible(false);
};

// 续期提交
function keepOp() {
	var query = "";
	var addDays = Ext.fly('day_y').getValue();
	var valdate = Ext.fly('date_y').getValue();
	var rows = grid_info.getSelectionModel().getSelections();
	
	if (addDays == "请输入天数") {
		if (valdate == "请选择日期") {
			Info_Tip("请输入日期");
			return;
		}
		query = "validDate=" + valdate;
	}

	if (valdate == "请选择日期") {
		if (addDays == "请输入天数") {
			Info_Tip("请输入天数");
			return;
		}
		query = "addDays=" + addDays;
	}
	
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("memberID"));
	}

	Ext.lib.Ajax.request("post", "/mc/Member.do?method=renewal&mid=" + ids.toString(), {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succpass);
						win.close();
						window.parent.tab_0202_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};

// 审核提交
function passOp() {
	var query
	var addDays = Ext.fly('day_i').getValue();
	var valdate = Ext.fly('date_i').getValue();
	var degree = Ext.fly("degree_input").getValue();
	var sels = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择会员");
		return;
	}
	var mid = sels.get("memberID");
	if (Ext.isEmpty(degree)) {
		degree = mem_degree;
	}
	if (addDays == "请输入天数") {
		if (valdate == "请选择日期") {
			Info_Tip("请输入日期");
			return;
		}
		query = "degree=" + degree + "&validDate=" + valdate;
	}

	if (valdate == "请选择日期") {
		if (addDays == "请输入天数") {
			Info_Tip("请输入天数");
			return;
		}
		query = "degree=" + degree + "&addDays=" + addDays;
	}
	Ext.lib.Ajax.request("post", "/mc/Member.do?method=audit&mid=" + mid, {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip(opMsg.succpass);
						win.close();
						window.parent.tab_0202_iframe.ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, query);
};

function jumpToconfig() {
	parent.createNewWidget("person_search_config", "会员搜索设置",
			"/module/person/person_search_config.jsp", false);
};

// 重设密码
// 重设会员密码窗口
function setmemberpwd() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择一个会员。");
		return;
	}
	if (rows.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一条信息");
		return;
	}
	Ext.Msg.confirm("确认操作", "您确认要重设该会员密码吗？", function(op) {
				if (op == "yes")
					setpwd(rows[0].get("memberID"));
			})
};
function setpwd(mid) {
	Ext.lib.Ajax.request("post", "/mc/Member.do", {
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("新密码已经发送到注册邮箱。");
					}
				},
				failure : function(response) {
					Warn_Tip();
				}
			}, "method=resetPWD&mid=" + mid);
};

// 获得个人配置
function getPersonConfig() {
	Ext.Ajax.request({
				url : '/mc/MemberProfileServlet',
				params : {
					type : 6,
					cid : 2,
					site : 'MC'
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						var len = jsondata.result.length;
						var temp = [];
						for (var i = 0; i < len; i++) {
							temp
									.push("['" + jsondata.result[i]["content"]
											+ "','"
											+ jsondata.result[i]["name"] + "']");
						}
						temp = eval("[" + temp + "]");
						personConfig = new Ext.data.SimpleStore({
									fields : ['value', 'text'],
									data : temp
								});
						buildGirid();
					}
				},
				failure : function() {
					Warn_Tip();
				}

			});
};

// 创建模板树
function buildTree() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '邮件分类'
			});
	tree = new Ext.tree.TreePanel({
				title : '邮件分类',
				root : root,
				autoScroll : true,
				enableDrag : false,
				animate : true,
				containerScroll : true,
				border : false,
				listeners : {
					"click" : function(node, e) {
						ds_temp.baseParams["cid"] = node.id;
						ds_temp.load();
					}
				}

			});
	changeTemplage();
};

// 模板内容切换
function changeTemplage() {
	tree.loader = new Ext.tree.TreeLoader({
				dataUrl : '/email/EmailType.do?type=1',
				params : {
					node : 0
				}
			});
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth" || o.state == "nologin") {
				Ext.MessageBox.alert('提示', o.result);
				o = [];
			}
			node.beginUpdate();
			for (var i = 0, len = o.length; i < len; i++) {

				o[i].text = o[i].name;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [node]);
		} catch (e) {
			this.handleFailure(response);
		}
	};
	root.reload();
	root.expand();
	root.select();
};
// 建立模板内容列表
function buildNodeContent() {
	ds_temp = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailTemplateServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', 'cname', "content", "createBy", "createOn",
								"subject", "id", "updateBy", "updateOn"]),
				baseParams : {
					type : 5,
					cid : 1,
					content : 'isLock~0'
				},
				countUrl : '/email/EmailTemplateServlet',
				countParams : {
					type : 6
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds_temp,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'

			});
	email_grid = new Ext.grid.EditorGridPanel({
				title : '邮件模版',
				store : ds_temp,
				autoWidth : true,
				autoHeight : true,
				autoScroll : true,
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				columns : [sm, new Ext.grid.RowNumberer(), {
							header : '名称',
							sortable : true,
							width : 200,
							dataIndex : 'name'
						}, {
							header : '邮件分类名称',
							sortable : true,
							dataIndex : 'cname',
							width : 100
						}/*
							 * , { header : '添加时间', sortable : true, dataIndex :
							 * 'createOn', renderer : trimDate, width : 60 }, {
							 * header : '添加人', dataIndex : 'createBy', width :
							 * 60 }, { header : '修改时间', sortable : true,
							 * dataIndex : 'updateOn', renderer : trimDate,
							 * width : 60 }, { header : '修改人', sortable : true,
							 * dataIndex : 'updateBy', width : 60 }
							 */, {
							header : 'id',
							sortable : true,
							dataIndex : 'id',
							hidden : true
						}],
				border : false,
				selModel : new Ext.grid.RowSelectionModel(),
				bbar : pagetool
			});
	ds_temp.load();
};

function buildEmailWin() {
	buildTree();
	buildNodeContent();
	eid_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "id"]),
				baseParams : {
					type : 9
				},
				remoteSort : true
			});
	eid_ds.load();
	emailWin = new Ext.Window({
				title : '发送邮件',
				border : false,
				width : 650,
				height : 400,
				autoScroll : true,
				layout : 'table',
				modal : true,
				frame : true,
				resizable : false,
				closeAction : 'hide',
				layoutConfig : {
					columns : 2
				},
				items : [new Ext.Panel({
									region : 'center',
									autoScroll : true,
									id : 'center_area',
									width : 258,
									height : 330,
									split : true,
									items : tree
								}), new Ext.Panel({
									autoScroll : true,
									region : "east",
									split : true,
									width : 380,
									height : 330,
									items : [email_grid]
								})],
				buttons : [{
							xtype : 'label',
							text : '发送邮件帐户：'
						}, {
							xtype : 'combo',
							id : 'eid',
							store : eid_ds,
							triggerAction : "all",
							valueField : 'id',
							readOnly : true,
							displayField : 'name',
							emptyText : '请选择'
						}, {
							text : '确定',
							handler : sendEmail
						}, {
							text : '取消',
							handler : function() {
								emailWin.hide();
							}
						}]
			});
};
function showEmailWin() {
	var mem_rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(mem_rows)) {
		Ext.MessageBox.alert("提示", "请选择会员");
		return;
	}
	if (!emailWin)
		buildEmailWin();
	emailWin.show();
};
function sendEmail() {
	var email_temp = email_grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(email_temp)) {
		Ext.MessageBox.alert("提示", "请选择模版");
		return;
	}
	var eid = Ext.getCmp('eid').getValue();
	if (eid == "") {
		Ext.MessageBox.alert("提示", "请选择发送邮件帐户");
		return;
	}
	var email_temp_id = email_temp.get("id");
	Ext.Msg.confirm("提示", "您是否要向已选中的会员发送邮件?", function(op) {
				if (op == "yes") {
					var mem_rows = grid_info.getSelectionModel()
							.getSelections();
					if (Ext.isEmpty(mem_rows)) {
						Ext.MessageBox.alert("提示", "请选择会员");
						return;
					}
					var mem_ids = [];
					for (var i = 0; i < mem_rows.length; i++) {
						mem_ids.push(mem_rows[i].get("memberID"));
					}
					Ext.Ajax.request({
								url : '/email/EmailTemplateServlet',
								params : {
									type : 7,
									mid : mem_ids.toString(),
									eid : Ext.getCmp('eid').getValue(),
									id : email_temp_id
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										Info_Tip("邮件已发送...");
										emailWin.hide();
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							});
				}
			});
};

// 显示关联企业窗口
function showEmpAction() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择会员。");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("memberID"));
	}
	emp_ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", /*"fname", "type",*/ "area",
								"createOn"]),
				baseParams : {
					page : 1,
					type : 12,
					content : '',
					diyCondition : "isLock=0 and isAudit=1",
					pageSize : 20
				},
				countUrl : '/ep/EpShopServlet',
				countParams : {
					type : 13
				},
				remoteSort : true
			});
	emp_ds.setDefaultSort('createOn', 'DESC');
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id',
				singleSelect : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : emp_ds,
				displayInfo : true,
				pageSize : 20
			});
	emp_grid = new Ext.grid.GridPanel({
				store : emp_ds,
				autoWidth : true,
				height : parent.Ext.fly('tab_0202_iframe').getHeight() / 2,
				autoScroll : true,
				stripeRows : true,
				loadMask : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						},/* {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						},*/ {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				tbar : [/*new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									store : emp_type_array,
									id : 'query_type_val',
									triggerAction : "all",
									width : 80
								}), "-",*/ ck = new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									id : 'query_con_val',
									store : [['eid', '企业ID'], ['name', '企业名称'],
											 ['area', '所在地区']],
									triggerAction : "all",
									width : 80,
									value : 'name'
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							width : 220,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist_emp();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist_emp
						}]
			});
	emp_win = new Ext.Window({
				title : '关联企业',
				modal : true,
				width : 800,
				autoHeight : true,
				items : emp_grid,
				buttons : [{
							text : '关联企业',
							handler : function() {
								linkEmp(ids);
							}
						}, {
							text : '关闭',
							handler : function() {
								emp_win.close();
							}
						}]
			});
	emp_win.show();
	emp_ds.load();
	emp_grid.on("rowdblclick", function(grid, rowIndex, r) {
				empDetail();
			});
};
function empDetail() {
	var row = emp_grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	var eid = row.get("eid");
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?id=' + thisid + '&eid='
					+ eid);
};
function searchlist_emp() {
	var query = Ext.getCmp("query_con_val").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	emp_ds.baseParams["content"] = query;
	emp_ds.load();
};

function linkEmp(ids) {
	var row = emp_grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一个企业。");
		return;
	}
	Ext.Ajax.request({
				url : '/ep/EpMemberServlet',
				params : {
					type : 8,
					memberID : ids.toString(),
					eid : row.get('eid')
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Info_Tip("与<font style='color:red'>" + row.get('name')
								+ "</font>关联成功。");
						emp_win.close();
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};
// 显示设置软件
function showSoftWare() {
	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择会员。");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("memberID"));
	}
	fs = new Ext.FormPanel({
				autoWidth : true,
				height : 80,
				bodyStyle : 'padding:6px;',
				layout : 'form',
				labelWidth : 60,
				labelAlign : 'right',
				items : [{
							xtype : 'combo',
							fieldLabel : '软件名称',
							store : soft_Ware,
							triggerAction : 'all',
							id : 'soft_name',
							allowBlank : false
						}]
			});
	win = new Ext.Window({
				title : '设置软件使用权限',
				width : 400,
				autoHeight : true,
				items : fs,
				buttons : [{
							text : '设置',
							handler : function() {
								setSoft(ids);
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

// 设置软件
function setSoft(mids) {
	if (fs.getForm().isValid()) {
		Ext.Ajax.request({
					url : '/mc/Member.do',
					params : {
						method : 'setAppType',
						appType : Ext.getCmp("soft_name").getValue(),
						mid : mids.toString()
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("软件使用设置成功。");
							ds_info.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};

//积分清零
function showPromptWin(){
	Ext.Msg.confirm("警告","您此次操作将导致所有的信息会员积分清零，继续请按确定，否则取消。",function(p){
	  	if(p=="yes"){
	  		Ext.Ajax.request({
	  			url:"/score/ScoreServlet",
	  			params:{
	  				type:13,
	  				memberType:'1'
	  			},
	  			success:function(response){
	  				Ext.Msg.alert('提示','操作成功！');
	  			},
	  			failure:function(){
	  				Ext.Msg.alert("提示","操作失败！");
	  			}
	  		})
	  	}
	  	else{
	  		return false;
	  	}
	});
}

// 判断显示窗口
function showType() {
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var form = new Ext.form.FormPanel({
				id : 'score_type',
				layout : 'form',
				frame : true,
				autoHeight : true,
				autoWidth : true,
				bodyStyle : 'padding:6px;',
				items : [{
							xtype : "radio",
							name : "score_type",
							boxLabel : '自定义规则',
							inputValue : '0'
						}, {
							xtype : "radio",
							name : "score_type",
							boxLabel : '手动操作规则',
							inputValue : '2'
						}]

			});
	var win = new Ext.Window({
				id : 'score_win_sel',
				title : '类型选择',
				width : 460,
				height : 140,
				layout : 'form',
				items : form,
				buttons : [{
							text : '确定',
							handler : function() {

								Ext.select("[name=score_type]").each(
										function(el) {
											if (el.dom.checked == true) {
												showScoreWin(el.dom.value, row);
												Ext.getCmp("score_win_sel")
														.close();
											}

										});
							}
						}]
			});
	win.show();
};

// 显示兑换窗口
function showPrizeWin() {
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/score/GoodsServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "name", "code", "score", "description",
								"createBy", "createOn", "updateBy", "updateOn",
								"photo"]),
				baseParams : {
					type : 5,
					pageSize : 10,
					pageNo : 1
				},
				countUrl : '/score/GoodsServlet',
				countParams : {
					type : 6
				},
				remoteSort : false
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true
			});
	var grid = new Ext.grid.GridPanel({
		id : 'grid_panel',
		autoWidth : true,
		height : Math
				.floor(parent.Ext.fly("tab_0202_iframe").getHeight() / 1.5)
				- 16,
		stripeRows : true,
		autoScroll : true,
		loadMask : true,
		store : store,
		viewConfig : {
			forceFit : true
		},
		bbar : pagetool,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : '奖品名称',
					sortable : true,
					dataIndex : 'name'
				}, {
					header : '奖品编号',
					sortable : true,
					dataIndex : 'code'
				}, {
					header : "积分数",
					sortable : true,
					dataIndex : "score"
				}, {
					header : "描述",
					sortable : true,
					dataIndex : "description"
				}],
		viewConfig : {
			forceFit : true
		},
		sm : sm,
		listeners : {
			"rowclick" : function(grid, rowIndex) {
				var data = grid.store.data.map[grid.store.data.keys[rowIndex]]["data"];
				Ext.getCmp("goods_form").getForm().setValues(data);
			}
		}
	});

	var form = new Ext.form.FormPanel({
				id : 'goods_form',
				bodyStyle : 'padding:6px;',
				autoWidth : true,
				height : Math.floor(parent.Ext.fly("tab_0202_iframe")
						.getHeight()
						/ 1.5),
				border : false,
				layout : 'column',
				items : [{
							columnWidth : 0.6,
							layout : 'form',
							items : grid
						}, {
							columnWidth : 0.3,
							layout : 'form',
							border : false,
							labelAlign : "right",
							labelWidth : 80,
							verticalAlign : "top",
							items : [{
										xtype : "textfield",
										id : 'memberID',
										name : 'memberID',
										fieldLabel : '会员ID',
										value : row.get("memberID"),
										autoWidth : true,
										readOnly : true
									}, {
										xtype : "textfield",
										id : 'eid',
										name : 'eid',
										fieldLabel : '企业ID',
										value : row.get("EID"),
										autoWidth : true,
										readOnly : true
									}, {
										xtype : "textfield",
										id : 'code',
										name : 'code',
										fieldLabel : '奖品编号',
										autoWidth : true,
										readOnly : true
									}, {
										xtype : "textfield",
										id : 'name',
										name : 'name',
										fieldLabel : '奖品名称',
										autoWidth : true,
										readOnly : true
									}, {
										xtype : "numberfield",
										id : 'score',
										name : 'score',
										fieldLabel : '兑换所需积分',
										autoWidth : true,
										readOnly : true
									}, {
										xtype : "numberfield",
										id : 'quantity',
										name : 'quantity',
										fieldLabel : '兑换数量',
										autoWidth : true,
										allowDecimals : false,
										allowBlank : false,
										minValue : 1,
										value : 1
									}]
						}]
			});
	var win = new Ext.Window({
				id : 'dh_win',
				title : '兑换奖品',
				width : Math.floor(parent.Ext.fly("tab_0202_iframe").getWidth()
						/ 1.5),
				autoHeight : true,
				modal : true,
				items : form,
				buttons : [{
							text : '兑换',
							handler : dhAction
						}]
			});
	win.show();
	store.load();
};

// 兑换操作
function dhAction() {
	var rowD = grid_info.getSelectionModel().getSelected();
	var scoreD = parseInt(rowD.get("score"));
	var form = Ext.getCmp("goods_form").getForm();
	if (form.isValid()) {
		var content = getDataPake_field(form, ["name", "code", "memberID",
						"eid","quantity"], "content");
		var score = parseInt(Ext.fly("score").getValue().trim())
				* parseInt(Ext.fly("quantity").getValue().trim());
		if (scoreD < score) {
			Info_Tip("该会员所拥有的积分不足以兑换该奖品。");
			return;
		}
		content += ";score~" + score;
		Ext.Ajax.request({
					url : "/score/ScoreServlet",
					params : {
						type : 5,
						content : content
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							Info_Tip("兑换成功", function() {
										ds_info.reload();
										Ext.getCmp("dh_win").close();
									});
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});

	} else
		Info_Tip();
};

// 显示记录窗口
function showScoreWin(v, row) {
	var form = null;
	switch (v) {
		case "0" :
			form = new Ext.form.FormPanel({
						id : 'form_add',
						bodyStyle : 'padding:6px;',
						layout : 'table',
						layoutConfig : {
							columns : 2
						},
						labelWidth : 80,
						labelAlign : "right",
						autoWidth : true,
						autoScroll : true,
						maxHeight : Math.floor(parent.Ext
								.fly("tab_0202_iframe").getHeight()
								/ 1.5),
						autoHeight : true,
						frame : true,
						items : [{
									layout : 'form',
									columnWidth : 0.5,
									items : [{
												xtype : "textfield",
												width : 260,
												id : 'memberID',
												name : 'memberID',
												fieldLabel : '会员ID',
												value : row.get("memberID"),
												readOnly : true
											}, {
												xtype : "textfield",
												width : 260,
												id : 'eid',
												name : 'eid',
												fieldLabel : '企业ID',
												value : row.get("EID"),
												readOnly : true
											}, {
												xtype : "numberfield",
												width : 260,
												id : 'addScore',
												name : 'score',
												allowBlank : false,
												fieldLabel : '增减分'
											}, {
												xtype : "textarea",
												width : 260,
												id : 'ruleName',
												allowBlank : false,
												fieldLabel : '规则说明'
											}, {
												xtype : 'hidden',
												id : 'ruleCode',
												name : 'code'
											}, {
												xtype : 'hidden',
												name : 'type',
												id : 'ruleType',
												value : "0"
											}]
								}]
					});
			break;
		case "2" :
			form = new Ext.form.FormPanel({
						id : 'form_add',
						bodyStyle : 'padding:6px;',
						layout : 'table',
						layoutConfig : {
							columns : 2
						},
						labelWidth : 80,
						labelAlign : "right",
						autoWidth : true,
						autoScroll : true,
						maxHeight : Math.floor(parent.Ext
								.fly("tab_0202_iframe").getHeight()
								/ 1.5),
						autoHeight : true,
						frame : true,
						items : [{
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												xtype : "combo",
												width : 164,
												id : 'ruleName_sel',
												allowBlank : false,
												fieldLabel : '规则名称',
												store : new Ext.data.SimpleStore(
														{
															fields : ["code",
																	"name"],
															data : []
														}),
												mode : 'local',
												triggerAction : 'all',
												valueField : 'code',
												displayField : 'name',
												forceSelection : true,
												editable : false,
												listeners : {
													"select" : function(combo) {
														getRuleInfo(combo.value);
													}
												}
											}, {
												xtype : "textfield",
												width : 164,
												id : 'eid',
												name : 'eid',
												fieldLabel : '企业ID',
												value : row.get("EID"),
												readOnly : true
											}]
								}, {
									columnWidth : 0.5,
									layout : 'form',
									items : [{
												xtype : "textfield",
												width : 164,
												id : 'memberID',
												name : 'memberID',
												fieldLabel : '会员ID',
												value : row.get("memberID"),
												readOnly : true
											}, {
												xtype : "numberfield",
												width : 164,
												id : 'addScore',
												name : 'score',
												allowBlank : false,
												fieldLabel : '增减分',
												readOnly : true
											}]
								}, {
									layout : 'form',
									colspan : 2,
									items : {
										xtype : 'textarea',
										name : 'description',
										fieldLabel : '描述',
										readOnly : true,
										width : 410
									}
								}, {
									xtype : 'hidden',
									id : 'ruleCode',
									name : 'code'
								}, {
									xtype : 'hidden',
									name : 'type',
									id : 'ruleType'
								}, {
									xtype : 'hidden',
									id : 'ruleName',
									name : 'name'
								}]
					});
			break;

	}

	var win = new Ext.Window({
				id : 'score_win',
				title : '添加记录',
				modal : true,
				width : 560,
				autoHeight : true,
				items : form,
				buttons : [{
							text : '添加数量:',
							xtype : 'label'
						}, {
							xtype : "numberfield",
							id : 'num',
							minValue : 1,
							allowDecimals : false,
							value : 1
						}, {
							text : "添加",
							handler : addRuleLog
						}]
			});
	win.show();
	if (v == "2")
		getRuleList();
};

// 添加记录
function addRuleLog() {
	var form = Ext.getCmp("form_add").getForm();
	if (form.isValid()) {
		var content = getDataPake_field(form, ["ruleCode", "ruleType",
						"ruleName", "memberID", "eid"], "content");
		var score = Ext.fly("addScore").getValue().trim();
		var num = Ext.fly("num").getValue().trim();
		content += ";addScore~" + (parseInt(score) * parseInt(num));
		Ext.Ajax.request({
					url : '/score/ScoreServlet',
					params : {
						type : 1,
						content : content
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("添加成功。");
							Ext.getCmp("score_win").close();
							ds_info.reload();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};
