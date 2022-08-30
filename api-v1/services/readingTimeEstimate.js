import readingTime from "reading-time";

const readingTimeEstimate = {
    async filterXml(xmlContent) {
        // Remove XML Tags
        const noXmlTags = xmlContent.replace(/<[^>]*>/g, ' ')
        // Remove TeX Tags
        const noTexAndXmlTags = noXmlTags.replace(/(\[tex\])|(\[\/tex\])/g, ' ');
        return noTexAndXmlTags;
    },

    async getEstimate(xmlContent) {
        const filteredText = await this.filterXml(xmlContent);
        return readingTime(filteredText);
    }
}

export default readingTimeEstimate;