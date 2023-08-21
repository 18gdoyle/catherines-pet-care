<template>
    <div class="hamburger-main_nav">
        <input id="main_nav__toggle" type="checkbox" />
        <label class="main_nav__btn" for="main_nav__toggle">
            <span></span>
        </label>

        <ul class="main_nav__box">
          <li v-if="userMode === 'newUser' || userMode === 'pendingCustomer' || userMode === 'customer'"><a class="main_nav__item" @click="showHome()">Home</a></li>
          <li v-if="userMode === 'newUser' || userMode === 'pendingCustomer'"><a class="main_nav__item" @click="showScheduler()">Schedule a Meet and Greet</a></li>
          <li v-if="userMode === 'customer'"><a class="main_nav__item" @click="showVisitScheduler()">Schedule a Visit</a></li>
          <li v-if="userMode === 'employee'"><a class="main_nav__item" @click="showPickUpAMeetAndGreet()">Pick Up a Meet and Greet</a></li>
          <li v-if="userMode === 'employee'"><a class="main_nav__item" @click="showPickUpVisits()">Pick Up Visits</a></li>
          <li v-if="userMode === 'employee'"><a class="main_nav__item" @click="showAdminCalendar()">My Calendar</a></li>
          <li v-if="userMode === 'newUser' || userMode === 'pendingCustomer' || userMode === 'customer'"><a class="main_nav__item" @click="showAboutUs()">About Us</a></li>
          <li v-if="userMode === 'newUser'"><a class="main_nav__item" @click="showSignIn()">Sign In</a></li>
          <li v-if="userMode === 'customer' || userMode === 'employee' || userMode === 'pendingCustomer'"><a class="main_nav__item" @click="showProfile()">My Profile</a></li>
        </ul>
  </div>
</template>

<script lang="ts">
    export default{
      props: {
        userMode: String
      },
      methods: {
        showAdmin() {
          this.$emit('show-admin');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showAdminCalendar() {
          this.$emit('show-admin-calendar');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showHome() {
          this.$emit('show-home');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        }, 
        showScheduler() {
          this.$emit('show-scheduler');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showVisitScheduler() {
          this.$emit('show-visit-scheduler');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showPickUpAMeetAndGreet() {
          this.$emit('show-pick-up-a-meet-and-greet');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showAboutUs() {
          this.$emit('show-about-us');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showSignIn() {
          this.$emit('show-sign-in');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showProfile() {
          this.$emit('show-profile');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        },
        showPickUpVisits() {
          this.$emit('show-pending-visits');
          (document.getElementById('main_nav__toggle') as HTMLInputElement).checked = false;
        }
      }
    }
</script>

<style scoped lang="scss">

.hamburger-main_nav {
    margin-top: 30px;
}
#main_nav__toggle {
  opacity: 0;
}
#main_nav__toggle:checked + .main_nav__btn > span {
  transform: rotate(45deg);
}
#main_nav__toggle:checked + .main_nav__btn > span::before {
  top: 0;
  transform: rotate(0deg);
}
#main_nav__toggle:checked + .main_nav__btn > span::after {
  top: 0;
  transform: rotate(90deg);
}
#main_nav__toggle:checked ~ .main_nav__box {
  left: 0 !important;
}
.main_nav__btn {
  position: fixed;
  left: 20px;
  right: 20px;
  width: 26px;
  height: 26px;
  cursor: pointer;
  z-index: 3;
}
.main_nav__btn > span,
.main_nav__btn > span::before,
.main_nav__btn > span::after {
    z-index: 3;
  display: block;
  position: absolute;
  width: 100%;
  height: 2px;
  background-color: #616161;
  transition-duration: .25s;
}
.main_nav__btn > span::before {
  content: '';
  top: -8px;
}
.main_nav__btn > span::after {
  content: '';
  top: 8px;
}
.main_nav__box {
  display: block;
  position: fixed;
  top: 0px;
  left: -100%;
  height: 100%;
  margin: 0;
  padding: 80px 0;
  list-style: none;
  background-color: white;
  box-shadow: 2px 2px 6px rgba(0, 0, 0, .4);
  transition-duration: .25s;
  z-index: 1;
}
.main_nav__item {
  display: block;
  padding: 12px 24px;
  color: #333;
  font-size: 20px;
  font-weight: 500;
  text-decoration: none;
  transition-duration: .25s;
}
.main_nav__item:hover {
    cursor: pointer;
  color: #66f
}

.main_nav__item:clicked {
    cursor: pointer;
  color: red
}

</style>
