<template>
    <div id="popup1" class="overlay">
        <div class="popup" >
            <div class="content" v-if="!loading">
                Are you sure you want to approve <b>{{appointment.firstName}} {{appointment.lastName}}</b> as a client.
                This means they will now be able to schedule visits.
                <br />
                <br />
                <div class="confirmationButtons">
                    <div @click="confirmed" class="circle">
                      <i class="fa-solid fa-check" id="icon"></i>
                    </div>
                    <div @click="$emit('pop-up-cancel')" class="circle-red">
                      <i class="fa-solid fa-x" id="icon"></i>
                    </div>
                </div>
            </div>
            <div class="popupCloseBlock" v-if="customerApproved" >
                <a @click="$emit('pop-up-close')" class="popupClose">&times;</a>
            </div>
            <div v-if="customerApproved" class="content">
                Great! Why don't you shoot  <b>{{appointment.firstName}} {{appointment.lastName}}</b> 
                an email and text letting them know they can now start scheduling visits using the site.
                <br />
                <br />
                <b>E-Mail:</b> {{appointment.email}}
                <br />
                <b>Phone:</b> {{appointment.cell}}
                <br />
            </div>
        </div>
        <LoadingCircle
            v-if="loading && !customerApproved"
        ></LoadingCircle>
    </div>
</template>

<script lang="ts">
import LoadingCircle from '../LoadingCircle.vue';

	export default {
    props: {
        appointment: Object as any,
        customerApproved: Boolean
    },
    watch: { 
      	customerApproved: (newVal, oldVal) => { // watch it
        }
    },
    data() {
        return {
            loading: false
        };
    },
    methods: {
        confirmed() {
            this.loading = true;
            this.$emit("pop-up-confirm");
        }
    },
    async mounted() {
    },
    components: { LoadingCircle }
}
</script>
  
<style scoped lang="scss">

.overlay {
    z-index: 10;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  transition: opacity 100ms;
}

.popup {
  margin: auto;
  margin-top: 20vh;
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  width: 30%;
  position: relative;
}

.popup h2 {
  margin-top: 0;
  color: #333;
  font-family: Tahoma, Arial, sans-serif;
}
.popup .content {
    text-align: center;
}

@media screen and (max-width: 700px){
  .box{
    width: 70%;
  }
  .popup{
    width: 70%;
  }
}

.popupCloseBlock{
    display: flex;
    justify-content: right;
}
.popupClose:hover {
  color: #66f;
}

.popupClose{
    cursor: pointer;
  top: 20px;
  right: 30px;
  transition: all 200ms;
  font-size: 30px;
  font-weight: bold;
  text-decoration: none;
  color: black;
}
.popupClose:hover {
  color: #66f;
}

.confirmationButtons {
    display: flex;
    justify-content: center;
}

$primary: #8cc63e;
$checkmarkColor: white;
$checkmarkFat: 3px;

.circle {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: auto;
  position: relative;
  background: $primary;
  border-radius: 50%;
  width: 5vw;
  height: 5vw;
  min-width: 80px;
  min-height: 80px;
}

.circle-red {
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin: auto;
  position: relative;
  background: red;
  border-radius: 50%;
  width: 5vw;
  height: 5vw;
  min-width: 80px;
  min-height: 80px;
}

#icon {
  color: white;
  font-size: xx-large;
  margin: auto;
  display: flex;
  justify-content: center;
}


</style>
