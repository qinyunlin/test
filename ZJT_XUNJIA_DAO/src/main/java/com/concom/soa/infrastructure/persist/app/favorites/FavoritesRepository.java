package com.concom.soa.infrastructure.persist.app.favorites;

import java.util.List;

import com.concom.lang.Page;

public interface FavoritesRepository {

	int addFavoriteOfXunjia(String askId, String memberId);

	int delete(String askId, String memberId);

	List<String> getFavoritesOfXunjia(Page<String> page);

	int isFavorited(String askId,String memberId);

}
