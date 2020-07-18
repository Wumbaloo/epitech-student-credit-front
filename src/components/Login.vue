<template>
  <v-card
      shaped
  >
    <v-card-title
        class="headline blue darken-3 white--text"
        primary-title
    >
      Identification
    </v-card-title>

    <v-card-text class="my-10">
      <v-text-field
          v-model="loginText"
          :rules="[rules.required, rules.epitechURL]"
          label="Collez votre autologin"
          prepend-icon="mdi-account"
      >

      </v-text-field>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions style="flex-wrap: wrap">
      <v-btn
          @click="$emit('toggleHelp')"
          class="mr-3"
          text
          color="red"
      >
        Comment récupérer son autologin ?
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
          @click="saveAutoLogin"
          class="mr-3"
          color="primary"
      >
        Se connecter
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    name: "Login",
    data: () => ({
      loginText: "",
      rules: {
        required: value => !!value || 'Champ requis.',
        epitechURL: value => {
          const pattern = /(https?:\/\/(.+?\.)?intra.epitech\.eu(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/;
          return pattern.test(value) || "URL invalide"
        }
      },
      requireHelp: false
    }),
    methods: {
      saveAutoLogin: function () {
        const pattern = /(https?:\/\/(.+?\.)?intra.epitech\.eu(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/;
        if (!this.loginText || !pattern.test(this.loginText))
          return;
        this.$cookies.set("autologin", this.loginText, "14d");
        this.$store.commit("setAutologin", this.loginText);
        this.$router.push('about');
      }
    }
  }
</script>

<style scoped>

</style>