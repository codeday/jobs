import React, {useState, useMemo, useRef} from 'react';
import {AnnotationFactory} from "annotpdf";
import {Document, Page, pdfjs} from 'react-pdf';
import Box, {Grid} from '@codeday/topo/Atom/Box';
import Skelly from '@codeday/topo/Atom/Skelly';
import Spinner from '@codeday/topo/Atom/Spinner';
import Text, { Heading } from '@codeday/topo/Atom/Text';
import Button from '@codeday/topo/Atom/Button'
import {Textarea} from '@chakra-ui/react'; // not exported in this version of topo
import List, {Item as ListItem} from '@codeday/topo/Atom/List';

import {useDisclosure} from '@codeday/topo/utils';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import {UiCheck, UiX} from "@codeday/topocons/Icon"
import Popover, {
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverArrow,
    PopoverCloseButton,
} from "@codeday/topo/Atom/Popover";
// import { PopoverFooter } from '@chakra-ui/react' // not exported in this version of topo
import EditAnnotation from "./EditAnnotation";
import InfoBox from "./InfoBox";
import {InfoAlert} from "./Alert";

const MINIMUM_ANNOTATION_COUNT = 1

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

const SCALE = 1.2;

export default function ResumeReview({pdf, annotatedFile, setAnnotatedFile}) {
    const [numPages, setNumPages] = useState(1)
    const [pageHeight, setPageHeight] = useState(null) // will cause problems if pages have varying heights but i dont care
    const [annotationProps, setAnnotationProps] = useState()
    const [annotator, setAnnotator] = useState(null)
    const [feedbackText, setFeedbackText] = useState('')
    const [popoverX, setPopoverX] = useState()
    const [popoverY, setPopoverY] = useState()
    const {isOpen, onToggle, onClose} = useDisclosure({onClose: () => setFeedbackText('')})
    const ref = useRef();

    if(annotator && !annotatedFile) {
        setAnnotatedFile(annotator.write())
    }
    const document = useMemo(() => (
        <Document
            loading={<Skelly h={pageHeight * numPages} />}
            file={{data: annotatedFile}}
            height={pageHeight}
        >
            { [...Array(numPages).keys()].map((_, idx) => {
                return (
                    <Page
                        key={idx}
                        loading={<Skelly h={pageHeight} />}
                        pageNumber={idx+1}
                        height={pageHeight}
                        onClick={(e) => {
                            //https://stackoverflow.com/a/48390126
                            const rect = e.currentTarget.getBoundingClientRect()
                            const offsetX = (e.pageX - window.pageXOffset - rect.left) / SCALE;
                            const offsetY = (e.pageY - window.pageYOffset - rect.bottom) / SCALE;
                            setPopoverX(e.pageX)
                            setPopoverY(e.pageY)
                            setAnnotationProps({
                                page: idx,
                                rect: [offsetX, -offsetY, offsetX + 10, -offsetY + 10],
                            })
                            onToggle()
                        }}
                    />
                )
            })
            }
        </Document>
    ), [numPages, annotator, annotatedFile, pageHeight])
    return (
        <Box>
            {/*Really dumb hack because for some reason pdf.worker.js doesn't properly handle popupDate the same way*/}
            {/*pdf.js does, so it displays as {{date}}, {{time}} and I think that's really annoying */}
            <style type="text/css">
                {`.annotationLayer .popupDate {
                    display: none;
                }
                .textAnnotation > img {
                content:url('/annotation-note.svg')
                }
                `}
            </style>
            {/* Initial PDF just to get number of pages and size */}
            <Document
                file={pdf}
                loading={< Spinner h={pageHeight} />}
                onLoadSuccess={async (file) => {
                    setAnnotator(new AnnotationFactory(await file.getData()))
                    setNumPages(file.numPages)
                    setPageHeight((await file.getPage(1)).view[3] * SCALE)
                }}/>
            <Popover
                isOpen={isOpen}
                onClose={onClose}
                initialFocusRef={ref}
                closeOnBlur={false}
            >
                <PopoverTrigger>
                    <Box position="absolute" left={popoverX} top={popoverY}/>
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverHeader>
                        <Text bold>Compose Feedback</Text>
                    </PopoverHeader>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody>
                        <Textarea value={feedbackText} ref={ref} onChange={(e) => setFeedbackText(e.target.value)}/>
                        <Box textAlign="right">
                            <Button mr={4} colorScheme="red" variant="ghost" onClick={onClose}>
                                <UiX />
                            </Button>
                            <Button colorScheme="green" variant="ghost" onClick={() => {
                                annotator.createTextAnnotation({
                                    ...annotationProps,
                                    contents: feedbackText,
                                    author: '', // todo: make this work
                                    open: true
                                })
                                setAnnotatedFile(annotator.write())
                                onClose()
                            }}>
                                <UiCheck />
                            </Button>
                        </Box>
                    </PopoverBody>
                </PopoverContent>
            </Popover>
            <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={4}>
                <Box display="inline-block" borderRightWidth={{ base: 0, lg: 1 }} cursor="pointer">
                    {document}
                </Box>
                <List styleType="none">
                    <Box>
                        <Heading as="h4" fontSize="lg">Draft Feedback</Heading>
                        {annotator?.annotations.length > 0?
                            annotator.annotations.map((annotation, idx) => (
                                <ListItem><EditAnnotation
                                    annotation={annotation}
                                    idx={idx + 1} // only used for visuals
                                    onUpdate={(newContents) => {
                                        let tempAnnotator = annotator
                                        tempAnnotator.annotations[idx].contents = newContents
                                        setAnnotator(tempAnnotator)
                                        setAnnotatedFile(annotator.write())
                                    }}
                                    onDelete={(annotationId) => {
                                        annotator.deleteAnnotation(annotationId).then(() => setAnnotatedFile(annotator.write()))
                                    }}
                                /></ListItem>
                            )) :
                            <ListItem>
                                <Text color="current.textLight">
                                    Click anywhere on the document to leave feedback!
                                </Text>
                            </ListItem>
                        }
                    </Box>
                </List>
            </Grid>
        </Box>
    )
}
