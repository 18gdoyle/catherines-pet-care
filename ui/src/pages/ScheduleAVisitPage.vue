<template>
    <div class="container">
        <div v-if="scheduleSelectorShowing">
            <div class="textBox">
            <p>Select the times and dates you would like to have visits scheduled for.</p>
            <p>If you want to schedule a recurring visit, simply select the times for the week you want visits to begin.
                We'll take care of the rest.
            </p>
            </div>
            <hr />
            <div class="textBox">
                <h4>I would like these vists to happen every week</h4>
                <button :class="{selected: recurring}" @click="(recurring=true)">
                  YES
                </button>
                <button :class="{selected: !recurring}" @click="(recurring=false)">
                  NO
                </button>
            </div>
            <br />
            <Calendar
                v-if="(Object.keys(availabilityArray).length !== 0 && !recurring)"
                @appointments="updateAppointmentsArray"
                :availabilityArray="availabilityArray"
                :importedOneOffVisits="importedOneOffVisits"
                :importedRecurringVisits="importedRecurringVisits"
                :disableBefore=259200
                :editable="true"
                :oneOffEditingMode="true"
            ></Calendar>
            <WeekDayCalendar
                v-if="(Object.keys(availabilityArray).length !== 0 && recurring)"
                @appointments="updateAppointmentsArray"
                :availabilityArray="availabilityArray"
                :importedRecurringVisits="importedRecurringVisits"
                :editable="true"
            ></WeekDayCalendar>
            <div class="textBox">
                <br />
                <button @click="showSubmissionReview">NEXT</button>
            </div>
        </div>
        <div v-if="submissionReviewShowing">
            <div class="textBox">
                <b>
                <div v-if="recurring">
                    You have selected to have these visits scheduled for every week
                </div>
                <div v-if="!recurring">
                    You have selected to have these visits only for these specific dates.
                </div>
                </b>
            </div>
            <div v-for="(value, key) in formattedAppointmentObject">
              <span><b>{{key}}: </b></span>
              <span v-if="value.breakfastVisit.requested">Breakfast Visit</span>
              <span v-if="value.lunchVisit.requested"><span v-if="value.breakfastVisit.requested">, </span>Lunch Visit</span>
              <span v-if="value.dinnerVisit.requested"><span v-if="(value.breakfastVisit.requested || value.lunchVisit.requested)">, </span>Dinner Visit</span>
              <span v-if="value.nightVisit.requested"><span v-if="(value.breakfastVisit.requested || value.lunchVisit.requested || value.dinnerVisit.requested)">, </span>Night Visit</span>
              <span v-if="(!value.breakfastVisit.requested && !value.lunchVisit.requested && !value.dinnerVisit.requested && !value.nightVisit.requested)">No Visits Scheduled</span>
            </div>

            <div class="backOrSubmitContainer">
              <div class="backButton">
                <button @click="backToScheduler">Back</button>
              </div>

              <div class="submitButton">
                  <button class="submit" @click="submit">Submit</button>
              </div>
            </div>
            
        </div>
        <div v-if="confirmationShowing">
            <div class="textBox">
                Thank You
            </div>
        </div>
    </div> 
</template>

<script lang="ts">
import Calendar from '@/components/Calendar.vue';
import WeekDayCalendar from '@/components/WeekDayCalendar.vue'
import * as recurringVisits from '@/services/recurringVisits'
import * as oneOffVisits from '@/services/oneOffVisits'
import * as employeeRecurringVisits from '@/services/employeeRecurringVisits'
import * as employeeOneOffVisits from '@/services/employeeOneOffVisits'

	export default {
    props: {
        userInfo: Object as any,
    },
    data() {
        return {
            availabilityArray: {},
            appointmentArray: [] as string[],
            formattedAppointmentObject: {} as any,
            importedRecurringVisits: [] as any,
            importedOneOffVisits: [] as any,
            weekDayAppointmentArray: {} as any,
            oneOffAppointmentArray: {} as any,
            recurring: true,
            scheduleSelectorShowing: true,
            submissionReviewShowing: false,
            confirmationShowing: false,
            cachedEmployeeRecurringVisits: {} as any,
            cachedEmployeeOneOffVisits: {} as any,
        };
    },
    methods: {
        async loadCalendar() {
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
          
          data = await oneOffVisits.getOneOffVisitsForCustomer(this.userInfo.accessToken, this.userInfo.email);

          if (data.length === 0) {
            this.oneOffAppointmentArray = {};
          } else {
            this.oneOffAppointmentArray = data[0].visits;
          }

          for (const date in this.oneOffAppointmentArray) {
            if (this.oneOffAppointmentArray[date].breakfastVisit.requested) {
              this.importedOneOffVisits.push(date + ', ' + 'Breakfast Visit');
            }
            if (this.oneOffAppointmentArray[date].lunchVisit.requested) {
              this.importedOneOffVisits.push(date + ', ' + 'Lunch Visit');
            } 
            if (this.oneOffAppointmentArray[date].dinnerVisit.requested) {
              this.importedOneOffVisits.push(date + ', ' + 'Dinner Visit');
            }
            if (this.oneOffAppointmentArray[date].nightVisit.requested) {
              this.importedOneOffVisits.push(date + ', ' + 'Night Visit');
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
        },
        updateAppointmentsArray(appointmentArray: []) {
            this.appointmentArray = appointmentArray;
        },
        showSubmissionReview() {
          this.scheduleSelectorShowing = false;
          this.formattedAppointmentObject = {};
          if (this.recurring) {
            let daysOfWeekArray = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

            for (let i = 0; i < daysOfWeekArray.length; i++) {
              this.formattedAppointmentObject[daysOfWeekArray[i]] = {
                breakfastVisit: {
                  requested: false,
                  assignedTo: null,
                },
                lunchVisit: {
                  requested: false,
                  assignedTo: null,
                },
                dinnerVisit: {
                  requested: false,
                  assignedTo: null,
                },
                nightVisit: {
                  requested: false,
                  assignedTo: null,
                },
              }
            }

            for (let i = 0; i < this.appointmentArray.length; i++) {
              let appSplit = this.appointmentArray[i].split(' ');
              let dayOfWeek = appSplit[0];
              let visitType = appSplit[1] + ' ' + appSplit[2];

              if (visitType === 'Breakfast Visit') {
                this.formattedAppointmentObject[dayOfWeek].breakfastVisit.requested = true;
                if (this.weekDayAppointmentArray && this.weekDayAppointmentArray[dayOfWeek]) {
                  this.formattedAppointmentObject[dayOfWeek].breakfastVisit.assignedTo = this.weekDayAppointmentArray[dayOfWeek].breakfastVisit.assignedTo;
                }
              } else if (visitType === 'Lunch Visit') {
                this.formattedAppointmentObject[dayOfWeek].lunchVisit.requested = true;
                if (this.weekDayAppointmentArray && this.weekDayAppointmentArray[dayOfWeek]) {
                  this.formattedAppointmentObject[dayOfWeek].lunchVisit.assignedTo = this.weekDayAppointmentArray[dayOfWeek].lunchVisit.assignedTo;
                }
              } else if (visitType === 'Dinner Visit') {
                this.formattedAppointmentObject[dayOfWeek].dinnerVisit.requested = true;
                if (this.weekDayAppointmentArray && this.weekDayAppointmentArray[dayOfWeek]) {
                  this.formattedAppointmentObject[dayOfWeek].dinnerVisit.assignedTo = this.weekDayAppointmentArray[dayOfWeek].dinnerVisit.assignedTo;
                }
              } else if (visitType === 'Night Visit') {
                this.formattedAppointmentObject[dayOfWeek].nightVisit.requested = true;
                if (this.weekDayAppointmentArray && this.weekDayAppointmentArray[dayOfWeek]) {
                  this.formattedAppointmentObject[dayOfWeek].nightVisit.assignedTo = this.weekDayAppointmentArray[dayOfWeek].nightVisit.assignedTo;
                }
              }
            }
          } else {
            for (let i = 0; i < this.appointmentArray.length; i++) {
              let appSplit = this.appointmentArray[i].split(', ');
              let date = appSplit[0];
              if (!this.formattedAppointmentObject[date]) {
                this.formattedAppointmentObject[date] = {
                  breakfastVisit: {
                    requested: false,
                    assignedTo: null,
                  },
                  lunchVisit: {
                    requested: false,
                    assignedTo: null,
                  },
                  dinnerVisit: {
                    requested: false,
                    assignedTo: null,
                  },
                  nightVisit: {
                    requested: false,
                    assignedTo: null,
                  },
                }
              }

              if (appSplit[1] === 'Breakfast Visit') {
                this.formattedAppointmentObject[date].breakfastVisit.requested = true;
                if (this.oneOffAppointmentArray && this.oneOffAppointmentArray[date]) {
                  this.formattedAppointmentObject[date].breakfastVisit.assignedTo = this.oneOffAppointmentArray[date].breakfastVisit.assignedTo;
                }
              } else if (appSplit[1] === 'Lunch Visit') {
                this.formattedAppointmentObject[date].lunchVisit.requested = true;
                if (this.oneOffAppointmentArray && this.oneOffAppointmentArray[date]) {
                  this.formattedAppointmentObject[date].lunchVisit.assignedTo = this.oneOffAppointmentArray[date].lunchVisit.assignedTo;
                }
              } else if (appSplit[1] === 'Dinner Visit') {
                this.formattedAppointmentObject[date].dinnerVisit.requested = true;
                if (this.oneOffAppointmentArray && this.oneOffAppointmentArray[date]) {
                  this.formattedAppointmentObject[date].dinnerVisit.assignedTo = this.oneOffAppointmentArray[date].dinnerVisit.assignedTo;
                }
              } else if (appSplit[1] === 'Night Visit') {
                this.formattedAppointmentObject[date].nightVisit.requested = true;
                if (this.oneOffAppointmentArray && this.oneOffAppointmentArray[date]) {
                  this.formattedAppointmentObject[date].nightVisit.assignedTo = this.oneOffAppointmentArray[date].nightVisit.assignedTo;
                }
              }
            }
          }
          
          this.submissionReviewShowing = true;
        }, 
        async submit() {
          let visitInfo = {
            email: this.userInfo.email,
            address: this.userInfo.address,
            firstName: this.userInfo.displayName.split(' ')[0],
            lastName: this.userInfo.displayName.split(' ')[1],
            cell: this.userInfo.cell,
            visits: this.formattedAppointmentObject
          };

          if (this.recurring) {
            for (const weekDay in visitInfo.visits) {
              let visitTimes = ['breakfastVisit', 'lunchVisit', 'dinnerVisit', 'nightVisit'];
              for (let i = 0; i < visitTimes.length; i++) {
                if (visitInfo.visits[weekDay][visitTimes[i]].assignedTo === null && this.weekDayAppointmentArray[weekDay] && this.weekDayAppointmentArray[weekDay][visitTimes[i]].assignedTo !== null) {
                  let employeeRecurringVisitsObject = await this.getEmployeesRecurringVisits(this.weekDayAppointmentArray[weekDay][visitTimes[i]].assignedTo);
                  delete employeeRecurringVisitsObject.visits[weekDay][visitTimes[i]][this.userInfo.email];
                }
              }
            }

            for (const employeeEmail in this.cachedEmployeeRecurringVisits) {
              try {
                await employeeRecurringVisits.upsertEmployeeRecurringVisit(this.cachedEmployeeRecurringVisits[employeeEmail])
              } catch (error) {
                console.dir(error);
                return;
              }
            }

            try {
              await recurringVisits.upsertRecurringVisit(visitInfo);
            } catch (error) {
              console.dir(error);
              return;
            }

          } else if (!this.recurring) {
            debugger;
            for (const date in visitInfo.visits) {
              let visitTimes = ['breakfastVisit', 'lunchVisit', 'dinnerVisit', 'nightVisit'];
              for (let i = 0; i < visitTimes.length; i++) {
                if (visitInfo.visits[date][visitTimes[i]].assignedTo === null && this.oneOffAppointmentArray[date] && this.oneOffAppointmentArray[date][visitTimes[i]].assignedTo !== null) {
                  let employeeOneOffVisitsObject = await this.getEmployeesOneOffVisits(this.oneOffAppointmentArray[date][visitTimes[i]].assignedTo);
                  delete employeeOneOffVisitsObject.visits[date][visitTimes[i]][this.userInfo.email];
                }
              }
            }

            for (const employeeEmail in this.cachedEmployeeRecurringVisits) {
              try {
                await employeeRecurringVisits.upsertEmployeeRecurringVisit(this.cachedEmployeeRecurringVisits[employeeEmail])
              } catch (error) {
                console.dir(error);
                return;
              }
            }
            
            try {
              await oneOffVisits.createOneOffVisits(visitInfo);
            } catch (error) {
              console.dir(error);
              return;
            }
          }

          this.submissionReviewShowing = false;
          this.confirmationShowing = true;            
        },
        async getEmployeesRecurringVisits(employeeEmail: string) {
          if (this.cachedEmployeeRecurringVisits[employeeEmail]) {
            return this.cachedEmployeeRecurringVisits[employeeEmail];
          }

          let data = await employeeRecurringVisits.getEmployeeRecurringVisitsForCustomer(this.userInfo.accessToken, this.userInfo.email, employeeEmail);
          let employeeRecurringVisitsObject = data[0];
          this.cachedEmployeeRecurringVisits[employeeRecurringVisitsObject.email] = employeeRecurringVisitsObject;
          return this.cachedEmployeeRecurringVisits[employeeRecurringVisitsObject.email];
        },
        async getEmployeesOneOffVisits(employeeEmail: string) {
          if (this.cachedEmployeeOneOffVisits[employeeEmail]) {
            return this.cachedEmployeeOneOffVisits[employeeEmail];
          }

          let data = await employeeOneOffVisits.getEmployeeOneOffVisitsForCustomer(this.userInfo.accessToken, this.userInfo.email, employeeEmail);
          let employeeOneOffVisitsObject = data[0];
          this.cachedEmployeeOneOffVisits[employeeOneOffVisitsObject.email] = employeeOneOffVisitsObject;
          return this.cachedEmployeeOneOffVisits[employeeOneOffVisitsObject.email];
        },
        backToScheduler() {
          this.submissionReviewShowing = false;
          this.scheduleSelectorShowing = true;
          if (!this.recurring) {
            this.importedOneOffVisits = this.appointmentArray
          }
        }
    },
    mounted() {
        this.loadCalendar();
    },
    components: { Calendar, WeekDayCalendar }
}
</script>
  
<style scoped lang="scss">

.textBox {
    text-align: center;
}
.container {
    padding: 2vw;
    margin: auto;
    margin-top: 15vh;
    margin-bottom: 5vh;
    box-sizing: border-box;
    width: 90vw;
    padding-bottom: 2vh;
    box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.2);
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

.backButton {
  text-align: left;
}
.submitButton {
    text-align: right;
}

.backOrSubmitContainer {
  display: flex;
  width: 100%;
  justify-content: space-between;
}

</style>
