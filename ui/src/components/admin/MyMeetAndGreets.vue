<template>
    <div class="myMeetAndGreetsContainer">
        <br />
        <div v-if="myAppointments.length === 0" class="textBlock">
            Looks like you don't have any meet and greets on the schedule
        </div>
        <div class="container">
            <AppointmentCard v-for="(appointment, i) in myAppointments"
                :appointment="appointment"
                @delete-appointment="deleteAppointment(i)"
            ></AppointmentCard>
        </div>
    </div>
</template>

<script lang="ts">
    import AppointmentCard from '../AppointmentCard.vue';
	export default {
        props: {
            employeeInfo: Object as any
        },
        data() {
            return {
                myAppointments: [] as any,
            }
        },
        methods: {
            deleteAppointment(index: number) {
                this.myAppointments.splice(index, 1);
            }
        },
        async mounted() {
          var myHeaders = new Headers();
          myHeaders.append("Content-Type", "application/json");

          let requestOptions: RequestInit = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
          };

          let data: any;

          data = await fetch(import.meta.env.VITE_API_URL + "/api/greetappointment/" + this.employeeInfo.email, requestOptions)
          .then(response => response.text())
          .then(result => {
              return JSON.parse(result);
          })
          .catch(error => {
            console.dir(error);
            return;
          });

          this.myAppointments = data;
        },
        components: { AppointmentCard }
    }
</script>
  
<style scoped lang="scss">

.textBlock {
    text-align: center;
}
.myMeetAndGreetsContainer {
    padding: 2vw;
    margin:auto;
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

</style>
