import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import fr from "vuetify/lib/locale/fr";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#126ba5',
        secondary: '#b0bec5',
        accent: '#8c9eff',
        error: '#b71c1c',
      },
    },
  },
  lang: {
    locales: { fr },
    current: 'fr'
  }
});
