package com.concom.soa.application.zjt.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPriceAllot;
import com.concom.soa.application.zjt.ask.AskPriceAllotService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceAllotDao;

@Service
public class AskPriceAllotServiceImpl implements AskPriceAllotService{
	@Autowired
	public AskPriceAllotDao askPriceAllotDao;
	@Override
	public void add(AskPriceAllot askPriceAllot) {
		askPriceAllotDao.add(askPriceAllot);
	}

	@Override
	public List<AskPriceAllot> queryListByAskPriceId(String askPriceId) {
		return askPriceAllotDao.queryListByAskPriceId(askPriceId);
	}

	@Override
	public AskPriceAllot queryByAskPriceIdAndUserName(Map<String, String> params) {
		return askPriceAllotDao.queryByAskPriceIdAndUserName(params);
	}

	@Override
	public int delete(AskPriceAllot askPriceAllot) {
		return askPriceAllotDao.delete(askPriceAllot);
	}

	@Override
	public AskPriceAllot queryByAskPriceId(Map<String, String> params) {
		// TODO Auto-generated method stub
		return askPriceAllotDao.queryByAskPriceId(params);
	}
}
