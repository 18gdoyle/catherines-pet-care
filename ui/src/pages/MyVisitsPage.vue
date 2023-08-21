<template>
    <div class="myVisitsContainer">
      <button :class="{selected: recurringShowing}" @click="showRecurringVisits">Show Recurring Visits</button>
      <button :class="{selected: !recurringShowing}" @click="showOneOffVisits">Show One-Off Visits</button>
      <WeekDayCalendar
          v-if="(Object.keys(availabilityArray).length !== 0) && recurringShowing"
          @appointments="updateAppointmentsArray"
          :availabilityArray="availabilityArray"
          :importedRecurringVisits="importedRecurringVisits"
          :editable="false"
      ></WeekDayCalendar>
      <Calendar
          v-if="(Object.keys(availabilityArray).length !== 0 && !recurringShowing)"
          @appointments="updateAppointmentsArray"
          :availabilityArray="availabilityArray"
          :importedOneOffVisits="importedOneOffVisits"
          :importedRecurringVisits="importedRecurringVisits"
          :editable="false"
      ></Calendar>
      <button @click="$emit('show-visit-scheduler')">Click here to update visit schedule</button>
    </div>
</template>

<script lang="ts">
  import WeekDayCalendar from '@/components/WeekDayCalendar.vue';
  import Calendar from '@/components/Calendar.vue';
  import * as recurringVisits from '@/services/recurringVisits'
  import * as oneOffVisits from '@/services/oneOffVisits'
	export default {
    props: {
        userInfo: Object as any,
    },
    data() {
        return {
            weekDayAppointmentArray: {} as any,
            availabilityArray: {},
            appointmentArray: [],
            oneOffAppointmentArray: [],
            importedRecurringVisits: [] as any,
            importedOneOffVisits: [] as any,
            recurringShowing: true,
        };
    },
    methods: {
      updateAppointmentsArray(appointmentArray: []) {
          this.appointmentArray = appointmentArray;
      },
      showRecurringVisits() {
        this.recurringShowing = true;
      },
      showOneOffVisits() {
        this.recurringShowing = false;
      }
    },
    async mounted() {
        let data = await recurringVisits.getRecurringVisitsForCustomer(this.userInfo.accessToken, this.userInfo.email);

        if (data.length === 0) {
          this.weekDayAppointmentArray = {};
        } else {
          this.weekDayAppointmentArray = data[0].visits;
        }
        
        for (const weekDay in this.weekDayAppointmentArray) {
          if (this.weekDayAppointmentArray[weekDay].breakfastVisit.requested) {
            this.importedRecurringVisits.push(weekDay + ' Breakfast Visit');
          }
          if (this.weekDayAppointmentArray[weekDay].lunchVisit.requested) {
            this.importedRecurringVisits.push(weekDay + ' Lunch Visit');
          } 
          if (this.weekDayAppointmentArray[weekDay].dinnerVisit.requested) {
            this.importedRecurringVisits.push(weekDay + ' Dinner Visit');
          }
          if (this.weekDayAppointmentArray[weekDay].nightVisit.requested) {
            this.importedRecurringVisits.push(weekDay + ' Night Visit');
          }
        }
        
        let nineToFiveArray = [
            "Breakfast Visit",
            "Lunch Visit",
            "Dinner Visit",
            "Night Visit"
        ]
        this.availabilityArray = {
            Sun: nineToFiveArray,
            Mon: nineToFiveArray,
            Tue: nineToFiveArray,
            Wed: nineToFiveArray,
            Thu: nineToFiveArray,
            Fri: nineToFiveArray,
            Sat: nineToFiveArray,
        }

        data = await oneOffVisits.getOneOffVisitsForCustomer(this.userInfo.accessToken, this.userInfo.email)

        if (data.length === 0) {
          this.importedOneOffVisits = [];
          return;
        }

        let tempArray = [];
        for (const date in data[0].visits) {
          for (const time in data[0].visits[date]) {
            if (data[0].visits[date][time].requested) {
              if (time === 'breakfastVisit') {
                tempArray.push(date + ', ' + 'Breakfast Visit');
              } else if (time === 'lunchVisit') {
                tempArray.push(date + ', ' + 'Lunch Visit');
              } else if (time === 'dinnerVisit') {
                tempArray.push(date + ', ' + 'Dinner Visit');
              } else if (time === 'nightVisit') {
                tempArray.push(date + ', ' + 'Night Visit');
              }
            }
          }
        }

        this.importedOneOffVisits = tempArray;
    },
    components: { WeekDayCalendar, Calendar }
}
</script>
  
<style scoped lang="scss">

.myVisitsContainer {
    text-align: center;
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

</style>
