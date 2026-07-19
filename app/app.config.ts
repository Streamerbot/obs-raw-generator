export default defineAppConfig({
  ui: {
    colors: {
      primary: 'sky',
      neutral: 'neutral',
    },

    card: {
      slots: {
        title: 'font-logo tracking-tight',
      },
    },

    button: {
      slots: {
        base: 'font-logo tracking-tight cursor-pointer',
      },
    },
  },
});
