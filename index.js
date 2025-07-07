import { registerRootComponent } from "expo";
import { db } from "./src/config/firebaseConfig";

import App from "./App";
const dtat = db;
registerRootComponent(App);
