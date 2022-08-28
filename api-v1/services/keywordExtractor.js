import axios from 'axios';
import config from '../../config.json' assert {type: 'json'};
const keywordExtractorApiPath = config.keywordExtractor.apiPath;

const instance = axios.create({
    baseURL: keywordExtractorApiPath
});

const keywordExtractor = {
    async extractKeywords(xmlContent) {
        const filteredXml = await this.filterXml(xmlContent);
        const extractedKeywords = await this.callKeyBERT(filteredXml);
        return extractedKeywords
    },

    async filterXml(xmlContent) {
        // Remove XML Tags
        const noXmlTags = xmlContent.replace(/<[^>]*>/g, ' ')
        // Remove TeX Content
        const noTexAndXmlTags = noXmlTags.replace(/(\[tex\])(.*?)(\[\/tex\])/g, ' ');
        return noTexAndXmlTags;
    },

    async callKeyBERT(input) {
        // Data input
        const response = await instance.post("/extract_keywords", input, {
            headers: {
                'Content-Type': 'text/plain'
            }
        });
        return response.data;
    },
}

export default keywordExtractor;