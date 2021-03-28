<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" style="flex-direction: column">
      <v-col cols="12" md="12" lg="6" class="text-center d-flex flex-column align-center" v-if="!isNotBachelor">
        <h1 class="text-h3">Crédits possibles avec vos modules :</h1>
        <h2 class="text-h2 py-10 font-weight-bold">{{ credits }}</h2>
        <v-btn @click="restoreConfig()"
               class="mb-3"
               color="primary">
          Restaurer ma dernière simulation
        </v-btn>
        <v-btn @click="eraseSimulation()"
               color="red"
               dark>
          Réinitialiser ma simulation
        </v-btn>
      </v-col>
      <v-row style="width: 100%" v-show="isNotBachelor">
        <v-col cols="12" class="text-center d-flex flex-column align-center">
          <h1 class="text-h3">Cette page n'est pas disponible pour votre cursus.</h1>
        </v-col>
      </v-row>
      <v-row style="width: 100%" v-show="!isNotBachelor">
        <v-col cols="12"
               md="6"
               lg="3"
               v-for="(block, i) in validationBlocks"
               :key="i">
          <v-card>
            <v-card-title class="text-h5" :class="!block.other ? block.textColor : ''" style="word-break: break-word">
              {{ block.name }}
              <v-spacer></v-spacer>
              ({{ block.credits_obtains }} / {{ block.credits_needed }})
            </v-card-title>
            <v-card-text>
              <v-row no-gutters
                     align="center"
                     class="my-2"
                     v-for="(module, j) in block.details[student['studentyear'] - 1]"
                     :key="j">
                <v-col cols="7"
                       @click="openItem(block, module)"
                       style="cursor: pointer">
                  {{ module['title'] }} ({{ module['codemodule'] }})
                </v-col>
                <v-col cols="3" class="text-center"
                       @click="openItem(block, module)"
                       style="cursor: pointer">
                  {{ module['credits'] }}
                </v-col>
                <v-col cols="2" style="display: flex; justify-content: end">
                  <v-btn class="mx-2"
                         v-if="module['credits'] > 0"
                         fab
                         dark
                         small
                         elevation="0"
                         color="indigo"
                         @click="toggleModule(block, module)">
                    <v-icon dark v-if="!module.toggle">mdi-plus</v-icon>
                    <v-icon dark v-else>mdi-minus</v-icon>
                  </v-btn>
                  <v-btn
                      class="mx-2"
                      v-else-if="module['codemodule'] && module['codemodule'].includes('B-INN') > 0"
                      fab
                      dark
                      small
                      elevation="0"
                      color="green"
                      @click="openItem(block, module)"
                    >
                    <v-icon dark v-if="!module.toggle">mdi-cursor-default-click</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
      <loading :active.sync="isLoading"
               is-full-page
               color="#007bff"
               :height="128"
               :width="128"
      ></loading>
      <HubCreditsChoice v-model="showHubDialog" @close="saveHubCredits"/>
    </v-row>
  </v-container>
</template>

<script>
  import { roadblocks } from "../assets/roadblocks";
  import Loading from 'vue-loading-overlay';
  import axios from "axios";
  import HubCreditsChoice from "../components/HubCreditsChoice";

  export default {
    name: "Calculator",
    components: {
      Loading,
      HubCreditsChoice
    },
    data: () => ({
      credits: 0,
      showHubDialog: false,
      isLoading: false,
      isNotBachelor: false,
      hubItem: false,
      student: {},
      validationBlocks: []
    }),
    methods: {
      saveConfig() {
        let array = [];
        let year = parseInt(this.student['studentyear']) - 1;

        for (let i = 0; i < this.validationBlocks.length; i++) {
          for (let j = 0; j < this.validationBlocks[i].details[year].length; j++) {
            if (this.validationBlocks[i].details[year][j].toggle) {
              let detail = this.validationBlocks[i].details[year][j];
              if (detail.codemodule.includes('B-INN'))
                array.push({ code: detail.codemodule, credits: detail.credits });
              else
                array.push(detail.codemodule);
            }
          }
        }
        if (this.$cookies.get('acceptCookies'))
          this.$cookies.set("yearSimulation", JSON.stringify(array), "14d");
      },
      restoreConfig() {
        let config = this.$cookies.get("yearSimulation");
        let year = parseInt(this.student['studentyear']) - 1;

        if (!this.$cookies.get('acceptCookies'))
          return;
        if (!config)
          return;
        config = JSON.parse(config);
        for (let i = 0; i < config.length; i++) {
          for (let k = 0; k < this.validationBlocks.length; k++) {
            for (let x = 0; x < this.validationBlocks[k].details[year].length; x++) {
              if (this.validationBlocks[k].details[year][x]['codemodule'] === config[i].code && config[i].credits) {
                this.validationBlocks[k].details[year][x].credits = config[i].credits;
                this.toggleModule(this.validationBlocks[k], this.validationBlocks[k].details[year][x], true);
              } else if (this.validationBlocks[k].details[year][x]['codemodule'] === config[i])
                this.toggleModule(this.validationBlocks[k], this.validationBlocks[k].details[year][x], true);
            }
          }
        }
      },
      eraseSimulation() {
        let year = parseInt(this.student['studentyear']) - 1;

        this.$cookies.set('yearSimulation', '', '0');
        for (let i = 0; i < this.validationBlocks.length; i++) {
          for (let i = 0; i < this.validationBlocks.length; i++) {
            for (let j = 0; j < this.validationBlocks[i].details[year].length; j++) {
              if (this.validationBlocks[i].details[year][j].toggle)
                this.toggleModule(this.validationBlocks[i], this.validationBlocks[i].details[year][j]);
            }
          }
        }
      },
      toggleModule(block, module, restore) {
        if (module.toggle) {
          block.credits_obtains -= module.credits;
          this.credits -= module.credits;
        } else {
          block.credits_obtains += module.credits;
          this.credits += module.credits;
        }
        this.updateBlockColor(block);
        module.toggle = !module.toggle;
        if (!restore)
          this.saveConfig();
      },
      updateBlockColor(block) {
        if (block.credits_obtains + block.credits_remains < block.credits_needed) {
          block.textColor = "red--text font-weight-bold";
          block.warning = true;
          return;
        }
        block.warning = false;
        if (block.credits_obtains >= block.credits_needed)
          block.textColor = "green--text";
        else if (block.credits_obtains + block.credits_remains >= block.credits_needed)
          block.textColor = "primary--text font-weight-medium";
      },
      isModuleObtained: function(module) {
        if (!module['grade'])
          return (0);
        if (module['grade'] !== '-' && module['grade'].toLowerCase().indexOf("echec") === -1)
          return (2);
        else if (module['grade'] === '-')
          return (1);
        return (0);
      },
      getModuleInfo: function (module) {
        let modules = [];

        for (let i = 0; i < this.student.modules.length; i++) {
          if (this.student.modules[i]['codemodule'] === module['codemodule'] &&
            parseInt(this.student.modules[i]['scolaryear']) === parseInt(this.student['scolaryear'])) {
            if (module['codeinstance']) {
              if (this.getModuleInstance(module) !== this.student.modules[i]['codeinstance']) {
                continue;
              }
            }
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
        if (module['codeinstance'] && module['codeinstance'][0].toUpperCase() !== module['codeinstance'][0].toLowerCase()) // It's a letter
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
            this.$toasted.show("Une erreur est survenue. Vérifiez que vous avez acceptés les cookies et réessayez.", {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
            this.$router.push({ name: 'home' }).catch(() => {});
          });
        });
        return (promise);
      },
      getModuleNote: function (code) {
        for (let i = this.student['notes'].length - 1; i >= 0; i--) {
          if (this.student['notes'][i]['codemodule'] === code &&
            parseInt(this.student['notes'][i]['scolaryear']) === parseInt(this.student['scolaryear'])) {
            if (code === 'B-ANG-058' && this.student['notes'][i]['title'].indexOf('Self-assessment') !== -1)
              continue;
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
      isRegistered: function (module) {
        for (let i = 0; i < this.student.modules.length; i++) {
          if (this.student.modules[i]['codemodule'] === module['codemodule'] &&
            parseInt(this.student.modules[i]['scolaryear']) === parseInt(this.student['scolaryear']) &&
            this.student.modules[i]['codeinstance'] === module['codeinstance']) {
            module['grade'] = this.student.modules[i]['grade'];
            module['credits'] = this.student.modules[i]['credits'];
            return true;
          }
        }
        return false;
      },
      updateRoadblockInfo: function (roadblock) {
        return new Promise((resolve, reject) => {
          if (!roadblock || !roadblock.is_roadblock)
            return;
          let yearBlock = roadblock.details[this.student['studentyear'] - 1];
          if (!yearBlock.modules)
            return;
          roadblock.credits_needed = yearBlock.needed;
          let newYearBlock = [];
          for (let i = 0; i < yearBlock.modules.length; i++) {
            let instance = this.getModuleInstance(yearBlock.modules[i]);
            this.getNotRegisteredModuleInfo(yearBlock.modules[i]['codemodule'], instance).then(
              (res) => {
                res.registered = false;
                this.$forceUpdate();
                if (!res.error &&
                  parseInt(res['scolaryear']) === parseInt(this.student['scolaryear'])) {
                  newYearBlock.push(res);
                }
              }
            )
          }
          this.updateBlockColor(roadblock);
          this.$forceUpdate();
          roadblock.details[this.student['studentyear'] - 1] = newYearBlock;
          resolve();
        });
      },
      setupInformations: async function () {
        if (this.student['semester_code'][0] === 'T') {
          this.isNotBachelor = true;
          this.isLoading = false;
          return;
        }
        for (let i = 0; i < this.validationBlocks.length; i++)
          await this.updateRoadblockInfo(this.validationBlocks[i]);
        this.isLoading = false;
      },
      openItem(block, item) {
        if (item.title.includes("Hub")) {
          this.hubItem = item;
          if (item.toggle)
            this.toggleModule(block, item);
          this.showHubDialog = !this.showHubDialog;
          return;
        }
        if (!item['scolaryear'] || !item['codemodule'] || !item['codeinstance'])
          return;
        let url = "https://intra.epitech.eu/module/" + item['scolaryear'] + "/" + item['codemodule'] + "/" + item['codeinstance'];
        window.open(url);
      },
      saveHubCredits(value) {
        this.hubItem.credits = value;
      }
    },
    created() {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;
      this.isLoading = true;
      let roadblocksCopy = JSON.parse(JSON.stringify(roadblocks));

      if (!this.student)
        return;
      if (!autologin) {
        this.$toasted.show("Merci de vous authentifier pour accéder à cette page.", {
          theme: "bubble",
          position: "bottom-center",
          duration : 5000
        });
        this.$router.push({ name: 'home' }).catch(() => {});
        return;
      }
      for (let i = 0; i < roadblocksCopy.length; i++) {
        if (roadblocksCopy[i].is_roadblock) {
          this.validationBlocks.push(roadblocksCopy[i]);
        }
      }
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
              duration: 5000
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
    }
  }
</script>

<style scoped>

</style>
