import Vue from 'vue';
import appConfigs from '@/configs'
import util from '@/util/util.js'

export default async (apiurl = '', params = {}, type = 'GET', method = '', outapi = false) => {
    type = type.toUpperCase();

    function handleres(res,resolve,reject) {
        if (res.data&&res.data.code == 0) {
            resolve(res.data.result);
        } else if(res.data&&res.data.code == "2")
        {
            window.location.href = res.data.result+"?ReturnUrl="+window.location.href;
        }else{
            //util.errortip(res.data.message);
            reject(res)
        }
    }
    if (method == 'ajax') {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: apiurl,
                data: params,
                type: "POST",
                contentType: false,
                processData: false,
                success: function (res) {
                    if (res.code == 0) {
                        resolve(res)
                    } else
                    if (res.code == "2") { //未登录直接跳转
                        reject(res);
                        //window.location.href = res.result+"?ReturnUrl="+appConfigs.urlWebHttp+"/mdsexternal";
                    } else {
                        //util.errortip(res.message);
                        reject(res)
                    }
                },
                error: function (res) {
                    console.log(res)
                    reject(res);
                },
                timeout: appConfigs.timeout
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            if (type == "GET") {
                if(outapi){
                    Vue.prototype.$axios.get(apiurl+params).then((res)=>{
                        resolve(res.data);
                    }).catch((err)=>{
                        //util.errortip('网络请求失败');
                        reject(err);
                    })
                }else{
                    Vue.prototype.$axios.get(apiurl+params).then((res)=>{
                        handleres(res,resolve,reject);
                    }).catch((err)=>{
                        //util.errortip('网络请求失败');
                        reject(err);
                    })
                }
            }
            if (type == "POST") {
                Vue.prototype.$axios.post(apiurl, params)
                    .then(function (res) {
                        handleres(res,resolve,reject);
                    })
                    .catch(function (err) {
                        //util.errortip('网络请求失败');
                        reject(err);
                    });
            }
        });
    }
}
