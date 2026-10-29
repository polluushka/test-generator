import { use, useEffect, useState } from 'react'

import Panel from './components/Panel';
import Input from './components/Input';
import Textarea from './components/Textarea';
import Radio from './components/Radio';
import InputFile from './components/InputFile';
import Modal from './components/Modal';

import AddButton from './components/AddButton';
import DeleteButton from './components/DeleteButton';
import PrimaryButton from './components/PrimaryButton';
import CopyButton from './components/CopyButton';
import ClearButton from './components/ClearButton';

import templateJSON from './data/template.json'

import { useQuestionsAnswers } from './hooks/useQuestionsAnswers';
import { useResults } from './hooks/useResults';

import { processText, checkTextList, formatEnding } from './utils/typography';
import { saveLocalStorageData, clearLocalStorage } from './utils/storage';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

function App() {

  const {
    dataQuestionsAnswers,
    addQuestion,
    addAnswer,
    enterDataQuestionsAnswers,
    deleteQuestion,
    deleteAnswer,
    changeTypeAnswer,
    addLinkQuestionsAnswers,
    imageDescriptions,
    deleteImageQuestionAnswer,
    deleteQuestionsAnswersData
  } = useQuestionsAnswers();

  const {
    dataResult,
    addResult,
    enterDataResult,
    deleteResult,
    addLinkResult,
    changeTypeResult,
    deleteImageResult,
    deleteResultsData
  } = useResults();

  const [dataConfig, setDataConfig] = useState(templateJSON);
  const [dataConfigEmpty, setDataConfigEmpty] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [selectionValue, setSelectionValue] = useState("");
  const [focusElem, setFocusElem] = useState({ type: "", id: "" });

  function createLink(event) {
    event.preventDefault();

    const form = new FormData(event.target);
    const data = Object.fromEntries(form);

    let text;

    switch (focusElem.type) {
      case "questionTitle":
        text = dataQuestionsAnswers[focusElem.id].question.find(obj => obj.type === "title").text;
        break;
      case "questionDescription":
        text = dataQuestionsAnswers[focusElem.id].question.find(obj => obj.type === "description").text;
        break;
      case "answerTitle":
        text = dataQuestionsAnswers[focusElem.id[0]].answers[focusElem.id[1]].title;
        break;
      case "answerDescription":
        text = dataQuestionsAnswers[focusElem.id[0]].answers[focusElem.id[1]].description;
        break;
      case "resultTitle":
        text = dataResult.items[focusElem.id].title;
        break;
      case "resultDescription":
        text = dataResult.items[focusElem.id].description;
        break;
    }

    const indexSubstr = text.indexOf(selectionValue);
    const textLink = `<a href='${data.link_input}'>` + text.slice(indexSubstr, indexSubstr + selectionValue.length) + "</a>";
    const formattedText = text.slice(0, indexSubstr) + textLink + text.slice(indexSubstr + selectionValue.length);

    if(focusElem.type === "questionTitle" || focusElem.type === "questionDescription"
      || focusElem.type === "answerTitle" || focusElem.type === "answerDescription") addLinkQuestionsAnswers(focusElem, formattedText)
    else addLinkResult(focusElem, formattedText);

    setIsOpen(prev => !prev ? true : false);
  }

  function handleSubmit(event) {
    event.preventDefault();

    setDataConfig(prev => {
        const config = {
          ...prev, 
          steps: dataQuestionsAnswers.map((step, stepIndex) => {
            return {
              ...step,
              answers: step.answers.map((answer, answerIndex) => {
                return {
                    ...answer,
                    title: processText(answer.title),
                    ...("score" in answer && { score: Number(answer.score) }),
                    ...("groupNumber" in answer && { groupNumber: Number(answer.groupNumber) }),
                    ...(imageDescriptions.some(obj => obj.question === stepIndex && obj.answer === answerIndex)
                          ? { description: processText(checkTextList(answer.description)) 
                            + `<img src='${imageDescriptions.find(obj => obj.question === stepIndex && obj.answer === answerIndex).url}' style='max-width: 100%;'>` } 
                          : { description: processText(checkTextList(answer.description)) })
                  }
              }),
              question: (step.question.filter(setting => 
                setting.type === "description" ? (setting.text.length > 0 ? true : false) : true
              )).map(setting => {
                return setting.type === "description" 
                  ? { ...setting, text: processText(checkTextList(setting.text)) } 
                  : (setting.type === "title" ? { ...setting, text: processText(setting.text) } : setting);
              })
            }
          }),
          result: {
            items: dataResult.items.map(item => {
              return {
                ...item, 
                ...("min" in item ? { min: Number(item.min) } : { groupNumber: Number(item.groupNumber) }),
                title: processText(item.title),
                description: processText(checkTextList(item.description))
              }
            }),
            isRetakeEnabled: dataResult.isRetakeEnabled,
            canScrollToFirstError: dataResult.canScrollToFirstError,
            shouldShowScoreCounter: dataResult.shouldShowScoreCounter
          }
        }
        return config
    });

    setDataConfigEmpty(false);
  }

  function copyConfig() {
    navigator.clipboard.writeText(
      dataConfigEmpty ? "" : JSON.stringify(dataConfig, null, 2)
    );
  }

  function deleteAllData() {
    clearLocalStorage();
    deleteQuestionsAnswersData();
    deleteResultsData();
  }

  useEffect(() => {
    const toogleModal = (event) => {
      if (event.altKey && event.code === "KeyL") {
        const selection = event.target.value.slice(event.target.selectionStart, event.target.selectionEnd);
        if (selection.length > 0) {
          setSelectionValue(selection);
          setIsOpen(prev => !prev ? true : false);
        }
      }
    }

    window.addEventListener("keydown", toogleModal);

    return() => {
      window.removeEventListener("keydown", toogleModal);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.getElementById("link_input").focus();
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "unset";
  }, [isOpen]); 
  
  useEffect(() => {
    saveLocalStorageData("questions_answers", JSON.stringify(dataQuestionsAnswers));
    saveLocalStorageData("images_description_answers", JSON.stringify(imageDescriptions));
  }, [dataQuestionsAnswers]); 

  useEffect(() => {
    saveLocalStorageData("results", JSON.stringify(dataResult));
  }, [dataResult]); 

  return (
    <div className="app">
      {
        isOpen &&
        ( <Modal onClick={ () => setIsOpen(false) }>
            <Panel onClick={(e) => e.stopPropagation()}>

              <div className="flex-between">
                <h2>Создание ссылки</h2>
                <button className="empty-btn" onClick={ () => setIsOpen(false) }>
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              </div>

              <form id="create-link-form" onSubmit={ (event) => createLink(event) }>
                <div className="stack">
                  <Input type="text" placeholder="" label="Текст ссылки"
                  id="text_link_input" name="text_link_input" value={ selectionValue } readOnly={ true } />
                </div>

                <div className="stack">
                  <Input type="text" placeholder="Введите ссылку..." label="Ссылка"
                  id="link_input" name="link_input" readOnly={ false } />
                </div>

                <PrimaryButton>Создать</PrimaryButton>
              </form>
            </Panel>
          </Modal> )
      }
      
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
          { formatEnding(dataQuestionsAnswers.length) }
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
                    {
                      dataQuestionsAnswers.length > 1
                        && (<DeleteButton type="button" onClick={() => deleteQuestion(index_question)}>Удалить</DeleteButton>)
                    }
                    
                  </div>

                  <div className="stack">
                    <Input type="text" placeholder="Введите вопрос..." ariaLabel={ `Текст вопроса ${questionNumber}` } readOnly={ false }
                      id={`question${questionNumber}`} name={`question${questionNumber}`} 
                      value={question.question.find(obj => obj.type === "title").text}
                      onInput={ (event) => enterDataQuestionsAnswers(event, index_question, undefined) }
                      onFocus={ () => { setFocusElem({ type: "questionTitle", id: index_question })} } />
                  </div>

                  <div className="stack">
                    <Textarea readOnly={false} placeholder="Введите описание вопроса..." heightArea="5"
                      ariaLabel={`Описание вопроса ${questionNumber}`} id={`question${questionNumber}_description`} 
                      value={ question.question.find(obj => "text" in obj && obj?.type === "description").text }
                      onFocus={ () => {setFocusElem({ type: "questionDescription", id: index_question })} }
                      name={`question${questionNumber}_description`} onInput={(event) => enterDataQuestionsAnswers(event, index_question) } />
                  </div>

                  <div className="stack">
                    <span className="field-label">Картинка к вопросу</span>
                    <div className="flex-between">
                      <InputFile label="Картинка к вопросу" id={`imgQuestion${questionNumber}`} 
                        name={`imgQuestion${questionNumber}`} ariaLabel={`Картинка к вопросу ${questionNumber}`}
                        onInput={ (event) => enterDataQuestionsAnswers(event, index_question, undefined) } 
                        nameImage={question.question.some(obj => "url" in obj) 
                          ? question.question.find(obj => "url" in obj).url.split("/").at(-1) : "Файл не выбран"} />
                      {question.question.some(obj => "url" in obj) && 
                        (<DeleteButton onClick={ () => deleteImageQuestionAnswer(index_question, undefined) }>
                          <FontAwesomeIcon icon={faXmark} /></DeleteButton>)}
                    </div>
                    
                  </div>

                  <div className="type-row">
                    <span className="field-label" style={{ margin: 0 }}>Вид вопроса</span>
                    <div className="seg">
                      <Radio id={`optionButton_q${questionNumber}`} onChange={ (event) => enterDataQuestionsAnswers(event, index_question) }
                        name={`typeQuestion${questionNumber}`} value="optionButton" checked={ question.type === "optionButton" }>Плашки</Radio>

                      <Radio id={`tile_q${questionNumber}`} onChange={ (event) => enterDataQuestionsAnswers(event, index_question) }
                        name={`typeQuestion${questionNumber}`} value="tile" checked={ question.type === "tile" }>Тайлы</Radio>
                    </div>
                  </div>

                  <div className="section-title" style={{ marginBottom: "16px" }}>Варианты ответа</div>

                  <div className="answers">

                    {question.answers.map((answer, index_answer) => {

                      const answerNumber = index_answer + 1;

                      return (
                        <div key={`question-panel-${index_question}-answer-${index_answer}`} className="answer">

                          {
                            question.type === "optionButton"
                            ? <div className="stack">
                                <Input placeholder="Введите вариант ответа..." type="text" label={`Ответ ${answerNumber}`} value={answer.title}
                                  readOnly={ false } id={`q${questionNumber}_a${answerNumber}`} name={`q${questionNumber}_a${answerNumber}`} 
                                  onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) }
                                  onFocus={ () => { setFocusElem({ type: "answerTitle", id: [index_question, index_answer] })} } />
                              </div>
                            : <div className="stack">
                                <div className="flex-between">
                                  <InputFile id={`img_q${questionNumber}_a${answerNumber}`}
                                    name={`img_q${questionNumber}_a${answerNumber}`} ariaLabel={`Тайл ${answerNumber}`}
                                    onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) } 
                                    nameImage={ "backgroundUrl" in answer && answer.backgroundUrl.length > 0 
                                      ? answer.backgroundUrl.split("/").at(-1) : "Файл не выбран" } />
                                  {"backgroundUrl" in answer && answer.backgroundUrl.length > 0 &&
                                    (<DeleteButton onClick={ () => deleteImageQuestionAnswer(index_question, index_answer) }>
                                      <FontAwesomeIcon icon={faXmark} /></DeleteButton>)}
                                </div>
                              </div>
                          }

                          <div className="stack">
                            <Textarea readOnly={false} placeholder="Введите описание ответа..." heightArea="5"
                              ariaLabel={`Описание варианта ответа ${answerNumber}`} value={answer.description}
                              id={`q${questionNumber}_a${answerNumber}_description`} name={`q${questionNumber}_a${answerNumber}_description`}
                              onFocus={ () => { setFocusElem({ type: "answerDescription", id: [index_question, index_answer] })} 
                              }
                              onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) } />
                          </div>

                          {
                            question.type !== "tile" &&
                              (<div className="stack">
                                  <div className="flex-between">
                                    <InputFile id={`img_q${questionNumber}_a${answerNumber}_description`}
                                      name={`img_q${questionNumber}_a${answerNumber}_description`} ariaLabel={`Картинка-пояснение ${answerNumber}`}
                                      onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) } 
                                      nameImage={ imageDescriptions.some(obj => obj.question === index_question && obj.answer === index_answer) 
                                        ? imageDescriptions.find(obj => obj.question === index_question && obj.answer === index_answer).url.split("/").at(-1) 
                                        : "Файл не выбран" } />
                                    {imageDescriptions.some(obj => obj.question === index_question && obj.answer === index_answer) &&
                                      (<DeleteButton onClick={ () => deleteImageQuestionAnswer(index_question, index_answer) }>
                                        <FontAwesomeIcon icon={faXmark} /></DeleteButton>)}
                                  </div>
                                  
                              </div>)
                          }

                          {
                            "score" in answer && 
                              (<div className="stack">
                                <div className="min-badge">
                                  <Input type="number" placeholder="0" ariaLabel="Балл" readOnly={ false }
                                    id={`score_q${questionNumber}_a${answerNumber}`} name={`score_q${questionNumber}_a${answerNumber}`}
                                    onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) } value={answer.score} />
                                    <small>балл</small>
                                  </div>
                              </div>)
                          }

                          {
                            "groupNumber" in answer &&
                              (<div className="stack">
                                <div className="min-badge">
                                  <Input type="number" placeholder="1" ariaLabel="Категория" readOnly={ false }
                                    id={`groupNumber_q${questionNumber}_a${answerNumber}`} name={`groupNumber_q${questionNumber}_a${answerNumber}`}
                                    onInput={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) } value={answer.groupNumber} />
                                    <small>категория</small>
                                  </div>
                              </div>)
                          }

                          <div className="a-foot">
                            
                            {
                              "isCorrect" in answer &&
                              ( <div className="seg truth">
                                  <Radio value="true" id={`true_q${questionNumber}_a${answerNumber}`}
                                    name={`isCorrect_q${questionNumber}_a${answerNumber}`} checked={ answer.isCorrect }
                                    onChange={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) }>Верно</Radio>

                                  <Radio value="false" id={`false_q${questionNumber}_a${answerNumber}`}
                                    name={`isCorrect_q${questionNumber}_a${answerNumber}`} checked={ !answer.isCorrect } 
                                    onChange={ (event) => enterDataQuestionsAnswers(event, index_question, index_answer) }>Неверно</Radio>
                                </div> )
                            }

                            { question.answers.length > 1 && 
                              (<DeleteButton type="button" className="del" onClick={() => deleteAnswer(index_question, index_answer) }>Удалить</DeleteButton>)
                            }
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
                    {
                      dataResult.items.length > 1 && 
                        (<DeleteButton type="button" className="del" onClick={() => deleteResult(index_result)}>Удалить</DeleteButton>)
                    }
                  </div>

                  <div className="result-grid">
                    {
                      "groupNumber" in result ?
                        <div className="min-badge">
                          <Input type="number" placeholder="1" ariaLabel={`Категория ${resultNumber}`} readOnly={ false }
                            id={`result${resultNumber}_groupNumber`} name={`result${resultNumber}_groupNumber`}
                            onInput={(event) => enterDataResult(event, index_result) } value={result.groupNumber} />
                          <small>категория</small>
                        </div> 
                        : <div className="min-badge">
                            <Input type="number" placeholder="0" ariaLabel={`Минимальный балл ${resultNumber}`} readOnly={ false }
                              id={`result${resultNumber}_min`} name={`result${resultNumber}_min`}
                              onInput={(event) => enterDataResult(event, index_result) } value={result.min} />
                            <small>мин. балл</small>
                          </div>
                    }
                    
                    <div className="res-fields">
                      <div className="stack">
                        <Input type="text" placeholder="Введите название результата..." ariaLabel={`Результат ${resultNumber}`}
                          id={`result${resultNumber}`} name={`result${resultNumber}`} value={result.title} readOnly={ false }
                          onInput={(event) => enterDataResult(event, index_result) }
                          onFocus={ () => { setFocusElem({ type: "resultTitle", id: index_result })} } />
                      </div>

                      <div className="stack">
                        <Textarea readOnly={false} placeholder="Введите описание результата..." heightArea="5"
                          ariaLabel={`Описание результата ${resultNumber}`} id={`result${resultNumber}_description`} value={result.description}
                          onFocus={ () => {setFocusElem({ type: "resultDescription", id: index_result })} }
                          name={`result${resultNumber}_description`} onInput={(event) => enterDataResult(event, index_result) } />
                      </div>

                      <div className="stack">
                        <div className="flex-between">
                          <InputFile label="Картинка к результату" id={`imgResult${resultNumber}`} name={`imgResult${resultNumber}`}
                            ariaLabel={`Картинка к результату ${resultNumber}`} onInput={ (event) => enterDataResult(event, index_result) } 
                            nameImage={ "imageUrl" in result && result.imageUrl.length > 0 ? result.imageUrl.split("/").at(-1) : "Файл не выбран" } />        
                          {"imageUrl" in result && result.imageUrl.length > 0 &&
                            (<DeleteButton onClick={ () => deleteImageResult(index_result) }><FontAwesomeIcon icon={faXmark} /></DeleteButton>)}  
                        </div>
                        
                        
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

          <Panel classname="panel">

            <div className="type-row">
              <span className="field-label" style={{ margin: 0 }}>Тип теста</span>
              <div className="seg">
                <Radio id="quiz" onChange={ (event) => {
                  changeTypeAnswer(event.target.value);
                  changeTypeResult(event.target.value)}}
                  name="typeTest" value="quiz" checked={ "isCorrect" in dataQuestionsAnswers[0].answers[0] }>Квиз</Radio>

                <Radio id="strategy" onChange={ (event) => {
                  changeTypeAnswer(event.target.value);
                  changeTypeResult(event.target.value)}}
                  name="typeTest" value="strategy" checked={ "score" in dataQuestionsAnswers[0].answers[0] }>Стратегия</Radio>

                <Radio id="category" onChange={ (event) => {
                  changeTypeAnswer(event.target.value);
                  changeTypeResult(event.target.value)}}
                  name="typeTest" value="category" checked={ "groupNumber" in dataQuestionsAnswers[0].answers[0] }>Категории</Radio>
              </div>
            </div>
            
            <PrimaryButton type="submit" form="test-generator-form">Сгенерировать конфиг</PrimaryButton>
            <ClearButton onClick={ () => deleteAllData() }>Стереть все</ClearButton>

          </Panel>

          <Panel classname="panel">
            <div className="side-head">
              <h3>Конфиг</h3>

              <CopyButton type="button" onClick={ copyConfig }>Скопировать</CopyButton>
            </div>

            <Textarea placeholder="Здесь будет сгенерированный конфиг" ariaLabel="Конфиг" id="config"
              name="config" readOnly={true} value={ dataConfigEmpty ? "" : JSON.stringify(dataConfig, null, 2) } />

          </Panel>
          <Panel>
              <p style={{ margin: 0 }}>
                <span style={{ color: "var(--text-dim)" }}>разработка:</span> Полина Катикова</p>
              <p style={{ margin: 0 }}>
                <span style={{ color: "var(--text-dim)" }}>telegram:</span> <a href="https://t.me/polluushka">@polluushka</a></p>
          </Panel>
        </aside>
      </div>
    </div>
  )
}

export default App;