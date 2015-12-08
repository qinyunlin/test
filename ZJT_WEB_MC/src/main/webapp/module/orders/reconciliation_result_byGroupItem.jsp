<%@page import="org.yeeda.costexpress.dto.orders.OrdersItem"%>
<%@page import="org.yeeda.costexpress.service.orders.impl.OrdersItemServiceImpl"%>
<%@page import="org.yeeda.costexpress.service.orders.OrdersItemService"%>
<%@page import="org.yeeda.costexpress.util.MD5"%>
<%@page import="org.yeeda.costexpress.service.orders.model.OrdersMD5Info"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.SimpleDateFormat"%>
<%@page import="org.yeeda.costexpress.dto.orders.OrdersHistory"%>
<%@page language="java" import="java.sql.*" import="java.util.*" contentType="text/html; charset=utf-8" %>
<%@page import="org.yeeda.costexpress.service.member.model.MemberAuditBean"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="org.yeeda.costexpress.service.member.MemberAuditService"%>
<%@page import="org.yeeda.costexpress.service.member.factory.MemberAuditServiceFactory"%>
<%@page import="org.yeeda.costexpress.service.orders.impl.OrdersServiceImpl"%>
<%@page import="org.yeeda.costexpress.dto.orders.Orders"%>
<%@page import="org.yeeda.costexpress.service.orders.OrdersService"%>
<%@page import="org.yeeda.costexpress.exception.CommonException"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
<%!
	/**
	 * 添加订单操作历史
	 * 
	 * @author
	 * @param orders
	 */
	private void addOrdersHistory(Orders orders, String op) {
		OrdersService ordersService = new OrdersServiceImpl();
		OrdersHistory history = new OrdersHistory();
		history.setOrderCode(orders.getCode());
		history.setComment(op);
		history.setOperateBy(orders.getUpdateBy());
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		history.setOperateTime(sdf.format(new Date()));
		ordersService.addOrdersHistory(history);
	}

	/**
	 * 套餐订单对账
	 */
	private synchronized void reconciliation(HttpServletRequest request,
			HttpServletResponse response) {//20表示付款成功
		String oid = request.getParameter("v_oid");
		String md5str = request.getParameter("v_md5str");
		String pstatus = request.getParameter("v_pstatus");
		String amount = request.getParameter("v_amount");
		String moneytype = request.getParameter("v_moneytype");
	if ("20".equals(pstatus)) {
		OrdersService ordersService = new OrdersServiceImpl();
		//付款成功,更新订单状态
		if (!ParameterUtil.isEmpty(oid, true)) {
			// 检查订单存在
			Orders orders = ordersService.getOrdersByCode(oid);
			MemberAuditService service = MemberAuditServiceFactory.getInstance();
			OrdersItemService ordersItemService = new OrdersItemServiceImpl();
			if (orders == null) {
				System.out.println("出现异常，订单号为空！");
			}else{
				MD5 md5 = new MD5();
				String md5Validate = md5.chinaBankOrdersSearch(amount,
						moneytype, oid, pstatus, OrdersMD5Info.MD5KEY);
				if (!md5Validate.equals(md5str)){
					System.out.println("订单号" + oid + "银行加密数据" + md5str + "与系统加密数据" + md5Validate + "不匹配！");
				}else{
					if (!"2".equals(orders.getOrdersStatus())){
						// 审核开通服务
						MemberAuditBean bean = new MemberAuditBean();
						bean.setOrdersCode(oid);
						bean.setAuditor("sys");
						//bean.setCurrScore(String.valueOf((int)Float.parseFloat(orders.getPriceAcount())));
						OrdersItem ordersItem = ordersItemService.getOrdersItemById(orders.getOrdersItemType());
						int year = 1;
						if ("1" == orders.getType()){ //线下开通
							//月转年
							year = Integer.parseInt(orders.getTimeLength()) / 12; //取整
						}else{//线上开通
							year = Integer.parseInt(orders.getTimeLength());
						}
						bean.setCurrScore(((int)Double.parseDouble(ordersItem.getPrice())) * year + "");
						boolean result = service.auditMember(bean);
						if (result) {
							// 添加操作历史
							addOrdersHistory(orders, "开通");
						} else {
							System.out.println("出现异常，订单号" + oid + "开通失败！");
						}
					}else{
						System.out.println("出现异常，订单号" + oid + "已开通，不能重复开通！");
					}
				}
			}
		}else{
			System.out.println("出现异常，订单号为空！");
		}
		System.out.println("订单号：" + oid + "对账成功，付款状态：已付款！");
	}else{
		System.out.println("订单号：" + oid + "对账成功，付款状态：未付款！");
	}
	}
%>

<%
	reconciliation(request,response);
%>
</body>
</html>
