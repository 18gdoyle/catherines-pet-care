<template>
  <div class="hamburger-menu">
    <input id="menu__toggle" type="checkbox" />
    <label class="menu__btn" for="menu__toggle">
      <span></span>
    </label>

    <ul class="menu__box">
      <li><a class="menu__item" @click="showPendingMeetAndGreet">Pick Up a Meet and Greet</a></li>
      <li><a class="menu__item" @click="showMyCalendar">My Calendar</a></li>
      <li><a class="menu__item" @click="showMyMeetAndGreets">My Meet and Greets</a></li>
      <li><a class="menu__item" @click="showEmployeeProfile">My Profile</a></li>
    </ul>
  </div>
</template>

<script lang="ts">
    export default{
      methods: {
        showPendingMeetAndGreet() {
          this.$emit('showPendingMeetAndGreet');
          (document.getElementById('menu__toggle') as HTMLInputElement).checked = false;
        },
        showMyCalendar() {
          this.$emit('showMyCalendar');
          (document.getElementById('menu__toggle') as HTMLInputElement).checked = false;
        },
        showMyMeetAndGreets() {
          this.$emit('showMyMeetAndGreets');
          (document.getElementById('menu__toggle') as HTMLInputElement).checked = false;
        },
        showEmployeeProfile() {
          this.$emit('showEmployeeProfile');
          (document.getElementById('menu__toggle') as HTMLInputElement).checked = false;
        }
      }
    }
</script>

<style scoped lang="scss">
.hamburger-menu {
    margin-top: 73px;
}
#menu__toggle {
  opacity: 0;
}
#menu__toggle:checked + .menu__btn > span {
  transform: rotate(45deg);
}
#menu__toggle:checked + .menu__btn > span::before {
  top: 0;
  transform: rotate(0deg);
}
#menu__toggle:checked + .menu__btn > span::after {
  top: 0;
  transform: rotate(90deg);
}
#menu__toggle:checked ~ .menu__box {
  left: 0 !important;
}
.menu__btn {
  position: fixed;
  top: 100px;
  left: 20px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  z-index: 3;
}
.menu__btn > span,
.menu__btn > span::before,
.menu__btn > span::after {
    z-index: 3;
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #616161;
  transition-duration: .25s;
}
.menu__btn > span::before {
  content: '';
  top: -8px;
}
.menu__btn > span::after {
  content: '';
  top: 8px;
}
.menu__box {
  display: block;
  position: fixed;
  top: 30px;
  left: -100%;
  width: 60vw;
  max-width: 200px;
  height: 100%;
  margin: 0;
  padding: 80px 0;
  list-style: none;
  background-color: white;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
  transition-duration: .25s;
  z-index: 1;
}
.menu__item {
  display: block;
  padding: 12px 24px;
  color: #333;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transition-duration: .25s;
}
.menu__item:hover {
    cursor: pointer;
  color: #66f
}
</style>
