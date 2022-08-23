import e from "express";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const multimediaProcessor = {
    async processMultimediaXml(xmlObj) {
        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let multimediaXml = parser.parse(xmlObj);
        var multimediaItems = [];
        if (multimediaXml.MediaObject) {
            if (multimediaXml.MediaObject.MediaItem && multimediaXml.MediaObject.MediaItem.length) {
                for (const mediaItem of multimediaXml.MediaObject.MediaItem) {
                    multimediaItems.push(await this.processMultimediaItem(mediaItem, multimediaXml.MediaObject));
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
        return mediaObj;
    }
}

export default multimediaProcessor;