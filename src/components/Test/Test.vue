<template>
  <div>
    <Radio-group v-model="phone">
        <Radio label="apple">
<!--            <Icon type="social-apple"></Icon>-->
            <span>Apple</span>
        </Radio>
        <Radio label="android">
<!--            <Icon type="social-android"></Icon>-->
            <span>Android</span>
        </Radio>
        <Radio label="windows">
<!--            <Icon type="social-windows"></Icon>-->
            <span>Windows</span>
        </Radio>
    </Radio-group>
    </div>
</template>
<script>
  import {RadioGroup} from 'iview'
  export default {
        data () {
            return {
                phone: 'apple',
                animal: '爪哇犀牛'
            }
        }
    }
</script>
<style>

</style>
