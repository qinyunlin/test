Ext.onReady(init);
var ds, grid;
var win, keepWin, form;
var zhcn = new Zhcn_Select();

var bodyStyle = "border:none;line-height: 20px;padding-left:30px;margin-top:10px;";
var bodyStyle2 = "border:none;margin-top:10px;";

var query_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["title", "奖励内容"], ["eids", "奖励对象id"]]
		});

function init() {
	buildGrid();
	ds.load();
};


function buildGrid() {
	var rightClick = new Ext.menu.Menu({
				id : 'rightClick',
				items : [{
							text : '查看/修改',
							hidden : compareAuth('AWARD_VIEW') && compareAuth('AWARD_EDIT'),
							handler : showDetail
						}]
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","title","score","eids","createOn","updateOn","createBy","updateBy"]),
				baseParams : {
					type : 31,
					pageSize : 20,
					pageNo : 1
				},
				countUrl : '/ep/EpShopServlet',
				countParams : {
					type : 32
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm,{
							header : 'ID',
							sortable : true,
							width : 60,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '奖励内容',
							sortable : true,
							width : 200,
							dataIndex : 'title'
						}, {
							header : '奖励积分',
							sortable : true,
							width : 80,
							dataIndex : 'score'
						}, {
							header : '奖励对象',
							sortable : false,
							width : 200,
							dataIndex : 'eids'
						},{
							header : '奖励时间',
							sortable : false,
							width : 50,
							dataIndex : "createOn"
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [{
							id : 'rMenu1',
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('AWARD_VIEW') && compareAuth('AWARD_EDIT'),
							handler : showDetail
						}, {
							text : '添加',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('AWARD_ADD'),
							handler : doAdd
						}]
			});
			
	
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
			xtype : "combo",
			id : 'query_key',
			triggerAction : 'all',
			mode : 'local',
			emptyText : '请选择',
			valueField : "value",
			displayField : "text",
			width : 100,
			editable : false,
			store : query_ds,
			value : "title"
		}, {
					xtype : "textfield",
					id : "query_input",
					fieldLabel : "关键字",
					width : 100,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, "-", {
					text : "查询",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	grid.on('beforeedit', function(e) {
				if (!compareAuth("CORP_SHOP_MOD"))
					return true;
				else
					return false;
			});
	grid.on("afteredit", function(e) {
		var data = {};
		data["type"] = 18;
		data["sortValue"] = e.record.data[e.field];
		data["id"] = e.record.get("eid");
		Ext.Ajax.request({
			method : 'post',
			url : "/ep/EpShopServlet",
			params : data,
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改排序成功！");
					ds.reload();
				} else {
					Info_Tip("修改排序成功！");
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	
};

function setTopShop(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	var status = 0;
	for(var i=0;i<sels.length;i++){
		var isTop = sels[i].data.isTop;
		if(i == 0){
			status = isTop;
		}else{
			if(status != isTop){
				Info_Tip("请选择同一种状态");
				return;
			}
		}
	}
	status == 0?status=1:status=0;
	var ids = [];
	for (var i = 0; i < sels.length; i++) {
		ids.push(sels[i].get("eid"));
	}
	Ext.MessageBox.confirm("系统提示", status==1?"是否设置为优质供应商？":"是否取消优质供应商？", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request("post", '/ep/EpShopServlet', {
				success : function(response) {
					var jsondata = eval("("
							+ response.responseText + ")");
					if (getState(jsondata.state,
							commonResultFunc, jsondata.result)) {
						Info_Tip("操作成功!");
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "type=28&isTop=" + status + "&id=" + ids);
		}
	});
}

function showAutoTypedWindow(){
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'form',
			bodyStyle : 'border:none;',
			items : [
					{
						layout : 'form',
						bodyStyle : 'text-align:left;border:none;',
						items : {
							xtype : 'textfield',
							width:100,
							inputType : 'file',
							allowBlank : false
						}
					},
					{
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'text-align:center;border:none;color:#8E8E8E',
							html : "提交供应商报价Excel文件进行自动修正匹配材料二级分类码"
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '自动分类',
		closeable : true,
		width : 450,
		autoHeight : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '提交',
			handler : autoMatchMaterialType
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

function autoMatchMaterialType(){
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/MaterialTypeCheckServlet?type=2',
			waitMsg : '修正匹配中...',
			success : function(upload_form, o) {
				var returnInfo = o.result.result.split(";");
				Ext.MessageBox.alert("自动分类", "共修正匹配" + returnInfo[0] + "条，保存到本地！",function(){
					window.open(returnInfo[1]);
				});
				win.close();
			},
			failure : function(upload_form, o) {
				Ext.MessageBox.alert("自动分类", o.result.result);
				win.close();
			}
		});
	} else {
		Info_Tip("请正确填写信息。");
	}
}

function materialTypeCheck(){
	Ext.MessageBox.confirm("自动分类","此操作耗时约几分钟，确定现在开始分类检查？",function(op){
		if(op == "yes"){
			var myMask = new Ext.LoadMask(Ext.getBody(), {
		        msg: '系统正在检查...',
		        removeMask: true //完成后移除
		    });
			myMask.show();
			
			
			Ext.Ajax.request({
				url:'/MaterialTypeCheckServlet?type=1',
				method:'post',
//				waitMsg:'系统正在检查...',
				timeout:500000000,
				success:function(response){
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						myMask.hide();
						var returnInfo = jsondata.result.split(";");
						Ext.MessageBox.alert("分类检查","共检查出分类码与自动匹配不一致的供应商材料" + returnInfo[0] + "条！请导出查看！", function(){
							window.open(returnInfo[1]);
						});
					} else {
						myMask.hide();
						Info_Tip(jsondata.result);
					}
				},
				failure:function(){
					myMask.hide();
					Info_Tip("系统异常，请联系管理人员！");
				}
			});
		}
	});
}

//上传词库窗口
function updateDicWindow(){
	upload_form = new Ext.form.FormPanel({
		layout : 'form',
		bodyStyle : 'padding:6px;',
		labelWidth : 60,
		fileUpload : true,
		items : [ {
			layout : 'column',
			bodyStyle : 'border:none;',
			items : [
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							xtype : 'textfield',
							inputType : 'file',
							fieldLabel : '上传文件',
							allowBlank : false
						}
					},
					{
						columnWidth : 0.5,
						layout : 'form',
						bodyStyle : 'border:none;',
						items : {
							bodyStyle : 'border:none;',
							html : "<a href='" + FileSite
									+ "/doc/MaterialDic.xls" + "' >标准文档下载</a>"
						}
					} ]
		} ]
	});
	win = new Ext.Window({
		title : '更新词库',
		closeable : true,
		width : 600,
		autoHeight : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		buttonAlign : 'center',
		items : [ upload_form ],
		buttons : [ {
			text : '上传',
			handler : uploadFile
		}, {
			text : '取消',
			handler : function() {
				win.close();
			}
		} ]
	});
	win.show();
}

//词库上传更新方法
function uploadFile(){
	if (upload_form.getForm().isValid()) {
		upload_form.getForm().submit({
			url : '/MaterialTypeUploadServlet',
			waitMsg : '上传文件中...',
			success : function(upload_form, o) {
				Ext.MessageBox.alert("更新词库", o.result.result);
				win.close();
			},
			failure : function() {
				Info_Tip("出错了!");
			}
		});
	} else {
		Info_Tip("请正确填写信息。");
	}
}

// 打开查看修改页面
function shopDetail() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "只能选择一个商铺");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	window.parent.createNewWidget("credit_shop_detail", '查看/修改',
			'/module/enterprise/credit_shop_detail.jsp?id=' + row.get("id") + '&eid=' + row.get("eid"));
};

//打开修改模板窗口
var win1;
function openUpdateCatalogId() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一个商铺");
		return;
	}
	
	win1 = new Ext.Window({
		title : '修改模板',
		width : 200,
		height : 100,
		closable : true,
		draggable : true,
		modal : true,
		border : false,
		plain : true,
		closeAction : "close",
		buttonAlign : 'center',
		items : [{
					layout : "form",
					bodyStyle : "border:none;background-color:#CED9E7",
					labelAlign : 'right',
					labelWidth : 60,
					items : [{
								id : 'catalogId',
								xtype : 'combo',
								fieldLabel : "商铺模板",
								mode : 'local',
								readOnly : true,
								triggerAction : 'all',
								store : new Ext.data.SimpleStore({
											fields : ['value', 'text'],
											data : [['000100DR00De', '普通版'], ['000100DR00EI', '企业版'],['000100DR00EJ','VIP版']]
										}),
								valueField : 'value',
								displayField : 'text',
								width : 120,
								height:22,
								value:'000100DR00De'
								}]
				}],
		buttons : [{
					text : '确定',
					handler : updateCataLogId
				}]
	});
	
	win1.show();
};

//查看供应商报价
function viewFacMaterial(){
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if(row.length > 1){
		Info_Tip("请选择一个商铺");
		return;
	}
	window.parent.createNewWidget("mat_fac_detail", '供应商材价',
			'/module/mat/mat_fac_detail.jsp?eid=' + row[0].get("eid") + '&fname=' + row[0].get("name"));
}
//查看未审核商铺
function viewUnAuditShop(){
	window.parent.createNewWidget("0308", '未审核商铺管理','/module/enterprise/unaudit_enterprise_list.jsp');
}

function viewChenXinUnAuditShop(){
	window.parent.createNewWidget("audit_chengxin_enterprise_list", '申请诚信联盟商铺','/module/enterprise/audit_chengxin_enterprise_list.jsp');
}



//查看待审材价商铺
function viewUnAuditMaterialShop(){
	window.parent.createNewWidget("mat_fac_list_wsh", '待审材价商铺','/module/mat/mat_fac_list_wsh.jsp');
}
//查看锁定商铺
function viewLockedShop(){
	window.parent.createNewWidget("0306", '已锁定商铺管理','/module/enterprise/enterprise_shop_lock.jsp');
}
//查看无材价商铺
function viewNoMaterialShop(){
	window.parent.createNewWidget("enterprise_shop_no_material", '无材价商铺','/module/enterprise/enterprise_shop_no_material.jsp');
}

//修改模板
function updateCataLogId(){
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	var catalogId = Ext.getCmp("catalogId").getValue();
	
	Ext.lib.Ajax.request("post", '/ep/EpShopServlet', {
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc,
					jsondata.result)) {
				Info_Tip("操作成功!");
				win1.close();
				ds.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "type=5&eid=" + eid + "&catalogId=" + catalogId);
}

// 弹出续期窗口
function showKeepWin() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一个商铺");
		return;
	}
	var nextYear = new Date();
	nextYear.setFullYear(date.getFullYear() + 1);
	win = new Ext.Window({
		title : "续期",
		width : 360,
		autoHight : true,
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
				id : 'pass_type',
				store : new Ext.data.SimpleStore({
							fields : [{
										name : 'value'
									}, {
										name : 'text'
									}],
							//data : [['0', '有效日期'], ['1', '有效天数']],
							data : [['0','当日起一年'],['1','本年12月31日'],['2','明年12月31日'],['3','指定日期']]
						}),
				mode : 'local',
				triggerAction : 'all',
				readOnly : true,
				valueField : "value",
				displayField : "text",
				fieldLabel : "审核类型",
				emptyText : '请选择审核类型',
				hiddenName: 'date_type',
				value : '0',
				listeners : {
					select : function(ComboBox, record) {
						if(record.get('value') == '0'){
							var date = new Date();
							date.setFullYear(date.getFullYear() + 1);
							Ext.getCmp("date_i").setValue(date);
							
							Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
							Ext.fly("date_area").setVisible(false);
						}else if(record.get("value") == "1"){
							var date = new Date();
							date.setMonth(11,31);
							Ext.getCmp("date_i").setValue(date);
							
							Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
							Ext.fly("date_area").setVisible(false);
						}else if(record.get("value") == "2"){
							var date = new Date();
							date.setFullYear(date.getFullYear() + 1);
							date.setMonth(11, 31);
							Ext.getCmp("date_i").setValue(date);
							
							Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
							Ext.fly("date_area").setVisible(false);
						}else{
							Ext.getCmp("date_i").setValue(new Date());
							Ext.fly("date_area").setVisible(true);
						}
					}
				}
			},{
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
										id : "date_i",
										value:nextYear,
										readOnly : true
									}]
						}, {
							xtype : 'label',
							html : '<font color="red">(不包含此日期)'
						}]
			}, {
				id : "day_area",
				layout : "form",
				visibled:false,
				bodyStyle : "border:none;background-color:#CED9E7",
				items : [{
							xtype : 'textfield',
							emptyText : '请输入天数',
							name : 'addDays',
							fieldLabel : "有效天数",
							allowBlank : false,
							id : "day_i"
						}]
			},{
				xtype : "combo",
				id : 'catalogId',
				store : new Ext.data.SimpleStore({
							fields : [{
										name : 'value'
									}, {
										name : 'text'
									}],
							data : [['000100DR00De', '普通版'], ['000100DR00EI', '企业版'],['000100DR00EJ','VIP版']]
						}),
				mode : 'local',
				triggerAction : 'all',
				readOnly : true,
				valueField : "value",
				displayField : "text",
				fieldLabel : "商铺模板",
				value:'000100DR00De'
			}],
		buttons : [{
					text : "续期",
					handler : keepShop
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
	Ext.fly("date_area").setVisibilityMode(Ext.Element.DISPLAY);
	Ext.fly("date_area").setVisible(false);
};
function keepShop() {
	
	var validDate = Ext.fly("date_i").getValue();
	if (isEmpty(validDate)) {
		Ext.MessageBox.alert("提示", "有效日期不能为空!");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var eid = row.get("eid");
	var catalogId = Ext.getCmp("catalogId").getValue();
	Ext.lib.Ajax.request("post", '/ep/EpShopServlet', {
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						Info_Tip("操作成功!");
						win.close();
						ds.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			}, "type=14&eid=" + eid + "&valiDate=" + validDate + "&catalogId=" + catalogId);
};
// 搜索
function searchlist() {
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.getCmp("query_input").getValue();
	var content = query_key + "~" + query_value + ";";
	
	ds.baseParams['content'] = content;
	ds.load();
};

// 添加
function doAdd() {
	var form = new Ext.form.FormPanel({
		id : 'form_add',
		bodyStyle : 'padding:6px;',
		layout : 'table',
		layoutConfig : {
			columns : 3
		},
		labelWidth : 80,
		labelAlign : "right",
		autoWidth : true,
		autoScroll : true,
		autoHeight : true,
		frame : true,
		items : [{
			autoHeight : true,
			bodyStyle : bodyStyle,
			items : [ {
				xtype : "label",
				html : "奖励内容："
			} ]
		},
		{
			colspan : 2,
			autoHeight : true,
			bodyStyle : bodyStyle2,
			items : [{
				xtype : "textfield",
				fieldLabel : "title",
				maxLength : 50,
				id : "title",
				width : 300
			}]
		},{
			autoHeight : true,
			bodyStyle : bodyStyle,
			items : [ {
				xtype : "label",
				html : "奖励积分："
			} ]
		},
		{
			colspan : 2,
			autoHeight : true,
			bodyStyle : bodyStyle2,
			items : [{
				xtype : "textfield",
				fieldLabel : "score",
				maxLength : 10,
				id : "score",
				width : 100
			}]
		},{
			autoHeight : true,
			bodyStyle : bodyStyle,
			items : [ {
				xtype : "label",
				html : "奖励对象："
			} ]
		},
		{
			autoHeight : true,
			bodyStyle : bodyStyle2,
			items : [{
				xtype : "textfield",
				fieldLabel : "eids",
				maxLength : 300,
				id : "eids",
				width : 300
			}]
		},{
			autoHeight : true,
			bodyStyle : bodyStyle2,
			items : [ {
				xtype : "label",
				html : "<font color=red> 请输入企业ID，多个请用“;”号隔开。</font>"
			} ]
		}]
	});
	var win = new Ext.Window({
				id : 'add_win',
				title : '添加',
				x : "450",
				y : "150",
				modal : true,
				autoHeight : true,
				autoWidth : true,
				buttonAlign : "center",
				items : form,
				buttons : [{
						text : "确认",
						handler : add
					}, {
							text : "取消",
							handler : function(){
								win.close();
							}
						}]
			});
	win.show();
};

var numReg = /^\d+$/;
/**
 * 保存
 * @returns {Boolean}
 */
function add(){
	var title = Ext.getCmp("title").getValue();
	var score = Ext.getCmp("score").getValue();
	var eids = Ext.getCmp("eids").getValue();
	if (title == null || "" == title 
			|| eids == null || "" == eids){
		Info_Tip("请输入必填信息！");
		return false;
	}
	if (!numReg.test(score)){
		Info_Tip("积分只能是数字！");
		return false;
	}else if (parseInt(score,10) < 1 || parseInt(score,10) > 50){
		Info_Tip("积分数量只能在1-50之间！");
		return false;
	}
	var content = "title~" + title + ";score~" + score;
	Ext.Ajax.request({
		url : '/ep/EpShopServlet',
		params : {
			type : 33,
			eids : eids,
			content : content
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (json.state == "success") {
				Info_Tip("添加成功!", function() {
							ds.reload();
							Ext.getCmp("add_win").close();
				});
			} else {
				Info_Tip(json.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

/**
 * 查看/修改
 */
function showDetail(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var id = row.get("id");
	Ext.Ajax.request({
		url : '/ep/EpShopServlet',
		params : {
			type : 34,
			id : id
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (json.state == "success") {
				createDetail(json.result, id);
			} else {
				Info_Tip(json.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

/**
 * 创建查看/修改区域
 * @param data
 * @param id
 */
function createDetail(data,id){
	var form = new Ext.form.FormPanel({
				id : 'form_view',
				bodyStyle : 'padding:6px;',
				layout : 'table',
				layoutConfig : {
					columns : 3
				},
				labelWidth : 80,
				labelAlign : "right",
				autoWidth : true,
				autoScroll : true,
				autoHeight : true,
				frame : true,
				items : [{
					autoHeight : true,
					bodyStyle : bodyStyle,
					items : [ {
						xtype : "label",
						html : "奖励内容："
					} ]
				},
				{
					colspan : 2,
					autoHeight : true,
					bodyStyle : bodyStyle2,
					items : [{
						xtype : "textfield",
						fieldLabel : "title",
						maxLength : 50,
						id : "title",
						width : 300,
						value : data["title"]
					}]
				},{
					autoHeight : true,
					bodyStyle : bodyStyle,
					items : [ {
						xtype : "label",
						html : "奖励积分："
					} ]
				},
				{
					colspan : 2,
					autoHeight : true,
					bodyStyle : bodyStyle2,
					items : [ {
						xtype : "label",
						html : data["score"]
					} ]
				},{
					autoHeight : true,
					bodyStyle : bodyStyle,
					items : [ {
						xtype : "label",
						html : "奖励对象："
					} ]
				},
				{
					colspan : 2,
					autoHeight : true,
					bodyStyle : bodyStyle2,
					items : [ {
						xtype : "label",
						html : data["eids"]
					} ]
				},{
					autoHeight : true,
					bodyStyle : bodyStyle,
					items : [ {
						xtype : "label",
						html : "追加对象："
					} ]
				},
				{
					autoHeight : true,
					bodyStyle : bodyStyle2,
					items : [{
						xtype : "textfield",
						fieldLabel : "eids",
						maxLength : 300,
						id : "eids",
						width : 300
					}]
				},{
					autoHeight : true,
					bodyStyle : bodyStyle2,
					items : [ {
						xtype : "label",
						html : "<font color=red> 请输入企业ID，多个请用“;”号隔开。</font>"
					} ]
				}]
			});
	var win = new Ext.Window({
				id : 'view_win',
				title : '查看/修改',
				x : "450",
				y : "150",
				modal : true,
				autoHeight : true,
				autoWidth : true,
				buttonAlign : "center",
				items : form,
				buttons : [{
						text : "确认",
						hidden : compareAuth('AWARD_EDIT'),
						handler : function(){
							update(id);
						}
					}, {
							text : "取消",
							handler : function(){
								win.close();
							}
						}]
			});
	win.show();

}

/**
 * 修改
 * @param id
 * @returns {Boolean}
 */
function update(id){
	var title = Ext.getCmp("title").getValue();
	var eids = Ext.getCmp("eids").getValue();
	if (title == null || "" == title){
		Info_Tip("奖励内容不能为空！");
		return false;
	}
	var content = "title~" + title;
	Ext.Ajax.request({
		url : '/ep/EpShopServlet',
		params : {
			type : 35,
			id : id,
			eids : eids,
			content : content
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (json.state == "success") {
				Info_Tip("修改成功!", function() {
							ds.reload();
							Ext.getCmp("view_win").close();
				});
			} else {
				Info_Tip(json.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
