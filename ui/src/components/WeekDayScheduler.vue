<template>
    <main class="card">
    <section class="card__body">
      <ul class="card__body--days">
        <li
            v-for="day in weekdayArray"
            @click="selectDay(day)"
            :class="{
                circle: selectedDay === day
            }"
        >
            {{day}}
        </li>
      </ul>
    </section>
    <div class="card__footer">
        <button 
            v-if="selectedDay !== ''"
            v-for="time in availabilityArray"
            :class="{ 
                timeButton: true, 
                selected: selectedAvailabilityArray[selectedDay].includes(time)
            }"
            @click="selectTime(time)" 
            type="button"
        >
            {{time}}
        </button>
        <!--
      <a href="#" class="add">+</a>
        -->
    </div>
  </main>
</template>

<script lang="ts">
	export default {
        props: {
            availabilityArray: Array as any,
            selectedAvailabilityArray: Object as any
        },
        data() {
            return {
                weekdayArray: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as any,
                selectedDay: '',
                selectedTime: null,
            }
        },
        methods: {
            selectDay(day: string) {
                this.selectedDay = day;
            },
            selectTime(time: any) {
                this.selectedTime = time;
                if (this.selectedAvailabilityArray[this.selectedDay].includes(this.selectedTime)) {
                    this.selectedAvailabilityArray[this.selectedDay].splice(this.selectedAvailabilityArray[this.selectedDay].indexOf(this.selectedTime), 1);
                } else {
                    this.selectedAvailabilityArray[this.selectedDay].push(this.selectedTime);
                }
                this.$emit('time-selected', this.selectedAvailabilityArray);
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

$radius: 50%;

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
        padding: 1.5rem 2rem;
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
            li.circle {
                border-radius: 20px;
                transition: all 0.3s ease 0s;
                cursor: pointer;
                outline: none;
                border-color: #66f;
                background-color: #66f;
                box-shadow: 0px 5px 20px #66f;
                color: #fff;
            }
        }
    }
    &__footer {
        @extend .card__header;
        color: $black;
        font-weight: bold;
        display: inline-flex;
        flex-wrap: wrap;
        justify-content: center;
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
