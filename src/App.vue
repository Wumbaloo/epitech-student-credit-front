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

<!--        <span class="text-md-h4 font-weight-light">Profil étudiant</span>-->
      </div>

      <v-spacer></v-spacer>

      <v-btn
          v-if="$route.name !== 'calculator'"
          v-show="logged"
          text
          large
          to="calculator"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Calculatrice de crédits</span>
        <v-icon>mdi-math-compass</v-icon>
      </v-btn>
      <v-btn
          v-else-if="$route.name === 'calculator'"
          text
          large
          to="about"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Profil étudiant</span>
        <v-icon>mdi-account</v-icon>
      </v-btn>
      <v-btn
        text
        large
        @click="logout"
        v-if="logged"
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Déconnexion</span>
        <v-icon>mdi-power-standby</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <keep-alive>
        <router-view/>
      </keep-alive>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    logged: false,
  }),
  created() {
    this.logged = (this.$cookies.get("autologin") || this.getAutologin);
  },
  updated() {
    this.logged = (this.$cookies.get("autologin") || this.getAutologin);
  },
  methods: {
    goToHomepage() {
      if (!this.logged)
        this.$router.push('/').catch(() => {});
      else if (this.logged)
        this.$router.push({ name: 'about' }).catch(() => {});
    },
    logout() {
      this.$cookies.set("user", "", "1m");
      this.$cookies.set("autologin", "", "1m");
      this.$router.push({ name: 'home' }).catch(() => {});
    }
  }
};
</script>
