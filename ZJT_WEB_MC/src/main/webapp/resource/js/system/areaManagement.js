var root,tree,ds,grid,area="省份",type,province,city,site,id,message;
Ext.onReady(init);
var subcid = "";// 选中的二级分类ID
var upload_form,add_win,add_area,selected_node,edit_area;

function init() {
	getData();
};


//获得材料分类数据
function getData() {
	Ext.Ajax.request({
		url : '/AreaManagementServlet',
		params : {
			type : 4
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				select_ds = "[";
				var len = jsondata.result.length;
				for ( var i = 0; i < len; i++) {
					
					select_ds += "['" + jsondata.result[i]["id"] + "','"
							+jsondata.result[i]["name"] + "','"+ jsondata.result[i]["govSum"]+"'],";
					
				}
				select_ds = select_ds.slice(0, select_ds.lastIndexOf(","));
				select_ds += "]";
				select_ds = select_ds.replace(/\s/g, "");
				select_ds = eval(select_ds);
				buildTree();
				buildGrid();
				buildView();
			}
		},
		failure : function() {
			Warn_Tip();
		}

	});
};

//创建材料分类树
function buildTree() {
	// 异步根节点
	root = new Ext.tree.AsyncTreeNode({
		id : '0',
		draggable : false,
		text : ""
	});
	// 树型控件
	tree = new Ext.tree.TreePanel({
		loader : new Ext.tree.TreeLoader({
			dataUrl : '/AreaManagementServlet?type=3'
		}),
		root : root,
		bodyStyle : 'margin-left:20px;margin-top:20px;width:160px;',
		renderTo : 'tree',
		border : false,
		animate : true,
		autoScroll : true,
		containerScroll : true,
		rootVisible : false
	});

	// 重新装配树型数据
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		try {
			var o = response.responseData || Ext.decode(json);
			if (o.state == "success") {
				o = o.result;
			} else if (o.state == "auth") {
				Info_Tip("对不起，您暂时不能进行此操作。");
				o = [];
			} else if (o.state == "nologin") {
				Info_Tip("对不起，还未登录。");
				o = [];
			}
			node.beginUpdate();
			for ( var i = 0, len = o.length; i < len; i++) {
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				if(o[i].isGov==1 && o[i].isOpen==0){
					o[i].text =   "<font>"+o[i].name+"</font>"+"<img style='padding-left:6px; height:11px;vertical-align:middle;' src='../../resource/images/isGovPrice.png'/>";
				}else if(o[i].isGov==1 && o[i].isOpen==1){
					//o[i].text =   "<font color='red'>"+o[i].name+"</font>"+"<img style='padding-left:6px; height:11px;vertical-align:middle;' src='../../resource/images/isGovPrice.png'/>";
					o[i].text =   "<font>"+o[i].name+"</font>"+"<img style='padding-left:6px; height:11px;vertical-align:middle;' src='../../resource/images/isGovPrice.png'/>";
				}else if(o[i].isGov==0 && o[i].isOpen==1){
					o[i].text =   "<font >"+o[i].name+"</font>";
				}else{
					o[i].text = "<font>"+o[i].name+"</font>";
				}
				
				var n = this.createNode(o[i]);
				if (n) {
					node.appendChild(n);
				}
			}
			node.endUpdate();
			this.runCallback(callback, scope || node, [ node ]);
		} catch (e) {
			this.handleFailure(response);
		}
	};

	// 点击节点事件
	tree.on('click', function(node) {
		selected_node = node;
		node.expand();
		node.select();
		
		if(node.isLeaf()){
		   type=1;
		   province=node.parentNode.text.substring(0,node.parentNode.text.indexOf("</font>")).split(">")[1];
		   var cityString=node.text.substring("0",node.text.indexOf("</font>"));
		   city=cityString.split(">")[1];
		   id=node.id;
		   grid.getColumnModel().setHidden(3,true); 
		}else{
			type=0;
			grid.getColumnModel().setHidden(3,false); 
		}
		ds.baseParams["pid"] =  node.id;
		ds.load();
		node.expand();
	});

	// 收起节点
	root.expand();
	root.select();
};



//主要材料列表
function buildGrid() {
	
	var toolbar = [ {
		text : '统计信息价区域',
		icon : '/resource/images/add.gif',
		hidden : compareAuth("STATISTICAL_INFO_PRICE_AREA"),
		handler:countAreaIsGovPrice
		
	}, {
		text : '生成区域js文件',
		icon : '/resource/images/add.gif',
		hidden : compareAuth("GENERATION_AREAJS_FILE"),
		handler:createZjtcn
		
	}, /*{
		text : '开通/取消站点',
		icon : '/resource/images/edit.gif',
		hidden : compareAuth("OPEN_AREA_SITE"),
		handler:openSite
		
	}*/
	{
		text : '添加区域',
		icon : '/resource/images/add.gif',
		hidden : compareAuth("ADD_AREA"),
		handler:addArea
		
	},
	{
		text : '修改区域名称',
		icon : '/resource/images/edit.gif',
		hidden : compareAuth("EDIT_AREA"),
		handler:editArea
		
	}
	];
	
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/AreaManagementServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, [ 'id', 'regionCode', 'name', 'renPing','isGov','pid']),
		baseParams : {
			type : 1,
			page : 1,
			pageSize : 20,
			pid:0,
			isBlur : 1
		},
		countUrl : '/AreaManagementServlet',
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	var cm = new Ext.grid.CheckboxSelectionModel({
		dataIndex : 'id'
	});
	var pagetool = new Ext.ux.PagingToolbar({
		store : ds,
		displayInfo : true
	});
	grid = new Ext.grid.EditorGridPanel({
		title : "<font color='red'>左侧树中图片代表该区域已包含信息价，点击 统计信息价区域功能按钮后  请手动刷新当前页面重新加载左侧树信息</font>",
		store : ds,
		sm : sm,
		viewConfig : {
			forceFit : true
		},
		autoExpandColumn : 'common',
		frame : true,
		autoHeight : true,
		columns : [ new Ext.grid.RowNumberer({
			width : 30
		}), cm, {
			header : '区域编码',
			sortable : true,
			dataIndex : 'regionCode',
			//renderer : showCode
		}, {
			header : '缩写',
			sortable : true,
			dataIndex : 'renPing',
			/*renderer:function(value,meta,record){
				
				if(type==undefined){
					grid.getColumnModel().setHidden(3,true); 
				}else if(type==0){
					grid.getColumnModel().setHidden(3,false); 
				}else if(type==1){
					grid.getColumnModel().setHidden(3,true); 
				}
				var renPing=record.get("renPing");
				if(renPing == null || renPing==""){
					grid.getColumnModel().setHidden(3,true); 
				}else{
					grid.getColumnModel().setHidden(3,false); 
				}
				return renPing;
			}*/
		}, {
			header : "区域",
			sortable : true,
			dataIndex : 'name',
			renderer : function(value, meta, record) {
				if(type==undefined){
					grid.getColumnModel().setColumnHeader(4,"省份");
				}else if(type==0){
					grid.getColumnModel().setColumnHeader(4,"城市");
				}else if(type==1){
					grid.getColumnModel().setColumnHeader(4,"区县");
				}
				
				var isGov = record.get("isGov");
				var name = record.get("name");
				if(isGov==1){
					return "<span>"+name+"</span><img style='padding-left:6px; height:11px;vertical-align:middle;' src='../../resource/images/isGovPrice.png'/>";
				}
				return name;
			}
	}],
		renderTo : 'areaManagement',
		border : false,
		loadMask : true,
		selModel : new Ext.grid.RowSelectionModel(),
		tbar : toolbar,
		bbar : pagetool
	});
	grid.on('beforeedit', function(e) {
		if (compareAuth("MATERIALBASE_LIB_MOD")) {
			Info_Tip("对不起，您暂时不能进行此操作。");
			return false;
		} else
			return true;
	});

	
ds.load();
grid.getColumnModel().setHidden(3,true); 

};


function buildView() {
	 new Ext.Viewport({
		layout : 'border',
		defaults : {
			border : false
		},
		contentEl : 'view',
		items : [ {
			region : 'west',
			width : 160,
			split : true,
			autoScroll : true,
			items : tree
		}, {
			region : 'center',
			layout : 'fit',
			autoScroll : true,
			items : grid
		} ]
	});
};


//创建区域js文件
function createZjtcn(){
	
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在处理中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	
	var store=Ext.Ajax.request({
		url : '/AreaManagementServlet',
		params : {
			type : 5
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				 loadMarsk.hide();
				Info_Tip("/common/zjtcn_db.js和/common/gov_zjtcn_db.js和/common/city_site.js文件创建成功。");
			} else {
				Warn_Tip(data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}


//区域信息机统计
function countAreaIsGovPrice(){
	 var loadMarsk = new Ext.LoadMask(document.body, {
	    	msg : '正在处理中.....!',
	        disabled : false,
	        store : store
	      });
	  loadMarsk.show();
	
	var store=Ext.Ajax.request({
		url : '/AreaManagementServlet',
		params : {
			type : 6
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				 loadMarsk.hide();
				Info_Tip("统计信息价区域完成。");
				Ext.Ajax.request({
					url : '/AreaManagementServlet',
					params : {
						type : 5
					},
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							
						} else {
							Warn_Tip(data.result);
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
			} else {
				Warn_Tip(data.result);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}

//开通取消站点
function openSite(){
	
	if(type!=1){
		Info_Tip("请选择城市");
		return;
	}else{
		
			 var query = "province=" + province + "&city=" + city;
			 
			   Ext.lib.Ajax.request('post', '/AreaManagementServlet?type=8&id='+ id, {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc,data.result)) {
							 site=data.result.renPing+".zjtcn.com";
							 if(data.result.isOpen==1){
								
								 Ext.MessageBox.confirm("确认操作", "你确定要取消该站点吗？", function(o) {
										if (o == "yes") {
									 
											 var loadMarsk = new Ext.LoadMask(document.body, {
										    	msg : '取消站点处理中.....!',
										        disabled : false,
										        store : store
										      });
										      loadMarsk.show();
											  var store=Ext.lib.Ajax.request('post', '/AreaManagementServlet?type=9&site='+ site+"&id="+id, {
													success : function(response) {
														var data = eval("(" + response.responseText + ")");
														if (getState(data.state, commonResultFunc,data.result)) {
															
															loadMarsk.hide();
															Ext.Msg.alert("提示","取消站点成功!");	
															Ext.Ajax.request({
																url : '/AreaManagementServlet',
																params : {
																	type : 5
																},
																success : function(response) {
																	var data = eval("(" + response.responseText + ")");
																	if (getState(data.state, commonResultFunc, data.result)) {
																		
																	} else {
																		Warn_Tip(data.result);
																	}
																},
																failure : function() {
																	Warn_Tip();
																}
															});
															
														} else{
															loadMarsk.hide();
														}
													},
													failure : function() {
														loadMarsk.hide();
														Ext.Msg.alert('警告', '取消站点失败！');
													}
												},query);
										}
									 });
								
								
							}else{
								Ext.MessageBox.confirm("确认操作", "你确定要开通该站点吗？", function(o) {
									if (o == "yes") {
								 
										 var loadMarsk = new Ext.LoadMask(document.body, {
									    	msg : '开通站点处理中.....!',
									        disabled : false,
									        store : store
									      });
									      loadMarsk.show();
										  var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=8&site='+ site+'&cata_id=000100DF', {
												success : function(response) {
													var data = eval("(" + response.responseText + ")");
													if (getState(data.state, commonResultFunc,data.result)) {
														
														Ext.lib.Ajax.request('post', '/AreaManagementServlet?type=7&id='+ id, {
															success : function(response) {
																var data = eval("(" + response.responseText + ")");
																if (getState(data.state, commonResultFunc,data.result)) {
																	loadMarsk.hide();
																	Ext.Msg.alert("提示","开通站点成功!");	
																	Ext.Ajax.request({
																		url : '/AreaManagementServlet',
																		params : {
																			type : 5
																		},
																		success : function(response) {
																			var data = eval("(" + response.responseText + ")");
																			if (getState(data.state, commonResultFunc, data.result)) {
																				
																			} else {
																				Warn_Tip(data.result);
																			}
																		},
																		failure : function() {
																			Warn_Tip();
																		}
																	});
																 } else{
																	loadMarsk.hide();
																}
															}
															
														});
								
														
													} 
												},
												failure : function() {
													loadMarsk.hide();
													Ext.Msg.alert('警告', '开通站点失败！');
												}
											},query);
									}
								 });
							}
							
						} 
					}
					
				});
		
	}
}


function isOpen(){
	
}


//添加区域
function addArea(){
	if (Ext.isEmpty(selected_node)) {
		Info_Tip("请从左边的导航选择一个地区。");
		return;
	}
	var row = selected_node.attributes;
	add_area = new Ext.form.FormPanel({
		layout:'table',
		border : false,
		labelAlign: "right",
		layoutConfig : {
			columns :1
		},
		items:[{
			layout : "table",
			width:300,
			height:20,
			border : false,
			// autoWidth : true,
			layoutConfig : {
				columns : 2
			},
			style:'margin:8px;',
			items:[{
				xtype:'label',
				text:"添加"+row.name+"下属区域"
			}]
		},
		     {
				layout : "table",
				width:300,
				height:20,
				border : false,
				// autoWidth : true,
				layoutConfig : {
					columns : 2
				},
				style:'margin:8px;',
				items:[{
					xtype:'label',
					text:'区域编码:'
				},{
					id:'code',
					xtype:'textfield'
					
				}]
			},{
				layout : "table",
				width : 300,
				height:20,
				style:'margin-left:8px;margin-bottom:8px;',
				border : false,
				// autoWidth : true,
				layoutConfig : {
					columns : 2
				},
				items:[{
					xtype:'label',
					text:'拼音缩写:'
				},{
					id:'pinyin',
					xtype:'textfield'
					
				}]
			},{
				layout : "table",
				width : 300,
				height:20,
				style:'margin-left:8px;margin-bottom:8px;',
				border : false,
				// autoWidth : true,
				layoutConfig : {
					columns : 2
				},
				items:[{
					xtype:'label',
					text:'中文名称:'
				},{
					id:'city',
					xtype:'textfield'
					
				}]
				
			}
		]
	});
	
	add_win = new Ext.Window({
		title : '',
		width : 400,
		autoHeight : true,
		modal : true,
		items : add_area,
		buttonAlign : 'right',
		buttons : [{
					text : '提交',
					handler : function() {
						saveAddArea(row);
					}
				}, {
					text : '取消',
					handler : function() {
						add_win.close();
					}
				}]
	});
	add_win.show();
}

function saveAddArea(data){
	Ext.Ajax.request({
			url : '/AreaManagementServlet',
			params : {
				type : 11,
				regionCode:Ext.getCmp("code").getValue(),
				renPing:Ext.getCmp("pinyin").getValue(),
				name:Ext.getCmp("city").getValue(),
				pid:data.pid,
				id:data.id
			},
			success : function(response) {
				var json = eval("(" + response.responseText + ")");
				if (getState(json.state, commonResultFunc, json.result)) {
					Info_Tip("添加成功。");
					add_win.close();
				}
				ds.load();
			},
			failure : function() {
				Warn_Tip();
			}
		});
	
	
}


//修改区域名称
function editArea(){
	var areaName,pinyin,code;
	if (Ext.isEmpty(selected_node)){
		Info_Tip("请先从左边导航选择一个地区。");
		return;
	}	
	var data = selected_node.attributes;
	var row = grid.getSelectionModel().getSelected();
	
	if (Ext.isEmpty(row)) {
		areaName = data.name;
		pinyin = data.renPing;
		code = data.regionCode;
	}else{
		areaName = row.get('name');
		pinyin = row.get('renPing');
		code = row.get('regionCode');
	}
	edit_area = new Ext.form.FormPanel({
		layout:'table',
		border : false,
		labelAlign: "right",
		layoutConfig : {
			columns :1
		},
		items:[
		       {
		    	   layout : "table",
		    	   width:300,
		    	   height:20,
		    	   border : false,
		    	   // autoWidth : true,
		    	   layoutConfig : {
		    		   columns : 2
		    	   },
		    	   style:'margin:8px;',
		    	   items:[{
		    		   xtype:'label',
		    		   text:"修改"+areaName+"信息"
		    	   }]
		       },    
	       {
			layout : "table",
			width:300,
			height:20,
			border : false,
			layoutConfig : {
				columns : 2
			},
			style:'margin:8px;',
			items:[{
				xtype:'label',
				text:"中文名称："
			},{
				id:'editName',
				xtype:'textfield',
				value :areaName
			}]
		},
		{
			layout : "table",
			width:300,
			height:20,
			border : false,
			layoutConfig : {
				columns : 2
			},
			style:'margin:8px;',
			items:[{
				xtype:'label',
				text:"区域编码："
			},{
				id:'editCode',
				xtype:'textfield',
				value : code
			}]
		},{
			layout : "table",
			width:300,
			height:20,
			border : false,
			layoutConfig : {
				columns : 2
			},
			style:'margin:8px;',
			items:[{
				xtype:'label',
				text:"拼音缩写："
			},{
				id:'editPinyin',
				xtype:'textfield',
				value : pinyin
			}]
		}
		]
	});
	
	add_win = new Ext.Window({
		title : '',
		width : 400,
		autoHeight : true,
		modal : true,
		items : edit_area,
		buttonAlign : 'right',
		buttons : [{
					text : '提交',
					handler : function() {
						updateAreaName(data,row);
					}
				}, {
					text : '取消',
					handler : function() {
						add_win.close();
					}
				}]
	});
	add_win.show();
}


function updateAreaName(data,row){
	var areaId;
	if (Ext.isEmpty(row)) {
		areaId = data.id;
	}else{
		areaId = row.get('id');
	}
	Ext.Ajax.request({
			url : '/AreaManagementServlet',
			params : {
				type : 12,
				id:areaId,
				editName:Ext.getCmp("editName").getValue(),
				editCode:Ext.getCmp("editCode").getValue(),
				editPinyin:Ext.getCmp("editPinyin").getValue()
			},
			success : function(response) {
				var json = eval("(" + response.responseText + ")");
				if (getState(json.state, commonResultFunc, json.result)) {
					Info_Tip("修改成功。");
					add_win.close();
				}
				ds.load();
			},
			failure : function() {
				Warn_Tip();
			}
		});
	
	
}







