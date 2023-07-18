<template>
    <div>
        <div class="box-animation-container hero-figure anime-element">
            <div class="hero-figure-box hero-figure-box-01" data-rotation="45deg"></div>
            <div class="hero-figure-box hero-figure-box-02" data-rotation="-45deg"></div>
            <div class="hero-figure-box hero-figure-box-03" data-rotation="90deg"></div>
            <div class="hero-figure-box hero-figure-box-04" data-rotation="-135deg"></div>
            <div class="hero-figure-box hero-figure-box-05" data-rotation="-40deg"></div>
            <div class="hero-figure-box hero-figure-box-06" data-rotation="-20deg"></div>
            <div class="hero-figure-box hero-figure-box-07" data-rotation="-30deg"></div>
            <div class="hero-figure-box hero-figure-box-08" data-rotation="-22deg"></div>
            <div class="hero-figure-box hero-figure-box-09" data-rotation="-52deg"></div>
            <div class="hero-figure-box hero-figure-box-10" data-rotation="-50deg"></div>
        </div>
    </div>
</template>

<style>
.box-animation-container {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 50vh;
  z-index: -1;
}

.hero-figure {
  position: absolute;
  width: 100%;
  height: 100%;
}

.hero-figure-box {
  position: absolute;
  will-change: transform;
}

.hero-figure-box-01 {
  left: 168px;
  top: 56px;
  width: 39.24%;
  height: 52.32%;
  background: linear-gradient(to left top, #00BFFB, rgba(0, 191, 251, 0));
  transform: rotateZ(45deg);
}

.hero-figure-box-02 {
  left: 112px;
  top: 112px;
  width: 53.11%;
  height: 70.7%;
  background: linear-gradient(to left top, #0270D7, rgba(14, 182, 185, 0));
  transform: rotateZ(-45deg);
}

.hero-figure-box-03 {
  left: 56px;
  top: 168px;
  rotate: 170deg;
  width: 78.69%;
  height: 106.05%;
  background: linear-gradient(to left top, #00BFFB, rgba(0, 191, 251, 0));
}

.hero-figure-box-04 {
  left: 168px;
  top: 168px;
  width: 63.63%;
  height: 84.84%;
  background: linear-gradient(to left top, #0270D7, rgba(2, 112, 215, 0));
  transform: rotateZ(-135deg);
}

.hero-figure-box-05 {
  left: 75px;
  top: 168px;
  rotate: 145deg;
  width: 89.6%;
  height: 103.18%;
  background: linear-gradient(135deg, #353b4b 0%, #08396a 100%);
  box-shadow: -20px 32px 64px rgba(0, 0, 0, 0.25);
}

.hero-figure-box-06 {
  left: 224px;
  top: 112px;
  width: 42.42%;
  height: 56.56%;
  background-color: #242830;
  box-shadow: -20px 32px 64px rgba(0, 0, 0, 0.25);
  transform: rotateZ(20deg);
}

.hero-figure-box-07 {
  left: 224px;
  top: 56px;
  width: 16.97%;
  height: 22.62%;
  background-color: #242830;
  box-shadow: -20px 32px 64px rgba(0, 0, 0, 0.25);
  transform: rotateZ(20deg);
}

.hero-figure-box-08 {
  left: 112px;
  top: 56px;
  width: 20.31%;
  height: 36.41%;
  background: linear-gradient(158deg, #0270D7 0%, #004A9E 100%);
  transform: rotateZ(-22deg);
}

.hero-figure-box-09 {
  left: 56px;
  top: 112px;
  width: 9.28%;
  height: 12.36%;
  background: linear-gradient(158deg, #00BFFB 0%, #0092D2 100%);
  transform: rotateZ(-52deg);
}

.hero-figure-box-10 {
  left: 0;
  top: 0;
  width: 4.24%;
  height: 5.66%;
  background: rgba(0, 191, 251, 0.32);
  transform: rotateZ(-50deg);
}

</style>