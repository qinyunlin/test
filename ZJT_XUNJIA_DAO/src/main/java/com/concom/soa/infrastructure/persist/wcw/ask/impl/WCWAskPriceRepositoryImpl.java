package com.concom.soa.infrastructure.persist.wcw.ask.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.wcw.ask.WCWAskPriceRepository;

/**
 * 
 * @author zhengreat
 *
 */
@Repository
public class WCWAskPriceRepositoryImpl extends MybatisOperations<String, AskPrice> implements WCWAskPriceRepository {

	public AskPrice getById(String id) {
		AskPrice askPrice = getSqlSession().selectOne(getNamespace().concat(".getById"), id);
		
		return askPrice;
	}

	public Page<AskPrice> queryPageForWcwSJB(Page<AskPrice> page) {
		List<AskPrice> result = getSqlSession().selectList(getNamespace().concat(".queryPageForWcwSJB"), page);
		if(null != result && !result.isEmpty()){
			page.setResult(result);
		}
		return page;
	}

	public List<String> getCidsForWcwSJB(Page<AskPrice> page) {
		List<String> result = getSqlSession().selectList(getNamespace().concat(".getCidsForWcwSJB"), page);
		return result;
	}
	

	public List<AskPrice> getAskPriceByIds(List<String> ids) {
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("ids", ids);
		List<AskPrice> result = getSqlSession().selectList(getNamespace().concat(".getAskPriceByIds"),map);
		return result;
	}

	public void revNumIncrement(String askId) {
		int revNum = (Integer)getSqlSession().selectOne("com.concom.soa.dto.reply.AskReply.getRevNumById", askId);
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("askId", askId);
		params.put("revNum", revNum+1);
		getSqlSession().update("com.concom.soa.dto.reply.AskReply.revNumIncrement", params);
	}

	@Override
	public int queryForWcwSJBCount(Page<AskPrice> page) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryForWcwSJBCount"), page);
	}

}
