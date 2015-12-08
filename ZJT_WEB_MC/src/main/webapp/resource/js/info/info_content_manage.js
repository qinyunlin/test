/**/
var tree,selectTree;
var ds, grid;
var root,selectRoot;
var infoStore;
//用来保存栏目ID信息
var tidGlobal = "";
var tPathGlobal = "";
var path;
var upload_form;
var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];
var curr_node_path = '';
var curr_typeName = '';

var buildTree = function() {
	root = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '信息分类管理'
			});
	tree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/InfoContentType.do?type=1'
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

				o[i].text = o[i].name;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
				}
				var n = this.createNode(o[i]);
				//扩展node节点的属性，保存栏目路径的引用
				n.path=o[i].path;
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
				path = node.path;
				node.expand();
				node.select();
				//保存全局引用的TID和TPATH，方便后续操作功能使用				
				tidGlobal   = node.id;
				tPathGlobal = node.path;
				if ("/20/2007/200706/" == node.path){ //荣誉资质隐藏无关功能
					curr_typeName = "荣誉资质";
					Ext.fly("suc_upload").setVisible(true);
					Ext.fly("copy").setVisible(false);
					Ext.fly("cut").setVisible(false);
					Ext.fly("bj_menuItem").setVisible(false);
					Ext.fly("look").setVisible(false);
					Ext.fly("disableTop_btn").setVisible(false);
					Ext.fly("disableHot_btn").setVisible(false);
					Ext.fly("refreshContentHtml").setVisible(false);
					Ext.fly("refreshContent").setVisible(false);
					Ext.fly("refreshContentHtmlByWeek").setVisible(false);
				}else{
					Ext.fly("suc_upload").setVisible(false);
					Ext.fly("copy").setVisible(true);
					Ext.fly("cut").setVisible(true);
					Ext.fly("bj_menuItem").setVisible(true);
					Ext.fly("look").setVisible(true);
					Ext.fly("disableTop_btn").setVisible(true);
					Ext.fly("disableHot_btn").setVisible(true);
					Ext.fly("refreshContentHtml").setVisible(true);
					Ext.fly("refreshContent").setVisible(true);
					Ext.fly("refreshContentHtmlByWeek").setVisible(true);
					if ("/20/2007/200701/" == node.path){ //企业案例显示上传功能
						Ext.fly("suc_upload").setVisible(true);
						curr_typeName = "企业案例";
					}
				}
				curr_node_path = node.path;
				//自动查寻相关的数据
				search();
				//展开下级节点
				node.expand();
			});
	root.expand();
	root.select();
	
	
	//右侧选择树的生成
	selectRoot = new Ext.tree.AsyncTreeNode({
				id : '0',
				draggable : false,
				text : '信息分类管理'
			});	
	selectTree = new Ext.tree.TreePanel({
				loader : new Ext.tree.TreeLoader({
							dataUrl : '/InfoContentType.do?type=1'
						}),
				root : selectRoot,
				renderTo : 'selectTree',
				border : false,
				animate : true,
				autoScroll : true,
				containerScroll : true,
				checkModel : 'cascade', // 对树的级联多选
				onlyLeafCheckable : false// 对树所有结点都可选				
			});
	/* 修改返回的数据 */
	selectTree.loader.processResponse = function(response, node, callback, scope) {
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
				o[i].checked = false;
				var n = this.createNode(o[i]);
				//扩展node节点的属性，保存栏目路径的引用
				n.path=o[i].path;
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
	//展开所有的结点
	//selectTree.expandAll(); 
	selectRoot.expand();
	selectRoot.select();	
	selectTree.on('checkchange', function(node) {
		if (!node.isLeaf()) {
			 node.expand(true, true);
		}
		fireCheckChange(node);
	});
};

var buildGrid = function() {
	infoStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['id','title', 'tags', 'typename', 'createBy',
								'addTime', 'isHot', 'isTop', 'webSite', 'sort',
								'eid', 'ename', 'gd', 'gx', 'cn', 'sc','province','city','url']),
				baseParams : {
					type : 2,
					blur : 'yes',
					isAuditing : 1,
					site : ''
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : '3'
				},
				remoteSort : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : "id"
			});
	grid = new Ext.grid.EditorGridPanel({
				store : infoStore,
				loadMask : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '标题',
							sortable : true,
							dataIndex : 'title',
							width : 250
						}, {
							header : 'Tag标签',
							sortable : true,
							dataIndex : 'tags'
						}, {
							header : '信息类型',
							sortable : true,
							dataIndex : 'typename'
						}, {
							header : '页面链接',
							sortable : false,
							dataIndex : 'url',
							renderer:function(data,metadata,record,rowIndex,columnIndex,store){
								metadata.attr = ' ext:qtip="' + data + '"';  
								return data;
							}
						},{
							header : '省份',
							sortable : true,
							width : 120,
							dataIndex : 'province'
						}, {
							header : '城市',
							sortable : true,
							width : 120,
							dataIndex : 'city'
						}, {
							header : '关联企业ID',
							sortable : true,
							dataIndex : 'eid'
						}, {
							header : '关联企业名称',
							sortable : true,
							dataIndex : 'ename'
						}, {
							header : '排序',
							sortable : true,
							dataIndex : 'sort',
							editor : {
								xtype : 'numberfield',
								allowDecimals : false,
								allowBlank : false
							}
						}, {
							header : '发表人',
							sortable : true,
							dataIndex : 'createBy'
						}, {
							header : '发表时间',
							sortable : true,
							width : 135,
							dataIndex : 'addTime'
						}, {
							header : '热点',
							sortable : true,
							dataIndex : 'isHot',
							width : 40,
							renderer : rederHT
						}, {
							header : '置顶',
							sortable : true,
							dataIndex : 'isTop',
							width : 40,
							renderer : rederHT
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
							id : 'view_edit',
							text : '查看/修改',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : function() {
								edit();
							}
						}, {
							id : 'del',
							text : '锁定',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/lock.png',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, '-', {
							id : 'add',
							text : '添加信息',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : function() {
								add();
							}
						},  {
							id : 'sh_menuItem',
							text : '审核',
							cls : 'x-btn-text-icon',
							style : 'display: none',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							icon : '/resource/images/add.gif',
							handler : examine
						},'-',{
							id : 'suc_upload',
							text : '上传',
							cls : 'x-btn-text-icon',
							style : 'display:none',
							icon : '/resource/images/add.gif',
							hidden : compareAuth("INFO_CONTENT_UPLOAD"),
							handler : function() {
								uploadSucCase();
							}
						}, '-', {
							id : 'copy',
							text : '复制',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								copyContent();
							}
						}, '-', {
							id : 'cut',
							text : '移动',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								cutContent();
							}
						}
						/*
						, '-', {
							id : 'share',
							text : '共享',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/copy.png',
							hidden : compareAuth("INFO_CONTENT_COPY"),
							handler : function() {
								shareContent();
							}
						}*/
						, '-', {
							id : 'bj_menuItem',
							text : '标签相关项目',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							style : 'display: none',
							handler : linkProject
						},  {
							id : 'look',
							text : '预览',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/report_magnify.png',
							handler : function(){
								var rows = grid.getSelectionModel().getSelected();
								if (isEmpty(rows)) {
									Ext.Msg.alert("提示", "请选择信息");
									return;
								}
								var contentId    = rows.data.id;
								window.open(("/TemplateHtml.do?type=3&contentId=" + contentId));
							}
						}, {
							id : 'disableTop_btn',
							text : '取消置顶',
							cls : 'x-btn-text-icon',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							icon : '/resource/images/delete.gif',
							handler : disableTop
						}, {
							id : 'disableHot_btn',
							text : '取消热点',
							cls : 'x-btn-text-icon',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							icon : '/resource/images/delete.gif',
							handler : disableHot
						}, {
							id : 'refreshContentHtml',
							text : '生成所有资讯内容页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							handler : function(){
								createContentHtml(false);
							}
						},{
							id:'refreshContent',
							text:'生成资讯列表页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							handler:createContentPageHtml
						},{
							id : 'refreshContentHtmlByWeek',
							text : '生成最近一周资讯内容页面',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/arrow_refresh.png',
							handler : function(){
								createContentHtml(true)
							}
						}
						/*
						, {
							id : 'contentPreView',
							text : '预览资讯',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/table_multiple.png',
							handler : contentPreView
						}
						*/]
			});
	var bar = new Ext.Toolbar({
		renderTo : grid.tbar,
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
							store : zhcn.getCity('广东'),
							triggerAction : 'all',
							emptyText : '请选择城市',
							width : 120,
							readOnly : true
						},{
					xtype : "label",
					text : "标题："
				}, {
					xtype : "textfield",
					id : "title",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, {
					xtype : "label",
					text : "Tag标签:"
				}, {
					xtype : "textfield",
					id : "tags",
					initEvents : function() {
						var keyPress = function(e) {
							var c = e.getCharCode();
							if (c == 13) {
								search();
							}
						};
						this.el.on("keypress", keyPress, this);
					}
				}, '-', {
					text : '查询',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/zoom.png',
					id : "search",
					handler : search
				}, '-', {
					xtype : "label",
					text : "审核状态："
				}, new Ext.form.ComboBox({
							id : 'exStatus',
							name : 'exStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '已审核'], ['1', '未审核']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '0',
							listeners : {
								select : {
									fn : function() {
										if (Ext.fly("exStatus").dom.value == '已审核') {
											// Ext.fly("tbar1").show();
											// hideEl('tbar2');
											hideEl("sh_menuItem");
										} else {
											// hideEl('tbar1');
											// Ext.fly("tbar2").show();
											showEl("sh_menuItem");
										}
										search();
									}
								}
							}
						}), '-', {
							xtype : "label",
							text : "热点状态："
						}, new Ext.form.ComboBox({
							id : 'hotStatus',
							name : 'hotStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['', '全部'],['0', '非热点'], ['1', '热点']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '',
							listeners : {
								select : {
									fn : function() {
										search();
									}
								}
							}
						}), '-', {
							xtype : "label",
							text : "置顶状态："
						}, new Ext.form.ComboBox({
							id : 'topStatus',
							name : 'topStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['', '全部'],['0', '非置顶'], ['1', '置顶']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '',
							listeners : {
								select : {
									fn : function() {
										search();
									}
								}
							}
						})]
	});

	grid.addListener('rowcontextmenu', rightClickFn);
	grid.on('beforeedit', function(e) {
				if (!compareAuth("INFO_CONTENT_SORT"))
					return true;
				else
					return false;
			});
	grid.on("afteredit", function(e) {
		var data = {};
		data["content"] = e.field + "~" + e.record.data[e.field];
		data["id"] = e.record.get("id");
		Ext.Ajax.request({
			method : 'post',
			url : "/InfoContent.do?type=3",
			params : data,
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					Info_Tip("修改排序成功！");
					infoStore.reload();
				} else {
					Info_Tip("修改排序成功！");
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	});
	var showDelInfo = new Ext.menu.Menu({
				id : 'rightDelInfo',
				shadom : false,
				items : [{
							handler : function() {
								operateRecord("res");
							},
							text : '还原'
						}, {
							id : 'ComDelete',
							handler : function() {
								operateRecord("comdel");
							},
							text : '还原成功'
						}]
			});

	// 右键菜单
	var rightClick1 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_VIEW"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制',
							handler : copyContent
						}, {
							text : '移动',
							handler : cutContent
						}
						/*, {
							text : '共享',
							handler : shareContent
						}*/
						, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}]
			});
	var rightClick2 = new Ext.menu.Menu({
				id : 'rightExamInfo',
				items : [{
							text : '查看/修改',
							hidden : compareAuth("INFO_CONTENT_MOD"),
							handler : edit
						}, {
							text : '锁定',
							hidden : compareAuth("INFO_CONTENT_LOCK"),
							handler : function() {
								operateRecord("del")
							}
						}, {
							text : '复制',
							handler : copyContent
						}, {
							text : '移动',
							handler : cutContent
						}
						/*, {
							text : '共享',
							handler : shareContent
						}*/
						, {
							text : '添加信息',
							hidden : compareAuth("INFO_CONTENT_ADD"),
							handler : add
						}, {
							id : 'sh_item',
							text : '审核',
							hidden : compareAuth("INFO_CONTENT_AUDIT"),
							handler : function() {
								examine();
							}
						}]
			});
	function rightClickFn(grid, rowindex, e) {
		e.preventDefault();
		if (Ext.fly("exStatus").dom.value == "已审核")
			rightClick1.showAt(e.getXY());
		else
			rightClick2.showAt(e.getXY());
	}
	grid.addListener('celldblclick', function(grid, rowIndex, columnIndex, e) {
				if (columnIndex == 7 && !compareAuth("INFO_CONTENT_SORT")) {
					return;
				} else
					edit();
			});
	// grid.addListener('rowdblclick', rowDblClick);
	grid.on("click", function(e) {
				var rows = grid.getSelectionModel().getSelections();
				if (rows.length == 1 && !isEmpty(rows[0].get("tags"))) {
					if ("/20/2007/200706/" != node.path){ //荣誉资质不显示“标签相关项目”按钮
						showEl("bj_menuItem");
					}
				} else {
					hideEl("bj_menuItem");
				}
				//如果只是选择一行的话，显示该内容的共享栏目信息
				/**
				if(rows.length == 1){
					var sameId = rows[0].get("sameId");
					if(sameId!=null){
						sameIdArr = sameId.split(",");
						runTidChooseTask();
					}
				}
				**/
			});
	function rowDblClick(grid, rowIndex, e) {
		edit();
	}

	function rederHT(value) {
		var html;
		if (value == 1) {
			html = "是";
		} else if (value = 0) {
			html = "";
		} else {
			html = "否";
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

function createContentPageHtml(){
	
	 var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成资讯内容页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
	var store=Ext.Ajax.request({
		method : 'post',
		url : "/TemplateHtml.do?type=12",
		params : {
			parentId : path,
			
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				loadMarsk.hide();
				Info_Tip("生成资讯内容页面成功");
			} else {
				 Info_Tip("生成资讯内容页面失败！");
			}
		},
		failure : function() {
			 Warn_Tip();
		}

	});	
	
}


function createContentHtml(isAweek){
	if(!path){
		Ext.MessageBox.alert("提示","请在左侧选择需要生成的栏目分类");
		return;
	}
	var d;
	if(isAweek){
		var date = new Date();
		var time = date.getTime();
		date.setTime(date.getTime()-7*24*3600*1000)
		d = Ext.util.Format.date(date,'Y-m-d H:i:s');
	}
	var ids = grid.selModel.selections.keys.toString();
	if(ids.length <= 0 && path.length <=0){
		Info_Tip("请选择需要生成页面的分类或者资讯内容记录！");
		return;
	}
	 var loadMarsk = new Ext.LoadMask(document.body, {
    	msg : '生成资讯内容页面处理中.....!',
        disabled : false,
        store : store
      });
      loadMarsk.show();
	var store=Ext.Ajax.request({
		method : 'post',
		url : "/TemplateHtml.do?type=4",
		params : {
			id : ids.toString(),
			parentId : path,
			date : d
		},
		success : function(response) {
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)) {
				loadMarsk.hide();
				Info_Tip("生成资讯内容页面成功");
			} else {
				 Info_Tip("生成资讯内容页面失败！");
			}
		},
		failure : function() {
			 Warn_Tip();
		}

	});	
	
}

/**
 * 上传图片回调函数
 */
function up_file_back(){
	checkEid(FileUpload_Ext.callbackMsg);
}

/**
 * 校验eid是否存在，不存在，则需要删除对应的图片
 * @param eid
 */
function checkEid(eids){
	Ext.Ajax.request({
		url:'/InfoContent.do?type=29',
		method:'POST',
		params:{
			type:'23',
			eids:eids
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				if ("suc" == data.result){
					//企业id校验成功，则批量增加成功案例
					addInfo(eids);
				}else{
					var pics = data.result;
					var picPaths = pics.split("-")[0];
					var existEids = pics.split("-")[1];
					deletePic(picPaths,existEids);
				}
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}

var curr_existEids = '';
/**
 * 删除无效企业
 * @param pics
 */
function deletePic(picPaths,existEids){
	curr_existEids = existEids;
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestId = picPaths;
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.requestMethod = "/file/DeleteFile";
	FileUpload_Ext.fileType = /./;
	FileUpload_Ext.callbackFn = "deleteResult";
	FileUpload_Ext.showFlag = false;
	//FileUpload_Ext.initComponent();
	//FileUpload_Ext.upload_win.hide();//只需要删除服务器无效图片，无需用到上传控件，这里隐藏
	FileUpload_Ext.submitAction();//自动提交
}

/**
 * 删除图片回调函数
 */
function deleteResult(){
	Info_Tip(curr_existEids + "对应的供应商不存在！");
}

/**
 * 添加成功案例信息
 * @param msg
 */
function addInfo(msg){
	Ext.Ajax.request({
		url:'/InfoContent.do?type=30',
		method:'POST',
		params:{
			eids:msg,
			nodePath : curr_node_path,
			typeName:curr_typeName
		},
		success:function(o){
			var data = eval("(" + o.responseText + ")");
			if (getState(data.state, commonResultFunc,
					data.result)) {
				Info_Tip("上传成功！");
				FileUpload_Ext.upload_win.close();
				infoStore.load();
			}
		},
		failure : function(response) {
			Warn_Tip();
		}
	});
}


/**
 * 上传成功案例(zip格式的图片压缩包)
 */
function uploadSucCase(){
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_INFO";
	FileUpload_Ext.requestMethod = "/file/AjaxUpload";
	FileUpload_Ext.fileType = /zip/;
	FileUpload_Ext.callbackFn = "up_file_back";
	FileUpload_Ext.showFlag = false;
	FileUpload_Ext.initComponent("&nbsp;&nbsp;&nbsp;(上传格式为zip压缩包格式，所含图片类型：JPG,JPEG,PNG,GIF格式，尺寸400*200像素；图片命名规则\"案例名称-企业ID\"，例：帝王体育馆成功案例-CCF0034452)");
}

var buildLayout = function() {
	var view = new Ext.Viewport({
				layout : 'border',
				defaults : {
					border : false
				},
				items : [ {
							region : 'west',
							width : 180,
							split : true,
							autoScroll : true,
							items : tree
						}, {
							region : 'center',
							layout : 'fit',
							items : grid
						},{
							region : 'east',
							width : 180,
							split : true,
							autoScroll : true,
							items : selectTree
						}]
			});
};
/* end新增分类 */
var init = function() {
	Ext.QuickTips.init();
	buildTree();
	buildGrid();
	buildLayout();
};
Ext.onReady(init);
