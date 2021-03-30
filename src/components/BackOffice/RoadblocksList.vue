<template>
  <v-container fluid>
    <v-text-field
        class="mb-4 pt-0"
        v-model="search"
        append-icon="mdi-magnify"
        label="Rechercher"
        single-line
        outlined
        dense
        hide-details
    >
    </v-text-field>
    <v-data-table
        :headers="headers"
        :items="roadblocks"
        :search="search"
        :items-per-page="15"
        item-key="id"
        class="elevation-1"
        :loading="loading"
        loading-text="Chargement..."
    >
      <template v-slot:item.actions="{ item }">
        <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
        >
          mdi-pencil
        </v-icon>
        <v-icon
            small
            @click="deleteItem(item)"
        >
          mdi-delete
        </v-icon>
      </template>
    </v-data-table>
    <v-dialog
        v-model="editDialog"
        max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
            color="primary"
            dark
            class="mb-2"
            v-bind="attrs"
            v-on="on"
        >
          Nouveau roadblock
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-row>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    v-model="editedItem.name"
                    label="Nom du roadblock"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    v-model="editedItem.credits_needed"
                    label="Crédits requis"
                ></v-text-field>
              </v-col>
              <v-col
                  cols="12"
                  sm="6"
                  md="4"
              >
                <v-text-field
                    v-model="editedItem.tekYear.year"
                    label="Année"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="blue darken-1"
              text
              @click="close"
          >
            Annuler
          </v-btn>
          <v-btn
              color="blue darken-1"
              dark
              @click="save"
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="headline" style="word-break: break-word">Êtes-vous sûr de vouloir supprimer ce roadblock?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="closeDelete">Annuler</v-btn>
          <v-btn color="red darken-1" dark @click="deleteItemConfirm">Supprimer</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import axios from "axios";
import { mapGetters } from "vuex";

export default {
    name: "RoadblocksList",
    computed: {
      ...mapGetters(["getAccessToken"]),
      formTitle () {
        return this.editedIndex === -1 ? 'Nouveau roadblock' : 'Éditer un roadblock'
      },
    },
    data: () => ({
      editDialog: false,
      deleteDialog: false,
      search: "",
      loading: true,
      editedIndex: -1,
      editedItem: {
        id: 0,
        name: '',
        credits_needed: 0,
        tekYear: 0
      },
      defaultItem: {
        id: 0,
        name: '',
        credits_needed: 0,
        tekYear: 0
      },
      headers: [
        {
          text: 'Roadblock',
          align: 'center',
          value: 'name',
        },
        {
          text: 'Credits requis',
          align: 'center',
          value: 'credits_needed'
        },
        {
          text: 'Année',
          align: 'center',
          value: 'tekYear.year'
        },
        {
          text: 'Actions',
          align: 'center',
          value: 'actions',
          sortable: false
        },
      ],
      roadblocks: []
    }),
    watch: {
      editDialog (val) {
        val || this.close()
      },
      deleteDialog (val) {
        val || this.closeDelete()
      },
    },
    mounted() {
      this.refreshTable();
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.roadblocks.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.editDialog = true;
      },

      deleteItem (item) {
        this.editedIndex = this.roadblocks.indexOf(item);
        this.editedItem = Object.assign({}, item);
        this.deleteDialog = true;
      },

      deleteItemConfirm () {
        axios
          .delete("backoffice/roadblock/" + this.editedItem.id)
          .then((response) => {
            if (response.data.error)
              return;
            console.log(response.data.data);
            this.closeDelete();
            this.roadblocks.splice(this.editedIndex, 1);
          }).catch((err) => {
            this.$toasted.show(err.body || err, {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
            this.$router.push({ name: 'home' }).catch(() => {});
        });
      },

      close () {
        this.editDialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      closeDelete () {
        this.deleteDialog = false;
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem);
          this.editedIndex = -1;
        })
      },

      save () {
        if (this.editedIndex > -1) {
          Object.assign(this.roadblocks[this.editedIndex], this.editedItem);
          axios
            .post("backoffice/roadblock/" + this.editedItem.id, {
              body: {
                newName: this.editedItem.name,
                newCreditsNeeded: this.editedItem.credits_needed,
                year: this.editedItem.tekYear
              }
            })
            .then((response) => {
              if (response.data.error)
                return;
              console.log(response.data.data);
              this.closeDelete();
              this.roadblocks.splice(this.editedIndex, 1);
            }).catch((err) => {
            this.$toasted.show(err.body || err, {
              theme: "bubble",
              position: "bottom-center",
              duration : 5000
            });
            this.$router.push({ name: 'home' }).catch(() => {});
          });
        } else {
          this.roadblocks.push(this.editedItem);
        }
        this.close();
      },
      refreshTable: function () {
        let accessToken = this.getAccessToken;
        if (!accessToken) {
          this.$toasted.show("Veuillez vous authentifier.", {
            theme: "bubble",
            position: "bottom-center",
            duration : 5000
          });
          this.$router.push({ name: 'home' }).catch(() => {});
          return;
        }
        axios
          .get("backoffice/roadblocks", { headers: {
            'Authorization': 'Bearer ' + accessToken,
          }})
          .then((response) => {
            if (!response.data.success) {
              this.$toasted.show("Une erreur est survenue.", {
                theme: "bubble",
                position: "bottom-center",
                duration : 5000
              });
              console.error(response.data.error);
              return;
            }
            this.loading = false
            this.roadblocks = response.data.data;
          }).catch((err) => {
          this.$toasted.show("Une erreur est survenue.", {
            theme: "bubble",
            position: "bottom-center",
            duration : 5000
          });
          console.error(err);
          this.$router.push({ name: 'home' }).catch(() => {});
        });
      }
    }
  }
</script>

<style scoped>

</style>
