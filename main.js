

window.onload = () => {
  const video  = document.querySelector("#camera");

  /** カメラ設定 */
  const constraints = {
    audio: false,
    video: {
      width: 200,
      height: 300,
      //facingMode: "user"   // フロントカメラを利用する
       facingMode: { exact: "environment" }  // リアカメラを利用する場合
    }
  };

  /**
   * カメラを<video>と同期
   */
  navigator.mediaDevices.getUserMedia(constraints)
  .then( (stream) => {
    video.srcObject = stream;
    video.onloadedmetadata = (e) => {
      video.play();
    };
  })
  .catch( (err) => {
    console.log(err.name + ": " + err.message);
  });

};