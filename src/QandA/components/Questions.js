import React, { useState, useEffect, useContext } from 'react';
import { StateContext, DispatchContext } from '../../appState/index.js';
import styled from 'styled-components';
import AnswerForm from './forms/AnswerForm';
import moment from 'moment';
import api from '../../api/index';
import HelpfulModal from './modals/HelpfulModal';
import SuccessModal from './modals/SuccessModal';
import ErrorModal from './modals/ErrorModal';
let newText;
export default function Questions(props) {
  const [state] = useContext(StateContext);
  const [, dispatch] = useContext(DispatchContext);
  const [answerForm, setAnswerForm] = useState(false);
  const [submitHelpfulQuestionOnce, setsubmitHelpfulQuestionOnce] = useState(true);
  const [showHelpfulModal, setShowHelpfulModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  useEffect(() => {
    setAnswerForm(false);
  }, [state.QA]);

  const answerFormHandler = () => {
    setAnswerForm(!answerForm);
  };

  const showAnswerForm = () => {
    setAnswerForm(false);
    setShowSuccess(true);
  };

  const backDropHandler = () => {
    setAnswerForm(false);
  };

  const backDropHelpfulHandler = () => {
    setShowHelpfulModal(false);
  };

  const backDropSuccessHandler = () => {
    setShowSuccess(false);
  };

  const backDropErrorHandler = () => {
    setShowErrorModal(false);
  };

  const helpfulQuestionHandler = (id) => {
    setsubmitHelpfulQuestionOnce(false);
    if (submitHelpfulQuestionOnce) {
      setShowHelpfulModal(true);
      api.post.question
        .helpful(id, state.currentProduct)
        .then(() => {
          return api.get.allProductData(state.currentProduct);
        })
        .then((getRes) =>
          dispatch({
            type: 'PROD_INIT',
            payload: getRes,
          })
        )
        .catch((err) => console.log('helpful question not sent!'));
    } else {
      setShowErrorModal(true);
    }
  };

  const reportQuestionHandler = (id) => {
    api.post.question
      .report(id, state.currentProduct)
      .then(() => {
        return api.get.allProductData(state.currentProduct);
      })
      .then((getRes) =>
        dispatch({
          type: 'PROD_INIT',
          payload: getRes,
        })
      )
      .catch((err) => console.log('report question not sent!'));
  };

  const highlight = (sentence, keyword) => {
    let sentenceSplit = sentence.split(new RegExp(`(${keyword})`, 'gi'));
    return (
      <>
        <QuestionBody>Q: </QuestionBody>
        {sentenceSplit.map((word, i) => (
          <QuestionBody
            key={i}
            style={
              word.toLowerCase() === keyword.toLowerCase() ? { backgroundColor: 'yellow' } : {}
            }>
            {word}
          </QuestionBody>
        ))}
      </>
    );
  };

  return (
    <QuestionsContainer data-testid='question'>
      <QuestionBodyWrapper>
        {!props.highlight ? (
          <QuestionBody> Q: {props.q.question_body}</QuestionBody>
        ) : (
          highlight(props.q.question_body, props.highlight)
        )}
      </QuestionBodyWrapper>
      <HelpfulReportContainer>
        Helpful Question?{' '}
        <HelpfulLink
          helpful={!submitHelpfulQuestionOnce}
          onClick={() => helpfulQuestionHandler(props.q.question_id)}>
          Yes
        </HelpfulLink>{' '}
        ({props.q.question_helpfulness}) |{'  '}
        <ReportedLink onClick={() => reportQuestionHandler(props.q.question_id)}>
          Report
        </ReportedLink>
        <AddAnswerLink onClick={answerFormHandler}>Add Answer</AddAnswerLink>
      </HelpfulReportContainer>
      <QuestionsAuthor>
        By: {props.q.asker_name} | {moment(props.q.question_date).format('MMMM Do, YYYY')}
      </QuestionsAuthor>
      {answerForm && (
        <BackDrop onClick={backDropHandler}>
          <AnswerForm id={props.q.question_id} showForm={showAnswerForm} />
        </BackDrop>
      )}
      {showHelpfulModal && (
        <BackDrop onClick={backDropHelpfulHandler}>
          <HelpfulModal />
        </BackDrop>
      )}
      {showSuccess && (
        <BackDrop onClick={backDropSuccessHandler}>
          <SuccessModal />
        </BackDrop>
      )}
      {showErrorModal && (
        <BackDrop onClick={backDropErrorHandler}>
          <ErrorModal />
        </BackDrop>
      )}
    </QuestionsContainer>
  );
}

const ReportedLink = styled.span`
  text-decoration: underline;
  margin-right: 10px;
  cursor: pointer;
  padding-left: 1.5px;
`;

const HelpfulLink = styled.span`
  text-decoration: underline;
  cursor: pointer;
`;

const AddAnswerLink = styled.div`
  margin-bottom: 10px;
  width: 90px;
  display: block;
  margin-top: 10px;
  text-decoration: underline;
  cursor: pointer;
`;

const QuestionBodyWrapper = styled.div`
  width: 65%;
`;

const QuestionsContainer = styled.div`
  margin-top: 25px;
`;

const QuestionsAuthor = styled.p`
  margin-top: 5px;
`;

const QuestionBody = styled.h3`
  display: inline;
`;

const HelpfulReportContainer = styled.div`
  display: inline;
  float: right;
  vertical-align: top;
`;

const BackDrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 2;
  background: rgba(0, 0, 0, 0.75);
`;
