document.addEventListener("DOMContentLoaded", setupVideoControl, false);

function setupVideoControl() {
  var video = document.getElementById("video");

  if(video) {
    if (video.canPlayType) {
      video.addEventListener("timeupdate", reportProgress, false);
      video.addEventListener("ended", endPlayback, false);

      video.addEventListener("play", function () {
        document.getElementById("video-container").classList.remove('overlay');
        document.getElementById("start").disabled = true;
        document.getElementById("pause").disabled = false;
      }, false);
  
      video.addEventListener("pause", function () {
        document.getElementById("video-container").classList.add('overlay');
        document.getElementById("start").disabled = false;
        document.getElementById("video").classList.add('pause');
        document.getElementById("pause").disabled = true;
      }, false);
  
      document.getElementById("start").addEventListener("click",startPlayback,false);
      document.getElementById("pause").addEventListener("click",pausePlayback,false);
    };
  
    function startPlayback() {
      document.getElementById("video").play();
    };
  
    function pausePlayback() {
      document.getElementById("video").pause();
    };

    function endPlayback() {
      var progress = document.getElementById("butterfly"); 
      progress.style.left="-10px";
      document.getElementById("start").disabled=false; 
      document.getElementById("pause").disabled=true; 
      document.getElementById("stop").disabled=true;
    }

    function reportProgress() {
      var barwidth = 688; 
      var sliderwidth = 30;
      var time = Math.round(this.currentTime);
      var duration = parseInt(this.duration);
      var position = barwidth * (time / duration); 
      if (isNaN(position)) return;
        document.getElementById("loadingprogress").style.width=position + "px";
        var butterfly = document.getElementById("butterfly"); 
        if (position <= (barwidth - Math.round(sliderwidth / 2))) { 
          butterfly.style.left=position + "px"; 
      } else { 
        butterfly.style.left=barwidth - Math.round(sliderwidth / 2); 
      } 
    }
  };
};