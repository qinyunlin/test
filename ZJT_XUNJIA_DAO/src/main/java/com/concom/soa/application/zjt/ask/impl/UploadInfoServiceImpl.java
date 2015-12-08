/**
 * 
 */
package com.concom.soa.application.zjt.ask.impl;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.ask.UploadInfo;
import com.concom.soa.application.zjt.ask.UploadInfoService;
import com.concom.soa.infrastructure.persist.zjt.ask.AskPriceUploadInfoDao;

/**
 * @author iceray
 *
 */
@Service
public class UploadInfoServiceImpl implements UploadInfoService {

	@Autowired
	private AskPriceUploadInfoDao askPriceUploadInfoDao; 
	
	@Override
	public void addUploadInfo(UploadInfo uploadInfo) {
		if(StringUtils.isEmpty(uploadInfo.getMemberId()))
			return;
		askPriceUploadInfoDao.addInfo(uploadInfo);
	}

	@Override
	public UploadInfo getUploadInfo(String memberId) {
		if(StringUtils.isEmpty(memberId))
			return new UploadInfo();
		return askPriceUploadInfoDao.getUploadInfo(memberId);
		
	}

}
