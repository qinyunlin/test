package com.concom.soa.infrastructure.helper;

import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.baidu.yun.channel.auth.ChannelKeyPair;
import com.baidu.yun.channel.client.BaiduChannelClient;
import com.baidu.yun.channel.exception.ChannelClientException;
import com.baidu.yun.channel.exception.ChannelServerException;
import com.baidu.yun.channel.model.PushBroadcastMessageRequest;
import com.baidu.yun.channel.model.PushBroadcastMessageResponse;
import com.baidu.yun.channel.model.PushTagMessageRequest;
import com.baidu.yun.channel.model.PushTagMessageResponse;
import com.baidu.yun.channel.model.PushUnicastMessageRequest;
import com.baidu.yun.channel.model.PushUnicastMessageResponse;

/**
 * android 通知格式：{"title" : "hello" , "description" : "hello world" , "custom_content": {
	"key1":"value1", 
	"key2":"value2"
	}}
	ios 通知格式 ： {"aps": {
	"alert":"Message From Baidu Push",
	"sound":"",
	"badge":0
	},
	//ios的自定义字段
	"key1":"value1", 
	"key2":"value2"
	}
	
	android 消息 request.setMessage("Hello Channel-----@");
 * @author zhengreat
 *
 */
@Component
public class MessagePushHelper implements InitializingBean{

	@Value("#{pushSettings['msg_push.apiKey']}")
	private String apiKey;
	
	@Value("#{pushSettings['msg_push.secretKey']}")
	private String secretKey;
	
	@Value("#{pushSettings['msg_push.ios_deploystatus']}")
	public int ios_deploystatus;
	
	private String userId;
	
	private Long channelId;
	
	private BaiduChannelClient channelClient;
	
	public static final int DEVICE_TYPE_IOS = 4;
	
	public static final int DEVICE_TYPE_ANDROID = 3;
	
	public static final int MESSAGE_TYPE_NOTIFICATION = 1;
	
	public static final int MESSAGE_TYPE_MESSAGE = 0;
	
	public static final int IOS_DEPLOYSTATUS_DEVELOPER = 1;
	
	public static final int IOS_DEPLOYSTATUS_PRODUCTION = 2;
	
	
	@Override
	public void afterPropertiesSet() throws Exception {
		ChannelKeyPair pair = new ChannelKeyPair(apiKey, secretKey);
		channelClient = new BaiduChannelClient(pair);
		
	}
	/**
	 * @brief 推送广播通知() message_type = 1 (默认为0)
	 */
	public void androidPushBroadcastNotification(String messages){
		try {
			
			PushBroadcastMessageRequest request = new PushBroadcastMessageRequest();
			request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
			// 4:ios 5:wp
			 request.setMessageType(1);
			 request.setMessage(messages);
			
			//  调用pushMessage接口
			PushBroadcastMessageResponse response = channelClient
					.pushBroadcastMessage(request);
			
			// 认证推送成功
			System.out.println("push amount : " + response.getSuccessAmount());
			
		} catch (ChannelClientException e) {
			// 处理客户端错误异常
			e.printStackTrace();
		} catch (ChannelServerException e) {
			// 处理服务端错误异常
			System.out.println(String.format(
					"request_id: %d, error_code: %d, error_message: %s",
					e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
		}
	}
	/**
     * @brief 推送广播消息(消息类型为透传，由开发方应用自己来解析消息内容) message_type = 0 (默认为0)
     */
	public void androidPushBroadcastMessage(String messages){
		try {

            PushBroadcastMessageRequest request = new PushBroadcastMessageRequest();
            request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setMessage(messages);

            //  调用pushMessage接口
            PushBroadcastMessageResponse response = channelClient
                    .pushBroadcastMessage(request);

            // 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}
	/**
     * @brief 推送单播消息(消息类型为透传，由开发方应用自己来解析消息内容) message_type = 0 (默认为0)
     */
	public void androidPushMessage(String messages){
		try {

            // 4. 创建请求类对象
            PushUnicastMessageRequest request = new PushUnicastMessageRequest();
            request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setChannelId(this.channelId);
            request.setUserId(this.userId);

            request.setMessage(messages);
            

            // 5. 调用pushMessage接口
            PushUnicastMessageResponse response = channelClient
                    .pushUnicastMessage(request);

            // 6. 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}

	 /**
     * @brief 推送单播通知(Android Push SDK拦截并解析) message_type = 1 (默认为0)
     */
	public void androidPushNotification(String messages){
		try {

            PushUnicastMessageRequest request = new PushUnicastMessageRequest();
            request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setChannelId(this.channelId);
            request.setUserId(this.userId);

            request.setMessageType(1);
            request.setMessage(messages);

            //  调用pushMessage接口
            PushUnicastMessageResponse response = channelClient
                    .pushUnicastMessage(request);

            // 6. 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}
	/**
     * @brief 推送组播消息(消息类型为透传，由开发方应用自己来解析消息内容) message_type = 0 (默认为0)
     */
	public void androidPushTagMessage(String tagName, String messages){
		try {

            PushTagMessageRequest request = new PushTagMessageRequest();
            request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setTagName(tagName);
            request.setMessage(messages);

         //  调用pushMessage接口
            PushTagMessageResponse response = channelClient
                    .pushTagMessage(request);

            // . 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}
	/**
	 * @brief 推送组播通知 message_type = 1 (默认为0)
	 */
	public void androidPushTagNotification(String tagName, String messages){
		try {
			
			PushTagMessageRequest request = new PushTagMessageRequest();
			request.setDeviceType(3); // device_type => 1: web 2: pc 3:android
			// 4:ios 5:wp
			request.setTagName(tagName);
			request.setMessageType(1);
			request.setMessage(messages);
			
			//  调用pushMessage接口
			PushTagMessageResponse response = channelClient
					.pushTagMessage(request);
			
			// . 认证推送成功
			System.out.println("push amount : " + response.getSuccessAmount());
			
		} catch (ChannelClientException e) {
			// 处理客户端错误异常
			e.printStackTrace();
		} catch (ChannelServerException e) {
			// 处理服务端错误异常
			System.out.println(String.format(
					"request_id: %d, error_code: %d, error_message: %s",
					e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
		}
	}
	 /**
     * @brief 推送广播消息(IOS APNS) message_type = 1 (默认为0)
     */
	public void iosPushBroadcastNotification(String messages){
		try {

            PushBroadcastMessageRequest request = new PushBroadcastMessageRequest();
            request.setDeviceType(4); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setMessageType(1);
            request.setDeployStatus(ios_deploystatus); // DeployStatus => 1: Developer 2:
                                        // Production
            request.setMessage(messages);

            //  调用pushMessage接口
            PushBroadcastMessageResponse response = channelClient
                    .pushBroadcastMessage(request);

            // 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}
	/**
     * @brief 推送单播通知(IOS APNS) message_type = 1 (默认为0)
     */
	public void iosPushNotification(String messages){
		try {

            PushUnicastMessageRequest request = new PushUnicastMessageRequest();
            request.setDeviceType(4); // device_type => 1: web 2: pc 3:android
                                      // 4:ios 5:wp
            request.setDeployStatus(ios_deploystatus); // DeployStatus => 1: Developer 2:
                                        // Production
            request.setChannelId(this.channelId);
            request.setUserId(this.userId);

            request.setMessageType(1);
            request.setMessage(messages);

            // 调用pushMessage接口
            PushUnicastMessageResponse response = channelClient
                    .pushUnicastMessage(request);

            // 认证推送成功
            System.out.println("push amount : " + response.getSuccessAmount());

        } catch (ChannelClientException e) {
            // 处理客户端错误异常
            e.printStackTrace();
        } catch (ChannelServerException e) {
            // 处理服务端错误异常
            System.out.println(String.format(
                    "request_id: %d, error_code: %d, error_message: %s",
                    e.getRequestId(), e.getErrorCode(), e.getErrorMsg()));
        }
	}
	public Long getChannelId() {
		return channelId;
	}


	public void setChannelId(Long channelId) {
		this.channelId = channelId;
	}


	public String getUserId() {
		return userId;
	}


	public void setUserId(String userId) {
		this.userId = userId;
	}


	
}
