<template>
  <v-dialog
      v-model="innerValue"
      width="380"
  >
    <template v-slot:activator="{ on, attrs }">
      <div v-on="on">
        <slot name="activator"></slot>
      </div>
    </template>
    <v-card>
      <v-card-title
          class="headline grey lighten-2"
          primary-title
          style="word-break: break-word"
      >
        Choisir le nombre de crédits HUB visé
      </v-card-title>
      <v-card-text class="mt-4">
        <v-slider
            v-model="credit"
            label="Crédits"
            thumb-label="always"
            hide-details
            min="0"
            max="8"
            class="mt-12"
        >
        </v-slider>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="closeDialog">
          Valider
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import axios from "axios";

  export default {
    name: "HubTable",
    props: {
      value: {
        type: null,
        default: null
      },
      student: {}
    },
    created() {
      this.innerValue = this.value;
      this.refreshDetails();
    },
    data: () => ({
      module: [],
      loading: false,
      credit: 0,
      innerValue: false
    }),
    watch: {
      value(val) {
        this.innerValue = val;
      },
      student(val) {
        this.refreshDetails();
      },
      innerValue(val) {
        if (!val)
          this.$emit('close', this.credit);
        this.$emit('input', val);
      }
    },
    methods: {
      closeDialog() {
        this.innerValue = false;
        this.$emit('close', this.credit);
      },
      updateScore(status) {
        if (!status)
          return;
        if (status === "present" || status === "accept") {
          this.presences++;
        } else
          this.missing++;
      },
      setupInformations() {
        let acti = this.module['activites'];

        for (let i = 0; i < acti.length; i++) {
          for (let j = 0; j < acti[i]['events'].length; j++)
            this.updateScore(acti[i]['events'][j]['user_status']);
        }
        this.loading = false;
      },
      refreshDetails() {
        let autologin = this.$cookies.get("autologin") || this.getAutologin;

        if (!this.student || !this.student['scolaryear'] || this.loading)
          return;
        this.loading = true;
        let location = this.student['location'].split('/')[1];
        // if (!location)
        //   location = "LIL";
        axios
          .get("module/info/B-PCP-000/" + location + "-0-1/" + this.student['scolaryear'], {
            headers: {
              'autologin': autologin
            }
          })
          .then((response) => {
            if (response.data.error) {
              // this.$toasted.show("Une erreur est survenue. Veuillez réessayez.", {
              //   theme: "bubble",
              //   position: "bottom-center",
              //   duration: 5000
              // });
              // this.$router.push({name: 'home'}).catch(() => {
              // });
              return;
            }
            this.module = response.data;
            this.setupInformations();
          });
        //   }).catch((err) => {
        //   this.$toasted.show(err.message, {
        //     theme: "bubble",
        //     position: "bottom-center",
        //     duration : 5000
        //   });
        //   this.$router.push({ name: 'home' }).catch(() => {});
        // });
      }
    }
  }
</script>

<style scoped>

</style>
