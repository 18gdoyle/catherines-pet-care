<template>
    <div class="userProfileContainer">
        <br />
        <img v-bind:src="userInfo.photoURL" alt="profileImage">
        <h2>{{userInfo.displayName}}</h2>
        <h5 v-if="userInfo.userType === 'employee'">Catherine's Pet Care Staff Member</h5>
        <p>{{userInfo.email}}</p>
        <p>{{userInfo.address}}</p>
        <button type="button" @click="signOut">sign out</button>
    </div>
</template>

<script lang="ts">
    import * as firebaseAuth from '../services/firebaseAuth'
	export default {
        props: {
            userInfo: Object as any
        },
        data() {
            return {
                
            }
        },
        methods: {
            async signOut() {
                try {
                  firebaseAuth.signOutGoogleUser();
                  this.$emit('sign-out');
                } catch(error) {
                  console.dir(error);
                  return;
                }
            }
        },
        async mounted() {
        },
    }
</script>
  
<style scoped lang="scss">

img, p, h2, h5 {
    margin: 0;
}

.userProfileContainer {
    text-align: center;
    margin:auto;
    margin-top: 15vh;
    box-sizing: border-box;
    width: 85vw;
    box-shadow: 2px 2px 5px 1px rgba(0,0,0,0.2);
    border-radius: 20px;
    h1 {
        box-sizing: border-box;
        padding: 20px;
    }
}

button {
    margin: 1vw;
    border-style: solid;
    border-color: grey;
  padding: .5vw;
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

</style>
