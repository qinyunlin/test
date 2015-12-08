Ext.onReady(init);
var ds, grid;
var win, keepWin, form,noComplete="企业信息不全，不提供审核功能！";
var sh = 'CORP_SHOP_AUDIT';
var query_ds = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["eid", "企业ID"],["name", "企业名称"]/*, ["memberID", "用户ID"]*/]
		});
var zhcn = new Zhcn_Select();

//商铺模板类型
var templateArray = [['000100DR00De', '普通版'], ['000100DR00EI', '企业版'],['000100DR00EJ','VIP版']];
var template_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : templateArray
});

function init() {
	buildGrid();
};

function buildGrid() {
	var rightClick = new Ext.menu.Menu({
				id : 'rightClick',
				items : [/*{
							text : '查看/修改',
							hidden : false,
							handler : showDetail,
							hidden : compareAuth("COPR_CXSHOP_MOD") 
						},*/{
							text : '查看申请人联系方式',
							hidden : false,
							handler : showTheApplicantInfo,
							hidden : compareAuth("CORP_CXSHOP_VIEWINFO") 
						},{
							text : '审核',
							handler : openChengXinShop,
							hidden : compareAuth("CORP_CXSHOP_AUDIT"),
						}]
			});
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/wcwUser/wcwUserServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id','eid','memberID', "state", "name","city","province",
								"createOn", "createBy", "updateOn",
								"updateBy","fname","sex","contact","phone","mobile","department"]),
				baseParams : {
					method :"listUserInfo",
					content:'state~1;isIntegrity~1',
					pageSize : 20,
					pageNo : 1
				},
				countUrl : '/wcwUser/wcwUserServlet.do',
				countParams : {
					method:"listUserInfoCount"
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
								}), sm, {
							header : 'id',
							width : 60,
							dataIndex : 'id',
							hidden : true
						},/*{
							header : 'memberID',
							sortable : true,
							width : 60,
							dataIndex : 'memberID',
							hidden : false
						},*/{
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid',
							hidden : false
						}, {
							header : '企业名称',
							sortable : true,
							width : 100,
							dataIndex : 'name'
						}, {
							header : '区域',
							sortable : true,
							width : 100,
							renderer:function(value, metaData, record){
								return record.get("province") + " " + record.get("city");
							}
						},{
							header : '创建时间',
							sortable : true,
							width : 100,
							dataIndex : 'createOn'
						}, {
							header : '更新人',
							width : 80,
							sortable : true,
							dataIndex : 'updateBy'
						}],
				renderTo : 'grid',
				bbar : pagetool,
				tbar : [/*{
							text : '查看/修改',
							hidden : compareAuth("COPR_CXSHOP_MOD"),
							icon : '/resource/images/edit.gif',
							handler : showDetail
						},"-",*/{
							text : '查看申请人联系方式',
							icon : '/resource/images/edit.gif',
							handler : showTheApplicantInfo,
							hidden : compareAuth("CORP_CXSHOP_VIEWINFO"),
						},"-",{
							text : '审核',
							hidden : compareAuth("CORP_CXSHOP_AUDIT"),
							icon : '/resource/images/cart_add.png',
							handler : openChengXinShop
						}]
			});
	// 省份城市级联选择
	var pro = zhcn.getProvince(true);
	pro.unshift("全部省份");
	var city = ["全部城市"];
	comboProvinces = new Ext.form.ComboBox({
				id : 'province',
				store : pro,
				width : 100,
				listeners : {
					select : function(combo, record, index) {
						comboCities.reset();
						var province = combo.getValue();
						if(province =="全部省份"){
							city=["全部城市"];
					    }else {
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
				width : 100,
				listeners : {
					'select' : searchList
				}

			});
	
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : ["-", {
					xtype : "combo",
					id : 'query_key',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					store : query_ds,
					value : "eid"
				}, "-", {
					id : 'query_value',
					xtype : 'textfield',
					width : 100
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchList
				},"-","省份",comboProvinces,"城市",comboCities]
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
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				showDetail()
			});
	ds.load();
};

function openShopFinal(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择商铺");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "此操作不提供批量操作，请选择一个商铺");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	if(row.get("state") == 2){
		Info_Tip("审核已经通过的企业不能再审核！");
		return;	
	}
	
	var memberID = row.get("memberID");
	if(!memberID){
		Info_Tip("该企业没有会员关联");
	}
	
	query = "method=getMemberValidTime&memberID=" + memberID;
	Ext.lib.Ajax.request("post","/mc/Member.do",{
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc,
							jsondata.result)) {
						showValidateWindow(jsondata.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
	},query);
	
	
}





function openChengXinShop(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息");
		return;
	}
	window.parent.createNewWidget("audit_chengxin_enterprise_shop", '审核申请诚信联盟商铺','/module/enterprise/audit_chengxin_enterprise_shop.jsp?memberid='+row.get("memberID") + "&eid=" + row.get("eid"));
}

function showValidateWindow(validate_u){
	var nextYear = new Date();
	nextYear.setFullYear(date.getFullYear() + 1);
	win = new Ext.Window({
		title : "审核",
		width : 360,
		height : 150,
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
						
			
					}else if(record.get("value") == "1"){
						var date = new Date();
						date.setMonth(11,31);
						Ext.getCmp("date_i").setValue(date);
			
					}else if(record.get("value") == "2"){
						var date = new Date();
						date.setFullYear(date.getFullYear() + 1);
						date.setMonth(11, 31);
						Ext.getCmp("date_i").setValue(date);
				
					}else{
						Ext.getCmp("date_i").setValue(new Date());	
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
					text : "审核",
					handler : passShop
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
}	

function passShop(){
	var row = grid.getSelectionModel().getSelected();
	
	var validDate = Ext.fly("date_i").getValue();
	if (isEmpty(validDate)) {
		Ext.MessageBox.alert("提示", "有效日期不能为空!");
		return;
	}
	var	catalogId = Ext.getCmp("catalogId").getValue();
	var memberID = row.get("memberID");
	
	query = "memberID=" + memberID + "&validDate=" + validDate + "&catalogId=" + catalogId;
	Ext.lib.Ajax.request("post","/ep/EpShopServlet?type=26",{
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					// 异步生成，用户不用在页面上等待
					if (getState(jsondata.state, commonResultFunc,jsondata.result)) {
						// 返回生成的企业ID
						var eid = jsondata.result;
						Info_Tip("操作成功!");
						win.close();
						ds.reload();
						if (window.parent.tab_1801_iframe)
							window.parent.tab_1801_iframe.ds.reload();
						
					}
				},
				failure : function() {
					Warn_Tip();
				}
	},query);
	
}

// 搜索
function searchList() {
	var query_key = Ext.getCmp("query_key").getValue();
	var query_value = Ext.getCmp("query_value").getValue();
	var content = "state~1;" + query_key + "~" + query_value + ";";
	
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

//查看/修改信息
function showDetail(){
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
	window.parent.createNewWidget("unaudit_shop_edit", '修改商铺信息',
			'/module/enterprise/unaudit_enterprise_shop_info.jsp?id=' + row.get("id") + '&memberid=' + row.get("memberID"));
};








function showTheApplicantInfo(){
	
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
     
/*	var memberId=row.get("memberID");*/
	var sex=row.get("sex");
	var contact=row.get("contact");
	var name=row.get("name");
	var department=row.get("department");
	var phone="";
	if( row.get("phone")!=null && row.get("phone")!=""  ){
		phone=row.get("phone");
	}
	if( row.get("mobile")!=null && row.get("mobile")!=""){
		phone=row.get("mobile");
	}
	
	if(row.get("phone")!=null && row.get("mobile")!=null && row.get("phone")!="" &&  row.get("mobile")!=""){
		phone=row.get("mobile")+"/"+row.get("phone");
	}
	var base_info =new Ext.form.FieldSet({
		layout : "table",
		border : false,
		frame : true,
		layoutConfig : {
			columns : 2
		},
		items : [{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
			items : [{
						xtype : "label",
						text : "企业名称: "
					}]
		}, {
			width : 240,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : name
					}]
		}, {
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
			items : [{
						xtype : "label",
						text : "申请人: "
					}]
		}, {
			width : 240,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : contact
					},{
						style:"margin-left:10px;",
					    xtype : "label",
						text : sex  
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
			items : [{
						xtype : "label",
						text : "职位: "
					}]
		}, {
			width : 240,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : department
					}]
		},{
			width : 90,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:right;font-size:12px",
			items : [{
						xtype : "label",
						text : "联系方式: "
					}]
		}, {
			width : 240,
			autoHeight : true,
			bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
			items : [{
						xtype : "label",
						text : phone
					}]
		}]
	});
     
	

	
	
	
	win = new Ext.Window({
		title : "查看联系方式",
		width : 400,
		autoHeight : true,
		closeable : true,
		colseAction : 'close',
		modal : true,
		border : false,
		plain : true,
		draggable : true,
		items : [base_info],
		buttonAlign : 'center',
		bodyStyle : 'padding:6px;',
		buttons : [ {
					text : '关闭',
					handler : function() {
						ds.reload();
						win.close();
					}
				}]
	});
win.show();	
}
