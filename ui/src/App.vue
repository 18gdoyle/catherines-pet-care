<script setup lang="ts">
import NavBar from './components/NavBar.vue'
import MeetAndGreetPage from './pages/MeetAndGreetPage.vue'
import AdminPage from './pages/AdminPage.vue'
import ScheduleAVisitPage from './pages/ScheduleAVisitPage.vue';
</script>

<template>
  <div>
    <div class="navbar">
      <NavBar
        @show-home="showHome"
        @show-scheduler="showScheduler"
        @show-admin="showAdmin"
        @show-admin-calendar="showAdminCalendar"
        @show-meet-and-greet-pick-up="showMeetAndGreetPickUp"
        @show-visit-scheduler="showVisitScheduler"
        @show-profile="showProfile"
        @show-sign-in="showSignIn"
        @show-about-us="showAboutUs"
        @show-pending-visits="showPendingVisits"
        :userMode="userMode"
        :userInfo="userInfo"
      ></NavBar>
    </div>
    <div class="header">
      <HomePage
        v-if="homeShowing"
        :userMode="userMode"
        :userInfo="userInfo"
        @show-scheduler="showScheduler"
        @show-about-us="showAboutUs"
        @show-sign-in="showSignIn"
        @show-visit-scheduler="showVisitScheduler"
        @show-my-visits="showMyVisits"
      ></HomePage>
      <AboutUsPage
        v-if="aboutUsShowing"
      ></AboutUsPage>
      <MeetAndGreetPage
        v-if="schedulerShowing"
        :userInfo="userInfo"
        :userMode="userMode"
        @update-user-mode="updateUserMode"
      ></MeetAndGreetPage>
      <AdminPage
        v-if="adminShowing"
        :userInfo="userInfo"
        @sign-out="signOutUser"
      ></AdminPage>
      <ScheduleAVisitPage
        v-if="visitSchedulerShowing"
        :userInfo="userInfo"
      ></ScheduleAVisitPage>
      <MyVisitsPage
        v-if="myVisitsShowing"
        :userInfo="userInfo"
        @show-visit-scheduler="showVisitScheduler"
      ></MyVisitsPage>
      <UserProfile
        v-if="profileShowing"
        :userInfo="userInfo"
        @sign-out="signOutUser"
      ></UserProfile>
      <FirebaseAuth
        v-if="signInShowing"
        @user-authenticated="showHome"
      ></FirebaseAuth>
      <PendingMeetAndGreets
        v-if="meetAndGreetPickUpShowing"
        :employeeInfo="userInfo"
      ></PendingMeetAndGreets>
      <AdminCalendar
        v-if="adminCalendarShowing"
        :employeeInfo="userInfo"
      ></AdminCalendar>
      <PendingVisits
        v-if="pendingVisitsShowing"
        :employeeInfo="userInfo"
      ></PendingVisits>
    </div>
  </div>
</template>

<script lang="ts">
import { getAuth, onAuthStateChanged } from "firebase/auth";
import * as employees from "./services/employees"
import * as customers from "./services/customers"
import UserProfile from './components/UserProfile.vue';
import FirebaseAuth from './components/FirebaseAuth.vue';
import HomePage from './pages/HomePage.vue';
import AboutUsPage from './pages/AboutUsPage.vue';
import MyVisitsPage from './pages/MyVisitsPage.vue';
import PendingMeetAndGreets from './components/admin/PendingMeetAndGreets.vue';
import AdminCalendar from './components/admin/AdminCalendar.vue';
import PendingVisits from './components/admin/PendingVisits.vue';
	export default{
    data() {
      return {
        schedulerShowing: false,
        adminShowing: false,
        meetAndGreetPickUpShowing: false,
        adminCalendarShowing: false,
        homeShowing: false,
        visitSchedulerShowing: false,
        profileShowing: false,
        signInShowing: false,
        aboutUsShowing: false,
        myVisitsShowing: false,
        pendingVisitsShowing: false,
        userMode: 'newUser',
        userInfo: {} as any,
      };
    },
    async mounted() {
      const auth = getAuth();
      onAuthStateChanged(auth, async (user: any) => {
        if (user) {
          this.userInfo = user;
          this.userMode = 'pendingCustomer'
          try {
            let customer = await customers.getCustomerInfo(user.accessToken, user.email);
            if (customer.length === 1) {
              this.userInfo.address = customer[0].address;
              this.userInfo.cell = customer[0].cell;
              this.userInfo.userType = 'customer';
              if (customer[0].approved) {
                this.userMode = 'customer';
                this.showHome();
                return;
              }
            }
          } catch (error) {
            console.dir(error);
            return;
          }

          try {
            let employee = await employees.getEmployeeInfo(user.accessToken, user.email);
            if (employee.length === 1) {
              this.userInfo.address = employee[0].address;
              this.userInfo.userType = 'employee';
              this.userMode = 'employee'
              this.showMeetAndGreetPickUp();
              return;
            }
          } catch (error) {
            console.dir(error);
            return;
          }

          if (!this.schedulerShowing) {
            this.showHome();
          }
        } else {
          this.showHome();
        }
      });
    },
    methods: {
      showProfile() {
        this.hideAll();
        this.profileShowing = true;
      },
      showSignIn() {
        this.hideAll();
        this.signInShowing = true;
      },
      showHome() {
        this.hideAll();
        this.homeShowing = true;
      },
      showScheduler() {
        this.hideAll();
        this.schedulerShowing = true;
      },
      showAdmin() {
        this.hideAll();
        this.adminShowing = true;
      },
      showVisitScheduler() {
        this.hideAll();
        this.visitSchedulerShowing = true;
      },
      showAboutUs() {
        this.hideAll();
        this.aboutUsShowing = true;
      },
      showMyVisits() {
        this.hideAll();
        this.myVisitsShowing = true;
      },
      showMeetAndGreetPickUp() {
        this.hideAll();
        this.meetAndGreetPickUpShowing = true;
      },
      showAdminCalendar() {
        this.hideAll();
        this.adminCalendarShowing = true;
      },
      showPendingVisits() {
        this.hideAll();
        this.pendingVisitsShowing = true;
      },
      hideAll() {
        this.meetAndGreetPickUpShowing = false;
        this.adminCalendarShowing = false;
        this.adminShowing = false;
        this.schedulerShowing = false;
        this.homeShowing = false;
        this.visitSchedulerShowing = false;
        this.profileShowing = false;
        this.signInShowing = false;
        this.aboutUsShowing = false;
        this.myVisitsShowing = false;
        this.pendingVisitsShowing = false;
      },
      signOutUser() {
        this.userMode = 'newUser';
        this.userInfo = {};
        this.hideAll();
        this.homeShowing = true;
      },
      updateUserMode(userMode: string) {
        this.userMode = userMode;
      }
    },
    components: { ScheduleAVisitPage, UserProfile, FirebaseAuth, HomePage, AboutUsPage, MyVisitsPage, PendingMeetAndGreets, AdminCalendar, PendingVisits }
}
</script>

<style scoped>
.navbar {
  z-index: 2;
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
}
.header {
  margin-top: 73px;
  position: relative;
}

.row {
  width: 100vw;
  margin: auto;
  margin-top: 2vh;
}

.rowItem {
  margin-left: 2.5vw;
  margin-right: 2.5vw;
  display: inline-block;
}
</style>
