from transformers import AutoModelForQuestionAnswering, AutoTokenizer, pipeline

# Load model with pipeline
model_name = "z-uo/bert-qasper"
nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)

# Get predictions
QA_input = {
    'question': 'what they propose?',
    'context': "In this paper, we provide an innovative contribution in the research domain dedicated to crop mapping by exploiting the of Sentinel-2 satellite images time series, with the specific aim to extract information on 'where and when' crops are grown. The final goal is to set up a workflow able to reliably identify (classify) the different crops that are grown in a given area by exploiting an end-to-end (3+2)D convolutional neural network (CNN) for semantic segmentation. The method also has the ambition to provide information, at pixel level, regarding the period in which a given crop is cultivated during the season. To this end, we propose a solution called Class Activation Interval (CAI) which allows us to interpret, for each pixel, the reasoning made by CNN in the classification determining in which time interval, of the input time series, the class is likely to be present or not. Our experiments, using a public domain dataset, show that the approach is able to accurately detect crop classes with an overall accuracy of about 93% and that the network can detect discriminatory time intervals in which crop is cultivated. These results have twofold importance: (i) demonstrate the ability of the network to correctly interpret the investigated physical process (i.e., bare soil condition, plant growth, senescence and harvesting according to specific cultivated variety) and (ii) provide further information to the end-user (e.g., the presence of crops and its temporal dynamics)."
}

res = nlp(QA_input)
print(res)
# Load model & tokenizer without pipeline
model = AutoModelForQuestionAnswering.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)


