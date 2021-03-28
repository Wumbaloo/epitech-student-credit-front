<template>
  <v-container class="fill-height">
    <v-row justify="space-around" align="center">
      <v-col cols="12" md="6" align="center">
        <h1>Étudiants</h1>
        <v-col cols="12" md="6">
          <v-list dense>
            <v-list-item-group
              v-model="selectedStudent"
              color="primary"
            >
              <v-list-item
                v-for="(item, i) in students"
                :key="i"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-col>
      </v-col>
      <v-col cols="12" md="6" align="center">
        <v-btn color="primary" class="my-2" v-show="!showAddStudent" @click="showAddStudent = !showAddStudent">Ajouter un étudiant</v-btn><br />
        <div v-show="showAddStudent">
          <v-btn color="primary" class="my-2" @click="showAddStudent = !showAddStudent">Retour</v-btn><br />
          <v-file-input
              dense
              chips
              multiple
              accept=".pdf"
              label="Fichiers de remise à niveau"
              counter
              show-size
              v-model="files"
              truncate-length="15"
          ></v-file-input>
          <v-btn dense color="green" @click="uploadStudents" dark>Valider</v-btn>
        </div>
        <v-btn
            color="red"
            dark
            class="my-2"
            v-show="!showAddStudent"
            @click="deleteStudent">
          Supprimer un étudiant
        </v-btn>
        <br />
        <v-btn
            color="green"
            dark
            class="my-2"
            v-show="!showAddStudent"
            @click="downloadStudents">
          Exporter les étudiants
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "Redoublants",
    data: () => ({
      message: "",
      showAddStudent: false,
      selectedStudent: 0,
      students: [],
      files: [],
    }),
    created() {
      let autologin = this.$cookies.get("autologin") || this.getAutologin;

      if (!autologin || !autologin.includes('8ab6ca98a71c04aa885970018')) {
        this.$toasted.show("Vous n'êtes pas autorisé à visiter cette page.", {
          theme: "bubble",
          position: "bottom-center",
          duration : 5000
        });
        this.$router.push({ name: 'home' }).catch(() => {});
      }
    },
    mounted() {
      this.refreshStudents();
    },
    methods: {
      refreshStudents() {
        axios.get("redoublants").then((data) => {
          if (!data.data.success) {
            this.message = "An error occured. Please contact William GAUDFRIN";
            this.$toasted.show(data.data.message, {
              theme: "bubble",
              position: "bottom-center",
              duration: 5000
            });
            return;
          }
          this.students = data.data.data;
        }).catch((err) => {
          this.message = "An error occured. Please contact William GAUDFRIN";
          this.$toasted.show("An error occured. Please contact William GAUDFRIN", {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000
          });
          console.log(err);
        });
      },
      downloadStudents() {
        const link = document.createElement('a');
        link.href = axios.defaults.baseURL + "redoublants/retrieve";
        link.setAttribute('download', 'Planning - ' + this.startDate + ".xlsx");
        document.body.appendChild(link);
        link.click();
      },
      deleteStudent() {
        axios.delete('redoublants/' + this.students[this.selectedStudent].filename)
          .then(() => {
            this.students.splice(this.selectedStudent, 1);
        }).catch((err) => {
          this.$toasted.show("An error occured. Please contact William GAUDFRIN", {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000
          });
          console.log(err);
        })
      },
      uploadStudents() {
        let formData = new FormData();
        for (let i = 0; i < this.files.length; i++) {
          let file = this.files[i];

          formData.append('files[' + i + ']', file);
        }
        axios.post('redoublants', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((data) => {
          if (!data.data.success) {
            this.$toasted.show(data.data.message, {
              theme: "bubble",
              position: "bottom-center",
              duration: 5000
            });
            return;
          }
          this.$toasted.show(data.data.message, {
            theme: "bubble",
            position: "bottom-center",
            duration: 5000
          });
          this.files = [];
          this.showAddStudent = false;
          this.refreshStudents();
        }).catch((err) => {
          this.message = "An error occured. Please contact William GAUDFRIN";
          console.log(err);
        })
      }
    }
  }
</script>

<style scoped>

</style>