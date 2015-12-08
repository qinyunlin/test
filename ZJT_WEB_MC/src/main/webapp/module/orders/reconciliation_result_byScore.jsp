<%@page import="org.yeeda.costexpress.service.orders.model.OrdersMD5Info"%>
<%@page import="org.yeeda.costexpress.util.MD5"%>
<%@page language="java" import="java.sql.*" import="java.util.*" contentType="text/html; charset=utf-8" %>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="org.yeeda.costexpress.order.score.service.impl.ScoreOrderServiceImpl"%>
<%@page import="org.yeeda.costexpress.order.score.dto.ScoreOrder"%>
<%@page import="org.yeeda.costexpress.order.score.service.ScoreOrderService"%>
<%@page import="org.yeeda.costexpress.exception.CommonException"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
<%!/**
	 * 积分订单对账
	 */
	private synchronized void reconciliation(HttpServletRequest request,
			HttpServletResponse response) {
		/** 积分订单，仅供定时对账银行回调 **/
		String oid = request.getParameter("v_oid");
		String md5str = request.getParameter("v_md5str");
		String pstatus = request.getParameter("v_pstatus");
		String amount = request.getParameter("v_amount");
		String moneytype = request.getParameter("v_moneytype");
		//20表示付款成功
		if ("20".equals(pstatus)) {
			ScoreOrderService sOrderService = new ScoreOrderServiceImpl();
			//付款成功,更新订单状态
			if (!ParameterUtil.isEmpty(oid, true)) {
				ScoreOrder scoreOrder = sOrderService.getScoreOrder(" tScoreOrders.code = '"
						+ oid + "'");
				if (scoreOrder == null) {
					System.out.println("订单号：" + oid + "对应的记录不存在！");
				}else{
					MD5 md5 = new MD5();
					String md5Validate = md5.chinaBankOrdersSearch(amount,
							moneytype, oid, pstatus, OrdersMD5Info.MD5KEY);
					if (!md5Validate.equals(md5str)){
						System.out.println("订单号" + oid + "银行加密数据" + md5str + "与系统加密数据" + md5Validate + "不匹配！");
					}else{
						// 充值订单状态为1-已付款成功，则无需重复更新状态
						if (!"1".equals(scoreOrder.getOrderStatus())) {
							scoreOrder.setOrderStatus("1");
							scoreOrder.setType("0");
							sOrderService.addDetailAndUpdateInfo(scoreOrder, "sys", false, false, "");
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
