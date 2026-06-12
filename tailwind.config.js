/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html,js}", "./src/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        body: ["Figtree", "Roboto", "Noto Sans", "Helvetica", "Calibri"],
      },
      colors: {
        "black-teal": "#091d20",
        "deep-teal": "#093c44",
        "dark-teal": "#115e6e",
        "light-teal": "#2f8d98",
        "bright-teal": "#C7DEE0",
        "white-teal": "#f3fafc",
        green: "#b5cd34",
        orange: "#f7941e",
        "pale-orange": "#e4b782",
        "white-orange": "#fff4e7",
        "dark-gray": "#414042",
        "light-gray": "#6d6e71",
        "ada-green": "#6a7f17",
        "ada-orange": "#a84c2a",
      },
      borderWidth: {
        10: "10px",
      },
    },
    listStyleType: {
      none: "none",
      disc: "disc",
      decimal: "decimal",
      square: "square",
      roman: "upper-roman",
      "lower-roman": "lower-roman",
      circle: "circle",
      uppercase: "upper-alpha",
      lowercase: "lower-alpha",
    },
  },
  plugins: [],
};
