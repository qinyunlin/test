Ext.onReady(init);
var ds, grid;
var win, keepWin, form;
var zhcn = new Zhcn_Select();

var diyQuery = "isLock=0 and isAudit=1 and isIntegrity = 1";

var query_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"], ["ename", "企业名称"]]
		});

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
	var grade = getCurArgs("grade");
	var province=getCurArgs("province");
	var cid=getCurArgs("cid");
	var city=getCurArgs("city");
	if(grade !=null && grade != undefined){
		
		if(province !=undefined && province !=null && province!="全部省份" ){
			Ext.get("comboProvinces").dom.value=province;
	
		}if(city !=null && city !=undefined && city != "全部城市" ){
			Ext.get("comboCities").dom.value=city;
		} 
		if(cid !=null){
			Ext.getCmp("cid").setValue(cid);
		}
		
		Ext.getCmp("grade").setValue(grade);
	    
	}else{
		if(province !=undefined && province !=null && province!="全部省份" ){
			Ext.get("comboProvinces").dom.value=province;
	
		}if(city !=null && city !=undefined && city != "全部城市" ){
			Ext.get("comboCities").dom.value=city;
		} 
		if(cid !=null){
			Ext.getCmp("cid").setValue(cid);
		}
	}
	//searchlist();
	ds.load();
	/*
	if(!grade && cid && province && city){
		ds.load();
	}
	*/
	
	
};



function buildGrid() {
	var rightClick = new Ext.menu.Menu({
				id : 'rightClick',
				items : [{
							text : '查看/修改',
							hidden : compareAuth('CORP_SHOP_VIEW'),
							handler : shopDetail
						}]
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', "eid", "name", "ename", "fname",'cid',
								"createOn", "createBy", "updateOn","province","city",
								"updateBy","isAudit","validDate", "sort", "degree","catalogId","matCount","grade","isIntegrity","refCount","isTop",
								"creditScore","authContent","recommendContent","auditDate","effectDate"]),
				baseParams : {
					type : 12,
					pageSize : 20,
					pageNo : 1,
					diyCondition:diyQuery,
					content : ''
				},
				countUrl : '/ep/EpShopServlet',
				countParams : {
					type : 13
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
							header : '企业ID',
							sortable : true,
							width : 50,
							dataIndex : 'eid'
						}, {
							header : '企业名称',
							sortable : true,
							width : 150,
							//dataIndex : 'name',
							renderer:function(value,metaData,record){
								var refCount = record.get("refCount");
								var icon = "";
								/*if (parseInt(refCount) > 0){
									icon += "<span style='float:left;'><img src='/resource/images/icon_can.gif' title='包含" + refCount + "个参考价材料' /></span>";
								}
								
								var isTop = record.get("isTop");
								if(isTop == 1){
									icon += "<span style='float:left;'><img src='/resource/images/icon_you.gif'></span>";
								}
								
								var isIntegrity = record.get("isIntegrity");
								if(isIntegrity ==1){
									icon += "<span style='float:left;'><img src='/resource/images/icon_cheng.gif'></span>";
								}*/
								return icon + record.get("ename");
								
							}
						}, {
							header : '区域',
							sortable : false,
							width : 50,
							renderer:function(value, metaData, record){
								return record.get("province") + " " + record.get("city");
							}
						},{
							header : '诚信积分',
							sortable : true,
							width : 50,
							dataIndex : "creditScore"
						},{
							header : '认证年限',
							sortable : false,
							width : 50,
							dataIndex : 'authContent',
							renderer : function(value, metaData, record){
								var authContent = record.get("authContent");
								if (authContent == null || "" == authContent) return "";
								var authContentArr = authContent.split(";");
								return authContentArr.length + "年";
							}
						}, {
							header : '最新认证时间',
							sortable : true,
							width : 120,
							dataIndex : 'auditDate',
							//dataIndex : 'authContent',
							renderer : function(value, metaData, record){
								var authContent = record.get("authContent");
								var auditDate = record.get("auditDate");
								if (authContent == null || "" == authContent) return "";
								var authContentArr = authContent.split(";");
								var tipMsg = "";
								for (var i = authContentArr.length, j = 0; i > j; i --){
									var curr_content = authContentArr[i - 1];
									var dateArr = curr_content.split("-");
									var curr_year = dateArr[0];
									var curr_month = dateArr[1];
									tipMsg += "&nbsp;&nbsp;&nbsp;<B>第" + (i) + "年</B> &nbsp;&nbsp;&nbsp;";
									tipMsg += curr_year + "年" + curr_month + "月认证&nbsp;&nbsp;&nbsp;</br>";
								}
								
								tipMsg = "<b><B>认证详情：</B></b></br>" + tipMsg;
								var trimtext = new cycleTrim();
								var temp = trimtext.cycleTrim(tipMsg, 60);
								trimtext.init();
								// meta.attr = 'ext:qtitle="' + '' + '"' + '
								// ext:qwidth=500 ext:qtip="' + notes + '"';
								metaData.attr = 'ext:qtitle="' + '' + '"'
										+ ' ext:qtip="' + tipMsg + '"';
								//return authContentArr[authContentArr.length - 1];
								if (auditDate == null || "" == auditDate) return "";
								return auditDate;
							}
						}, {
							header : '有效时间',
							sortable : true,
							width : 150,
							dataIndex : 'effectDate'
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [{
							id : 'rMenu1',
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('CORP_SHOP_VIEW'),
							handler : shopDetail
						}, {
							text : '诚信积分详情',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('CORP_SHOP_LOCK'),
							handler : openCreditScoreDetail
						}, {
							text : '诚信联盟申请',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/edit.gif",
							hidden : compareAuth("CORP_SHOP_RENEW"),
							handler : viewChenXinUnAuditShop
						}, {
							text : '采购商推荐',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/edit.gif",
							hidden : compareAuth("CORP_SHOP_VIEWMAT"),
							handler : showRecommendWin
						}, {
							text : '活动奖励',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_UNAUDIT"),
							handler : showAwardRecord
						},{
							text : '荣誉资质',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_EPATTACH_LIST"),
							handler : showEpAttach
						}]
			});
			
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	var comboProvinces = new Ext.form.ComboBox({
				id : 'province',
				store : pro,
				width : 80,
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份")
						{
							city=["全部城市"];
							
					    }
					    else
					    {
						    city = zhcn.getCity(province).concat();
						    city.unshift("全部城市");
					    }
						comboCities.store.loadData(city);
						comboCities.enable();
						searchlist();
					}
				},
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部省份',
				editable : false,
				triggerAction : 'all',
				allowBlank : false,
				readOnly : true,
				fieldLabel : '请选择省份'
			});

	var comboCities = new Ext.form.ComboBox({
				id : 'city',
				store : city,
				valueField : "value",
				displayField : "text",
				mode : 'local',
				forceSelection : true,
				value:'全部城市',
				hiddenName : 'region',
				editable : false,
				triggerAction : 'all',
				readOnly : true,
				fieldLabel : '选择城市',
				name : 'region',
				disabled : true,
				allowBlank : false,
				width : 80,
				listeners : {
					select : searchlist
				}
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
			value : "eid"
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
				},'-',{
					xtype : "label",
					text : "省份："
				},comboProvinces,{
					xtype : "label",
					text : "城市："
				},comboCities]
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
	
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	if(province != "全部省份"){
		content += "province~" + province;
		
		if(city != "全部城市"){
			content += ";city~" + city;
		}
	}
	
	ds.baseParams['content'] = content;
	ds.load();
};

// 锁定
function lockShop() {
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一个商铺");
		return;
	}
	var ids = [];
	for (var i = 0; i < sels.length; i++) {
		ids.push(sels[i].get("eid"));
	}
	Ext.MessageBox.confirm("确认操作", "您确定要锁定选中的商铺吗?", function(op) {
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
							}, "type=8&id=" + ids);
				}
			});

};

function showRecommendWin(){
	var row = grid.getSelectionModel().getSelected();
	if (row == null) {
		Info_Tip("请选择一个商铺!");
		return;
	}
	var form = new Ext.form.FormPanel({
				id : 'form_add',
				bodyStyle : 'padding:6px;',
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				width : 520,
				labelWidth : 50,
				labelAlign : "left",
				autoWidth : true,
				autoScroll : true,
				maxHeight : Math.floor(parent.Ext.fly("tab_credit_shop_list_iframe")
						.getHeight()
						/ 1.5),
				autoHeight : true,
				frame : true,
				items : [{
							columnWidth : 0.5,
							layout : 'form',
							items : [{
										xtype : "textfield",
										id : 'eids',
										name : 'eids',
										width : 500,
										allowBlank : false,
										fieldLabel : '企业ID',
										value : row.get("recommendContent") == null ? "" : row.get("recommendContent")
									},{
										html : '<font color=red>请注意：多个请用“;”隔开。</font>',
										xtype : 'label'
									}, ]
						}]
			});
	var win = new Ext.Window({
				id : 'rule_win',
				title : '采购商推荐',
				x : "450",
				y : "150",
				modal : true,
				autoWidth:true,
				autoHeight : true,
				buttonAlign : "center",
				items : form,
				buttons : [{
							text : "确认",
							handler : function(){
								var eids = Ext.getCmp("eids").getValue();
								var recommendContent = row.get("recommendContent");
								if (recommendContent != null && "" != recommendContent && eids == recommendContent){
									Info_Tip("数据没有改变，无需保存");
									return false;
								}else if ((eids == null || "" == eids) && (recommendContent == null || "" == recommendContent)){
									Info_Tip("企业ID不能为空!");
									return false;
								}else{
									doRecommend(row.get("eid"));
								}
							}
						}, {
							text : "取消",
							handler : function(){
								Ext.getCmp("rule_win").close();
							}
						}]
			});
	win.show();
}

function doRecommend(curr_eid){
	var eids = Ext.getCmp("eids").getValue();
	Ext.Ajax.request({
		url : '/ep/EpShopServlet',
		params : {
			type : 36,
			eid : curr_eid,
			eids : eids
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (json.state == "success") {
				Info_Tip("保存成功!", function() {
							ds.reload();
							Ext.getCmp("rule_win").close();
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

function showAwardRecord(){
	window.parent.createNewWidget("award_record_list", '活动奖励','/module/enterprise/award_record_list.jsp');
}

/**
 * 诚信积分详情
 */
function openCreditScoreDetail(){
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
	window.parent.createNewWidget("shop_credit_score_detail", '诚信积分详情',
			'/module/enterprise/shop_credit_score_detail.jsp?eid=' + row.get("eid"));
}

function showEpAttach(){
	window.parent.createNewWidget("epAttach_list", '荣誉资质','/module/enterprise/epAttach_list.jsp');
}