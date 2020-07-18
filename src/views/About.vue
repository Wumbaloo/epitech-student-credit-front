<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12" lg="8">
        <v-row justify="center" align="center" style="flex-direction: column">
          <v-col cols="12" md="6">
            <v-card
              class="mx-auto"
              shaped
            >
              <div class="pa-3">
                <v-skeleton-loader
                  :loading="isLoading"
                  type="heading">
                  <span class="text-h6">Profil étudiant : </span><span class="body-1">{{ student['login'] }}</span>
                </v-skeleton-loader>
                <v-divider class="my-3"></v-divider>
                <v-row class="ma-4" justify="center">
                  <v-skeleton-loader
                    :loading="isLoading"
                    type="avatar">
                    <v-avatar size="105" height="125" tile color="#ffffff">
                      <v-img
                        class="profile-img"
                        :src="require('@/assets/profilview.png')"
                        alt="Student profile"
                        contain
                        transition="scale-transition"
                      >
                      </v-img>
                    </v-avatar>
                  </v-skeleton-loader>
                </v-row>
                <div class="text-center">
                  <v-skeleton-loader
                      :loading="isLoading"
                      type="text">
                    <h3 class="font-weight-medium">{{ student['title'] }}</h3>
                    <div class="subtitle-2 grey--text my-3">
                      <span v-if="student && student['groups'] && student['groups'][0]">
                        {{ student['groups'][0].title }}
                      </span>
                      <span v-else>
                        Lille
                      </span>
                    </div>
                  </v-skeleton-loader>
                </div>
                <v-divider></v-divider>
                <v-skeleton-loader
                    :loading="isLoading"
                    type="list-item">
                  <v-card-text>
                    <v-row justify="space-between">
                      <span class="font-weight-bold">Cursus</span>
                      <span class="font-weight-medium blue--text">{{ student['course_code'] }}</span>
                    </v-row>
                  </v-card-text>
                </v-skeleton-loader>
                <v-divider></v-divider>
                <v-skeleton-loader
                    :loading="isLoading"
                    type="list-item">
                  <v-card-text>
                    <v-row justify="space-between">
                      <span class="font-weight-bold">Promotion</span>
                      <span class="font-weight-medium blue--text">{{ student['promo'] }}</span>
                    </v-row>
                  </v-card-text>
                </v-skeleton-loader>
              </div>
            </v-card>
          </v-col>
          <v-col cols="12" md="10" class="modules-table">
            <v-skeleton-loader
                :loading="isLoading"
                type="table">
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
                  <v-row no-gutters align="center"
                         :class="item.textColor">
                    <v-col cols="4">
                      <v-row no-gutters justify="space-between" align="center">
                        <span>{{ item.name }}</span>
                        <v-tooltip bottom v-if="item['warning']">
                          <template v-slot:activator="{ on, attrs }">
                            <v-icon color="red"
                                    v-on="on"
                                    v-bind="attrs">mdi-alert</v-icon>
                          </template>
                          <span>Ce barrage nécessite votre attention</span>
                        </v-tooltip>
                      </v-row>
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
                    <template v-slot:item="{ item }">
                      <tr @click="item.hub || item.pcp ? toggleDialog(item) : null" :class="item.hub || item.pcp ? 'cursor-click': ''">
                        <v-tooltip right fixed allow-overflow offset-overflow>
                          <template v-slot:activator="{ on, attrs }">
                            <td v-on="on">{{ item.title }} ({{ item.codemodule }})</td>
                            <td v-on="on" class="d-flex align-center justify-center">
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
                            </td>
                            <td v-on="on" class="text-center">
                              <span v-if="item['credits']">
                                {{ item['credits'] }}
                              </span>
                                  <span v-else>
                                -
                              </span>
                            </td>
                          </template>
                          <span v-show="item.projects"
                                v-for="project in item.projects"
                                :key="project">
                            <span>
                              {{ project }}
                            </span>
                            <br>
                          </span>
                          <span v-show="!item.projects">
                            Aucune information sur les projets de ce module.
                          </span>
                        </v-tooltip>
                      </tr>
                    </template>
                    <template v-slot:no-data>
                      Pas de module trouvé pour ce roadblock
                    </template>
                  </v-data-table>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>
            </v-skeleton-loader>
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
    <HubTable :student="student"
              v-model="hubDialog">
    </HubTable>
    <DevPCP :student="student"
              v-model="devPcpDialog">
    </DevPCP>
  </v-container>
</template>

<script>
  import axios from "axios";
  import { mapGetters } from 'vuex';
  import { roadblocks } from "@/assets/roadblocks.js";
  import Loading from 'vue-loading-overlay';
  import HubTable from "@/components/HubTable";
  import DevPCP from "@/components/DevPCP";
  import 'vue-loading-overlay/dist/vue-loading.css';

  export default {
    name: "About",
    computed: {
      ...mapGetters(["getAutologin"])
    },
    components: {
      Loading,
      HubTable,
      DevPCP
    },
    methods: {
      updateBlockColor(block) {
        if (block.credits_obtains + block.credits_remains < block.credits_needed) {
          block.textColor = "red--text font-weight-bold";
          block.warning = true;
        } else if (block.credits_obtains >= block.credits_needed)
          block.textColor = "green--text";
        else if (block.credits_obtains + block.credits_remains > block.credits_needed)
          block.textColor = "primary--text font-weight-medium";
      },
      isModuleObtained: function(grade) {
        if (!grade)
          return (0);
        if (grade !== '-' && grade.toLowerCase().indexOf("echec") === -1)
          return (2);
        else if (grade === '-')
          return (1);
        return (0);
      },
      getModuleInfo: function (module) {
        let modules = [];

        for (let i = 0; i < this.student.modules.length; i++) {
          if (this.student.modules[i]['codemodule'] === module['codemodule'] &&
            parseInt(this.student.modules[i]['scolaryear']) === parseInt(this.student['scolaryear'])) {
            this.student.modules[i].hub = module.hub;
            this.student.modules[i].pcp = module.pcp;
            this.student.modules[i].projects = module.projects;
            modules.push(this.student.modules[i]);
          }
        }
        return modules;
      },
      getModuleInstance: function(module) {
        if (!module || !this.student)
          return null;
        let location = this.student['location'].split('/')[1];
        if (module['codeinstance'][0].toUpperCase() !== module['codeinstance'][0].toLowerCase()) // It's a letter
          return (module['codeinstance']);
        else if (module['codeinstance'])
          return (location + "-" + module['codeinstance']);
        return (location + "-" + module['codemodule'].split('-')[2][0] + "-1");
      },
      getNotRegisteredModuleInfo: function (code, instance) {
        let promise = new Promise((resolve, reject) => {
          if (!code || !instance)
            reject("No code or instance provided.");
          let autologin = this.$cookies.get("autologin") || this.getAutologin;
          if (!autologin) {
            this.$toasted.show("No autologin provided", {
              theme: "bubble",
              position: "bottom-center",
              duration: 5000
            });
            reject("No autologin provided.");
          }
          axios
            .get("module/info/" + code + "/" + instance + "/" + this.student['scolaryear'], {
              headers: {
                'autologin': autologin
              }
            })
            .then((response) => {
              if (response.data.error)
                return;
              resolve(response.data);
            }).catch((err) => {
            this.$toasted.show(err.message, {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
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
      removeItemAll(array, module) {
        let i = 0;

        while (i < array.length) {
          let count = array.filter(x => x['codemodule'] === module['codemodule']).length;
          if (count <= 1)
            return (array);
          if (array[i]['codemodule'] === module['codemodule'] && this.getModuleInstance(array[i]) === module['codeinstance'])
            array.splice(i, 1);
          else
            i++;
        }
        return (array);
      },
      updateRoadblockInfo: function (roadblock) {
        if (!roadblock || !roadblock.is_roadblock)
          return;
        let yearBlock = roadblock.details[this.student['studentyear'] - 1];
        if (!yearBlock.modules)
          return;
        roadblock.credits_needed = yearBlock.needed;
        let newYearBlock = [];
        for (let i = 0; i < yearBlock.modules.length; i++) {
          let modules = this.getModuleInfo(yearBlock.modules[i]);
          if (!modules || modules.length === 0) {
            let instance = this.getModuleInstance(yearBlock.modules[i]);
            this.getNotRegisteredModuleInfo(yearBlock.modules[i]['codemodule'], instance)
            .then((res) => {
              res.registered = false;
              res.hub = yearBlock.modules[i].hub;
              res.pcp = yearBlock.modules[i].pcp;
              res.projects = yearBlock.modules[i].projects;
              if (!res.error &&
                parseInt(res['scolaryear']) === parseInt(this.student['scolaryear'])) {
                newYearBlock.push(res);
                this.$forceUpdate();
              }
            })
            continue;
          }
          for (let x = 0; x < modules.length; x++) {
            if (parseInt(modules[x]['scolaryear']) !== parseInt(this.student['scolaryear']))
              continue;
            modules[x].registered = true;
            yearBlock.modules = this.removeItemAll(yearBlock.modules, modules[x]);
            newYearBlock.push(modules[x]);
            if (this.isModuleObtained(modules[x]['grade']) === 2)
              roadblock.credits_obtains += modules[x]['credits'];
            else if (this.isModuleObtained(modules[x]['grade']) === 1)
              roadblock.credits_remains += modules[x]['credits'];
          }
        }
        this.updateBlockColor(roadblock);
        roadblock.details[this.student['studentyear'] - 1] = newYearBlock;
      },
      setupInformations: function () {
        this.barrages[0].credits_obtains = this.student['credits'];
        this.barrages[0].credits_needed = parseInt(this.student['studentyear']) * 60;
        this.barrages[0].credits_remains = 0;
        for (let i = 0; i < this.student['modules'].length; i++) {
          if (this.student['modules'][i]['grade'] === "-")
            this.barrages[0].credits_remains += this.student['modules'][i]['credits'];
        }
        this.isLoading = false;
        let tepitech = this.getModuleNote("B-ANG-058");
        if (tepitech)
          this.barrages[1].credits_obtains = tepitech['final_note'];
        this.updateBlockColor(this.barrages[0]);
        for (let i = 3; i < this.barrages.length; i++)
          this.updateRoadblockInfo(this.barrages[i]);
        this.detailLoading = false;
      },
      toggleDialog(item) {
        if (item.hub)
          this.hubDialog = !this.hubDialog;
        else if (item.pcp)
          this.devPcpDialog = !this.devPcpDialog;
      }
    },
    created: function () {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;
      this.isLoading = true;
      this.barrages = JSON.parse(JSON.stringify(roadblocks));

      axios
        .get("student/info", {
          headers: {
            'autologin': autologin
          }
        })
        .then((response) => {
          if (response.data.error) {
            this.$toasted.show(response.data.message, {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
            this.$router.push({ name: 'home' }).catch(() => {});
            return;
          }
          this.student = response.data;
          this.setupInformations();
        }).catch((err) => {
          this.$toasted.show(err.message, {
            theme: "bubble",
            position: "bottom-center",
            duration : 5000
          });
          this.$router.push({ name: 'home' }).catch(() => {});
      });
    },
    data: () => ({
      isLoading: false,
      hubDialog: false,
      devPcpDialog: false,
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
      barrages: []
    })
  }
</script>

<style>
  .profile-img {
    /*border: 2px solid grey;*/
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

  .cursor-click {
    cursor: pointer;
  }

  @media only screen and (max-width: 768px) {
    td {
      min-height: 120px;
    }
  }
</style>