<template lang="pug">
	div.wrapper
		div.container(@click="triggerAnimation")
			div.main-circle-container
				div.main-circle(v-if="!animationOngoing")
				div.sub-circle-container(:style={transform:"translate(-50%, -50%) rotate(90deg)"})
					div.sub-circle(:style={transform:"rotate(-90deg)"}, :class="selectedCircleClass")
					//- Formula (+130deg)
			div.previous-main-circle-preview(v-if="startAnimation", :style={transform:"translate(-50%) rotate(210deg)"})
				div.main-circle(@click="triggerAnimation", :class="previewCircleClass")
		button.animate-button(@click="triggerAnimation") {{!startAnimation ? 'animate' : zoomIn ? 'Zoom Out' : 'Zoom In'}}
</template>

<script>
export default {
  name: "ZoomLogic",
  data() {
    return {
      startAnimation: false,
      animationOngoing: false,
      zoomIn: true
    };
  },
  methods: {
    triggerAnimation() {
      if (this.animationOngoing) {
        return;
      }
      this.startAnimation = true;
      this.animationOngoing = true;
      this.zoomIn = !this.zoomIn;

      setTimeout(() => {
        this.animationOngoing = false;
      }, 1000);
    }
  },
  computed: {
    selectedCircleClass() {
      const classes = {
        "animate-selected-focus-out-circle": false,
        "animate-selected-focus-in-circle": false
      };
      if (this.startAnimation) {
        classes["animate-selected-focus-in-circle"] = !this.zoomIn;
        classes["animate-selected-focus-out-circle"] = !!this.zoomIn;
      }
      return classes;
    },
    previewCircleClass() {
      const classes = {
        "animate-previous-circle-zoom-out": false,
        "animate-previous-circle-zoom-in": false
      };
      if (this.startAnimation) {
        classes["animate-previous-circle-zoom-out"] = !this.zoomIn;
        classes["animate-previous-circle-zoom-in"] = !!this.zoomIn;
      }
      return classes;
    }
  }
};
</script>

<style scoped>
.animate-button {
  position: absolute;
  top: 0;
}

.container {
  position: relative;
  /* padding: 10% 0;
  width: 100%; */
}

.wrapper {
  position: relative;
  padding: 10% 0;
  overflow: hidden;
}

.wrapper.back-is-valid {
  cursor: zoom-out;
}

.main-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  border: 3px solid #d4cdcd;
  margin: 0 auto;

  background-color: #e6e3e3;
}

.main-circle-container {
  position: relative;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  left: 50%;
  transform: translate(-50%);
  background-color: rgba(255, 255, 255, 0);
}

.previous-main-circle-preview {
  position: absolute;
  transform: translate(-50%);
  left: 50%;
  top: 50%;
  width: 1px;
  height: 1px;
}

.sub-circle-container {
  cursor: zoom-in;
  visibility: hidden;
  position: absolute;
  width: 170%;
  /* height: 120px; */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.sub-circle {
  /* z-index: 10000; */
  visibility: visible;
  float: right;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 3px solid #d4cdcd;
  display: flex;
  justify-content: center;
  align-items: center;

  /* Set base design */
  background-color: #e6e3e3;
  font-weight: bold;
  color: #000;
}

/******************************************
 Animations 
*******************************************/

/* Previous Circle */
.animate-previous-circle-zoom-out {
  animation: zoomOutPreviousCircle 1s forwards;
}

.animate-previous-circle-zoom-in {
  animation: zoomInPreviousCircle 1s forwards;
}

/* Selected Circle */
.animate-selected-focus-in-circle {
  position: relative;
  border-width: 0;
  animation: focusInCircleAnimation 1s ease-out;
}

.animate-selected-focus-out-circle {
  position: relative;
  border-width: 0;
  animation: focusOutCircleAnimation .6s ease-out;
}

@keyframes zoomOutPreviousCircle {
  0% {
    transform: translate(-49%, -54%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(150%, 150%) scale(4);
    opacity: 0.4;
  }
}

/* Previous Circle */
@keyframes zoomInPreviousCircle {
  0% {
    transform: translate(150%, 150%) scale(4);
    opacity: 0.4;
  }
  50% {
    opacity: 0.6;
  }
  99% {
    opacity: 0.9;
  }
  100% {
    transform: translate(-49%, -54%) scale(1);
    opacity: 0;
  }
}

/* Selected Circle */
@keyframes focusInCircleAnimation {
  0% {
    right: 0%;
  }
  100% {
    right: 40%;
    transform: scale(4);
  }
}

@keyframes focusOutCircleAnimation {
  0% {
    right: 40%;
    transform: scale(4);
  }
  100% {
    right: 0%;
  }
}
</style>