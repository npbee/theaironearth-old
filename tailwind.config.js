module.exports = {
  theme: {
    zIndex: {
      "-1": "-1",
    },
    extend: {
      colors: {
        grey: {
          50: "#f5f7fa",
          100: "#e4e7eb",
          200: "#cbd2d9",
          300: "#9aa5b1",
          400: "#7b8794",
          500: "#616e7c",
          600: "#52606d",
          700: "#3e4c59",
          800: "#323f4b",
          900: "#1f2933",
        },
        "white-trans": "hsla(36, 64%, 99%, 0.9)",
      },
    },
    container: {
      center: true,
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
    borderColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [],
};
