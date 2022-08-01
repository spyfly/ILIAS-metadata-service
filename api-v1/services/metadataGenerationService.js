import iliasRESTApiClient from "./iliasRESTApiClient.js";
import keyword_extractor from "keyword-extractor";
import {retext} from 'retext'
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

    if (raw_data["multimediaXml"]) {
      metadataObj.multimediaTypes = [];
      for (const multimediaResults of raw_data["multimediaXml"].matchAll(/<Format>([^<]*)<\/Format>/g)) {
        metadataObj.multimediaTypes.push(multimediaResults[1]);
      }
    }

    if (raw_data["questionsXml"]) {
      metadataObj.questionTypes = [];
      for (const questionResults of raw_data["questionsXml"].matchAll(/<fieldlabel>QUESTIONTYPE<\/fieldlabel><fieldentry>([^<]*)<\/fieldentry>/g)) {
        metadataObj.questionTypes.push(questionResults[1]);
      }
    }

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