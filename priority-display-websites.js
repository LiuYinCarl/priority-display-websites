// ==UserScript==
// @name         priority-display-websites
// @version      0.1
// @description  Priority display of Google search results for hit keywords
// @author       kenshin
// @license      GPL version 2 or any later version; http://www.gnu.org/licenses/gpl-2.0.txt
// @match        https://www.google.co.jp/search?*
// @match        https://www.google.com/*
// @match        https://www.google.com.hk/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addStyle
// ==/UserScript==

//需要添加其他网站关键字，则按规则加入
var re = 'stackoverflow|github|quora|python\.org';
var googleRe = /www.google.com|www.google.co.jp|www.google.cn|www.google.com.hk/;
var getRe = GM_getValue('re', re);
var reg = new RegExp(getRe);
var host = window.location.host;
var MObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MObserver(function(records){
    googleSorter()
});
var option = {
    'childList': true,
};
observer.observe(document.body, option);

function exchange(el1, el2){
    var ep1 = el1.parentNode,
        ep2 = el2.parentNode,
        index1 = Array.prototype.indexOf.call(ep1.children, el1),
        index2 = Array.prototype.indexOf.call(ep2.children, el2);
    ep2.insertBefore(el1,ep2.children[index2]);
    ep1.insertBefore(el2,ep1.children[index1]);
}

function googleSorter() {
    if( googleRe.test(host)) {
        var shotList = []
        var queryList=document.getElementsByClassName('MjjYud'); // MjjYud 是包住每个搜索结果的 div 的 classname
        var queryNum=queryList.length;
        for(var i=0;i<queryNum;i++)
        {
            let item=queryList[i];
            var html = item.innerHTML;
            if(reg.test(html)) {
                shotList.push(i);
            }
        }
        // 冒泡排序将命中关键字的搜索结果上浮
        for (var m = 0; m < shotList.length; m++) {
            var pos = shotList[m];
            while (pos > m) {
                exchange(queryList[pos], queryList[pos-1]);
                pos -= 1;
            }
        }
    }
}
