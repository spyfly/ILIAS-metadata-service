import axios from "axios";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";
import FormData from "form-data";
import config from '../../config.json' assert {type: 'json'};
import iliasRESTApiClient from "./iliasRESTApiClient.js";
const iliasPath = config.ILIAS.path;
const keywordExtractorApiPath = config.keywordExtractor.apiPath;

const instance = axios.create({
    baseURL: keywordExtractorApiPath
});

const multimediaProcessor = {
    async processMultimediaXml(xmlObj) {
        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let multimediaXml = parser.parse(xmlObj);
        var multimediaItems = [];
        if (multimediaXml.MediaObject) {
            if (multimediaXml.MediaObject && multimediaXml.MediaObject.length) {
                for (const MediaObject of multimediaXml.MediaObject) {
                    multimediaItems.push(await this.processMultimediaItem(MediaObject.MediaItem, MediaObject));
                }
            } else if (multimediaXml.MediaObject.MediaItem) {
                multimediaItems.push(await this.processMultimediaItem(multimediaXml.MediaObject.MediaItem, multimediaXml.MediaObject));
            }
        }
        return multimediaItems;
    },

    async processMultimediaItem(mediaItem, mediaObject) {
        //console.log(mediaItem)
        const typeFormat = mediaItem.Format.split("/");
        let mediaObj = {
            title: mediaItem.Title,
            type: typeFormat[0],
            format: typeFormat[1],
            ilMob: mediaObject['@_Id'].replace("il__mob_", ""),
            location: {
                path: mediaItem.Location['#text'],
                type: mediaItem.Location['@_Type'],
            }
        };
        //Captions
        if (mediaItem.Caption) {
            mediaObj.caption = {
                text: mediaItem.Caption['#text'],
                alignment: mediaItem.Caption['@_Align']
            }
        }

        if (mediaObj.location.type == "LocalFile") {
            //OCR and Classification for images
            if (mediaObj.type == "image") {
                const processingResult = await this.processImage(mediaObj);
                mediaObj.analysis = processingResult;
            }
        }
        return mediaObj;
    },

    async processImage(mediaObj) {
        let data = new FormData();
        data.append('url', iliasPath + '/data/ilias/mobs/mm_'+mediaObj.ilMob+'/'+mediaObj.location.path);
        data.append('sessionId', await iliasRESTApiClient.getSessionId());
        const response = await instance.post('/process_image', data)
        return response.data;
    }
}

export default multimediaProcessor;