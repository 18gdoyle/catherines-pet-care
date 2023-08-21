<template>
    <div class="calendarContainer">
        <main class="card">
            <section class="card__header">
            <button type="button" @click="backwardOneMonth">&lt;&lt;&lt;</button>
            <h3 class="monthAndYear">{{month}} {{year}}</h3>
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
                        prev: day.month === 'prev' || currentTime >= (day.dateInSeconds - disableBefore),
                        next: day.month === 'next' && currentTime >= (day.dateInSeconds - disableBefore),
                        circle: selectedDate === day.fullDate
                    }"
                >
                    <span v-if="day.numOfVisits !== 0">{{day.numOfVisits}}</span>
                    {{day.display}}
                </li>
                <!--
                <li class="circle orange">16 <span>5</span></li>
                <li>17</li>
                <li>18</li>
                <li class="circle purple">19 <span>6</span></li>
                -->
            </ul>
            </section>
            <div class="card__footer">
                <div style="display:inline-block; text-align: center; width:100%; padding:1vh;">
                    <button 
                        v-if="selectedDate !== null"
                        v-for="time in selectedDayObject.availableTimes"
                        :class="{ 
                            timeButton: true, 
                            selected: appointmentArray.includes(selectedDate + ', ' + time) || importedRecurringVisits.includes(selectedDayOfWeek + ' ' + time)
                        }"
                        @click="selectTime(time)" 
                        type="button"
                        :disabled="!editable || (oneOffEditingMode && importedRecurringVisits.includes(selectedDayOfWeek + ' ' + time))"
                    >
                        {{time}} <span v-if="importedRecurringVisits.includes(selectedDayOfWeek + ' ' + time)">(RECURRING)</span>
                    </button>
                </div>
            </div>
        </main>
    </div>
</template>

<script lang="ts">
	export default {
        props: {
            availabilityArray: Object as any,
            importedOneOffVisits: {
              type: Array as any,
              default: []
            },
            importedRecurringVisits: {
              type: Array as any,
              default: []
            },
            editable: Boolean,
            disableBefore: {
                type: Number,
                default: 0
            },
            oneOffEditingMode: {
              type: Boolean,
              default: false,
            }
        },
        data() {
            return {
                dateArray: [] as any,
                appointmentArray: [] as any,
                month: '',
                year: '',
                dayName: '',
                dayNumber: '',
                numberOfPreviousMonthDays: 0,
                arrayLengthBeforeRemaining: 0,
                monthsAhead: 0,
                currentDate: new Date(),
                currentTime: (new Date().getTime())/1000,
                selectedDayObject: [] as any,
                selectedDate: null,
                selectedTime: null,
                selectedDayOfWeek: null,
                appointmentSelected: false
            }
        },
        mounted() {
            if (this.importedOneOffVisits && this.importedOneOffVisits.length > 0) {
              this.appointmentArray = this.importedOneOffVisits;
              this.$emit('appointments', this.appointmentArray);
            }
            this.currentDate.toDateString();
            this.initCalendar();
        },
        methods: {
          selectDate(day: any) {
            this.selectedDayObject = day;
            this.selectedTime = null;
            this.selectedDate = day.fullDate;
            this.selectedDayOfWeek = day.fullDate.split(' ')[0];
          },
          selectTime(time: any) {
            this.selectedTime = time;
            if (this.appointmentArray.includes(this.selectedDate + ', ' + this.selectedTime)) {
              this.appointmentArray.splice(this.appointmentArray.indexOf(this.selectedDate + ', ' + this.selectedTime), 1);
              let dateArrayIndex = this.dateArray.map((e: { fullDate: any; }) => e.fullDate).indexOf(this.selectedDate);
              this.dateArray[dateArrayIndex].numOfVisits--;
            } else {
              this.appointmentArray.push(this.selectedDate + ', ' + this.selectedTime);
              let dateArrayIndex = this.dateArray.map((e: { fullDate: any; }) => e.fullDate).indexOf(this.selectedDate);
              this.dateArray[dateArrayIndex].numOfVisits++;
            }
            this.$emit('appointments', this.appointmentArray);
          },
          getMonthString(month: number) {
            const monthNames = [
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ];
            return monthNames[month];
          },
          forwardOneMonth() {
            this.resetSelectedDate();
            this.dateArray = [];
            this.monthsAhead++;
            this.initCalendar();
          },
          backwardOneMonth() {
            this.resetSelectedDate();
            this.dateArray = [];
            this.monthsAhead--;
            this.initCalendar();
          },
          resetSelectedDate() {
            this.selectedDayObject = [] as any;
            this.selectedTime = null;
            this.selectedDate = null;
          },
          initCalendar() {
            let date = new Date();
            let currentTime = (date.getTime())/1000;
            this.dayName = date.toLocaleDateString('en', { weekday: 'long' })
            this.dayNumber = date.toDateString().split(' ')[2];

            let totMonths = date.getMonth() + this.monthsAhead;
            let monthToShow = totMonths % 12;
            let yearToShow = date.getFullYear() + (Math.floor(totMonths/12))
            this.month = this.getMonthString(monthToShow);
            this.year = yearToShow.toString();

            this.initPrevMonth(yearToShow, monthToShow);

            this.initCurrentMonth(yearToShow, monthToShow, currentTime);

            this.initNextMonth(yearToShow, monthToShow, currentTime)
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
            for (let i = 0; i < this.numberOfPreviousMonthDays; i++) { //PREVIOUS MONTH
              if (monthToShow === 0) {
                this.dateArray.push({
                  display: numOfDaysInPrevMonth, 
                  fullDate: new Date(yearToShow - 1, 11, numOfDaysInPrevMonth).toDateString(),
                  dateInSeconds: (new Date(yearToShow - 1, 11, numOfDaysInPrevMonth).getTime())/1000,
                  month: 'prev',
                });
              } else {
                this.dateArray.push({
                  display: numOfDaysInPrevMonth, 
                  fullDate: new Date(yearToShow, monthToShow - 1, numOfDaysInPrevMonth).toDateString(),
                  dateInSeconds: (new Date(yearToShow, monthToShow - 1, numOfDaysInPrevMonth).getTime())/1000,
                  month: 'prev',
                });
              }
              numOfDaysInPrevMonth++;
            }
          },
          initCurrentMonth(yearToShow: number, monthToShow: number, currentTime: number) {
            let numOfDaysInMonth = (new Date(yearToShow, monthToShow + 1, 0).getDate());
            for (let i = 1; i <= numOfDaysInMonth; i++) { //CURRENT MONTH
              let dateString = new Date(yearToShow, monthToShow, i).toDateString();
              let dateInSeconds = (new Date(yearToShow, monthToShow, i).getTime())/1000
              let dayOfWeek = dateString.split(' ')[0];
              let availableTimes = [];

              if (currentTime - 86400 <= (dateInSeconds - this.disableBefore)) {
                availableTimes = this.availabilityArray[dayOfWeek];
              }

              let numOfVisitsToday = 0;

              numOfVisitsToday = this.getNumOfVisitsOnDay(dayOfWeek, dateString);

              this.dateArray.push({
                display: i,
                fullDate: dateString,
                dateInSeconds: dateInSeconds,
                availableTimes: availableTimes,
                month: 'current',
                numOfVisits: numOfVisitsToday
              });
            }
          },
          initNextMonth(yearToShow: number, monthToShow: number, currentTime: number) {
            this.arrayLengthBeforeRemaining = this.dateArray.length;
            let remainingDays = 7 - (this.dateArray.length % 7);
            for (let i = 1; i <= remainingDays; i++) { //NEXT MONTH
              if (monthToShow === 11) {
                let dateString = new Date(yearToShow + 1, 0, i).toDateString();
                let dateInSeconds = (new Date(yearToShow + 1, 0, i).getTime())/1000;
                let dayOfWeek = dateString.split(' ')[0];
                let availableTimes = [];

                if (currentTime <= (dateInSeconds - this.disableBefore)) {
                  availableTimes = this.availabilityArray[dayOfWeek];
                }

                let numOfVisitsToday = 0;

                numOfVisitsToday = this.getNumOfVisitsOnDay(dayOfWeek, dateString);

                this.dateArray.push({
                  display: i, 
                  fullDate: new Date(yearToShow + 1, 0, i).toDateString(),
                  dateInSeconds: (new Date(yearToShow + 1, 0, i).getTime())/1000,
                  availableTimes: availableTimes,
                  month: 'next',
                  numOfVisits: numOfVisitsToday
                })
              } else {
                let dateString = new Date(yearToShow, monthToShow + 1, i).toDateString();
                let dateInSeconds = (new Date(yearToShow, monthToShow + 1, i).getTime())/1000
                let dayOfWeek = dateString.split(' ')[0];
                let availableTimes = [];

                if (currentTime <= (dateInSeconds - this.disableBefore)) {
                  availableTimes = this.availabilityArray[dayOfWeek];
                }

                let numOfVisitsToday = 0;
                  
                numOfVisitsToday = this.getNumOfVisitsOnDay(dayOfWeek, dateString);

                this.dateArray.push({
                  display: i, 
                  fullDate: new Date(yearToShow, monthToShow + 1, i).toDateString(),
                  dateInSeconds: (new Date(yearToShow, monthToShow + 1, i).getTime())/1000,
                  availableTimes: availableTimes,
                  month: 'next',
                  numOfVisits: numOfVisitsToday
                });
              }
            }
          },
          getNumOfVisitsOnDay(dayOfWeek: string, dateString: string, ) {
            let numOfVisitsToday = 0;

            if ( this.importedRecurringVisits.includes(dayOfWeek + ' Breakfast Visit') || this.appointmentArray.includes(dateString + ', ' + 'Breakfast Visit')) {
              numOfVisitsToday++;
            }
            if ( this.importedRecurringVisits.includes(dayOfWeek + ' Lunch Visit') || this.appointmentArray.includes(dateString + ', ' + 'Lunch Visit')) {
              numOfVisitsToday++;
            }
            if ( this.importedRecurringVisits.includes(dayOfWeek + ' Dinner Visit') || this.appointmentArray.includes(dateString + ', ' + 'Dinner Visit')) {
              numOfVisitsToday++;
            }
            if ( this.importedRecurringVisits.includes(dayOfWeek + ' Night Visit') || this.appointmentArray.includes(dateString + ', ' + 'Night Visit')) {
              numOfVisitsToday++;
            }

            return numOfVisitsToday;
          }
        }
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
        padding: 1.5vw 1.5vw;
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
        display: block;
        align-items: center;
        color: $black;
        font-weight: bold;
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
    font-weight: 500;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    margin-top: 0;
    margin-bottom: 1vh;
    letter-spacing: 1px;
    width: 12vw;
    border-radius: 85px;
    max-width: 210px;
    min-width:100px;
}

.monthAndYear {
    text-align: center;
}

.calendarContainer {
    padding: 1.5vw;
}
</style>
  