import { useEffect, useState } from 'react'
import Panel from './components/Panel';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Button from './components/Button';
import Radio from './components/Radio';
// import template from './data/template.json'
import step_json from './data/step-template.json'
import answer_json from './data/answer-template.json'
import result_json from './data/result-template.json'
import item_result_json from './data/item-result-template.json'
import template_json from './data/template.json'

function App() {

  const stepTemplate = step_json;
  const answerTemplate = answer_json;
  const resultTemplate = result_json;
  const itemResultTemplate = item_result_json;
  const templateJSON = template_json;

  const [dataQuestionsAnswers, setDataQuestionsAnswers] = useState([stepTemplate]);
  const [dataResult, setDataResult] = useState(resultTemplate);
  const [dataConfig, setDataConfig] = useState(templateJSON);
  const [dataConfigEmpty, setDataConfigEmpty] = useState(true);

  function addQuestion() {
    setDataQuestionsAnswers(prev => [
      ...prev,
      stepTemplate
    ]);
  }

  function addAnswer(index) {
    setDataQuestionsAnswers(prev => {
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

  function addResult() {
    setDataResult(prev => {
      const result = {
        ...prev,
        items: [
          ...prev.items,
          itemResultTemplate
        ]
      };
      return result;
    })
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const data = Object.fromEntries(form);

    setDataQuestionsAnswers(prev => {
      return prev.map((step, index_step) => ({
        ...step,

        type: data[`type_question${index_step + 1}`] === "optionButton" ? 'optionButton' : 'tile',

        answers: step.answers.map((answer, index_answer) => ({
          ...answer,
          title: data[`question${index_step + 1}_answer${index_answer + 1}`],
          isCorrect: data[`isCorrect_question${index_step + 1}_answer${index_answer + 1}`] === "true",
          description: data[`question${index_step + 1}_answer${index_answer + 1}_description`]
        })),

        question: data[`img${index_step + 1}`].name ? 
          [
            {
              text: data[`question${index_step + 1}`],
              type: "description"
            },
            {
              "url": `https://opis-cdn.tinkoffjournal.ru/mercury/${data[`img${index_step + 1}`].name}`,
              "size": "fullWidth",
              "type": "image"
            }
          ] : [
            {
              text: data[`question${index_step + 1}`],
              type: "description"
            }
          ]
      }));
    }); 
    setDataResult(prev => {
      const result = {
        ...prev,
        items: prev.items.map((item, index_item) => ({
          ...item,
          min: data[`result${index_item + 1}_min`],
          title: data[`result${index_item + 1}`],
          description: data[`result${index_item + 1}_description`]
        }))
      }
      return result;
    }); 
    setDataConfigEmpty(false);
  }

  useEffect(() => {
      setDataConfig(prev => {
        const config = {
          ...prev, 
          steps: dataQuestionsAnswers,
          result: dataResult
        }
        return config
      });
  }, [dataQuestionsAnswers, dataResult])

  return (
    <div className='main__container'>

      <form className='w-full grid grid-cols-2 gap-1 mb-1' onSubmit={ handleSubmit }>

        <Panel classname="col-span-2 flex flex-col">
          <Input type="text" placeholder="Введите название..." label="Название теста" id="name" name="name" />
        </Panel>

        <Panel classname="col-span-2 flex flex-col">
          <Input type="text" placeholder="/slug-test" label="Слаг" id="slug" name="slug" />
        </Panel>

        {dataQuestionsAnswers.map((question, index_question) => {
          return (
            <Panel key={ index_question } classname="col-span-2 grid grid-cols-2 gap-2">
              <div className="col-span-2 flex flex-col">
                <Input type="text" placeholder="Введите вопрос..." label={`Вопрос ${index_question + 1}`} 
                  id={`question${index_question + 1}`} name={`question${index_question + 1}`} />
              </div>

              <div className="col-span-2 flex flex-col">
                <Input type="file" placeholder="" label={`загрузить картинку`} 
                  id={`img${index_question + 1}`} name={`img${index_question + 1}`} />
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

              {question.answers.map((_, index_answer) => {
                return(
                  <div key={ index_answer } className="grid grid-cols-1 gap-1">
                    <div className="flex flex-col">
                      <Input placeholder="Введите вариант ответа..."  type="text" label={`Вариант ответа ${index_answer + 1}`} 
                        id={`question${index_question + 1}_answer${index_answer + 1}`} name={`question${index_question + 1}_answer${index_answer + 1}`} />
                    </div>
                    <div className="flex flex-col">
                      <Textarea readOnly={ false } placeholder="Введите описание ответа..." heightArea="5" 
                        ariaLabel={`Описание варианта ответа ${index_answer + 1}`}
                        id={`question${index_question + 1}_answer${index_answer + 1}_description`} 
                        name={`question${index_question + 1}_answer${index_answer + 1}_description`} />
                    </div>
                    <div className="grid grid-cols-3">
                      <div>
                        <Radio value="true" id={`true_question${index_question + 1}_answer${index_answer + 1}`} 
                        name={`isCorrect_question${index_question + 1}_answer${index_answer + 1}`}>Верно</Radio>
                      </div>
                      
                      <div>
                        <Radio value="false" id={`false_question${index_question + 1}_answer${index_answer + 1}`} 
                        name={`isCorrect_question${index_question + 1}_answer${index_answer + 1}`}>Неверно</Radio>
                      </div>
                    </div>
                  </div>
              )})}
              <div className="col-span-2">
                <Button onClick={ () => addAnswer(index_question) }>Ответ+</Button>
              </div>
              
            </Panel>
          )})}

        <div className="col-span-2">
          <Button onClick={ addQuestion }>Вопрос+</Button>
        </div>

        {dataResult.items.map((result, index_result) => {
          return(
            <Panel key={ index_result } classname="grid grid-cols-1 gap-y-1">
              <div className="col-span-2 flex flex-col">
                <Input type="text" placeholder="Введите вопрос..." label={`Результат ${index_result + 1}`} 
                  id={`result${index_result + 1}`} name={`result${index_result + 1}`} />
              </div>
              <div className="flex flex-col">
                <Textarea readOnly={ false } placeholder="Введите описание результата..." heightArea="5" ariaLabel={`Описание результата ${index_result + 1}`} 
                  id={`result${index_result + 1}_description`} name={`result${index_result + 1}_description`} />
              </div>
              <div className="col-span-2 flex flex-col">
                <Input type="number" placeholder="Введите минимальный балл..." ariaLabel="Минималльный балл"
                  id={`result${index_result + 1}_min`} name={`result${index_result + 1}_min`} />
              </div>
            </Panel>
          )})}

        <div className="col-span-2">
          <Button onClick={ addResult }>Результат+</Button>
        </div>

        <div className="col-span-2 justify-self-end">
          <Button>Сгенерировать</Button>
        </div>

      </form>
      
      <Panel classname="w-full">

        <Textarea classname="w-full" 
        placeholder="Здесь будет сгенерированный конфиг" ariaLabel="Конфиг" id="config" name="config" 
        heightArea={ dataConfigEmpty ? 5 : 15 } readOnly={ true } value={ dataConfigEmpty ? "": JSON.stringify(dataConfig, null, 2) }></Textarea>

      </Panel>
    </div>
  )
}

export default App