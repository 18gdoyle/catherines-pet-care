<template>
    <div v-if="showScheduledMeetAndGreets" class="alreadyScheduledContainer">
        <div v-if="showPendingAppointments">
            <div class="textBlock">
                It seems you have already scheduled a meet and greet for the following times
                <div v-for="item in appointmentArray">
                    - {{ item }}
                </div>
            </div>
           
        </div>
        <div v-if="showApprovedAppointment">
            <div class="textBlock">
                You are meeting with {{approvedAppointment.assignedEmployeeName}} on {{approvedAppointment.appointment}}
            </div>
            
        </div>
        
    </div>
    <div v-if="showAddressChecker" class="addressCheckerContainer">
        <br/>
        <div class="textBlock">
            We serve Glenmoore and Byers Station. By entering your home address, we will make sure that you are within our range of service and we will know where to meet you for your meet and greet and future visits
        </div>
        <br />
        <label for="address" class="form__label">Address</label>
        <input 
            @keyup="keyupEvent"
            type="text" 
            v-model="address" 
            class="form__input" 
            id="address"
        />
        <LoadingCircle v-if="loading" style="margin-left:2vw; margin-top: 1vh"></LoadingCircle>
        <AutocompleteDropdown
            :items="addressArray"
            @option-selected="selectAddress"
        ></AutocompleteDropdown>
        <div style="display:flex; justify-content:flex-end; width:100%; padding:0;">
            <button type="button" @click="getDistance" :disabled="submitAddressDisabled" style="margin-right: 2vw;">Check Eligibility</button>
        </div>
    </div>
    <div class="loadingCircleContainer" v-if="distanceLoading || availabilityLoading || sendingSubmission">
        <LoadingCircle style="margin:auto"></LoadingCircle>
    </div>
    <div v-if="showAuthentication">
        <FirebaseAuth
            @user-authenticated="userAuthenticated"
            :text="'Congratulations, you are within our service area. In order to schedule a meet and greet, we need you to create a Catherine\'s Pet Care account, which will allow you to securely schedule visits.'"
        ></FirebaseAuth>
    </div>
    <div v-if="showEmailInput" class="infoInputContainer">
        <br />
        <div class="textBlock">
            Please make sure that all fields are filled out with your contact information. The submit contact info button will light up once you have filled in all your information.
        </div>
        <label for="firstName" class="form__label">First Name</label>
        <input 
            @keyup="validateContactInfo"
            type="text" 
            v-model="firstName" 
            class="form__input" 
            id="firstName"
        />
        <label for="lastName" class="form__label">Last Name</label>
        <input 
            @keyup="validateContactInfo"
            type="text" 
            v-model="lastName" 
            class="form__input" 
            id="lastName"
        />
        <label for="email" class="form__label">E-Mail</label>
        <input 
            @keyup="validateContactInfo"
            type="text" 
            v-model="email" 
            class="form__input" 
            id="email"
        />
        <label for="cellPhone" class="form__label">Cell Phone Number</label>
        <input 
            @keyup="validateContactInfo"
            type="text" 
            v-model="cellPhone" 
            class="form__input" 
            id="cellPhone"
        />
        <div style="display:flex; justify-content:flex-end; width:100%; padding:0;">
            <button 
                type="button" 
                @click="loadCalendar"
                :disabled="submitContactInfoDisabled"
                style="margin-right: 2vw;"
            >
                Submit Contact Info
            </button>
        </div>
    </div>
    <div v-if="showCalendar" class="meetAndGreetCalendarContainer">
        <div class="textBlock">
            Select three seperate dates and times that you would like to meet. Appointments must be scheduled at least three days ahead of time. We will confirm your meet and greet within 2 business days.
        </div>
        <br />
        <Calendar
            @appointments="updateAppointmentsArray"
            :availabilityArray="availabilityArray"
            :disableBefore=259200
            :editable="true"
        ></Calendar>
        <div style="display:flex; justify-content:center; width:100%; padding:0;">
            <button type="button" :disabled="submitFormDisabled" @click="reviewSubmission">Next</button>
        </div>
    </div>
    <div v-if="showSubmit || showThankYou" class="appConfirmationContainer">
        <div v-if="showSubmit" class="form_submission_review">
            <br />
            <b>Name:</b> {{firstName}} {{lastName}}
            <br />
            <b>Address:</b> {{address}}
            <br />
            <b>E-Mail:</b> {{email}}
            <br />
            <b>Cell:</b> {{cellPhone}}
            <br />
            <b>Appointments:</b> 
            <div v-for="item in appointmentArray">
                - {{ item }}
            </div>
            <br />
            <div style="display:flex; justify-content:flex-end; width:100%; padding:0;">
                <button type="button" :disabled="submitFormDisabled" style="margin-right: 2vw" @click="submitForm">Submit</button>
            </div>
        </div>
        <div v-if="showThankYou" class="form_submission_review">
            <div class="textBlock">
                Thank you! We will send you a text and email to confirm your meet and greet within 48 hours.
            </div>
        </div>
    </div>
    <div v-if="tooFar" class="tooFarContainer">
        <div class="textBlock">
            We're sorry, but it seems you are outside of our area of service. We wish you the best of luck in your
            pet care search.
        </div>
    </div>
</template>

<script lang="ts">
import AutocompleteDropdown from "../components/AutocompleteDropdown.vue";
import LoadingCircle from "../components/LoadingCircle.vue";
import Calendar from "../components/Calendar.vue";
import * as maps from "../services/maps";
import * as customers from "../services/customers";
import * as greetAppointments from "../services/greetAppointments";
import * as employees from "@/services/employees"
import FirebaseAuth from "@/components/FirebaseAuth.vue";
	export default {
    async mounted() {
        if (this.userMode === 'pendingCustomer') {
            this.showAddressChecker = false;
            this.showScheduledMeetAndGreets = true;
            let data = await greetAppointments.getPendingGreetAppointment(this.userInfo.email);
            if (data.length === 0) {
                data = await greetAppointments.getGreetAppointment(this.userInfo.email);
                if (data.length === 0) {
                    this.showScheduledMeetAndGreets = false;
                    this.showAddressChecker = true;
                    return;
                }
                this.showApprovedAppointment = true;
                this.approvedAppointment = data[0];
                return;
            }
            this.showPendingAppointments = true;
            this.appointmentArray = data[0].appointments;
        } else {
            this.showAddressChecker = true;
        }
    },
    props: {
        userInfo: Object as any,
        userMode: String,
    },
    emits: ["update-user-mode"],
    data() {
        return {
            address: "",
            email: "",
            firstName: "",
            lastName: "",
            cellPhone: "",
            appointmentArray: [] as any,
            uniqueSelectedDaysArray: [] as any,
            approvedAppointment: Object as any,
            tooFar: false,
            timer: 0,
            addressArray: [] as any,
            availabilityArray: Object as any,
            submitAddressDisabled: true,
            submitContactInfoDisabled: true,
            submitFormDisabled: true,
            loading: false,
            distanceLoading: false,
            availabilityLoading: false,
            sendingSubmission: false,
            showScheduledMeetAndGreets: false,
            showAddressChecker: false,
            showEmailInput: false,
            showCalendar: false,
            showSubmit: false,
            showThankYou: false,
            showAuthentication: false,
            showPendingAppointments: false,
            showApprovedAppointment: false,
        };
    },
    methods: {
        async userAuthenticated(firebaseResult: any) {
            let user = firebaseResult.user;
            let customer = await customers.getCustomerInfo(user.accessToken, user.email)
            if (customer.length === 1) {
                if (customer[0].approved) {
                    this.$emit('update-user-mode', 'customer')
                    return;
                }
                this.$emit('update-user-mode', 'pendingCustomer');
            }
            this.parseAuthForInputs(user);
            this.showAuthentication = false;
            this.showEmailInput = true;
        },
        parseAuthForInputs(user: any) {
            if (user.displayName) {
                let nameArray = user.displayName.split(' ');
                if (nameArray[0]) {
                    this.firstName = nameArray[0];
                }
                if (nameArray[1]) {
                    this.lastName = nameArray[1];
                }
            }
            if (user.email !== null) {
                this.email = user.email;
            }
            if (user.phoneNumber !== null) {
                this.cellPhone = user.phoneNumber
            }
            this.validateContactInfo();
        },
        reviewSubmission() {
            this.showCalendar = false
            this.showSubmit = true;
            window.scrollTo(0,0);
        },
        loadCalendar() {
            this.showEmailInput = false;
            this.availabilityLoading = true;

            let nineToFiveArray = [
                "9:00AM - 9:30AM", "9:30AM - 10:00AM", "10:00AM - 10:30AM", "10:30AM - 11:00AM", 
                "11:00AM - 11:30AM", "11:30AM - 12:00PM", "12:00PM - 12:30PM", "12:30PM - 1:00PM",
                "1:00PM - 1:30PM", "1:30PM - 2:00PM", "2:00PM - 2:30PM", "2:30PM - 3:00PM",
                "3:00PM - 3:30PM", "3:30PM - 4:00PM", "4:00PM - 4:30PM", "4:30PM - 5:00PM",
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
            this.availabilityLoading = false;
            this.showCalendar = true;
        },
        validateContactInfo() {
            if (this.firstName === '') {
                this.submitContactInfoDisabled = true;
                return;
            }

            if (this.lastName === '') {
                this.submitContactInfoDisabled = true;
                return;
            }

            if (this.email === '' || !this.email.includes('@')) {
                this.submitContactInfoDisabled = true;
                return;
            }

            if (this.cellPhone === '') {
                this.submitContactInfoDisabled = true;
                return;
            }
            
            this.submitContactInfoDisabled = false
        },
        updateAppointmentsArray(appointmentArray: []) {
            this.appointmentArray = appointmentArray;
            this.uniqueSelectedDaysArray = [];
            for (let i = 0; i < this.appointmentArray.length; i++) {
                let dateSplit = this.appointmentArray[i].split(' ');
                let selectedDay = dateSplit[1] + dateSplit[2] + dateSplit[3];

                let uniqueDay = true;
                for (let j = 0; j < this.uniqueSelectedDaysArray.length; j++) {
                    if (this.uniqueSelectedDaysArray[j] === selectedDay) {
                        j = this.uniqueSelectedDaysArray.length;
                        uniqueDay = false;
                    }
                }

                if (uniqueDay) {
                    this.uniqueSelectedDaysArray.push(selectedDay);
                }
            }
            if (this.uniqueSelectedDaysArray.length >= 3 ) {
                this.submitFormDisabled = false;
                return;
            }
            this.submitFormDisabled = true;
        },
        async submitForm() {
            this.sendingSubmission = true;

            try {
              let customerData = {
                'email': this.email,
                'address': this.address,
                'firstName': this.firstName,
                'lastName': this.lastName,
                'approved': false,
                'cell': this.cellPhone,
              }
              await customers.upsertCustomer(customerData);
            } catch (error) {
              console.dir(error);
              return;
            }
            
            try {
              let greetAppointmentData = {
                'email': this.email,
                'address': this.address,
                'firstName': this.firstName,
                'lastName': this.lastName,
                'appointments': JSON.parse(JSON.stringify(this.appointmentArray)),
                'cell': this.cellPhone,
              }

              await greetAppointments.createMeetAndGreet(greetAppointmentData);
            } catch (error) {
              console.dir(error);
              return;
            }

            this.sendingSubmission = false;
            this.showSubmit = false;
            this.showThankYou = true;
            this.$emit('update-user-mode', 'pendingCustomer');
        },
        async getDistance() {
          this.showAddressChecker = false;
          this.distanceLoading = true;

          let employeesArray = [];

          try {
            employeesArray = await employees.getAllEmployees();
          } catch (error) {
            console.dir(error);
            return;
          }

          for (let i = 0; i < employeesArray.length; i++) {
            try {
              let driveInSeconds = await maps.getTravelTime(this.address, employeesArray[i]!.address);
              if (driveInSeconds > 900) {
                this.tooFar = true;
              }
              else {
                if (this.userInfo.email) {
                  this.parseAuthForInputs(this.userInfo);
                  this.showEmailInput = true;
                } else {
                  this.showAuthentication = true;
                }
              }
              this.distanceLoading = false;
            } catch(error) {
              console.dir(error);
              return;
            }
          }
        },
        keyupEvent() {
            if (this.address === "") {
                this.loading = false;
                return;
            }
            this.loading = true;
            this.addressArray = [];
            if (this.timer != null) {
                clearTimeout(this.timer);
            }
            this.timer = setTimeout(() => {
                this.getAddresses(this.address);
            }, 750);
        },
        async getAddresses(text: string) {
          try {
            this.addressArray = await maps.getAddressAutoFill(text);
          } catch (error) {
            console.dir(error);
            return;
          }
          
          this.loading = false;
        },
        selectAddress(text: string) {
            this.address = text;
            this.addressArray = [];
            this.submitAddressDisabled = false;
        },
    },
    components: { AutocompleteDropdown, LoadingCircle, Calendar, FirebaseAuth }
}
</script>
  
<style scoped lang="scss">

$primary: #0077FF;
$dark: #000;
$color: #66f;

h1, input::-webkit-input-placeholder, button {
    transition: all 0.3s ease-in-out;
}

.textBlock {
    text-align: center;
}

.addressCheckerContainer, .infoInputContainer, .meetAndGreetCalendarContainer, .tooFarContainer,
.appConfirmationContainer, .loadingCircleContainer, .alreadyScheduledContainer {
    margin: auto;
    margin-top: 15vh;
    margin-bottom: 10vh;
    box-sizing: border-box;
    width: 90vw;
    padding: 2vw;
    padding-bottom: 2vh;
    box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.2);
    border-radius: 20px;
    h1 {
        box-sizing: border-box;
        padding: 20px;
    }
}

.form__label {
  font-size: 1.2rem;
  margin-left: 2vw;
  display: block;
  transition: all 0.3s;
  transform: translateY(0rem);
}

.form_submission_review {
    font-size: 1.2rem;
    margin-left: 2vw;
    display: block;
    transition: all 0.3s;
    transform: translateY(0rem);
}

.form__input {
    font-size: 1.2rem;
    margin-left: 2vw;
    padding: 1vh;
    border-radius: 0.2rem;
    border-style: solid;
    background-color: rgb(255, 255, 255);
    width: 85%;
    display: block;
    transition: all 0.3s;
}

button {
    margin-top: 2vh;
    border-color: #66f;
    background-color: #66f;
    box-shadow: 0px 5px 20px #66f;
    color: #fff;
    border-style: solid;
    padding: 1.5vw;
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
