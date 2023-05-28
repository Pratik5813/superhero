import { TextControl, Flex, FlexBlock, Button, PanelBody, PanelRow, TextareaControl } from "@wordpress/components"
import { InspectorControls, MediaPlaceholder } from "@wordpress/block-editor"

wp.blocks.registerBlockType("theplugin/hangman", {
    title: "Hangman for WordPress",
    icon: "smiley",
    category: "common",
    attributes: {
        phrase: { type: "array", default: [""] },
        allowedWrongAnswers: { type: "string", default: 3 },
        description: { type: "string" },
        sponsorMessage: { type: "string" },
        wordImage: { default: undefined },
        sponsorImage: { default: undefined }
    },
    description: "Hangman Game for Wordpress",
    edit: EditComponent,
    save: function () {
        return null
    }
})

function EditComponent(props) {
    function setPhrase(newPhrase) {
        props.setAttributes({ phrase: newPhrase })
    }
    function changeAllowedVal(allowedValue) {
        props.setAttributes({ allowedWrongAnswers: allowedValue })
    }
    function changeDescription(newDescrip) {
        props.setAttributes({ description: newDescrip })
    }
    function changeMessage(newMessage) {
        props.setAttributes({ sponsorMessage: newMessage })
    }
    function setWordImage(newImage) {
        props.setAttributes({ wordImage: newImage.url })
    }
    function setSponsorImage(newSponsorImage) {
        props.setAttributes({ sponsorImage: newSponsorImage.url })
    }
    return (
        <>
            <InspectorControls>
                <PanelBody>
                    <PanelRow>
                        <TextControl label="Allowed Wrong Answers" value={props.attributes.allowedWrongAnswers} type="number" onChange={changeAllowedVal}></TextControl>
                    </PanelRow>
                    <PanelRow>
                        <TextareaControl maxLength="200" label="Description" value={props.attributes.description} type="text" onChange={changeDescription}></TextareaControl>
                    </PanelRow>
                    {props.attributes.wordImage ? (
                        <PanelRow>
                            <img src={props.attributes.wordImage} height="100px" width="100%" />
                        </PanelRow>) : " "}
                    <PanelRow>
                        <MediaPlaceholder labels={{
                            title: "Word Image",
                        }}
                            value={props.attributes.wordImage} onSelect={setWordImage}></MediaPlaceholder>
                    </PanelRow>
                    <PanelRow>
                        <Button
                            isPrimary
                            onClick={() => {
                                props.setAttributes({ wordImage: undefined})
                            }}
                        >
                            Remove Word Image
                        </Button>
                    </PanelRow>
                    <PanelRow>
                        <TextareaControl maxLength="200" label="Sponsor Message" value={props.attributes.sponsorMessage} type="text" onChange={changeMessage}></TextareaControl>
                    </PanelRow>
                    {props.attributes.sponsorImage ? (
                        <PanelRow>
                            <img src={props.attributes.sponsorImage} height="100px" width="100%" />
                        </PanelRow>) : " "}
                    <PanelRow>
                        <MediaPlaceholder labels={{
                            title: "Sponsor Image",
                        }}
                            value={props.attributes.sponsorImage} onSelect={setSponsorImage}></MediaPlaceholder>
                    </PanelRow>
                    <PanelRow>
                        <Button
                            isPrimary
                            onClick={() => {
                                props.setAttributes({ sponsorImage: undefined})
                            }}
                        >
                            Remove Sponsor Image
                        </Button>
                    </PanelRow>
                </PanelBody>
            </InspectorControls>
            {props.attributes.phrase.map(function (word, index) {
                return (
                    <Flex>
                        <FlexBlock>
                            <TextControl
                                autoFocus={word == undefined}
                                value={word}
                                onChange={newValue => {
                                    const newphrase = props.attributes.phrase.concat([])
                                    newphrase[index] = newValue
                                    props.setAttributes({ phrase: newphrase })
                                }}
                            />
                        </FlexBlock>
                    </Flex>
                )
            })}
        </>
    )
}