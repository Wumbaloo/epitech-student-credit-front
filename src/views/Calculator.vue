<template>
  <v-container class="fill-height">
    <v-row justify="center" align="center" style="flex-direction: column">
      <v-col cols="12" md="12" lg="6" class="text-center">
        <h1 class="text-h3">Crédits possibles avec vos modules :</h1>
        <h2 class="text-h2 py-10 font-weight-bold">{{ credits }}</h2>
        <v-btn @click="eraseSimulation()"
               color="red"
               dark>
          Réinitialiser ma simulation
        </v-btn>
      </v-col>
      <v-row style="width: 100%">
        <v-col cols="12"
               md="6"
               lg="3"
               v-for="(block, i) in validationBlocks"
               :key="i">
          <v-card>
            <v-card-title class="text-h5" :class="!block.other ? block.textColor : ''">
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
                <v-col cols="5">
                  {{ module['codemodule'] }}
                </v-col>
                <v-col cols="5">
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
    </v-row>
  </v-container>
</template>

<script>
  import { roadblocks } from "../assets/roadblocks";
  import Loading from 'vue-loading-overlay';
  import axios from "axios";

  export default {
    name: "Calculator",
    components: {
      Loading
    },
    data: () => ({
      credits: 0,
      isLoading: false,
      student: {},
      validationBlocks: []
    }),
    methods: {
      saveConfig() {
        let array = [];
        let year = parseInt(this.student['studentyear']) - 1;

        for (let i = 0; i < this.validationBlocks.length; i++) {
          for (let j = 0; j < this.validationBlocks[i].details[year].length; j++) {
            if (this.validationBlocks[i].details[year][j].toggle)
              array.push(this.validationBlocks[i].details[year][j].codemodule);
          }
        }
        this.$cookies.set("yearSimulation", JSON.stringify(array), "14d");
      },
      restoreConfig() {
        let config = this.$cookies.get("yearSimulation");
        let year = parseInt(this.student['studentyear']) - 1;

        if (!config)
          return;
        config = JSON.parse(config);
        for (let i = 0; i < config.length; i++) {
          for (let k = 0; k < this.validationBlocks.length; k++) {
            for (let x = 0; x < this.validationBlocks[k].details[year].length; x++) {
              if (this.validationBlocks[k].details[year][x]['codemodule'] === config[i])
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
      updateBlockColor(block) {
        if (block.credits_obtains + block.credits_remains < block.credits_needed)
          block.textColor = "red--text font-weight-bold";
        else if (block.credits_obtains >= block.credits_needed)
          block.textColor = "green--text";
        else if (block.credits_obtains + block.credits_remains > block.credits_needed)
          block.textColor = "primary--text font-weight-medium";
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
        module.toggle = !module.toggle
        if (!restore)
          this.saveConfig();
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
            this.$toasted.show(err.message, {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
          });
        });
        return (promise);
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
          let modules = this.getModuleInfo(yearBlock.modules[i]['codemodule']);
          if (!modules || modules.length === 0) {
            let instance = this.getModuleInstance(yearBlock.modules[i]);
            this.getNotRegisteredModuleInfo(yearBlock.modules[i]['codemodule'], instance)
              .then((res) => {
                res.registered = false;
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
          }
        }
        this.updateBlockColor(roadblock);
        roadblock.details[this.student['studentyear'] - 1] = newYearBlock;
      },
      setupInformations: function () {
        this.isLoading = false;
        for (let i = 0; i < this.validationBlocks.length; i++)
          this.updateRoadblockInfo(this.validationBlocks[i]);
      }
    },
    created() {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;
      this.isLoading = true;
      let roadblocksCopy = JSON.parse(JSON.stringify(roadblocks));

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
          this.restoreConfig();
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