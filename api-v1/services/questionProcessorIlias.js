import e from "express";
import { XMLParser, XMLBuilder, XMLValidator } from "fast-xml-parser";

const questionProcessorIlias = {
    async processQuestionsXml(xmlObj) {
        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        const questionsXml = parser.parse(xmlObj);
        var questionItems = [];
        if (questionsXml.questestinterop) {
            if (questionsXml.questestinterop.item && questionsXml.questestinterop.item.length) {
                for (const questionItem of questionsXml.questestinterop.item) {
                    questionItems.push(await this.processQuestionItem(questionItem));
                }
            } else {
                questionItems.push(await this.processQuestionItem(questionsXml.questestinterop.item))
            }
        }
        console.log(JSON.stringify(questionsXml))
        return questionItems;
    },

    async processQuestionItem(questionItem) {
        const questionMetadata = {
            title: questionItem['@_title'],
            id: questionItem['@_ident'],
            provider: "ILIAS",
            type: await this.extractQuestionType(questionItem),
            question: questionItem.presentation.flow.material.mattext['#text'],
            choices: await this.extractChoices(questionItem)
        }
        return questionMetadata;
    },

    async extractQuestionType(questionItem) {
        let questionType = '';
        let rawQuestionType = '';
        for (const metadataEntry of questionItem.itemmetadata.qtimetadata.qtimetadatafield) {
            if (metadataEntry.fieldlabel == "QUESTIONTYPE") {
                rawQuestionType = metadataEntry.fieldentry;
                break;
            }
        }
        for (const questionString of rawQuestionType.split(" ")) {
            const lowerCaseString = questionString.toLowerCase();
            questionType += lowerCaseString.charAt(0).toUpperCase() + lowerCaseString.slice(1);
        }
        return questionType;
    },

    async extractChoices(questionItem) {
        var choices = [];
        for (const rawChoice of questionItem.presentation.flow.response_lid.render_choice.response_label) {
            const choice = {
                id: rawChoice['@_ident'],
                text: rawChoice.material.mattext['#text']
            }

            choices.push(choice);
        }
        return choices;
    }
}

export default questionProcessorIlias;