export default function manifest() {
  return {
    name: "CineDNA",
    short_name: "CineDNA",
    description: "Ανακάλυψε το κινηματογραφικό σου DNA",
    start_url: "/",
    display: "standalone",
    background_color: "#080808",
    theme_color: "#080808",
    orientation: "portrait",
    categories: ["entertainment", "lifestyle"],
    lang: "el",
    icons: [
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable any",
      },
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable any",
      },
    ],
  };
}
