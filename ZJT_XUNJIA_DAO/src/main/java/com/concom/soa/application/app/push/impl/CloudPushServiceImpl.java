package com.concom.soa.application.app.push.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.concom.entity.dto.xunjia.app.push.CloudPush;
import com.concom.soa.application.app.push.CloudPushService;
import com.concom.soa.infrastructure.persist.app.push.CloudPushRepository;

@Service
public class CloudPushServiceImpl implements CloudPushService {

	@Autowired
	private CloudPushRepository cloudPushRepository;
	
	@Override
	public CloudPush getBoundMsgByMemberId(String memberId) {
		return cloudPushRepository.getByMemberId(memberId);
	}

	@Override
	public void unBoundByMemberId(String memberId) {
		cloudPushRepository.deleteByMemberId(memberId);
	}

	@Override
	public void boundUpdate(CloudPush cloudPush) {
		cloudPushRepository.update(cloudPush);

	}

	@Override
	public void bound(CloudPush cloudPush) {
		CloudPush originCloudPush = cloudPushRepository.getByMemberId(cloudPush.getMemberId());
		if(originCloudPush==null){
			cloudPushRepository.save(cloudPush);
		}else{
			originCloudPush.setMobile(cloudPush.getMobile());
			originCloudPush.setUserId(cloudPush.getUserId());
			originCloudPush.setChannelId(cloudPush.getChannelId());
			originCloudPush.setDevice_type(cloudPush.getDevice_type());
			cloudPushRepository.update(originCloudPush);
		}

	}

}
