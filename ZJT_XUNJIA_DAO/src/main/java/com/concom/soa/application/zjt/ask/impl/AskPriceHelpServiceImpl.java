package com.concom.soa.application.zjt.ask.impl;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPriceHelp;
import com.concom.lang.Page;
import com.concom.soa.application.zjt.ask.AskPriceHelpService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceHelpDao;

@Service
public class AskPriceHelpServiceImpl implements AskPriceHelpService {

	@Autowired
	private AskPriceHelpDao askPriceHelpDao;
	
	@Override
	public Page<AskPriceHelp> queryPage(Page<AskPriceHelp> page) {
		
		return askPriceHelpDao.queryPage(page);
	}

	@Override
	public int queryAskPriceHelpCount(Page<AskPriceHelp> page) {
		return askPriceHelpDao.queryAskPriceHelpCount(page); 
	}

	@Override
	public void delete(Map<String, String> map) {
		askPriceHelpDao.delete(map);
		
	}

	@Override
	public void add(AskPriceHelp askPriceHelp) {
		askPriceHelpDao.add(askPriceHelp);
	}

}
