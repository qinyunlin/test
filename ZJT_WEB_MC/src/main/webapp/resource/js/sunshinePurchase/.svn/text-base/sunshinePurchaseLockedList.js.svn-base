var store, page, sm, tbar1,tbar2, grid, typeStore;

var stateArray = [["0","未审核"],["1","已审核"]];

Ext.onReady(function() {
	init();
});

function init(){
	buildGrid();
}

function buildGrid(){
	store　=　new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/sunshinePurchase.do'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result'
						}, ["id","title","holdAddr","phone","startTime","endTime","createOn","createBy","auditor","auditTime","orderCode"]),
				baseParams : {
					type : "1",
					pageNo : 1,
					pageSize : 20,
					content:'isLock~1;'
				},
				countUrl : '/sunshinePurchase.do',
				countParams : {
					type : "2"
				},
				remoteSort : true
			});
		
	page = new Ext.ux.PagingToolbar({
				store : store,
				displayInfo : true

			});
	sm = new Ext.grid.CheckboxSelectionModel({
			dataIndex : "id"
		});
	tbar1 = [{
			text : '还原',
			icon : "/resource/images/lock.png", 
			handler : revert
		},'-',{
			text : '删除',
			icon : "/resource/images/delete.gif", 
			handler : del
		}];
	
	grid = new Ext.grid.EditorGridPanel({
				autoWidth : true,
				autoHeight : true,
				stripeRows : true,
				loadMask : true,
				store : store,
				clicksToEdit:1,
				viewConfig : {
					forceFit : true
				},
				//tbar : tbar,
				columns : [new Ext.grid.RowNumberer({
									width : 30
								}), sm, {
							header : '活动名称',
							sortable : false,
							dataIndex : 'title'
						}, {
							header : '举办地址',
							sortable : false,
							dataIndex : 'holdAddr'
						}, {
							header : '联系电话',
							sortable : false,
							dataIndex : 'phone'
						}, {
							header : '开始时间',
							sortable : false,
							dataIndex : 'startTime'
						}, {
							header : '结束时间',
							sortable : false,
							dataIndex : 'endTime'
						},{
							header:'序列号',
							sortable:true,
							dataIndex:'orderCode',
							editor : new Ext.form.NumberField({
								allowBlank:true
							})
						}, {
							header : '创建人',
							sortable : false,
							dataIndex : 'createBy'
						},{
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn'
						}, {
							id:'auditorColumn',
							hidden:true,
							header : '审核人',
							sortable : true,
							dataIndex : 'auditor'
						}, {
							id:'auditTimeColumn',
							hidden:true,
							header : '审核时间',
							sortable : true,
							dataIndex : 'auditTime'
						}],
				sm : sm,
				tbar : tbar1,
				bbar : page,
				renderTo : "grid"
			});
			
	bar2 = new Ext.Toolbar({
		renderTo : grid.tbar,
		items:[{
			xtype:'label',
			text:'活动标题：'
		},{
			xtype : 'textfield',
			fieldLabel : '活动标题',
			id : 'keyword',
			name : 'keyword',
			width : 180
		},'-',{
			xtype:'label',
			text:'审核状态'
		},{
			xtype : 'combo',
			id : 'state',
			name : 'state',
			store : stateArray,
			width : 150,
			fieldLabel : '审核状态',
			value:'0',
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			editable : false,
			triggerAction : 'all'
		},{
			text : "查询",
			id : "search",
			icon : "/resource/images/zoom.png",
			handler : search
		}]
	});
	
	grid.on("rowdblclick", function(grid, index){
		var record = grid.store.getAt(index);
		var id = record.get("id");
		window.parent.createNewWidget("sunshinePurchaseEdit", '修改阳光采购活动',
			'/module/sunshinePurchase/sunshinePurchaseEdit.jsp?id=' + id);
	});
	
	
	grid.on('afteredit', function(e){
		Ext.Msg.wait("正在保存...", "提示");
        Ext.lib.Ajax.request('post', '/sunshinePurchase.do', {
            success: function(response){
                var data = eval("(" + response.responseText + ")");
                if (data && data.state == 'success') {
                    Ext.MessageBox.alert("提示", "修改成功！");
                    store.load();
                }else {
                    Ext.MessageBox.alert("提示", "修改失败！");
                }
            },
            failure: function(){
                Ext.Msg.alert('警告', '操作失败。');
            }
        }, "type=10&id=" + e.record.data.id +"&orderCode=" + e.record.data.orderCode);
    });
	
	store.setDefaultSort('createOn','desc');
	store.load();
}

function search(){
	var name = Ext.fly("keyword").getValue();
	var state = Ext.getCmp("state").getValue();
	
	store.baseParams["content"] += "title~" + name + ";state~" + state + ";";
	store.baseParams["isBlur"] = true;
	store.reload();
}

function revert(){
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示","请选中需要还原的活动");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("id"));
	}
	Ext.Msg.confirm("提示", "您确定要还原选中的活动吗?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/sunshinePurchase.do',
				params : {
					ids : ids.toString(),
					isLock:0,
					type:7
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.state == 'success') {
						Ext.MessageBox.alert("提示", "还原成功");
						store.reload();
					}else{
						Ext.MessageBox.alert("警告", "系统出错");
					}
				},
				failure : function() {
					Ext.MessageBox.alert("警告", data.result);
				}
			});
		}
	});
}

function del(){
	var rows = grid.getSelectionModel().getSelections();
	if (Ext.isEmpty(rows)) {
		Ext.MessageBox.alert("提示","请选择需要删除的活动");
		return;
	}
	var ids = [];
	for (var i = 0; i < rows.length; i++) {
		ids.push(rows[i].get("id"));
	}
	
	Ext.Msg.confirm("提示", "您确定要删除选中的活动吗?", function(op) {
		if (op == "yes") {
			Ext.Ajax.request({
				url : '/sunshinePurchase.do',
				params : {
					type : '4',
					id : ids.toString()
				},
				success : function(response) {
					var data = eval("(" + response.responseText + ")");
					if (data.state == 'success') {
						Ext.MessageBox.alert("提示", "删除成功");
						store.reload();
					}else{
						Ext.MessageBox.alert("警告", "系统出错");
					}
				},
				failure : function() {
					Ext.MessageBox.alert("警告", data.result);
				}
			});
		}
	});
}
