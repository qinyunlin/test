var ds, grid, ck, pagetool,tbar1;
var ids = [];// 选择项
var win, fs;
var id = getCurArgs("id");

Ext.onReady(function(){
    buildGrid();
});


// 加载列表
var buildGrid = function(){
    // 数据源
    ds = new Ext.data.SelfStore({
        proxy: new Ext.data.HttpProxy({
            url: '/ApplyUserServlet'
        }),
        reader: new Ext.data.JsonReader({
            root: 'result',
            totalProperty: 500,
            id: 'id'
        }, ["id", "eid", "memberid", "ename", "regType", "state", "createOn"]),
        baseParams: {
            type: 1,
            page: 1,
            pageSize: 20,
            cid: '1',
            content: "itemid~" + id + ";regType~3"
        },
        countUrl: '/ApplyUserServlet',
        countParams: {
            type: 8
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
    
    tbar1 = [{
		text : '取消入围',
		icon : "/resource/images/cross.png", 
		handler : cancleApply
	},'-',{
		id:'auditButton',
		text : '设置入围',
		icon : "/resource/images/tick.png", 
		handler : dealApply
	}];
    
    // 列表
    grid = new Ext.grid.GridPanel({
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
            header: '用户名',
            sortable: true,
            dataIndex: 'memberid',
            width: 150
        }, {
            header: '所在企业',
            dataIndex: 'eid',
            sortable: true,
            width: 150
        }, {
            header: '企业名称',
            dataIndex: 'ename',
            sortable: true,
            width: 250
        }, {
            header: '报名时间',
            sortable: true,
            dataIndex: 'createOn',
            width: 150
        }, {
            header: '状态',
            dataIndex: 'state',
            sortable: true,
            width: 180,
            renderer: getStateName
        }],
        viewConfig: {
            forceFit: true
        },
        tbar: tbar1,
        bbar: pagetool,
        renderTo: 'apply_users'
    });
    ds.load();
    
    var data = [['eid', '企业ID'], ['memberid', '用户名']];
    
    var fd_store = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: data
    });
    
    var data_state = [["", "所有"], ['1', '已入围'], ['0', '已报名']];
    
    var state_store = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: data_state
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
            mode: 'local',
            triggerAction: "all",
            store: state_store,
            valueField: "value",
            displayField: "text",
            width: 80,
            value: '',
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
    
    function getStateName(value, p, record){
        if (value == "") {
            return "";
        }
        else {
            if (value == "0") {
                return "已报名";
            }
            else 
                if (value == "1") {
                    return "已入围";
                }
        }
    }
    
    function searchlist(){
        var cid = "eid";
        var state = "";
        if (!Ext.isEmpty(ck.getValue())) {
            cid = ck.getValue();
        }
        if (!Ext.isEmpty(Ext.getCmp('audittype').getValue())) {
            state = Ext.getCmp('audittype').getValue();
        }
        ds.baseParams["content"] = cid + "~" + Ext.fly('searchtitle').getValue() + ';state~' + state + ";itemid~" + id + ";regType~3";
        ds.load();
    }
    
    //设置入围
    function dealApply(){
    	var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert("提示","请选中需要设置入围的供应商");
			return;
		}
		var ids = [];
		for (var i = 0; i < rows.length; i++) {
			ids.push(rows[i].get("id"));
		}
		var content = "state~1";
		
		Ext.Ajax.request({
			url:'/ApplyUserServlet',
			method:'POST',
			params:{
				type:3,
				id:ids,
				content:content
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (data.state == 'success') {
					Ext.MessageBox.alert("提示", "设置成功");
					ds.reload();
				}else{
					Ext.MessageBox.alert("警告", "系统出错");
				}
			},
			failure : function() {
				Ext.MessageBox.alert("警告", data.result);
			}
		});
    	
    }
    
    //取消入围
    function cancleApply(){
    	var rows = grid.getSelectionModel().getSelections();
		if (Ext.isEmpty(rows)) {
			Ext.MessageBox.alert("提示","请选中需要设置入围的供应商");
			return;
		}
		var ids = [];
		for (var i = 0; i < rows.length; i++) {
			ids.push(rows[i].get("id"));
		}
		var content = "state~0";
		
		Ext.Ajax.request({
			url:'/ApplyUserServlet',
			method:'POST',
			params:{
				type:3,
				id:ids,
				content:content
			},
			success : function(response) {
				var data = eval("(" + response.responseText + ")");
				if (data.state == 'success') {
					Ext.MessageBox.alert("提示", "设置成功");
					ds.reload();
				}else{
					Ext.MessageBox.alert("警告", "系统出错");
				}
			},
			failure : function() {
				Ext.MessageBox.alert("警告", data.result);
			}
		});
    }
}


