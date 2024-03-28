import DataStore from "./store";
import ReedsDocument from "../shared_modules/document";

const documentStore = new DataStore({
  fileName: "documents",
  defaults: {
    documents: [],
  },
});

export default documentStore;
