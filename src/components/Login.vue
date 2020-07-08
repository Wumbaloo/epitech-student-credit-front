<template>
  <v-container fill-height>
    <v-row justify="center" align="center" class="fill-height">
      <v-col cols="12" md="5">
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
                label="URL d'auto-login"
                prepend-icon="mdi-account"
            >

            </v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  export default {
    name: "Login",
    data: () => ({
      loginText: "",
      rules: {
        required: value => !!value || 'Required.',
        epitechURL: value => {
          const pattern = /(https?:\/\/(.+?\.)?intra.epitech\.eu(\/[A-Za-z0-9\-\._~:\/\?#\[\]@!$&'\(\)\*\+,;\=]*)?)/;
          return pattern.test(value) || "URL invalide"
        }
      }
    }),
    methods: {
      saveAutoLogin: function () {

        this.$cookies.set("autologin", this.loginText, "14d");
        this.$store.commit("setAutologin", this.loginText);
        this.$router.push('about');
      }
    }
  }
</script>

<style scoped>

</style>