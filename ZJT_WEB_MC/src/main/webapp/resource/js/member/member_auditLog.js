Ext.onReady(init);
var ds, grid;
var win, mem_log, mem_grid;
var ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : memberDegree_combo
		});
//var ds_timeType = new Ext.data.ArrayStore({
//			fields : ['value', 'text'],
//			data : [["auditTime", "审核日期"], ["beforeValidDate", "审核前有效日期"],
//					["afterValidDate", "审核后有效日期"]]
//		});

var timeType = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [["timeStepType", "时间段"], ["monthType", "月份"]]
});
var year_ds = new Ext.data.ArrayStore({
	fields : ["value", "text"],
	data : [['2015', '2015'], ['2014', '2014'], ['2013', '2013'], ['2012', '2012'], 
		['2011', '2011'], ['2010', '2010'], ['2009', '2009']]
});
var month_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : month_array
});
var sh_type_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : [['', '全部'], ['shenhe', '审核'],['xuqi', '续期']]
});
function init() {
	buildGrid();
};
function buildGrid(){
	var rightClick = new Ext.menu.Menu({
			items : [{
				id : 'rMenu1',
				text : '查看会员信息',
				hidden : compareAuth("MEM_VIEW"),
				handler : function() {
					openInfo();
				}
			}]
	});
	ds = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/MemberAuditServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, ['id', 'memberID', 'lastDegree','degree','beforeValidDate','afterValidDate', 'auditTime','auditor']),
		baseParams : {
			type : 1,
			pageSize : 20,
			pageNo : 1,
			auditType : ''
		},
		countUrl : '/mc/MemberAuditServlet',
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true
			});
	grid = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : ds,
		viewConfig : {
			forceFit : true
		},
		columns : [
			new Ext.grid.RowNumberer({
				width : 30
			}), {
				header : '会员ID',
				sortable : true,
				width : 60,
				dataIndex : 'memberID'
			}, {
				header : '审核前等级',
				sortable : true,
				width : 80,
				dataIndex : 'lastDegree',
				renderer : showDegree
			}, {
				header : '审核后等级',
				sortable : true,
				width : 80,
				dataIndex : 'degree',
				renderer : showDegree
			}, {
				header : '审核前有效日期',
				sortable : true,
				width : 80,
				dataIndex : 'beforeValidDate',
				renderer : getDate
			}, {
				header : '审核后有效日期',
				sortable : true,
				width : 80,
				dataIndex : 'afterValidDate',
				renderer : getDate
			}, {
				header : '审核人',
				sortable : true,
				width : 80,
				dataIndex : 'auditor'
			}, {
				header : '审核时间',
				sortable : true,
				width : 100,
				dataIndex : 'auditTime'
			}
		],
		renderTo : 'grid',
		bbar : pagetool,
		tbar : [{
				text : '查看会员信息',
				icon : "/resource/images/book_open.png",
				hidden : compareAuth("MEM_VIEW"),
				handler : openInfo
		}]
	});
	var searchPanel = new Ext.Panel({
		id : 'searchPanel',
		title : '',
		layout : 'table',
		border: false,
		bodyStyle : 'background:transparent',
		items : [{
			xtype : 'panel',
			width:730,
			border: false,
			layout : 'table',
			layoutConfig : {
				columns : 1
			},
			bodyStyle : 'background:transparent;',
			items : [{
				layout : 'column',
				width: 720,
				border : false,
				bodyStyle : 'background:transparent;padding-top:2px;padding-bottom:2px',
				items : [{
					style : 'line-height:20px;',
					xtype : 'label',
					text : '审核类型：'
				},{
					id : 'sh_type',
					xtype : 'combo',
					mode : "local",
					triggerAction : "all",
					allowBlank : false,
					store : sh_type_ds,
					width:60,
					displayField: 'text',
					valueField : 'value',
					value : '',
					listeners : {
						'select' : function(){
							var sh_type = Ext.getCmp("sh_type").getValue();
							if(sh_type == 'shenhe')
								ds.baseParams['auditType'] = 'a';
							else if(sh_type == 'xuqi')
								ds.baseParams['auditType'] = 'r';
							else
								ds.baseParams['auditType'] = '';
							ds.baseParams['pageNo'] = 1;
							ds.reload();
						}
					}
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text:'会员ID：'
				}, {
					xtype : 'textfield',
					id : 'memberID',
					width : 80,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{ 
					style : 'line-height:20px;',
					xtype : 'label',
					text : '审核前等级：'
				},{
					xtype : "combo",
					id : 'lastDegree',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					store : ds_mem,
					value : ''
				}, {
					style : 'line-height:20px;',
					xtype : 'label',
					text : '审核后等级：'
				}, {
					xtype : "combo",
					id : 'degree',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 100,
					store : ds_mem,
					value : ''
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text: '开通天数大于：'
				}, {
					layout : 'form',
					border : false,
					bodyStyle : 'background:transparent;',
					labelWidth : 1,
					autoScroll:false,
					autoWidth:false,
					items : [{
						id : 'days',
						xtype : 'numberfield',
						allowNegative : false,
						allowDecimals : false,
						width : 40
					}]
				}]
			}, {
				layout : 'column',
				width: 720,
				border : false,
				bodyStyle : 'background:transparent;padding-bottom:2px',
				items : [{
					style : 'line-height:20px;',
					xtype : 'label',
					text : "审核前有效日期："
				},{
					id : 'beforeValidDateBegin',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text : '至'
				},{
					id : 'beforeValidDateEnd',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				},{
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text : "审核后有效日期："
				},{
					id : 'afterValidDateBegin',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text : '至'
				},{
					id : 'afterValidDateEnd',
					xtype : 'datefield',
					format : 'Y-m-d',
					emptyText : '请选择'
				}]}, {
				layout : 'column',
				width: 720,
				border : false,
				bodyStyle : 'background:transparent;padding-bottom:2px',
				items : [{
					style : 'line-height:20px;',
					xtype : 'label',
					text:'审核人：'
				}, {
					id : 'auditor',
					xtype : 'textfield',
					width : 80,
					enableKeyEvents : true,
					listeners : {
						"keyup" : function(tf, e) {
							if (e.getKey() == e.ENTER) {
								searchlist();
							}
						}
					}
				},{
					xtype : 'label',
					cls : 'xtb-sep',
					width : 10
				},{
					style : 'line-height:20px;',
					xtype : 'label',
					text : "审核日期："
				}, {
					style : 'line-height:20px;',
					xtype : 'label',
					text : '按'
				}, {
					xtype : "combo",
					id : 'auditTimeType',
					triggerAction : 'all',
					mode : 'local',
					emptyText : '请选择',
					valueField : "value",
					displayField : "text",
					width : 80,
					store : timeType,
					value : 'timeStepType',
					listeners : {
						'select' : function(){
							var auditTimeType = Ext.getCmp('auditTimeType').getValue();
							if(auditTimeType == 'monthType'){
								hideEl("timeStep1");
								showEl('monthType1');
							}
							else{
								hideEl("monthType1");
								showEl('timeStep1');
							}
						}
					}
				},{
					id: 'monthType1',
					xtype : 'panel',
					width : 220,
					layout : 'column',
					bodyStyle : 'background:transparent;',
					border : false,
					items : [{
						id : "year_input",
						xtype : 'combo',
						mode : "local",
						triggerAction : "all",
						allowBlank : true,
						store : year_ds,
						width:80,
						displayField: 'text',
						valueField : 'value',
						readOnly : true,
						value : '2010'
					},{
						style : 'line-height:20px;',
						xtype : 'label',
						text : '年'
					},{
						id : 'month_input',
						xtype : 'combo',
						mode : "local",
						triggerAction : "all",
						allowBlank : false,
						store : month_ds,
						width:80,
						displayField: 'text',
						valueField : 'value',
						readOnly : true,
						value : '1'
					},{
						style : 'line-height:20px;',
						xtype : 'label',
						text : '月'
					}]
				},{
					id:'timeStep1',
					xtype : 'panel',
					width : 220,
					layout : 'column',
					bodyStyle : 'background:transparent;',
					border : false,
					items : [{
						id : 'auditTimeBegin',
						xtype : 'datefield',
						format : 'Y-m-d',
						emptyText : '请选择'
					},{
						style : 'line-height:20px;',
						xtype : 'label',
						text : '至'
					},{
						id : 'auditTimeEnd',
						xtype : 'datefield',
						format : 'Y-m-d',
						emptyText : '请选择'
					}]}
				]}]
		}]
	});
	var bar = new Ext.Toolbar({
		renderTo:grid.tbar,
		items:[searchPanel,'-',{
			xtype : 'button',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/zoom.png',
			text : '查询',
			handler : searchlist
		}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("rowdblclick", function(grid, rowIndex, r) {
		openInfo();
	});
	ds.load();
	hideEl('monthType1');
};

//得到日期
function getDate(v){
	if(v)
		return v.substring(0, 10);
	return "";
};

//搜索
function searchlist(){
	var memberID = Ext.fly('memberID').getValue();
	var auditor = Ext.fly("auditor").getValue();
	var lastDegree = Ext.getCmp('lastDegree').getValue();
	var degree = Ext.getCmp("degree").getValue();
	var days = Ext.fly("days").getValue() != "" ? Ext.fly("days").getValue() : "";
	//审核前有效期
	var beforeValidDateBegin = Ext.fly('beforeValidDateBegin').getValue() != "请选择" ? Ext.fly('beforeValidDateBegin').getValue() : "";
	var beforeValidDateEnd = Ext.fly("beforeValidDateEnd").getValue() != "请选择" ? Ext.fly("beforeValidDateEnd").getValue() : "";
	//审核后有效期
	var afterValidDateBegin = Ext.fly("afterValidDateBegin").getValue() != "请选择" ? Ext.fly("afterValidDateBegin").getValue() : "";
	var afterValidDateEnd = Ext.fly("afterValidDateEnd").getValue() != "请选择" ? Ext.fly("afterValidDateEnd").getValue() : "";

	var content = "memberID~" + memberID + ";auditor~" + auditor; 
	ds.baseParams['content'] = content;
	ds.baseParams['lastDegree'] = lastDegree;
	ds.baseParams['degree'] = degree;
	ds.baseParams['days'] = days;
	var diff = "";
	if(beforeValidDateBegin != "" && beforeValidDateEnd != "")
	{
		diff = "beforeValidDate~" + beforeValidDateBegin + "~" + beforeValidDateEnd + "~DIFF_BETWEEN";
	}
	else if(beforeValidDateBegin != "")
	{
		diff = "beforeValidDate~"+beforeValidDateBegin + "~~DIFF_EQUAL_GREATER";
	}
	else if(beforeValidDateEnd != ""){
		diff = "beforeValidDate~~"+beforeValidDateEnd + "~DIFF_EQUAL_LESS";
	}
	if(diff.length > 0 && (afterValidDateBegin != "" || afterValidDateEnd != "")){
		diff = diff + ";";
	}
	if(afterValidDateBegin != "" && afterValidDateEnd != "")
	{
		diff = diff + "beforeValidDate~" + afterValidDateBegin + "~" + afterValidDateEnd + "~DIFF_BETWEEN";
	}
	else if(afterValidDateBegin != "")
	{
		diff = diff + "afterValidDate~"+afterValidDateBegin + "~~DIFF_EQUAL_GREATER";
	}
	else if(afterValidDateEnd != ""){
		diff = diff + "afterValidDate~~"+afterValidDateEnd + "~DIFF_EQUAL_LESS";
	}
	var auditTimeType = Ext.getCmp('auditTimeType').getValue();
	if(auditTimeType == 'monthType'){
		ds.baseParams['year'] = Ext.fly('year_input').getValue();
		ds.baseParams['month'] = Ext.fly('month_input').getValue();
	}
	else{
		var auditTimeBegin = Ext.fly('auditTimeBegin').getValue() != "请选择" ? Ext.fly('auditTimeBegin').getValue() : "";
		var auditTimeEnd = Ext.fly('auditTimeEnd').getValue() != "请选择" ? Ext.fly('auditTimeEnd').getValue() : "";
		if(diff.length > 0 && (auditTimeBegin != "" || auditTimeEnd != "")){
			diff = diff + ";";
		}
		if(auditTimeBegin != "" && auditTimeEnd != "")
		{
			diff = diff + "auditTime~" + auditTimeBegin + "~" + auditTimeEnd + "~DIFF_BETWEEN";
		}
		else if(auditTimeBegin != "")
		{
			diff = diff + "auditTime~"+auditTimeBegin + "~~DIFF_EQUAL_GREATER";
		}
		else if(auditTimeEnd != ""){
			diff = diff + "auditTime~~"+auditTimeEnd + "~DIFF_EQUAL_LESS";
		}
	}
	ds.baseParams['diff'] = diff;
	ds.reload();
};
// 查看
function openInfo() {
	var row = grid.getSelectionModel().getSelected();
	if (Ext.isEmpty(row)) {
		Warn_Tip("请选择会员");
		return;
	}
	var id = row.get("memberID");
	window.parent.createNewWidget("member_info", '会员信息',
			'/module/member/member_info.jsp?id=' + id);
};

/*
function openMemLog(){
	var row = grid.getSelectionModel().getSelected();
	if(Ext.isEmpty(row)){
		Ext.MessageBox.alert("提示", "请选择一条信息");
		return ;
	}
	var mid = row.get("memberID");
	mem_ds = new Ext.data.Store({
		proxy : new Ext.data.HttpProxy({
			url : '/mc/MemberAuditServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result'
		}, ['id', 'memberID', 'lastDegree','degree','beforeValidDate','afterValidDate', 'auditTime','auditor']),
		baseParams : {
			type : 3,
			mid : mid,
			auditType : 'a'
		}
	});
	mem_grid = new Ext.grid.GridPanel({
		autoWidth : true,
		autoHeight : true,
		stripeRows : true,
		loadMask : true,
		store : mem_ds,
		viewConfig : {
			forceFit : true
		},
		columns : [
			new Ext.grid.RowNumberer({
				width : 30
			}), {
				header : '审核前等级',
				sortable : false,
				width : 80,
				dataIndex : 'lastDegree',
				renderer : showDegree
			}, {
				header : '审核后等级',
				sortable : false,
				width : 80,
				dataIndex : 'degree',
				renderer : showDegree
			}, {
				header : '审核前有效日期',
				sortable : false,
				width : 80,
				dataIndex : 'beforeValidDate',
				renderer : getDate
			}, {
				header : '审核后有效日期',
				sortable : false,
				width : 80,
				dataIndex : 'afterValidDate',
				renderer : getDate
			}, {
				header : '审核人',
				sortable : false,
				width : 80,
				dataIndex : 'auditor'
			}, {
				header : '审核时间',
				sortable : false,
				width : 100,
				dataIndex : 'auditTime'
			}
		]
	});
	win = new Ext.Window({
		title : "会员审核记录-" + "<font color='red'>" + mid + "</font>",
		autoScroll : true,
		heigth:400,
		width: 550,
		closable : true,
		draggable : true,
		modal : true,
		border : false,
		plain : true,
		layout : 'fit',
		closeAction : "close",
		buttonAlign : 'center',
		items : [mem_grid],
		buttons : [{
			text : "关闭",
				handler : function() {
					win.close();
				}
			}]
		});
	win.show();
	mem_ds.load();
};
*/