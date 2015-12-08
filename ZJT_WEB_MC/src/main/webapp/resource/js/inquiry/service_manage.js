var ds, grid, ck, pagetool, reply_ds, reply_grid,cur_user_id;
var ids = [];// 选择项
var selectinfo;
var win, fs;
/*var storeCurrSite=currSite;
storeCurrSite.unshift(["","所有"]);*/




var ReplyType=[[-1,'所有'],[0,'未处理'],[1,'已处理']];
var title=[['updateBy','处理人ID'],['phone','手机号码'],['mobile','固定电话'],['createOn','提交人ID'],['addr','地区']];



// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{

						text : '跟进处理',			
						handler : addReply
					}, {
						text : '删除',
						handler : del
					
					
					}]
		});
var buildGrid = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/servlet/ServiceAdvisoryServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id",   "phone",
								"mobile", "createOn","notes","createBy","updateOn","updateBy","addr"]),
				baseParams : {
					type : 1,
					page : 1,
					pageSize : 20,
				},
				countUrl : '/servlet/ServiceAdvisoryServlet',
				countParams : {
					type : 2
				},
				remoteSort : true
			});
	ds.setDefaultSort("createOn", "DESC");
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
	// var cs = new xg.CheckboxSelectionModel();// 带checkbox选择
	var sm = new Ext.grid.CheckboxSelectionModel();
	grid = new xg.GridPanel({
				store : ds,
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
							header : '内容',
							sortable : false,
							dataIndex : 'channel',
							width : parent.Ext.fly("tab_0804_iframe")
									.getWidth()
									* 0.2,
							renderer : renderContent
						}, {
							header : '提交人',
							dataIndex : 'createBy',
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							sortable : true
				

						}, {
							header : '地区',
							dataIndex : 'addr',
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							sortable : true
				

						}, {
							header : '提交时间',
							dataIndex : 'createOn',
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							sortable : true
				

						}, {
							header : '处理人ID',
							dataIndex : 'updateBy',
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							sortable : true
				

						}, {
							header : '处理时间',
							dataIndex : 'updateOn',
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							sortable : true
				

						}, {
							header : '跟进处理',
							sortable : true,
							width : parent.Ext.fly("tab_0804_iframe")
							.getWidth()
							* 0.1,
							dataIndex : 'notes',
							renderer : changeDispose
						}],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '跟进处理',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/add.gif',
							
							handler : addReply
						},{
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
						
							handler : del
						
						}],
				bbar : pagetool,
				renderTo : 'service_grid',
				view : new Ext.ux.grid.BufferView({							
							rowHeight : 10,		
							scrollDelay : true
						})
			});
	var bar = new Ext.Toolbar({
				renderTo : grid.tbar,
				items : [  {
					xtype : "label",
					text : "收索条件："
				},new Ext.form.ComboBox({
								
									name : "title",
									id : "title",
									store : title,
									mode : "local",
									triggerAction : "all",
									readOnly : true,
									width : 80,
									value:'updateBy',
									//emptyText : '所有省',
									listeners : {
										"select" : function(){
											searchlist();
										}
									}
						}), {
							xtype : "textfield",
							textLabel : "关键字",
							id : "searchtitle",
							enableKeyEvents : true,
							listeners : {
								"keyup" : function(tf, e) {
									if (e.getKey() == e.ENTER) {
										searchlist();
									}
								}
							}
						}, {
							text : "查询",
							id : "search",
							icon : "/resource/images/zoom.png",
							handler : searchlist
						}, {
							xtype : "label",
							text : "  |"
						}, {
							xtype : 'label',
							text : '  跟进状态：'
						}, {
							xtype : 'combo',
							id : 'replyType',
							store : ReplyType,
							triggerAction : "all",
							width : 120,
							value : '-1',
							listeners : {
								"select" : function(){
									searchlist();
								}
							}
						}]
			});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});

	ds.load();
	function renderContent(value, p, record) {
		var phone = record.data.phone;
		if(phone ==null){
			phone="";
		}
		var mobile = record.data.mobile;
		if(mobile ==null){
			mobile="";
		}
	
		return String.format('<b>手机号码：</b>{0}<br><b>固定电话：</b>{1}<br/>', phone, mobile);
	};
	
	
	function changeDispose(value, p, record){
		var notes = record.data.notes;
		if(notes==null||notes==""){
			return '<font color="red">未跟进</font>';
		}else{
			return notes;
		}
		
	}

};
function init() {
	buildGrid();

};

Ext.onReady(function() {
			init();
		});



// 查询信息
function searchlist() {

   var content="";
	var title=Ext.getCmp('title').getValue();
	var isReply=Ext.getCmp('replyType').getValue();
	var searchtitle=Ext.getCmp('searchtitle').getValue();
	if(title !=null && title!=""){
		if(searchtitle !=null && searchtitle !=""){
			content +=title+"~"+searchtitle+";";
		}
	}
	
	ds.baseParams["isType"] = isReply;
	ds.baseParams["content"] = content;

	ds.load();
};

// 添加回复
function addReply() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	if(row.get('notes')!=null && row.get('notes')!=""){

		Info_Tip("该咨询意见处理过，不可进行此操作");
		return;
	}
	fs = new Ext.form.FormPanel({
				layout:'table',
				border : false,
				layoutConfig : {
					columns :1
				},
				items:[{
						id:"replyContent",
						xtype:"textarea",
						width:378,
						height:240,
						
						
					}
				]
			});
	win = new Ext.Window({
				title : '回复内容',
				width : 400,
				autoHeight : true,
				modal : true,
				items : fs,
				buttonAlign : 'right',
				buttons : [{
							text : '回复',
							handler : function() {
								saveReply(row.get('id'));
							}
						}, {
							text : '取消',
							handler : function() {
								win.close();
							}
						}]
			});
	win.show();
};

function saveReply(thisid) {
	if (fs.getForm().isValid()) {

		Ext.Ajax.request({
					url : '/servlet/ServiceAdvisoryServlet',
					params : {
						type : 3,
						id : thisid,
						notes:Ext.getCmp("replyContent").getValue()
					},
					success : function(response) {
						var json = eval("(" + response.responseText + ")");
						if (getState(json.state, commonResultFunc, json.result)) {
							Info_Tip("处理成功。");
							ds.reload();
							win.close();
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});
	} else
		Info_Tip();
};





// 删除信息
function del() {
	Ext.Msg.confirm("确认操作", "您确认要删除选中的信息吗？", function(op) {
				if (op == "yes") {
					var rows = grid.getSelectionModel().getSelected();
					if (Ext.isEmpty(rows)) {
						Info_Tip("请选择信息。");
						return;
					}
					var ids = [];
					for (var i = 0; i < rows.length; i++) {
						ids.push(rows[i].get('id'));
					}
					Ext.Ajax.request({
								url : '/servlet/ServiceAdvisoryServlet',
								params : {
									type : 4,
									id : ids.toString()
								},
								success : function(response) {
									var json = eval("(" + response.responseText
											+ ")");
									if (getState(json.state, commonResultFunc,
											json.result)) {
										Info_Tip("删除成功。");
										ds.reload();
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				}
			});
};
