package com.concom.soa.application.app.withdrawTCoinLog;

import java.util.Map;

import com.concom.entity.dto.xunjia.app.withdrawTCoinLog.WithdrawTCoinLog;
import com.concom.lang.Page;

public interface WithdrawTCoinLogService {
	
	/**
	 * 根据条件查询app会员提现纪录
	 * @param page
	 * @return
	 */
	public Page<WithdrawTCoinLog> queryPage(Page<WithdrawTCoinLog> page);
	
	/**
	 * 添加提现内容
	 * @param withdrawTCoinLog
	 */
	public void AddWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog);

	/**
	 * 根据条件修改提现内容
	 * @param withdrawTCoinLog
	 */
	public int updateWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog);
	
	/**
	 * 后台查询所有会员通币明细列表
	 * @param page
	 * @return
	 */
	public Page<Map<String, String>> queryPageMap(Page<Map<String, String>> page);
}
