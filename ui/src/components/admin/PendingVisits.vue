<template>
    <div class="pendingVisitsContainer">
        <RecurringVisitCard v-for="appointment in appointments"
          :appointment="appointment"
          :employeeInfo="employeeInfo"
        ></RecurringVisitCard>
        <OneOffVisitCard v-for="oneOffAppointment in oneOffAppointments"
          :oneOffAppointment="oneOffAppointment"
          :employeeInfo="employeeInfo"
        ></OneOffVisitCard>
    </div>
</template>

<script lang="ts">
    import * as recurringVisits from '../../services/recurringVisits'
    import * as oneOffVisits from '@/services/oneOffVisits'
    import RecurringVisitCard from '../RecurringVisitCard.vue';
    import OneOffVisitCard from '@/components/OneOffVisitCard.vue'
    export default {
    props: {
        employeeInfo: Object as any
    },
    data() {
        return {
            appointments: Object as any,
            oneOffAppointments: Object as any,
        };
    },
    methods: {},
    async mounted() {
        this.appointments = await recurringVisits.getAllRecurringVisits(this.employeeInfo.accessToken, this.employeeInfo.email);
        this.oneOffAppointments = await oneOffVisits.getAllOneOffVisits(this.employeeInfo.accessToken, this.employeeInfo.email);
    },
    components: { RecurringVisitCard, OneOffVisitCard }
}
</script>
    
<style scoped lang="scss">
.pendingVisitsContainer {
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
    display: flex;
}
</style>
  