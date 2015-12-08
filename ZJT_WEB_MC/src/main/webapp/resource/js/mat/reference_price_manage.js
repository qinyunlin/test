Ext.onReady(init);
var grid, ds,  pagesize = 20,id,win;
function init() {
	buildGrid();


	//年份赋值 为今年 下一年 和上一年
    year_array = [[new Date().getFullYear()+1,new Date().getFullYear()+1],
	                  [new Date().getFullYear(),new Date().getFullYear()],
	                  [new Date().getFullYear()-1,new Date().getFullYear()-1]
		          		];
	Ext.QuickTips.init();
	Ext.TipSelf.msg('提示', '双击信息可以显示备注详细，再次双击可以编辑列表信息。');
};
// 右键菜单
var rightClick = new Ext.menu.Menu({
	id : 'rightClickCont',
	shadom : false,
	items : [/*{
				id : 'rMenu1',
				icon:'/resource/images/add.gif',
				text : '发布',
				hidden : compareAuth("RELEASE_REFERENCE_PRICE"),
				handler : release
		
			},*/ {
				id : 'rMenu2',
				text : '修改',
				handler:updateGoto,
				hidden : compareAuth("UPDATE_REFERENCEPRICE_TITLE")
			}, {
				id : 'rMenu3',
				text : '删除',
				hidden : compareAuth("DELETE_REFERENCEPRICE_TITLE"),
				handler:del_sel

			}]
});


function buildGrid() {
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/material/MaterialServlet.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						},["id","title", "issueDate","remark","updateOn"]),
				baseParams : {
					type : 44,
					page : 1,
					pageSize : pagesize		
				},
				countUrl : '/material/MaterialServlet.do',
				countParams : {
					type : 45
				},
				remoteSort : true,
				timeout : 2 * 60 * 1000
			});
	ds.setDefaultSort("issuedate", "DESC");

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
		autoScroll : true,
		store : ds,
		loadMask : true,
		viewConfig : {
			forceFit : true
		},
		sm : sm,

		autoHeight : true,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm,{
					header:'批次标题',
					sortable:false,
					dataIndex:'title'
				},{
					header : '发布时间',
					sortable : true,
					dataIndex : 'issueDate'
				},{
					header:'更新时间',
					sortable:true,
					dataIndex:'updateOn'
					
				}],
		renderTo : 'rPrice_grid',
		bbar : pagetool,
		tbar : [/*{
					text : '发布',
					icon : '/resource/images/add.gif',
					hidden : compareAuth("RELEASE_REFERENCE_PRICE"),
					handler : release
				}, '-',*/ {
					text : '修改',
					icon : '/resource/images/edit.gif',
					handler :updateGoto,
					hidden : compareAuth("UPDATE_REFERENCEPRICE_TITLE")
				}, '-', {
					text : '删除',
					icon : '/resource/images/delete.gif',
					handler : del_sel,
					hidden : compareAuth("DELETE_REFERENCEPRICE_TITLE")
				},/* '-', {
					text : '参考价统计',
					hidden : compareAuth("REFERENCEPRICE_DETAIL_LIST"),
					icon : '/resource/images/edit.gif',
					handler : showReferencePriceDetail
				},*/ '-',{
					text : '导出',
					hidden : compareAuth("EXPORT_REFERENCEPRICE_TITLE"),
					icon : '/resource/images/edit.gif',
					handler : exportRefPrice
				}]
	});
	
	//ds.load();


	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
};

//发布参考材价
function release() {
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	if(id !=null && id !="" && id !="ext-gen1"){
					var panel = new Ext.Panel({
						layout : "form",
						bodyStyle : 'border:none;padding:6px;',
						items : [{
										layout : 'table',
										bodyStyle : 'border:none',
										layoutConfig : {
											columns : 5
										 },
										 autoWidth : true,
										 autoHeight : true,
										items : [{width : 40,
											autoHeight : true,
											bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;;font-size:12px",
											items : [{
												
												xtype : 'label',
												width : 40,
											    text:'标题:'
											}]}, {
											width : 90,
											autoHeight : true,
											bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
											items : [{
												id : "year_input",
												xtype : 'combo',
												width : 85,
												mode : "local",
												triggerAction : "all",
												allowBlank : false,
												store : year_array,
												value : new Date().getFullYear()
											}]
										},  {
											width : 15,
											autoHeight : true,
											bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
											items : [{
												xtype:'label',
												text:'年'
											}]
										},  {
											width : 90,
											autoHeight : true,
											bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
											items : [ {
												id : 'month_input',
												width : 85,
												xtype : 'combo',
												mode : "local",
												allowBlank : false,
												triggerAction : "all",
												store : month_array,
												value :new Date().getMonth()+1
											     
											}]
										},  {
											width : 60,
											autoHeight : true,
											bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
											items : [{
												xtype:'label',
												text:'月参考价'
											}]
										
									}]
						},{
							layout : 'column',
							bodyStyle : 'border:none;margin-top:10px;',
							autoWidth : true,
							autoHeight : true,
						    items:[{
									width : 40,
									autoHeight : true,
									height:20,
									bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
									items : [{
										xtype:'label',
										text:'备注：'
									}]
								
							},{
								width : 400,
								autoHeight : true,
								bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
								items : [{
									 xtype : 'textarea',
							            id : 'desc',
							            width:350,
							            height:100
								}]
							
						}]
						}]
					});

					win = new Ext.Window({
								title : '发布',
								width :500,
								draggable : true,
								modal : true,
								autoHeight : true,
								autoScroll : true,
								items : [panel],
								buttons : [{
											text : '确定',
											handler : save
										}, {
											text : '取消',
											style:"margin-right:160px;",
											handler : function() {
												win.close();
											}
										}]
							});
					win.show();
			
		
		

		
		
	}else{
		Info_Tip("请选择一个城市圈！");
		return;
	}
	
	
};

//保存信息
function save(){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var year = Ext.getCmp("year_input").getValue();
	if(year == null && year ==""){
		alert("年份不能为空");
		return;
	}
	var month = Ext.getCmp("month_input").getValue();
	if(month == null && month ==""){
		alert("月份不能为空");
		return;
	}
	var issueDate=year+"-"+"0"+month+"-05";
	var notes = Ext.getCmp("desc").getValue();
	win.close();
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在处理中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	var store=Ext.Ajax.request({
		url : '/GovMatTitle.do',
		method:'POST',
		params:{
			type:10,
			title:year+"年"+month+"月份参考价",
			cityCircleId:id,
			issueDate:issueDate,
			notes:notes
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				loadMarsk.hide();
				Info_Tip("发布成功。");
				//ds.baseParams["cityRingId"] = id;
				ds.load();

			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			loadMarsk.hide();
			Warn_Tip();
		}
	});
}
//跳转到修改
function updateGoto(){
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一条信息");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var issueDate = row.get("issueDate");
	var title = row.get("title");
	//var notes = row.get("reMark");
	var notes = row.get("remark");
	var panel = new Ext.Panel({
		layout : "form",
		bodyStyle : 'border:none;padding:6px;',
		items : [{
						layout : 'table',
						bodyStyle : 'border:none',
						layoutConfig : {
							columns : 5
						 },
						 autoWidth : true,
						 autoHeight : true,
						items : [{width : 40,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;;font-size:12px",
							items : [{
								
								xtype : 'label',
								width : 40,
							    text:'标题:'
							}]}, {
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								id : "year_input",
								xtype : 'combo',
								width : 85,
								mode : "local",
								triggerAction : "all",
								allowBlank : false,
								editable : false,
								store : year_array,
								value : issueDate.split("-")[0]
							}]
						},  {
							width : 15,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								xtype:'label',
								text:'年'
							}]
						},  {
							width : 90,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [ {
								id : 'month_input',
								width : 85,
								xtype : 'combo',
								mode : "local",
								allowBlank : false,
								editable : false,
								triggerAction : "all",
								store : month_array,
								value :parseInt(issueDate.split("-")[1])
							     
							}]
						},  {
							width : 60,
							autoHeight : true,
							bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
							items : [{
								xtype:'label',
								text:'月参考价'
							}]
						
					}]
		},{
			layout : 'column',
			bodyStyle : 'border:none;margin-top:10px;',
			autoWidth : true,
			autoHeight : true,
		    items:[{
					width : 40,
					autoHeight : true,
					height:20,
					bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
					items : [{
						xtype:'label',
						text:'备注：'
					}]
				
			},{
				width : 400,
				autoHeight : true,
				bodyStyle : "border:none;min-height:20px;_height:20px;text-align:left;font-size:12px",
				items : [{
					 xtype : 'textarea',
			            id : 'desc',
			            width:350,
			            height:100,
			            value:notes
				}]
			
		    }]
		}]
	});

	win = new Ext.Window({
				title : '修改参考价',
				width :500,
				draggable : true,
				modal : true,
				autoHeight : true,
				autoScroll : true,
				items : [panel],
				buttons : [{
							text : '确定',
							handler : function(){
								updateTitle(title,id,issueDate);
							}
						}, {
							text : '取消',
							style:"margin-right:160px;",
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

//更新参考价标题
function updateTitle(name,id,datetime){
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var year = Ext.getCmp("year_input").getValue();
	if(year == null && year ==""){
		Ext.MessageBox.alert("年份不能为空");
		return;
	}
	var month = Ext.getCmp("month_input").getValue();
	if(month == null && month ==""){
		Ext.MessageBox.alert("月份不能为空");
		return;
	}
	var issueDate=year+"-"+"0"+month+"-05";
	if (issueDate == datetime.split(" ")[0]){
		Ext.MessageBox.alert("提示", "标题未改变，无需保存！");
		return false;
	}
	var notes = Ext.getCmp("desc").getValue();
	var contents="oldTitle~"+name+";title~"+year+"年"+month+"月份参考价"+";issueDate~"+issueDate+";datetime~"+datetime;
	win.close();
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在处理中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	var store=Ext.Ajax.request({
		url : '/material/MaterialServlet.do',
		method:'POST',
		params:{
			type:47,
			content:contents,
			province:province,
			cityCircleId:id,
			notes:notes
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				  loadMarsk.hide();
				Info_Tip("修改成功。");

				//ds.baseParams["cityRingId"] =  id;
				ds.load();

			}else{
				loadMarsk.hide();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
};
// 删除参考价标题
function del_sel() {
	var province = ds.baseParams["province"];
	/*if (id == null || "" == id){
		Info_Tip("请选择城市圈！");
		return false;
	}*/
	var sels = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(sels)) {
		Info_Tip("请选择一条信息");
		return;
	}
	if (sels.length > 1) {
		Ext.Msg.alert("提示", "请选择一条信息");
		return;
	}
	var row = grid.getSelectionModel().getSelected();
	var issueDate = row.get("issueDate");
	
	Ext.MessageBox.confirm("确认操作", "确定删除该批次参考价？", function(o) {
				if (o == "yes") {
					 var loadMarsk = new Ext.LoadMask(document.body, {
					    	msg : '正在处理中.....!',
					        disabled : false,
					        store : store
					      });
					  loadMarsk.show();
					var store=Ext.lib.Ajax.request("post", '/material/MaterialServlet.do?type=48', {
								success : function(response) {
									var jsondata = eval("("
											+ response.responseText + ")");
									if (getState(jsondata.state,
											commonResultFunc, jsondata.result)) {
										  loadMarsk.hide();
										Info_Tip("删除成功。");
										//ds.baseParams["cityRingId"] =  id;
										ds.load();
							
									}else{
										 loadMarsk.hide();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							//}, "issueDate=" + issueDate+"&cityCircleId="+id + "&province=" + province);
						}, "issueDate=" + issueDate + "&province=" + province);
				}
			});

};

/**
 * 导出
 */
function exportRefPrice(){
	/*var cityCircleId = ds.baseParams["cityCircleId"];
	if (cityCircleId == null || "" == cityCircleId) {
		Ext.MessageBox.alert("提示", "请选择一个城市圈！");
		return false;
	}*/
	var province = ds.baseParams["province"];
	if (province == null || "" == province) {
		Ext.MessageBox.alert("提示", "请选择一个省份！");
		return false;
	}
	var rows = grid.getSelectionModel().getSelections();
	var issueDates = [];
	for ( var i = 0; i < rows.length; i++) {
		issueDates.push("'" + rows[i].get("issueDate").split(" ")[0] + "'");
	}
	//var param = "cityRingId=" + cityCircleId + "&issueDates=" + issueDates.toString();
	var param = "issueDates=" + issueDates.toString();
	$("#content").val("province~" + province);
	window.document.exportform.action = "/material/MaterialServlet.do?type=49&"
		+ param;
	window.document.exportform.submit();
}

function buildView() {
	 new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'west',
			width : 200,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			items : grid
		} ]
	});
};

function showMsg(msg){
	Ext.MessageBox.alert("提示", msg);
	return false;
}

/**
 * 参考价统计
 */
function showReferencePriceDetail(){
	window.parent.createNewWidget("referencePrice_detail", '参考价统计',
	'/module/mat/referencePrice_detail_list.jsp');
}

