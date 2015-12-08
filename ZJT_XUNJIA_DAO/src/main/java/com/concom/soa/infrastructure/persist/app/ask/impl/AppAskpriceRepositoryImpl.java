package com.concom.soa.infrastructure.persist.app.ask.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.ask.AppAskpriceRepository;
@Repository
public class AppAskpriceRepositoryImpl extends MybatisOperations<String, AskPrice> implements
		AppAskpriceRepository {

	public Map<String, Object> getAskpriceById(String id) {
		
		return getSqlSession().selectOne(getNamespace().concat(".getByIdForApp"), id);
	}

	public Page<Map<String, Object>> searchUnsolvedPrice(Page<Map<String, Object>> page) {
		
		List<Map<String, Object>> result = getSqlSession().selectList(getNamespace().concat(".queryPageUnsolvedPrice"), page);
		if(null != result && !result.isEmpty()){
			page.setResult(result);
		}
		return page;
	}


	@Override
	public Page<Map<String, Object>> recommendXunjia(
			Page<Map<String, Object>> page) {
		List<Map<String, Object>> result = getSqlSession().selectList(getNamespace().concat(".queryPageUnsolvedPrice"), page);
		if(null != result && !result.isEmpty()){
			page.setResult(result);
		}
		return page;
	}

	@Override
	public List<Map<String, Object>> showFavorites(String memberId) {
		
		return getSqlSession().selectList(getNamespace().concat(".queryPageUnsolvedPrice"), memberId);
	}

	@Override
	public List<Map<String, Object>> getUserFavoritesAskprice(
			List<String> favoriteAskIds) {
		if(favoriteAskIds==null || favoriteAskIds.size()<=0){
			return null;
		}
		Map<String, Object> param = new HashMap<String,Object>();
		param.put("ids", favoriteAskIds);
		return getSqlSession().selectList(getNamespace().concat(".getUserFavoritesAskprices"), param);
	}
	
}
