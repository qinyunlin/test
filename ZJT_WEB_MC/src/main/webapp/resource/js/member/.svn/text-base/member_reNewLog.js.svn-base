Ext.onReady(init);
var ds, grid;
var win, mem_log, mem_grid;
var ds_mem = new Ext.data.SimpleStore({
			fields : [{
						name : 'value'
					}, {
						name : 'text'
					}],
			data : info_type_combox
		});
var ds_timeType = new Ext.data.ArrayStore({
			fields : ['value', 'text'],
			data : [["auditTime", "续期日期"], ["beforeValidDate", "续期前有效日期"],
					["afterValidDate", "续期后有效日期"]]
		});
function init() {
	buildGrid();
};
function buildGrid(){
	var rightClick = new Ext.menu.Menu({
		items : [{
			text : '查看该会员续期记录',
			handler : openMemLog
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
			auditType : 'r'
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
			}, /*{
				header : '续期前级别',
				sortable : true,
				width : 80,
				dataIndex : 'lastDegree',
				renderer : showDegree
			},*/ {
				header : '会员等级',
				sortable : true,
				width : 80,
				dataIndex : 'degree',
				renderer : showDegree
			}, {
				header : '续期前有效日期',
				sortable : true,
				width : 80,
				dataIndex : 'beforeValidDate',
				renderer : getDate
			}, {
				header : '续期后有效日期',
				sortable : true,
				width : 80,
				dataIndex : 'afterValidDate',
				renderer : getDate
			}, {
				header : '续期人',
				sortable : true,
				width : 80,
				dataIndex : 'auditor'
			}, {
				header : '续期时间',
				sortable : true,
				width : 100,
				dataIndex : 'auditTime'
			}
		],
		renderTo : 'grid',
		bbar : pagetool,
		tbar : [{
			text : '查看该会员续期记录',
			icon : "/resource/images/book_open.png",
			handler : openMemLog
		}]
	});
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : [
			'会员ID：', {
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
			}, '续期前等级：', {
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
			}, '续期后等级：', {
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
			}, '开通天数：', {
				id : 'days',
				xtype : 'numberfield',
				allowNegative : false,
				width : 50
			}, '续期人：', {
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
			}, {
				xtype : "combo",
				id : 'timeCombo',
				triggerAction : 'all',
				mode : 'local',
				emptyText : '请选择',
				valueField : "value",
				displayField : "text",
				width : 100,
				store : ds_timeType,
				value : 'auditTime'
			}, {
				id : 'begin',
				xtype : 'datefield',
				format : 'Y-m-d',
				emptyText : '请选择'
			},'至',{
				id : 'end',
				xtype : 'datefield',
				format : 'Y-m-d',
				emptyText : '请选择'
			}, '-', {
				text : '查询',
				icon : "/resource/images/zoom.png",
				handler : searchlist
		}]
	});
	grid.on("rowcontextmenu", function(grid, rowIndex, e) {
		grid.getSelectionModel().selectRow(rowIndex);
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	grid.on("dblclick", function(e){
		openMemLog();
	});
	ds.load();
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
	var timeType = Ext.getCmp("timeCombo").getValue();
	var begin = Ext.fly('begin').getValue() != "请选择" ? Ext.fly('begin').getValue() : "";
	var end = Ext.fly("end").getValue() != "请选择" ? Ext.fly("end").getValue() : "";
	var content = "memberID~" + memberID + ";auditor~" + auditor;
	ds.baseParams['content'] = content;
	ds.baseParams['lastDegree'] = lastDegree;
	ds.baseParams['degree'] = degree;
	ds.baseParams['days'] = days;
	if(begin != "" && end != "")
	{
		ds.baseParams["diff"] = timeType + "~" + begin + "~" + end + "~DIFF_BETWEEN";
	}
	else if(begin != "")
	{
		ds.baseParams["diff"] = timeType + "auditTime~"+begin + "~~DIFF_EQUAL_GREATER";
	}
	else if(end != ""){
		ds.baseParams["diff"] = timeType + "auditTime~"+end + "~~DIFF_EQUAL_LESS";
	}
	ds.reload();
};

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
		}, ['id', 'memberID', 'degree', 'lastDegree','beforeValidDate','afterValidDate', 'auditTime','auditor']),
		baseParams : {
			type : 3,
			mid : mid,
			auditType : 'r'
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
			}), /*{
				header : '续期前等级',
				sortable : false,
				width : 80,
				dataIndex : 'lastDegree',
				renderer : showDegree
			},*/ {
				header : '会员等级',
				sortable : false,
				width : 80,
				dataIndex : 'degree',
				renderer : showDegree
			}, {
				header : '续期前有效日期',
				sortable : false,
				width : 80,
				dataIndex : 'beforeValidDate',
				renderer : getDate
			}, {
				header : '续期后有效日期',
				sortable : false,
				width : 80,
				dataIndex : 'afterValidDate',
				renderer : getDate
			}, {
				header : '续期人',
				sortable : false,
				width : 80,
				dataIndex : 'auditor'
			}, {
				header : '续期时间',
				sortable : false,
				width : 100,
				dataIndex : 'auditTime'
			}
		]
	});
	win = new Ext.Window({
		title : "会员续期记录-" + "<font color='red'>" + mid + "</font>",
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