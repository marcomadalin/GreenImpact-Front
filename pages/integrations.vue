<template>
  <v-container fluid px-8 pt-8>
    <h1 class="primary--text text-h1">
      {{ $t('integrations') }}
    </h1>
    <p>{{ $t('integrationSource') }}</p>
    <br /><br /><br />

    <v-row no-gutters class="md-5" align="stretch" justify="space-between">
      <v-card
        class="mx-auto my-8"
        max-width="275"
        height="100%"
        elevation="0"
        tile
      >
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/factorial.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Factorial</v-card-title>

        <v-card-text>
          <div class="body-2">
            {{ $t('factorial') || truncate(150, '...') }}
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              rounded-0
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto my-8"
        max-width="275"
        height="100%"
        elevation="0"
        tile
      >
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/holded.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Holded</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('holded') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto my-8"
        max-width="275"
        height="100%"
        elevation="0"
        tile
      >
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/bosch.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Bosch</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('bosch') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >3</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >7</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >9</v-chip
            >

            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >12</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>

      <v-card
        class="mx-auto my-8"
        max-width="275"
        height="100%"
        elevation="0"
        tile
      >
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/salesforce.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Salesforce</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('salesforce') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-row>

    <v-row no-gutters class="mb-5" align="stretch" justify="space-between">
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/oracle.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Oracle NetSuite</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('oracle') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/sap.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Sap</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('sap') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/jira.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Jira</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('jira') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/zendesk.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Zendesk</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('zendesk') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-row>

    <v-row no-gutters class="mb-5" align="stretch" justify="space-between">
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/monday.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Monday</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('monday') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/asana.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Asana</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('asana') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/trello.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Trello</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('trello') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
      <v-card class="mx-auto my-8" max-width="275" elevation="0" tile>
        <v-img
          height="138"
          src="https://b2bpublicresources.s3.eu-central-1.amazonaws.com/integrations/blava.png"
        ></v-img>

        <v-card-title class="font-weight-bold">Blava</v-card-title>

        <v-card-text>
          <div class="body-2">
            <span>
              {{ $t('blava') || truncate(150, '...') }}
            </span>
          </div>
        </v-card-text>

        <v-card-text>
          <v-chip-group
            v-model="selection"
            active-class="deep-purple accent-4 white--text"
            column
          >
            <v-chip
              class="ma-2 font-weight-bold"
              label
              text-color="white"
              color="red"
              >5</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="brown"
              >8</v-chip
            >
            <v-chip class="ma-2" label text-color="white" text-xs color="green"
              >10</v-chip
            >
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      selection: null,
    }
  },
}
</script>
