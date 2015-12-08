package com.concom.soa.application.zjt.ask.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPricePici;
import com.concom.entity.dto.xunjia.ask.DateValue;
import com.concom.entity.dto.xunjia.ask.PiCiServiceLog;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.AskPricePiciService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPricePiciDao;

@Service
public class AskPricePiciServiceImpl implements AskPricePiciService{
	
	@Autowired
	private AskPricePiciDao askPricePiciDao;

	public void add(AskPricePici askPricePici) {
		askPricePiciDao.add(askPricePici);
	}

	public Page<AskPricePici> queryPage(Page<AskPricePici> page) {
		return askPricePiciDao.queryPage(page);
	}

	@Override
	public int update(AskPricePici askPricePici) {
		// TODO Auto-generated method stub
		return askPricePiciDao.update(askPricePici);
	}

	@Override
	public AskPricePici get(String piciId) {
		// TODO Auto-generated method stub
		return askPricePiciDao.get(piciId);
	}

	@Override
	public int addPiciLog(PiCiServiceLog piCiServiceLog) {
		// TODO Auto-generated method stub
		return askPricePiciDao.addPiciLog(piCiServiceLog);
	}

	@Override
	public List<DateValue> getDateTreeOfPici(String eid) {
		return askPricePiciDao.getDateTreeOfPici(eid);
	}

	@Override
	public int queryCount(Page<AskPricePici> page) {
		return askPricePiciDao.queryCount(page);
	}

	@Override
	public List<PiCiServiceLog> getPiciServiceLog(String piciId) {
		return askPricePiciDao.getPiciServiceLog(piciId);
	}

	@Override
	public void delete(String piciId) {
		askPricePiciDao.delete(piciId);
	}
	public Page<AskPricePici> queryXunjiaInfoStatistic(Page<AskPricePici> page){
		return askPricePiciDao.queryXunjiaInfoStatistic(page);
	}
	public int queryXunjiaInfoStatisticCount(Page<AskPricePici> page){
		return askPricePiciDao.queryXunjiaInfoStatisticCount(page);
	}

	@Override
	public void deleteByPiciId(String piciId) {
		askPricePiciDao.deleteByPiciId(piciId);
	}
}
