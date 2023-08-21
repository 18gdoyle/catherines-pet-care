<template>
  <div id="popup1" class="overlay">
    <div class="popup" >
      <div class="content" v-if="!loading">
        <div class="popupCloseBlock" >
          <a @click="$emit('pop-up-close')" class="popupClose">&times;</a>
        </div>
        <div v-for="(visitDateInfo, visitDate) in editableAppointment.visits" class="weekDayDiv">
          <div class="weekDayLabel">
            {{ visitDate }}: 
          </div>
          <button 
            :class="{selected: editableAppointment.visits[visitDate].breakfastVisit.assignedTo === employeeInfo.email}" class="timeButton" 
            v-if="editableAppointment.visits[visitDate].breakfastVisit.requested
            && (editableAppointment.visits[visitDate]!.breakfastVisit.assignedTo === null 
            || editableAppointment.visits[visitDate]!.breakfastVisit.assignedTo === employeeInfo.email)"
            @click="assignVisit(visitDate.toString(), 'breakfastVisit')"
          >Breakfast Visit</button>
          <button 
            :class="{selected: editableAppointment.visits[visitDate].lunchVisit.assignedTo === employeeInfo.email}" class="timeButton" 
            v-if="editableAppointment.visits[visitDate].lunchVisit.requested
            && (editableAppointment.visits[visitDate]!.lunchVisit.assignedTo === null 
            || editableAppointment.visits[visitDate]!.lunchVisit.assignedTo === employeeInfo.email)"
            @click="assignVisit(visitDate.toString(), 'lunchVisit')"
          >Lunch Visit</button>
          <button 
            :class="{selected: editableAppointment.visits[visitDate].dinnerVisit.assignedTo === employeeInfo.email}" class="timeButton" 
            v-if="editableAppointment.visits[visitDate].dinnerVisit.requested
            && (editableAppointment.visits[visitDate]!.dinnerVisit.assignedTo === null 
            || editableAppointment.visits[visitDate]!.dinnerVisit.assignedTo === employeeInfo.email)"
            @click="assignVisit(visitDate.toString(), 'dinnerVisit')"
          >Dinner Visit</button>
          <button 
            :class="{selected: editableAppointment.visits[visitDate].nightVisit.assignedTo === employeeInfo.email}" class="timeButton" 
            v-if="editableAppointment.visits[visitDate].nightVisit.requested
            && (editableAppointment.visits[visitDate]!.nightVisit.assignedTo === null 
            || editableAppointment.visits[visitDate]!.nightVisit.assignedTo === employeeInfo.email)"
            @click="assignVisit(visitDate.toString(), 'nightVisit')"
          >Night Visit</button>
        </div>
      </div>
      <div class="submitButton">
          <button @click="submitVisitPickUp">Submit</button>
      </div>
    </div>
    <LoadingCircle
        v-if="loading"
    ></LoadingCircle>
  </div>
</template>

<script lang="ts">
    import LoadingCircle from '../LoadingCircle.vue';
    import * as oneOffVisits from '@/services/oneOffVisits'
    import * as employeeOneOffVisits from '@/services/employeeOneOffVisits'

	export default {
    props: {
        appointment: Object as any,
        employeeInfo: Object as any,
    },
    data() {
        return {
            loading: false,
            editableAppointment: {} as any,
            editableEmployeeSchedule: {} as any,
            weekDayArray: [
                {full: 'Sunday', short: 'Sun'}, 
                {full: 'Monday', short: 'Mon'}, 
                {full: 'Tuesday', short: 'Tue'}, 
                {full: 'Wednesday', short: 'Wed'}, 
                {full: 'Thursday', short: 'Thu'},
                {full: 'Friday', short: 'Fri'},
                {full: 'Saturday', short: 'Sat'}
            ]
        };
    },
    methods: {
      assignVisit(date: string, visit: string) {
        this.updateCustomerAppointmentObject(date, visit);
        this.updateEmployeeScheduleObject(date, visit);
      },
      updateCustomerAppointmentObject(date: string, visit: string) {
        if (this.editableAppointment.visits[date][visit].assignedTo !== null) {
          this.editableAppointment.visits[date][visit].assignedTo = null;
          return;
        }

        this.editableAppointment.visits[date][visit].assignedTo = this.employeeInfo.email;
      },
      updateEmployeeScheduleObject(date: string, visit: string) {
        if (this.editableEmployeeSchedule.visits !== undefined && this.editableEmployeeSchedule.visits[date] && this.editableEmployeeSchedule.visits[date][visit] && this.editableEmployeeSchedule.visits[date][visit][this.editableAppointment.email]) {
          delete this.editableEmployeeSchedule.visits[date][visit][this.editableAppointment.email];
          console.dir(this.editableEmployeeSchedule);
          return;
        }

        if (!this.editableEmployeeSchedule.visits[date]) {
          let visitSchedule = {
            breakfastVisit: {},
            lunchVisit: {},
            dinnerVisit: {},
            nightVisit: {}
          }
          this.editableEmployeeSchedule.visits[date] = {...visitSchedule};
        }

        console.dir(this.editableEmployeeSchedule);
        
        this.editableEmployeeSchedule.visits[date][visit] = {
          [this.editableAppointment.email]: {
            firstName: this.editableAppointment.firstName,
            lastName: this.editableAppointment.lastName,
            address: this.editableAppointment.address,
            cell: this.editableAppointment.cell,
            email: this.editableAppointment.email
          }
        }
      },
      async submitVisitPickUp() {
        try {
          await oneOffVisits.createOneOffVisits(this.editableAppointment);
        } catch (error) {
          console.dir(error);
          return;
        }

        try {
          await employeeOneOffVisits.upsertEmployeeOneOffVisit(this.editableEmployeeSchedule);
        } catch (error) {
          console.dir(error);
          return;
        }
      }
    },
    async beforeMount() {
      this.editableAppointment = this.appointment;

      let data = await employeeOneOffVisits.getEmployeeOneOffVisits(this.employeeInfo.accessToken, this.employeeInfo.email);
      if (data && data[0]) {
        this.editableEmployeeSchedule = data[0];
        if (this.editableEmployeeSchedule.visits === undefined) {
          this.editableEmployeeSchedule.visits = {};
        }
        return;
      }

      let nameArray = this.employeeInfo.displayName.split(' ');
      this.editableEmployeeSchedule = {
        address: this.employeeInfo.address,
        cell: this.employeeInfo.cell,
        email: this.employeeInfo.email,
        firstName: nameArray[0],
        lastName: nameArray[1],
        visits: {}
      };
    },
    components: { LoadingCircle }
}
</script>
  
<style scoped lang="scss">

.overlay {
    z-index: 10;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 100ms;
}

.popup {
  margin: auto;
  margin-top: 10vh;
  padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 20px;
  background: #fff;
  border-radius: 5px;
  width: 60%;
  position: relative;
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}

@media screen and (max-width: 700px){
  .box{
    width: 70%;
  }
  .popup{
    width: 70%;
  }
}

.popupCloseBlock{
    display: flex;
    justify-content: right;
}
.popupClose:hover {
  color: #66f;
}

.popupClose{
    cursor: pointer;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: black;
}
.popupClose:hover {
  color: #66f;
}

.confirmationButtons {
    display: flex;
    justify-content: center;
}

$primary: #8cc63e;
$checkmarkColor: white;
$checkmarkFat: 3px;

.circle {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: auto;
  position: relative;
  background: $primary;
  border-radius: 50%;
  width: 5vw;
  height: 5vw;
  min-width: 80px;
  min-height: 80px;
}

.circle-red {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: auto;
  position: relative;
  background: red;
  border-radius: 50%;
  width: 5vw;
  height: 5vw;
  min-width: 80px;
  min-height: 80px;
}

#icon {
  color: white;
  font-size: xx-large;
  margin: auto;
  display: flex;
  justify-content: center;
}

button {
  border-style: solid;
  border-color: grey;
  margin: 1vw;
  padding: 1.5vw;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  font-weight: 500;
  color: #000;
  background-color: #fff;
  border-radius: 45px;
  box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease 0s;
  cursor: pointer;
  outline: none;
}

button.selected, button.submit {
  border-color: #66f;
  background-color: #66f;
  box-shadow: 0px 5px 20px #66f;
  color: #fff;
}

button.timeButton {
    font-weight: 500;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    margin-top: 1vh;
    margin-bottom: 1vh;
    letter-spacing: 1px;
    width: 12vw;
    border-radius: 85px;
    max-width: 210px;
    min-width:100px;
}

.weekDayLabel {
    margin-top: auto;
    margin-bottom: auto;
    display: flex;
    justify-content: left;
    width: 15%;
    min-width: fit-content;
}

.weekDayDiv {
    display: flex;
    justify-content: left;
}

.submitButton {
    display: flex;
    justify-content: right;
}

</style>
