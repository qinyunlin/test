Ext.onReady(init);
var zhcn = new Zhcn_Select();
var eid="",ds, grid, panel;
var flag="NO";
var oldName="";
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
		



var templateArray = [['000100DR00De', '普通版'], ['000100DR00EI', '企业版'],['000100DR00EJ','VIP版']];
var template_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : templateArray
});
//商铺分类
/*
var cname_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text', 'style'],
	data : getShop_db()
});
*/
var cid_store = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : cid_db
});
//非标分类
var cname1_ds = new Ext.data.ArrayStore({
	fields : ['value', 'text'],
	data : getStuff_feibiao()
});
function init(){
	eid = getCurArgs("eid");
	buildForm();
	getShopInfo();
	
};
function getShopInfo(){
	Ext.lib.Ajax.request("post", "/ep/EpShopServlet?type=3",{
		success : function(response){
			var data = eval("(" + response.responseText + ")");
			oldName = data.result.ename;
			if (getState(data.state, commonResultFunc, data.result)){
				for(var v in data["result"]){
					data["result"][v] = data["result"][v] == null ? "" : data["result"][v];
				}
				grid.getForm().setValues(data["result"]);
                if(data["result"].logo !=null && data["result"].logo !=""){
				setLogo(data["result"].logo);
                }
				//changeCnameColor();
				if(data["result"].sex == "男"){
					$("#sex1").attr("checked","true");
				}else if(data["result"].sex == "女"){
					$("#sex2").attr("checked","true");
				}else{
					$("#sex1").attr("checked","true");
				}
				
				if(data["result"].isAudit == 1){
					$("#isAudit").html("已审核");
				} else {
					$("#isAudit").html("未审核");
				}
				var createOn=data["result"].createOn;
				$("#createOn").html(createOn);
				var updateOn=data["result"].updateOn;
				$("#updateOn").html(updateOn);
				var validDate=data["result"].validDate;
				if (validDate != null){
					$("#validDate").html(validDate.split(" ")[0]);
				}
				var matCount=data["result"].matCount;
				$("#matCount").html(matCount);
				//高档4，中高档3，中档2，普通1
				var grade=parseInt(data["result"].grade);
				switch(grade){
					case 4 :
						$("#grade").html("高档");
						break;
					case 3 :
						$("#grade").html("中高档");
						break;
					case 2 :
						$("#grade").html("中档");
						break;
					case 1 :
						$("#grade").html("普通");
						break;
				}
				var sort=data["result"].sort;
				$("#sort").html=sort;
				
				
				var subcid=data["result"].subcid;
				var cid=data["result"].cid;
				var shopType=getShop_type_name(data["result"].shopType);
				
				$("#shopType").html(shopType);
				var cids=cid.split(";");
				var name="";
				for(var i=0;i<cids.length;i++){
					if(cids.length>1){
						 name +=getStuffName(cids[i]);
						if((i+1)!=cids.length){
							 name +="; "; 
						}
					}else{
						name=getStuffName(cids[i]);
					}
					
				}
				$("#corpn").html(data["result"].corpn);
				$("#postCode").html(data["result"].postCode);
			
				$("#cid").html(name);
				var subcids=subcid.split(";");
				var name="";
				for(var i=0;i<subcids.length;i++){
					name+=getSubCidNameBySubcid(subcids[i]);
					if((i+1)!=subcids.length){
						 name +="; "; 
					}
				}
				$("#mainMaterial").html(name);
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "eid=" + eid);
};

function buildForm(){
	panel = new Ext.form.FieldSet({
		border:true,
		width : 800,
		//autoWidth : true,
		//height:800,
		layout : 'form',
		bodyStyle : "min-height:100px;border:none;background-color:#DFE8F6;font-size:12px;",
		items:[{
		        	border : false,
		    		layout : 'table',
		    		layoutConfig : {
		    			columns : 4	
		    		},
		    		//height:700,
		    		autoHeight : true,
		    		buttonAlign : 'left',
		    		labelAlign : 'right',
		    		items:[{
		    				columnWidth : 4,
		    				width : 800,
		    				autoHeight : true,
		    				layout : 'form',
		    				items:[{
		    					layout : 'form',
		    					width : 1000,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
					    			xtype : "fieldset",
					    			title : "企业logo",
					    			width : 400,
					    			autoHeight : true,
					    			layout : 'form',
					    			bodyStyle : "min-height:100px;border:none;background-color:#DFE8F6;font-size:12px;padding-left:10px;",
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
					    		},{
		    						id : 'manageID',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '会员账号',
		    						readOnly : true,
		    						style : 'color:red;',
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'eid',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '企业ID',
		    						readOnly : true,
		    						style : 'color:red;'
		    						
		    					}]
		    				}, {
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"审核状态：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'isAudit',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
	    					},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"创建时间：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'createOn',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
	    					},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"有效时间：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'validDate',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
	    					},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"报价时间：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'updateOn',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
	    					},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'catalogId',
		    						xtype : 'combo',
		    						mode : 'local',
		    						triggerAction : 'all',
		    						width:200,
		    						fieldLabel: '商铺模板',
		    						forceSelection : true,
		    						allowBlank : false,
		    						editable : false,
		    						store : template_ds,
		    						valueField : 'value',
		    						displayField : 'text'
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'name',
		    						xtype : 'textfield',
		    						width:300,
		    						allowBlank : false,
		    						fieldLabel: '企业名称',
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'corpn',
		    						xtype : 'textfield',
		    						width:300,
		    						allowBlank : false,
		    						fieldLabel: '法人代表',
		    						
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"所属行业：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'cid',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:600,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"商铺档次：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'grade',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"材料数：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'matCount',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'sort',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '排序'
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"商铺类型：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'shopType',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:300,
		    	
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
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'addr',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '企业地址'
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'postCode',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '邮政编码'
		    					}]
		    				},{
		    					layout : 'form',
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;float:left;padding-left:0px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						
		    						xtype : 'label',
		    						readOnly : true,
		    						width:76,
		    						text:"主营材料：",
		    						style:"line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					},{
		    						id : 'mainMaterial',
		    						xtype : 'label',
		    						readOnly : true,
		    						width:600,
		    						style:"text-align:left;line-height:26px;_height:26px;float:left;padding-left:0px;",
		    						displayField : 'text',
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'saleArea',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '销售区域'
		    					}]
		    				},{
		    					layout : 'form',
		    					width : 400,
		    					autoHeight : true,
		    					bodyStyle : "border:none;min-height:26px;_height:26px;background-color:#DFE8F6;font-size:12px;",
		    					labelWidth:70,
		    					labelAlign:'right',
		    					items : [{
		    						id : 'homePage',
		    						xtype : 'textfield',
		    						width:300,
		    						fieldLabel: '企业网址'
		    					}]
		    				}]
		    		}]
		        },{
					colspan : 4,
					layout : 'column',
					bodyStyle : "border:none;background-color:#DFE8F6;font-size:12px;",
					items : [{
						width : 70,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "label",
									text : "企业简介："
								}]
					}, {
						autoWidth : true,
						autoHeight : true,
						layout : "fit",
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;background-color:#DFE8F6;font-size:12px;",
						items : [{
									xtype : "htmleditor_simple",
									id : "discription",
									name : 'discription',
									text : "企业简介",
									width : 600,
									maxLength : 2000
								}]
					}]
				},{
		    			xtype : "fieldset",
		    			title : "联系信息",
		    			width :680,
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
				text : '查看商铺信息',
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
function is_int(number) {
    return ! isNaN(parseInt(number));
}
//修改商铺信息
function updateShop(){
    //var shopType = Ext.getCmp("shopType").getValue();
    var name = Ext.getCmp('name').getValue();
    var catalogId = Ext.getCmp("catalogId").getValue();
    var province = Ext.getCmp("province").getValue();
    var city = Ext.getCmp("city").getValue();
    var addr = Ext.getCmp("addr").getValue();
    var saleArea = Ext.getCmp("saleArea").getValue();
    var homePage = Ext.getCmp("homePage").getValue();
    var description = Ext.fly("discription").getValue();
    var contact = Ext.getCmp("contact").getValue();
    var department = Ext.getCmp("department").getValue();
    var phone = Ext.fly("phone").getValue();
    var mobile = Ext.fly("mobile").getValue();
    var corpn = Ext.fly("corpn").getValue();
    var postCode = Ext.fly("postCode").getValue();
    if(phone=="" && mobile =="" ){
    	Info_Tip("联系方式必填一项");

    	return;
    }
    var fax = Ext.getCmp("fax").getValue();
    var logo = FileUpload_Ext.callbackMsg;
    var sex1= Ext.getCmp("sex1").getValue();
    var sort= Ext.getCmp("sort").getValue();
    if(!is_int(sort) || sort<0){
    	Info_Tip("请输入正整数排序值");

    	return;
    }
    if(name != oldName){
    	flag="yes";
    }
    var content = "province~"+province+";city~"+city
    +";addr~"+addr+";saleArea~"+saleArea+";homePage~"+homePage+";contact~"+contact+";phone~"+phone
    +";mobile~"+mobile+";fax~"+fax+";logo~"+logo+";department~"+department+";name~"+name+";sort~"+sort+";corpn~"+corpn+";postCode~"+postCode+";flag~"+flag;
    if(sex1){
    	content += ";sex~男";
    }
    var sex2= Ext.getCmp("sex2").getValue();
    if(sex2){
    	content += ";sex~女";
    }
    
    
    
    Ext.Ajax.request({
		url : "/ep/EpShopServlet",
		params : {
			type : 5,
			eid : eid,
			content : content,
			name:name,
			catalogId:catalogId,
			description : description,
			sort : sort,
		},
		success : function(response) {
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "修改成功",closeWin);
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
			}

		},
		failure : function() {
			Warn_Tip();
		}
	});
    

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
	window.parent.Ext.getCmp('center').remove("shop_edit");
};

