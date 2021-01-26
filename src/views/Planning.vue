<template>
  <v-container class="fill-height">
    <v-row justify="space-around" align="center">
      <v-col cols="12" class="mb-6">
        <h2 class="text-h2 text-center">Choississez les dates</h2>
        <h3 class="text-h3 text-center">Puis cliquez sur le bouton "Exporter le planning"</h3>
      </v-col>
      <v-col cols="12" class="my-6">
        <v-row justify="space-around" align="center">
          <v-btn
              large
              color="blue"
              @click="queryPlanning"
              dark
          >
            Exporter le planning
          </v-btn>
        </v-row>
      </v-col>
      <v-col cols="12">
        <v-row justify="space-around" align="center">
          <div>
            <h3 class="text-h3 text-center my-6">Début</h3>
            <v-date-picker
                v-model="startDate"
                first-day-of-week="1"
                @change="changeStartDate"
                elevation="15"
                color="green lighten-1"
            ></v-date-picker>
          </div>
          <div>
            <h3 class="text-h3 text-center my-6">Fin</h3>
            <v-date-picker
                v-model="endDate"
                first-day-of-week="1"
                @change="updateStartDate"
                elevation="15"
                color="primary lighten-1"
            ></v-date-picker>
          </div>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import axios from 'axios';

  export default {
    name: "Planning",
    data: () => ({
      startDate: new Date().toISOString().substr(0, 10),
      endDate: new Date()
    }),
    created() {
      this.updateEndDate(6);
    },
    methods: {
      addDays(date, days) {
        let result = new Date(date);
        result.setDate(result.getDate() + days);
        return (result);
      },
      changeStartDate() {
        this.updateEndDate(6);
      },
      updateEndDate(days) {
        this.endDate = this.addDays(this.startDate, days).toISOString().substr(0, 10);
        },
      updateStartDate() {
        if (this.endDate < this.startDate) {
          this.startDate = this.endDate;
          this.updateEndDate(1);
        }
      },
      queryPlanning() {
        const link = document.createElement('a');
        link.href = axios.defaults.baseURL + "planning/" + this.startDate + "/" + this.endDate;
        link.setAttribute('download', 'Planning - ' + this.startDate + ".xlsx");
        document.body.appendChild(link);
        link.click();
      }
    }

  }
</script>
