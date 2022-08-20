<template>
  <v-app>
    <v-main>
      <Tester />
    </v-main>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Tester from './components/Tester.vue';

export default defineComponent({
  name: 'App',

  components: {
    Tester
  },
})
</script>
