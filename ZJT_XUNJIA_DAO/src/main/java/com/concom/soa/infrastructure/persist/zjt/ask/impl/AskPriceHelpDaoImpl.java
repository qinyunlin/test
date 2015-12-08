package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPriceHelp;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceHelpDao;

@Repository
public class AskPriceHelpDaoImpl extends MybatisOperations<String, AskPriceHelp> implements AskPriceHelpDao {

	@Override
	public Page<AskPriceHelp> queryPage(Page<AskPriceHelp> page) {
		List<AskPriceHelp> askPrices = getSqlSession().selectList(getNamespace().concat(".queryPage"), page);
		page.setResult(askPrices);
		return page;
	}

	@Override
	public int queryAskPriceHelpCount(Page<AskPriceHelp> page) {
		
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), page);
	}

	@Override
	public void delete(Map<String, String> map) {
		getSqlSession().delete(getNamespace().concat(".delete"));
		
	}

	@Override
	public void add(AskPriceHelp askPriceHelp) {
		getSqlSession().insert(getNamespace().concat(".insert"), askPriceHelp);
	}

}
