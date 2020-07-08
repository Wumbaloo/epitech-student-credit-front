<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="8">
        <v-row justify="center" align="center">
          <v-col cols="12" md="6">
            <v-card
              class="mx-auto"
              shaped
            >
              <div class="pa-3">
                <span class="text-h6">Profil étudiant : </span><span class="body-1">{{ student['login'] }}</span>
                <v-divider class="my-3"></v-divider>
                <v-row class="ma-4" justify="center">
                  <v-avatar size="105" height="120">
                    <v-img
                      class="profile-img"
                      src="https://intra.epitech.eu/file/userprofil/commentview/william.gaudfrin.jpg"
                      alt="Student profile"
                      contain
                      transition="scale-transition"
                    >
                    </v-img>
                  </v-avatar>
                </v-row>
                <div class="text-center">
                  <h3 class="font-weight-medium">{{ student['title'] }}</h3>
                  <div class="subtitle-2 grey--text my-3">
                    <span v-if="student && student['groups'] && student['groups'][0]">
                      {{ student['groups'][0].title }}
                    </span>
                    <span v-else>
                      Lille
                    </span>
                  </div>
                </div>
                <v-divider></v-divider>
                <v-card-text>
                  <v-row justify="space-between">
                    <span class="font-weight-bold">Cursus</span>
                    <span class="font-weight-medium blue--text">{{ student['course_code'] }}</span>
                  </v-row>
                </v-card-text>
                <v-divider></v-divider>
                <v-card-text>
                <v-row justify="space-between">
                    <span class="font-weight-bold">Promotion</span>
                    <span class="font-weight-medium blue--text">{{ student['promo'] }}</span>
                  </v-row>
                </v-card-text>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="10" class="modules-table">
            <v-expansion-panels
              accordion
              multiple
              focusable>
              <v-expansion-panel readonly disabled>
                <v-expansion-panel-header>
                  <v-row no-gutters>
                    <v-col cols="4">
                      Barrage
                    </v-col>
                    <v-col cols="4" style="text-align: center">
                      Nombre de crédits en attente
                    </v-col>
                    <v-col cols="4" style="text-align: center">
                      Nombre de crédits obtenus
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content></v-expansion-panel-content>
              </v-expansion-panel>
              <v-expansion-panel
                  :readonly="!item.is_roadblock"
                  :class="!item.is_roadblock ? 'hide-icon' : 'show-icon'"
                  v-for="(item, i) in barrages"
                  :key="i"
              >
                <v-expansion-panel-header expand-icon="mdi-menu-down">
                  <v-row no-gutters>
                    <v-col cols="4">
                      {{ item.name }}
                    </v-col>
                    <v-col cols="4" style="text-align: center">
                      {{ item.credits_remains }}
                    </v-col>
                    <v-col cols="4" style="text-align: center">
                      {{ item.credits_obtains }}
                      <span v-if="item.credits_needed">
                        / {{ item.credits_needed}}
                      </span>
                    </v-col>
                  </v-row>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table
                      disable-sort
                      hide-default-footer
                      v-if="item.is_roadblock"
                      :headers="detailsHeader"
                      :loading="detailLoading"
                      calculate-widths
                      :items="item.details[student['studentyear'] - 1]"
                  >
                    <template v-slot:item.title="{ item }">
                      {{ item.title }} ({{ item.codemodule }})
                    </template>
                    <template v-slot:item.credits="{ item }">
                      <span v-if="item['credits']">
                        {{ item['credits'] }}
                      </span>
                      <span v-else>
                        -
                      </span>
                    </template>
                    <template v-slot:item.grade="{ item }">
                      <v-chip
                          v-if="item.registered && isModuleObtained(item['grade']) === 2"
                          color="green"
                          small
                          text-color="white">
                        Acquis
                      </v-chip>
                      <v-chip
                          v-else-if="item.registered && isModuleObtained(item['grade']) === 1"
                          color="red"
                          small
                          text-color="white">
                        Échec
                      </v-chip>
                      <v-chip
                          v-else-if="item.registered"
                          color="primary"
                          small
                          text-color="white">
                        En cours
                      </v-chip>
                      <v-chip
                          v-else
                          color="red"
                          small
                          text-color="white">
                        Non inscrit
                      </v-chip>
                    </template>
                    <template v-slot:no-data>
                      Pas de module trouvé pour ce roadblock
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-col>
        </v-row>
      </v-col>
      <loading :active.sync="isLoading"
               is-full-page
               color="#007bff"
               :height="128"
               :width="128"
      ></loading>
    </v-row>
  </v-container>
</template>

<script>
  import { mapGetters } from 'vuex';
  import Loading from 'vue-loading-overlay';
  import 'vue-loading-overlay/dist/vue-loading.css';
  import axios from "axios";

  export default {
    name: "About",
    computed: {
      ...mapGetters(["getAutologin"])
    },
    components: {
      Loading
    },
    methods: {
      isModuleObtained: function(grade) {
        if (!grade)
          return (0);
        if (grade !== '-' && grade.toLowerCase().indexOf("echec") === -1)
          return (2);
        else if (grade === '-')
          return (1);
        return (0);
      },
      getModuleInfo: function (code) {
        let modules = [];

        for (let i = 0; i < this.student.modules.length; i++) {
          if (this.student.modules[i]['codemodule'] === code &&
            parseInt(this.student.modules[i]['scolaryear']) === parseInt(this.student['scolaryear']))
            modules.push(this.student.modules[i]);
        }
        return modules;
      },
      getModuleInstance: function(module) {
        if (!module || !this.student)
          return null;
        let location = this.student['location'].split('/')[1];
        if (module['codeinstance'])
          return (location + "-" + module['codeinstance']);
        return (location + "-" + module['codemodule'].split('-')[2][0] + "-1");
      },
      getNotRegisteredModuleInfo: function (code, instance) {
        let promise = new Promise((resolve, reject) => {
          if (!code || !instance)
            reject(Error("No code or instance provided."));
          let autologin = this.$cookies.get("autologin") || this.getAutologin;
          if (!autologin)
            // @TODO: Redirect to home with a toast saying that an autologin is needed
            reject(Error("No autologin provided."));
          axios
            .get("module/info/" + code + "/" + instance + "/" + this.student['scolaryear'], {
              headers: {
                'autologin': autologin
              }
            })
            .then((response) => {
              resolve(response.data);
            });
        });
        return (promise);
      },
      getModuleNote: function (code) {
        for (let i = this.student['notes'].length - 1; i >= 0; i--) {
          if (this.student['notes'][i]['codemodule'] === code &&
            parseInt(this.student['notes'][i]['scolaryear']) === parseInt(this.student['scolaryear'])) {
            return (this.student['notes'][i]);
          }
        }
        return null;
      },
      updateRoadblockInfo: function (roadblock) {
        if (!roadblock || !roadblock.is_roadblock)
          return;
        let yearBlock = roadblock.details[this.student['studentyear'] - 1];
        roadblock.credits_needed = yearBlock.needed;
        let newYearBlock = [];
        if (roadblock.name === "Innovation") {
          console.log(yearBlock.modules);
        }
        for (let i = 0; i < yearBlock.modules.length; i++) {
          let modules = this.getModuleInfo(yearBlock.modules[i]['codemodule']);
          if (!modules || modules.length === 0) {
            let instance = this.getModuleInstance(yearBlock.modules[i]);
            this.getNotRegisteredModuleInfo(yearBlock.modules[i]['codemodule'], instance)
            .then((res) => {
              res.registered = false;
              if (!res.error &&
                parseInt(res['scolaryear']) === parseInt(this.student['scolaryear'])) {
                newYearBlock.push(res);
              }
            })
            // newYearBlock.push({
            //   // Fetch not know module with the API + check studentyear avec l'année du module
            //   title: "Not registered",
            //   codemodule: yearBlock.modules[i]['codemodule']
            // })
            continue;
          }
          if (roadblock.name === "Innovation") {
            console.log(modules);
          }
          for (let x = 0; x < modules.length; x++) {
            modules[x].registered = true; //@TODO: Check l'année du module avec studentyear
            newYearBlock.push(modules[x]);
            if (this.isModuleObtained(modules[x]['grade']) === 2)
              roadblock.credits_obtains += modules[x]['credits'];
            else if (this.isModuleObtained(modules[x]['grade']) === 1)
              roadblock.credits_remains += modules[x]['credits'];
          }
        }
        roadblock.details[this.student['studentyear'] - 1] = newYearBlock;
      },
      setupInformations: function () {
        console.log(this.student);
        this.barrages[0].credits_obtains = this.student['credits'];
        this.barrages[0].credits_needed = parseInt(this.student['studentyear']) * 60;
        this.isLoading = false;
        let tepitech = this.getModuleNote("B-ANG-058");
        if (tepitech)
          this.barrages[1].credits_obtains = tepitech['final_note'];
        for (let i = 3; i < this.barrages.length; i++)
          this.updateRoadblockInfo(this.barrages[i]);
        this.detailLoading = false;
      }
    },
    created: function () {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;
      this.isLoading = true;

      axios
        .get("student/info", {
          headers: {
            'autologin': autologin
          }
        })
        .then((response) => {
          this.student = response.data;
          this.setupInformations();
        }).catch((err) => {
          this.$toasted.show(err.message, {
            theme: "bubble",
            position: "bottom-center",
            duration : 5000
          });
      });
    },
    data: () => ({
      isLoading: false,
      detailLoading: true,
      student: {
      },
      detailsHeader: [
        {
          text: "Titre",
          value: "title",
          width: "31.5%"
        },
        {
          text: "État",
          value: "grade",
          align: "center",
          width: "34%"
        },
        {
          text: "Crédits",
          value: "credits",
          align: "center",
          width: "34%"
        }
      ],
      headers: [
        {
          text: "Barrage",
          value: "name"
        },
        {
          text: "Nombre de crédits obtenus",
          value: "credits_obtains"
        },
        {
          text: "Nombre de crédits en attente",
          value: "credits_remains"
        }
      ],
      barrages: [
        {
          name: "Crédits",
          credits_obtains: 0,
          credits_needed: 60,
          credits_remains: 0
        },
        {
          name: "Anglais",
          credits_obtains: 0,
          credits_needed: null,
          credits_remains: "N/A"
        },
        {
          name: "Roadblocks",
        },
        {
          name: "Foundation",
          is_roadblock: true,
          credits_obtains: 0,
          credits_needed: 0,
          credits_remains: 0,
          details: [
            { // Tek 1
              needed: 25,
              modules: [
                {codemodule: "B-CPE-100", codeinstance: "1-1"},
                {codemodule: "B-CPE-101", codeinstance: "1-1"},
                {codemodule: "B-CPE-110", codeinstance: "1-1"},
                {codemodule: "B-CPE-111", codeinstance: "1-1"},
                {codemodule: "B-PSU-100", codeinstance: "1-1"},
                {codemodule: "B-PSU-101", codeinstance: "1-1"},
                {codemodule: "B-CPE-200", codeinstance: "2-1"},
                {codemodule: "B-CPE-201", codeinstance: "2-1"},
                {codemodule: "B-PSU-200", codeinstance: "2-1"},
                {codemodule: "B-PSU-210", codeinstance: "2-1"},
                {codemodule: "B-MET-100", codeinstance: "1-1"},
                {codemodule: "B-MET-200", codeinstance: "2-1"},
              ]
            },
            { // Tek 2
              needed: 15,
              modules: [
                {codemodule: "B-CCP-400", codeinstance: "4-1"},
                {codemodule: "B-NWP-400", codeinstance: "4-1"},
                {codemodule: "B-OOP-400", codeinstance: "4-1"},
                {codemodule: "B-PSU-400", codeinstance: "4-1"},
                {codemodule: "B-YEP-400", codeinstance: "4-1"},
                {codemodule: "B-YEP-410", codeinstance: "4-1"},
                {codemodule: "B-CPP-300", codeinstance: "3-1"},
                {codemodule: "B-MET-400", codeinstance: "4-1"}
              ]
            },
            { // Tek 3
              needed: 10,
              modules: [
                {codemodule: "B-CPP-500", codeinstance: "5-1"},
                {codemodule: "B-CPP-501", codeinstance: "5-1"},
                {codemodule: "B-CPP-510", codeinstance: "5-1"},
                {codemodule: "B-DEV-500", codeinstance: "5-1"},
                {codemodule: "B-DEV-501", codeinstance: "5-1"},
                {codemodule: "B-DEV-510", codeinstance: "5-1"},
                {codemodule: "B-FUN-500", codeinstance: "5-1"},
                {codemodule: "B-FUN-501", codeinstance: "5-1"},
                {codemodule: "B-FUN-510", codeinstance: "5-1"}
              ]
            }
          ]
        },
        {
          name: "Supplement",
          is_roadblock: true,
          credits_obtains: 0,
          credits_needed: 0,
          credits_remains: 0,
          details: [
            { // Tek 1
              needed: 8,
              modules: [
                {codemodule: "B-MUL-100", codeinstance: "1-1"},
                {codemodule: "B-MAT-100", codeinstance: "1-1"},
                {codemodule: "B-MUL-200", codeinstance: "2-1"},
                {codemodule: "B-AIA-200", codeinstance: "2-1"},
                {codemodule: "B-SAD-200", codeinstance: "2-1"},
                {codemodule: "B-WEB-200", codeinstance: "2-1"},
                {codemodule: "B-MAT-200", codeinstance: "2-1"},
                {codemodule: "B-SEC-200", codeinstance: "2-1"},
              ]
            },
            { // Tek 2
              needed: 4,
              modules: [
                {codemodule: "B-CNA-410", codeinstance: "4-1"},
                {codemodule: "B-MAT-400", codeinstance: "4-1"},
                {codemodule: "B-NSA-400", codeinstance: "4-1"},
                {codemodule: "B-SHL-400", codeinstance: "4-1"},
                {codemodule: "B-PSU-402", codeinstance: "4-1"},
                {codemodule: "B-ASM-400", codeinstance: "4-1"},
                {codemodule: "B-FUN-400", codeinstance: "4-1"},
                {codemodule: "B-SEC-400", codeinstance: "4-1"}
              ]
            },
            { // Tek 3
              needed: 1,
              modules: [
                {codemodule: "B-AIA-500", codeinstance: "5-1"},
                {codemodule: "B-MAT-500", codeinstance: "5-1"},
                {codemodule: "B-SEC-500", codeinstance: "5-1"},
                {codemodule: "B-DOP-500", codeinstance: "5-1"}
              ]
            }
          ]
        },
        {
          name: "Innovation",
          is_roadblock: true,
          credits_obtains: 0,
          credits_needed: 0,
          credits_remains: 0,
          details: [
            { // Tek 1
              needed: 4,
              modules: [
                {codemodule: "B-INN-200", codeinstance: "2-1"},
                {codemodule: "G-JAM-001", codeinstance: "0-1"},
                {codemodule: "G-JAM-001", codeinstance: "0-2"},
                {codemodule: "G-JAM-001", codeinstance: "0-3"},
                {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
                {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
                {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
                {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
                {codemodule: "G-CUS-009", codeinstance: "0-1"},
              ]
            },
            { // Tek 2
              needed: 4,
              modules: [
                {codemodule: "B-INN-400"},
                {codemodule: "G-JAM-001", codeinstance: "0-1"},
                {codemodule: "G-JAM-001", codeinstance: "0-2"},
                {codemodule: "G-JAM-001", codeinstance: "0-3"},
                {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
                {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
                {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
                {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
                {codemodule: "G-CUS-009", codeinstance: "0-1"},
              ]
            },
            { // Tek 3
              needed: 13,
              modules: [
                {codemodule: "B-INN-500", codeinstance: "5-1"},
                {codemodule: "B-EIP-500", codeinstance: "5-1"},
                {codemodule: "B-MOO-500", codeinstance: "5-1"},
                {codemodule: "B-MOO-501", codeinstance: "5-1"},
                {codemodule: "B-MOO-502", codeinstance: "5-1"},
                {codemodule: "B-PRO-500", codeinstance: "5-1"},
                {codemodule: "G-JAM-001", codeinstance: "0-1"},
                {codemodule: "G-JAM-001", codeinstance: "0-2"},
                {codemodule: "G-JAM-001", codeinstance: "0-3"},
                {codemodule: "G-CUS-001", codeinstance: "0-1"}, {codemodule: "G-CUS-002", codeinstance: "0-1"},
                {codemodule: "G-CUS-003", codeinstance: "0-1"}, {codemodule: "G-CUS-004", codeinstance: "0-1"},
                {codemodule: "G-CUS-005", codeinstance: "0-1"}, {codemodule: "G-CUS-006", codeinstance: "0-1"},
                {codemodule: "G-CUS-007", codeinstance: "0-1"}, {codemodule: "G-CUS-008", codeinstance: "0-1"},
                {codemodule: "G-CUS-009", codeinstance: "0-1"},
              ]
            }
          ]
        },
        {
          name: "Soft Skills",
          is_roadblock: true,
          credits_obtains: 0,
          credits_needed: 0,
          credits_remains: 0,
          details: [
            { // Tek 1
              needed: 3,
              modules: [
                {codemodule: "B-ANG-001"},
                {codemodule: "B-FRE-100"}, {codemodule: "B-FRE-200"},
                {codemodule: "B-PCP-000"},
                {codemodule: "G-EPI-004"}, {codemodule: "G-EPI-010"},
                {codemodule: "G-FRE-010"}
              ]
            },
            { // Tek 2
              needed: 3,
              modules: [
                {codemodule: "B-FRE-400"}, {codemodule: "B-PCP-000"},
                {codemodule: "G-EPI-004"}, {codemodule: "B-ANG-001"},
                {codemodule: "G-EPI-010"}
              ]
            },
            { // Tek 3
              needed: 3,
              modules: [
                {codemodule: "B-FRE-501"}, {codemodule: "B-ANG-001"},
                {codemodule: "B-PCP-000"}, {codemodule: "G-FRE-010"},
                {codemodule: "G-EPI-010"}, {codemodule: "G-EPI-004"}
              ]
            }
          ]
        }
      ],
    })
  }
</script>

<style>
  .profile-img {
    border: 2px solid grey;
  }

  .profile-img .v-image__image {
    background-repeat: repeat;
  }

  .modules-table .theme--light.v-expansion-panels .v-expansion-panel--disabled {
    color: rgba(0, 0, 0, 0.87);
  }

  .hide-icon .v-expansion-panel-header .v-expansion-panel-header__icon .v-icon {
    color: transparent !important;
  }
</style>