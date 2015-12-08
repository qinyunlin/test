package com.concom.soa.infrastructure.helper;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.stereotype.Repository;

import com.concom.mybatis.MybatisOperations;

@Repository
public class ProcureCodeHelper extends MybatisOperations<String, Integer> implements InitializingBean{

	private static Map<String, List<String>> relationMap = new HashMap<String, List<String>>();
	private static Map<String, String> cgCidMap = new HashMap<String, String>();
	private static Map<String, String> cgSubcidMap = new HashMap<String, String>();
	private static Map<String, String> procureCodeMap = new HashMap<String, String>();//所有分类的key pair value
	
	public ProcureCodeHelper init(){
		if(cgCidMap.size()==0 || cgSubcidMap.size()==0 || procureCodeMap.size()==0 || relationMap.size()==0){
			List<Map<String, String>> procurecodes = loadData();
			procureCodeMap=parseToMap(procurecodes);
			extractCategory(procureCodeMap);
			analyzeRelation();
		}
		return this;
	}
	/**
	 * 建立一级分类和二级分类的对应关系
	 * @return
	 */
	private void analyzeRelation() {
		for(String cgCid : cgCidMap.keySet()){
			List<String> cgSubcids = new ArrayList<String>();
			for(String cgSubcid : cgSubcidMap.keySet()){
				if(cgSubcid.startsWith(cgCid)){
					cgSubcids.add(cgSubcid);
				}
			}
			relationMap.put(cgCid, cgSubcids);
		}
	}

	private void extractCategory(
			Map<String, String> procureCodeMap) {
		for(String key : procureCodeMap.keySet()){
			if(key.length()==2){
				cgCidMap.put(key, procureCodeMap.get(key));
			}else if(key.length()==4){
				cgSubcidMap.put(key, procureCodeMap.get(key));
			}
		}
	}

	private Map<String, String> parseToMap(
			List<Map<String, String>> procurecodes) {
		for(Map<String, String> map : procurecodes){
			procureCodeMap.put(map.get("procureCode"), map.get("name"));
		}
		return procureCodeMap;
	}

	public List<Map<String, String>> loadData(){
		return this.getSqlSession().selectList("com.concom.soa.dto.procure.code.name.getCgRelation");
	}
	public Map<String, List<String>> getRelationMap() {
		return relationMap;
	}
	
	public Map<String, String> getCgCidMap() {
		return cgCidMap;
	}
	public Map<String, String> getCgSubcidMap() {
		return cgSubcidMap;
	}
	public Map<String, String> getProcureCodeMap() {
		return procureCodeMap;
	}
	
	
}
