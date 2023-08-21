<template>
  <ApproveCustomerPopUp
      v-if="popUpShowing"
      :customerApproved="customerApproved"
      :appointment="appointment"
      @pop-up-confirm="approveCustomer"
      @pop-up-cancel="popUpShowing = false;"
      @pop-up-close="closePopUp"
    ></ApproveCustomerPopUp>
        <div class="appointment-card">
            <div class="appointment-card-body">
              <p>
                <u><b>Name:</b></u> {{appointment.firstName}} {{appointment.lastName}}
                <br />
                <u><b>Address:</b></u> {{appointment.address}}
                <br />
                <u><b>E-Mail:</b></u> {{appointment.email}}
                <br />
                <u><b>Cell:</b></u> {{appointment.cell}}
                <br />
                <u><b>Appointment:</b></u>
                <br />
                <span class="tag tag-purple">{{appointment.appointment}}</span>
                <br />
                <u><b>Assigned to:</b></u> {{appointment.assignedEmployee}}
              </p>
              <button 
                type="button" @click="popUpShowing=true" 
                v-if="appointment.appointment !== 'Breakfast Visit' && appointment.appointment !== 'Lunch Visit' && appointment.appointment !== 'Dinner Visit' && appointment.appointment !== 'Night Visit'"
              >
                Approve this Customer
              </button>
            </div>
        </div>
</template>

<script lang="ts">
  import * as customer from '../services/customers'
  import * as greetAppointments from '../services/greetAppointments';
  import ApproveCustomerPopUp from '../components/popup/ApproveCustomerPopUp.vue'
	export default {
        props: {
          appointment: Object as any
        },
        emits: ['delete-appointment', 'pop-up-confirm'],
        data() {
            return {
              popUpShowing: false,
              customerApproved: false,
            }
        },
        methods: {
          async approveCustomer() {
            try {
              let customerData = {
                'email': this.appointment.email,
                'address': this.appointment.address,
                'firstName': this.appointment.firstName,
                'lastName': this.appointment.lastName,
                'approved': true,
              }
              await customer.upsertCustomer(customerData);
            } catch (error) {
              console.dir(error);
              return;
            }

            try {
              await greetAppointments.deleteGreetAppointmentById(this.appointment._id);
            } catch (error) {
              console.dir(error);
              return;
            }

            this.customerApproved = true;

            this.$emit('pop-up-confirm');
          },
          closePopUp() {
            this.popUpShowing = false;
            this.$emit('delete-appointment');
          }
        },
        components: {ApproveCustomerPopUp}
    }
</script>
  
<style scoped lang="scss">

@import url("https://fonts.googleapis.com/css2?family=Roboto&display=swap");
* {
  box-sizing: border-box;
}
.appointment-card {
  margin: 10px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
  overflow: hidden;
  width: 300px;
  display: flex;
}
.appointment-card-body {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 20px;
  min-height: 250px;
}

.tag {
  background: #cccccc;
  border-radius: 50px;
  font-size: 12px;
  margin: 0;
  color: #fff;
  padding: 2px 10px;
  text-transform: uppercase;
  cursor: pointer;
  width: 100%;
}
.tag-teal {
  background-color: #47bcd4;
}
.tag-purple {
  background-color: #66f;
}
.tag-pink {
  background-color: #cd5b9f;
}

.appointment-card-body p {
  font-size: 13px;
}
.user {
  display: flex;
  margin-top: auto;
}

.user img {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  margin-right: 10px;
}
.user-info h5 {
  margin: 0;
}
.user-info small {
  color: #545d7a;
}

button {
    border-color: #66f;
    background-color: #66f;
    box-shadow: 0px 5px 20px #66f;
    color: #fff;
    border-style: solid;
    padding: .5vw;
    font-size: 12px;
    text-transform: uppercase;
    font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
    Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    letter-spacing: 2.5px;
    font-weight: 500;
    border-radius: 45px;
    transition: all 0.3s ease 0s;
    cursor: pointer;
    outline: none;
    &:hover {
        transform: translateY(-7px);
    }
    &:disabled {
        background-color: grey;
        border-style: solid;
        border-color: grey;
        cursor: auto;
        transform: none;
        box-shadow: none;
    }
}

</style>
