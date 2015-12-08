package com.concom.soa.infrastructure.persist.app.ask;

import java.util.List;
import java.util.Map;

import com.concom.lang.Page;

public interface AppAskpriceRepository {

	Map<String, Object> getAskpriceById(String id);

	Page<Map<String, Object>> searchUnsolvedPrice(Page<Map<String, Object>> page);


	Page<Map<String, Object>> recommendXunjia(Page<Map<String, Object>> page);

	List<Map<String, Object>> showFavorites(String memberId);

	List<Map<String, Object>> getUserFavoritesAskprice(
			List<String> favoriteAskIds);

}
