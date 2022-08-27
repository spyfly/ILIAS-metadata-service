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
            interactivity: await this.extractInteractivity(xhfpParameters),
            xhfpParameters: xhfpParameters
        };
        return questionMetadata;
    },

    async extractInteractivity(xhfpParameters) {
        const maxAttempts = xhfpParameters.behaviour.enableRetry ? 0 : 1;
        const isInteractive = maxAttempts != 1;
        return {
            interactive: isInteractive,
            maxAttempts: maxAttempts
        }
    }
}

export default questionProcessorXhfp;