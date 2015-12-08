Ext.onReady(init);
var ds, grid;
var win, keepWin, form;
var zhcn = new Zhcn_Select();
var subcid;
var brand;
var showRemindFlag = false;
var facMatRemindMsg = "";
var matUpdateOn = "";
var remind_dialog;
var frontlineAreas = "";

var diyQuery = "isLock=0 and isAudit=1 and isDeleted = 0";

var query_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"], ["name", "企业名称"]]
		});
//商铺模板类型
var templateArray = [["","所有模板"],['000100DR00De', '普通版'], ['000100DR00EI', '企业版'],['000100DR00EJ','VIP版']];
var template_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : templateArray
});

//cid_db.js
cid_db.unshift(["","所有行业"]);
var cid_store= new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : cid_db
});
//grade_db.js
Grade_DB.unshift(["","所有档次"]);

var topArray = [["","所有供应商"],["common","普通供应商"],["isTop","优质供应商"],["isIntegrity","诚信供应商"],["refCount","参考供应商"]];
var topType_ds=new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : topArray
});
function init() {
	Ext.QuickTips.init(true);
//	var isAudit = getCurArgs("type");
//	if (Ext.isEmpty(isAudit))
//		isAudit = 1;
	//更新报价提醒
	getFacMatRemindCount();
	buildGrid();
	var grade = getCurArgs("grade");
	var province=getCurArgs("province");
	var cid=getCurArgs("cid");
	var city=getCurArgs("city");
	var type = getCurArgs("type");
	subcid = getCurArgs("subcid");
	brand = getCurArgs("brand");
	frontlineAreas = getCurArgs("frontlineAreas");
	if (subcid != null && "" != subcid){
		cid = subcid.substring(0,2);
	}
	if(grade !=null && grade != undefined){
		if ("全国" == province){
			Ext.get("comboProvinces").dom.value="全部省份";
		}else if(province !=undefined && province !=null && province!="全部省份" ){
			Ext.get("comboProvinces").dom.value=province;
	
		}if(city !=null && city !=undefined && city != "全部城市" ){
			Ext.get("comboCities").dom.value=city;
		} 
		if(cid !=null){
			Ext.getCmp("cid").setValue(cid);
		}
		
		Ext.getCmp("grade").setValue(grade);
	}else{
		if ("全国" == province){
			Ext.get("comboProvinces").dom.value="全部省份";
		}else if(province !=undefined && province !=null && province!="全部省份" ){
			Ext.get("comboProvinces").dom.value=province;
	
		}if(city !=null && city !=undefined && city != "全部城市" ){
			Ext.get("comboCities").dom.value=city;
		} 
		if(cid !=null){
			Ext.getCmp("cid").setValue(cid);
		}
	}
	if (frontlineAreas == null){
		frontlineAreas = "";
	}else if(frontlineAreas.indexOf(";") == -1){
		Ext.get("comboProvinces").dom.value = frontlineAreas;
	}
	if ("common" == type){ //普通供应商
		 Ext.getCmp("topShop").setValue("common");
    }else if ("good" == type){//优质供应商
   	 	Ext.getCmp("topShop").setValue("isTop");
    }else if ("credit" == type){//诚信
   	 	Ext.getCmp("topShop").setValue("isIntegrity");
    }else if ("ref" == type){//参考
   	 	Ext.getCmp("topShop").setValue("refCount");
    }
	searchList();
	/*
	if(!grade && cid && province && city){
		ds.load();
	}
	*/
	
	if (showRemindFlag && !compareAuth('SHOP_REMIND')){
		showFacMatRemind();
	}
};



function buildGrid() {
	var rightClick = new Ext.menu.Menu({
				id : 'rightClick',
				items : [{
							text : '查看/修改',
							hidden : compareAuth('CORP_SHOP_VIEW'),
							handler : shopDetail
						}, /*{
							text : '锁定',
							hidden : compareAuth('CORP_SHOP_LOCK'),
							handler : lockShop
						}, */{
							text : '续期',
							hidden : compareAuth("CORP_SHOP_RENEW"),
							handler : showKeepWin
						},{
							text : '设置灯饰月销榜',
							hidden : compareAuth('SUPPLY_ADMIN_MONTHTOP'),
							handler : setMonthTop
						}]
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpShopServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', "eid", "name", "fname",'cid',
								"createOn", "createBy", "updateOn","province","city","effectDate",
								"updateBy","updateOn","isAudit","validDate", "sort", "degree","catalogId","matCount","grade","isIntegrity","refCount","isTop","matUpdateOn"]),
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
							width : 80,
							//dataIndex : 'name',
							renderer:function(value,metaData,record){
								var refCount = record.get("refCount");
								var icon = "";
								if (parseInt(refCount) > 0){
									icon += "<span style='float:left;'><img src='/resource/images/icon_can.gif' title='包含" + refCount + "个参考价材料' /></span>";
								}
								
								var isTop = record.get("isTop");
								if(isTop == 1){
									icon += "<span style='float:left;'><img src='/resource/images/icon_you.gif'></span>";
								}
								var isIntegrity = record.get("isIntegrity");
								if(isIntegrity ==1){
									var effectDate = record.get("effectDate");
									if (effectDate != null && "" != effectDate){
										if (isEffectDate(effectDate.split(" ")[0])){
											icon += "<span style='float:left;'><img src='/resource/images/icon_cheng.gif'></span>";		
										}
									}
								}
								
								return icon + record.get("name");
								
							}
						}, {
							header : '区域',
							sortable : false,
							width : 50,
							renderer:function(value, metaData, record){
								return record.get("province") + " " + record.get("city");
							}
						},{
							header : '所属行业',
							sortable : false,
							width : 160,
							dataIndex : 'cid',
							renderer : function(value){
								if(!value){
									return "";
								}
								var cidStr = "";
								var cidArray = value.split(";");
								for(var i=0;i<cidArray.length;i++){
									if(!cidArray[i]){
										continue;
									}
									cidStr += getStuffName(cidArray[i]);
									if(i != cidArray.length -1){
										cidStr += ";";
									}
								}
								return cidStr;
							}
						}, {
							header : '商铺档次',
							sortable : false,
							width : 80,
							dataIndex : 'grade',
							renderer : function(value){
								if(!value){
									return "";
								}
								var gradeArray = value.split(";");
								var gradeStr = "";
								for(var i=0;i<gradeArray.length;i++){
									//调用grade_db.js方式
									if(!gradeArray[i]){
										continue;
									}
									gradeStr += getGradeById(gradeArray[i]);
									if(i != gradeArray.length - 1){
										gradeStr += ";";
									}
								}
								return gradeStr;
							}
						}, {
							header:'材料数',
							sortable:true,
							width:40,
							dataIndex:'matCount'
						},{
							header : '创建时间',
							sortable : true,
							width : 80,
							dataIndex : 'createOn'
						}, {
							header : '有效时间',
							width : 60,
							sortable : true,
							dataIndex : 'validDate',
							renderer : function(value, meta, record) {
								var validDate = record.get("validDate");
								if (validDate != null){
									return validDate.split(" ")[0];
								}
								return "";
							}
						}, {
							header : '报价日期',
							width : 80,
							sortable : true,
							dataIndex : 'matUpdateOn',
							renderer : function(value, meta, record) {
								var matUpdateOn = record.get("matUpdateOn");
								if (matUpdateOn != null){
									return matUpdateOn.split(" ")[0];
								}
								return "";
							}
						},  {
							header : '排序',
							width : 20,
							sortable : true,
							dataIndex : 'sort',
							editor : {
								xtype : 'numberfield',
								allowDecimals : false,
								allowBlank : false
							}
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [{
							text : '添加商铺',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth('CORP_SHOP_ADD'),
							handler : showAddWin
						},{
							id : 'rMenu1',
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('CORP_SHOP_VIEW'),
							handler : shopDetail
						}, /*{
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth('CORP_SHOP_LOCK'),
							handler : lockShop
						}, */{
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth('CORP_SHOP_LOCK'),
							handler : delShop
						}, {
							text : '续期',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/table_multiple.png",
							hidden : compareAuth("CORP_SHOP_RENEW"),
							handler : showKeepWin
						}, {
							text : '查看材价',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/report_magnify.png",
							hidden : compareAuth("CORP_SHOP_VIEWMAT"),
							handler : viewFacMaterial
						}, {
							text : '未审核商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_UNAUDIT"),
							handler : viewUnAuditShop
						}, {
							text : '待审材价商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_UNAUDITMAT"),
							handler : viewUnAuditMaterialShop
						},/* {
							text : '已锁定商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_LOCKED"),
							handler : viewLockedShop
						},*/ {
							text : '无材价商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_NOMAT"),
							handler : viewNoMaterialShop
						}, /*{
							text : '诚信联盟商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_LIST"),
							handler : viewCreditShop
						},{
							text : '申请诚信联盟商铺',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_CXSHOP_VIEW"),
							handler : viewChenXinUnAuditShop
						}, */{
							text : '设置/取消优质供应商',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_TOP"),
							handler : setTopShop
						},/*{
							text : '更新词库',
							cls : 'x-btn-text-icon',
							tooltip : '建议在闲时更新词库，否则会影响系统运行速度，超过3w条可能会超时，请不要重复上传！',
							icon : "/resource/images/book_open.png",
							hidden : compareAuth("FAC_UPDATE_DIC"),
							handler : updateDicWindow
						},{
							text : '分类检查',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/computer_go.png",
							hidden : compareAuth("FAC_TYPE_CHECKED"),
							handler : materialTypeCheck
						},{
							text : '自动分类',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/page_excel.png",
							hidden : compareAuth("FAC_AUTO_TYPED"),
							handler : showAutoTypedWindow
						},{
							text : '生成静态页面',
							hidden : compareAuth('CORP_SHOP_HTML'),
							icon : '/resource/images/arrow_refresh.png',
							handler : createAllShopHtml
						}后期可删除其权限配置*/ /*,{
							text : '荣誉资质',
							cls : 'x-btn-text-icon',
							icon : "/resource/images/application_double.png",
							hidden : compareAuth("CORP_SHOP_EPATTACH_LIST"),
							handler : showEpAttach
						},*/{
							text : '导出报价',
							icon : '/resource/images/page_excel.png',
							hidden : compareAuth('FAC_LIST_DOWNLOAD'),
							handler : exportFacExcel
						}/*,{
							text : '更新提醒',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth('SHOP_REMIND') ? true : !showRemindFlag,
							handler : function(){
								getFacMatRemindCount();
								showFacMatRemind();
							}
						}*/,{
							text : '设置灯饰月销榜',
							hidden : compareAuth('SUPPLY_ADMIN_MONTHTOP'),
							handler : setMonthTop
						},{
							text : '设置优秀企业榜',
							hidden : compareAuth('SUPPLY_ADMIN_EXCELLENTSHOP'),
							handler : setExcellentShop
						}]
			});
			
			
			
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	comboProvinces = new Ext.form.ComboBox({
				id : 'comboProvinces',
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
						searchList();
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

	comboCities = new Ext.form.ComboBox({
				id : 'comboCities',
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
					'select' : searchList
				}

			});
			
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [{
					xtype : "combo",
					id : 'query_key',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 80,
					store : query_ds,
					value : 'name'
				}, "-", {
					id : 'query_value',
					xtype : 'textfield',
					width : 100
				}, "-", {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchList
				}, "-", "省份", comboProvinces, "城市", comboCities, {
					id : 'cid',
					xtype : 'combo',
					mode : 'local',
					readOnly : true,
					triggerAction : 'all',
					store : cid_store,
					valueField : 'value',
					displayField : 'text',
					width : 120,
					value : '',
					listeners:{
						'select':searchList
					}
				},{
					id : 'grade',
					xtype : 'combo',
					mode : 'local',
					readOnly : true,
					triggerAction : 'all',
					store : Grade_DB,
					valueField : 'value',
					displayField : 'text',
					width : 80,
					value : '',
					listeners:{
						'select':searchList
					}
				},/*{
					id : 'template',
					xtype : 'combo',
					mode : 'local',
					readOnly : true,
					triggerAction : 'all',
					store : template_ds,
					valueField : 'value',
					displayField : 'text',
					width : 80,
					value : '',
					listeners:{
						'select':searchList
					}
				},*/{
					id : 'topShop',
					xtype : 'combo',
					mode : 'local',
					readOnly : true,
					triggerAction : 'all',
					store : topType_ds,
					valueField : 'value',
					displayField : 'text',
					width : 85,
					value : '',
					listeners:{
						'select':searchList
					}
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
				var returnInfo = o.result;
				if (getState(returnInfo.state,
						commonResultFunc, returnInfo.result)) {
					var sucNum = returnInfo.result;
					var r = /^\+?[1-9][0-9]*$/; //正整数
					if (r.test(sucNum)){
						Info_Tip("本次共更新" + sucNum + "条！");
						win.close();
						//ds.reload();
					}else{
						//错误信息
						showErrorWin(sucNum);
					}
				} 
			},
			failure : function() {
				showErrorWin("词库更新失败，具体请联系技术人员！");
			}
		});
	} else {
		Info_Tip("请正确填写信息。");
	}
}


function showErrorWin(errorMsg){
	Ext.MessageBox.hide();
	//win.close();
	var exceptionMsg = new Ext.form.FormPanel(
			{
				layout : 'form',
				bodyStyle : 'border:none;background-color:min-height:400px;',
				fileUpload : true,
				labelWidth : 60,
				buttonAlign : 'right',
				items : [ {
					xtype : 'textarea',
					width : 380,
					value : errorMsg,
					style : "min-height:300px;",
					allowBlank : false,
					autoHeight : true
				} ],
				buttons : [ {
					text : '确定',
					handler : function() {
						win1.close();
					}
				} ]
			});
	var win1 = new Ext.Window({
		title : '错误提示',
		closeAction : "close",
		width : 500,
		autoHeight : true,
		bodyStyle : 'padding:6px',
		draggable : true,
		modal : true,
		items : [ exceptionMsg ]
	});
	win1.show();

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
	var eid = row.get("eid");
	window.parent.createNewWidget("shop_edit", '修改商铺信息',
			'/module/enterprise/enterprise_shop_info.jsp?eid=' + eid);
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
	window.parent.createNewWidget("0309", '申请诚信联盟商铺','/module/enterprise/audit_chengxin_enterprise_list.jsp');
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

/**
 * 查看诚信联盟商铺
 */
function viewCreditShop(){
	window.parent.createNewWidget("credit_shop_list", '诚信联盟商铺','/module/enterprise/credit_shop_list.jsp');
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
function searchList() {
	var cid = Ext.getCmp("cid").getValue();
	var grade = Ext.getCmp("grade").getValue();
	/*var template = Ext.getCmp("template").getValue();*/
	var province=Ext.fly("comboProvinces").getValue();
	var city=Ext.fly("comboCities").getValue();
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.fly("query_value").getValue();
	var topShop = Ext.getCmp("topShop").getValue();
	
	var diyCondition = diyQuery;
	if ("isIntegrity" == topShop){
		diyCondition += " and isIntegrity = 1 and effectDate > now()";
	}else if(topShop && topShop == "common"){
		diyCondition += " and isTop != 1 and refCount = 0 and (isIntegrity != 1 or (isIntegrity = 1 and effectDate < now()))";
	}else if(topShop){
		diyCondition += " and " + topShop + " != 0";
	}
	ds.baseParams["diyCondition"] = diyCondition;
	
	var content = "cid~" + cid +";" + query_key + "~"
			+ query_value + ";grade~" + grade + ";catalogId~";
	if (subcid != null && "" != subcid){
		content += ";subcid~" + subcid;
	 }
	if (brand != null && "" != brand){
		content += ";brand~" + brand;
	}
	
	if(province != "全部省份") {
		content +=";province~" + province;
		
		if(city!="全部城市")
		{
			content+=";city~"+city;
		}
	}
	
	if (matUpdateOn != null && "" != matUpdateOn){
		content += ";matUpdateOn~" + matUpdateOn;
	}
	frontlineAreas
	ds.baseParams['frontlineAreas'] = frontlineAreas;
	ds.baseParams['content'] = content;
	ds.load();
};

/**
 * 时间比较
 * @param beginDate
 * @param endDate
 * @returns {Boolean}
 */
function isEffectDate(effectDate){
	var effectDateArr = effectDate.split("-");
	var nowEffectDate = new Date(effectDateArr[0],effectDateArr[1] - 1,effectDateArr[2]);
	var nowDate =  new Date();
	if (nowEffectDate > nowDate){
		return true;
	}
	return false;
}

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

/**
 * 删除商铺：需要同时删除商铺下的所有报价(逻辑删除)
 */
function delShop(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请至少选择一个商铺！");
		return;
	}
	var eids = [];
	for (var i = 0; i < sels.length; i++) {
		var isTop = sels[i].get("isTop");
		var refCount = sels[i].get("refCount");
		var isIntegrity = sels[i].get("isIntegrity");
		if ("1" == isTop || parseInt(refCount, 10) > 0 || "1" == isIntegrity){
			Info_Tip("您所选的商铺中存在参考供应商、优质供应商、诚信供应商，请先取消再进行删除！");
			return;
		}
		eids.push("'" + sels[i].get("eid") + "'");
	}
	Ext.MessageBox.confirm("确认操作", "您确定要删除选中的商铺吗(同时将删除该商铺下的所有报价)?", function(op) {
				if (op == "yes") {
					Ext.lib.Ajax.request("post", '/ep/EpShopServlet', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										Info_Tip("删除成功!");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							}, "type=44&eids=" + eids.toString());
				}
			});


}

function showEpAttach(){
	window.parent.createNewWidget("epAttach_list", '荣誉资质','/module/enterprise/epAttach_list.jsp');
}
//将多个商铺的供应材料导出到多个sheet的Excel文件
function exportFacExcel() {
	var row = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择需要导出报价的供应商!");
		return;
	}
	var fids = [];
	var count = 0;
	for (var i = 0; i < row.length; i++) {
		if(row[i].get("matCount") == 0)
			count ++;
		fids.push(row[i].get("eid"));
	}
	if(count == row.length){
		alert("所选供应商无材料!");
		return;
	}
	var content = 'fids~' + fids.toString() + ";isDeleted~0;isAudit~1";
	window.document.exportform.action = '/MaterialDownload.do?type=fac_list_download&content=' + content;
	window.document.exportform.submit();
};

function initFacMatRemindCount(){
	artDialog.notice = function (options) {
	    var opt = options || {},
	        api, aConfig, hide, wrap, top,
	        duration = 800;
	        
	    var config = {
	        id: 'Notice',
	        left: '50%',
	        top: '0%',
	        fixed: true,
	        drag: false,
	        resize: false,
	        follow: null,
	        lock: false,
	        init: function(here){
	            api = this;
	            aConfig = api.config;
	            wrap = api.DOM.wrap;
	            top = parseInt(wrap[0].style.top);
	            hide = top - wrap[0].offsetHeight;
	            
	            wrap.css('top', hide + 'px')
	                .animate({top: top + 'px'}, duration, function () {
	                    opt.init && opt.init.call(api, here);
	                });
	        },
	        close: function(here){
	            wrap.animate({top: hide + 'px'}, duration, function () {
	                opt.close && opt.close.call(this, here);
	                aConfig.close = $.noop;
	                api.close();
	            });
	            
	            return false;
	        }
	    };	
	    
	    for (var i in opt) {
	        if (config[i] === undefined) config[i] = opt[i];
	    };
	    
	    return artDialog(config);
	};
}

/**
 * 报价更新提醒周期
 */
function getFacMatRemindCount(){
	facMatRemindMsg = "";
	$.ajax({
		type : "post",
		url : '/servlet/RationLibServlet?type=22',
		async : false, //默认值: true。默认设置下，所有请求均为异步请求。如果需要发送同步请求，请将此选项设置为 false。
					   //注意，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行
		complete : function(json) {
			var data = eval("(" + json.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				var result = data.result;
				if (result != null && "" != result){
					for (var i = 0, j = result.length; i < j; i ++){
						var curr_time = result[i].time;
						var count = result[i].count;
						if (curr_time != null && "" != curr_time){
							var curr_time_arr = curr_time.split(" ")[0];
							var year = curr_time_arr.split("-")[0];
							var month = parseInt(curr_time_arr.split("-")[1],10);
							var curr_date = year + "-" + curr_time_arr.split("-")[1];
							facMatRemindMsg += "<div>请更新" + year + "年" + month + "月份报价！  <a href=\"javascript:linkShop('" + curr_date + "')\">" + count + "</a> 家供应商！</div>";
						}
					}
					//true需要提示报价更新提醒
					showRemindFlag = true;
					initFacMatRemindCount();
				}else{
					facMatRemindMsg = "";
				}
				updateRemindList = result;
			}
		}
	});
}

function showFacMatRemind(){
	if (facMatRemindMsg == null || "" == facMatRemindMsg){
		Info_Tip("暂无报价更新提醒！");
		return;
	}
	remind_dialog = art.dialog.notice({
		id : "matRemind",
	    title: '更新提醒',
	    width: 400,// 必须指定一个像素宽度值或者百分比，否则浏览器窗口改变可能导致artDialog收缩
	    content: facMatRemindMsg,
	    icon: 'face-smile'
	    //time: 5
	});
}

function linkShop(date){
	matUpdateOn = date;
	searchList();
	if (remind_dialog != null && typeof(remind_dialog) != "undefined"){
		remind_dialog.close();
	}
}

/**
 * 添加商铺
 */
function showAddWin(){
	window.parent.createNewWidget("enterprise_shop_add", '添加商铺','/module/enterprise/enterprise_shop_add.jsp');
}



function setMonthTop() {
	
	
	fs = new Ext.form.FormPanel({
				layout : 'form',
				height :280,
				autoScroll : true,
				autoWidth : true,
				bodyStyle : 'padding:6px;',
				labelAlign : 'right',
				labelWidth : 60,
				items : [{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name1",
								width : 162,
								allowBlank : false
							}]
				},
				{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								fieldLabel : "企业ID",
								id : "name2",
								width : 162,
								allowBlank : false
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name3",
								width : 162,
								allowBlank : false							
							
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name4",
								width : 162,
								allowBlank : false
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name5",
								width : 162,
								allowBlank : false
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name6",
								width : 162,
								allowBlank : false						
						
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name7",
								width : 162,
								allowBlank : false							
							
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name8",
								width : 168,
								allowBlank : false							
						
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name9",
								width : 162,
								allowBlank : false,						
							
							}]
				},{
					width : 162,
					autoHeight : true,
					bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
					items : [{
								xtype : "textfield",
								id : "name10",
								width : 162,
								allowBlank : false							
								
							}]
				}]
			});
	win = new Ext.Window({
				title : '设置灯饰月销售排行榜',
				width : 190,
				items : [fs],
				modal : true,
				autoHeight : true,
				buttonAlign : 'right',
				buttons : [{
							text : '设置',
							handler : function() {
								setSubfrom();
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}],
				listeners : {
					show : function() {
						hideEl('t_ceid_form');
						hideEl('t_cname1_form');
					}
				}
			});
	win.show();
};


function  setSubfrom(){
	var content="";
	for(var i=1;i<=10;i++){
		content+="id"+i+"~"+Ext.fly("name"+i).getValue();
		if(i!=10){
			content+=";";
		}
	}
	if(content.split(";").length<10){
		return;
	}
	
	var data={};
	data["content"]=content;
	Ext.Ajax.request({
		method : 'post',
		url : "/ep/EpShopServlet?type=43",
		params : data,
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("成功！");
				win.close();
				ds.reload();
			} else {
				Info_Tip("成功！");
				win.close();
			}
		},
		failure : function() {
			Warn_Tip();
			win.close();
		}
	});
	
	
}
//设置优秀企业榜
function setExcellentShop(){
	Ext.Ajax.request({
		url : "/ep/EpShopServlet",
		params : {
			type : 45
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				createFormPanel();
				for(var i = 1; i <= jsondata.result.length; i++){
					Ext.get("eid_" + i).dom.value = jsondata.result[i - 1].eid;
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
function createFormPanel(){
	fs = new Ext.form.FormPanel({
		layout : 'form',
		height :280,
		autoScroll : true,
		autoWidth : true,
		bodyStyle : 'padding:6px;',
		labelAlign : 'right',
		labelWidth : 60,
		items : [{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_1",
						width : 162,
						allowBlank : false
					}]
		},
		{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_2",
						width : 162,
						allowBlank : false
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_3",
						width : 162,
						allowBlank : false							
					
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_4",
						width : 162,
						allowBlank : false
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_5",
						width : 162,
						allowBlank : false
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_6",
						width : 162,
						allowBlank : false						
				
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_7",
						width : 162,
						allowBlank : false							
					
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_8",
						width : 168,
						allowBlank : false							
				
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_9",
						width : 162,
						allowBlank : false,						
					
					}]
		},{
			width : 162,
			autoHeight : true,
			bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;",
			items : [{
						xtype : "textfield",
						fieldLabel : "企业ID",
						id : "eid_10",
						width : 162,
						allowBlank : false							
						
					}]
		}]
	});
	win = new Ext.Window({
			title : '设置优秀企业榜',
			width : 190,
			items : [fs],
			modal : true,
			autoHeight : true,
			buttonAlign : 'right',
			buttons : [{
						text : '设置',
						handler : function() {
							saveExcellentShop();
						}
					}, {
						text : '取消',
						handler : function() {
							win.close();
						}
					}]
		});
	win.show();
}

function saveExcellentShop(){
	var content = "";
	for(var i=1;i<=10;i++){
		var eid = Ext.fly("eid_" + i).getValue();
		if(eid.length == 0){
			Ext.MessageBox.alert("提示", "企业ID不能为空。");
			return;
		}
		if(content.indexOf(eid + ";") != -1){
			Ext.MessageBox.alert("提示", "存在相同的企业ID。");
			return;
		}
		content += eid + ";";
	}
	content = content.substring(0, content.lastIndexOf(";"));
	if(content.split(";").length < 10){
		Ext.MessageBox.alert("提示", "必须填写10个企业ID。");
		return;
	}
	
	Ext.Ajax.request({
		method : 'post',
		url : "/ep/EpShopServlet",
		params : {
			type : 46,
			eids : content
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("设置成功！");
				win.close();
				ds.reload();
			}
		},
		failure : function() {
			Warn_Tip();
			win.close();
		}
	});
}
