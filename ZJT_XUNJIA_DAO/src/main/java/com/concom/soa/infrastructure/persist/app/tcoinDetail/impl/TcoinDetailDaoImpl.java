package com.concom.soa.infrastructure.persist.app.tcoinDetail.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.tcoinDetail.TcoinDetailLog;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.tcoinDetail.TcoinDetailDao;

@Repository
public class TcoinDetailDaoImpl extends MybatisOperations<String, TcoinDetailLog> implements TcoinDetailDao {

	

	@Override
	public int addTcoinDetail(TcoinDetailLog tcoinDetailLog) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().insert(getNamespace().concat(".insert"), tcoinDetailLog);
	}

	@Override
	public TcoinDetailLog getTcoinDetailLogOfReward(String today, int type,
			String memberId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("today", today);
		params.put("type", type);
		params.put("memberId", memberId);
		return getSqlSession().selectOne(getNamespace().concat(".hasRewardRecord"), params);
	}
	
	@Override
	public Page<Map<String, String>> queryPageMap(Page<Map<String, String>> page){
		List<Map<String, String>> detailLogs=getSqlSession().selectList(getNamespace().concat(".queryPageMap"), page);	
	    page.setResult(detailLogs);
		return page;
	}
}
