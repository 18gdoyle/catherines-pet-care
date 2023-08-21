<template>
    <table v-show="items.length !== 0">
        <tbody>
            <tr v-for="(address, i) in items"
            :key="address.address.formattedAddress">
            <td :class="{active: searchIndex === i}" @click="selectAddress(address.address.formattedAddress)">{{ address.address.formattedAddress }}</td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
	export default {
        props: {
            items: Array as any
        },
        data() {
            return {
                searchIndex: 0,
            }
        },
		methods: {
            selectAddress(text: string) {
                this.$emit("option-selected", text)
            }
        }
    }
</script>
  
<style scoped lang="scss">

$color: #66f;

table {
    margin-left: 2vw;
    border: 1px solid #eaeaea;
    box-shadow: 2px 2px 4px rgba(0,0,0,.2);
}

table tr td {
  border-bottom: 1px solid #eaeaea;
  color: #777;
  height: 32px;
  font-weight: 600;
  font-size: .9em;

  &:hover { 
    color: $color;
    cursor: pointer;
  }
  
  &:last-child {
    border-bottom: none;
  }
}

</style>
  