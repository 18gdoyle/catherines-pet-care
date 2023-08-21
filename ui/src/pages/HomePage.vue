<template>
    <div class="homePageContainer">
        <FirstTimeCard
            v-if="userMode === 'newUser'"
            @show-scheduler="$emit('show-scheduler')"
            @show-about-us="$emit('show-about-us')"
        ></FirstTimeCard>
        <ReturningUserCard
            v-if="userMode === 'newUser'"
            @show-sign-in="$emit('show-sign-in')"
        ></ReturningUserCard>
        <FirstTimeSignedInCard
            v-if="userMode === 'pendingCustomer' && pendingMeetAndGreetsScheduled === false && meetAndGreetApproved === false"
            @show-scheduler="$emit('show-scheduler')"
            @show-about-us="$emit('show-about-us')"
        ></FirstTimeSignedInCard>
        <PendingMeetAndGreetsCard
            v-if="userMode === 'pendingCustomer' && pendingMeetAndGreetsScheduled === true"
            @show-scheduler="$emit('show-scheduler')"
        ></PendingMeetAndGreetsCard>
        <ApprovedMeetAndGreetCard
            v-if="userMode === 'pendingCustomer' && meetAndGreetApproved === true"
            :appointment="approvedAppointment"
        ></ApprovedMeetAndGreetCard>
        <ApprovedCustomerCard
            v-if="userMode === 'customer'"
            :userInfo="userInfo"
            @show-visit-scheduler="$emit('show-visit-scheduler')"
            @show-my-visits="$emit('show-my-visits')"
        ></ApprovedCustomerCard>
    </div>
</template>

<script lang="ts">
import PendingMeetAndGreetsCard from '@/components/home/PendingMeetAndGreetsCard.vue';
import ApprovedMeetAndGreetCard from '@/components/home/ApprovedMeetAndGreetCard.vue'
import FirstTimeCard from '@/components/home/FirstTimeCard.vue';
import FirstTimeSignedInCard from '@/components/home/FirstTimeSignedInCard.vue';
import ReturningUserCard from '@/components/home/ReturningUserCard.vue'
import * as greetAppointments from '@/services/greetAppointments';
import ApprovedCustomerCard from '@/components/home/ApprovedCustomerCard.vue';

	export default {
        props:{
            userMode: String,
            userInfo: Object as any
        },
    data() {
        return {
            pendingMeetAndGreetsScheduled: false,
            meetAndGreetApproved: false,
            approvedAppointment: {},
            appointmentArray: []
        };
    },
    methods: {},
    async mounted() {
        if (this.userMode === 'pendingCustomer') {
            let data = await greetAppointments.getPendingGreetAppointment(this.userInfo.email);
            if (data.length === 0) {
                data = await greetAppointments.getGreetAppointment(this.userInfo.email);
                if (data.length === 0) {
                    this.meetAndGreetApproved = false;
                    return;
                }
                this.meetAndGreetApproved = true;
                this.approvedAppointment = data[0];
                return;
            }
            this.pendingMeetAndGreetsScheduled = true;
            this.appointmentArray = data[0].appointments;
        }
    },
    components: { FirstTimeCard, ReturningUserCard, FirstTimeSignedInCard, PendingMeetAndGreetsCard, ApprovedMeetAndGreetCard, ApprovedCustomerCard }
}
</script>
  
<style scoped lang="scss">
.homePageContainer {
    display: flex;
    @media (max-width: 768px) {
        flex-wrap: wrap;
    }
    justify-content: center;
}
</style>
