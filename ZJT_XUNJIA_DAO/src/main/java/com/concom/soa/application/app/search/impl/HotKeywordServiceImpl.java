package com.concom.soa.application.app.search.impl;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.search.HotKeyword;
import com.concom.soa.application.app.search.HotKeywordService;
import com.concom.soa.infrastructure.persist.app.search.HotKeywordRepository;

@Service
public class HotKeywordServiceImpl implements HotKeywordService {
	@Autowired
	private HotKeywordRepository hotKeywordRepository;

	@Override
	public List<String> fetchTopN(int n) {
		List<HotKeyword> keys = hotKeywordRepository.fetchTopN(n);
		return getKeys(keys);
	}

	private List<String> getKeys(List<HotKeyword> keys) {
		List<String> keywords = new ArrayList<String>();
		for(HotKeyword key : keys){
			keywords.add(key.getKeyword());
		}
		return keywords;
	}

	@Override
	public void recordKeyword(String keyword) {
		HotKeyword hotKeyword = new HotKeyword();
		hotKeyword.setKeyword(keyword);
		hotKeyword.setUpdateOn(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));
		hotKeywordRepository.save(hotKeyword);
		
	}

}
