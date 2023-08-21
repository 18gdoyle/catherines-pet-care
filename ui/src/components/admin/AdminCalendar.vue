<template>
    <div class="adminCalendarContainer">
        <br />
        <main class="card">
            <section class="card__header">
            <button type="button" @click="backwardOneMonth">&lt;&lt;&lt;</button>
            <h3 class="monthTitle">{{month}} {{year}}</h3>
            <button type="button" @click="forwardOneMonth">>>></button>
            </section>
            <section class="card__body">
            <ul class="card__body--days">
                <li>sun</li>
                <li>mon</li>
                <li>tue</li>
                <li>wed</li>
                <li>thu</li>
                <li>fri</li>
                <li>sat</li>
            </ul>
            <ul class="card__body--dates">
                <li
                    v-for="(day, key) in dateArray"
                    @click="selectDate(day)"
                    :class="{ 
                        active: currentDate.toDateString() === day.fullDate,
                        prev: numberOfPreviousMonthDays > key,
                        next: arrayLengthBeforeRemaining <= key,
                        circle: selectedDate === day.fullDate,
                        circle_purple: day.myAppointments && day.myAppointments.length !== 0
                    }"
                >
                    <span v-if="day.myAppointments && day.myAppointments.length !== 0">{{day.myAppointments.length}}</span>
                    {{day.display}}
                </li>
            </ul>
            </section>
            <div class="card__footer">
                <div class="container">
                    <AppointmentCard v-for="(appointment, i) in selectedDayObject.myAppointments"
                        :appointment="appointment"
                        @pop-up-confirm="deleteCard(i)"
                    ></AppointmentCard>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
  import AppointmentCard from '../AppointmentCard.vue';
  import * as employeeRecurringVisits from '@/services/employeeRecurringVisits'
  import * as greetAppointment from '@/services/greetAppointments'
  import * as employeeOneOffVisits from '@/services/employeeOneOffVisits'
	export default {
    props: {
      employeeInfo: Object as any,
    },
    data() {
      return {
        dateArray: [] as any,
        meetAndGreetAppointments: [] as any,
        recurringVisits: [] as any,
        oneOffVisits: [] as any,
        month: '',
        year: '',
        dayName: '',
        dayNumber: '',
        numberOfPreviousMonthDays: 0,
        arrayLengthBeforeRemaining: 0,
        monthsAhead: 0,
        currentDate: new Date(),
        selectedDayObject: [] as any,
        selectedAvailabilityArray: [] as any,
        selectedDate: null,
        selectedTime: null,
        availabilitySelected: false,
      }
    },
    async mounted() {
      this.meetAndGreetAppointments = await greetAppointment.getEmployeesGreetAppointments(this.employeeInfo.email);

      let data = await employeeRecurringVisits.getEmployeeRecurringVisits(this.employeeInfo.accessToken, this.employeeInfo.email);
      this.recurringVisits = data[0];

      data = await employeeOneOffVisits.getEmployeeOneOffVisits(this.employeeInfo.accessToken, this.employeeInfo.email);
      this.oneOffVisits = data[0];

      this.initCalendar();
    },
    methods: {
      deleteCard(index: number) {
        this.selectedDayObject.myAppointments.splice(index, 1)
      },
      selectDate(day: any) {
        this.selectedDayObject = day;
        this.selectedTime = null;
        this.selectedDate = day.fullDate;
      },
      selectTime(time: any) {
        this.selectedTime = time;
        if (this.selectedAvailabilityArray.includes(this.selectedDate + ', ' + this.selectedTime)) {
          this.selectedAvailabilityArray.splice(this.selectedAvailabilityArray.indexOf(this.selectedDate + ', ' + this.selectedTime), 1);
        } else {
          this.selectedAvailabilityArray.push(this.selectedDate + ', ' + this.selectedTime);
        }
        this.$emit('time-selected', this.selectedAvailabilityArray);
      },
      getMonthString(month: number) {
        const monthNames = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];
        return monthNames[month];
      },
      forwardOneMonth() {
        this.dateArray = [];
        this.monthsAhead++;
        this.initCalendar();
      },
      backwardOneMonth() {
        this.dateArray = [];
        this.monthsAhead--;
        this.initCalendar();
      },
      initCalendar() {
        var date = new Date();
        this.dayName = date.toLocaleDateString('en', { weekday: 'long' })
        this.dayNumber = date.toDateString().split(' ')[2];

        let totMonths = date.getMonth() + this.monthsAhead;
        let monthToShow = totMonths % 12;
        let yearToShow = date.getFullYear() + (Math.floor(totMonths/12))
        this.month = this.getMonthString(monthToShow);
        this.year = yearToShow.toString();

        this.initPrevMonth(yearToShow, monthToShow);

        this.initCurrentMonth(yearToShow, monthToShow);

        this.initNextMonth(yearToShow, monthToShow);
      },
      initPrevMonth(yearToShow: number, monthToShow: number) {
        this.numberOfPreviousMonthDays = new Date(yearToShow, monthToShow, 1).getDay();

        let numOfDaysInPrevMonth = 0;
        if (monthToShow === 0) {
          numOfDaysInPrevMonth = (new Date(yearToShow - 1, 12, 0).getDate());
        } else {
          numOfDaysInPrevMonth = (new Date(yearToShow, monthToShow, 0).getDate());
        }
        numOfDaysInPrevMonth = numOfDaysInPrevMonth - this.numberOfPreviousMonthDays + 1;
        for (let i = 0; i < this.numberOfPreviousMonthDays; i++) {
          if (monthToShow === 0) {
            this.dateArray.push({display: numOfDaysInPrevMonth, fullDate: new Date(yearToShow - 1, 11, numOfDaysInPrevMonth).toDateString()});
          } else {
            this.dateArray.push({display: numOfDaysInPrevMonth, fullDate: new Date(yearToShow, monthToShow - 1, numOfDaysInPrevMonth).toDateString()});
          }
          numOfDaysInPrevMonth++;
        }
      },
      initCurrentMonth(yearToShow: number, monthToShow: number) {
        let numOfDaysInMonth = (new Date(yearToShow, monthToShow + 1, 0).getDate());
        for (let i = 1; i <= numOfDaysInMonth; i++) {
          let dateString = new Date(yearToShow, monthToShow, i).toDateString();
          let dayOfWeek = dateString.split(' ')[0];

          let myAppointments = [] as any;

          for (let i = 0; i < this.meetAndGreetAppointments.length; i++) {
            let appointmentDateString = this.meetAndGreetAppointments[i].appointment.split(',')[0];
            if (dateString === appointmentDateString) {
              myAppointments.push(this.meetAndGreetAppointments[i]);
            }
          }

          if (this.recurringVisits && this.recurringVisits.visits && this.recurringVisits.visits[dayOfWeek]) {
            if (this.recurringVisits.visits[dayOfWeek].breakfastVisit) {
              for (const clientEmail in this.recurringVisits.visits[dayOfWeek].breakfastVisit) {
                let appointmentObject = this.createAppointmentObject(dayOfWeek, clientEmail, 'Breakfast Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.recurringVisits.visits[dayOfWeek].lunchVisit) {
              for (const clientEmail in this.recurringVisits.visits[dayOfWeek].lunchVisit) {
                let appointmentObject = this.createAppointmentObject(dayOfWeek, clientEmail, 'Lunch Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.recurringVisits.visits[dayOfWeek].dinnerVisit) {
              for (const clientEmail in this.recurringVisits.visits[dayOfWeek].dinnerVisit) {
                let appointmentObject = this.createAppointmentObject(dayOfWeek, clientEmail, 'Dinner Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.recurringVisits.visits[dayOfWeek].nightVisit) {
              for (const clientEmail in this.recurringVisits.visits[dayOfWeek].nightVisit) {
                let appointmentObject = this.createAppointmentObject(dayOfWeek, clientEmail, 'Night Visit');
                myAppointments.push(appointmentObject);
              }
            }
          }

          if (this.oneOffVisits && this.oneOffVisits.visits && this.oneOffVisits.visits[dateString]) {
            if (this.oneOffVisits.visits[dateString].breakfastVisit) {
              for (const clientEmail in this.oneOffVisits.visits[dateString].breakfastVisit) {
                let appointmentObject = this.createOneOffAppointmentObject(dateString, clientEmail, 'Breakfast Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.oneOffVisits.visits[dateString].lunchVisit) {
              for (const clientEmail in this.oneOffVisits.visits[dateString].lunchVisit) {
                let appointmentObject = this.createOneOffAppointmentObject(dateString, clientEmail, 'Lunch Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.oneOffVisits.visits[dateString].dinnerVisit) {
              for (const clientEmail in this.oneOffVisits.visits[dateString].dinnerVisit) {
                let appointmentObject = this.createOneOffAppointmentObject(dateString, clientEmail, 'Dinner Visit');
                myAppointments.push(appointmentObject);
              }
            }

            if (this.oneOffVisits.visits[dateString].nightVisit) {
              for (const clientEmail in this.oneOffVisits.visits[dateString].nightVisit) {
                let appointmentObject = this.createOneOffAppointmentObject(dateString, clientEmail, 'Night Visit');
                myAppointments.push(appointmentObject);
              }
            }
          }

          
          this.dateArray.push({
            display: i,
            fullDate: new Date(yearToShow, monthToShow, i).toDateString(),
            myAppointments: myAppointments
          });
        }
      },
      initNextMonth(yearToShow: number, monthToShow: number) {
        this.arrayLengthBeforeRemaining = this.dateArray.length;
        let remainingDays = 7 - (this.dateArray.length % 7);
        for (let i = 1; i <= remainingDays; i++) {
          if (monthToShow === 11) {
              this.dateArray.push({display: i, fullDate: new Date(yearToShow + 1, 0, i).toDateString()})
          } else {
              this.dateArray.push({display: i, fullDate: new Date(yearToShow, monthToShow + 1, i).toDateString()});
          }
        }
      },
      createAppointmentObject(dayOfWeek: string, clientEmail: string, appointmentTime: string) {
        let appointmentType = '';
        if (appointmentTime === 'Breakfast Visit') {
          appointmentType = 'breakfastVisit';
        } else if (appointmentTime === 'Lunch Visit') {
          appointmentType = 'lunchVisit';
        } else if (appointmentTime === 'Dinner Visit') {
          appointmentType = 'dinnerVisit';
        } else if (appointmentTime === 'Night Visit') {
          appointmentType = 'nightVisit';
        }

        let appointmentObject = {
          address: this.recurringVisits.visits[dayOfWeek][appointmentType][clientEmail].address,
          appointment: appointmentTime,
          assignedEmployee: this.recurringVisits.email,
          assignedEmployeeName: this.recurringVisits.firstName + ' ' + this.recurringVisits.lastName,
          cell: this.recurringVisits.visits[dayOfWeek][appointmentType][clientEmail].cell,
          email: clientEmail,
          firstName: this.recurringVisits.visits[dayOfWeek][appointmentType][clientEmail].firstName,
          lastName: this.recurringVisits.visits[dayOfWeek][appointmentType][clientEmail].lastName
        }
        return appointmentObject;
      },
      createOneOffAppointmentObject(date: string, clientEmail: string, appointmentTime: string) {
        let appointmentType = '';
        if (appointmentTime === 'Breakfast Visit') {
          appointmentType = 'breakfastVisit';
        } else if (appointmentTime === 'Lunch Visit') {
          appointmentType = 'lunchVisit';
        } else if (appointmentTime === 'Dinner Visit') {
          appointmentType = 'dinnerVisit';
        } else if (appointmentTime === 'Night Visit') {
          appointmentType = 'nightVisit';
        }

        let appointmentObject = {
          address: this.oneOffVisits.visits[date][appointmentType][clientEmail].address,
          appointment: appointmentTime,
          assignedEmployee: this.oneOffVisits.email,
          assignedEmployeeName: this.oneOffVisits.firstName + ' ' + this.oneOffVisits.lastName,
          cell: this.oneOffVisits.visits[date][appointmentType][clientEmail].cell,
          email: clientEmail,
          firstName: this.oneOffVisits.visits[date][appointmentType][clientEmail].firstName,
          lastName: this.oneOffVisits.visits[date][appointmentType][clientEmail].lastName
        }
        return appointmentObject;
      }
    },
    components: { AppointmentCard }
  }
</script>
  
<style scoped lang="scss">

$bg-color: #78ACCD;
$white: #ffffff;
$black: #333333;
$gray: #7D8994;
$orange: #DE6E46;
$purple: #66f;

$radius: 20%;

.adminCalendarContainer {
    margin:auto;
    margin-bottom: 10vh;
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

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
html {
    font-size: 10px;
    line-height: 1.6;
}

body {
    background: $bg-color;
    color: $black;
    font-size: 1.5rem;
}

ul {
    list-style: none;
}

.monthTitle {
    text-align: center;
}

.card {
    background: $white;
    border-radius: 20px;
    width: 90%;
    margin: auto;
    grid-template-rows: 8rem auto 10rem;
    border-style: solid;
    border-color: grey;

    &__header {
        height: fit-content;
        padding: 0 1.25rem;
        color: $gray;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    &__body {
        padding: 1.5rem 2rem;
        border-top: 1px solid #ccc;
        border-bottom: 1px solid #ccc;

        &--days {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 4rem;

            li {
                flex: 1;
                font-weight: bold;
                text-transform: uppercase;
                text-align: center;
                color: $gray;
                margin: 0 1px;
            }
        }
        &--dates {
            cursor: pointer;
            display: grid;
            gap: 3px;
            grid-template-columns: repeat(7, 1fr);
            justify-items: center;
            text-align: center;
            li {
                @media (min-width: 768px) { 
                    width: 3.5rem;
                    height: 3.5rem;
                }
                display: grid;
                place-items: center;
                font-weight: bold;
                position: relative;
            }
            span {
              position: absolute;
              top: -.5rem;
              right: -.5rem;
              width: 3vw;
              max-width: 20px;
              color: $white;
              border-radius: $radius;
              background: $purple;
            }
            li.prev,
            li.next {
                color: #ccc;
                aspect-ratio : 1 / 1;
            }
            li.active {
              aspect-ratio : 1 / 1;
              background: #66f;
              color: $white;
              border-radius: $radius;
            }
            li.circle {
              aspect-ratio : 1 / 1;
              border: 2px solid;
              border-radius: $radius;
              border-color: black;
            }
            .circle.orange {
                border-color: $orange;
                span {
                    background: $orange;
                }
            }
            .circle.purple {
                border-color: $purple;
                span {
                    background: $purple;
                }
            }
        }
    }
    &__footer {
        @extend .card__header;
        color: $black;
        font-weight: bold;
        display:block;
        height: fit-content;
    }
}

/* From uiverse.io */
button {
    margin: 1vw;
    border-style: solid;
    border-color: grey;
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

button.selected {
    border-color: #66f;
  background-color: #66f;
  box-shadow: 0px 5px 20px #66f;
  color: #fff;
}

button.timeButton {
    width: 16vw;
    max-width: 200px;
    margin: 1vw;
}
</style>
