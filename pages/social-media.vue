<template>
  <v-container fluid px-8 pt-8>
    <h1 class="primary--text text-h1">
      {{ $t('socialMediaTitle') }}
    </h1>
    <p>{{ $t('socialMediaSubtitle') }}</p>

    <v-row no-gutters class="md-5" align="stretch" justify="space-between">
      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" color="white" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.46 6c-.77.35-1.6.58-2.46.69c.88-.53 1.56-1.37 1.88-2.38c-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29c0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15c0 1.49.75 2.81 1.91 3.56c-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07a4.28 4.28 0 0 0 4 2.98a8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21C16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56c.84-.6 1.56-1.36 2.14-2.23Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('twitter') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('instagram') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12 2.04c-5.5 0-10 4.49-10 10.02c0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89c1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 0 0 8.44-9.9c0-5.53-4.5-10.02-10-10.02Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('facebook') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row> <v-col></v-col></v-row>

    <v-row no-gutters class="md-5" align="stretch" justify="space-between">
      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('linkedin') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M3.42 12c0-1.24.27-2.42.74-3.5l4.1 11.22A8.563 8.563 0 0 1 3.42 12m14.37-.43c0 .73-.29 1.58-.65 2.77l-.86 2.86l-3.1-9.2l.98-.1c.47-.06.41-.74-.05-.71c0 0-1.39.11-2.29.11l-2.26-.11c-.46-.03-.51.68-.06.71l.91.1l1.34 3.64l-1.88 5.63L6.74 8l.99-.1c.46-.06.4-.74-.06-.71c0 0-1.39.11-2.29.11l-.55-.01C6.37 4.96 9 3.42 12 3.42c2.23 0 4.27.86 5.79 2.25h-.11c-.84 0-1.44.73-1.44 1.52c0 .71.41 1.31.84 2.01c.33.57.71 1.3.71 2.37m-5.64 1.18l2.64 7.22l.06.12c-.89.32-1.85.49-2.85.49c-.84 0-1.65-.12-2.42-.35l2.57-7.48m7.38-4.87A8.548 8.548 0 0 1 20.58 12c0 3.16-1.72 5.93-4.27 7.41l2.62-7.57c.49-1.22.66-2.2.66-3.07l-.06-.89M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 19.54c5.26 0 9.54-4.28 9.54-9.54c0-5.26-4.28-9.54-9.54-9.54c-5.26 0-9.54 4.28-9.54 9.54c0 5.26 4.28 9.54 9.54 9.54Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M3.42 12c0-1.24.27-2.42.74-3.5l4.1 11.22A8.563 8.563 0 0 1 3.42 12m14.37-.43c0 .73-.29 1.58-.65 2.77l-.86 2.86l-3.1-9.2l.98-.1c.47-.06.41-.74-.05-.71c0 0-1.39.11-2.29.11l-2.26-.11c-.46-.03-.51.68-.06.71l.91.1l1.34 3.64l-1.88 5.63L6.74 8l.99-.1c.46-.06.4-.74-.06-.71c0 0-1.39.11-2.29.11l-.55-.01C6.37 4.96 9 3.42 12 3.42c2.23 0 4.27.86 5.79 2.25h-.11c-.84 0-1.44.73-1.44 1.52c0 .71.41 1.31.84 2.01c.33.57.71 1.3.71 2.37m-5.64 1.18l2.64 7.22l.06.12c-.89.32-1.85.49-2.85.49c-.84 0-1.65-.12-2.42-.35l2.57-7.48m7.38-4.87A8.548 8.548 0 0 1 20.58 12c0 3.16-1.72 5.93-4.27 7.41l2.62-7.57c.49-1.22.66-2.2.66-3.07l-.06-.89M12 2a10 10 0 0 1 10 10a10 10 0 0 1-10 10A10 10 0 0 1 2 12A10 10 0 0 1 12 2m0 19.54c5.26 0 9.54-4.28 9.54-9.54c0-5.26-4.28-9.54-9.54-9.54c-5.26 0-9.54 4.28-9.54 9.54c0 5.26 4.28 9.54 9.54 9.54Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('wordpress') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" sm="4">
        <v-card
          class="mx-auto my-8 rounded-sm mb-2 white px-0"
          max-width="350"
          height="100%"
          elevation="0"
        >
          <v-card-title class="font-weight-bold justify-center">
            <svg width="3em" height="3em" color="#7C7DDB" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="m12 17.56l4.07-1.13l.55-6.1H9.38L9.2 8.3h7.6l.2-1.99H7l.56 6.01h6.89l-.23 2.58l-2.22.6l-2.22-.6l-.14-1.66h-2l.29 3.19L12 17.56M4.07 3h15.86L18.5 19.2L12 21l-6.5-1.8L4.07 3Z"
              ></path>
            </svg>
          </v-card-title>

          <v-card-text class="text-center">
            <v-btn small rounded text-lowercase elevation="0" color="primary">
              <svg width="1em" height="1em" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12 17.56l4.07-1.13l.55-6.1H9.38L9.2 8.3h7.6l.2-1.99H7l.56 6.01h6.89l-.23 2.58l-2.22.6l-2.22-.6l-.14-1.66h-2l.29 3.19L12 17.56M4.07 3h15.86L18.5 19.2L12 21l-6.5-1.8L4.07 3Z"
                ></path>
              </svg>
              &nbsp;&nbsp;{{ $t('html') }}
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {}
</script>

<style></style>
