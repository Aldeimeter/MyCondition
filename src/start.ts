import { createApp } from "./app";
const PORT: string | number = process.env.PORT || 8080;
// App boot
createApp().then((app) => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
