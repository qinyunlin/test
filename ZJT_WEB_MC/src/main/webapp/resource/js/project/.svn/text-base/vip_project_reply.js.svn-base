var ds, grid, ck, pagetool,projectId;
// 初始化报名信息
var initInfo = function() {
	var xg = Ext.grid;
	ds = new Ext.data.SelfStore({
				proxy : new Ext.data.HttpProxy({
							url : '/ApplyUserServlet'
						}),
				reader : new Ext.data.JsonReader({
							root : 'result',
							totalProperty : 500,
							id : 'id'
						}, ["id", "eid","memberid", "v_eid","ename" ,"regType","state",
								"createOn"]),
				baseParams : {
					type : 1,
					pageSize : 20,
					page : 1,
					content:"itemid~"+projectId+";regtype~"+2,
					isreply : true
				},
				countUrl : '/ApplyUserServlet',
				countParams : {
					type :8
				},
				remoteSort : true
			});
	ds.setDefaultSort("updateOn", "DESC");
	
	
	pagetool = new Ext.ux.PagingToolbar({
				store : ds,
				displayInfo : true

			});
			  
    var data = [['memberid', '会员帐号'], ['ename', '企业名称'],['','全部']];
    
    var fd_store = new Ext.data.SimpleStore({
        fields: ['value', 'text'],
        data: data
    });
	grid = new xg.GridPanel({
				store : ds,
				stripeRows : true,
				loadMask : true,
				autoWidth : true,
				autoHeight : true,
				columns : [new Ext.grid.RowNumberer({
									width : 20
								}),{
							header : 'ID',
							sortable : true,
							dataIndex : 'id',
							hidden : true
						}, {
							header : '报名会员账号',
							sortable : true,
							dataIndex : 'memberid',
							forceFit : true,
							width : 85
						}, {
							header : '报名企业id',
							sortable : true,
							dataIndex : 'eid',
							width : 40
						}, {
							header : '报名会员企业名称',
							sortable : true,
							dataIndex : 'ename',
							width : 160
						}, {
							header : '报名类型',
							sortable : true,
							dataIndex : 'regType',
							width : 45,
							renderer:changeReply
						},
						
						{
						   header:'状态',
						   sortable:true,
						   dataIndex:'state',
						   widht:45,
						   renderer:changeEnter
						}
						,{
							header : '发布企业id',
							sortable : true,
							dataIndex : 'v_eid',
							width : 45
						}, {
							header : '创建时间',
							sortable : true,
							dataIndex : 'createOn',
							forceFit : true
						}],
				viewConfig : {
					forceFit : true
				},tbar:[ck = new Ext.form.ComboBox({
			        id: 'cid_type',
			        mode: 'local',
			        triggerAction: "all",
			        store: fd_store,
			        valueField: "value",
			        displayField: "text",
			        width: 80,
					value:'全部',
					listeners : {
						"select" : function() {
							Ext.get("searchtitle").dom.value="";
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
                }, '-', {
					xtype : "label",
					text : "入围状态："
				}, new Ext.form.ComboBox({
							id : 'exStatus',
							name : 'exStatus',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							anchor : '90%',
							store : new Ext.data.SimpleStore({
										fields : ['value', 'text'],
										data : [['0', '未入围'], ['1', '已入围'],['','全部']]
									}),
							valueField : 'value',
							displayField : 'text',
							width : 80,
							value : '全部',
							listeners : {
								select : {
									fn : function() {
									  searchlist();
										
									}
								}
							}
						}) ,{
					text : "查询",
					id : "search",
					icon : "/resource/images/zoom.png",
					handler :searchlist
				}],
				bbar : pagetool,
				renderTo : 'project_grid'
			});

			
			
		ds.load();
	
};
// 查询信息
function searchlist(){
    var cid="";
    var content="";
    if (!Ext.isEmpty(ck.getValue())) {
        cid = ck.getValue();
    }
    content="itemid~"+projectId+";regtype~"+2;
    var es = Ext.fly("exStatus").getValue();
    if(es=="已入围"){
       content += ";state~"+1;
    }else if(es=="未入围"){
       content +=";state~"+0
    }
    if(cid!="全部"){
    	if(("" && null)== Ext.fly('searchtitle').getValue()){
    	    alert("请输入关键字！");
    	    return;
    	}
    	content +=";"+cid+ "~" + Ext.fly('searchtitle').getValue();
    }
    ds.baseParams["content"]=content;
    ds.load();
};
function init() {
	projectId = getCurArgs("id");
	initInfo();
};

Ext.onReady(function() {
			init();
		});


