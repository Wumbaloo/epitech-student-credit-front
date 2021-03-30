<template>
  <v-dialog
      v-model="dialog"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-footer
          color="primary lighten-1"
          padless
      >
        <v-row
            justify="center"
            no-gutters
        >
          <v-col
              class="primary lighten-2 py-4 text-center white--text"
              cols="12"
          >
            {{ new Date().getFullYear() }} — <strong>Epi-Planner</strong> —
            <v-btn
                text
                fab
                rounded
                class="my-2"
                v-bind="attrs"
                v-on="on"
            >
              <v-icon color="white">mdi-cookie</v-icon>
            </v-btn>
            <br>
            Made with &hearts; by <a href="https://www.linkedin.com/in/william-gaudfrin/">William Gaudfrin</a>
          </v-col>
        </v-row>
      </v-footer>
    </template>

    <v-card>
      <v-card-title class="headline grey lighten-2">
        Politique de Cookies
      </v-card-title>

      <v-card-text>
        <p style="white-space: pre-wrap; word-break: break-word">
          Le site internet de la société Epi-Planner utilise des cookies. Vous trouverez ci-dessous des informations relatives aux cookies et à la manière de les limiter :
          <br><br>
          <b>1. Qu’est-ce qu’un cookie ?</b><br><br>
          Les cookies sont des fichiers textes qui sont susceptibles d’être déposés – sous réserve de vos choix – sur le disque dur de votre ordinateur ou de votre appareil mobile, à l’occasion de la consultation d’un site internet. A chaque visite ultérieure, les cookies sont renvoyés au site internet émetteur, qui sera en mesure de reconnaître le terminal dans lequel ils sont enregistrés.<br>
          Lors de la consultation du site internet de la société Epi-Planner, les informations mentionnées à l’article 2 – « Quels cookies utilisons-nous sur les sites » sont susceptibles d’être enregistrées dans les fichiers cookies installés sur le disque dur de votre ordinateur ou de votre appareil mobile, sous réserve des choix que vous auriez exprimés concernant lesdits cookies.<br>
          <br><br>
          <b>2. Quels cookies utilisons-nous sur les sites ?</b><br><br>
          Lorsque vous naviguez sur le site internet de la société Epi-Planner, nous pouvons être amenés à installer des cookies variés sur le disque dur de votre ordinateur ou de votre appareil mobile. Les cookies utilisés par le site internet Epi-Planner le sont pour les finalités décrites ci-dessous, sous réserve de vos choix.<br>
          Les cookies de fonctionnement. Lorsque vous naviguez sur le site internet de la société Epi-Planner, nous pouvons être amenés à installer des cookies qui sont nécessaires au fonctionnement de nos sites internet. Il s’agit par exemple, des cookies qui vous permettent d’accéder aux zones sécurisées de nos sites. Nous vous informons que ces cookies ne collectent pas d’information pouvant être utilisées à des fins de marketing ou permettant de garder en mémoire votre historique de navigation sur internet. Cette catégorie de cookies ne peut pas être désactivée.<br>
          Les cookies d’analyse. Lorsque vous naviguez sur le site internet de la société Epi-Planner, nous pouvons être amenés à installer, sous réserve de vos choix, des cookies d’analyse sur votre terminal. Ils nous permettent de reconnaître, compter le nombre de visiteurs et de connaître la manière dont ces derniers se déplacent sur nos sites internet. Cela nous aide à améliorer la fonctionnalité de ces derniers, par exemple, en s’assurant que les utilisateurs trouvent facilement ce qu’ils cherchent.<br>
          Les cookies de fonctionnalité. Lorsque vous naviguez sur le site internet de la société Epi-Planner, nous pouvons être amenés, sous réserve de vos choix, à installer des cookies variés sur le disque dur de votre ordinateur ou de votre appareil mobile, nous permettant de vous reconnaître lorsque vous revenez sur un de nos sites internet. Cela nous permet de personnaliser notre contenu et de garder en mémoire vos préférences.<br>
            Les cookies émis sur nos sites par nos partenaires. Nos sites internet utilisent des cookies Google Analytics. Les informations collectées par les cookies Google Analytics seront transmises et hébergées par Google sur des serveurs situés aux Etats-Unis d’Amérique conformément à leur politique de confidentialité. Pour une présentation de la politique de confidentialité de Google et savoir comment cela s’applique à Google Analytics, visitez http://www.google.com/intl/fr/policies/.<br>
        </p>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="dialog = false"
        >
          J'accepte
        </v-btn>
      </v-card-actions>
    </v-card>

  </v-dialog>
</template>

<script>
  export default {
    name: "Footer",
    data: () => ({
      dialog: false
    })
  }
</script>

<style scoped>
  a {
    font-weight: bold;
    text-decoration: none;
  }
  a:hover {
    cursor: pointer;
    text-decoration: none;
  }
</style>
