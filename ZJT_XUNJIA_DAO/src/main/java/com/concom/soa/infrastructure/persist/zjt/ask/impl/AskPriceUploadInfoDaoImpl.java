/**
 * 
 */
package com.concom.soa.infrastructure.persist.zjt.ask.impl;

import org.springframework.stereotype.Repository;

import com.concom.entity.dto.xunjia.ask.UploadInfo;
import com.concom.mybatis.MybatisOperations;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceUploadInfoDao;

/**
 * @author iceray
 *
 */
@Repository
public class AskPriceUploadInfoDaoImpl extends
		MybatisOperations<String, UploadInfo> implements AskPriceUploadInfoDao {

	@Override
	public void addInfo(UploadInfo uploadInfo) {
		delete(uploadInfo);
		
		save(uploadInfo);
	}

	@Override
	public UploadInfo getUploadInfo(String memberId) {
		return get(memberId);
	}

}
