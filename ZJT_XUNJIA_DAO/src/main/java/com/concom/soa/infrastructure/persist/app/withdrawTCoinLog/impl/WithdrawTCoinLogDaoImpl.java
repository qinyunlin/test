package com.concom.soa.infrastructure.persist.app.withdrawTCoinLog.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.withdrawTCoinLog.WithdrawTCoinLog;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.withdrawTCoinLog.WithdrawTCoinLogDao;

@Repository
public class WithdrawTCoinLogDaoImpl extends MybatisOperations<String, WithdrawTCoinLog> implements WithdrawTCoinLogDao {



	@Override
	public void AddWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog) {
		// TODO Auto-generated method stub
       getSqlSession().insert(getNamespace().concat(".insert"), withdrawTCoinLog);
	}

	@Override
	public int updateWithdrawTCoinLog(WithdrawTCoinLog withdrawTCoinLog) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().update(getNamespace().concat(".update"), withdrawTCoinLog);
	}

	@Override
	public Page<Map<String, String>> queryPageMap(Page<Map<String, String>> page) {
		List<Map<String, String>> maps=getSqlSession().selectList(getNamespace().concat(".queryPageMap"), page);
		page.setResult(maps);
		// TODO Auto-generated method stub
		return page;
	}

}
