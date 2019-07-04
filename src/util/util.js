import Vue from 'vue';
import appConfigs from '../configs'
import export_json_to_excel from '../assets/js/Export2Excel'

let getevent = () => {
    var Event = new Vue();
    return Event;
}
/**
 * 检查银行卡号是否符合规则
 * @param bankno 银行卡号
 * @returns
 */

let cardobj = function() {};
cardobj.prototype.checkBankNo = (bankno) => {
    var bankno = bankno.replace(/\s/g, '');
    if (bankno == "") {
        utils.toastinfo("请填写银行卡号");
        return false;
    }
    if (bankno.length < 16 || bankno.length > 19) {
        utils.toastinfo("银行卡号长度必须在16到19之间");
        return false;
    }
    var num = /^\d*$/; // 全数字
    if (!num.exec(bankno)) {
        utils.toastinfo("银行卡号必须全为数字");
        return false;
    }
    // 开头两位
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
        utils.toastinfo("银行卡号开头两位不符合规范");
        return false;
    }
    // luhn校验
    if (!_luhnCheck(bankno)) {
        return false;
    }
    return true;
}

/**
 * 银行卡号luhn校验算法
 * luhn校验规则：16位银行卡号（19位通用）:
 * 1.将未带校验位的 15（或18）位卡号从右依次编号 1 到 15（18），位于奇数位号上的数字乘以 2。
 * 2.将奇位乘积的个十位全部相加，再加上所有偶数位上的数字。
 * 3.将加法和加上校验位能被 10 整除。
 * @param bankno 银行卡号
 * @returns
 */
let _luhnCheck = function(bankno) {
    var lastNum = bankno.substr(bankno.length - 1, 1); // 取出最后一位（与luhn进行比较）
    var first15Num = bankno.substr(0, bankno.length - 1); // 前15或18位
    var newArr = new Array();
    for (var i = first15Num.length - 1; i > -1; i--) { // 前15或18位倒序存进数组
        newArr.push(first15Num.substr(i, 1));
    }
    var arrJiShu = new Array(); // 奇数位*2的积 <9
    var arrJiShu2 = new Array(); // 奇数位*2的积 >9
    var arrOuShu = new Array(); // 偶数位数组
    for (var j = 0; j < newArr.length; j++) {
        if ((j + 1) % 2 == 1) { // 奇数位
            if (parseInt(newArr[j]) * 2 < 9) {
                arrJiShu.push(parseInt(newArr[j]) * 2);
            } else {
                arrJiShu2.push(parseInt(newArr[j]) * 2);
            }
        } else {
            arrOuShu.push(newArr[j]); // 偶数位
        }
    }

    var jishu_child1 = new Array(); // 奇数位*2 >9 的分割之后的数组个位数
    var jishu_child2 = new Array(); // 奇数位*2 >9 的分割之后的数组十位数
    for (var h = 0; h < arrJiShu2.length; h++) {
        jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
        jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
    }
    var sumJiShu = 0; // 奇数位*2 < 9 的数组之和
    var sumOuShu = 0; // 偶数位数组之和
    var sumJiShuChild1 = 0; // 奇数位*2 >9 的分割之后的数组个位数之和
    var sumJiShuChild2 = 0; // 奇数位*2 >9 的分割之后的数组十位数之和
    var sumTotal = 0;
    for (var m = 0; m < arrJiShu.length; m++) {
        sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
    }
    for (var n = 0; n < arrOuShu.length; n++) {
        sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
    }
    for (var p = 0; p < jishu_child1.length; p++) {
        sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
        sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
    }
    // 计算总和
    sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) +
        parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
    // 计算luhn值
    var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
    var luhn = 10 - k;
    if (lastNum == luhn) {
        console.log("验证通过");
        return true;
    } else {
        Vue.$toast({
            message: "银行卡号不正确",
            position: 'middle',
            duration: appConfigs.toastime
        });
        return false;
    }
}
const vueEvent = getevent();

const utils = {
    vuethis: {}, //vue的this
    vueEvent: vueEvent,
    //打电话
    realcall(e) {
        window.location.href = "tel:" + e.name;
    },
    //处理空
    handlenull(item) {
        $.each(item, function (key, val) {
            if (val == null) {
                item[key] = '';
            }
        });
    },
    getGeolocation(callback) {
        let lnglat = this.handleCookieGet('lnglat');
        if (lnglat) {
            callback(lnglat, true);
        } else {
            var _this = this;
            var currentposition = {};
            //获取当前位置
            var geolocation = new BMap.Geolocation();
            geolocation.getCurrentPosition(function (r) {
                if (this.getStatus() == BMAP_STATUS_SUCCESS) {
                    currentposition.lng = r.point.lng;
                    currentposition.lat = r.point.lat;
                    callback(currentposition, r.accuracy);
                } else {
                    callback(false);
                }
            }, {
                enableHighAccuracy: true
            });
        }
    },
    getUrlParam(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return r[2];
        return null; //返回参数值
    },
    //获取七天日期
    getSevenDate(date, lasttime) {
        var lastarr = lasttime.split(':');
        var lasth = parseInt(lastarr[0]);
        var lastm = parseInt(lastarr[1]);
        var thirtyagoh = '';
        var thirtyagom = '';
        var _arr = [];
        //提前半小时就从明天开始
        if (lastm >= 30) {
            thirtyagoh = lasth;
            thirtyagom = lastm - 30;
        } else {
            thirtyagoh = lasth - 1;
            thirtyagom = lastm + 30;
        }
        if (parseInt(date.Format('hh')) > thirtyagoh) {
            date.setDate(date.getDate() + 1);
        }
        if (parseInt(date.Format('hh')) == thirtyagoh) {
            if (parseInt(date.Format('mm')) > thirtyagom) {
                date.setDate(date.getDate() + 1);
            }
        }

        for (var i = 0; i < 7; i++) {
            var date2 = new Date(date);
            date2.setDate(date.getDate() + i);
            var time2 = (date2.getMonth() + 1) + "月" + date2.getDate() + "日";
            _arr.push(time2);
        }
        return _arr;
    },
    //缓存到cookie
    handleCookieGet(c_name) {
        if (document.cookie.length > 0) {
            var c_start = document.cookie.indexOf(c_name + "=");
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1;
                var c_end = document.cookie.indexOf(";", c_start);
                if (c_end == -1) c_end = document.cookie.length;
                var result = unescape(document.cookie.substring(c_start, c_end));
                if (result) {
                    return JSON.parse(result);
                } else {
                    return {};
                }
            }
        }
        return "";
    },
    handleCookieSet(c_name, value, expiredays) {
        var value = JSON.stringify(value);
        var exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + "; path=/";
    },
    //缓存到本地
    setlocal(name, obj) {
        localStorage.setItem(name, JSON.stringify(obj));
    },
    //获取本地
    getlocal(name) {
        let data = localStorage.getItem(name);
        if (data != null && data != '') {
            try {
                let obj = eval('(' + data + ')');
                return obj;
            } catch (e) {
                return '';
            }
        } else {
            return '';
        }
    },
    //禁止默认滚动条滚动，用于弹出窗
    forbidscroll() {
        document.body.style.overflow = 'hidden';
        document.getElementById("physical").style.overflow = "hidden";
    },
    allscroll() {
        document.body.style.overflow = '';
        document.getElementById("physical").style.overflow = "";
    },
    //提示中间toast
    toastinfo(msg) {
        Vue.$toast({
            message: msg,
            position: 'middle',
            duration: appConfigs.toastime
        });
    },
    loadingopen(){
        Vue.$indicator.open();
    },
    loadingclose(){
        Vue.$indicator.close();
    },
    //校验银行卡
    bankcardreg() {
        let _cardobj = new cardobj();
        return _cardobj;
    },
    //zepto扩展
    scrollTo() {
        $.fn.scrollTo = function (options) {
            var defaults = {
                toT: 0, //滚动目标位置
                durTime: 500, //过渡动画时间
                delay: 30, //定时器时间
                callback: null //回调函数
            };
            var opts = $.extend(defaults, options),
                timer = null,
                _this = this,
                curTop = _this.scrollTop(), //滚动条当前的位置
                subTop = opts.toT - curTop, //滚动条目标位置和当前位置的差值
                index = 0,
                dur = Math.round(opts.durTime / opts.delay),
                smoothScroll = function (t) {
                    index++;
                    var per = Math.round(subTop / dur);
                    if (index >= dur) {
                        _this.scrollTop(t);
                        window.clearInterval(timer);
                        if (opts.callback && typeof opts.callback == 'function') {
                            opts.callback();
                        }
                        return;
                    } else {
                        _this.scrollTop(curTop + index * per);
                    }
                };
            timer = window.setInterval(function () {
                smoothScroll(opts.toT);
            }, opts.delay);
            return _this;
        };
    },
    //弹出提示框
    alertip(val) {
        vueEvent.$alert(val, '提示', {
            confirmButtonText: '确定',
            callback: action => {

            }
        });
    },
    //带取消的两个按钮
    confirmtip(title, info, btntext1, btntext2, suc, cancel) {
        vueEvent.$confirm(info, title || '提示', {
            confirmButtonText: btntext1 || '确定',
            cancelButtonText: btntext2 || '取消',
            type: 'warning'
        }).then(() => {
            suc && suc();
        }).catch(() => {
            cancel && cancel();
        });
    },
    //html片段
    alerthtmltip(title, htmlstr, btntext1, btntext2, suc, cancel, style,params) {
        if (style == "red") {
            setTimeout(() => {
                $(".el-message-box__wrapper").addClass("wrapper_redstyle");
            }, 10);
        } else {
            $(".el-message-box__wrapper").removeClass("wrapper_redstyle");
        }
        vueEvent.$confirm(htmlstr, title || '提示', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: btntext1 || '确定',
            cancelButtonText: btntext2 || '取消'
        }).then(() => {
            suc && suc(params);
        }).catch(() => {
            cancel && cancel(params);
        });
    },
    //登录错误提示
    errortip(info) {
        vueEvent.$message.error(info);
    },
    //成功提示
    successtip(info) {
        vueEvent.$message({
            message: info,
            type: 'success'
        });
    },
    //警告提示
    warningtip(info) {
        vueEvent.$message({
            message: info,
            type: 'warning'
        });
    },
    //身份证截取出生日期
    getBirthdayFromIdCard(idCard) {
        idCard = idCard.toString();
        var birthday = "";
        if (idCard != null && idCard != "") {
            if (idCard.length == 15) {
                birthday = "19" + idCard.substr(6, 6);
            } else if (idCard.length == 18) {
                birthday = idCard.substr(6, 8);
            }

            birthday = birthday.replace(/(.{4})(.{2})/, "$1-$2-");
        }

        return birthday;
    },
    //base64转换成二进制
    convertImgDataToBlob(base64Data) {
        var format = "image/jpeg";
        var base64 = base64Data;
        var code = window.atob(base64.split(",")[1]);
        var aBuffer = new window.ArrayBuffer(code.length);
        var uBuffer = new window.Uint8Array(aBuffer);
        for (var i = 0; i < code.length; i++) {
            uBuffer[i] = code.charCodeAt(i) & 0xff;
        }
        // console.info([aBuffer]);
        // console.info(uBuffer);
        // console.info(uBuffer.buffer);
        // console.info(uBuffer.buffer == aBuffer); //true

        var blob = null;
        try {
            blob = new Blob([uBuffer], {
                type: format
            });
        } catch (e) {
            window.BlobBuilder =
                window.BlobBuilder ||
                window.WebKitBlobBuilder ||
                window.MozBlobBuilder ||
                window.MSBlobBuilder;
            if (e.name == "TypeError" && window.BlobBuilder) {
                var bb = new window.BlobBuilder();
                bb.append(uBuffer.buffer);
                blob = bb.getBlob("image/jpeg");
            } else if (e.name == "InvalidStateError") {
                blob = new Blob([aBuffer], {
                    type: format
                });
            } else {}
        }
        return blob;
    },
    //压缩图片
    compress(file, callback) {
        //图片方向角 added by lzk
        var Orientation = null;

        //var inputID="file";
        var file = file;
        var reader = new FileReader();

        //获取照片方向角属性，用户旋转控制
        EXIF.getData(file, function() {
            // alert(EXIF.pretty(this));
            EXIF.getAllTags(this);
            //alert(EXIF.getTag(this, 'Orientation'));
            Orientation = EXIF.getTag(this, 'Orientation');
            //return;
        });

        reader.onload = function (e) {
            var image =document.createElement("img");
            image.onload = function () {
                var canvas = document.createElement("canvas");
                var x = this.width;
                var y = this.height;
                this.width = 375 * 2;
                this.height = this.width / x * y;
                var width = this.width;
                var height = this.height;

                canvas.width = this.width;
                canvas.height = this.height;

                var context = canvas.getContext("2d");
                context.clearRect(0, 0, width, height);

                // context.drawImage(this, 0, 0, this.width, this.height);

                switch (Orientation) {
                    case 3:
                        context.rotate(180 * Math.PI / 180);
                        context.drawImage(this, -this.width, -this.height, this.width, this.height);
                        break;
                    case 6:
                        context.rotate(90 * Math.PI / 180);
                        context.drawImage(this, 0, -this.width, this.height, this.width);
                        break;
                    case 8:
                        context.rotate(270 * Math.PI / 180);
                        context.drawImage(this, -this.height, 0, this.height, this.width);
                        break;
                    case 2:
                        context.translate(this.width, 0);
                        context.scale(-1, 1);
                        context.drawImage(this, 0, 0, this.width, this.height);
                        break;
                    case 4:
                        context.translate(this.width, 0);
                        context.scale(-1, 1);
                        context.rotate(180 * Math.PI / 180);
                        context.drawImage(this, -this.width, -this.height, this.width, this.height);
                        break;
                    case 5:
                        context.translate(this.width, 0);
                        context.scale(-1, 1);
                        context.rotate(90 * Math.PI / 180);
                        context.drawImage(this, 0, -this.width, this.height, this.width);
                        break;
                    case 7:
                        context.translate(this.width, 0);
                        context.scale(-1, 1);
                        context.rotate(270 * Math.PI / 180);
                        context.drawImage(this, -this.height, 0, this.height, this.width);
                        break;
                    default:
                        context.drawImage(this, 0, 0, this.width,this.height);
                }


                var quality = 0.9; //可以理解为压缩程度
                //quality :图片质量。0 到 1 之间的数字，并且只在格式为 image/jpeg 或 image/webp 时才有效，如果参数值格式不合法，将会被忽略并使用默认值
                var data;
                var result;
                var length;
                //处理图片过大问题
                //控制图片上传的大小，注意若图片过大 ajax上传的时候会出现参数为null的错误
                //这里如果图片过大会将图片压缩程度放大
                do {
                    data = canvas.toDataURL("image/jpeg", quality); //压缩图片
                    length = data.length;
                    result = (length / 4 * 3 + 1023) / 1024; //计算压缩后图片的大小（单位：KB）
                    quality -= 0.05;
                } while (result > 450);
                //data：base64
                callback(data, file); //回调函数
            };
            image.src = e.target.result;
        };
        reader.readAsDataURL(file);
    },
    //下载excel表格 tHeader头部中文名 filterVal头部英文名 datalist json数据
    exportToExcel(tablename="列表excel", tHeader=[], filterVal=[], datalist=[]) {
        //excel数据导出
        require.ensure([], () => {
            const list = datalist;
            const data = this.formatJson(filterVal, list);
            export_json_to_excel(tHeader, data, tablename);
        })
    },
    formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
    }
}
export default utils
