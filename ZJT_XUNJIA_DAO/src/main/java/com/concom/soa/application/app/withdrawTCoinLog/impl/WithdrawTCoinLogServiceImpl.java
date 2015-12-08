package com.concom.soa.application.app.withdrawTCoinLog.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.withdrawTCoinLog.WithdrawTCoinLog;
import com.concom.lang.Page;
import com.concom.soa.application.app.withdrawTCoinLog.WithdrawTCoinLogService;
import com.concom.soa.infrastructure.persist.app.withdrawTCoinLog.WithdrawTCoinLogDao;

@Service
public class WithdrawTCoinLogServiceImpl implements
		WithdrawTCoinLogService {

	@Autowired
	private WithdrawTCoinLogDao withdrawTCoinLogDao;
	@Override
	public Page<WithdrawTCoinLog> queryPage(Page<WithdrawTCoinLog> page) {
		// TODO Auto-generated method stub
		return withdrawTCoinLogDao.queryPage(page);
	}

	@Override
	public void AddWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog) {
		// TODO Auto-generated method stub
		withdrawTCoinLogDao.AddWithdrawTCoinLog(withdrawTCoinLog);
	}

	@Override
	public int updateWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog) {
		// TODO Auto-generated method stub
		return withdrawTCoinLogDao.updateWithdrawTCoinLog(withdrawTCoinLog);
	}

	@Override
	public Page<Map<String, String>> queryPageMap(Page<Map<String, String>> page) {
		// TODO Auto-generated method stub
		return withdrawTCoinLogDao.queryPageMap(page);
	}
	
	

}
