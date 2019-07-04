const warntip = {
    noempty:"该字段不能为空",
    branchnamerepetition:"机构名称不能重复",
    nouploadfile:"文件格式不正确",
    usernamempty:'账户不能为空',
    passwordempty:'密码不能为空'
}
const checkreg = {
    //校验最多几位数字
    checkmaxleng(info, num) {
        let reg = /^\d{4}$/;
        let str = info.match(reg);
        return str;
    },
    //校验空字段
    checkempty(info) {
        info = info.trim();
        if (info === '') {
            return false;
        } else {
            return true;
        }
    },
    //表单不能为空
    emptyblur(rule, value, callback) {
        if (value.toString().trim()=='') {
            callback(new Error(warntip.noempty));
        } else {
            callback();
        }
    },
    //校验文件类型
    beforefiletype(value){
        if(value === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"||value === "application/pdf"||value === "application/msword"){
            return true;
        }else{
            return false;
        }
    },
    //上传时改变文件时校验
    uploadfiletype(rule, value, callback) {
        if(value === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"||value === "application/pdf"||value === "application/msword"
    ){
        callback();
    }else{
        callback(new Error(warntip.nouploadfile));
    }
        
    },
    //校验身份证
    checkidno(rule, value, callback) {
        //城市
        var vcity = {
            11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古",
            21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏",
            33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南",
            42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆",
            51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃",
            63: "青海", 64: "宁夏", 65: "新疆", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外"
        };
        //检查号码是否符合规范，包括长度，类型
        function isCardNo (card) {
            //身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
            var reg = /(^\d{15}$)|(^\d{17}([\d|X])$)/;  //(?i:x)
            if (reg.test(card) === false) {
                return false;
            }
            return true;
        };
        //取身份证前两位,校验省份
        function checkProvince (card) {
            var province = card.substr(0, 2);
            if (vcity[province] == undefined) {
                return false;
            }
            return true;
        };
        ////检查生日是否正确
        function checkBirthday (card) {
            var len = card.length;
            //身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
            if (len == '15') {
                var re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
                var arr_data = card.match(re_fifteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date('19' + year + '/' + month + '/' + day);
                return verifyBirthday('19' + year, month, day, birthday);
            }
            //身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
            if (len == '18') {
                var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
                var arr_data = card.match(re_eighteen);
                var year = arr_data[2];
                var month = arr_data[3];
                var day = arr_data[4];
                var birthday = new Date(year + '/' + month + '/' + day);
                return verifyBirthday(year, month, day, birthday);
            }
            return false;
        };
        //校验日期
        function verifyBirthday (year, month, day, birthday) {
            var now = new Date();
            var now_year = now.getFullYear();
            //年月日是否合理
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                //判断年份的范围（3岁到100岁之间)  //改成0-150岁之间
                var time = now_year - year;
                if (time >= 0 && time <= 150) {
                    return true;
                }
                return false;
            }
            return false;
        };
        //校验位的检测
        function checkParity (card) {
            //15位转18位
            card = changeFivteenToEighteen(card);
            var len = card.length;
            if (len == '18') {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i, valnum;
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[cardTemp % 11];
                if (valnum == card.substr(17, 1)) {
                    return true;
                }
                return false;
            }
            return false;
        };
        //15位转18位身份证号
        function changeFivteenToEighteen (card) {
            if (card.length == '15') {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0, i;
                card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
                for (i = 0; i < 17; i++) {
                    cardTemp += card.substr(i, 1) * arrInt[i];
                }
                card += arrCh[cardTemp % 11];
                return card;
            }
            return card;
        };
        //调用之前全部判断函数；
        function checkCard()
        {
            var card = value;

            //校验长度，类型
            if( card === '' ||
                isCardNo(card) === false ||
                checkProvince(card) === false ||
                checkBirthday(card) === false ||
                checkParity(card) === false )
            {

                callback(new Error(warntip.idcardno));
                return false;
            }
            callback();
            return true;
        };
        checkCard();
    },
    //校验手机号
    checkphone(rule, value, callback){
        var reg = /^1(3|4|5|7|8)\d{9}$/;
        if (reg.test(value) === false) {
            callback(new Error(warntip.phoneno));
        } else {
            callback();
        }
    },
    //校验银行卡
    bankcardreg() {
        /**
         * 检查银行卡号是否符合规则
         * @param bankno 银行卡号
         * @returns
         */

        function cardobj(){};
        cardobj.prototype.checkBankNo = (bankno)=>{
            var bankno = bankno.replace(/\s/g, '');
            if (bankno == "") {
                this.toastinfo("请填写银行卡号");
                return false;
            }
            if (bankno.length < 16 || bankno.length > 19) {
                this.toastinfo("银行卡号长度必须在16到19之间");
                return false;
            }
            var num = /^\d*$/; // 全数字
            if (!num.exec(bankno)) {
                this.toastinfo("银行卡号必须全为数字");
                return false;
            }
            // 开头两位
            var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
            if (strBin.indexOf(bankno.substring(0, 2)) == -1) {
                this.toastinfo("银行卡号开头两位不符合规范");
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
        function _luhnCheck(bankno) {
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
        return new cardobj();
    }
}
let checkvalidator = {
    noemptyblur:{
        required: true,
        validator: checkreg.emptyblur,
        trigger: 'blur'
    },
    uploadfiletype:{
        required: true,
        validator: checkreg.uploadfiletype,
        trigger: 'blur'
    },
    noemptychange:{
        required: true,
        message: warntip.noempty,
        trigger: 'change'
    }
}
export default {
    checkreg: checkreg,
    warntip: warntip,
    checkvalidator: checkvalidator
}
