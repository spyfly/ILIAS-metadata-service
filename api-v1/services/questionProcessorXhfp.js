import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const questionProcessorXhfp = {
    async processQuestion(xhfpQuestionObj) {
        const xhfpParameters = JSON.parse(xhfpQuestionObj.parameters);
        //console.log(xhfpQuestionObj.parameters);

        const questionMetadata = {
            title: xhfpQuestionObj.title,
            id: xhfpQuestionObj.content_id,
            provider: "H5P",
            type: xhfpQuestionObj.name.replace("H5P.", ""),
            xhfpParameters: xhfpParameters
        };
        return questionMetadata;
    }
}

export default questionProcessorXhfp;