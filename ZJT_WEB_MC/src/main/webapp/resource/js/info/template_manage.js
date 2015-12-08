var tree;
var ds, grid;
var root;
var store, grid;
var infoId = "";
var tagsAll = "";
var infoStore, sortStore;
var sortCombo, site_form, site, tempwebSite = [];

var area_store = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : eval("(" + getUserWeb() + ")")
		});
var tempSite = currSite
tempSite.splice(0, 0, ["", "全部"]);
var province_data = new Ext.data.SimpleStore({
			fields : ['value', 'text'],
			data : tempSite
		});


//模板分类树
var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0001',
				draggable : false,
				text : '模板分类'
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
				node.expand();
				node.select();
				if(node.id == 0){
					infoStore.load();
				}else{
					infoStore.proxy = new Ext.data.HttpProxy({
									url : '/TemplateBase.do?type=6'
								});
					infoStore.reload({
								params:{
									parent_id : node.id,
									pageSize : 20
								},
								countParams : {
									type : '2',
									parent_id : node.id
								}
								});
				}
				node.expand();
			});

	root.expand();
	root.select();
};

//数据绑定区域
var buildGrid = function() {

	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/TemplateBase.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id', 'temp_id', 'parent_id', 'ename', 'cname', 'type',
								'page_url', 'suffix', 'photo_url', 'content', 'note',
								'add_user', 'add_time', 'del_flag', 'modify_user', 'modify_time']),
				baseParams : {
					type : 1,
					pageSize : 20
				},
				countUrl : '/TemplateBase.do',
				countParams : {
					type : '2',
					cata_id : ""
				}
			});
	var sm = new Ext.grid.RowSelectionModel({
				singleSelect : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	grid = new Ext.grid.EditorGridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				viewConfig : {
					forceFit : true
				},
				columns : [new Ext.grid.RowNumberer(), cm, {
							header : 'ID',
							sortable : true,
							dataIndex : 'id',
							width : 40,
							hidden: true
						}, {
							header : '模板ID',
							sortable : true,
							width : 60,
							dataIndex : 'temp_id'
						}, {
							header : '英文名称',
							sortable : true,
							width : 40,
							dataIndex : 'ename'
						}, {
							header : '中文名称',
							sortable : true,
							width : 40,
							dataIndex : 'cname'
						}, {
							header : '模板类型',
							sortable : true,
							width : 40,
							dataIndex : 'type',
							renderer : rederHT
						}, {
							header : '修改人',
							sortable : true,
							dataIndex :'modify_user',
							width : 40
						}, {
							header : '修改时间',
							sortable : true,
							dataIndex :'modify_time',
							width : 40
						}],
				bbar : new Ext.ux.PagingToolbar({
							store : infoStore,
							displayInfo : true
						}),
				viewConfig : {
					forceFit : true
				},
				tbar : [],
				renderTo : 'grid'
			});
	var tbar = new Ext.Toolbar({
				id : 'tbar1',
				renderTo : grid.tbar,
				items : [{
							text : '添加信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						}, '-',{
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						}, '-',{
							id : 'del',
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, '-',{
							text : '模板效果图预览',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/drop-yes.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								picPreView();
							}
						}, '-',{
							text : '查看历史模板',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/table_multiple.png',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								his();
							}
						},'-',{
							id : 'province',
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
						},/*{
							id : 'city',
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
						},*/{
							text : '生成单页静态页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								refreshHtmlPage();
							}
						}, '-',{
							text : '模板效果预览',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/drop-yes.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								templatePreView();
							}
						}]
			});
	
	// 右键菜单定义
	grid.addListener('rowcontextmenu', rightClickFn);
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}, {
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}, {
							text : '删除',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '生成单页静态页面',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : refreshHtmlPage
						}, {
							text : '模板效果预览',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : templatePreView
						}, {
							text : '模板效果图预览',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : picPreView
						},{
							text : '查看历史模板',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : his
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		rightClick1.showAt(e.getXY());
	}
	
	grid.addListener('celldblclick', function(grid, rowIndex, columnIndex, e) {
				if (columnIndex == 7 && !compareAuth("INFO_CONTENT_SORT")) {
					return;
				} else
					edit();
			});
	// grid.addListener('rowdblclick', rowDblClick);
	grid.on("click", function(e) {
//				var rows = grid.getSelectionModel().getSelections();
//				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
//					showEl("bj_menuItem");
//				} else {
//					hideEl("bj_menuItem");
//				}
			});
	function rowDblClick(grid, rowIndex, e) {
		edit();
	}

	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "单页模板";
		} else if (value == 2) {
			html = "多页模板";
		} else if (value == 3) {
			html = "专题模板";
		} else if (value == 4) {
			html = "分页模板";
		} else {
			html = "";
		}
		return html;
	};

	if (!isEmpty(getCurArgs("link"))) {
		if (!isEmpty(tagsAll)) {
			Ext.fly("tags").dom.value = tagsAll;
			infoStore.baseParams['content'] = 'tags~' + tagsAll;
			infoStore.load();
		}
	}
	infoStore.load();
};


// 还原 / 删除 / 彻底删除
var operateRecord = function(act) {
	var rec = grid.getSelectionModel().getSelected();
	if (!rec) {
		Ext.MessageBox.alert("提示", "请先选择信息！");
		return;
	}else{
		var ids = rec.data.id;
	}
	var data = {};
	data["id"] = ids;
	
	
	var actName = "";
	if (act == "del") {
		data["type"] = 4;
		actName = "彻底删除选中信息";
	} 
	Ext.MessageBox.confirm("提示", "确定要" + actName + "?", function(btn) {
				if (btn == "yes") {
					Ext.Ajax.request({
						method : 'post',
						url : '/TemplateBase.do',
						params : data,
						success : function(response) {
							var data = eval("(" + response.responseText + ")");
							if (getState(data.state, commonResultFunc, data.result)) {
								Ext.MessageBox.alert("提示", "删除成功！"/*, closeWin*/);
								infoStore.reload();
							} else {
								Ext.MessageBox.alert("提示", "删除信息失败!");
							}
						},
						failure : function() {
							Warn_Tip();
						}
				
					});
				}
		});
}

// 添加
function add() {
	var rows = tree.getSelectionModel().getSelectedNode();
	cataId = rows.attributes.cata_id;
	parentId = rows.attributes.parent_id;
	if(cataId == null || cataId =="" || cataId.length<5){
		Ext.MessageBox.alert("提示", "请选择模板的分类！");
		return ;
	}
	if(rows.attributes.isLeaf == 0){
		//Ext.MessageBox.alert("提示", "必须选择节点目录");
		return;
	}
	window.parent.createNewWidget("template_add", '添加信息','/module/info/template_add.jsp?cataId=' + cataId);
};
// 修改
function edit() {
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	Id = rows.data.id;
	tempID = rows.data.temp_id;
	parentID = rows.data.parent_id;
	window.parent.createNewWidget("template_edit", '修改信息',
			'/module/info/template_edit.jsp?Id=' + Id + '&tempID=' + tempID + '&parentID=' + parentID + '&marking=1');
};
function picPreView(){
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var picUrl = rows.data.photo_url;
	if (picUrl==null || picUrl==''){
		Ext.Msg.alert("提示", "没有上传效果图");
		return;
	}		
	window.open('/module/info/pic_pre_view.jsp?picUrl='+picUrl);
};
// 查看历史
function his() {
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	Id = rows.data.id;
	tempID = rows.data.temp_id;
	parentID = rows.data.parent_id;
	window.parent.createNewWidget("template_his", '查看历史模板',
			'/module/info/template_his.jsp?Id=' + Id + '&tempID=' + tempID + '&parentID=' + parentID);
};

//重新刷新单页模板
function refreshHtmlPage() {
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var autoid    = rows.data.id;
	var temp_id   = rows.data.temp_id;
	var parent_id = rows.data.parent_id;

	var site =Ext.getCmp("province").getValue()+".zjtcn.com";
	var province = Ext.getCmp("province").getRawValue();
	
	var params = {};
	params["templateId"]= autoid;
	params["site"]=site;

	params["province"] = province;
     var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成内容页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
	
	
	var store=Ext.Ajax.request({
		method : 'post',
		url : '/TemplateHtml.do?type=5',
		params : params,
		success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					loadMarsk.hide();
					Info_Tip("生成内容页面成功");
				
					infoStore.reload();
				} else {
					Info_Tip("生成内容页面失败！");
				}
				},
				failure : function() {
					 Warn_Tip();
				}

	});	
}
function templatePreView() {
	var rows = grid.getSelectionModel().getSelected();
	if (isEmpty(rows)) {
		Ext.Msg.alert("提示", "请选择信息");
		return;
	}
	var autoid    = rows.data.id;
	var parent_id = rows.data.parent_id;
	var ename = rows.data.ename;
	var province =Ext.getCmp("province").getValue();
	var city =Ext.getCmp("city").getValue();
	//window.open("/velocityPreView.do?pid=" + parent_id + "&ename=" + ename);
	window.open("/TemplateHtml.do?type=2&templateId=" + autoid + "&province=" + encodeURI(encodeURI(province)) + "&city=" + encodeURI(encodeURI(city)));
}
var buildLayout = function() {
	var view = new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [{
							region : 'west',
							width : 180,
							split : true,
							autoScroll : true,
							items : tree
						}, {
							region : 'center',
							layout : 'fit',
							autoScroll : true,
							items : grid
						}]
			});
};

function init() {
	tagsAll = getCurArgs("tagsAll");
	if (isEmpty(tagsAll)) {
		tagsAll = "";
	}
	// getUserWebSite();
	buildTree();
	buildGrid();
	buildLayout();
	// Ext.TipSelf.msg('提示', '请先选择分类。');
};

Ext.onReady(function() {
			init();
		});
