import iliasRESTApiClient from "./iliasRESTApiClient.js";
import keyword_extractor from "keyword-extractor";
import multimediaProcessor from "./multimediaProcessor.js";
import questionProcessorIlias from "./questionProcessorIlias.js";
import { retext } from 'retext'
import retextPos from 'retext-pos'
import retextKeywords from 'retext-keywords'

const metadataGenerationService = {
  async generateMetadata(ref_id) {
    const raw_data = await iliasRESTApiClient.getLearningModule(ref_id);
    if (raw_data["type"] == "lm") {
      return await this.generateLmMetadata(raw_data);
    }
    return raw_data;
  },

  async generateLmMetadata(raw_data) {
    let metadataObj = {
      title: raw_data["title"],
      type: raw_data["type"],
      pages: []
    }

    for (const raw_page of raw_data["content"]) {
      let pageMetadataObj = await this.generatePageMetadata(raw_page);
      metadataObj.pages.push(pageMetadataObj);
    }

    return metadataObj;
  },

  async generatePageMetadata(raw_data) {
    let metadataObj = {
      title: raw_data["title"],
      type: raw_data["type"],
      parent: raw_data["parent"],
      obj_id: raw_data["obj_id"]
    }

    //Multimedia Types
    if (raw_data["multimediaXml"]) {
      //metadataObj.multimediaTypes = [];
      /*for (const multimediaResults of raw_data["multimediaXml"].matchAll(/<Format>([^<]*)<\/Format>/g)) {
        metadataObj.multimediaTypes.push(multimediaResults[1]);
      }*/
      try {
        metadataObj.multimedia = await multimediaProcessor.processMultimediaXml(raw_data["multimediaXml"]);
      } catch (err) {
        console.log(err)
      }
    }

    //ILIAS Questions
    if (raw_data["questionsXml"]) {
      try {
        metadataObj.questions = await questionProcessorIlias.processQuestionsXml(raw_data["questionsXml"]);
      } catch (err) {
        console.log(err);
      }
    }

    //H5P Questions
    if (raw_data["questionsXhfp"] && raw_data["questionsXhfp"].length > 0) {
      if (!metadataObj.questionTypes)
        metadataObj.questionTypes = [];

      for (const xhfpQuestion of raw_data["questionsXhfp"]) {
        metadataObj.questionTypes.push(xhfpQuestion);
      }
    }

    //Keywords
    if (raw_data["xmlContent"]) {
      // Remove XML Tags
      const textContent = raw_data["xmlContent"].replace(/<[^>]*>/g, ' ');
      metadataObj.keywords =
        keyword_extractor.extract(textContent, {
          language: "german",
          remove_digits: true,
          return_changed_case: true,
          remove_duplicates: true,
        });
    }

    return metadataObj;
  }
};

export default metadataGenerationService;