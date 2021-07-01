document.addEventListener("DOMContentLoaded", setupVideoControl, false);

function setupVideoControl() {
  var video = document.getElementById("video");

  if (video.canPlayType) {
    video.addEventListener("play", function () {
      document.getElementById("start").disabled = true;
      document.getElementById("pause").disabled = false;
    }, false);

    video.addEventListener("pause", function () {
      document.getElementById("start").disabled = false;
      document.getElementById("video").classList.add('pause');
      document.getElementById("pause").disabled = true;
    }, false);

    document.getElementById("start").addEventListener("click",startPlayback,false);
    document.getElementById("pause").addEventListener("click",pausePlayback,false);
 
  }

  function startPlayback() {
    document.getElementById("video").play();
  }

  function pausePlayback() {
    document.getElementById("video").pause();
  }
}

