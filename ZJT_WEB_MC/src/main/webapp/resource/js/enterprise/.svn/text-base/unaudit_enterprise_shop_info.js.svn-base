Ext.onReady(init);
var zhcn = new Zhcn_Select();
var eid,ds, grid, panel,memberid,id;
var shop_id;
//商铺类型
var shop_type_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getShop_type()
});


//省份城市级联选择
var pro =  zhcn.getProvince(true);
var city = [];
var area=[];
var comboProvinces = new Ext.form.ComboBox({
			id : 'province',
			store : pro,
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			emptyText : '请选择',
			editable : false,
			triggerAction : 'all',
			allowBlank : true,
			width:170,
			fieldLabel : '所在地区',
			listeners : {
				select : function(combo, record, index) {
					comboCities.reset();
					var province = combo.getValue();
					city=zhcn.getCity(province);
					comboCities.store.loadData(city);
					comboCities.enable();
					
				}
			}

		});
var comboCities = new Ext.form.ComboBox({
			id : 'city',
			store : city,
			valueField : "value",
			displayField : "text",
			mode : 'local',
			forceSelection : true,
			emptyText : '请选择',
			hiddenName : 'region',
			editable : false,
			triggerAction : 'all',
			allowBlank : true,
			width:170,
			name : 'region',
		
			listeners : {
				select : function(combo, record, index) {
					comboAretes.reset();
					var area_db = combo.getValue();
					area=zhcn.getArea(area_db);
					comboAretes.store.loadData(area);
					comboAretes.enable();
				}
			}

		});
		
function init(){
	id = getCurArgs("id");
	eid = getCurArgs("eid");
	memberid = getCurArgs("memberid");
	buildForm();
	//getShopInfo();
	getUnAuditShop();
};

function getUnAuditShop(){
	Ext.lib.Ajax.request("post", "/wcwUser/wcwUserServlet.do?method=getUnAuditShop",{
		success : function(response){
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)){
				for(var v in data["result"]){
					data["result"][v] = data["result"][v] == null ? "" : data["result"][v];
				}
				grid.getForm().setValues(data["result"]);
                if(data["result"].logo !=null && data["result"].logo !=""){
				setLogo(data["result"].logo);
                }
				if(data["result"].sex == "男"){
					$("#sex1").attr("checked","true");
				}else if(data["result"].sex == "女"){
					$("#sex2").attr("checked","true");
				}else{
					$("#sex1").attr("checked","true");
				}
				var shopType=getShop_type_name(data["result"].shopType);
				$("#shopType").html(shopType);
				shop_id = data["result"].id;
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "memberId=" + memberid + "&id=" + id);
}

function getShopInfo(){
	Ext.lib.Ajax.request("post", "/wcwUser/wcwUserServlet.do?method=getUserInfo",{
		success : function(response){
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)){
				for(var v in data["result"]){
					data["result"][v] = data["result"][v] == null ? "" : data["result"][v];
				}
				grid.getForm().setValues(data["result"]);
                if(data["result"].logo !=null && data["result"].logo !=""){
				setLogo(data["result"].logo);
                }
				if(data["result"].sex == "男"){
					$("#sex1").attr("checked","true");
				}else if(data["result"].sex == "女"){
					$("#sex2").attr("checked","true");
				}else{
					$("#sex1").attr("checked","true");
				}
				var shopType=getShop_type_name(data["result"].shopType);
				$("#shopType").html(shopType);
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "memberId=" + memberid);
};
function buildForm(){
	panel = new Ext.form.FieldSet({
		border:true,
		width : 600,
		height:700,
		layout : 'form',
		bodyStyle : "min-height:100px;border:none;background-color:#DFE8F6;font-size:12px;",
		items:[{
		        	border : false,
		    		layout : 'table',
		    		layoutConfig : {
		    			columns : 2	
		    		},
		    		height:700,
		    		autoHeight : true,
		    		buttonAlign : 'left',
		    		labelAlign : 'right',
		    		items:[{columnWidth : 1,
		    				width : 300,
		    				autoHeight : true,
		    				layout : 'form',
		    				items:[{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'memberID',
		    						xtype : 'textfield',
		    						width:170,
		    						fieldLabel: '会员账号',
		    						readOnly : true,
		    						style : 'color:red;',
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'name',
		    						xtype : 'textfield',
		    						width:170,
		    						allowBlank : false,
		    						fieldLabel: '企业名称',
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id:'type',
		    						xtype : 'combo',
		    						store:shop_type,
		    						mode : 'local',
		    						forceSelection : true,
		    						triggerAction : 'all',
		    						allowBlank : false,
		    						readOnly : true,
		    						width:76,
		    						fieldLabel:"商铺类型：",
		    						displayField : 'text',
		    						valueField:'value'
		    					},{
		    						id : 'shopType',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:170,
		    	
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [comboProvinces,comboCities]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'addr',
		    						xtype : 'textfield',
		    						width:170,
		    						fieldLabel: '企业地址'
		    					}]
		    				},/*{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'mainMaterial',
		    						xtype : 'textfield',
		    						width:170,
		    						allowBlank : false,
		    						fieldLabel: '主营产品'
		    							
		    					}]
		    				},*/{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'saleArea',
		    						xtype : 'textfield',
		    						width:170,
		    						fieldLabel: '销售区域'
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 280,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'homePage',
		    						xtype : 'textfield',
		    						width:170,
		    						fieldLabel: '企业网址'
		    					}]
		    				}]
		    		},{
		    			columnWidth : 1,
		    			xtype : "fieldset",
		    			title : "企业logo",
		    			width : 100,
		    			autoHeight : true,
		    			layout : 'form',
		    			bodyStyle : "min-height:100px;border:none;background-color:#DFE8F6;font-size:12px;",
		    			items:[{
		    	                  html : "<img id='logo' src='' width='100px' height='100px' />"
		                       },{
							    	layout : 'table',
							    	items : [{
							    				xtype : "button",
							    				text : '上传',
							    				handler : function() {
							    					showUploadIWin();
							    				}
							    			}, {
							    				xtype : "button",
							    				text : '取消',
							    				handler : function() {
							    					Ext.fly("logo").dom.src = "";
					
							    				}
							    			}]
							    }]
		    		
		    		}]
		        },{
		   
		    			layout : 'form',
		    			width : 600,
		    			autoHeight : true,
		    			bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    			labelWidth:70,
		    			labelAlign:'right',
		    			items : [{
		    				layout : 'table',
		    				labelAlign : 'top',
		    				fieldLabel: '企业简介',
		    				items : [{
		    							xtype : 'htmleditor',
		    							id : 'discription',
		    							allowBlank : false,
		    							width : 600,
		    							height : 200
		    					
		    						}]
		    			}]
		    		},{
		    			xtype : "fieldset",
		    			title : "联系信息",
		    			width :575,
		    			colspan : 2,
		    			labelAlign:'right',
		    			bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    			items : [{
		    				layout : 'column',
		    				bodyStyle : 'text-align:right',
		    				
		    				items : [{
		    					layout : 'form',
		    					autoHeight : true,
		    					labelAlign:'right',
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,

		    					items : [{
		    						id : 'contact',
		    						xtype : 'textfield',
		    						width:170,	
		    						allowBlank : false,
		    						fieldLabel: '联系人'
		    					}]
		    				}, {
		    							layout : 'column',
		    							items : [
		    									new Ext.form.Radio({
		    										id : 'sex1',
		    										fieldLabel : '性别',
		    										boxLabel : '先生',
		    										inputValue : '男',
		    										width : 50,
		    										checked : true,
		    										name:"sex"
		    									}),
		    									new Ext.form.Radio({
		    												id : 'sex2',
		    												boxLabel : '女士',
		    												inputValue : '女',
		    					                            name:"sex",
		    												width : 50
		    											})]
		    						}]
		    			},{
		    				layout : 'form',
		    				autoHeight : true,
		    				labelAlign:'right',
		    				bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    				labelWidth:70,

		    				items : [{
		    					id : 'department',
		    					xtype : 'textfield',
		    					width:170,	
		    					fieldLabel: '职位'
		    				}]
		    			},{
		    				layout : 'form',
		    				width : 280,
		    				autoHeight : true,
		    				bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;margin-left:16px",
		    				labelWidth:100,
		    				labelAlign:'right',
		    				items : [{
		    					xtype : 'label',
		    					width:170,
		    					text:'联系方式: '
		    				},{
		    					text : '电话，手机，至少填一项',
		    					xtype : 'label',
		    					width:170,
		    					style : 'color:red;',
		    						
		    				}]
		    			},{
		    				layout : 'form',
		    				autoHeight : true,
		    				bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    				labelWidth:70,
		    				labelAlign:'right',
		    				items : [{
		    					id : 'phone',
		    					xtype : 'textfield',
		    					width:170,
		    					fieldLabel: '电话'
		    				}]
		    			},{
		    				layout : 'form',
		    				autoHeight : true,
		    				bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    				labelWidth:70,
		    				labelAlign:'right',
		    				items : [{
		    					id : 'mobile',
		    					xtype : 'textfield',
		    					width:170,
		    					
		    					fieldLabel: '手机'
		    				}]
		    			},{
		    				layout : 'form',
		    				autoHeight : true,
		    				bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    				labelWidth:70,
		    				labelAlign:'right',
		    				items : [{
		    					id : 'fax',
		    					xtype : 'textfield',
		    					width:170,
		    					fieldLabel: '传真'
		    				}]
		    			}]
		    		
		        }]
	});		              
	grid = new Ext.form.FormPanel({
		frame : true,
		autoWidth : true,
		height : "100%",
		align : "center",
		bodyStyle : "background-color:#DFE8F6",
		renderTo : 'grid',
		items : [{
			xtype : 'toolbar',
			items : [{
				text : '查看企业信息',
				icon : "/resource/images/book_open.png",
				hidden : compareAuth('MEM_AUDITREC_VIEW'),
				handler : empDetail
			}]
		},panel,{
			layout : 'form',
			width: 600,
			buttonAlign : 'center',
			buttons : [{
				text : '修改',
				handler : updateShop,
				hidden : compareAuth('CORP_SHOP_MOD')
			}]
		}]
	});
};
//修改商铺信息
function updateShop(){
    var type = Ext.getCmp("type").getValue();
    var name = Ext.getCmp('name').getValue();
    var province = Ext.getCmp("province").getValue();
    var city = Ext.getCmp("city").getValue();
    var addr = Ext.getCmp("addr").getValue();
    //var mainMaterial = Ext.getCmp("mainMaterial").getValue();
    var saleArea = Ext.getCmp("saleArea").getValue();
    var homePage = Ext.getCmp("homePage").getValue();
    var discription = Ext.getCmp("discription").getValue();
    var contact = Ext.getCmp("contact").getValue();
    var department = Ext.getCmp("department").getValue();
    var phone = Ext.fly("phone").getValue();
    var mobile = Ext.fly("mobile").getValue();
    if(phone=="" && mobile =="" ){
    	Info_Tip("联系方式必填一项");

    	return;
    }
    var fax = Ext.getCmp("fax").getValue();
    var logo = FileUpload_Ext.callbackMsg;
    var content = "province~"+province+";city~"+city + ";type~" + type
    +";addr~"+addr+";saleArea~"+saleArea+";homePage~"+homePage+";contact~"+contact+";phone~"+phone
    +";mobile~"+mobile+";fax~"+fax+";logo~"+logo+";department~"+department+";name~"+name;
    var sex1= Ext.getCmp("sex1").getValue();
    if(sex1){
    	content += ";sex~男";
    }
    var sex2= Ext.getCmp("sex2").getValue();
    if(sex2){
    	content += ";sex~女";
    }
    
    var sex ="";
    if(sex1){
    	sex = "男";
    }else if(sex2){
    	sex = "女";
    }else{
    	sex1 = "男";
    }
	Ext.lib.Ajax.request("post", "/wcwUser/wcwUserServlet.do", {
		success : function(response){
			var data = eval("(" + response.responseText + ")");
			if (getState(data.state, commonResultFunc, data.result)){
				Ext.MessageBox.alert("提示", "修改成功",closeWin);
			}
		},
		failure : function(){
			Warn_Tip();
		}
	}, "method=modifyUserInfo&memberId=" + memberid + "&sex="+sex+"&content=" + content+"&discription="+discription + "&shop_id=" + shop_id);
};
//查看企业信息
function empDetail() {
	window.parent.createNewWidget("enterprise_edit", '修改企业信息',
			'/module/enterprise/enterprise_edit.jsp?eid='
					+ eid);
};
/*
//改变商铺分类的颜色，重点分类为特定颜色
function changeCnameColor(){
	var cname = Ext.getCmp('cname').getValue();
	cname_ds.each(function(s){
		if(s.data.value == cname){
			var t = s.data.style.split(':');
			if(t.length > 1)
				Ext.fly('cname').dom.style.color = t[1];
			else
				Ext.fly('cname').dom.style.color = "";
		}
	});
};
*/
//设置企业图片
function setLogo(logo){
	if(logo){
		logo = FileUpload_Ext.requestURL + logo.replace(/\/\//g, "/");
		Ext.get("logo").dom.src = logo;
	}
};


var showUploadIWin = function() {
	FileUpload_Ext.clearConfig();
	FileUpload_Ext.requestType = "RS_EP";
	FileUpload_Ext.fileType = /jpg|JPG|JPEG|jpeg|GIF|gif/;
	FileUpload_Ext.initComponent();
};

function upload_fn() {
	Ext.get("logo").dom.src = FileUpload_Ext.requestURL+FileUpload_Ext.callbackMsg;

};

function closeWin() {
	//window.parent.Ext.getCmp('center').remove("shop_edit");
	if (parent.tab_1801_iframe){
		parent.tab_1801_iframe.ds.reload();
	}
	if(parent.tab_0308_iframe){
		parent.tab_0308_iframe.ds.reload();
	}
	if(parent.tab_0306_iframe){
		parent.tab_0306_iframe.ds.reload();
	}
	if(parent.tab_mat_fac_list_wsh_iframe){
		parent.tab_mat_fac_list_wsh_iframe.ds.reload();
	}
	window.parent.Ext.getCmp('center').remove("unaudit_shop_edit");
};

