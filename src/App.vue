<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center" @click="goToHomepage" style="cursor: pointer">
        <v-img
          alt="Epitech Logo"
          class="shrink mr-4"
          contain
          :src="require('./assets/logo.png')"
          transition="scale-transition"
          width="125"
        />
      </div>

      <v-spacer></v-spacer>

      <v-btn
          v-show="$route.name === 'about'"
          text
          large
          @click="goToCalculator"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Simulateur</span>
        <v-icon>mdi-math-compass</v-icon>
      </v-btn>
      <v-btn
          v-show="$route.name === 'calculator'"
          text
          large
          @click="goToAbout"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Profil étudiant</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn
        text
        large
        @click="logout"
        v-show="$route.name !== 'home'"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Déconnexion</span>
        <v-icon>mdi-power-standby</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
<!--      <keep-alive>-->
        <router-view/>
<!--      </keep-alive>-->
      <Footer></Footer>
      <v-bottom-sheet
          v-model="toggleCookies"
          class="cookies-popup"
          persistent>
        <v-sheet class="text-center">
          <v-btn
              class="mt-6"
              dark
              color="green"
              @click="acceptCookies"
          >Accepter</v-btn>
          <v-row class="pt-3 pb-6" justify="center" align="center" no-gutters>
            <v-col cols="12" lg="8">
              En cliquant sur <i>"Accepter"</i>, vous agréez à l’utilisation de cookies en vue de permettre le <b>stockage de votre autologin dans votre navigateur</b> pour vos prochaines authentifications.
              <br>En aucun cas <b>Epi-Planner</b> ne peut accéder à vos autologin.
            </v-col>
          </v-row>
        </v-sheet>
      </v-bottom-sheet>
    </v-main>
  </v-app>
</template>

<script>
import Footer from "./components/Footer";

export default {
  name: 'App',
  components: {Footer},
  data: () => ({
    logged: false,
    toggleCookies: false,
  }),
  created() {
    this.logged = (this.$cookies.get("autologin") || this.getAutologin);
    if (this.$route.name === "home" && this.logged && this.$cookies.get("acceptCookies"))
      this.$router.push({ name: 'about' }).catch(() => {});
    this.toggleCookies = !this.$cookies.get("acceptCookies");
  },
  updated() {
    this.logged = (this.$cookies.get("autologin") || this.getAutologin);
    if (this.$route.name === "home" && this.logged && this.$cookies.get("acceptCookies"))
      this.$router.push({ name: 'about' }).catch(() => {});
    this.toggleCookies = !this.$cookies.get("acceptCookies");
  },
  methods: {
    goToHomepage() {
      if (!this.logged)
        this.$router.push('/').catch(() => {});
      else if (this.logged)
        this.$router.push({ name: 'about' }).catch(() => {});
    },
    goToCalculator() {
      this.$router.push({ name: 'calculator'}).catch(() => {});
      this.toggleCookies = !this.$cookies.get("acceptCookies");
    },
    goToAbout() {
      this.$router.push({ name: 'about'}).catch(() => {});
      this.toggleCookies = !this.$cookies.get("acceptCookies");
    },
    logout() {
      this.$cookies.set("user", "", "1m");
      this.$cookies.set("autologin", "", "1m");
      this.$router.push({ name: 'home' }).catch(() => {});
    },
    acceptCookies() {
      this.toggleCookies = false;
      this.$cookies.set("acceptCookies", true, 2147483647);
    }
  }
};
</script>

<style scoped>
  .cookies-popup {
    position: absolute;
  }
</style>
