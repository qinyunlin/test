var url = "/mc/wenkuServlet.do", grid_info, search_combo, firstItem_combo, secondItem_combo, wenkuItems_win, tree, root, itemAdd_win, title_old;
var search_type = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["name", "文档名称"],["memberId", "会员账号"],["nickname", "会员昵称"]]
});
var secondItemStore = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: url
    }),
    reader: new Ext.data.JsonReader({
    	root: 'result',
    	fields:["id","title"]
    })
});
var firstItemStore = new Ext.data.Store({
    proxy: new Ext.data.HttpProxy({
        url: url
    }),
    reader: new Ext.data.JsonReader({
    	root: 'result',
    	fields:["id","title"]
    }),
    baseParams : {
		type : 3,
		content : "pid~0"
	},
	remoteSort : true
});
firstItemStore.load();
Ext.onReady(init);
function init() {
	Ext.QuickTips.init(true);
	getDocumentList();
};
var tbar = [{
			text : '查看/修改',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("WENKU_DOCUMENT_INFO"),
			handler : openDocumentInfo
		}, {
			text : '未审核文档',
			icon : "/resource/images/application_double.png", 
			hidden : compareAuth("WENKU_DOCUMENT_LIST_NOAUDIT"),
			handler : openNoauditDocumentList
		},{
			text : "审核不通过文档",
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("WENKU_DOCUMENT_LIST_NOPASS"),
			handler : openNoPassAuditDocumentList
		},{
			text : '锁定的文档',
			icon : "/resource/images/application_double.png",
			hidden : compareAuth("WENKU_DOCUMENT_LIST_LOCK"),
			handler : openLockDocumentList
		}, {
			text : '锁定',
			icon : "/resource/images/lock_open.png",
			hidden : compareAuth("WENKU_DOCUMENT_LOCK"),
			handler : lockDocument
		},{
			text : "重新审核不通过",
			icon : '/resource/images/application_double.png',
			hidden : compareAuth("WENKU_DOCUMENT_REAUDIT"),
			handler : reAuditDocument_show
		},{
			text : "设置/取消推荐",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("WENKU_DOCUMENT_RECOMMEND"),
			handler : recommendDocument
		},{
			text : "生成文库首页静态页",
			icon : '/resource/images/arrow_refresh.png',
			hidden : compareAuth("WENKU_INDEX_CREATE"),
			handler : createWenkuIndexPage
		},{
			text : "栏目管理",
			icon : '/resource/images/edit.gif',
			hidden : compareAuth("WENKU_ITEM_MANAGE"),
			handler : openWenkuItems
		},{
			text : "重新生成缩略图",
			icon : '/resource/images/arrow_refresh.png',
			hidden : compareAuth("WENKU_DOCUMENT_ICON"),
			handler : reCreateIcon
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id"},{name:"name"},{name:"typeTitle"},{name:"score"},{name:"vipScore"},{name:"downloadNum"},{name:"memberId"},{name:"nickName"},{name:"degree"},{name:"createOn"},{name:"isRecommend"},{name:"typePid"},{name:"pidTitle"},{name:"pageNumber"}]	
			}),
	baseParams : {
		type : 1,
		content : "isDeleted~0;isLock~0;state~1",
		pageNo : 1,
		pageSize : 20
	},
	countUrl : url,
	countParams : {
		type : 2
	},
	remoteSort : true
});
var pagetool = new Ext.ux.PagingToolbar({
	store : ds_info,
	displayInfo : true
});
var sm = new Ext.grid.CheckboxSelectionModel({
	dataIndex : "id",
	singleSelect : true
});
//获取活动列表
function getDocumentList(){
	grid_info = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds_info,
		viewConfig : {
			forceFit : true
		},
		tbar : tbar,
		columns : [new Ext.grid.RowNumberer({
							width : 30
						}), sm, {
					header : '编码',
					sortable : false,
					dataIndex : 'id'
				}, {
					header : '名称',
					sortable : false,
					dataIndex : 'name',
					renderer : function(v, meta, record){
						if(parseInt(record.get("isRecommend")) == 1)
							return "<img src = '/resource/images/picture.png' />" + record.get("name");
						else
							return record.get("name");
					}
				}, {
					header : '栏目分类',
					sortable : false,
					renderer : function(v, meta, record){
						var title = record.get("typeTitle");
						if(!title)
							return record.get("pidTitle");
						else
							return title;
					}
				}, {
					header : '会员价',
					sortable : false,
					dataIndex : 'score'
				}, {
					header : '特供价',
					sortable : false,
					dataIndex : 'vipScore',
					renderer : function(v, meta, record){
						var vipScore = record.get("vipScore");
						if(!vipScore)
							return "未提供";
						else
							return record.get("vipScore");
					}
				}, {
					header : '下载量',
					sortable : false,
					dataIndex : 'downloadNum'
				}, {
					header : '会员ID',
					sortable : false,
					dataIndex : 'memberId'
				},{
					header : "会员昵称",
					sortable : false,
					dataIndex:"nickName"
				},{
					header : "会员类型",
					sortable : false,
					dataIndex:"degree",
					renderer : showDegree
				},{
					header : "发布时间",
					sortable : false,
					dataIndex:"createOn"
				},{
					header : "页数",
					sortable : true,
					dataIndex:"pageNumber"
				}],
		sm : sm,
		bbar : pagetool,
		renderTo : "grid_list"
	});
	var bar2 = new Ext.Toolbar({
		renderTo : grid_info.tbar,
		items : [
		         search_combo = new Ext.form.ComboBox({
					store : search_type,
					mode : "local",
					triggerAction : "all",
					valueField : "value",
					displayField : "text",
					value : "name",
					text : "文档名称",
					width : 80
		
				}),{
					xtype : "textfield",
					id : "searchValue",
					width : 220,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchValuelist();
							}
						}
					}
				},'-', {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchValuelist
				},'-',firstItem_combo = new Ext.form.ComboBox({
					store : firstItemStore,
					mode : "local",
					triggerAction : "all",
					valueField : "id",
					displayField : "title",
					value : "请选择",
					text : "",
					width : 180,
					listeners:{
						select : function(combo, record, index) {
							secondItem_combo.clearValue();
							secondItemStore.proxy = new Ext.data.HttpProxy({url:url+"?type=3&content=pid~"+combo.getValue()});
							secondItemStore.load();
							Ext.get("secondItem").dom.value = "请选择";
							searchValuelist();
				        }
					}
				}),'-',secondItem_combo = new Ext.form.ComboBox({
					id : "secondItem",
					store : secondItemStore,
					mode : "local",
					triggerAction : "all",
					valueField : "id",
					displayField : "title",
					value : "请选择",
					text : "",
					width : 180,
					listeners:{
						select : function(combo, record, index) {
							searchValuelist();
				        }
					}
				})]
	});
	ds_info.load();
}
//查询
function searchValuelist(){
	var searchType = search_combo.getValue();
	var searchValue = Ext.fly("searchValue").getValue();
	var typePid = firstItem_combo.getValue();
	var typeId = secondItem_combo.getValue();
	if(typePid == "请选择")
		typePid = "";
	if(typeId == "请选择")
		typeId = "";
	ds_info.baseParams["content"] = "isDeleted~0;isLock~0;state~1;" + searchType + "~" + searchValue + ";typeId~" + typeId + ";typePid~" + typePid;
	ds_info.load();
}
//查看详情
function openDocumentInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选文档！");
		return;
	}
	window.parent.createNewWidget("document_info", '文档信息', '/module/wenku/document_info.jsp?id=' + row.get("id"));
}
//未审核文档
function openNoauditDocumentList(){
	window.parent.createNewWidget("document_list_noaudit", '未审核文档', '/module/wenku/document_list_noaudit.jsp');
}
//审核不通过文档
function openNoPassAuditDocumentList(){
	window.parent.createNewWidget("document_list_nopass", '审核不通过文档', '/module/wenku/document_list_nopass.jsp');
}
//锁定
function lockDocument(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选文档！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 6,
			content : "isLock~1;id~"+row.get("id")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("操作成功!");
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//锁定的文档
function openLockDocumentList(){
	window.parent.createNewWidget("document_list_lock", '锁定的文档', '/module/wenku/document_list_lock.jsp');
}
//重新审核不通过
function reAuditDocument_show(){
	var rows = grid_info.getSelectionModel().getSelections();
	if(rows.length == 0){
		Warn_Tip("请勾选文档！");
		return;
	}
	var ids = "";
	for (var i = 0; i < rows.length; i++) {
		ids += rows[i].get("id") + ",";
	}
	ids = ids.substring(0, ids.lastIndexOf(","));
	var fs_show = new Ext.form.FormPanel({
		labelAlign : 'left',
		labelWidth : 90,
		autoScroll : true,
		scrollIntoView : true,
		waitMsgTarget : true,
		layout : "table",
		autoWidth : true,
		height : 250,
		layoutConfig : {
			columns : 1
		},
		bodyStyle : 'padding:6px',
		items : [{
			layout : 'table',
			bodyStyle : 'border:none;width:500;padding:5px;',
			layoutConfig : {
				columns : 1
			},
			items : [{//单选按钮组
				id: 'auditLogGroup',
	            xtype: 'fieldset',
	            title: '请选择不通过理由：',
	            autoHeight:true,
	            defaultType: 'radio',
	            hideLabels: true,
	            items: [
	                {boxLabel: '您好！抱歉，内容中包含违规信息！如有疑问请联系客服：400-888-9639，谢谢！', name: 'auditLog', inputValue: '您好！抱歉，内容中包含违规信息！如有疑问请联系客服：400-888-9639，谢谢！'},
	                {boxLabel: '您好！抱歉，内容属于无效信息！如有疑问请联系客服：400-888-9639，谢谢！', name: 'auditLog', inputValue: '您好！抱歉，内容属于无效信息！如有疑问请联系客服：400-888-9639，谢谢！' },
	                {boxLabel: '其他', name: 'auditLog', inputValue: '其他' },
	                {
	    				xtype : "textfield",
	    				id : "reason",
	    				maxLength : 255,
	    				value : "",
	    				emptyText : "请输入自定义理由"
	    			}
	            ]
	        }]
		}]
	});
	show_win = new Ext.Window({
		title : "",
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [fs_show],
		buttons : [{
					text : "确定",
					handler : function(){
						var auditLog = fs_show.form.findField("auditLog").getGroupValue();
						if(auditLog == "其他"){
							if(Ext.fly("reason").getValue().length == 0){
								alert("请输入自定义理由！");
								return;
							}else
								auditLog = Ext.fly("reason").getValue();
						}
						reAuditDocument_no(ids, auditLog);
					}
				}, {
					text : '取消',
					handler : function() {
						show_win.close();
					}
				}]
	});
	show_win.show();
	
}
function reAuditDocument_no(ids, auditLog){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 5,
			content : "state~2;ids~"+ids+";auditLog~"+auditLog
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				Info_Tip("审核不通过!");
				show_win.close();
				ds_info.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//设置或取消推荐
function recommendDocument(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选文档！");
		return;
	}
	var tips = "确认在首页推荐此文档？";
	var isRecommend = 1;
	if(row.get("isRecommend") == 1){
		tips = "确认取消此文档的首页推荐？";
		isRecommend = 0;
	}
	if(isRecommend == 1){
		Ext.Ajax.request({
			url : url,
			async : false,
			params : {
				type : 8,
				content : "typePid~"+row.get("typePid")
			},
			success : function(response) {
				var jsondata = eval("(" + response.responseText + ")");
				if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
					if(parseInt(jsondata.result) >= 4){
						Warn_Tip(row.get("pidTitle") + "栏目下最多推荐四位！已推荐四位，请取消原有推荐后再操作！");
						return;
					}
				}
			},
			failure : function() {
				Warn_Tip();
			}
		});
	}
	Ext.Msg.confirm("提示", tips, function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 9,
					content : "isRecommend~"+isRecommend+";id~"+row.get("id")
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Info_Tip("操作成功!");
						ds_info.reload();
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//生成文库首页静态页
function createWenkuIndexPage(){
	Ext.Ajax.request({
		url : url,
		params : {
			type : 18
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result == "true")
					Info_Tip("操作成功!");
				else
					Info_Tip("操作失败!");
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//栏目管理
function openWenkuItems(){
	buildTree();
	var tbar = [{
		text : '添加一级栏目',
		icon : "/resource/images/add.gif",
		handler : function(){
			showAddWenkuItem(0);
		}
	},{
		text : '添加二级栏目',
		icon : "/resource/images/add.gif",
		handler : function(){
			showAddWenkuItem(1);
		}
	}, {
		text : '修改',
		icon : "/resource/images/edit.gif", 
		handler : showUpdateWenkuItem
	},{
		text : "删除",
		icon : '/resource/images/delete.gif',
		handler : delWenkuItem
	}];
	wenkuItems_win = new Ext.Window({
		modal : true,
		width : 600,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		x : "450",
		y : "150",
		items : [new Ext.Panel({
					autoScroll : true,
					width : 258,
					height : 330,
					split : true,
					tbar : tbar,
					items : tree
				})],
		buttons : [{
					text : '关闭',
					handler : function() {
						wenkuItems_win.close();
					}
				}]
	});
	wenkuItems_win.show();
}
function buildTree() {
	root = new Ext.tree.AsyncTreeNode({
		text : '栏目管理',
		draggable : false,
		id : "0"
	});
	tree = new Ext.tree.TreePanel({
		root : root,
		autoScroll : true,
		enableDrag : false,
		animate : true,
		containerScroll : true,
		border : false,
		listeners : {
			"click" : function(node, e) {}
		}
	});
	tree.loader = new Ext.tree.TreeLoader({
		dataUrl : url + '?type=3&flag=edit',
		params : {
			node : "0"
		}
	});
	/* 修改treeLoader返回的数据 */
	tree.loader.processResponse = function(response, node, callback, scope) {
		var json = response.responseText;
		json = json.slice(json.indexOf("["), json.lastIndexOf("]") + 1);
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

				o[i].text = o[i].title;
				if (o[i].isLeaf == "1") {
					o[i].leaf = true;
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
	root.reload();
	root.expand();
	root.select();
}
//显示添加栏目弹出框
function showAddWenkuItem(type){
	var pid = 0;
	var isLeaf = 0;
	if(type == 1){
		var node = tree.getSelectionModel().getSelectedNode();
		if (Ext.isEmpty(node) || node.id == "0" || node.leaf) {
			Warn_Tip("请选择一级栏目。");
			return;
		}
		pid = node.id;
		isLeaf = 1;
	}
	itemAdd_win = new Ext.Window({
		modal : true,
		width : 300,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [new Ext.form.FormPanel({
			labelAlign : 'left',
			autoScroll : true,
			scrollIntoView : true,
			waitMsgTarget : true,
			layout : "table",
			autoWidth : true,
			height : 50,
			layoutConfig : {
				columns : 1
			},
			bodyStyle : 'padding:6px',
			items : [{
				layout : 'form',
				bodyStyle : 'border:none; text-align:left;',
				items : {
					xtype : "textfield",
					width : 150,
					fieldLabel : "栏目名称",
					id : "title",
					name : "title",
					maxLength : 300,
					allowBlank : false
				}
			}]
		})],
		buttons : [{
					text : '添加',
					handler : function() {
						var title = Ext.fly("title").getValue();
						if(title == ""){
							Ext.MessageBox.alert("提示", "请输入标题。");
							return;
						}
						addWenkuItem(pid, title, isLeaf);
					}
				},{
					text : '关闭',
					handler : function() {
						itemAdd_win.close();
					}
				}]
	});
	itemAdd_win.show();
}
//添加栏目
function addWenkuItem(pid, title, isLeaf){
	Ext.Ajax.request({
		url : url,
		async : false,
		params : {
			type : 17,
			content : "title~"+title
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(parseInt(jsondata.result) == 0){
					Ext.Ajax.request({
						url : url,
						params : {
							type : 13,
							content : "title~"+title+";pid~"+pid+";isLeaf~"+isLeaf
						},
						success : function(response) {
							var jsondata = eval("(" + response.responseText + ")");
							if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
								Info_Tip("操作成功!");
								itemAdd_win.close();
								root.reload();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}else{
					Ext.MessageBox.alert("提示","该栏目名称已存在。");
					return;
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//删除栏目
function delWenkuItem(){
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node) || node.id == "0") {
		Warn_Tip("请选择栏目。");
		return;
	}
	Ext.Msg.confirm("提示", "确定删除该栏目吗？", function(op) {
		if (op == "yes") {
			var id = node.id;
			var contents = "typePid~"+id;
			if(node.leaf)
				contents = "typeId~"+id;
			Ext.Ajax.request({
				url : url,
				params : {
					type : 16,
					content : contents
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						if(parseInt(jsondata.result) > 0){
							Warn_Tip("该栏目下已有文档");
							return;
						}
						Ext.Ajax.request({
							url : url,
							params : {
								type : 15,
								id : id
							},
							success : function(response) {
								var jsondata = eval("(" + response.responseText + ")");
								if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
									Info_Tip("操作成功!");
									root.reload();
								}
							},
							failure : function() {
								Warn_Tip();
							}
						});
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
		}
	});
}
//显示修改栏目弹出框
function showUpdateWenkuItem(){
	var node = tree.getSelectionModel().getSelectedNode();
	if (Ext.isEmpty(node)) {
		Warn_Tip("请选择栏目。");
		return;
	}
	var id = node.id;
	title_old = node.text;
	itemAdd_win = new Ext.Window({
		modal : true,
		width : 300,
		autoHeight : true,
		closable : true,
		layout : 'fit',
		maximizable : true,
		closeAction : "close",
		items : [new Ext.form.FormPanel({
			labelAlign : 'left',
			autoScroll : true,
			scrollIntoView : true,
			waitMsgTarget : true,
			layout : "table",
			autoWidth : true,
			height : 50,
			layoutConfig : {
				columns : 1
			},
			bodyStyle : 'padding:6px',
			items : [{
				layout : 'form',
				bodyStyle : 'border:none;',
				items : {
					xtype : "textfield",
					width : 150,
					fieldLabel : "栏目名称",
					id : "title",
					name : "title",
					maxLength : 300,
					allowBlank : false,
					value : node.text
				}
			}]
		})],
		buttons : [{
					text : '添加',
					handler : function() {
						var title = Ext.fly("title").getValue();
						if(title == ""){
							Ext.MessageBox.alert("提示", "请输入标题。");
							return;
						}
						updateWenkuItem(id, title);
					}
				},{
					text : '关闭',
					handler : function() {
						itemAdd_win.close();
					}
				}]
	});
	itemAdd_win.show();
}
//修改栏目
function updateWenkuItem(id, title){
	if(title == title_old)
		return;
	Ext.Ajax.request({
		url : url,
		async : false,
		params : {
			type : 17,
			content : "title~"+title
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(parseInt(jsondata.result) == 0){
					Ext.Ajax.request({
						url : url,
						params : {
							type : 14,
							id : id,
							content : "title~"+title
						},
						success : function(response) {
							var jsondata = eval("(" + response.responseText + ")");
							if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
								Info_Tip("操作成功!");
								itemAdd_win.close();
								root.reload();
							}
						},
						failure : function() {
							Warn_Tip();
						}
					});
				}else{
					Ext.MessageBox.alert("提示","该栏目名称已存在。");
					return;
				}
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}
//重新生成文档缩略图
function reCreateIcon(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选文档！");
		return;
	}
	Ext.Ajax.request({
		url : url,
		params : {
			type : 19,
			id : row.get("id")
		},
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				if(jsondata.result != "0"){
					Info_Tip("操作成功!");
					ds_info.reload();
				}else
					Info_Tip("操作失败!");
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});
}