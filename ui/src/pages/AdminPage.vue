<template>
  <div>
    <AdminNavBar
      @showPendingMeetAndGreet="showPendingMeetAndGreetAdmin"
      @showMyCalendar="showMyCalendar"
      @showMyMeetAndGreets="showMyMeetAndGreetsAdmin"
      @showEmployeeProfile="showEmployeeProfile"
    ></AdminNavBar>
    <div>
      <div v-if="pendingMeetAndGreetAdminShowing">
        <PendingMeetAndGreets
          :employeeInfo="userInfo"
        ></PendingMeetAndGreets>
      </div>
      <div v-if="myMeetAndGreetsAdminShowing">
        <MyMeetAndGreets
          :employeeInfo="userInfo"
        ></MyMeetAndGreets>
      </div>
      <div v-if="myCalendarShowing">
        <AdminCalendar
          :employeeInfo="userInfo"
        ></AdminCalendar>
      </div>
      <div v-if="employeeProfileShowing">
        <UserProfile
          :userInfo="userInfo"
          @sign-out="$emit('sign-out')"
        ></UserProfile>
      </div>
    </div> 
  </div>
</template>

<script lang="ts">
import AdminCalendar from "@/components/admin/AdminCalendar.vue";
import AdminNavBar from "@/components/admin/AdminNavBar.vue";
import PendingMeetAndGreets from "@/components/admin/PendingMeetAndGreets.vue";
import MyMeetAndGreets from "@/components/admin/MyMeetAndGreets.vue";
import UserProfile from "@/components/UserProfile.vue";
import FirebaseAuth from "@/components/FirebaseAuth.vue";
import LoadingCircle from "@/components/LoadingCircle.vue";
export default {
  data() {
    return {
      selectedAvailabilityArray: [] as any,
      availabilityArray: [
        '9:00AM - 9:30AM', '9:30AM - 10:00AM', 
        '10:00AM - 10:30AM', '10:30AM - 11:00AM', 
        '11:00AM - 11:30AM', '11:30AM - 12:00PM', 
        '12:00PM - 12:30PM', '12:30PM - 1:00PM',
        '1:00PM - 1:30PM', '1:30PM - 2:00PM',
        '2:00PM - 2:30PM', '2:30PM - 3:00PM',
        '3:00PM - 3:30PM', '3:30PM - 4:00PM',
        '4:00PM - 4:30PM', '4:30PM - 5:00PM',
      ] as any,
      availabilityChanged: false,
      pendingMeetAndGreetAdminShowing: false,
      myMeetAndGreetsAdminShowing: false,
      myCalendarShowing: false,
      employeeProfileShowing: true,
      userAuthenticated: false,
      newUser: false,
      userNotAnEmployee: false,
      userLoading: true,
    };
  },
  props: {
    userInfo: Object as any,
  },
  async mounted() {
  },
  methods: {
    showEmployeeProfile() {
      this.hideAllAdminComponents();
      this.employeeProfileShowing = true;
    },
    showPendingMeetAndGreetAdmin() {
      this.hideAllAdminComponents();
      this.pendingMeetAndGreetAdminShowing = true;
    },
    showMyCalendar() {
      this.hideAllAdminComponents();
      this.myCalendarShowing = true;
    },
    showMyMeetAndGreetsAdmin() {
      this.hideAllAdminComponents();
      this.myMeetAndGreetsAdminShowing = true;
    },
    hideAllAuthentication() {
      this.newUser = false;
      this.userAuthenticated = false;
      this.userNotAnEmployee = false;
      this.userLoading = false;
    },
    hideAllAdminComponents() {
      this.myCalendarShowing = false;
      this.pendingMeetAndGreetAdminShowing = false;
      this.myMeetAndGreetsAdminShowing = false;
      this.employeeProfileShowing = false;
    },
  },
  components: { AdminCalendar, AdminNavBar, PendingMeetAndGreets, MyMeetAndGreets, FirebaseAuth, LoadingCircle, UserProfile }
}
</script>
  
<style scoped lang="scss">

$color: #66f;

h1, input::-webkit-input-placeholder, button {
  transition: all 0.3s ease-in-out;
}

.newUserContainer {
  margin:auto;
  margin-top: 15vh;
  box-sizing: border-box;
  width: 85vw;
  box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.2);
  padding-bottom: 40px;
  border-radius: 20px;
  h1 {
    box-sizing: border-box;
    padding: 20px;
  }
}

form {
  margin:auto;
  margin-top: 5vh;
  box-sizing: border-box;
  width: 85vw;
  box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.2);
  padding-bottom: 40px;
  border-radius: 20px;
  h1 {
    box-sizing: border-box;
    padding: 20px;
  }
}

input {
  text-align: center;
  margin-left: 20%;
  width: 60%;
  display: block;
  border: none;
  padding: 10px 0;
  border-bottom: solid 1px $color;
  transition: all 0.3s cubic-bezier(.64,.09,.08,1);
  background: linear-gradient(to bottom, rgba(255,255,255,0) 96%, $color 4%);
  background-repeat: no-repeat;
  color: darken($color, 20%);
  &:focus, &:valid {
    box-shadow: none;
    outline: none;
    background-position: 0 0;
    &::-webkit-input-placeholder {
      color: $color;
      font-size: 11px;
      visibility: visible !important;
    }
  }
}

button {
  border-color: #66f;
  background-color: #66f;
  box-shadow: 0px 5px 20px #66f;
  color: #fff;
  margin: 1vw;
  border-style: solid;
  padding: 1.5vw;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  border-radius: 45px;
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
  &:hover {
    transform: translateY(-7px);
  }
  &:disabled {
    background-color: grey;
    border-style: solid;
    border-color: grey;
    cursor: auto;
    transform: none;
    box-shadow: none;
  }
}

</style>
