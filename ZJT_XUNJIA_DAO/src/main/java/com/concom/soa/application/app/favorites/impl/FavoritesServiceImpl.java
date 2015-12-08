package com.concom.soa.application.app.favorites.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.lang.Page;
import com.concom.soa.application.app.favorites.FavoritesService;
import com.concom.soa.infrastructure.persist.app.favorites.FavoritesRepository;

@Service
public class FavoritesServiceImpl implements FavoritesService {

	@Autowired
	FavoritesRepository favoritesRepository;
	
	@Override
	public int addFavoriteOfXunjia(String askId, String memberId) {
		return favoritesRepository.addFavoriteOfXunjia(askId,memberId);
	}

	@Override
	public int deleteFavoriteOfXunjia(String askId, String memberId) {
		return favoritesRepository.delete(askId, memberId);
	}

	@Override
	public List<String> getFavoritesOfXunjia(int currentPage, int pageSize,
			String memberId) {
		Page<String> page = new Page<String>();
		page.setCurrentPage(currentPage).setPageSize(pageSize).addParam("memberId", memberId);
		return favoritesRepository.getFavoritesOfXunjia(page);
	}

	@Override
	public boolean isFavorited(String askId, String memberId) {
		int count = favoritesRepository.isFavorited(askId,memberId);
		return count>0?true:false;
	}

}
