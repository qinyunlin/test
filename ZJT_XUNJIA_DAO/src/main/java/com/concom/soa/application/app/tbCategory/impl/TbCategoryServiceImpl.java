package com.concom.soa.application.app.tbCategory.impl;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.tbCategory.TbCategory;
import com.concom.soa.application.app.tbCategory.TbCategoryService;
import com.concom.soa.infrastructure.persist.app.tbCategory.TbCategoryDao;

@Service
public class TbCategoryServiceImpl implements TbCategoryService {

	@Autowired
	private TbCategoryDao tbCategoryDao;
	
	@Override
	public List<TbCategory> queryList(Map<String, String> params) {
		// TODO Auto-generated method stub
		return tbCategoryDao.queryList(params);
	}

	@Override
	public int add(TbCategory tbCategory) {
		// TODO Auto-generated method stub
		return tbCategoryDao.add(tbCategory);
	}

}
