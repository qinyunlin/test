var ds, grid, ck, pagetool;
var ids = [];// 选择项
var win, fs;

Ext.onReady(function(){
    buildGrid();
});

// 加载列表
var buildGrid = function(){

    // 数据源
    ds = new Ext.data.SelfStore({
        proxy: new Ext.data.HttpProxy({
            url: '/mc/RecruitServlet'
        }),
        reader: new Ext.data.JsonReader({
            root: 'result',
            totalProperty: 500,
            id: 'id'
        }, ["id", "eid", "title", "createBy", "startTime", "endTime", "state", "createOn", "auditor", "auditTime","orderCode"]),
        baseParams: {
            type: 1,
            page: 1,
            pageSize: 20,
            cid: '1',
            content: 'isLock~0'
        },
        countUrl: '/mc/RecruitServlet',
        countParams: {
            type: 2
        },
        remoteSort: true
    });
    
    // 分页控件
    pagetool = new Ext.ux.PagingToolbar({
        store: ds,
        displayInfo: true
    });
    
    // 多选
    var sm = new Ext.grid.CheckboxSelectionModel();
    
    // 列表
    grid = new Ext.grid.EditorGridPanel({
        store: ds,
        stripeRows: true,
        loadMask: true,
        autoWidth: true,
        autoHeight: true,
        sm: sm,
       columns: [new Ext.grid.RowNumberer({
            width: 30
        }), sm, {
            header: 'ID',
            sortable: false,
            dataIndex: 'id',
            hidden: true
        }, {
            header: '企业ID',
            sortable: true,
            dataIndex: 'eid',
            width: 150
        }, {
            header: '招募主题',
            dataIndex: 'title',
            sortable: true,
            width: 250
        }, {
            header: '发布人',
            dataIndex: 'createBy',
            sortable: true,
            width: 100
        }, {
            header: '开始时间',
            dataIndex: 'startTime',
            sortable: true,
            width: 130
        }, {
            header: '结束时间',
            dataIndex: 'endTime',
            sortable: true,
            width: 130
        }, {
            header: '状态',
            sortable: true,
            dataIndex: 'state',
            renderer: renderisAudit,
            width: 80
        },{
			header:'序列号',
			sortable:true,
			dataIndex:'orderCode',
			width:100,
			editor : new Ext.form.NumberField({
				allowBlank:true
			})
		}, {
            header: '审核人',
            sortable: true,
            dataIndex: 'auditor',
            width: 100
        },{
            header: '审核时间',
            sortable: true,
            dataIndex: 'auditTime',
            width: 130
        }],
        viewConfig: {
            forceFit: true
        },
        bbar: pagetool,
        renderTo: 'recruit_grid',
        
        view: new Ext.ux.grid.BufferView({
            rowHeight: 10,
            scrollDelay: true
        }),
		clicksToEdit:1,
        tbar: [
		/**{
            text: '删除',
            icon: "/resource/images/delete.gif",
            handler: deleteRecruit
        }, 
        **/{
            text: '解锁',
            cls: 'x-btn-text-icon',
            icon: '/resource/images/lock.png',
            handler: updateRecruitUnLock
        }]
    });
    
    //行双击事件
    grid.on("rowdblclick", function(grid, rowIndex, r){
        var row = grid.getSelectionModel().getSelected();
        showUpdateRecruit();
    });
	 grid.on('afteredit', function(e){
		Ext.Msg.wait("正在保存...", "提示");
        Ext.lib.Ajax.request('post', '/mc/RecruitServlet', {
            success: function(response){
                var data = eval("(" + response.responseText + ")");
                if (data && data.state == 'success') {
                    Ext.MessageBox.alert("提示", "修改成功！");
                    ds.load();
                }else {
                    Ext.MessageBox.alert("提示", "修改失败！");
                }
            },
            failure: function(){
                Ext.Msg.alert('警告', '操作失败。');
            }
        }, "type=11&id=" + e.record.data.id +"&orderCode=" + e.record.data.orderCode);
    });
    
    ds.load();
    function renderAuditor(value, p, record){
        if (!Ext.isEmpty(record.data.auditTime)) {
            return String.format('{0}&nbsp;{1}', record.data.auditor, record.data.auditTime.slice(0, 10));
        }
        else {
            return "";
        }
    }
    function renderisAudit(value, p, record){
        return String.format('{0}', changeAudit(record.data.state));
    }
    
    var data = [['eid', '企业ID'], ['title', '招募主题']];
    
    var fd_store = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: data
    });
    
    var bar = new Ext.Toolbar({
        renderTo: grid.tbar,
        items: [ck = new Ext.form.ComboBox({
            id: 'cid_type',
            mode: 'local',
            triggerAction: "all",
            store: fd_store,
            valueField: "value",
            displayField: "text",
            width: 80,
            value: 'eid',
            listeners: {
                select: function(combo, record, index){
                    Ext.fly("searchtitle").dom.value = "";
                }
            }
        }), {
            xtype: "label",
            text: "关键字："
        }, {
            xtype: "textfield",
            textLabel: "关键字",
            id: "searchtitle",
            enableKeyEvents: true,
            listeners: {
                "keyup": function(tf, e){
                    if (e.getKey() == e.ENTER) {
                        searchlist();
                    }
                }
            }
        }, {
            xtype: 'label',
            text: '审核状态：'
        }, {
            xtype: 'combo',
            id: 'audittype',
            store: AuditType,
            triggerAction: "all",
            width: 80,
            value: '0',
            listeners: {
                select: function(combo, record, index){
                	searchlist();
                }
            }
        }, {
            text: "查询",
            id: "search",
            icon: "/resource/images/zoom.png",
            handler: searchlist
        }]
    });
    
};

//取得状态
function changeAudit(state){
    if (state == "1") {
        return "<span>已审核</span>";
    }
    else {
        return "<span style='color:red;'>未审核</span>";
    }
}

//解锁
function updateRecruitUnLock(){
    var rows = grid.getSelectionModel().getSelections();
    
    if (Ext.isEmpty(rows)) {
        Info_Tip("请选择信息。");
        return;
    }
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].get('id'));
    }
    Ext.Msg.confirm("确认操作", "您确认要对选中的信息解锁吗？", function(op){
        if (op == "yes") {
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 4,
                    id: ids.toString(),
                    isLock: 1
                },
                success: function(response){
                    var json = eval("(" + response.responseText +
                    ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                        Info_Tip("解锁成功。");
                        ds.reload();
                    }
                },
                failure: function(){
                    Warn_Tip();
                }
            });
        }
    });
}


//删除
function deleteRecruit(){
    var rows = grid.getSelectionModel().getSelections();
    
    if (Ext.isEmpty(rows)) {
        Info_Tip("请选择信息。");
        return;
    }
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].get('id'));
    }
    Ext.Msg.confirm("确认操作", "删除后不可恢复，您确认要删除选中的信息吗？", function(op){
        if (op == "yes") {
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 6,
                    id: ids.toString()
                },
                success: function(response){
                    var json = eval("(" + response.responseText +
                    ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                        Info_Tip("删除成功。");
                        ds.reload();
                    }
                },
                failure: function(){
                    Warn_Tip();
                }
            });
        }
    });
}

// 查看详细信息
function showUpdateRecruit(){
    var row = grid.getSelectionModel().getSelected();
    if (Ext.isEmpty(row)) {
        Info_Tip("请选择一条信息.");
        return;
    }
    
    var thisid = row.get("id");
    showRecruitEdit(thisid);
};

// 查看详细信息
function showRecruitEdit(id){
    window.parent.createNewWidget("vip_recruit_update", '修改招募信息', '/module/recruit/vip_recruit_update.jsp?id=' + id);
};

// 锁定信息
function lock(){
    var rows = grid.getSelectionModel().getSelections();
    
    if (Ext.isEmpty(rows)) {
        Info_Tip("请选择信息。");
        return;
    }
    var ids = [];
    for (var i = 0; i < rows.length; i++) {
        ids.push(rows[i].get('id'));
    }
    Ext.Msg.confirm("确认操作", "您确认要锁定选中的信息吗？", function(op){
        if (op == "yes") {
            Ext.Ajax.request({
                url: '/mc/RecruitServlet',
                params: {
                    type: 4,
                    id: ids.toString(),
                    isLock: 0
                    // 锁定状态为0
                },
                success: function(response){
                    var json = eval("(" + response.responseText +
                    ")");
                    if (getState(json.state, commonResultFunc, json.result)) {
                        Info_Tip("锁定成功。");
                        
                        ds.reload();
                        
                    }
                },
                failure: function(){
                    Warn_Tip();
                }
            });
        }
    });
};

// 查询信息
function searchlist(){
    var cid = "eid";
    if (!Ext.isEmpty(ck.getValue())) {
        cid = ck.getValue();
    }
    ds.baseParams["content"] = cid + "~" + Ext.fly('searchtitle').getValue() + ';state~' + Ext.getCmp('audittype').getValue() + ';isLock~0';
    ds.load();
};
