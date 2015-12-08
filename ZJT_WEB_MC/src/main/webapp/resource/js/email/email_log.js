var store, eid_ds, temp_ds;
var grid;
var rightClick = new Ext.menu.Menu({
	id : 'rightClick',
	items : [{text : '打开', handler : email_log_info}]
});
var buildGrid = function(){
	//邮箱帐户
	eid_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailAccountServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["name", "id"]),
				baseParams : {
					type : 9,
					content : 'isLock~0'
				},
				remoteSort : true
			});
	eid_ds.on("load", function(){
		eid_ds.insert(0, new Ext.data.Record({name : '全部', id : ''}));
	});
	//eid_ds.load();
	
	
	//模版邮件
	temp_ds = new Ext.data.Store({
				proxy : new Ext.data.HttpProxy({
							url : '/email/EmailTemplateServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							id : ["id", "catalog"]
						}, ['name', "id"]),
				baseParams : {
					type : 10,
					content : 'isLock~0'
				},
				remoteSort : true
	});
	temp_ds.on("load", function(){
		temp_ds.insert(0, new Ext.data.Record({name : '全部', id : ''}));
	});
	//temp_ds.load();
	
	store = new Ext.data.SelfStore({
		proxy : new Ext.data.HttpProxy({
			url : '/email/EmailSendLogServlet'
		}),
		reader : new Ext.data.JsonReader({
			root : 'result',
			id : 'id'
		},['id', 'operator', 'opName', 'ename', 'fromAddress', 'toAddress', 'tname', 'sendTime']),
		baseParams : {
			type : 1,
			page : 1,
			pageSize : 20
		},
		countUrl : '/email/EmailSendLogServlet',
		countParams : {
			type : 2
		},
		remoteSort : true
	});
	var pagetool = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true
			});
	var cm = new Ext.grid.CheckboxSelectionModel({
				dataIndex : 'id'
			});
	var sm = new Ext.grid.RowSelectionModel({
		singleSelect : true
	});
	grid = new Ext.grid.GridPanel({
		renderTo : 'grid',
		autoWidth : true,
		autoScroll : true,
		autoHeight : true,
		store : store,
		layout : 'fit',
		sm : sm,
		enableDragDrop : true,
		stripeRows : true,
		columns : [new Ext.grid.RowNumberer({
				width : 30
			}), cm, {
				header : '收件邮箱',
				width : 200,
				sortable : true,
				dataIndex : 'toAddress'
			},{
				header : '发件邮箱',
				width : 200,
				sortable : true,
				dataIndex : 'fromAddress'
			},{
				header : '模版名称',
				width : 150,
				sortable : true,
				dataIndex : 'tname'
			},{
				header : '帐户名称',
				width : 180,
				sortable : true,
				dataIndex : 'ename'
			},{
				header : '操作人ID',
				width : 70,
				sortable : true,
				dataIndex : 'operator'
			},{
				header : '操作人名称',
				width : 70,
				sortable : true,
				dataIndex : 'opName'
			},{
				header : '发送时间',
				width : 120,
				sortable : true,
				dataIndex : 'sendTime'
			}],
		viewConfig : {
			forceFit : true
		},
		tbar : [{
			text : '查看',
			cls : 'x-btn-text-icon',
			icon : '/resource/images/book_open.png',
			handler : email_log_info
		}],
		bbar : pagetool
	});
	var searchBar = new Ext.Toolbar({
		renderTo : grid.tbar,
		items : ["模版名称：",{
			xtype : 'combo',
			id : 'tid',
			store : temp_ds,
			triggerAction : "all",
			valueField : 'id',
			displayField : 'name',
			readOnly : true,
			emptyText : '全部',
			listeners : {
				"select" : searchlist
			}
		}, "帐户名称：",{
			xtype : 'combo',
			id : 'eid',
			store : eid_ds,
			triggerAction : "all",
			valueField : 'id',
			displayField : 'name',
			readOnly : true,
			emptyText : '全部',
			listeners : {
				"select" : searchlist
			}
		}, "-", "发件时间", {
			id : 'begin',
			xtype : 'datefield',
			format : 'Y-m-d',
			emptyText : '请选择'
		}, "至",{
			id : 'end',
			xtype : 'datefield',
			format : 'Y-m-d',
			emptyText : '请选择'
		}, {
			xtype : 'combo',
			id : 'searchkey',
			readOnly : true,
			width : 80,
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [['', '全部'], 
					['operator', '操作者ID'],
					['opName', '操作者名称'],
					['fromAddress', '发送邮箱'],
					['toAddress', '收件邮箱']]
			}),
			mode : 'local',
			triggerAction: 'all',
			valueField : 'value',
			displayField : 'text',
			value : ''
		},"关键字", {
			id : 'keyInput',
			xtype : 'textfield',
			width : 100,
			enableKeyEvents : true,
			listeners : {
				"keyup" : function(tf, e){
					if(e.getKey() == e.ENTER){
						searchlist();
					}
				}
			}
		},{
			text : '查询',
			icon : '/resource/images/zoom.png',
			handler : searchlist
		}]
	});
	grid.on("rowdblclick", email_log_info);
	grid.on("rowcontextmenu", function(grid, rowIndex, e){
		e.preventDefault();
		rightClick.showAt(e.getXY());
	});
	store.load();
};

var searchlist = function(){
	var tid = Ext.getCmp("tid").getValue();
	var eid = Ext.getCmp("eid").getValue();
	var begin = changeDate(Ext.fly("begin").getValue());
	var end = changeDate(Ext.fly("end").getValue());
	var searchkey = Ext.getCmp("searchkey").getValue();
	var keyInput = Ext.fly("keyInput").getValue();
	store.baseParams["tid"] = tid;
	store.baseParams["eid"] = eid;
	if(begin != "" && end != "")
	{
		store.baseParams["diff"] = "sendTime~" + begin + "~" + end + "~DIFF_BETWEEN";
	}
	else if(begin != "")
	{
		store.baseParams["diff"] = "sendTime~"+begin + "~~DIFF_EQUAL_GREATER";
	}
	else if(end != ""){
		store.baseParams["diff"] = "sendTime~"+end + "~~DIFF_EQUAL_LESS";
	}
	if(searchkey != ''){
		store.baseParams["content"] = searchkey + "~" + keyInput;
	}
	else
		store.baseParams["content"] = "";
	store.reload();
};

//将日期Y-m-d转为Ymd格式
var changeDate = function(date){

	if(date == "" || date == "请选择"){
		return "";
	}
	var str = "";
	var start = 0;
	var end = date.indexOf("-", start);
	for( start = 0; end != -1; start = end + 1, end = date.indexOf("-", start)){
		str = str + date.substring(start, end);
	}
	str = str + date.substring(start, date.length);
	return str;
}

//查看邮件日志
var email_log_info = function(){
	var row = grid.getSelectionModel().getSelected();
	if(Ext.isEmpty(row)){
		Ext.Msg.alert("提示", "请选择一条信息");
		return ;
	}
	var id = row.get("id");
	parent.createNewWidget("email_log_info", "查看邮件日志",
			"/module/email/email_log_info.jsp?id=" + id, false);
}

Ext.onReady(function(){buildGrid();});