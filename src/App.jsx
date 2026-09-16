import { useEffect, useState } from 'react'
import Panel from './components/Panel';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Button from './components/Button';
import Radio from './components/Radio';
// import template from './data/template.json'
import step from './data/step-template.json'
import answer from './data/answer-template.json'

function App() {

  // const [standartTemplate, setStandartTemplate] = useState(template);
  const [stepTemplate, setStepTemplate] = useState(step);
  const [answerTemplate, setAnswerTemplate] = useState(answer);

  const [inputQuestionsAnswers, setInputQuestionsAnswers] = useState([stepTemplate]);
  const [newConfig, setNewConfig] = useState("");
  const [newConfigEmpty, setNewConfigEmpty] = useState(true);

  function addQuestion() {
    setInputQuestionsAnswers(prev => [
      ...prev,
      stepTemplate
    ]);
  }

  function addAnswer(index) {
    setInputQuestionsAnswers(prev => {
      const question = [...prev];
      question[index] = {
        ...question[index],
        answers: [
          ...question[index].answers,
          answerTemplate
        ]
      };
      return question;
    })
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const data = Object.fromEntries(form);

    setInputQuestionsAnswers(prev => {
      return prev.map((step, index_step) => ({
        ...step,

        type: data[`type_question${index_step + 1}`] === "optionButton" ? 'optionButton' : 'tile',

        answers: step.answers.map((answer, index_answer) => ({
          ...answer,
          title: data[`question${index_step + 1}_answer${index_answer + 1}`],
          isCorrect: data[`isCorrect_question${index_step + 1}_answer${index_answer + 1}`] === "true",
          description: data[`question${index_step + 1}_answer${index_answer + 1}_description`]
        })),

        question: [
          {
            ...step.question[0],
            text: data[`question${index_step + 1}`],
            type: "description"
          },
          {
            ...step.question[1]
          }
        ]
      }));
    }); 
    setNewConfigEmpty(false);
  }

  useEffect(() => {
      setNewConfig(JSON.stringify(inputQuestionsAnswers, null, 2));
  }, [inputQuestionsAnswers])

  return (
    <div className='main__container'>
      <form className='w-full grid grid-cols-2 gap-1 mb-1' onSubmit={ handleSubmit }>
        <Panel classname="col-span-2 flex flex-col">
          <Input placeholder="Введите название..." label="Название теста" id="name" name="name" />
        </Panel>
        <Panel classname="col-span-2 flex flex-col">
          <Input placeholder="/slug-test" label="Слаг" id="slug" name="slug" />
        </Panel>
        {inputQuestionsAnswers.map((question, index_question) => {
          return (
            <Panel key={ index_question } classname="col-span-2 grid grid-cols-2 gap-2">
              <div className="col-span-2 flex flex-col">
                <Input placeholder="Введите вопрос..."
                  label={`Вопрос ${index_question + 1}`} 
                  id={`question${index_question + 1}`} 
                  name={`question${index_question + 1}`} />
              </div>

              <div>
                <Radio id={`optionButton_question${index_question + 1}`} 
                  name={`type_question${index_question + 1}`}
                  value="optionButton">Плашки</Radio>
              </div>
              <div>
                <Radio id={`tile_question${index_question + 1}`} 
                  name={`type_question${index_question + 1}`}
                  value="tile">Тайлы (в разработке)</Radio>
              </div>

              {question.answers.map((option, index_answer) => {
                return(
                  <div key={ index_answer } className="grid grid-cols-1 gap-1">
                    <div className="flex flex-col">
                      <Input placeholder="Введите вариант ответа..." 
                        label={`Вариант ответа ${index_answer + 1}`} 
                        id={`question${index_question + 1}_answer${index_answer + 1}`} 
                        name={`question${index_question + 1}_answer${index_answer + 1}`} />
                    </div>
                    <div className="flex flex-col">
                      <Textarea readOnly={ false } placeholder="Введите описание ответа..." 
                        label={`Описание варианта ответа ${index_answer + 1}`} heightArea="5" 
                        id={`question${index_question + 1}_answer${index_answer + 1}_description`} 
                        name={`question${index_question + 1}_answer${index_answer + 1}_description`} />
                    </div>
                    <div className="grid grid-cols-3">
                      <div>
                        <Radio id={`true_question${index_question + 1}_answer${index_answer + 1}`} 
                        name={`isCorrect_question${index_question + 1}_answer${index_answer + 1}`}
                        value="true">Верно</Radio>
                      </div>
                      
                      <div>
                        <Radio id={`false_question${index_question + 1}_answer${index_answer + 1}`} 
                        name={`isCorrect_question${index_question + 1}_answer${index_answer + 1}`}
                        value="false">Неверно</Radio>
                      </div>
                    </div>
                  </div>
              )})}
              <div className="col-span-2">
                <Button onClick={ () => addAnswer(index_question) }>Ответ+</Button>
              </div>
              
            </Panel>
          )})}
        {/* <TextArea label="Вопросы и ответы" placeholder="Введите текст..." heightArea="10" id="questions_answers" name="questions_answers" />
        <TextArea label="Результаты" placeholder="Введите текст..." heightArea="10" id="results" name="results" /> */}
        <Button onClick={ addQuestion }>Вопрос+</Button>
        <Button classname="justify-self-end">Сгенерировать</Button>
      </form>
      
      <Panel classname="w-full">
        <Textarea classname="w-full" 
        placeholder="Здесь будет сгенерированный конфиг" 
        label="Конфиг" id="config" name="config" 
        heightArea={ newConfigEmpty ? 5 : 15 } readOnly={ true } value={ newConfigEmpty ? "": newConfig }></Textarea>
      </Panel>
    </div>
  )
}

export default App