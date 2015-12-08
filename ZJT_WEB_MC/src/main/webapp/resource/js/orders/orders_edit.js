Ext.onReady(init);
var id = "",code="", win;
var info_panel,info_update,grid_info,ds_info;
var detail_info_form,operateBy,guestUnitFieldSet;
var orderType = 1;

function init() {
	Ext.QuickTips.init();

	if (!Ext.isEmpty(getCurArgs("id"))) {
		id = getCurArgs("id");
		buildInfo(id);
	}
	
	if (!Ext.isEmpty(getCurArgs("code"))) {
		code = getCurArgs("code");
		updateOrdersHistory(code);
	}
	
};

function getTimeFormat(t) {
	if (!t) {
		return "";
	} else {
		return t.slice(0, 19);
	}
}
function updateOrdersHistory(code){
	Ext.Ajax.request({url:'/mc/Order.do',
			method:'POST',
			params:{
				type:'9',
				code : code
			},
		success:function(response){
			var jsondata=eval("("+response.responseText+")");
			if(getState(jsondata.state, commonResultFunc, jsondata.result)){
				var mem_info = jsondata.result;
				if(mem_info !=null){
					for(var i=0;i<mem_info.length;i++){
					 operateBy=mem_info[i].operateBy;
					var operateTime=mem_info[i].operateTime;
					var GuestInput = new Ext.form.FieldSet({
						columnWidth:.8,
						layout:'column',
						bodyStyle:'margin-left:12px;border-bottom:1px solid #ABC0C3;margin-bottom:8px;height:20px;maring-top:8px;',
						border:false,
						layoutCongif:{
							columns:4
						},
						items : [{
							width : 60,
				
							// autoHeight : true,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px;margin-left:4px;",
							items : [{
										xtype : "label",
										text : "修改人ID："
									}]
						}, {
							width : 60,
						
							// autoHeight : true,
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;margin-left:8px;",
							items : [{
										xtype : "label",
										text : operateBy
									}]
						}, {
							width : 140,
							// autoHeight : true,
					
							autoHeight : true,
							bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px;margin-left:28px;",
							items : [{
										xtype : "label",
										text :getTimeFormat(operateTime)
									}]
						}]
						
					});
					guestUnitFieldSet.add(GuestInput);
					}
					guestUnitFieldSet.doLayout();			 
			     }
			}
		}
	});
}


// 创建信息区域
function buildInfo(id) {
	Ext.lib.Ajax.request("post", "/mc/Order.do?type=10", {
		success : function(response) {
			var jsondata = eval("(" + response.responseText + ")");
			if (getState(jsondata.state, commonResultFunc, jsondata.result)) {
				var mem_info = jsondata.result;
				orderType = mem_info["type"];
				var base_info = new Ext.Panel({
					layout : "table",
					frame : true,
					layoutConfig : {
						columns : 4
					},
					items : [{
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "订单编号："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : mem_info["code"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "会员账号："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : mem_info["uid"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "下单时间："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									width : 160,
									text : mem_info["createOn"]
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "订单状态："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									width : 160,
									text : ordersStatusRen(mem_info["ordersStatus"])
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									width : 90,
									text : "发票状态："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									width : 160,
									text : sendInvoiceRen(mem_info["sendInvoice"],mem_info["invoice"])
								}]
					}, {
						width : 90,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									text : "开通状态："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									text : openServiceRen(mem_info["openService"])
								}]
					},{
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									width : 100,
									text : "套餐名称："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									width : 160,
									text : mem_info["ordersItem"]
								}]
					}, {
						width : 100,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:right;font-size:12px",
						items : [{
									xtype : "label",
									width : 100,
									text : "单价  元/年："
								}]
					}, {
						width : 160,
						autoHeight : true,
						bodyStyle : "border:none;min-height:26px;_height:26px;text-align:left;font-size:12px",
						items : [{
									xtype : "label",
									width : 160,
									text : mem_info["itemPrice"]
								}]
					},
					{
						width : 90,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
						items : [{
									xtype : "label",
									text : "服务时长  /月："
								}]
					}, {
						width : 190,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "服务时长  /月",
									maxLength : 50,
									allowBlank : false,
									id : "timeLength",
									value : mem_info["type"] == 1 ? mem_info["timeLength"] : mem_info["timeLength"] * 12,
									width : 160
								}]
					}/*{
						width : 190,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
						items : new Ext.form.ComboBox({
							id : 'timeLength',
							name : 'timeLength',
							mode : 'local',
							hiddenId : 'typeId',
							hiddenName : 'typeId',
							readOnly : true,
							triggerAction : 'all',
							fieldLabel : '服务时长  /年',
							allowBlank : false,
							value : (mem_info["type"] == 1 ? mem_info["timeLength"] / 12 : mem_info["timeLength"]),
							width : 180,
							valueField : 'value',
							displayField : 'text',
							store : new Ext.data.SimpleStore(
									{
										fields : ['value',
												'text'],
										data : [
												['1', '1年'],
												['2', '2年'],
												['3', '3年'],
												['4', '4年'],
												['5', '5年'],]
									}),listeners :{
										select :function() {
										
										var itemPrice = mem_info["itemPrice"];//套餐价格
										var timeLength = Ext.getCmp("timeLength").getValue();//服务时长
									
										if(itemPrice != null || itemPrice != "" || timeLength != null || timeLength != "" ){
											Ext.get("priceAcount").dom.value = itemPrice*timeLength;
										}
										
										
									 }
									}
									
						})
					}*/,{
						width : 90,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
						items : [{
									xtype : "label",
									text : "支付金额："
								}]
					}, {
						width : 190,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "支付金额",
									maxLength : 50,
									allowBlank : false,
									id : "priceAcount",
									value : mem_info["priceAcount"],
									width : 160
								}]
					},{
						width : 90,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
						items : [{
									xtype : "label",
									text : "索要发票："
								}]
					}, {
						width : 190,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
						items : new Ext.form.ComboBox({
							id : 'invoice',
							name : 'invoice',
							mode : 'local',
							readOnly : true,
							triggerAction : 'all',
							fieldLabel : '索要发票',
							allowBlank : false,
							value : mem_info["invoice"],
							width : 180,
							valueField : 'value',
							displayField : 'text',
							store : new Ext.data.SimpleStore(
									{
										fields : ['value',
												'text'],
										data : [
												['1', '是'],
												['2', '否']
												]
									})
							
						})
					},{
						width : 90,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
						items : [{
									xtype : "label",
									text : "发票信息："
								}]
					}, {
						width : 190,
						// autoHeight : true,
						height : 28,
						bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
						items : [{
									xtype : "textfield",
									fieldLabel : "发票信息",
									maxLength : 32,
									allowBlank : true,
									id : "invoiceInfo",
									value : mem_info["invoiceInfo"],
									width : 160
								}]
					}]
				});
                 
         

				var detail_info = new Ext.Panel({

					frame : true,
					layout : "table",
					layoutConfig : {
						columns : 3
					},
					minHeight : 200,
					items : [{
						bodyStyle : "border:none",
						width : 10
					}, new Ext.form.FieldSet({
						title : "订单信息",
						bodyStyle : "margin-left:10px",
						layout : "table",
						layoutConfig : {
							columns : 4
						},
						minHeight : 200,
						items : [{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "公司名称："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "公司名称",
										maxLength : 50,
										allowBlank : false,
										id : "eName",
										value : mem_info["eName"],
										width : 160
									}]
						},{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "联系人："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "联系人",
										maxLength : 50,
										allowBlank : false,
										id : "uName",
										value : mem_info["uName"],
										width : 160
									}]
						},{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "所属部门："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "所属部门",
										maxLength : 50,
										allowBlank : true,
										id : "dept",
										value : mem_info["dept"],
										width : 160
									}]
						},{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "职位："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "职位",
										maxLength : 50,
										allowBlank : true,
										id : "position",
										value : mem_info["position"],
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "手机号码："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "手机号码",
										maxLength : 50,
										
										allowBlank : false,
										regex : formMsg.mobilePatrn,
										regexText : formMsg.mobileError,
										id : "phone",
										value : mem_info["phone"],
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "固定电话："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "固定电话",
										maxLength : 50,
										regex : formMsg.phonePatrn,
										regexText : formMsg.phoneErrMsg,
										id : "mobile",
										value : mem_info["mobile"],
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "邮政编码："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "邮政编码",
										maxLength : 50,
										
										allowBlank : true,
										id : "postCode",
										value : mem_info["postCode"],
										width : 160
									}]
						},  {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "电子邮箱："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "电子邮箱",
										maxLength : 50,
										regex : formMsg.emailPatrn,
										regexText : formMsg.emailErrMsg,
										allowBlank : false,
										id : "email",
										value : mem_info["email"],
										width : 160
									}]
						}, {
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "地址："
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
										fieldLabel : "地址",
										maxLength : 90,
										allowBlank : false,
										id : "address",
										value : mem_info["address"],
										width : 160
									}]
						},
						{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;display:none;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
									
									}]
						}, {
							width : 160,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px; display:none;text-align:left;font-size:12px;",
							items : [{
										xtype : "textfield",
									
										maxLength : 90,
										allowBlank : true,
									
										width : 160
									}]
						},{
							width : 90,
							// autoHeight : true,
							height : 28,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:right;font-size:12px;font-size:12px;line-height:28px;",
							items : [{
										xtype : "label",
										text : "备注："
									}]
						}, {
							width : 400,
							autoHeight : true,
							//height : 28,
							colspan : 8,
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;",
							items : [{
										xtype : "textarea",
										fieldLabel : "备注",
										maxLength : 90,
										allowBlank : true,
										id : "notes",
										value : mem_info["notes"],
										width : 400
									}]
						},{
							bodyStyle : "border:none;min-height:28px;_height:28px;text-align:left;font-size:12px;line-height:28px;",
						    height:28
						},{
							colspan : 2,
							bodyStyle : "border:none;padding-left:20px;",
							items : [{
										xtype : "tbbutton",

										width : 90,
										text : "保存",
										handler : saveInfo,
										hidden : hiddenSaveButton(mem_info["ordersStatus"],mem_info["openService"])
									}]
						}]
					})]
				});
				detail_info_form = new Ext.FormPanel({
							layout : "form",
							autoWidth : true,
							autoHeight : true,
							bodyStyle : "border:none;margin-top:8px;",
							items : [detail_info]
						});
				
				
				info_panel = new Ext.Panel({
					border : false,
					frame : true,
					layout : "column",
					bodyStyle : "margin-left:10px;",
					layoutConfig : {
						columns : 3
					},
					renderTo : "orders_edit",
					items : [{
								layout : "form",
								width : 600,
								bodyStyle : "padding:10px;",
								autoHeight : true,
								items : [base_info,detail_info_form]
							},guestUnitFieldSet]

				});
			
				
			}
		},
		failure : function() {
			Warn_Tip();
		}
	}, "id=" + id)

};


 guestUnitFieldSet = new Ext.form.FieldSet({
	id:'guestUnit',
	name:'guestUnit',
	title:'修改信息',
	layout:'column',
	columnWidth:'.5',
	bodyStyle:'min-height:462px;margin-top:5px',
	items:[{
		
		}]
});
 
 function hiddenSaveButton(orderstatus,openstatus){
	 if (orderstatus == "2" && openstatus == "1") {// 已付款,未开通
			return true;
		}else{
			return false;
		}
 }
// 保存修改信息
function saveInfo() {
	if (!detail_info_form.getForm().isValid()) {
		Ext.Msg.alert("提示", "请按要求填写内容!");
		return;
	}
	var invoice = Ext.getCmp("invoice").getValue();//是否发票
	var open="";
    if(invoice == "是"){
    	open ="2";
    }else{
    	open ="3";
    }
	var timeLength = Ext.getCmp("timeLength").getValue();//服务时长
	if ("2" == orderType){
		timeLength = timeLength / 12;//线上则换算为年
	}
	var eName = Ext.getCmp("eName").getValue();//公司名称
	var uName = Ext.getCmp("uName").getValue();//联系人dept
	var dept = Ext.getCmp("dept").getValue();//所属部门
	var position = Ext.getCmp("position").getValue();//职位
	var phone = Ext.getCmp("phone").getValue();//手机
	var mobile = Ext.getCmp("mobile").getValue();//固定电话
	var postCode = Ext.getCmp("postCode").getValue();//邮政编码
	var email = Ext.getCmp("email").getValue();//电子邮箱
	var address = Ext.getCmp("address").getValue();//联系地址
	var notes = Ext.getCmp("notes").getValue();//备注
	var priceAcount=Ext.getCmp("priceAcount").getValue();
	if (parseFloat(priceAcount) < parseFloat("1000")){
		alert("支付金额不能少于1000元！");
		return false;
	}

	var contents ="invoice~" + invoice
	+";timeLength~" + timeLength + ";eName~" + eName + ";uName~"
	+ uName + ";dept~" + dept + ";email~" + email + ";address~"+address+ ";notes~"+notes
	+ ";position~" + position + ";phone~"+phone+ ";mobile~" + mobile + ";postCode~"+postCode
	+";priceAcount~"+priceAcount+";sendInvoice~"+open;
	Ext.Ajax.request({
		url : '/mc/Order.do',
		method:'POST',
		params:{
			type:6,
			id:id,
			code:code,
			content:contents
		},
		success:function(response){
			var json = eval("(" + response.responseText + ")");
			if (getState(json.state, commonResultFunc, json.result)) {
				Ext.MessageBox.alert("提示", "订单修改成功",closeWin);
				parent.tab_0208_iframe.ds.reload();
			}
		},
		failure : function() {
			Warn_Tip();
		}
	});

};


function ordersStatusRen(v) {
	var stName = "";
	if (v == "1") {
		stName = "未付款";
	} else if (v == "2") {
		stName = "已付款";
	} else if (v == "3") {
		stName = "已取消";
	}
	return stName;
}
/*function ordersCodeRen(value, p, record) {
	var code = record.data.code;
	var type = record.data['type'];
	var stName = "";
	if (type == "1") {
		stName = "<span style='color:red;'>" + code + "</span>";
	} else if (type == "2") {
		stName = code;
	}
	return stName;
}*/
function openServiceRen(v) {

	var stName = "";
	if (v == "1") {
		stName = "已开通";
	} else if (v == "2") {
		stName = "未开通";
	}
	return stName;
}
function sendInvoiceRen(sendInvoice,invoice) {
	var stName = "无提供";
	if ("1" == invoice){
		if ("1" == sendInvoice){
			stName = "已处理";
		}else{
			stName = "未处理";
		}
	}
	return stName;
}


function closeWin() {
	window.parent.Ext.getCmp('center').remove("orders_edit");
};

// 得到日期
function getDate(v) {
	if (v)
		return v.substring(0, 10);
	return "";
};
