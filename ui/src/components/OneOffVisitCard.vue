<template>
  <PickUpOneOffVisitsPopUp
    v-if="popUpShowing"
    :appointment="oneOffAppointment"
    :employeeInfo="employeeInfo"
    @pop-up-cancel="closePopUp"
    @pop-up-close="closePopUp"
  ></PickUpOneOffVisitsPopUp>
  <div class="oneOffAppointment-card">
      <div class="oneOffAppointment-card-body">
        <p>
          <h3><u>One Off Visit</u></h3>
          <b>Client Name:</b> {{oneOffAppointment.firstName}} {{oneOffAppointment.lastName}}
          <br />
          <b>Client Address:</b> {{oneOffAppointment.address}}
          <br />
          <b>Client E-Mail:</b> {{oneOffAppointment.email}}
          <br />
          <b>Client Cell:</b> {{oneOffAppointment.cell}}
          <br />
          <b>Requested Visits:</b> 
          <br />
          <div v-for="(value, key) in oneOffAppointment.visits">
            <span><b>&emsp;{{key}}: </b></span>
            <span v-if="value.breakfastVisit.requested">Breakfast Visit</span>
            <span v-if="value.lunchVisit.requested"><span v-if="value.breakfastVisit.requested">, </span>Lunch Visit</span>
            <span v-if="value.dinnerVisit.requested"><span v-if="(value.breakfastVisit.requested || value.lunchVisit.requested)">, </span>Dinner Visit</span>
            <span v-if="value.nightVisit.requested"><span v-if="(value.breakfastVisit.requested || value.lunchVisit.requested || value.dinnerVisit.requested)">, </span>Night Visit</span>
            <span v-if="(!value.breakfastVisit.requested && !value.lunchVisit.requested && !value.dinnerVisit.requested && !value.nightVisit.requested)">No Visits Scheduled</span>
          </div>
        </p>
        <br />
        <div class="buttonDiv">
          <button type="button" @click="popUpShowing=true">Pick Up Visits</button>
        </div>
      </div>
  </div>
</template>

<script lang="ts">
  import PickUpOneOffVisitsPopUp from './popup/PickUpOneOffVisitsPopUp.vue';
	export default {
    props: {
      oneOffAppointment: Object as any,
      employeeInfo: Object as any,
    },
    data() {
      return {
        popUpShowing: false,
        customerApproved: false,
      }
    },
    methods: {
      closePopUp() {
        this.popUpShowing = false;
      }
    },
    mounted () {
    },
    components: { PickUpOneOffVisitsPopUp }
  }
</script>
  
<style scoped lang="scss">

@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
* {
  box-sizing: border-box;
}
.oneOffAppointment-card {
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
}
.oneOffAppointment-card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 5%;
  min-height: 250px;
}

h3, p {
  margin: 1%;
}

.tag {
  background: #cccccc;
  border-radius: 50px;
  font-size: 12px;
  margin: 0;
  color: #fff;
  padding: 2px 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
}
.tag-teal {
  background-color: #47bcd4;
}
.tag-purple {
  background-color: #66f;
}
.tag-pink {
  background-color: #cd5b9f;
}

.oneOffAppointment-card-body p {
  font-size: 13px;
}
.user {
  display: flex;
  margin-top: auto;
}

.user img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.user-info h5 {
  margin: 0;
}
.user-info small {
  color: #545d7a;
}

.buttonDiv {
  width: 100%;
  bottom: 10px;
  display: flex;
  justify-content: right;
}

button {
    border-color: #66f;
    background-color: #66f;
    box-shadow: 0px 5px 20px #66f;
    color: #fff;
    border-style: solid;
    padding: .5vw;
    font-size: 12px;
    text-transform: uppercase;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    letter-spacing: 2.5px;
    font-weight: 500;
    border-radius: 45px;
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
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
