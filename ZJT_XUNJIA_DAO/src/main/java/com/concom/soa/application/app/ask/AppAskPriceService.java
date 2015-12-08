package com.concom.soa.application.app.ask;

import java.util.List;
import java.util.Map;

import com.concom.entity.dto.xunjia.ask.AskPrice;
import com.concom.lang.Page;

/**
 * 
 * @author zhengreat
 * @date 2014-2-19 
 */
public interface AppAskPriceService {
	/**
	 * 待解决询价列表
	 * @return
	 */
	Page<Map<String, Object>> searchAskpriceOfUnsolved(Page<Map<String, Object>> page);
	
	/**
	 * 取得某条询价
	 * @param id
	 * @return
	 */
	Map<String, Object> askprice(String id);
	
	
	
	/**
	 * 我回复过的询价列表
	 * @param uid
	 * @return
	 */
	List<AskPrice> askpricesOfRepliedByUser(String uid);
	
	/**
	 * 所有采购分类
	 * @return
	 */
	Map<String, String> getProcureCategories();
	
	
	
	Page<Map<String, Object>> recommendXunjia(Page<Map<String, Object>> page);
	
	List<Map<String, Object>> showFavorites(String memberId);
	
	List<Map<String, Object>> showFavorites(List<String> favoriteAskIds);
	
	List<Map<String, Object>> getUserFavoritesAskprice(
			List<String> favoriteAskIds);
}
