import styled from "styled-components/native";
import { useState, useEffect } from "react";
import TermsOfUseBtn from "./SignUp_TermsOfUseBtn";

import CheckBtn_Off from "../../assets/img/signUpScreen/CheckBtn_Off.png";
import CheckBtn_On from "../../assets/img/signUpScreen/CheckBtn_On.png";

const ModalBackdrop = styled.View`
  flex: 1;
  background-color: "rgba(0, 0, 0, 0.7)";
`;

const ModalView = styled.View`
  border-radius: 30px 30px 0px 0px;
  background-color: white;
  align-items: center;
  height: 380px;
  width: 100%;
  position: fixed;
  top: 55%;
`;

const BtnContainer = styled.View`
  margin: 33px 0px 40px 0px;
  width: 320px;
`;

const AllTermsOfUseBtn = styled.Pressable`
  flex-direction: row;
  align-items: center;
  height: 45px;
  border-radius: 10px;
  border: 1px solid #e8e8e8;
  margin-bottom: 30px;
`;

const CheckBtnImg = styled.Image`
  resizemode: cover;
  width: 25px;
  height: 25px;
  margin: 0px 24px 0px 20px;
`;

const BtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: #313131;
`;

const GoToNextBtn = styled.Pressable`
  justify-content: center;
  align-items: center;
  margin-top: 11px;
  width: 100%;
  height: 45px;
  border-radius: 10px;
  background-color: ${(props) => (!props.allApproved ? "#eff4d2" : "#d7ff01")};
`;

const GoToNextBtnText = styled.Text`
  font-size: 16px;
  font-weight: 600;
  color: ${(props) => (props.allApproved ? "#313131" : "#a0a0a0")};
`;

function SignUp_TermsOfUseModal({onHide}) {

  const InitializedTermsOfUseList = [
    { id: "#1", approved: false, text: "(필수) 서비스 이용약관" },
    { id: "#2", approved: false, text: "(필수) 개인정보수집 및 이용 동의" },
    { id: "#3", approved: false, text: "(필수) 개인정보 제 3자 정보제공 동의" },
    { id: "#4", approved: false, text: "(선택) 수신 알림 서비스 동의" },
  ];

  const [termsOfUseList, setTermsOfUseList] = useState(
    InitializedTermsOfUseList
  );
  const [allApproved, setAllApproved] = useState(false);

  const handleSeparateCheck = (approvedId) => {
    const updatedList = termsOfUseList.map((item) =>
      item.id === approvedId ? { ...item, approved: !item.approved } : item
    );

    setTermsOfUseList(updatedList);
  };

  const handleAllCheck = () => {
    const updatedList = termsOfUseList.map((item) => ({
      ...item,
      approved: !allApproved,
    }));
    setTermsOfUseList(updatedList);
  };

  useEffect(() => {
    if (termsOfUseList.every((item) => item.approved)) {
      setAllApproved(true);
    } else {
      setAllApproved(false);
    }
  }, [termsOfUseList]);

  return (
    <ModalBackdrop>
      <ModalView>
        <BtnContainer>
          <AllTermsOfUseBtn onPress={handleAllCheck}>
            <CheckBtnImg source={!allApproved ? CheckBtn_Off : CheckBtn_On} />
            <BtnText>모든 약관에 동의할게요</BtnText>
          </AllTermsOfUseBtn>
          {termsOfUseList.map((item) => (
            <TermsOfUseBtn
              btnText={item.text}
              key={item.id}
              approved={item.approved}
              onCheck={() => handleSeparateCheck(item.id)}
            />
          ))}
          <GoToNextBtn
            allApproved={allApproved}
            onPress={allApproved ? onHide : null}
          >
            <GoToNextBtnText allApproved={allApproved}>
              다음 단계로 넘어갈게요
            </GoToNextBtnText>
          </GoToNextBtn>
        </BtnContainer>
      </ModalView>
    </ModalBackdrop>
  );
}

export default SignUp_TermsOfUseModal;
