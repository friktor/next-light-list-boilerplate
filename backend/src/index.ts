import * as config from "./config";
import { setup } from "./setup";

async function main() {
  const app = setup();
  
  console.log("Default config:");
  Object.entries(config.config).forEach(([key, value]) =>
    console.log(`- ${key}: ${value}`)
  );

  await app.ready();
  await app.orm.runMigrations();

  ["SIGINT", "SIGTERM"].forEach((signal) =>
    process.on(signal, async () => {
      try {
        await app.close();
        app.log.error(signal);
        process.exit(0);
      } catch (err) {
        app.log.error(signal, err);
        process.exit(1);
      }
    })
  );

  try {
    await app.listen({
      port: config.PORT,
      host: "0.0.0.0",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

process.on("unhandledRejection", (error) => {
  console.error(error);
  process.exit(1);
});

main();
