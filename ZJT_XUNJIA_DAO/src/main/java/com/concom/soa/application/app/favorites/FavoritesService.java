package com.concom.soa.application.app.favorites;

import java.util.List;

public interface FavoritesService {

	int addFavoriteOfXunjia(String askId, String memberId);
	
	int deleteFavoriteOfXunjia(String askId, String memberId);


	List<String> getFavoritesOfXunjia(int currentPage, int pageSize,
			String memberId);
	
	boolean isFavorited(String askId, String memberId);

}
