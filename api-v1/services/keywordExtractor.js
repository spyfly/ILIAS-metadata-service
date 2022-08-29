import axios from 'axios';
import config from '../../config.json' assert {type: 'json'};
const keywordExtractorApiPath = config.keywordExtractor.apiPath;

const instance = axios.create({
    baseURL: keywordExtractorApiPath
});

const keywordExtractor = {
    async extractKeywords(xmlContent) {
        const filteredXml = await this.filterXml(xmlContent);
        const keyBERTResponse = await this.callKeyBERT(filteredXml);
        const extractedKeywords = await this.processResponse(keyBERTResponse);
        return extractedKeywords;
    },

    async filterXml(xmlContent) {
        // Remove XML Tags
        const noXmlTags = xmlContent.replace(/<[^>]*>/g, ' ')
        // Remove TeX Content
        const noTexAndXmlTags = noXmlTags.replace(/(\[tex\])(.*?)(\[\/tex\])/g, ' ');
        return noTexAndXmlTags;
    },

    async processResponse(keyBERTResponse) {
        var keywords = [];
        if (keyBERTResponse.length > 0) {
            for (const [keyword, _] of keyBERTResponse) {
                keywords.push(keyword);
            }
        }
        return keywords;
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