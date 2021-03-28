<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" lg="10" xl="6">
        <h1 class="display-1 text-center my-6">Epi-Planner</h1>
        <v-tabs
            v-model="tab"
            background-color="primary"
            centered
            dark
        >
          <v-tabs-slider></v-tabs-slider>

          <v-tab href="#roadblocks">
            Roadblocks
          </v-tab>
          <v-tab href="#modules">
            Modules
          </v-tab>

          <v-tabs-items
              v-model="tab"
          >
            <v-tab-item
                value="roadblocks"
            >
              <v-card>
                <v-card-text>
                  <RoadblocksList></RoadblocksList>
                </v-card-text>
              </v-card>
            </v-tab-item>
            <v-tab-item
                value="modules"
            >
              <v-card flat>
                <v-card-text>test2</v-card-text>
              </v-card>
            </v-tab-item>

          </v-tabs-items>
        </v-tabs>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
  import RoadblocksList from "@/components/BackOffice/RoadblocksList";

  export default {
    name: "Index",
    components: {
      RoadblocksList
    },
    data: () => ({
      tab: 0
    })
  }
</script>

<style scoped>

</style>