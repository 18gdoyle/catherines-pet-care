<template>
<div class="container">
    <div class="post">
        <div class="header_post">
            <img src="https://images.pexels.com/photos/2529973/pexels-photo-2529973.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="">
        </div>

        <div class="body_post">
            <div class="post_content">
              <br />
              <h1>First Time Here?</h1>
              <br />
              <p class="post_text">
                Glad you could drop by. If you're looking to schedule a visit, you'll need to first schedule a meet
                and greet so that we can get to know you and your pets. To schedule a meet and greet, simply click the below
                button "Schedule a Meet and Greet". If you're just here to learn more about who we are and what we do, click
                "About Us" below.
              </p>
              <br />
              <div class="container_infos">
                <div class="container_tags">
                    <div class="tags">
                        <ul>
                            <li @click="$emit('show-about-us')">About Us</li>
                        </ul>
                    </div>
                </div>
                <div class="container_tags">
                    <div class="tags">
                        <ul>
                            <li @click="$emit('show-scheduler')">Schedule a Meet and Greet</li>
                        </ul>
                    </div>
                </div>
              </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
export default {
    data() {
        return {
        }
    },
    methods: {
    }
}
</script>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css?family=Lato:300,400|Poppins:300,400,800&display=swap');

* {
  margin: 0px;
  padding: 0;
}

body {
  font-family: 'Poppins';
   overflow: hidden;
}

.post_text {
  height: 15vh;
  overflow-y: auto;
}

.container {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 5vh;

  .post {
    border-style: solid;
    border-color: black;
    @media (max-width: 768px) {
      width: 80vw;
    }
    width: 40vw;
    height: fit-content;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    position: relative;

    .header_post {
      width: 100%;
      height: 30vh;
      position: relative;
      overflow: hidden;
      top: 0;
      -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -o-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;

      img {
        max-width: 100%;
        height: auto;
         transition: ease-in-out 600ms;
      }
    }

    .body_post {
      width: 100%;
      height: fit-content;
      background: #fff;
      position: relative;
      bottom: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -o-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;


      .post_content {
        width: 80%;
        height: 80%;
        background: #fff;
        position: relative;

        h1 {
          font-size: 20px;
          font-weight: bold;
        }

        p {
          font-size: 14px;
          font-weight: normal;
        }

        .container_infos {
          width: 100%;
          display: flex;
          justify-content: space-between;
          bottom: -20%;
          border-top: 1px solid rgba(0, 0, 0, .2);
          padding-top: 10px;
          padding-bottom: 2vw;

          .postedBy {
            display: flex;
            flex-direction: column;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-size: 12px;

            span {
              font-size: 12px;
              text-transform: uppercase;
              opacity: 0.5;
              letter-spacing: 1px;
              font-weight: bold;
            }
          }

          .container_tags {
            width: 50%;
            display: flex;
            flex-direction: column;

            span {
              font-size: 12px;
              text-transform: uppercase;
              opacity: 0.5;
              letter-spacing: 1px;
              font-weight: bold;
            }

            .tags {
              ul {
                display: flex;
                li {
                  font-size: 12px;
                  letter-spacing: 2px;
                  list-style: none;
                  margin-left: 8px;
                  text-transform: uppercase;
                  position: relative;
                  z-index: 1;
                  display: flex;
                  justify-content: center;
                  cursor: pointer;

                  &:first-child {
                    margin-left: 0px;
                  }

                  &:before {
                    content: '';
                    text-align: center;
                    width: 100%;
                    height: 5px;
                    background: #66f;
                    opacity: 0.5;
                    position: absolute;
                    bottom: 0;
                    z-index: -1;
                    padding: 0px 1px;
      -webkit-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -moz-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -ms-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      -o-transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
      transition: cubic-bezier(0.68, -0.55, 0.27, 01.55) 320ms;
                  }

                  &:hover:before {
                    height: 18px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}



footer {
  width: 350px;
  height: 80px;
  background: #17A16F;
  position: absolute;
  right: 0;
  bottom: -80px;
  display: flex;
  justify-content: center;
  align-items: center;
   animation: top 0.8s forwards;
   
  span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    color: #fff;
    font-family: 'Poppins';

    i {
      margin-right: 25px;
      font-size: 22px;
      color: #fff;
      animation: icon 2s forwards;
      opacity: 0;
    }
  }
}

@keyframes top {
  0% {
    opacity: 0;
     bottom: -80px
  }
  100% {
    opacity: 1;
     bottom: 0px

  }
}

@keyframes icon {
  0% {
    opacity: 0;
     transform: scale(0.0);
  }
   50% {
      opacity: 1;
     transform: scale(1.3) rotate(-02deg);
      
   }
  100% {
    opacity: 1;
     bottom: 0px;
  }
}
</style>
