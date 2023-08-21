<template>
  <div class="pendingMeetAndGreetsContainer">
    <PopUp
      v-if="popUpShowing"
      :appointment="selectedAppointment"
      :meetAndGreetScheduled="meetAndGreetScheduled"
      @pop-up-confirm="approveMeetAndGreet(currentAppointmentObject.appointmentInfo, currentAppointmentObject.selectedDateAndTime, currentAppointmentObject.index)"
      @pop-up-cancel="closePopUp"
      @pop-up-close="closePopUp"
    ></PopUp>
    <br />
    <div v-if="pendingAppointments.length === 0" class="textBlock">
      Looks like there are no meet and greets to pick up
    </div>
    <div class="container">
      <div class="card" v-for="(appointment, index) in pendingAppointments">
        <div class="card-body">
          <p>
            <b>Name:</b> {{appointment.firstName}} {{appointment.lastName}}
            <br />
            <b>Address:</b> {{appointment.address}}
            <br />
            <b>E-Mail:</b> {{appointment.email}}
            <br />
            <b>Cell:</b> {{appointment.cell}}
            <br />
            <b>Appointments:</b> 
            <div v-for="(dateAndTime, i) in appointment.appointments">
              <span class="tag tag-purple" @click="confirmPickup(appointment, dateAndTime, index)">{{dateAndTime}}</span>
            </div>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import * as meetAndGreets from '../../services/greetAppointments'
import PopUp from '../popup/PendingGreetPopUp.vue'
	export default {
    props: {
        employeeInfo: Object as any
    },
    data() {
        return {
            pendingAppointments: [] as any,
            popUpShowing: false,
            selectedAppointment: {} as any,
            currentAppointmentObject: {} as any,
            meetAndGreetScheduled: false,
        };
    },
    methods: {
        async approveMeetAndGreet(appointmentInfo: any, selectedDateAndTime: any, index: number) {
            try {
                let greetAppointmentData = {
                    "email": appointmentInfo.email,
                    "address": appointmentInfo.address,
                    "firstName": appointmentInfo.firstName,
                    "lastName": appointmentInfo.lastName,
                    "appointment": selectedDateAndTime,
                    "assignedEmployee": this.employeeInfo.email,
                    "assignedEmployeeName": this.employeeInfo.displayName,
                    "cell": appointmentInfo.cell,
                };
                await meetAndGreets.createApprovedGreetAppointment(greetAppointmentData);
            }
            catch (error) {
              console.dir(error);
              return;
            }
            try {
              await meetAndGreets.deletePendingGreetAppointmentById(appointmentInfo._id);
              this.pendingAppointments.splice(index, 1);
            }
            catch (error) {
              console.dir(error);
              return;
            }

            this.meetAndGreetScheduled = true;
        },
        confirmPickup(appointmentInfo: any, selectedDateAndTime: any, index: number) {
          this.currentAppointmentObject = {
            appointmentInfo: appointmentInfo,
            selectedDateAndTime: selectedDateAndTime,
            index: index
          }
          this.selectedAppointment = {
            "email": appointmentInfo.email,
            "address": appointmentInfo.address,
            "firstName": appointmentInfo.firstName,
            "lastName": appointmentInfo.lastName,
            "appointment": selectedDateAndTime,
            "assignedEmployee": this.employeeInfo.email,
            "assignedEmployeeName": this.employeeInfo.displayName,
            "cell": appointmentInfo.cell
          };
          this.popUpShowing = true;
        },
        closePopUp() {
          this.selectedAppointment = {};
          this.currentAppointmentObject = {};
          this.popUpShowing = false;
          this.meetAndGreetScheduled = false;
        }
    },
    async mounted() {
        this.pendingAppointments = await meetAndGreets.getAllPendingGreetAppointments();
    },
    components: { PopUp }
}
</script>
  
<style scoped lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
* {
  box-sizing: border-box;
}

.textBlock {
  text-align: center;
}

.pendingMeetAndGreetsContainer {
  padding: 2vw;
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

.container {
  width: 100%;
  margin: 0;
  display: inline-flex;
  flex-wrap: wrap;
  justify-content: center;
}
.card {
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
}
.card-header img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: 250px;
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

.card-body p {
  font-size: 13px;
  margin: 0 0 40px;
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
</style>
