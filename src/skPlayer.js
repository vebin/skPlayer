/**
 * Created by Scott on 2016/7/7.
 */
(function(window){
    //公共方法
    var Public = {
        'timeFormat': function (time) {
            var tempMin = parseInt(time / 60);
            var tempSec = parseInt(time % 60);
            var curMin  = tempMin < 10 ? ('0' + tempMin) : tempMin;
            var curSec  = tempSec < 10 ? ('0' + tempSec) : tempSec;
            return curMin + ':' + curSec;
        },
        'leftDistance': function (el) {
            var left = el.offsetLeft;
            while (el.offsetParent) {
                el = el.offsetParent;
                left += el.offsetLeft;
            }
            return left;
        }
    };
    //对象主体
    skPlayer = function(options){
        //配置检测
        if(!(options.src && options.name && options.author && options.cover)){
            console.error('请正确配置对象！');
            return;
        }
        //初始化
        var music = options,
            target = document.getElementById('skPlayer'),
            HTMLcontent = '<audio src="' + music.src + '" preload="auto"></audio>';
            HTMLcontent+= '<div class="skPlayer-picture">';
            HTMLcontent+= '    <img src="' + music.cover + '" alt="" class="skPlayer-cover">';
            HTMLcontent+= '    <a href="javascript:;" class="skPlayer-play-btn">';
            HTMLcontent+= '        <span class="skPlayer-left"></span>';
            HTMLcontent+= '        <span class="skPlayer-right"></span>';
            HTMLcontent+= '    </a>';
            HTMLcontent+= '</div>';
            HTMLcontent+= '<div class="skPlayer-control">';
            HTMLcontent+= '    <p class="skPlayer-name">' + music.name + '</p>';
            HTMLcontent+= '    <p class="skPlayer-author">' + music.author + '</p>';
            HTMLcontent+= '    <div class="skPlayer-percent">';
            HTMLcontent+= '        <div class="skPlayer-line"></div>';
            HTMLcontent+= '    </div>';
            HTMLcontent+= '    <p class="skPlayer-time">';
            HTMLcontent+= '        <span class="skPlayer-cur"></span>/<span class="skPlayer-total"></span>';
            HTMLcontent+= '    </p>';
            HTMLcontent+= '    <div class="skPlayer-volume">';
            HTMLcontent+= '        <i class="skPlayer-icon" data-volume="0"></i>';
            HTMLcontent+= '        <div class="skPlayer-percent">';
            HTMLcontent+= '            <div class="skPlayer-line"></div>';
            HTMLcontent+= '        </div>';
            HTMLcontent+= '    </div>';
            HTMLcontent+= '</div>';
            HTMLcontent+= '<div class="skPlayer-loading">';
            HTMLcontent+= '    LOADING';
            HTMLcontent+= '</div>';

        target.innerHTML = HTMLcontent;

        var audio = target.querySelector('audio'),
            playBtn = target.querySelector('.skPlayer-play-btn'),
            currentTime = target.querySelector('.skPlayer-percent').querySelector('.skPlayer-line'),
            totalTime = target.querySelector('.skPlayer-percent'),
            currentVolume = target.querySelector('.skPlayer-volume').querySelector('.skPlayer-line'),
            totalVolume = target.querySelector('.skPlayer-volume').querySelector('.skPlayer-percent'),
            quietVolume = target.querySelector('.skPlayer-icon'),
            currentTime_text = target.querySelector('.skPlayer-cur'),
            totalTime_text = target.querySelector('.skPlayer-total'),
            loading = target.querySelector('.skPlayer-loading'),
            cover = target.querySelector('.skPlayer-cover');

        var duration;

        //事件绑定
        handleEvent();
        //可播放状态
        function canPlayThrough(){
            if((music.loop != 'undefined') && (music.loop == true)){
                audio.loop = true;
            }
            duration = this.duration;
            currentTime_text.innerText = '00:00';
            totalTime_text.innerText = Public.timeFormat(parseInt(duration));
            if(audio.volume == 1){
                audio.volume = 0.7;
                currentVolume.style.width = '70%';
            }
            loading.style.backgroundColor = 'rgba(255,255,255,.0)';
            loading.style.color = 'rgba(117,101,98,.0)';
            setTimeout(function(){
                loading.style.display = 'none';
                playBtn.addEventListener('click', playClick);
            },900);
        }
        //歌曲时长变动
        function durationChange() {
            duration = this.duration;
        }
        //时间更新
        function timeUpdate(){
            var curTime = parseInt(audio.currentTime);
            var playPercent = (curTime / duration) * 100;
            currentTime.style.width = playPercent.toFixed(2) + '%';
            currentTime_text.innerText = Public.timeFormat(curTime);
        }
        //播放结束
        function audioEnd(){
            playBtn.classList.remove('skPlayer-pause');
            cover.classList.remove('skPlayer-pause');
            currentTime_text.innerText = '00:00';
            currentTime.style.width = 0;
        }
        //播放控制
        function playClick(){
            if(audio.paused){
                audio.play();
            }else{
                audio.pause();
            }
            if(playBtn.classList.contains('skPlayer-pause')){
                playBtn.classList.remove('skPlayer-pause');
                cover.classList.remove('skPlayer-pause');
            }else{  
                playBtn.classList.add('skPlayer-pause');
                cover.classList.add('skPlayer-pause');
            }
        }
        //进度控制
        function timeLineClick(){
            var clickPercent = (event.pageX - Public.leftDistance(this)) / this.offsetWidth;
            currentTime.style.width = clickPercent * 100 + '%';
            audio.currentTime = parseInt(clickPercent * duration);
        }
        //音量控制
        function volumeLineClick() {
            if(quietVolume.classList.contains('skPlayer-quiet')){
                quietVolume.classList.remove('skPlayer-quiet');
            }
            var clickPercent = (event.pageX - Public.leftDistance(this)) / this.offsetWidth;
            currentVolume.style.width = clickPercent * 100 + '%';
            audio.volume = clickPercent.toFixed(2);
        }
        //静音控制
        function volumeQuiet(){
            if(audio.volume != 0){
                quietVolume.setAttribute('data-volume',audio.volume);
                audio.volume = 0;
                currentVolume.style.width = 0;
                quietVolume.classList.add('skPlayer-quiet');
            }else{
                audio.volume = quietVolume.getAttribute('data-volume');
                currentVolume.style.width = quietVolume.getAttribute('data-volume') * 100 +'%';
                quietVolume.setAttribute('data-volume','0');
                quietVolume.classList.remove('skPlayer-quiet');
            }
        }
        //事件绑定函数
        function handleEvent(){
            audio.addEventListener('canplaythrough', canPlayThrough);
            audio.addEventListener('durationchange', durationChange);
            audio.addEventListener('timeupdate', timeUpdate);
            audio.addEventListener('ended', audioEnd);
            totalTime.addEventListener('click', timeLineClick);
            totalVolume.addEventListener('click', volumeLineClick);
            quietVolume.addEventListener('click', volumeQuiet);
        }
    };
    //暴露接口
    window.skPlayer = skPlayer;
})(window);
//处理模块化
if(typeof module !== 'undefined' && typeof module.exports !== 'undefined'){
    module.exports = window.skPlayer;
}