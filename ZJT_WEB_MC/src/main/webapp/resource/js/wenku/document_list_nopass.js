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
			hidden : compareAuth("WENKU_DOCUMENT_INFO_NOPASS"),
			handler : openDocumentInfo
		}];
var ds_info = new Ext.data.SelfStore({
	proxy : new Ext.data.HttpProxy({
				url : url
			}),
	reader : new Ext.data.JsonReader({
				root : 'result',
				fields:[{name:"id"},{name:"name"},{name:"typeTitle"},{name:"memberId"},{name:"nickName"},{name:"degree"},{name:"auditor"},{name:"createOn"},{name:"auditOn"},{name:"pidTitle"}]	
			}),
	baseParams : {
		type : 1,
		content : "isDeleted~0;isLock~0;state~2",
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
					header : "审核人",
					sortable : false,
					dataIndex:"auditor"
				},{
					header : "发布时间",
					sortable : false,
					dataIndex:"createOn"
				},{
					header : "审核时间",
					sortable : false,
					dataIndex:"auditOn"
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
	ds_info.baseParams["content"] = "isDeleted~0;isLock~0;state~2;" + searchType + "~" + searchValue + ";typeId~" + typeId + ";typePid~" + typePid;
	ds_info.load();
}
//查看
function openDocumentInfo(){
	var row = grid_info.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择一条信息！");
		return;
	}
	window.parent.createNewWidget("document_info_nopass", '审核不通过详情', '/module/wenku/document_info_nopass.jsp?id=' + row.get("id"));
}