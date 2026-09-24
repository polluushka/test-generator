import { useEffect, useState } from 'react'

import Panel from './components/Panel';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Radio from './components/Radio';
import InputFile from './components/InputFile';

import AddButton from './components/AddButton';
import DeleteButton from './components/DeleteButton';
import PrimaryButton from './components/PrimaryButton';
import CopyButton from './components/CopyButton';

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
      return {
        ...prev,
        items: [
          ...prev.items,
          itemResultTemplate
        ]
      };
    })
  }

  function enterDataQuestionsAnswers(event, index_question, index_answer, field) {
    const value = event.target.value;
    
    setDataQuestionsAnswers(prev =>
      prev.map((q, qIndex) => {

        if(qIndex !== index_question) return q;

        if(field === "question") {
          return({
              ...q,
              question: [
                {
                  ...q.question?.[0],
                  text: value
                }
              ]
            }
          )
        }

        if(field === "answer") {
          return({
              ...q,
              answers: q.answers.map((a, aIndex) => aIndex === index_answer 
              ? {
                  ...a,
                  title: value
                } : a
            )}
          )
        }

        return({
              ...q,
              answers: q.answers.map((a, aIndex) => aIndex === index_answer 
              ? {
                  ...a,
                  description: value
                } : a
            )}
          )
      })
    );
  }

  function enterDataResult(event, index_result, field) {
    const value = event.target.value;
    
    setDataResult(prev => {

      if(field === "result") {
        return {
          ...prev,
          items: prev.items.map((item, index_item) => index_item === index_result 
            ? {
              ...item,
              title: value
            } : item
          )
        }        
      }

      if(field === "resultDescription") {
        return {
          ...prev,
          items: prev.items.map((item, index_item) => index_item === index_result 
            ? {
              ...item,
              description: value
            } : item
          )
        }  
      }

      return {
        ...prev,
        items: prev.items.map((item, index_item) => index_item === index_result 
          ? {
            ...item,
            min: value
          } : item
        )
      }
      
    });
  }

  function deleteQuestion(index_question) {
    setDataQuestionsAnswers(prev => prev.filter((step, index_step) => index_step !== index_question));
  }

  function deleteAnswer(index_question, index_answer) {
    setDataQuestionsAnswers(prev => 
      prev.map((step, index_step) => {
        return index_step === index_question ? {
          ...step,
          answers: step.answers.filter((_, index_step_answer) => index_step_answer !== index_answer)
        } : step;
      }));
  }

  function deleteResult(index_result) {
    setDataResult(prev => {
      return {
        ...prev,
        items: prev.items.filter((item, itemIndex) => itemIndex !== index_result)
      }
    });
  }

  function processText(text) {
    const regExpList = /^\d*\.\s*/;
    let availabilityList = false;
    
    const arrayStr = text.split(/\s*(?:\r?\n)+\s*/).map(str => {
      if (regExpList.test(str)) {
        availabilityList = true;
        return "\n" + str.replace(regExpList, "") + "</li>"
      };
      return  "<p>" + str + "</p>"
    })

    const combinedText = arrayStr.join("");

    if (availabilityList) {
      const formattedStrList = ("<ol type='milchin'>" + 
        combinedText.substring(combinedText.indexOf("\n"), combinedText.lastIndexOf("</li>") + 5) + "</ol>").replaceAll("</li>", "");
      return combinedText.substring(0, combinedText.indexOf("\n")) + formattedStrList + combinedText.substring(combinedText.lastIndexOf("</li>") + 5);
    }

    return combinedText;
  }

  function handleSubmit(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const data = Object.fromEntries(form);

    setDataQuestionsAnswers(prev => {
      return prev.map((step, index_step) => ({
        ...step,

        type: data[`type_question${index_step + 1}`] === "tile" ? "tile" : "optionButton",

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
          imageUrl: data[`imgResult${index_item + 1}`].name.length > 0 
            ? `https://opis-cdn.tinkoffjournal.ru/mercury/${data[`imgResult${index_item + 1}`].name}` : "",
          description: data[`result${index_item + 1}_description`]
        }))
      }
      return result;
    }); 
    setDataConfigEmpty(false);
  }

  function copyConfig() {
    navigator.clipboard.writeText(
      dataConfigEmpty ? "" : JSON.stringify(dataConfig, null, 2)
    );
  }

  useEffect(() => {
      setDataConfig(prev => {
        const config = {
          ...prev, 
          steps: dataQuestionsAnswers,
          result: {
            items: dataResult.items.map(item => {
              return {
                ...item, 
                description: processText(item.description)
              }
            }),
            isRetakeEnabled: dataResult.isRetakeEnabled,
            canScrollToFirstError: dataResult.canScrollToFirstError,
            shouldShowScoreCounter: dataResult.shouldShowScoreCounter
          }
        }
        return config
      });
  }, [dataQuestionsAnswers, dataResult])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="mark">Т</span>
          <span>
            Генератор тестов
            <small>Т—Ж · сборка конфига</small>
          </span>
        </div>

        <div className="spacer"></div>

        <span className="ghost-tag" id="counter">
          {dataQuestionsAnswers.length} вопросов
        </span>
      </header>

      <div className="wrap">

        <form className="builder" id="test-generator-form" onSubmit={ (event) => handleSubmit(event) }>
          <div id="questions">
            {dataQuestionsAnswers.map((question, index_question) => {

              const questionNumber = index_question + 1;

              return (
                <Panel key={`question-panel-${index_question}`} classname="panel">

                  <div className="q-head">
                    <span className="q-index">{questionNumber}</span>
                    <h2>Вопрос</h2>
                    <DeleteButton type="button" onClick={() => deleteQuestion(index_question)}>Удалить</DeleteButton>
                  </div>

                  <div className="stack">
                    <Input type="text" placeholder="Введите вопрос..." label="Текст вопроса"
                      id={`question${questionNumber}`} name={`question${questionNumber}`} value={question.question[0].text}
                      onInput={(event) => enterDataQuestionsAnswers(event, index_question, undefined, "question") } />
                  </div>

                  <div className="stack">
                    <InputFile label="Картинка к вопросу" id={`img${questionNumber}`} name={`img${questionNumber}`} />
                  </div>

                  <div className="type-row">
                    <div className="seg">
                      <Radio id={`optionButton_question${questionNumber}`}
                        name={`type_question${questionNumber}`} value="optionButton">Плашки</Radio>

                      <Radio id={`tile_question${questionNumber}`}
                        name={`type_question${questionNumber}`} value="tile">Тайлы (в разработке)</Radio>

                    </div>
                  </div>

                  <div className="section-title" style={{ marginBottom: "16px" }}>Варианты ответа</div>

                  <div className="answers">

                    {question.answers.map((answer, index_answer) => {

                      const answerNumber = index_answer + 1;

                      return (
                        <div key={`question-panel-${index_question}-answer-${index_answer}`} className="answer">

                          <div className="stack">
                            <Input placeholder="Введите вариант ответа..." type="text" label={`Ответ ${answerNumber}`} value={answer.title}
                              id={`question${questionNumber}_answer${answerNumber}`} name={`question${questionNumber}_answer${answerNumber}`} 
                              onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer, "answer") }/>
                          </div>

                          <div className="stack">
                            <Textarea readOnly={false} placeholder="Введите описание ответа..." heightArea="5"
                              ariaLabel={`Описание варианта ответа ${answerNumber}`} value={answer.description}
                              id={`question${questionNumber}_answer${answerNumber}_description`} name={`question${questionNumber}_answer${answerNumber}_description`}
                              onInput={(event) => enterDataQuestionsAnswers(event, index_question, index_answer, "answerDescription") } />
                          </div>

                          <div className="a-foot">

                            <div className="seg truth">
                              <Radio value="true" id={`true_question${questionNumber}_answer${answerNumber}`}
                                name={`isCorrect_question${questionNumber}_answer${answerNumber}`}>Верно</Radio>
                              <Radio value="false" id={`false_question${questionNumber}_answer${answerNumber}`}
                                name={`isCorrect_question${questionNumber}_answer${answerNumber}`}>Неверно</Radio>
                            </div>

                            {question.answers.length > 1 && (
                              <DeleteButton type="button" className="del" onClick={() => deleteAnswer(index_question, index_answer) }>Удалить</DeleteButton>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="add-answer-wrap">
                    <AddButton type="button" onClick={() => addAnswer(index_question)}>＋ Добавить ответ</AddButton>
                  </div>
                </Panel>
              );
            })}
          </div>

          <AddButton type="button" classname="btn btn-ghost btn-add" onClick={addQuestion}>＋ Добавить вопрос</AddButton>

          <div className="section-title">Результаты</div>

          <div id="results">
            {dataResult.items.map((result, index_result) => {
              const resultNumber = index_result + 1;
              return (
                <Panel key={`result-panel-${index_result}`} classname="panel">

                  <div className="q-head">
                    <span className="q-index">{resultNumber}</span>
                    <h2>Результат</h2>
                    <DeleteButton type="button" className="del" onClick={() => deleteResult(index_result)}>Удалить</DeleteButton>
                  </div>

                  <div className="result-grid">
                    <div className="min-badge">
                      <Input type="number" placeholder="0" ariaLabel="Минимальный балл"
                        id={`result${resultNumber}_min`} name={`result${resultNumber}_min`}
                        onInput={(event) => enterDataResult(event, index_result, "min") } value={result.min} />
                      <small>мин. балл</small>
                    </div>

                    <div className="res-fields">
                      <div className="stack">
                        <Input type="text" placeholder="Введите название результата..." label={`Результат ${resultNumber}`}
                          id={`result${resultNumber}`} name={`result${resultNumber}`} value={result.title}
                          onInput={(event) => enterDataResult(event, index_result, "result") } />
                      </div>

                      <div className="stack">
                        <Textarea readOnly={false} placeholder="Введите описание результата..." heightArea="5"
                          ariaLabel={`Описание результата ${resultNumber}`} id={`result${resultNumber}_description`} value={result.description}
                          name={`result${resultNumber}_description`} onInput={(event) => enterDataResult(event, index_result, "resultDescription") } />
                      </div>

                      <div className="stack">
                        <InputFile label="Картинка к результату" id={`imgResult${resultNumber}`} name={`imgResult${resultNumber}`} />
                      </div>
                    </div>
                  </div>

                </Panel>
              );
            })}
          </div>

          <AddButton type="button" classname="btn btn-ghost btn-add" onClick={addResult}>＋ Добавить результат</AddButton>

        </form>

        <aside className="side">

          <Panel classname="panel meta">
            <div className="stack">
              <Input type="text" placeholder="Введите название..." label="Название теста" id="name" name="name" />
            </div>

            <div className="stack">
              <Input type="text" placeholder="/slug-test" label="Слаг" id="slug" name="slug" />
            </div>

            <PrimaryButton type="submit" form="test-generator-form">Сгенерировать конфиг</PrimaryButton>

            <p className="hint">
              Конфиг собирается вживую по мере заполнения.
              Проверьте, что у каждого вопроса выбран верный ответ.
            </p>
          </Panel>

          <Panel classname="panel">
            <div className="side-head">
              <h3>Конфиг</h3>

              <CopyButton type="button" onClick={ copyConfig }>Скопировать</CopyButton>
            </div>

            <Textarea placeholder="Здесь будет сгенерированный конфиг" ariaLabel="Конфиг" id="config"
              name="config" readOnly={true} value={ dataConfigEmpty ? "" : JSON.stringify(dataConfig, null, 2) } />

          </Panel>

        </aside>

      </div>
    </div>
  )
}

export default App;