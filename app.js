Math.clamp = (val, min, max) => Math.min(max, Math.max(val, min));

const getLookAngle = (mouse, pupil) => {
  return Math.atan2(mouse.clientY - pupil.y, mouse.clientX - pupil.x);
};

const getLookDistance = (mouse, pupil) => {
  // multiplied by some scale factor, and clamped in 0-1
  return Math.clamp(Math.sqrt((mouse.clientY - pupil.y) ** 2 + (mouse.clientX - pupil.x) ** 2) * 1, 0, 1);
}

const app = new Vue({
  el: '#app',
  data: () => ({
    left: {
      center: {
        x: 0,
        y: 0,
      },
      x: 0,
      y: 0,
    },
    right: {
      center: {
        x: 0,
        y: 0,
      },
      x: 0,
      y: 0,
    }
  }),
  computed: {
    leftTransform() {
      return `translate(-400%, -50%)
        translateX(${this.left.x}%)
        translateY(${this.left.y}%)`;
    },
    rightTransform() {
      return `translate(200%, -50%)
        translateX(${this.right.x}%)
        translateY(${this.right.y}%)`;
    }
  },
  mounted() {
    this.updateCenter();
    window.addEventListener('resize', () => {
      this.updateCenter();
    });
  },
  methods: {
    updateCenter() {
      console.log('updating center...');
      const leftPupilRect = this.$refs.leftPupil.getBoundingClientRect();
      const rightPupilRect = this.$refs.rightPupil.getBoundingClientRect();
      this.left.center.x = leftPupilRect.x + leftPupilRect.width  / 2;
      this.left.center.y = leftPupilRect.y + leftPupilRect.height  / 2;
      
      this.right.center.x = rightPupilRect.x + rightPupilRect.width  / 2;
      this.right.center.y = rightPupilRect.y + rightPupilRect.height  / 2;
    },
    mouseMove(event) {  
      const leftLookAngle = getLookAngle(event, this.left.center);
      const leftLookDistance = getLookDistance(event, this.left.center);

      const rightLookAngle = getLookAngle(event, this.right.center);
      const rightLookDistance = getLookDistance(event, this.right.center);

      this.left.x = leftLookDistance * Math.cos(leftLookAngle) * 100;
      this.left.y = leftLookDistance * Math.sin(leftLookAngle) * 100;

      this.right.x = rightLookDistance * Math.cos(rightLookAngle) * 100;
      this.right.y = rightLookDistance * Math.sin(rightLookAngle) * 100;
    }
  },
});