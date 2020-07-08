<template>
  <Login/>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: {
    Login
  },
  created: function() {
    document.title = "Page d'accueil";
  }
}
</script>
