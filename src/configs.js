/**
 * 配置编译环境和线上环境之间的切换
 *
 * urlWebHttp: 域名地址
 * toastime: toast时间
 *
 */
const toastime = 3000;
const timeout = 60000;
let urlWebHttp = '';
let loginurl = '';
let pagename = {
    logoname:"标题名称"
}

console.log(process.env.VUE_APP_TITLE)

//判断平台
if(navigator.userAgent.match(/MicroMessenger/igm)){
	plant = 'weixin';
}


export default{
	urlWebHttp,
	toastime,
    timeout,
    loginurl,
    pagename
}
