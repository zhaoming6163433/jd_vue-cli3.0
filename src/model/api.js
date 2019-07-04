import appConfigs from '@/configs'
import vueRequest from './vueRequest'

/**
 * 测试
 */
export const post_test_info = (params) => vueRequest(appConfigs.urlWebHttp + "/cfm/datasource/post_get_user_info", params, 'POST');
