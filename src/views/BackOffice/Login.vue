<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" lg="10" xl="5">
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
                v-model="usernameText"
                @keyup.enter="tryLogin"
                label="Nom d'utilisateur"
                prepend-icon="mdi-account"
                clearable
            >
            </v-text-field>
            <v-text-field
                v-model="passwordText"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :type="!showPassword ? 'password' : 'text'"
                @keyup.enter="tryLogin"
                label="Mot de passe"
                prepend-icon="mdi-lock"
                clearable
            >
            </v-text-field>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions style="flex-wrap: wrap">
            <v-spacer></v-spacer>
            <v-btn
                @click="tryLogin"
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
import axios from "axios";
import sha256 from "sha256";

export default {
  name: 'BackOffice-Login',
  data: () => ({
    usernameText: "",
    passwordText: "",
    showPassword: false
  }),
  methods: {
    tryLogin: function () {
      axios
        .post("backoffice/login", {
          'username': this.usernameText,
          'password': sha256(this.passwordText)
        })
        .then((response) => {
          if (!response.data.success) {
            this.$toasted.show("Une erreur est survenue.", {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
            console.error(response.data.error);
            return;
          }
          this.usernameText = "";
          this.passwordText = "";
          this.$store.commit("setAccessToken", response.data.data.accessToken);
          this.$router.push({ name: 'backoffice-index' }).catch(() => {});
        }).catch((err) => {
        this.$toasted.show("Une erreur est survenue.", {
          theme: "bubble",
          position: "bottom-center",
          duration : 5000
        });
        console.error(err);
        this.$router.push({ name: 'home' }).catch(() => {});
      });
    }
  }
}
</script>
