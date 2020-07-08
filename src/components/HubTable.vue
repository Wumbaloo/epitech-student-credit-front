<template>
  <v-dialog
      v-model="innerValue"
      width="50%"
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
        <v-card outlined class="pa-2">
          <v-row no-gutters> <!-- @TODO: View mobile mode -->
            <v-col cols="3">
              Type d'activité
            </v-col>
            <v-col cols="3">
              Nombre d'expériences
            </v-col>
            <v-col cols="2">
              Meetup / Talk
            </v-col>
            <v-col cols="2">
              Workshop
            </v-col>
            <v-col cols="2">
              Hackaton
            </v-col>
          </v-row>
        </v-card>
        <v-card outlined class="pa-2">
          <v-row no-gutters>
            <v-col cols="3">
              Participation
            </v-col>
            <v-col v-for="(column, i) in columns"
                   :key="i"
                   :cols="i === 0 ? 3 : 2">
              {{ presences[column] }}
            </v-col>
          </v-row>
        </v-card>
        <v-card outlined class="pa-2">
          <v-row no-gutters>
            <v-col cols="3">
              Organisation
            </v-col>
            <v-col v-for="(column, i) in columns"
                   :key="i"
                   :cols="i === 0 ? 3 : 2">
              {{ organisations[column] }}
            </v-col>
          </v-row>
        </v-card>
        <v-card outlined class="pa-2">
          <v-row no-gutters>
            <v-col cols="3">
              Absences
            </v-col>
            <v-col v-for="(column, i) in columns"
                   :key="i"
                   :cols="i === 0 ? 3 : 2">
              {{ missing[column] }}
            </v-col>
          </v-row>
        </v-card>
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
  export default {
    name: "HubTable",
    props: {
      value: {
        type: null,
        default: null
      },
      moduleProp: {}
    },
    created() {
      this.innerValue = this.value;
    },
    data: () => ({
      module: {},
      columns: ["xp", "talk", "workshop", "hackaton"],
      presences: {xp: 1, talk: 2, workshop: 1, hackaton: 1},
      organisations: {xp: 3, talk: 1, workshop: 0, hackaton: 0},
      missing: {xp: 0, talk: 1, workshop: 0, hackaton: 0},
      innerValue: false
    }),
    watch: {
      moduleProp(val) {
        this.module = val;
      },
      value(val) {
        this.innerValue = val;
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
      }
    }
  }
</script>

<style scoped>

</style>