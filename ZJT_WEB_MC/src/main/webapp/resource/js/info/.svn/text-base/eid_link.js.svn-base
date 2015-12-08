var msgId;
var info_title;

var store;
var grid;

var eidStore;
var eidPanel;
var eidWin;

/* 创建企业窗口 */
var buildEidWin = function(){
	eidStore = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EnterpriseServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn"]),
				baseParams : {
					page : 1,
					type : 2,
					content : "islock~0",
					pageSize : 20
				},
				countUrl : '/ep/EnterpriseServlet',
				countParams : {
					content : "islock~0",
					type : 9
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : eidStore,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel();// 带checkbox选择
	eidPanel = new Ext.grid.GridPanel({
				store : eidStore,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				sm : sm,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [
					new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : new Ext.data.SimpleStore({
										data : [ ["eid", "企业ID"],["name", "企业名称"],["area", "所在地区"]],
										fields : ["value", "text"]
									}),
									valueField : "value",
									displayField : "text",
									hiddenId : 'query_type',
									hiddenName : 'query_type',
									value : "name",
									width : 80
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							width : 220,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
										searchEidList();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchEidList
						}, '-', {
							xtype : 'checkbox',
							id : 'ALL'
						}, "所有企业"
				],
				bbar : pagetool
			});
	eidWin = new Ext.Window({
		title : '企业列表',
		width : 650,
		height : 390,
		layout : 'column',
		border : false,
		frame : true,
		autoScroll : true,
		items : [
			eidPanel
		],
		buttons : [{
			text : '确定',
			handler : function() {
				var eids = [];
				var tips = "";
				if(!Ext.fly("ALL").dom.checked)
				{
					var rows = eidPanel.getSelectionModel().getSelections();
					if(isEmpty(rows)){
						Ext.Msg.alert("提示", "请选择企业");
						return ;
					}
					for(var i = 0; i < rows.length; i++){
						eids.push(rows[i].get("eid"));
					}
					tips = "您确定要为选中的企业发送公告?"
				}
				else{
					eids.push("全国");
					tips = "您确定要为所有企业发送公告?";
				}
				Ext.MessageBox.confirm("提示", tips, function(btn) {
				if (btn == "yes") {
					var data = "";
					data += "id=" + msgId;
					data += "&eids=" + eids.toString();
					data += "&type=8";
					Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (data && data.state == 'success') {
										Ext.MessageBox.alert("提示", "发送公告成功!");
										eidWin.close();
										store.reload();
									} else {
										Ext.MessageBox.alert("提示", "发送公告失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
				}
				});
			}
		}, {
			text : '取消',
			handler : function() {
				eidWin.close();
			}
		}],
		listeners : {
			"show" : function(){
				eidStore.load();
			}
		}
	});
	
}
var showEidWin = function(){
	buildEidWin();
	eidWin.show();
}
//添加关联企业查询
function searchEidList() {
	var query = Ext.fly("query_type").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	store.baseParams["content"] = query;
	store.countParams["content"] = query;
	store.load();
};

//主窗口右键
var rightClick = new Ext.menu.Menu({
	id : 'rightClick',
	items : [{
		text : '查看/修改',
		handler : editEid
	},{
		text : '新增',
		handler : showEidWin
	},{
		text : '删除',
		handler : deleteEid
	}]
});
var buildGrid = function(){
	store = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/SearchInfoContent.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "eid", "name", "fname", "type", "area",
								"phone", "createOn"]),
				baseParams : {
					type : 5,
					id : msgId
				},
				countUrl : '/SearchInfoContent.do',
				countParams : {
					type : 9
				},
				remoteSort : true
			});
	var pagetool = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true
			});
	var sm = new Ext.grid.CheckboxSelectionModel();// 带checkbox选择
	store.setDefaultSort('createOn', 'DESC');  
	grid = new Ext.grid.GridPanel({
				title : info_title + '-关联企业',
				store : store,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : 'ID',
							sortable : false,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '企业ID',
							sortable : true,
							width : 60,
							dataIndex : 'eid'
						}, {
							header : '名称',
							sortable : true,
							width : 240,
							dataIndex : 'name'
						}, {
							header : '企业简称',
							sortable : true,

							dataIndex : 'fname'
						}, {
							header : '企业类型',
							sortable : true,
							dataIndex : 'type',
							renderer : EnterpriseDegree
						}, {
							header : '地区',
							sortable : true,
							dataIndex : 'area'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}],
				viewConfig : {
					forceFit : true
				},
				sm : sm,
				tbar : [{
					text : '查看/修改',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/edit.gif',
					handler : editEid
				},{
					text : '新增',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/add.gif',
					handler : showEidWin
				}, {
					text : '删除',
					cls : 'x-btn-text-icon',
					icon : '/resource/images/delete.gif',
					handler : deleteEid
				}],
				bbar : pagetool,
				renderTo : 'grid'
			});
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [
					new Ext.form.ComboBox({
									emptyText : "请选择",
									mode : "local",
									triggerAction : "all",
									store : new Ext.data.SimpleStore({
										data : [["eid", "企业ID"],["name", "企业名称"],["area", "所在地区"]],
										fields : ["value", "text"]
									}),
									valueField : "value",
									displayField : "text",
									hiddenId : 'query_type',
									hiddenName : 'query_type',
									value : "name",
									width : 80
								}), "-", {
							xtype : "label",
							text : "关键字："
						}, {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							width : 220,
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e){
									if(e.getKey() == e.ENTER){
										searchlist();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}
				]
	});
	grid.on("rowdblclick", editEid);
	store.load();
}
//查看/修改关联企业
function editEid(){
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	var thisid = row.get("id");
	var eid = row.get("eid");
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?id=' + thisid + '&eid='
					+ eid);
}
//删除关联企业
function deleteEid(){
	var eid = "";
	var row = grid.getSelectionModel().getSelected();
	if(isEmpty(row)){
		Ext.Msg.alert("提示", "请选择相关企业");
		return ;
	}

	eid = row.get("eid");
	var data = "type=9&id=" + msgId + "&eid=" + eid;
	Ext.Msg.confirm("提示", "您确定要删除选中的相关企业?", function(op){
		if(op == "yes"){
			Ext.lib.Ajax.request('post', '/InfoContent.do', {
								success : function(response) {
									var data = eval("(" + response.responseText + ")");
									if (data && data.state == 'success') {
										Ext.MessageBox.alert("提示", "删除成功!");
										store.reload();
									} else {
										Ext.MessageBox.alert("提示", "删除相关企业失败！");
									}
								},
								failure : function() {
									Ext.Msg.alert('警告', '操作失败。');
								}
							}, data);
		}
	});
}

function searchlist() {
	var query = Ext.fly("query_type").getValue() + "~"
			+ Ext.fly("searchtitle").getValue();
	store.baseParams["content"] = query;
	store.countParams["content"] = query;
	store.load();
};

Ext.onReady(function(){
	msgId = getCurArgs("id");
	info_title = "<font color='red'>" + decodeURI(getCurArgs("info_title")) + "</font>";
	buildGrid();
});