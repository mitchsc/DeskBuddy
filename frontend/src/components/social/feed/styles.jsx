import styled from 'styled-components';

const Container = styled.div`
`;

const SocialFeed = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 800px;
`;

const ShareContainer = styled.div`
  width: 100%;
`;

const ShareForm = styled.form``;

const ShareTextArea = styled.textarea`
  font-family: Lato;
  font-style: normal;
  font-weight: 300;
  font-size: 25px;
  line-height: 30px;
  padding: 20px;
  outline: none;
  resize: none;
  width: 95%;
  height: 169px;
  background: #fffcf7;
  border-radius: 10px;
`;

const Btn = styled.input`
  background: #00adef;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 30px;
  border: none;
  font-family: Lato;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  color: #fffcf7;
  width: 122px;
  line-height: 35px;
  cursor: pointer;
  margin: 10px 10px 0px 0px;

  &:active {
    outline: none;
  }

  &:disabled {
    background: grey;
  }
`;


const PostsContainer = styled.div`
  width: 100%;
  margin-top: 80px;
`;

const SinglePostContainer = styled.div`
  margin-bottom: 60px;
  width: 100%;
  height: 350px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  background: #ededed;
`;

const UserContainer = styled.div`
  display: flex;
  align-items: center;

  font-family: Lato;
  font-style: normal;
  font-weight: 500;
  font-size: 25px;
  line-height: 30px;
  color: #1e1e24;
  padding-top: 10px;

  margin-bottom: 10px;
`;

const UserPic = styled.img`
  margin-left: 20px;
  margin-right: 20px;
  width: 67px;
`;

const TextContainer = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: 300;
  font-size: 22px;
  line-height: 30px;
  width: 95%;
  height: 169px;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  ${'' /* background: white; */}
`;

const ButtonContainers = styled.div`
  display: flex;
  margin-top: 10px;
`;

const DatePostedContainer = styled.div`
  font-size: 15px;

`;

const Icon = styled.img`
  width: 35px;
  margin: 15px;
  cursor: pointer;
`;

const PostingPopup = styled.div`
  font-family: Lato;
  font-style: normal;
  font-weight: 300;
  font-size: 20px;
  height: 100px;
  width: 150px;
  background-color: white;
  font-color: black;
  text-align: center;
  vertical-align: middle;
  line-height: 100px;
`;

export {
  Container,
  SocialFeed,
  ShareContainer,
  PostsContainer,
  ShareForm,
  ShareTextArea,
  Btn,
  SinglePostContainer,
  UserContainer,
  UserPic,
  TextContainer,
  ButtonContainers,
  DatePostedContainer,
  Icon,
  PostingPopup
};