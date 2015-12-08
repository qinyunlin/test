var ds, grid, ck, pagetool, askds;
var ids = [];// 选择项
var selectinfo,window_note;
var isreplyType = {};

/*var zhcn = new Zhcn_Select();
var pro = zhcn.getProvince(true);
pro.unshift("全部省份");
var city = [];*/


// 右键菜单
var rightClick = new Ext.menu.Menu({
			id : 'rightClickCont',
			shadom : false,
			items : [{
						id : 'rMenu2',
						text : '打开',
						handler : showaskinfo,
						hidden : compareAuth('VIP_ASK_VIEW')
					}, {
						id : 'rMenu1',
						text : '删除',
						handler : delask,
						hidden : compareAuth('VIP_ASK_ADMIN_DEL')
					}, {
						id : 'rMenu3',
						text : '导出',
						handler : function() {
							exportaskinfo();
						},
						hidden : compareAuth('VIP_ASK_SEARCH')
					}, {
						id : 'rMenu4',
						text : '查看留言',
						handler : function() {
							seeReply();
						}
					}]
		});
var buildGrid = function() {
	/*var emp_store = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpRequestPriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ['eid', 'fname']),
				baseParams : {
					method : "getRequestEnt"

				},
				remoteSort : true
			});*/
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ep/EpRequestPriceServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id", "fname","name", "spec", "memberId", "updateOn",
								"resNum","memberId"]),
				baseParams : {
					method : "search",
					isreply : -1,
					pageSize : 20
				},
				countUrl : '/ep/EpRequestPriceServlet',
				countParams : {
					method : "searchCount"
				},
				sortInfo : {field: "updateOn", direction: "DESC"},
				remoteSort : true

			});

	var sm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				// pageSize:20,
				displayInfo : true
			});

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
							width : 20,
							dataIndex : 'id'
						}, {
							header : '企业名称',
							sortable : false,
							width : 100,
							dataIndex : 'fname'
						},{
							header : '名称',
							sortable : false,
							width : 180,
							dataIndex : 'name'
						},  {
							header : '型号规格',
							sortable : false,
							width : 180,
							dataIndex : 'spec'
						}, {
							header : '发布人',
							sortable : true,
							width : 80,
							dataIndex : 'memberId'
						}, {
							header : '发布日期',
							sortable : true,
							width : 60,
							dataIndex : 'updateOn'
						}, {
							header : '回复数',
							sortable : false,
							width : 30,
							dataIndex : 'resNum'
						}, {
							header : '发布人',
							//hidden : true,
							sortable : false,
							width : 60,
							dataIndex : 'memberId'}/*,{
							header : '省份',
							sortable : false,
							width : 60,
							dataIndex : 'province'},{
							header : '城市',
							sortable : false,
							width : 60,
							dataIndex : 'city'}*/],
				viewConfig : {
					forceFit : true
				},
				tbar : [{
							text : '打开',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							handler : function() {
								var rec = grid.getSelectionModel()
										.getSelected();
								showaskinfo(rec.data.id);
							},
							hidden : compareAuth('VIP_ASK_VIEW')
						}, {
							text : '删除',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/delete.gif',
							handler : delask,
							hidden : compareAuth('VIP_ASK_ADMIN_DEL')

						}, {
							text : '导出',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/page_excel.png',
							handler : exportaskinfo,
							hidden : compareAuth('VIP_ASK_EXPORT')
						}, {
							text : '查看留言',
							cls : 'x-btn-text-icon',
							icon : '/resource/images/edit.gif',
							hidden : compareAuth("ASK_LOCK"),
							handler : seeReply
						}],
				bbar : pagetool,
				renderTo : 'ask_grid'
			});
	var bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [/*{
							xtype : 'combo',
							id : 'province',
							store : pro,
							triggerAction : 'all',
							emptyText : '请选择省',
							readOnly : true,
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
							store : city,
							triggerAction : 'all',
							emptyText : '请选择城市',
							readOnly : true,
							disabled : true
						},*/ck = new Ext.form.ComboBox({
							emptyText : "请选择",
							mode : "local",
							triggerAction : "all",
							readOnly : true,
							value : '-1',
							store : askDateRange,
							listeners : {
								"select" : function(combo) {
									isreplyType["name"] = combo.lastSelectionText;
									isreplyType["days"] = combo.getValue();
									countTodayAsk();
									ds.baseParams["isreply"] = combo.getValue();
									ds.load();
								}
							}
						}),"-", {
					xtype : "label",
					text : "名称："
				}, {
					xtype : "textfield",
					textLabel : "名称",
					id : "searchname",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : "label",
					text : "发布人："
				}, {
					xtype : "textfield",
					textLabel : "发布人",
					id : "searchuser",
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				}, {
					xtype : "label",
					text : "企业名称："
				}, {
					xtype : "textfield",
					//store : emp_store,
					//typeAhead : false,//设置为false，取消自动匹配显示
					//mode : 'remote',
					//mode : 'local',   //设置为local，取消控件自动加载数据，使用store的load方法手动调用
					//forceSelection: true, //设置为true，必须选定一个选项
					triggerAction : 'all',
					valueField : "eid",
					displayField : "fname",
					readOnly : false,
					//emptyText : '请选择',
					id : "search_emp"
				}, {
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler : searchlist
				}]
	});
	
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
				e.preventDefault();
				rightClick.showAt(e.getXY());
			});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
				var row = grid.getSelectionModel().getSelected();
				selectinfo = row.get("id");
				showaskinfo(selectinfo);
			});
	ds.load();
	//emp_store.load();
	
};

function init() {
	Ext.QuickTips.init(true);
	buildGrid();
};

Ext.onReady(function() {
			init();
		});

/*-----------------逻辑业务--------------*/
// 删除信息
function delask() {
	var rows = grid.getSelectionModel().getSelections();
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get('id'));
	}
	if (ids.length > 0) {
		Ext.MessageBox.confirm("提示", "您确定删除该信息吗？", function(op) {
					if (op == "yes") {
						Ext.lib.Ajax.request("post",
								"/ep/EpRequestPriceServlet?method=adminDel", {
									success : function(response) {
										var data = eval("("
												+ response.responseText + ")");
										if (getState(data.state,
												commonResultFunc, data.result)) {
											Info_Tip("询价删除成功。");
											ids = [];
											ds.reload();
											pagetool.updateInfo();
										}
									},
									failure : function(response) {
										Ext.MessageBox.alert("提示",
												"非常抱歉，您的操作发生错误。");
									}
								}, "id=" + ids.toString());
					}
				});
	} else {
		Ext.MessageBox.alert("提示", "请选择信息。");
	}

};

// 查询信息
function searchlist() {
	ds.baseParams["name"] = Ext.fly("searchname").getValue().trim();
	ds.baseParams["memberID"] = Ext.fly("searchuser").getValue().trim();
	ds.baseParams["isreply"] = ck.getValue();
	ds.baseParams["fname"] = Ext.getCmp("search_emp").getValue().trim();
	ds.baseParams["page"] = 1;
	/*ds.baseParams["province"] = Ext.getCmp("province").getValue().trim();
	ds.baseParams["city"] = Ext.getCmp("city").getValue().trim();*/
	ds.load();
};

// 查看详细信息
function showaskinfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Info_Tip("请选择一条信息。");
		return;
	}
	window.parent.createNewWidget("ask_info_vip", '企业询价信息',
			'/module/ask/ask_info_vip.jsp?id=' + row.get("id"));
};

// 导出询价信息
function exportaskinfo() {
	var sels = grid.getSelectionModel().getSelections();
	var mids = [];
	for (var i = 0; i < sels.length; i++) {
		mids.push(sels[i].get("id"));
	}
	var name = Ext.fly("searchname").getValue().trim();
	var memberID = Ext.fly("searchuser").getValue().trim();
	var isreply = ck.getValue();
	var eid = Ext.getCmp("search_emp").getValue().trim();
	
	/*
	var province = Ext.getCmp("province").getValue();
	var city = Ext.getCmp("city").getValue();
	*/
	window.document.exportform.action = "/ep/EpRequestExportServlet?id="
			+ mids.toString() + "&name=" + name + "&memberID=" + memberID
			+ "&isreply=" + isreply + "&eid=" + eid + "&sort=" + ds.sortInfo.field
			+ "&dir=" + ds.sortInfo.direction;
	window.document.exportform.submit();
};

// 统计今天未回复询价数量
function countTodayAsk() {
	var temp = "未回复";
	if (isreplyType["days"] == undefined || isreplyType["days"] == null) {
		isreplyType["days"] = -1;
		isreplyType["name"] = "今天"
	} else {
		if (isreplyType["days"] == "")
			temp = "";
	}
	Ext.Ajax.request({
				url : '/ep/EpRequestPriceServlet',
				params : {
					method : "searchCount",
					isreply : isreplyType["days"]
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						Ext.TipSelf.msg('提示', isreplyType["name"]// + temp
										+ '询价数量：' + data.result);
					}
				},
				failure : function() {
					Warn_Tip();
				}
			});
};

// 统计今天和所有未回复询价的数量
function CountTodayAndMore() {
	var today = "";
	var more = "";
	Ext.Ajax.request({
				url : '/ep/EpRequestPriceServlet',
				params : {
					method : 'searchCount',
					isreply : -1
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (getState(data.state, commonResultFunc, data.result)) {
						today = data.result;
					}
					Ext.Ajax.request({
								url : '/ep/EpRequestPriceServlet',
								params : {
									method : 'searchCount',
									isreply : 0
								},
								success : function(response) {
									var data = eval("(" + response.responseText
											+ ")");
									if (getState(data.state, commonResultFunc,
											data.result)) {
										more = data.result;
										Ext.TipSelf.msg('提示', '<p>今天未回复询价数量：'
														+ today
														+ '</p><p>所有未回复询价数量：'
														+ more + "</p>");
									}
								},
								failure : function() {
									Warn_Tip();
								}
							});
				},
				failure : function() {
					Warn_Tip();
				}
			});

};

// 创建循环任务对象
var task = {
	run : CountTodayAndMore,
	interval : 1000 * 60 * 5// 循环时间5分钟
};

// 创建循环任务
var taskRunner = new Ext.util.TaskRunner();
taskRunner.start(task);

//生成弹出窗口
function seeReply(){
	var rows = grid.getSelectionModel().getSelected();
	var id;
	if(!rows){
		Ext.MessageBox.alert("提示", "请选择信息。");
		return;
	}
	id = rows.get("id");
	//取得数据
	Ext.Ajax.request({
					url : '/AskMessageServlet',
					params : {
						type : 7,
						sid : id,
						page : 1,
						pageNo : 1
					},
					success : function(response) {
						data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							if(data.result.length<1){
								Ext.MessageBox.alert("提示", "该询价没有留言！");	
								return false;
							}
							Ext.getCmp("note_note").setValue(data.result[0].content);
							Ext.getCmp("note_phone").setValue(data.result[0].phone);
							Ext.getCmp("note_linkman").setValue(data.result[0].linkman);
							Ext.getCmp("note_id").setValue(data.result[0].id);
							window_note.show();
							getReply();
						} else {
							Ext.MessageBox.alert("提示", "获取数据失败！");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});	
	
    var form = new Ext.form.FormPanel({
        baseCls: 'x-plain',
        layout:'absolute',
        url:'save-form.php',
        defaultType: 'textfield',

        items: [{
            x: 0,
            y: 5,
            xtype:'label',
            text: '联系人:'
        },{
        	id:'note_linkman',
        	readOnly : true,
            x: 60,
            y: 0,
            name: 'to',
            xtype:'textfield',
            anchor:'100%'  // anchor width by percentage
        },{
            x: 0,
            y: 30,
            xtype:'label',
            text: '联系电话:'
        },{
        	id:'note_phone',
        	readOnly : true,
            x: 60,
            y: 30,
            name: 'to',
            xtype:'textfield',
            anchor:'100%'  // anchor width by percentage
        },{
            x: 0,
            y: 55,
            xtype:'label',
            text: '留言:'
        },{
        	id:'note_note',
        	readOnly : true,
            x: 60,
            y: 55,
            name: 'to',
            xtype:'textarea',
            height:60,
            anchor:'100%'  // anchor width by percentage
        },
        {
            x: 0,
            y: 130,
            xtype:'label',
            text: '回复:'
        },{
        	id:'reply_text',
            x:60,
            y: 130,
            height:60,
            xtype: 'textarea',
            name: 'msg',
            anchor: '100%'  // anchor width and height
        },{
        	id : "note_id",
        	hidden : true
        }]
    });

        window_note = new Ext.Window({
        title: '查看留言',
        width: 500,
        height:300,
        minWidth: 300,
        minHeight: 200,
        modal : true,
        layout: 'fit',
        plain:true,
        bodyStyle:'padding:5px;',
        buttonAlign:'center',
        items: form,

        buttons: [{
            text: '提交',
            handler:function(){
            	submitNoteReply();	
            }
        },{
            text: '取消',
            handler:function(){
            	window_note.close();
            	return false;
            }
        }]
    });

};

function submitNoteReply(){
	var id = grid.getSelectionModel().getSelected().get('id'); 
	var mid = grid.getSelectionModel().getSelected().get('memberId'); 
	var pid = Ext.getCmp("note_id").getValue();
	var contents = Ext.getCmp("reply_text").getValue();
	if(Ext.isEmpty(contents)||contents=="还未对该留言进行回复！"){
		Info_Tip("没有任何内容可以提交！");	
		return false;
	}
	var content = "linkman~"+Ext.getCmp("note_linkman").getValue()+";phone~"+Ext.getCmp("note_phone").getValue()+";content~"+contents;
	Ext.Ajax.request({
					url : '/AskMessageServlet',
					params : {
						type : 2,
						sid : id,
						content : content,
						//contents : contents,
						mid : mid,
						pid : pid
					},
					success : function(response) {
						data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
								Ext.MessageBox.alert("提示", "提交成功！");	
								window_note.close();
								
						} else {
							Ext.MessageBox.alert("提示", "回复失败！");
						}
					},
					failure : function() {
						Warn_Tip();
					}
				});	
	
};

function getReply(){
	var data;
	var id = Ext.getCmp("note_id").getValue();;
	var reply_text = "还未对该留言进行回复！";
	//取得数据
	Ext.Ajax.request({
					url : '/AskMessageServlet',
					params : {
						type : 6,
						id : id,
						page : 1,
						pageNo : 1
					},
					success : function(response) {
						data = eval("(" + response.responseText + ")");
						if (getState(data.state, commonResultFunc, data.result)) {
							if(data.result.length==0){
								Ext.getCmp("reply_text").setValue(reply_text);
							}else
							var length = data.result.length-1;
							Ext.getCmp("reply_text").setValue(data.result[length].content);
						} else {
							Ext.MessageBox.alert("提示","获取回复发生异常！");
						}
					},
					failure : function() {
					}
				});	
};

