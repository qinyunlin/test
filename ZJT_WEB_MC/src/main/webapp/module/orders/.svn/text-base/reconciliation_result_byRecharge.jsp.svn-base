<%@page import="org.yeeda.costexpress.util.DateUtil"%>
<%@page import="org.yeeda.costexpress.service.orders.model.OrdersMD5Info"%>
<%@page import="org.yeeda.costexpress.util.MD5"%>
<%@page import="org.yeeda.costexpress.service.orders.impl.OrdersCodeUtil"%>
<%@page import="org.yeeda.costexpress.order.recharge.dto.AccountDetail"%>
<%@page import="org.yeeda.costexpress.dto.member.Member"%>
<%@page import="java.util.Date"%>
<%@page import="java.text.DecimalFormat"%>
<%@page import="org.yeeda.costexpress.service.member.impl.MemberServiceImpl"%>
<%@page import="org.yeeda.costexpress.service.member.MemberService"%>
<%@page language="java" import="java.sql.*" import="java.util.*" contentType="text/html; charset=utf-8" %>
<%@page import="org.yeeda.costexpress.dto.member.User"%>
<%@page import="org.yeeda.costexpress.exception.CommonException"%>
<%@page import="org.yeeda.costexpress.order.recharge.dto.RechargeOrder"%>
<%@page import="org.yeeda.costexpress.order.recharge.service.impl.RechargeOrderServiceImpl"%>
<%@page import="org.yeeda.costexpress.order.recharge.service.RechargeOrderService"%>
<%@page import="org.yeeda.costexpress.util.ParameterUtil"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
</head>

<body>
<%!
	/**
	 * 增加账户明细
	 **/
	private synchronized void addAccountDetailInfo(String userId, RechargeOrder rechargeOrder, String note){
		// 会员业务实现类
		MemberService memberService = new MemberServiceImpl();
		// 套餐组业务实现类
		RechargeOrderService rOrderService = new RechargeOrderServiceImpl();
		// 数字格式化
		DecimalFormat df = new DecimalFormat("#0.00");
		try {
			String timeOn = DateUtil.formatDate(new Date(),
					"yyyy-MM-dd HH:mm:ss");
			// 1.更新充值订单状态
			RechargeOrder updateRechargeOrder = new RechargeOrder();
			updateRechargeOrder.setOrderStatus(rechargeOrder.getOrderStatus());
			updateRechargeOrder.setPaymentOn(timeOn);
			// 更新
			rOrderService
					.updateRechargeOrder(
							updateRechargeOrder,
							" tRechargeOrders.code = '"
									+ rechargeOrder.getCode() + "'");
			// 2.获取当前账户信息,更新账户余额
			Member member = memberService.get(rechargeOrder.getMemberId());
			if (member == null) {
				throw new Exception("账户不存在，请重新再试！");
			}
			Member updateMember = new Member();
			Double currAccountBalance = Double.parseDouble(member
					.getAccountBalance())
					+ Double.parseDouble(rechargeOrder.getMoney());
			updateMember.setAccountBalance(df.format(currAccountBalance) + "");
			updateMember.setUpdateOn(timeOn);
			updateMember.setUpdateBy(userId);
			// 更新会员
			memberService.updateMember(rechargeOrder.getMemberId(),
					updateMember);
			// 3.插入账户明细记录
			AccountDetail accountDetail = new AccountDetail();
			String currAutoCode = OrdersCodeUtil.generatedOrderCode("ZH");
			accountDetail.setCode(currAutoCode);
			accountDetail.setCreateBy(userId);
			accountDetail.setCreateOn(timeOn);
			accountDetail.setFloatAmount(rechargeOrder.getMoney());
			accountDetail.setAccountBalance(updateMember.getAccountBalance());
			accountDetail.setMemberId(rechargeOrder.getMemberId());
			accountDetail.setNote(note);
			accountDetail.setStatus("0");
			accountDetail.setType("0");
			// 添加账户明细
			rOrderService.addAccountDetail(accountDetail);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	/**
	 * 充值订单对账
	 */
	private synchronized void reconciliation(HttpServletRequest request,
			HttpServletResponse response) {//20表示付款成功
		String oid = request.getParameter("v_oid");
		String md5str = request.getParameter("v_md5str");
		String pstatus = request.getParameter("v_pstatus");
		String amount = request.getParameter("v_amount");
		String moneytype = request.getParameter("v_moneytype");
		if ("20".equals(pstatus)) {
			RechargeOrderService rechargeService= new RechargeOrderServiceImpl();
			//付款成功,更新订单状态
			if (!ParameterUtil.isEmpty(oid, true)) {
				RechargeOrder rechargeOrder = rechargeService
							.getRechargeOrderByCondition(" tRechargeOrders.code = '"
									+ oid + "'");
				if (rechargeOrder == null) {
					System.out.println("订单号：" + oid + "对应的记录不存在！");
				}else{
					MD5 md5 = new MD5();
					String md5Validate = md5.chinaBankOrdersSearch(amount,
							moneytype, oid, pstatus, OrdersMD5Info.MD5KEY);
					if (!md5Validate.equals(md5str)){
						System.out.println("订单号" + oid + "银行加密数据" + md5str + "与系统加密数据" + md5Validate + "不匹配！");
					}else{
						// 充值订单状态为1-已付款成功，则无需重复更新状态
						if (!"1".equals(rechargeOrder.getOrderStatus())) {
							rechargeOrder.setOrderStatus("1");
							addAccountDetailInfo("sys",
									rechargeOrder, "充值");
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
