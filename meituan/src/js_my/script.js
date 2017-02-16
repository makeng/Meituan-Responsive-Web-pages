/**
 * Created by Ken on 2016/11/9.
 */
var index_img = 0;
function lazyLoadFavorItem(){
    var $wrap = $('.favor-wrap');
    var $box0 = $('.favor-wrap-sub').eq(0);
    //
    $box0.hide();
    function makeFavorItem( index, callback ){
        var i = (index == 1) ? index : index * 15;
        $.ajax({
            url:'http://diviner.jd.com/diviner?p=610009&uuid=12396477&lid='+i+'&lim=15&cb=tempGuessLikeCallback',
            dataType:'jsonp',
            jsonp: 'callback',
            jsonpCallback: 'tempGuessLikeCallback',
            scriptCharset:'gb2312',                     /*数据转码*/
            success: function( res ){
                console.log( res );
                /*新的box加载内容*/
                var imgUrl = "";
                var data = res.data;
                $.each(data, function(idx, obj){
                    var $boxNew = $box0.clone();
                    imgUrl = "http://img13.360buyimg.com/n1/s200x200_"+ obj.img +"";
                    $boxNew.find('img').attr({src: 'img/loading.gif'});
                    $boxNew.find('h3').text( (obj.t).slice(0,5) );
                    $boxNew.find('strong').prepend( (obj.jp) );
                    $boxNew.find('b').text( parseInt(obj.jp) * 1.5 );
                    $boxNew.find('em').append( parseInt(obj.jp) * 2 );
                    $boxNew.appendTo( $wrap).show();
                    $boxNew.find('img').attr({src: imgUrl});
                });
                callback && callback();
            }
        });
    }
    makeFavorItem(0);   //先加载5个
    $(window).on("scroll", scrollLoad = function(){
        var scrollTop = $(window).scrollTop();
        var docHeight = $(document).height();
        var winHeight = $(window).height();
        if( docHeight <= (scrollTop + winHeight + 10) ){
            index_img ++;
            makeFavorItem( index_img );
            $(window).unbind("scroll", scrollLoad );//只加载一次
        }
    });
}
/*-----------------------------------------------------------------------------
 * 倒计时时钟
 * -----------------------------------------------------------------------------*/
function countDownClock(){
    var subBox = '#cnt-down li';
    var setTimeObj = {
        year: 2017,
        month: 2,
        date: 16,
        hour: 22,
        min: 0,
        sec: 0
    };
    //
    var cntTimer = setInterval( function(){
        var time = new Date().getTime() / 1000;
        var setTime = new Date( setTimeObj.year, setTimeObj.month - 1, setTimeObj.date, setTimeObj.hour, setTimeObj.min,    //程序月份应当减一
                setTimeObj.sec ).getTime() / 1000 ;
        var timeArr = [0, 0, 0];
        if ( time < setTime ){
            var timeGap = parseInt( setTime - time );
            timeArr[0] = Math.floor(timeGap/(3600));
            timeArr[1] = Math.floor( ( timeGap - (timeArr[0] * 3600) ) / 60 );
            timeArr[2] = Math.floor( timeGap - (timeArr[0] * 3600) - (timeArr[1] * 60) );
        }else{
            clearInterval( cntTimer );
        }
        for ( var i = 0; i < 3; i ++ ){
            if ( timeArr[i] < 10 ){
                timeArr[i] = '0' + timeArr[i];  //前面补个0
            }
            $(subBox + ':eq(' + i + ')').text( timeArr[i] );
        }
    }, 500 );
}
/*-----------------------------------------------------------------------------
 * 显示回弹按钮
 * -----------------------------------------------------------------------------*/
function btnBackShow(){
    var $btn = $('.btnBack');
    //
    $btn.click(function(){
        $(window).scrollTop(0);
    });
    $(window).on("scroll", scrollBtnShow = function(){
        var scrollTop = $(window).scrollTop();
        if( scrollTop > 10*50 ){
            $btn.show();
        }else{
            $btn.hide();
        }
    });
}
/*-----------------------------------------------------------------------------
* 事件调用
* -----------------------------------------------------------------------------*/
$(function(){
    /*swiper初始化*/
    var swiper = new Swiper('.swiper-container', {
        pagination: '.swiper-pagination',
        paginationClickable: true
    });
    lazyLoadFavorItem();
    countDownClock();
    btnBackShow();
});
