import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { storage } from "./storage/resource";

const env = process.env.AWS_BRANCH ?? "sandbox"

const backend = defineBackend({
  auth,
  storage,
});
