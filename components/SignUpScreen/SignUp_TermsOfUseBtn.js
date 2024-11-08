import { Pressable } from "react-native";
import styled from "styled-components/native";
import CheckBtn_Off from '../../assets/img/signUpScreen/CheckBtn_Off.png'
import CheckBtn_On from "../../assets/img/signUpScreen/CheckBtn_On.png";
import ArrowBtn from "../../assets/img/signUpScreen/ArrowBtn.png";

const TermsOfUseBtnContainer = styled.Pressable`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 19px;
`;

const LeftView = styled.View`
  flex: 1;
  flex-direction: row;
  align-items: center;
  gap: 20px;
`;

const CheckBtnImg = styled.Image`
  resizemode: cover;
  width: 25px;
  height: 25px;
`;

const BtnText = styled.Text`
  font-size: 14px;
`;

const GoToDetailImg = styled.Image`
  resizemode: cover;
  width: 5px;
  height: 10px;
`;

function TermsOfUseBtn({ btnText, approved, onCheck }) {
  return (
    <TermsOfUseBtnContainer>
      <LeftView>
        <Pressable onPress={onCheck}>
          <CheckBtnImg source={!approved ? CheckBtn_Off : CheckBtn_On} />
        </Pressable>
        <BtnText>{btnText}</BtnText>
      </LeftView>
      <GoToDetailImg source={ArrowBtn} />
    </TermsOfUseBtnContainer>
  );
}

export default TermsOfUseBtn;
