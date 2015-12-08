package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.AskPricePici;
import com.concom.entity.dto.xunjia.ask.DateValue;
import com.concom.entity.dto.xunjia.ask.PiCiServiceLog;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPricePiciDao;

@Repository
public class AskPricePiciDaoImpl extends MybatisOperations<String, AskPricePici> implements AskPricePiciDao{
	public void add(AskPricePici askPricePici) {
		getSqlSession().insert(getNamespace().concat(".insert"), askPricePici);
	}

	@Override
	public int addPiciLog(PiCiServiceLog piCiServiceLog) {
		// TODO Auto-generated method stub
		return (Integer)getSqlSession().insert(getNamespace().concat(".addPiciLog"), piCiServiceLog);
	}

	@Override
	public List<DateValue> getDateTreeOfPici(String eid) {
		return getSqlSession().selectList(getNamespace().concat(".getDateTreeOfPici"), eid);
	}

	@Override
	public int queryCount(Page<AskPricePici> page) {
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryCount"), page);
	}

	@Override
	public List<PiCiServiceLog> getPiciServiceLog(String piciId) {
		return getSqlSession().selectList(getNamespace().concat(".getPiciServiceLog"), piciId);
	}

	@Override
	public void delete(String piciId) {
		getSqlSession().delete(getNamespace().concat(".delete"),piciId);
	}
	
	@Override
	public void deleteByPiciId(String piciId) {
		getSqlSession().delete(getNamespace().concat(".deleteByPiciId"),piciId);
	}
	/**
	 * 询价明细统计
	 * @param page
	 * @return
	 */
	public Page<AskPricePici> queryXunjiaInfoStatistic(Page<AskPricePici> page){
		List<AskPricePici> results = getSqlSession().selectList(getNamespace().concat(".queryPageXunjiaInfoStatistic"), page);
		page.setResult(results);
		return page;
	}
	public int queryXunjiaInfoStatisticCount(Page<AskPricePici> page){
		return (Integer)getSqlSession().selectOne(getNamespace().concat(".queryXunjiaInfoStatisticCount"), page);
	}

	
}
