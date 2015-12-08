/**/
var tree;
var ds, grid;
var root;
var treeid;
var site;
var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0001',
				draggable : false,
				text : '模板分类管理'
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/TemplateCatalog.do?type=1'
						}),
				root : root,
				renderTo : 'tree',
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true
			});

	/* 修改返回的数据 */
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

				o[i].text = o[i].cname;
				o[i].id = o[i].cata_id;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}else{
					o[i].leaf = false;
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
	tree.on('click', function(node) {
		        treeid=node.id;
				node.expand();
				node.select();
				if (node.isLeaf()) {
					ds.proxy = new Ext.data.HttpProxy({
								url : '/TemplateCatalog.do?type=6'
							});
					ds.load({
								params : {
									cata_id : node.id
								}
							});
				} else {
					ds.proxy = new Ext.data.HttpProxy({
								url : '/TemplateCatalog.do?type=1'
							});
					ds.load({
								params : {
									node : node.id
								}
							});
				}
				node.expand();
			});

	root.expand();
	root.select();
};

var buildGrid = function() {

	ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/TemplateCatalog.do?type=1'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'cata_id', 'parent_id', 'ename', 'cname','isLeaf', 'modify_user', 'modify_time'])
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : ds,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), cm, {
							header : 'ID',
							width : 20,
							sortable : true,
							dataIndex : 'id'
						}, {
							header : '模板分类ID',
							width : 50,
							sortable : true,
							dataIndex : 'cata_id'
						}, {
							header : '模板父类ID',
							width : 40,
							sortable : true,
							dataIndex : 'parent_id'
						}, {
							header : '分类中文名称',
							width : 100,
							sortable : true,
							dataIndex : 'cname',
							editor : new Ext.form.TextField()
						}, {
							header : '分类英文名称',
							width : 100,
							sortable : true,
							dataIndex : 'ename',
							editor : new Ext.form.TextField()
						}, {
							header : '修改人',
							width : 60,
							sortable : true,
							dataIndex : 'modify_user'
						}, {
							header : '是否为叶子节点',
							width : 60,
							sortable : true,
							dataIndex : 'isLeaf',
							hidden :true
						}, {
							header : '修改时间',
							width : 100,
							sortable : true,
							dataIndex : 'modify_time'
						}],
				renderTo : 'grid',
				border : false,
				selModel : new Ext.grid.RowSelectionModel()
			});
	grid.on('afteredit', function(e) {
		if (e.record.data.cname == "" || e.record.data.ename == "") {
			Ext.Msg.alert("提示", "分类名称不能为空！");
			return;
		}
		var cn = e.record.data.cname.match(/^([\u4e00-\u9fa5\0-9 ]){1,10}$/); 
		if(!cn){
			Ext.MessageBox.alert("提示", "分类中文名称请填写中文！");
			return ;
		}
		var en = e.record.data.ename.match(/^[a-zA-Z0-9]+$/);
		if(!en){
			Ext.MessageBox.alert("提示", "分类英文名称请填写英文！");
			return ;
		}
		Ext.Msg.confirm("提示", "您确定要修改该分类?", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request('post', '/TemplateCatalog.do', {
										success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state, commonResultFunc, data.result)) {
											var node = tree.getSelectionModel().getSelectedNode();
											if(!node.isLeaf()){
												node = node.findChild('id',
															e.record.data.cata_id);
											}	
											if (node) {
												node.setText(e.record.data.cname);
											}
											ds.reload();
											 Ext.MessageBox.alert("提示",
											 "修改成功！");
										} else {
											Ext.MessageBox.alert("提示", "修改失败！");
										}
									},
									failure : function() {
										Ext.Msg.alert('警告', '操作失败。');
									}
								}, "id=" + e.record.data.id + "&cata_id="
										+ e.record.data.cata_id + "&type=5&cname="
										+ e.record.data.cname + "&ename="
										+ e.record.data.ename + "&isLeaf="
										+ e.record.data.isLeaf);
					}
				});
	});
	ds.load({
				params : {
					node : '0'
				}
			});
};

var buildLayout = function() {
	var view = new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [{
							region : 'north',
							contentEl : 'north-div',
							height : 25,
							tbar : [{
										text : '新增',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/add.gif',
										hidden : compareAuth("TEMPLATE_CALOG_ADD"),
										handler : showAddType
									}, '-', {
										text : '删除',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/delete.gif',
										hidden : compareAuth("TEMPLATE_CALOG_DEL"),
										handler : del
									},'-', {
										text : '更新模板数据库',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler :function(){
												 var loadMarsk = new Ext.LoadMask(document.body, {
											    	msg : '更新所有模板处理中.....!',
											        disabled : false,
											        store : store
											      });
											      loadMarsk.show();
										  var store= Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=6', {
													success : function(response) {
														var data = eval("(" + response.responseText + ")");
														if (getState(data.state, commonResultFunc,data.result)) {
															    loadMarsk.hide();
															Ext.Msg.alert("提示","更新所有模板成功!");	
														} 
													},
													failure : function() {
														Ext.Msg.alert('警告', '更新所有模板失败！');
													}
												});
										}
									},'-', {
										text : '更新模板文件',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler :function(){
											var rows = treeid;
											if (isEmpty(rows)) {
												Ext.Msg.alert("提示", "请选择信息");
												return;
											}
												 var loadMarsk = new Ext.LoadMask(document.body, {
												    	msg : '生成所有模板处理中.....!',
												        disabled : false,
												        store : store
												      });
												      loadMarsk.show();
										  var store= Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=7&parentId='+treeid, {
													success : function(response) {
														var data = eval("(" + response.responseText + ")");
														if (getState(data.state, commonResultFunc,data.result)) {
															loadMarsk.hide();
															Ext.Msg.alert("提示","生成所有模板成功!");	
														} 
													},
													failure : function() {
														Ext.Msg.alert('警告', '生成所有模板失败！');
													}
												});
										}
									}, '-' , {
										id : 'site_province',
										xtype : 'combo',
										triggerAction : 'all',
										mode : 'local',
										valueField : 'value',
										displayField : 'text',
										emptyText : '选择生成静态页面的省份',
										width : 170,
										store : new Ext.data.SimpleStore({
											fields : ['text','value'],
											data : siteProvince
										})
								/*		readOnly: true,
										disabled : true*/
										/*listeners : {
											select : function(combo, record, index){
												var province = combo.getValue();
												Ext.getCmp('site_sel').store.loadData(siteArray[province]);
												Ext.getCmp('site_sel').setValue(siteArray[province][0][1]);
												Ext.getCmp('site_sel').enable();
											}
										}*/
									}/*,{
										id : 'site_sel',
										xtype : 'combo',
										triggerAction : 'all',
										store : new Ext.data.SimpleStore({
											fields : ['text','value'],
											data : siteArray['广东']
										}),
										mode : 'local',
										displayField : 'text',
										valueField : 'value',
										width : 150,
										readOnly: true,
										disabled : true
									}*/, '-', {
										text : '生成站点静态页面 ',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler : createAllHtml
									}, '-', {
										text : '生成所有站点静态页面',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler : createAllSiteHtml
									},'-',{
										text : '生成询价学堂询价详情静态页面',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler : createAskPriceHtml
									},'-', {
										text : '生成网材网站点静态页面',
										cls : 'x-btn-text-icon',
										icon : '/resource/images/arrow_refresh.png',
										handler : generationWcwHtml
									},'->', '双击表格可以修改资料']
						}, {
							region : 'west',
							width : 180,
							split : true,
							autoScroll : true,
							items : tree
						}, {
							region : 'center',
							layout : 'fit',
							items : grid
						}]
			});
};

// 增加分类
var create = function(cname,ename) {
	if(cname == "" || ename == "" || cname == null || ename == null){
		Ext.MessageBox.alert("提示", "填写正确填写分类名称！");
		return ;
	}
	var cn = cname.match(/^([\u4e00-\u9fa5\0-9 ]){1,10}$/); 
	if(!cn){
		Ext.MessageBox.alert("提示", "分类中文名称请填写中文！");
		return ;
	}
	var en = ename.match(/^[a-zA-Z0-9]+$/);
	if(!en){
		Ext.MessageBox.alert("提示", "分类英文名称请填写英文！");
		return ;
	}
	
	var node = tree.getSelectionModel().getSelectedNode();
	if (node) {
		Ext.lib.Ajax.request('post', '/TemplateCatalog.do', {
					success : function(response) {
						var data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							  node.leaf = false;
							  node.appendChild(new Ext.tree.AsyncTreeNode({ id :
							  data.result, text : cname, leaf : true }));
							  node.getUI().removeClass('x-tree-node-leaf');
							  node.getUI().addClass('x-tree-node-expanded');
							  node.expand(); 
							  ds.reload();
							  addTypeForm.getForm().reset(); 
							  addTypeWin.hide();
							  Ext.MessageBox.alert("提示", "增加成功！");
						}
					},
					failure : function() {
						Ext.MessageBox.alert("提示", "增加失败！");
					}
				}, "node=" + node.id + "&type=3&cname=" + cname +"&ename=" + ename);
	}
};

// 删除分类
var del = function() {
	var id;
	var parent_id;
	
	//判断复选框有否选中
	if(grid.getSelectionModel().getSelected()!=null){
		rec = grid.getSelectionModel().getSelected();
		id = rec.data.cata_id;
		parent_id = rec.data.parent_sid;
	}else{
		rec = tree.getSelectionModel().getSelectedNode();
		id = rec.attributes.cata_id;
		parent_id = rec.attributes.parent_id;
	}
	
	Ext.Msg.confirm("提示", "您确定要删除该分类?", function(op) {
		if (op == "yes") {
			Ext.lib.Ajax.request('post', '/TemplateCatalog.do', {
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc,
											data.result)) {
								Ext.Msg.alert("提示","分类删除成功!");				
								var snode = tree.getSelectionModel()
										.getSelectedNode();
								if (snode.id == id) { // 当前树节点是要删除的节点
									ds.proxy = new Ext.data.HttpProxy({
												url : '/TemplateCatalog.do?type=1'
											});
									ds.load({
												params : {
													node :snode.pid
												}
											});
									snode.remove();
								} else { // 通过id查找子节点
									var node = snode.findChild('id', id);
									node.remove();
								}
								root.select();
							} 
						},
						failure : function() {
							Ext.Msg.alert('警告', '操作失败。');
						}
					}, "cata_id=" + id + "&node=" + parent_id + "&type=4");
		}
	});
};

function createAllSiteHtml()
{
	if (isEmpty(treeid)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var site_cata_id;
	if(treeid.length < 8){
		Ext.MessageBox.alert("提示", "请选择站点模板！");
		return;
	}
	if(treeid.length > 8){
		site_cata_id = treeid.substring(0,8);
	}else{
		site_cata_id = treeid;
	}
    var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成所有站点静态页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
    var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=9&cata_id='+site_cata_id, {
			success : function(response) {
					var data = eval("(" + response.responseText + ")");
					
					if (getState(data.state, commonResultFunc,data.result)) {
						 loadMarsk.hide();
						Ext.Msg.alert('生成所有站点单页模板静态页面成功！');
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '生成所有站点单页模板静态页面超时！');
				}
			});
	
}
	 

function createAskPriceHtml(){
	if (isEmpty(treeid)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}

	
    var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成所有站点静态页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
    var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=15', {
			success : function(response) {
					var data = eval("(" + response.responseText + ")");
					
					if (getState(data.state, commonResultFunc,data.result)) {
						 loadMarsk.hide();
						Ext.Msg.alert('生成询价学堂模板静态页面成功！');
					} 
				},
				failure : function() {
					Ext.Msg.alert('警告', '生成询价学堂模板静态页面失败！');
				}
			});
}
	
//生成网材网静态页面方法
function generationWcwHtml(){
	if (isEmpty(treeid)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var site_cata_id;
	if(treeid.length < 8){
		Ext.MessageBox.alert("提示", "请选择站点模板！");
		return;
	}
	if(treeid.length > 8){
		site_cata_id = treeid.substring(0,8);
	}else{
		site_cata_id = treeid;
	}
	 var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成单个站点静态页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
      var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=1&site=www.ccwcw.com'+'&cata_id='+site_cata_id, {
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc,data.result)) {
					loadMarsk.hide();
					Ext.Msg.alert("提示","生成所有单页模板静态页面成功!");	
				} 
			},
			failure : function() {
				Ext.Msg.alert('警告', '生成所有单页模板静态页面失败！');
			}
		});
}

function createAllHtml() {
	if (isEmpty(treeid)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	if(Ext.getCmp("site_province").getRawValue() == ''){
		Ext.MessageBox.alert("提示", "请选择生成静态页面的站点");
		return;
	}
	var site_cata_id;
	if(treeid.length < 8){
		Ext.MessageBox.alert("提示", "请选择站点模板！");
		return;
	}
	if(treeid.length > 8){
		site_cata_id = treeid.substring(0,8);
	}else{
		site_cata_id = treeid;
	}
	var query = "province=" + Ext.getCmp("site_province").getRawValue();
	 var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成单个站点静态页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
     
	var store=Ext.lib.Ajax.request('post', '/TemplateHtml.do?type=8&site='+ Ext.getCmp("site_province").getValue()+'.zjtcn.com'+'&cata_id='+site_cata_id, {
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (getState(data.state, commonResultFunc,data.result)) {
					loadMarsk.hide();
					Ext.Msg.alert("提示","生成所有单页模板静态页面成功!");	
				} 
			},
			failure : function() {
				Ext.Msg.alert('警告', '生成所有单页模板静态页面失败！');
			}
		},query);
}
/* 新增分类 */
var addTypeWin;
var addTypeForm;
var buildAddType = function() {
	addTypeForm = new Ext.form.FormPanel({
				layout : 'table',
				layoutConfig : {
					columns : 1
				},
				frame : true,
				labelAlign : 'right',
				height : 66,
				autoWidth : true,
				hideBorders : true,
				items : [{
							layout : 'form',
							items : {
								id : 'cname',
								fieldLabel : '分类中文名称',
								name : 'cname',
								xtype : "textfield"
							}
						}, {
							layout : 'form',
							items : {
								id : 'ename',
								fieldLabel : '分类英文名称',
								name : 'ename',
								xtype : "textfield"
						}
					}]
			});

	addTypeWin = new Ext.Window({
				el : 'add_type_win',
				width : 370,
				height : 138,
				title : '新增分类',
				layout : 'column',
				border : false,
				frame : true,
				buttonAlign : 'center',
				labelAlign : 'right',
				closeAction : 'hide',
				modal : true,
				items : [{
							columnWidth : 1,
							items : {
								items : addTypeForm
							}
						}],
				buttons : [{
							text : '确定',
							handler : function() {
								create(addTypeForm.getForm().getEl().dom.cname.value
										,addTypeForm.getForm().getEl().dom.ename.value);
							}
						}, {
							text : '取消',
							handler : function() {
								addTypeWin.hide();
							}
						}],
				listeners : {
					"hide" : function(){
						addTypeForm.getForm().reset();
					}
				}
			});
};

var showAddType = function() {
	if (addTypeWin == null) {
		buildAddType();
		addTypeWin.show();
	} else {
		addTypeWin.show();
	}
};
/* end新增分类 */

var init = function() {
	buildTree();
	buildGrid();
	buildLayout();
};

Ext.onReady(init);