package com.concom.soa.application.wcw.ask.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;
import com.concom.soa.application.wcw.ask.AskPriceService;
import com.concom.soa.infrastructure.persist.wcw.ask.WCWAskPriceRepository;

@Service("WCWAskPriceService")
public class WCWAskPriceServiceImpl implements AskPriceService {

	
	@Autowired
	private WCWAskPriceRepository askPriceRepository;
	
	
	public AskPrice getAskPriceById(String askId) {
		
		return askPriceRepository.getById(askId);
	}

	
	

	
	public Page<AskPrice> queryPageForWcwSJB(int currentPage, int pageSize,
			List<String> keywords, String fiterKey, String cgSubcid,String cgCid,
			String memberId, boolean isReply) {
		Page<AskPrice> page = new Page<AskPrice>();
		page.setCurrentPage(currentPage).setPageSize(pageSize)
		.addParam("cgSubcid", cgSubcid)
		.addParam("cgCid", cgCid)
		.addParam("keywords", keywords)
		.addParam("fiterKey", fiterKey)
		.addParam("memberId", memberId)
		.addParam("isReply", isReply);
		return queryPageForWcwSJB(page.notCalculateTotalNumber());
	}
	
	public Page<AskPrice> queryPageForWcwSJB(Page<AskPrice> page) {
		page = askPriceRepository.queryPageForWcwSJB(page);
		List<String> cgSubcids = askPriceRepository.getCidsForWcwSJB(page);
		page.addParam("cgSubcids", cgSubcids);
		return page;
	}

	public List<AskPrice> getAskPriceByIds(List<String> ids) {
		return askPriceRepository.getAskPriceByIds(ids);
	}

	@Override
	public int queryForWcwSJBCount(List<String> keywords, String fiterKey, String cgSubcid,String cgCid, String memberId, boolean isReply) {
		Page<AskPrice> page = new Page<AskPrice>();
		page.addParam("cgSubcid", cgSubcid)
		.addParam("cgCid", cgCid)
		.addParam("keywords", keywords)
		.addParam("fiterKey", fiterKey)
		.addParam("memberId", memberId)
		.addParam("isReply", isReply);
		return queryForWcwSJBCount(page);
	}

	public int queryForWcwSJBCount(Page<AskPrice> page){
		return askPriceRepository.queryForWcwSJBCount(page);
	}




}
