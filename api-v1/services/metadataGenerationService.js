import iliasRESTApiClient from "./iliasRESTApiClient.js";
import keyword_extractor from "keyword-extractor";
import multimediaProcessor from "./multimediaProcessor.js";
import questionProcessorIlias from "./questionProcessorIlias.js";
import questionProcessorXhfp from "./questionProcessorXhfp.js";
import keywordExtractor from "./keywordExtractor.js";
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
      if (!metadataObj.questions)
        metadataObj.questions = [];

      for (const xhfpQuestionObj of raw_data["questionsXhfp"]) {
        metadataObj.questions.push(await questionProcessorXhfp.processQuestion(xhfpQuestionObj));
      }
    }

    //Keywords
    if (raw_data["xmlContent"]) {
      metadataObj.keywords = await keywordExtractor.extractKeywords(raw_data["xmlContent"]);
    }

    return metadataObj;
  }
};

export default metadataGenerationService;