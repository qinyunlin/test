package com.concom.soa.infrastructure.persist.app.favorites.impl;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.app.favorite.Favorite;
import com.concom.lang.Page;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.app.favorites.FavoritesRepository;

@Repository
public class FavoritesRepositoryImpl extends MybatisOperations<Integer, Favorite> implements FavoritesRepository {

	@Override
	public int addFavoriteOfXunjia(String askId, String memberId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("askId", askId);
		params.put("memberId", memberId);
		return getSqlSession().insert("com.concom.soa.dto.app.favorite.Favorite".concat(".add"), params);
	}

	@Override
	public int delete(String askId, String memberId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("askId", askId);
		params.put("memberId", memberId);
		return getSqlSession().insert("com.concom.soa.dto.app.favorite.Favorite".concat(".delete"), params);
	}

	@Override
	public List<String> getFavoritesOfXunjia(Page<String> page) {
		return getSqlSession().selectList("com.concom.soa.dto.app.favorite.Favorite".concat(".queryPageFavoritesOfXunjia"), page);
	}

	@Override
	public int isFavorited(String askId, String memberId) {
		Map<String, Object> params = new HashMap<String, Object>();
		params.put("askId", askId);
		params.put("memberId", memberId);
		return (Integer)getSqlSession().selectOne("com.concom.soa.dto.app.favorite.Favorite".concat(".isFavorited"), params);
	}

}
