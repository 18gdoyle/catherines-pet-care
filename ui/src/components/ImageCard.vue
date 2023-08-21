<template>
  <div class="container">
      <div class="card">
        <figure class="card__thumb">
          <img src="./IMG_1066.jpg" alt="Picture by Daniel Lincoln" class="card__image">
          <figcaption class="card__caption">
            <h2 class="card__title">{{ title }}</h2>
            <p class="card__snippet">{{snippet}}</p>
            <a href="" class="card__button">Read more</a>
          </figcaption>
        </figure>
      </div>
  </div>
</template>

<script lang="ts">
	export default{
		props: {
			title: String,
			snippet: String,
		},
	}
</script>

<style scoped lang="scss">

.container {
	display: inline-block;
}
.card {
	width: 45vw;
	&:hover {
		.card__caption {
			top: 80%;
			transform: translateY(-50%);
		}

		.card__image {
			transform: translateY(-10px);
		}

		.card__thumb {
			&::after {
				top: 0;
			}
		}

		.card__snippet {
			margin: 2vh 0;
		}
	}

	&__thumb {
		position: relative;
		border-radius: 25px;
		width: 45vw;
		height: 45vw;
		overflow: hidden;
		max-height: 500px;

		&::after {
			position: absolute;
			top: 0;
			display: block;
			content: '';
			width: 100%;
			height: 100%;
			background: linear-gradient(0deg, rgba(0, 0, 0, .5) 40%, rgba(255, 255 ,255 , 0) 100%);
			transition: .3s;
			top: calc(100% - 140px);
		}
	}
	
	&__image {
		width: 45vw;
		transition: .5s ease-in-out;
	}
	
	&__caption {
		position:absolute;
		z-index: 1;
		padding: 0 20px;
		color: white;
		transition: .3s;
		top: calc(100% - 7vh);
		transform: unset;
	}

	&__title {
		display: -webkit-box;
    	overflow: hidden;
		font-family: 'Playfair Display', serif;
		font-size: 5vh;
		line-height: 28px;
		text-shadow: 0px 1px 5px black;
		text-overflow: ellipsis;
	}

	&__snippet {
		display: -webkit-box;
		margin: 20px 0;
		overflow: hidden;
		font-family: 'Roboto', sans-serif;
		font-size: 16px;
		line-height: 20px;
		text-overflow: ellipsis;
		transition: .5s ease-in-out;
    -webkit-line-clamp: 5;
		-webkit-box-orient: vertical;
		margin: 60px 0;
	}

	&__button {
		display: inline-block;
		padding: 10px 20px;
		color: white;
		border: 1px solid white;
		font-family: 'Roboto', sans-serif;
		font-size: 12px;
		text-transform: uppercase;
		text-decoration: none;
		transition: .3s;

		&:hover {
			color: black;
			background-color: white;
		}
	}
}
</style>
