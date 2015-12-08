package com.concom.soa.application.app.ask.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;
import com.concom.soa.application.app.ask.AppAskPriceService;
import com.concom.soa.infrastructure.helper.ProcureCodeHelper;
import com.concom.soa.infrastructure.persist.app.ask.AppAskpriceRepository;
/**
 * 
 * @author zhengreat
 * @date 2014-2-19 
 */
@Service
public class AppAskpriceServiceImpl implements AppAskPriceService {

	
	@Autowired
	private AppAskpriceRepository askpriceRepository;
	
	@Autowired
	private ProcureCodeHelper procureCodeHelper;
	
	
	
	public Page<Map<String, Object>> searchAskpriceOfUnsolved(Page<Map<String, Object>> page) {
		return askpriceRepository.searchUnsolvedPrice(page);
	}

	public Map<String, Object> askprice(String id) {
		return askpriceRepository.getAskpriceById(id);
	}

	public List<AskPrice> askpricesOfRepliedByUser(String uid) {
		return null;
	}

	public Map<String, String> getProcureCategories() {
		Map<String, String> codes = procureCodeHelper.init().getProcureCodeMap();
		return codes;
	}


	@Override
	public Page<Map<String, Object>> recommendXunjia(
			Page<Map<String, Object>> page) {
		return askpriceRepository.recommendXunjia(page);
	}

	@Override
	public List<Map<String, Object>> showFavorites(String memberId) {
		return askpriceRepository.showFavorites(memberId);
	}

	@Override
	public List<Map<String, Object>> showFavorites(List<String> favoriteAskIds) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public List<Map<String, Object>> getUserFavoritesAskprice(
			List<String> favoriteAskIds) {
		
		return askpriceRepository.getUserFavoritesAskprice(favoriteAskIds);
	}

	

}
