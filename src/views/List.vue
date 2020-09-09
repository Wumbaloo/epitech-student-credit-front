<template>
  <v-container>
    <v-row justify="center" align="center">
      <v-col cols="12" md="12" lg="8">
        <div v-for="(year, i) in modules" :key="i">
          <h1 class="text-center">Tek {{ i + 1 }}</h1>
          <v-data-table
              disable-sort
              hide-default-footer
              :headers="detailsHeader"
              v-for="(module, j) in year"
              v-if="module.length > 0"
              :key="j"
              calculate-widths
              :items="module"
          >
            <template v-slot:no-data>
              Pas de module trouvé pour ce roadblock
            </template>
          </v-data-table>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from "axios";
  import { mapGetters } from 'vuex';
  import { roadblocks } from "@/assets/roadblocks.js";

  export default {
    name: "List",
    computed: {
      ...mapGetters(["getAutologin"])
    },

    methods: {
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
        for (let i = 0; i < 3; i++) {
          let yearBlock = roadblock.details[i];
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
                });
              continue;
            }
            for (let x = 0; x < modules.length; x++) {
              if (parseInt(modules[x]['scolaryear']) !== parseInt(this.student['scolaryear']))
                continue;
              modules[x].registered = true;
              yearBlock.modules = this.removeItemAll(yearBlock.modules, modules[x]);
              newYearBlock.push(modules[x]);
              if (this.isModuleObtained(modules[x]) === 2)
                roadblock.credits_obtains += modules[x]['credits'];
              else if (this.isModuleObtained(modules[x]) === 1)
                roadblock.credits_remains += modules[x]['credits'];
            }
          }
          roadblock.details[i] = newYearBlock;
        }
        this.modules[0].push(roadblock.details[0]);
        this.modules[1].push(roadblock.details[1]);
        this.modules[2].push(roadblock.details[2]);
        console.log(this.modules[0]);
      },
      setupInformations: function () {
        this.isLoading = false;
        for (let i = 3; i < this.barrages.length; i++)
          this.updateRoadblockInfo(this.barrages[i]);
        this.detailLoading = false;
      },
      toggleDialog(item) {
        if (item.hub)
          this.hubDialog = !this.hubDialog;
        else if (item.pcp)
          this.devPcpDialog = !this.devPcpDialog;
      },
      openItem(item) {
        if (item.hub || item.pcp) {
          this.toggleDialog(item);
          return;
        }
        if (!item['scolaryear'] || !item['codemodule'] || !item['codeinstance'])
          return;
        let url = "https://intra.epitech.eu/module/" + item['scolaryear'] + "/" + item['codemodule'] + "/" + item['codeinstance'];
        window.open(url);
      }
    },
    created: function () {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;
      this.isLoading = true;
      this.barrages = JSON.parse(JSON.stringify(roadblocks));

      if (!autologin) {
        this.$toasted.show("Merci de vous authentifier pour accéder à cette page.", {
          theme: "bubble",
          position: "bottom-center",
          duration : 5000
        });
        this.$router.push({ name: 'home' }).catch(() => {});
        return;
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
              duration : 5000
            });
            this.$router.push({ name: 'home' }).catch(() => {});
            return;
          }
          this.student = response.data;
          this.setupInformations();
        }).catch((err) => {
        // this.$toasted.show(err.message, {
        //   theme: "bubble",
        //   position: "bottom-center",
        //   duration : 5000
        // });
        // this.$router.push({ name: 'home' }).catch(() => {});
      });
    },
    data: () => ({
      isLoading: false,
      student: {
      },
      modules : [[], [], []],
      headers: [
        {
          text: "Module",
          value: "name"
        },
        {
          text: "Nombre de crédits",
          value: "credits"
        }
      ],
      detailsHeader: [
        {
          text: "Titre",
          value: "title",
          width: "31.5%"
        },
        {
          text: "Crédits",
          value: "credits",
          align: "center",
          width: "34%"
        },
      ],
      barrages: []
    })
  }
</script>

<style scoped>

</style>
