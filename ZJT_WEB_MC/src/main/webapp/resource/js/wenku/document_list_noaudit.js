var url = "/mc/wenkuServlet.do", grid_info, search_combo, firstItem_combo, secondItem_combo, show_win;
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
			text : '查看',
			icon : "/resource/images/book_open.png",
			hidden : compareAuth("WENKU_DOCUMENT_INFO_NOAUDIT"),
			handler : openDocumentInfo
		}, {
			text : '审核通过',
			icon : "/resource/images/book_open.png", 
			hidden : compareAuth("WENKU_DOCUMENT_AUDIT"),
			handler : function(){
				auditDocument_yes();
			}
		},{
			text : "审核不通过",
			icon : '/resource/images/book_open.png',
			hidden : compareAuth("WENKU_DOCUMENT_AUDIT"),
			handler : function(){
				auditDocument_no_show();
			}
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id"},{name:"name"},{name:"typeTitle"},{name:"memberId"},{name:"nickName"},{name:"degree"},{name:"createOn"},{name:"pidTitle"}]	
			}),
	baseParams : {
		type : 1,
		content : "isDeleted~0;isLock~0;state~0",
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
	dataIndex : "id"
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
					header : 'ID',
					sortable : false,
					dataIndex : 'id'
				}, {
					header : '文档名称',
					sortable : false,
					dataIndex : 'name'
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
				},{
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
	ds_info.baseParams["content"] = "isDeleted~0;isLock~0;state~0;" + searchType + "~" + searchValue + ";typeId~" + typeId + ";typePid~" + typePid;
	ds_info.load();
}
//查看
function openDocumentInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请勾选文档！");
		return;
	}
	window.parent.createNewWidget("document_info_noaudit", '查看待审核文档详情', '/module/wenku/document_info_noaudit.jsp?id=' + row.get("id"));
}
//审核通过/不通过
function auditDocument_yes(){
	var rows = grid_info.getSelectionModel().getSelections();
	if(rows.length == 0){
		Warn_Tip("请勾选文档！");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("id"));
	}
	Ext.Msg.confirm("提示", "确定审核通过选中的文档？", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : url,
				params : {
					type : 5,
					content : "state~1;ids~"+ids.toString()
				},
				success : function(response) {
					var jsondata = eval("(" + response.responseText + ")");
					if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
						Info_Tip("审核通过!");
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

//审核通过/不通过
function auditDocument_no_show(){
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
						auditDocument_no(ids, auditLog);
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
function auditDocument_no(ids, auditLog){
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