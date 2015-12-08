package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPriceAllot;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceAllotDao;

@Repository
public class AskPriceAllotDaoImpl extends MybatisOperations<String, AskPriceAllot> implements AskPriceAllotDao{

	@Override
	public void add(AskPriceAllot askPriceAllot) {
		getSqlSession().insert(getNamespace().concat(".add"), askPriceAllot);
	}

	@Override
	public List<AskPriceAllot> queryListByAskPriceId(String askPriceId) {
		return getSqlSession().selectList(getNamespace().concat(".queryListByAskPriceId"), askPriceId);
	}

	@Override
	public AskPriceAllot queryByAskPriceIdAndUserName(Map<String, String> params) {
		return getSqlSession().selectOne(getNamespace().concat(".queryByAskPriceIdAndUserName"), params);
	}

	@Override
	public AskPriceAllot queryByAskPriceId(Map<String, String> params) {
		// TODO Auto-generated method stub
		return getSqlSession().selectOne(getNamespace().concat(".queryByAskPriceId"), params);
	}

}
