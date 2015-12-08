
var ds_info, pagetool, grid_info, pageSize = 20, formPanel, win, form, applyWindow, findWindow, reg2, formUp, formSet;

//创建支付方式下拉框数据
var payTypeData = [
				[' ','--请选择--'],
				['0','网银在线'],
				['1','支付宝'],
				['2','快钱'],
				['3','财富通']
		   ];
		   
var payTypeStore = new Ext.data.SimpleStore({
				fields:['value','text'],
				data:payTypeData
		    });		   
//创建是否开发票下拉框数据
var faPiaoData = [
				[' ','--请选择--'],
				['0','不开发票'],
				['1','开发票']
		   ];
		   
var faPiaoStore = new Ext.data.SimpleStore({
				fields:['value','text'],
				data:faPiaoData
		    });	
//创建客户状态下拉框数据
var customStateData = [
				[' ','--请选择--'],
				['0','请求'],
				['1','支付中'],
				['2','支付成功'],
				['3','支付失败']
		   ];
		   
var customStateStore = new Ext.data.SimpleStore({
				fields:['value','text'],
				data:customStateData
		    });			    
//初始化界面		    
Ext.onReady(function() {
	buildGirid();
})

// 生成列表
function buildGirid() {

	ds_info = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/onlinePay/OnlinePayServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : 'id'
						},
						["payOrder","id", "uid", "userName", "state", "phone","money", "count", "fapiao", "coverType", "payType","payType",'qkarea']),
				baseParams : {
					type : 1,
					pageSize : pageSize,
					pageNo : 1

				},
				countUrl : '/onlinePay/OnlinePayServlet',
				countParams : {
					type : 5
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds_info,
				displayInfo : true,
				pageSize : pageSize
			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid_info = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : ds_info,
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				columns : [
							new Ext.grid.RowNumberer({
									width : 30
							})
							,
							{
								header : '定单号',
								sortable : false,
								width : 160,
								dataIndex : 'payOrder'
							}
							,
							{
								header : '用户ID',
								sortable : false,
								dataIndex : 'uid'
							}
							,
							{
								header : '用户名',
								sortable : false,
								dataIndex : 'userName'
							}
							,
							{
								header : "状态",
								sortable : true,
								width : 70,
								dataIndex : "state",
								renderer : function(v) {
									switch (v) {
										case "0" :
											return "<font color:red>请求</font>";
											break;
										case "1" :
											return "<font color:red>支付中</font>";
											break;
										case "2" :
											return "<font color:red>支付成功</font>";
											break;
										case "3" :
											return "<font color:red>支付失败</font>";
											break;
									}
								}
							}
							, 
							{
								header : '联系信息',
								sortable : false,
								dataIndex : 'phone'
							}
							, 
							{
								header : '支付金额',
								sortable : true,
								dataIndex : 'money'
							}
							, 
							{
								header : '数量',
								sortable : true,
								dataIndex : 'count'
							}
							,
							{
								header : "是否开发票",
								sortable : true,
								width : 70,
								dataIndex : "fapiao",
								renderer : function(v) {
									switch (v) {
										case "0" :
											return "<font color:red>不开发票</font>";
											break;
										case "1" :
											return "<font color:red>开发票</font>";
											break;
									}
								}
							}
							, 
							{
								header : '套餐信息',
								sortable : true,
								dataIndex : 'coverType'
							}, 
							{
								header : '期刊地区',
								sortable : true,
								dataIndex : 'qkarea'
							}
							,
							{
								header : "支付方式",
								sortable : true,
								width : 70,
								dataIndex : "payType",
								renderer : function(v) {
									switch (v) {
										case "0" :
											return "<font color:red>网银在线</font>";
											break;
										case "1" :
											return "<font color:red>支付宝</font>";
											break;
										case "2" :
											return "<font color:red>快钱</font>";
											break;
										case "3" :
											return "<font color:red>财富通</font>";
											break;
									}
								}
							}
						],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				bbar : pagetool,
				renderTo : "online_info"
			});
	//双击显示详细信息页面
	grid_info.on("rowdblclick", function(grid, rowIndex, r) {
				disPalyUser();
			});
	//默认第一次打开的时候加载数据
	ds_info.load();

	var bar2 = new Ext.Toolbar({
				renderTo : grid_info.tbar,
				items : [
						{
							xtype : "label",
							text : "时间段："

						}, 
						{
							id : 'begin',
							xtype : 'datefield',
							format : 'Y-m-d',
							emptyText : '请选择'
						},						
						"到", 
						{
							id : 'end',
							xtype : 'datefield',
							format : 'Y-m-d',
							emptyText : '请选择'
						},
						"-",						
						{
							xtype : "label",
							text : "支付方式："
						}, 
						{
							xtype : 'combo',
							store : payTypeStore,
							id : 'PayType',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							width : 80,
							value : '--请选择--'
						}, 
						"-", 
						{
							xtype : "label",
							text : "需要开发票："
						}, 
						{
							xtype : 'combo',
							store : faPiaoStore,
							id : 'Fapiao',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							width : 80,
							value : '--请选择--'
						},  
						"-", 
						{
							xtype : "label",
							text : "用户ID："
						}, 
						{
							xtype : "textfield",
							id : "Uid",
							fieldLabel : "关键字",
							width : 80
						},
						"-", 
						{
							xtype : "label",
							text : "用户名："
						}, 
						{
							xtype : "textfield",
							id : "UserName",
							fieldLabel : "关键字",
							width : 80
						},
						"-", 
						{
							xtype : "label",
							text : "联系信息："
						}, 
						{
							xtype : "textfield",
							id : "Phone",
							fieldLabel : "关键字",
							width : 80
						}, 
						"-", 
						{
							xtype : "label",
							text : "客户状态："
						}, 
						{
							xtype : 'combo',
							store : customStateStore,
							id : 'State',
							mode : "local",
							triggerAction : "all",
							valueField : "value",
							readOnly : true,
							displayField : "text",
							width : 80,
							value : '--请选择--'
						}, 
						 "-", {
							text : "查询",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}]
			});
};

// 查询
function searchlist() {

	var begin    = Ext.getCmp("begin").getValue();
	var end      = Ext.getCmp("end").getValue();
	var PayType  = Ext.getCmp("PayType").getValue();
	var Fapiao   = Ext.getCmp("Fapiao").getValue();
	var Uid      = Ext.getCmp("Uid").getValue();
	var UserName = Ext.getCmp("UserName").getValue();
	var Phone    = Ext.getCmp("Phone").getValue();
	var State    = Ext.getCmp("State").getValue();
	

	ds_info["baseParams"]["begin"]    = begin;
	ds_info["baseParams"]["end"]      = end;
	ds_info["baseParams"]["PayType"]  = PayType;
	ds_info["baseParams"]["Fapiao"]   = Fapiao;
	ds_info["baseParams"]["Uid"]      = Uid;
	ds_info["baseParams"]["UserName"] = UserName;
	ds_info["baseParams"]["Phone"]    = Phone;
	ds_info["baseParams"]["State"]    = State;
	
	ds_info["countParams"]["begin"]    = begin;
	ds_info["countParams"]["end"]      = end;
	ds_info["countParams"]["PayType"]  = PayType;
	ds_info["countParams"]["Fapiao"]   = Fapiao;
	ds_info["countParams"]["Uid"]      = Uid;
	ds_info["countParams"]["UserName"] = UserName;
	ds_info["countParams"]["Phone"]    = Phone;
	ds_info["countParams"]["State"]    = State;	
	
	ds_info.load();
};

//详细信息展示页面
function disPalyUser() {

	var rows = grid_info.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Info_Tip("请选择至少一条信息。");
		return;
	}
	if (rows.length > 1) {
		Info_Tip("不能批量操作");
		return;
	}

	Ext.Ajax.request({
		url : '/onlinePay/OnlinePayServlet',
		params : {
			type : 6,
			id : rows[0].data["id"]
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				detailInfoView(data);
			}
		},
		failure : function() {
			Warn_Tip("此用户没有添加任何扩展字段");
		}
	});
}

//显示详细信息面板
function detailInfoView(data){
				userMsg = new Ext.form.FieldSet({
					title : '详细信息',
					layout : "table",
					layoutConfig : {
						columns : 2
					},
					autoWidth : true,
					bodyStyle : 'background-color:#DFE8F6',
					items : [{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "订单号："
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "订单号",
									width : 162,
									text : data.result["payOrder"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "支付方式："
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "支付方式",
									width : 162,
									id : "PayType",
									name : 'name',
									text : data.result["payType"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "金额："
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "金额",
									width : 162,
									text : data.result["money"]

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "定购数量："
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "定购数量",
									width : 162,
									text : data.result["count"]
								}]
					}, {
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "是否需要开发票："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "是否需要开发票",
									width : 162,
									text : data.result["fapiao"],
									id:"Fapiao"

								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "所属地区："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "所属地区",
									width : 162,
									text : data.result["belongArea"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "套餐信息："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "套餐信息",
									width : 162,
									text : data.result["coverType"]+" 套餐"
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户ID："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "用户ID",
									text : data.result["uid"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "用户名："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "用户名",
									text : data.result["userName"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "联系方式："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "联系方式",
									text : data.result["phone"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "公司名称："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "公司名称",
									text : data.result["corpName"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "公司地址："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "公司地址",
									text : data.result["corpAddr"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "邮箱："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "邮箱",
									text : data.result["email"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "邮政编码："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "邮政编码",
									text : data.result["code"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "客户备注："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "客户备注",
									text : data.result["remark"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "状态："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "状态",
									text : data.result["state"],
									id:"state"
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "支付日期："
								}]
					},
					{
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "支付日期",
									text : data.result["payTime"]
								}]
					}, 
					{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "修改日期："
								}]
					}, {
						width : 180,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;color:red",
						items : [{
									xtype : "label",
									fieldLabel : "修改日期",
									text : data.result["updateTime"]
								}]
					}]
				});
				
				//支付方式的显示
				switch (data.result["payType"]) {
					case "0" :
						Ext.getCmp("PayType").setText("网银在线");
						break;
					case "1" :
						Ext.getCmp("PayType").setText("支付宝");
						break;
					case "2" :
						Ext.getCmp("PayType").setText("快钱");
						break;
					case "3" :
						Ext.getCmp("PayType").setText("财富通");
						break;
				};
				//支付状态的显示
				switch (data.result["state"]) {
					case "0" :
						Ext.getCmp("state").setText("请求");
						break;
					case "1" :
						Ext.getCmp("state").setText("支付中");
						break;
					case "2" :
						Ext.getCmp("state").setText("支付成功");
						break;
					case "3" :
						Ext.getCmp("state").setText("支付失败");
						break;
				};
				//是否需要开具发票
				switch (data.result["fapiao"]) {
					case "0" :
						Ext.getCmp("Fapiao").setText("需要开具发票");
						break;
					case "1" :
						Ext.getCmp("Fapiao").setText("不需要开具发票");
						break;
				};
				
				onlinePayForm = new Ext.FormPanel({
							id : 'onlinePayForm',
							labelAlign : 'center',
							buttonAlign : 'center',
							plain : true,
							layout : 'table',
							layoutConfig : {
								columns : 1
							},
							labelWidth : 590,
							AutoScroll : true,
							autoHeight : true,
							frame : true,
							items : [userMsg]
						});

				onlinePayWindow = new Ext.Window({
							id : 'wind',
							title : '在线支付详细信息显示页面',
							width : 600,
							height: 600,
							buttonAlign : 'center',
							autoScroll : true,
							modal : true,
							items : onlinePayForm,
							buttons : [{
										text : '关闭',
										handler : function() {
											onlinePayWindow.close();
										}

									}]
						});

				onlinePayWindow.show();
}