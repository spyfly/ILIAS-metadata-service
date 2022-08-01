import iliasRESTApiClient from "./iliasRESTApiClient.js";

const metadataGenerationService = {
    async generateMetadata(ref_id) {
      const raw_data = await iliasRESTApiClient.getLearningModule(ref_id);
      return raw_data;
    }
  };
  
  export default metadataGenerationService;