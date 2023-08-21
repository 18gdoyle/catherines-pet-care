<template>
    <div class="weekDayCalendarContainer">
        <main class="card">
            <section class="card__body">
            <ul class="card__body--days">
                <li @click="selectDay('Sun')" :class="{circle: selectedDay === 'Sun'}">sun</li>
                <li @click="selectDay('Mon')" :class="{circle: selectedDay === 'Mon'}">mon</li>
                <li @click="selectDay('Tue')" :class="{circle: selectedDay === 'Tue'}">tue</li>
                <li @click="selectDay('Wed')" :class="{circle: selectedDay === 'Wed'}">wed</li>
                <li @click="selectDay('Thu')" :class="{circle: selectedDay === 'Thu'}">thu</li>
                <li @click="selectDay('Fri')" :class="{circle: selectedDay === 'Fri'}">fri</li>
                <li @click="selectDay('Sat')" :class="{circle: selectedDay === 'Sat'}">sat</li>
            </ul>
            </section>
            <div class="card__footer">
                <div style="display:inline-block; text-align: center; width:100%; padding:1vh;">
                    <button 
                        v-if="(selectedDay !== '')"
                        v-for="availability in availabilityArray[selectedDay]"
                        :class="{ 
                            timeButton: true, 
                            selected: appointmentArray.includes(selectedDay + ' ' + availability)
                        }"
                        @click="selectTime(availability)" 
                        type="button"
                        :disabled="!editable"
                    >
                        {{availability}}
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
            importedRecurringVisits: Array as any,
            editable: Boolean
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
                selectedDay: '',
                selectedDate: null,
                selectedTime: null,
                appointmentSelected: false
            }
        },
        mounted() {
            if (this.importedRecurringVisits && this.importedRecurringVisits.length > 0) {
              this.appointmentArray = this.importedRecurringVisits;
              this.$emit('appointments', this.appointmentArray);
            }
            this.selectDay('Sun');
        },
        methods: {
            selectDay(day: string) {
                this.selectedDay = day;
            },
            selectTime(time: any) {
                this.selectedTime = time;
                if (this.appointmentArray.includes(this.selectedDay + ' ' + this.selectedTime)) {
                    this.appointmentArray.splice(this.appointmentArray.indexOf(this.selectedDay + ' ' + this.selectedTime), 1);
                } else {
                    this.appointmentArray.push(this.selectedDay + ' ' + this.selectedTime);
                }
                this.$emit('appointments', this.appointmentArray);
            },
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

$radius: 10%;

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
.weekDayCalendarContainer {
    padding: 1.5vw;
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
                cursor: pointer;
            }

            button {
                flex: 1;
                font-weight: bold;
                text-transform: uppercase;
                text-align: center;
                color: $gray;
                margin: 0 1px;
                cursor: pointer;
            }

            li.circle {
                border: 2px solid;
                span {
                    position: absolute;
                    top: -0.75rem;
                    right: -0.5rem;
                    width: 1.75rem;
                    height: 1.75rem;
                    font-size: 1.2rem;
                    color: $white;
                    border-radius: $radius;
                    background: $purple;
                }
                border-color: grey;
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
            li.prev,
            li.next {
                color: #ccc;
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
                span {
                    position: absolute;
                    top: -0.75rem;
                    right: -0.5rem;
                    width: 1.75rem;
                    height: 1.75rem;
                    font-size: 1.2rem;
                    color: $white;
                    border-radius: $radius;
                    background: $purple;
                }
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
</style>
  