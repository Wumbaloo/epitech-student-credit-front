<template>
  <v-dialog
      v-model="innerValue"
      width="960"
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
      >
        Module Hub
      </v-card-title>
      <v-card-text class="mt-4">
        <v-skeleton-loader
            type="table"
            :loading="loading"
          >
          <v-row no-gutters justify="space-between">
            <div>
              Responsable{{ module['resp'] && module['resp'].length > 1 ? 's' : ''}} du module HUB :
              <ul>
                <li v-for="resp in module['resp']" :key="resp.title">
                  {{ resp.title }}
                </li>
              </ul>
            </div>
            <span class="text-center">
              Vous avez {{ xp }} XP.*
            </span>
          </v-row>
          <v-card outlined class="pa-2 mt-4">
            <v-row no-gutters> <!-- @TODO: View mobile mode -->
              <v-col cols="3">
                Type d'activité
              </v-col>
              <v-col cols="3" class="text-center">
                Nombre d'expériences
              </v-col>
              <v-col cols="2" class="text-center">
                Meetup / Talk
              </v-col>
              <v-col cols="2" class="text-center">
                Workshop
              </v-col>
              <v-col cols="2" class="text-center">
                Hackathon
              </v-col>
            </v-row>
          </v-card>
          <v-card outlined class="pa-2">
            <v-row no-gutters>
              <v-col cols="3">
                Participations
              </v-col>
              <v-col v-for="(column, i) in columns"
                     class="text-center"
                     :key="i"
                     :cols="i === 0 ? 3 : 2">
                {{ presences[column.title] }}
              </v-col>
            </v-row>
          </v-card>
          <v-card outlined class="pa-2">
            <v-row no-gutters>
              <v-col cols="3">
                Organisations
              </v-col>
              <v-col v-for="(column, i) in columns"
                     class="text-center"
                     :key="i"
                     :cols="i === 0 ? 3 : 2">
                {{ organisations[column.title] }}
              </v-col>
            </v-row>
          </v-card>
          <v-card outlined class="pa-2">
            <v-row no-gutters>
              <v-col cols="3">
                Absences
              </v-col>
              <v-col v-for="(column, i) in columns"
                     class="text-center"
                     :key="i"
                     :cols="i === 0 ? 3 : 2">
                {{ missing[column.title] }}
              </v-col>
            </v-row>
          </v-card>
          <v-row no-gutters justify="center" class="mt-5 red--text">
            <v-col cols="12" style="text-align: center">
              <span>*Les projets HUB ne sont pas comptabilisés dans ce récapitulatif, pour plus d'informations, rapprochez-vous des <span class="font-weight-bold">responsables du module.</span></span>
            </v-col>
          </v-row>
        </v-skeleton-loader>
      </v-card-text>
      <v-divider></v-divider>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
            color="primary"
            text
            @click="closeDialog">
          Fermer
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
      xp: 0,
      loading: false,
      columns: [
        {
          title: "xp",
          possible_names: ["Experience"],
          points: [
            {present: 3, missing: 0}, // Participation
            {present: 0, missing: 0} // Organization
          ]
        },
        {
          title: "talk",
          possible_names: ["Talk", "Meetup"],
          points: [
            {present: 1, missing: 1}, // Participation
            {present: 4, missing: 6} // Organization
          ]
        },
        {
          title: "workshop",
          possible_names: ["Workshop"],
          points: [
            {present: 2, missing: 2}, // Participation
            {present: 7, missing: 10} // Organization
          ]
        },
        {
          title: "hackaton",
          possible_names: ["Hackathon"],
          points: [
            {present: 6, missing: 6}, // Participation
            {present: 15, missing: 20} // Organization
          ]
        }
      ],
      presences: {xp: 0, talk: 0, workshop: 0, hackaton: 0},
      organisations: {xp: 0, talk: 0, workshop: 0, hackaton: 0},
      missing: {xp: 0, talk: 0, workshop: 0, hackaton: 0},
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
          this.$emit('close');
        this.$emit('input', val);
      }
    },
    methods: {
      closeDialog() {
        this.innerValue = false;
        this.$emit('close');
      },
      updateScore(name, status, manager) {
        if (!status)
          return;
        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].possible_names.includes(name)) {
            if (status === "present" || status === "accept") {
              this.xp += this.columns[i].points[manager].present;
              if (manager === 1)
                this.organisations[this.columns[i].title]++;
              else
                this.presences[this.columns[i].title]++;
            } else {
              this.xp -= this.columns[i].points[manager].missing;
              this.missing[this.columns[i].title]++;
            }
          }
        }
      },
      setupInformations() {
        let acti = this.module['activites'];

        for (let i = 0; i < acti.length; i++) {
          for (let j = 0; j < acti[i]['events'].length; j++) {
            let organize = false;
            for (let k = 0; k < acti[i]['events'][j]['assistants'].length; k++) {
              if (acti[i]['events'][j]['assistants'][k]['login'] === this.student['login']) {
                this.updateScore(acti[i]['type_title'], acti[i]['events'][j]['assistants'][k]['manager_status'], 1);
                organize = true;
              }
            }
            if (!organize) {
              this.updateScore(acti[i]['type_title'], acti[i]['events'][j]['user_status'], 0);
            }
          }
        }
        this.loading = false;
      },
      refreshDetails() {
        let autologin = this.$cookies.get("autologin") || this.getAutologin;

        if (!this.student['scolaryear'] || this.loading)
          return;
        this.loading = true;
        let location = this.student['location'].split('/')[1];
        // if (!location)
        //   location = "LIL";
        axios
          .get("module/info/B-INN-000/" + location + "-0-1/" + this.student['scolaryear'], {
            headers: {
              'autologin': autologin
            }
          })
          .then((response) => {
            if (response.data.error) {
              // this.$toasted.show(response.data.message, {
              //   theme: "bubble",
              //   position: "bottom-center",
              //   duration: 5000
              // });
              this.$router.push({name: 'home'}).catch(() => {
              });
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
  span {
    white-space: pre-wrap;
  }
</style>
