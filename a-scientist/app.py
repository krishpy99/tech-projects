from flask import Flask, request, render_template
from transformers import pipeline

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    if request.method == 'POST':
        q = request.form['question']
        c = request.form['context']
        model_name = "z-uo/bert-qasper"
        nlp = pipeline('question-answering', model=model_name, tokenizer=model_name)
        result = nlp({'question': q, 'context': c})
        print("Result: ", result)
        return render_template('result.html', result=result["answer"])
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)
