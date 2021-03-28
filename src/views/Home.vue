<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center">
      <v-col cols="12" lg="5">
        <Login @toggleHelp="toggleHelp"/>
      </v-col>
      <v-col cols="12" lg="8"
             v-if="showHelp">
        <v-stepper v-model="helpState">
          <v-stepper-header>
            <v-stepper-step :complete="helpState > 1" step="1">Visitez l'intranet</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step :complete="helpState > 2" step="2">Copiez votre autologin</v-stepper-step>

            <v-divider></v-divider>

            <v-stepper-step step="3">Collez-le dans le champ spécifié</v-stepper-step>
          </v-stepper-header>

          <v-stepper-items>
            <v-stepper-content step="1">
              <v-card
                  outlined
                  class="mb-12"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12" class="d-flex justify-center align-center">
                    <span class="text-center">
                      Rendez-vous dans la section "<span class="font-weight-medium">Administration</span>" sur l'intranet grâce au bouton ci-dessous, ou bien grâce au lien suivant :
                      <br>
                      <a href="https://intra.epitech.eu/admin/autolog">https://intra.epitech.eu/admin/autolog</a>
                    </span>
                  </v-col>
                  <v-col cols="12" class="d-flex justify-center align-center">
                    <v-btn
                        @click="goToAutologPage"
                        color="secondary"
                    >
                      Epitech Intranet
                    </v-btn>
                  </v-col>
                  <v-col cols="12" lg="6" class="d-flex justify-center align-center">
                    <v-img :src="require('@/assets/tutorial/step_1.png')"
                           contain
                           style="border: 2px solid blue"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn
                  color="primary"
                  @click="helpState = 2"
              >
                Suivant
              </v-btn>
            </v-stepper-content>

            <v-stepper-content step="2">
              <v-card
                  outlined
                  class="mb-12"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12" class="d-flex justify-center align-center">
                    Cliquez droit sur le lien d'autologin et sélectionnez "<span class="font-weight-medium">Copier l'adresse du lien</span>"
                  </v-col>
                  <v-col cols="12" lg="6" class="d-flex justify-center align-center">
                    <v-img :src="require('@/assets/tutorial/step_2.png')"
                           contain
                           style="border: 2px solid blue"
                    ></v-img>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn
                  color="primary"
                  @click="helpState = 3"
              >
                Suivant
              </v-btn>

              <v-btn @click="helpState = 1" text>Revenir au début</v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
              <v-card
                  outlined
                  class="mb-12"
              >
                <v-row justify="center" align="center">
                  <v-col cols="12" class="d-flex justify-center align-center">
                    Cliquez droit sur le champ ci-dessus et sélectionnez "<span class="font-weight-medium">Collez</span>"
                  </v-col>
                  <v-col cols="12" lg="6" class="d-flex justify-center align-center">
                    <v-img :src="require('@/assets/tutorial/step_3.png')"
                           contain
                    ></v-img>
                  </v-col>
                </v-row>
              </v-card>

              <v-btn @click="helpState = 1" text>Revenir au début</v-btn>
              <v-btn @click="toggleHelp()" text>Fermer l'aide</v-btn>
            </v-stepper-content>
          </v-stepper-items>
        </v-stepper>
      </v-col>
    </v-row>
    <v-btn
        color="red"
        fab
        absolute
        large
        dark
        bottom
        left
        :to="{ name: 'backoffice-auth' }"
        class="mb-12"
    >
      <v-icon>mdi-login</v-icon>
    </v-btn>
  </v-container>
</template>

<script>
import Login from '@/components/Login.vue'

export default {
  name: 'Home',
  components: {
    Login
  },
  data: () => ({
    showHelp: false,
    helpState: 1
  }),
  created() {
    let autologin = this.$cookies.get("autologin") || this.getAutologin;

    this.$store.commit("setAutologin", autologin);
    if (autologin && this.$cookies.get("acceptCookies"))
      this.$router.push('about');
  },
  updated() {
    this.$destroy();
  },
  methods: {
    toggleHelp(forceClose) {
      if (forceClose)
        this.showHelp = false;
      else
        this.showHelp = !this.showHelp;
      this.helpState = 1;
    },
    goToAutologPage() {
      window.location.href = "https://intra.epitech.eu/admin/autolog";
    }
  }
}
</script>
