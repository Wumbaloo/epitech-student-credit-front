<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <div class="d-flex align-center">
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
        text
        large
      >
        <span class="subtitle-2 mr-2 hidden-sm-and-down">Déconnexion</span>
        <v-icon>mdi-power-standby</v-icon>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>
